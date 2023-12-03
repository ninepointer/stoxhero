const InternTrades = require("../models/mock-trade/internshipTrade");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const InternBatch = require("../models/Careers/internBatch");
const {client, getValue} = require('../marketData/redisClient');
const Careers = require("../models/Careers/careerSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const TradingHoliday = require('../models/TradingHolidays/tradingHolidays');
const uuid = require('uuid');
const Holiday = require("../models/TradingHolidays/tradingHolidays");
const moment = require('moment');
const { ObjectId } = require("mongodb");
const sendMail = require('../utils/emailService');
const {sendMultiNotifications} = require('../utils/fcmService');
const {createUserNotification} = require('./notification/notificationController');
const mongoose = require('mongoose');
const Setting = require("../models/settings/setting")
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema")

exports.overallPnl = async (req, res, next) => {
  let isRedisConnected = getValue();
    const userId = req.user._id;
    const batch = req.params.batch;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    tempTodayDate = tempTodayDate + "T23:59:59.999Z";
    const tempDate = new Date(tempTodayDate);
    const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

    // console.log(today, batch)

    try{

      if(isRedisConnected && await client.exists(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`)){
        let pnl = await client.get(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`)
        pnl = JSON.parse(pnl);
        // console.log("pnl redis", pnl)
        
        res.status(201).json({message: "pnl received", data: pnl});

      } else{

        let pnlDetails = await InternTrades.aggregate([
          {
              $match: {
                  trade_time:{
                      $gte: today
                  },
                  status: "COMPLETE",
                  trader: new ObjectId(userId),
                  batch: new ObjectId(batch) 
              },
          },
          {
            $sort: {
              trade_time: 1,
            },
          },
          {
            $group: {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange",
                validity: "$validity",
                variety: "$variety",
              },
              amount: {
                $sum: {$multiply : ["$amount",-1]},
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
              lastaverageprice: {
                $last: "$average_price",
              },
              margin: {
                $last: "$margin",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])

        const limitMargin = await PendingOrder.aggregate([
          {
            $match: {
              createdBy: new ObjectId(
                userId
              ),
              type: "Limit",
              status: "Pending",
              createdOn: {
                $gte: today,
              },
              product_type: new ObjectId("6517d46e3aeb2bb27d650de3")
            },
          },
          {
            $sort: {
              createdOn: 1,
            },
          },
          {
            $group:
            {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange",
                validity: "$validity",
                variety: "$variety",
                // order_type: "$order_type"
              },
              amount: {
                $sum: { $multiply: ["$amount", -1] },
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
              margin: {
                $last: "$margin",
              },
            }
          }
        ])
  
        const arr = [];
        for(let elem of limitMargin){
          arr.push({
            _id: {
              symbol: elem._id.symbol,
              product: elem._id.product,
              instrumentToken: elem._id.instrumentToken,
              exchangeInstrumentToken: elem._id.exchangeInstrumentToken,
              exchange: elem._id.exchange,
              validity: elem._id.validity,
              variety: elem._id.variety,
              isLimit: true
            },
            // amount: (tenxDoc.amount * -1),
            // brokerage: Number(tenxDoc.brokerage),
            lots: Number(elem.lots),
            // lastaverageprice: tenxDoc.average_price,
            margin: elem.margin
          });
        }
  
        const newPnl = pnlDetails.concat(arr);
  
        // console.log("pnlDetails in else", pnlDetails)
        if(isRedisConnected){
          await client.set(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(newPnl))
          await client.expire(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);  
        }

        res.status(201).json({message: "pnl received", data: newPnl});
      }

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }


}

exports.myTodaysTrade = async (req, res, next) => {
  
  // const id = req.params.id
//   const batch = req.params.id;
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InternTrades.countDocuments({trader: userId, trade_time: {$gte:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InternTrades.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1, 'batch': 1}).populate('batch', 'batchName')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.myWorkshopOrder = async (req, res, next) => {
  
  const {batchId} = req.params;
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InternTrades.countDocuments({trader: new ObjectId(userId), batch: new ObjectId(batchId), trade_time: {$gte:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InternTrades.find({trader: new ObjectId(userId), batch: new ObjectId(batchId), trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1, 'batch': 1}).populate('batch', 'batchName')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.myHistoryTrade = async (req, res, next) => {
  
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InternTrades.countDocuments({trader: userId, trade_time: {$lt:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await InternTrades.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1, 'batch': 1}).populate('batch', 'batchName')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.marginDetail = async (req, res, next) => {
  let isRedisConnected = getValue();
  let {batch} = req.params;
  // console.log("Batch:",batch)
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);




  try {

    if (isRedisConnected && await client.exists(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`)) {
      let marginDetail = await client.get(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`)
      marginDetail = JSON.parse(marginDetail);

      res.status(201).json({ message: "pnl received", data: marginDetail });

    } else {

      const subscription = await InternBatch.aggregate([
        {
          $match: {
            _id: new ObjectId(batch),
          },
        },
        {
          $lookup: {
            from: "user-portfolios",
            localField: "portfolio",
            foreignField: "_id",
            as: "portfolioData",
          },
        },
        {
          $lookup: {
            from: "intern-trades",
            localField: "_id",
            foreignField: "batch",
            as: "trades",
          },
        },
        {
          $unwind:
          {
            path: "$trades",
            includeArrayIndex: "string",
          },
        },
        {
          $match: {
            "trades.trade_time": { $lt: today },
            "trades.status": "COMPLETE",
            "trades.trader": new ObjectId(req.user._id)
          },
        },
        {
          $group:

          {
            _id: {
              batch: "$_id",
              totalFund: {
                $arrayElemAt: [
                  "$portfolioData.portfolioValue",
                  0,
                ],
              },
            },
            totalAmount: {
              $sum: {
                $multiply: ["$trades.amount", -1],
              }
            },
            totalBrokerage: {
              $sum: "$trades.brokerage",
            },
          },
        },
        {
          $project:

          {
            _id: 0,
            batch: "$_id.batch",
            totalFund: "$_id.totalFund",
            npnl: {
              $subtract: [
                "$totalAmount",
                "$totalBrokerage",
              ],
            },
            openingBalance: {
              $sum: [
                "$_id.totalFund",
                { $subtract: ["$totalAmount", "$totalBrokerage"] }
              ]
            }
          },
        },
      ])

      if (subscription.length > 0) {
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`, JSON.stringify(subscription[0]))
          await client.expire(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`, secondsRemaining);
        }
        res.status(200).json({ status: 'success', data: subscription[0] });
      } else {
        const portfolioValue = await InternBatch.aggregate([
          {
            $match: {
              _id: new ObjectId(batch),
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "portfolio",
              foreignField: "_id",
              as: "portfolioData",
            },
          },
          {
            $group: {
              _id: {
                batch: "$_id",
                totalFund: {
                  $arrayElemAt: [
                    "$portfolioData.portfolioValue",
                    0,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              batch: "$_id.batch",
              totalFund: "$_id.totalFund",
            },
          },
        ])
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`, JSON.stringify(portfolioValue[0]))
          await client.expire(`${req.user._id.toString()}${batch.toString()} openingBalanceAndMarginInternship`, secondsRemaining);
        }
        res.status(200).json({ status: 'success', data: portfolioValue[0] });
      }

    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }

}

exports.tradingDays = async(req, res, next)=>{
    // let batch = req.params.id;
    let userId = req.user._id;
    // "63788f3991fc4bf629de6df0"
    // req.user._id;

    const tradingDays = await InternTrades.aggregate([
        {
          $match: {
            trader: new ObjectId(userId),
            status: "COMPLETE",
          },
        },
        {
          $lookup: {
            from: "tenx-subscriptions",
            localField: "batch",
            foreignField: "_id",
            as: "subscriptionData",
          },
        },
        {
          $group: {
            _id: {
              batch: "$batch",
              validity: "$subscriptionData.validity",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$trade_time",
                },
              },
            },
          },
        },
        {
          $group: {
            _id: {
              id: "$_id.batch",
              validity: {
                $arrayElemAt: ["$_id.validity", 0],
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            batch: "$_id.id",
            totalTradingDays: "$count",
            remainingDays: {
              $subtract: ["$_id.validity", "$count"],
            },
          },
        },
      ])
      res.status(200).json({status: 'success', data: tradingDays});
    // res.send(tradingDays);
}

exports.autoExpireInternBatch = async()=>{
    // console.log("autoExpireInternBatch running");
    const subscription = await InternBatch.find({status:"Active"});

    for(let i = 0; i < subscription.length; i++){
        let users = subscription[i].users;
        for(let j = 0; j < users.length; j++){
            let userId = users[j].userId;
            const tradingDays = await InternTrades.aggregate([
                {
                  $match: {
                    trader: new ObjectId(userId),
                    batch: new ObjectId(subscription[i]._id),
                    status: "COMPLETE",
                  },
                },
                {
                  $group: {
                    _id: {
                      date: {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$trade_time",
                        },
                      },
                    },
                  },
                },
                {
                  $group: {
                    _id: {
                        id: new ObjectId(userId)
                    },
                    count: {
                      $sum: 1,
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    // batch: "$_id.id",
                    totalTradingDays: "$count",
                    // remainingDays: {
                    //   $subtract: ["$_id.validity", "$count"],
                    // },
                  },
                },
            ])

            // console.log("tradingDays", tradingDays, userId)

            if(tradingDays.length && tradingDays[0].totalTradingDays === 0){
                const updateUser = await User.findOneAndUpdate(
                    { _id: new ObjectId(userId), "subscription.batch": new ObjectId(subscription[i]._id)},
                    {
                      $set: {
                        'subscription.$.status': "Expired"
                      }
                    },
                    { new: true }
                );
        
                const updateInternBatch = await InternBatch.findOneAndUpdate(
                    { _id: new ObjectId(subscription[i]._id), "users.userId": new ObjectId(userId)},
                    {
                        $set: {
                          'users.$.status': "Expired"
                        }
                      },
                    { new: true }
                );
            }
        }
    }
}


exports.overallPnlAllTrader = async (req, res, next) => {
  const {batchId} = req.params;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(today);

  const pipeline = [
    {
      $match: {
        trade_time: {
          $gte: today
        },
        batch: new ObjectId(batchId),
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          symbol: "$symbol",
          product: "$Product",
          instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        lastaverageprice: {
          $last: "$average_price",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]

  let x = await InternTrades.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.traderWiseMockTrader = async (req, res, next) => {
  const{batchId} = req.params;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const pipeline = [
    {
      $match:
      {
        trade_time: {
          $gte: today
        },
        status: "COMPLETE",
        batch: new ObjectId(batchId)
      }
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $group:
      {
        _id:
        {
          "traderId": "$trader",
          "traderName": {
            $arrayElemAt: ["$user.name", 0]
          },
                    "symbol": "$instrumentToken",
          "exchangeInstrumentToken": "$exchangeInstrumentToken",
          "traderEmail": {
            $arrayElemAt: ["$user.email", 0]
          },
          "traderMobile": {
            $arrayElemAt: ["$user.mobile", 0]
          }
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] }
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" }
        },
        lots: {
          $sum: { $toInt: "$Quantity" }
        },
        trades: {
          $count: {}
        },
        lotUsed: {
          $sum: { $abs: { $toInt: "$Quantity" } }
        }
      }
    },
    { $sort: { _id: -1 } },

  ]

  let x = await InternTrades.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallInternshipPnl = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InternTrades.aggregate([
      {
        $match: {
          trade_time: {
            $gte: today
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE",
        },
      },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchangeInstrumentToken: "$exchangeInstrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            turnover: {
              $sum: {
                $toInt: { $abs : "$amount"},
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            totallots: {
              $sum: {
                $toInt: { $abs : "$Quantity"},
              },
            },
            trades: {
              $count:{}
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.liveTotalTradersCount = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InternTrades.aggregate([
      {
        $match: {
          trade_time: {
            $gte: today
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE"
        }
      },
      {
        $group: {
          _id: {
            trader: "$trader"
          },
          runninglots: {
            $sum: "$Quantity"
          }
        }
      },
      {
        $group: {
          _id: null,
          zeroLotsTraderCount: {
            $sum: {
              $cond: [{ $eq: ["$runninglots", 0] }, 1, 0]
            }
          },
          nonZeroLotsTraderCount: {
            $sum: {
              $cond: [{ $ne: ["$runninglots", 0] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          zeroLotsTraderCount: 1,
          nonZeroLotsTraderCount: 1
        }
      }
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.overallInternshipPnlYesterday = async (req, res, next) => {
  let date;
  let i = 1;
  let maxDaysBack = 30;  // define a maximum limit to avoid infinite loop
  let pnlDetailsData;

  while (!pnlDetailsData && i <= maxDaysBack) {
    let day = new Date();
    day.setDate(day.getDate() - i);
    let startTime = new Date(day.setHours(0, 0, 0, 0));
    let endTime = new Date(day.setHours(23, 59, 59, 999));
    date = startTime;
    
    pnlDetailsData = await InternTrades.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime,
            $lte: endTime
          },
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: { $multiply: ["$amount", -1] },
          },
          turnover: {
            $sum: { $toInt: { $abs: "$amount" } },
          },
          brokerage: {
            $sum: { $toDouble: "$brokerage" },
          },
          lots: {
            $sum: { $toInt: "$Quantity" },
          },
          totallots: {
            $sum: { $toInt: { $abs: "$Quantity" } },
          },
          trades: {
            $count: {}
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    if (!pnlDetailsData || pnlDetailsData.length === 0) {
      pnlDetailsData = null;  // reset the value to ensure the while loop continues
      i++;  // increment the day counter
    }
  }

  res.status(201).json({
    message: "pnl received", 
    data: pnlDetailsData, 
    results: pnlDetailsData ? pnlDetailsData.length : 0, 
    date: date
  });
}

exports.liveTotalTradersCountYesterday = async (req, res, next) => {
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    // console.log(yesterdayDate)
    let yesterdayStartTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayStartTime = yesterdayStartTime + "T00:00:00.000Z";
    let yesterdayEndTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
    const startTime = new Date(yesterdayStartTime); 
    const endTime = new Date(yesterdayEndTime); 
    // console.log("Query Timing: ", startTime, endTime)  
    let pnlDetails = await InternTrades.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime, $lte: endTime
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE"
        }
      },
      {
        $group: {
          _id: {
            trader: "$trader"
          },
          runninglots: {
            $sum: "$Quantity"
          }
        }
      },
      {
        $group: {
          _id: null,
          zeroLotsTraderCount: {
            $sum: {
              $cond: [{ $eq: ["$runninglots", 0] }, 1, 0]
            }
          },
          nonZeroLotsTraderCount: {
            $sum: {
              $cond: [{ $ne: ["$runninglots", 0] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          zeroLotsTraderCount: 1,
          nonZeroLotsTraderCount: 1
        }
      }
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.myOverallInternshipPnl = async (req, res, next) => {
  const {batchId} = req.params;
  const userId = req.user._id;
  let date = new Date();
  date.setDate(date.getDate()-1)
  // console.log("Intern PNL Date: ",date)
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.000Z";
  const today = new Date(todayDate);
  // console.log(today)
  try{
    const pipeline = [
      {
        $match: {
          trade_time: {$lte : today},
          batch: new ObjectId(batchId),
          trader: new ObjectId(userId),
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: { $multiply: ["$amount", -1] },
          },
          brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]
  
    let x = await InternTrades.aggregate(pipeline)
    res.status(201).json({ message: "data received", data: x });
  }catch(e){
    console.log(e);
  }
}

exports.myInternshipTradingDays = async (req, res, next) => {
  const {batchId} = req.params;
  const userId = req.user._id;
  // console.log("Batch Id & User ID: ",batchId,userId)
  // let date = new Date();
  // date.setDate(new Date(date) - 1)
  // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  // todayDate = todayDate + "T23:59:59.000Z";
  // const today = new Date(todayDate);
  try{
    const pipeline = 
    [
      {
        $match: {
          batch: new ObjectId(batchId),
          trader: new ObjectId(userId),
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
          },
          count: {
            $count: {},
          },
        },
      },
    ]
  
    let x = await InternTrades.aggregate(pipeline)
    res.status(201).json({ message: "data received", data: x });
  }catch(e){
    console.log(e);
  }
}

exports.internshipPnlReport = async (req, res, next) => {

  let { batch } = req.params

  // startDate = startDate + "T00:00:00.000Z";
  // endDate = endDate + "T23:59:59.000Z";


  let pipeline = [
    {
      $match: {
        // trade_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        batch: new ObjectId(batch)
      }
    },
    {
      $lookup: {
        from: "intern-batches",
        localField: "batch",
        foreignField: "_id",
        as: "batch",
      },
    },
      {
        $group:
        {
          _id: {
            "date": { $substr: ["$trade_time", 0, 10] },
          },
          gpnl: {
            $sum: { $multiply: ["$amount", -1] }
          },
          brokerage: {
            $sum: { $toDouble: "$brokerage" }
          },
          noOfTrade: {
            $count: {}
          },
        }
      },
      {
        $addFields:
        {
          npnl: { $subtract: ["$gpnl", "$brokerage"] },
          dayOfWeek: { $dayOfWeek: { $toDate: "$_id.date" } }
        }
      },
      {
        $sort:
          { _id: 1 }
      }
  ]

  let x = await InternTrades.aggregate(pipeline)
// console.log(x, startDate, endDate, batch)
  res.status(201).json({ message: "data received", data: x });
}

const getHoliday = async (startDate, enddate)=>{
  let endDate = new Date(enddate)
  let endDateDateComponent = endDate.toISOString().split('T')[0];

  const fullEndDate = new Date(`${endDateDateComponent}T23:59:59.000Z`);

  // console.log(startDate, fullEndDate, enddate)
  const holiday = await Holiday.find({
    holidayDate: {
      $gte: new Date(startDate),
      $lte: fullEndDate
    },
    $expr: {
      $and: [
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
      ]
    }
  });

  console.log(holiday)
  return holiday;
}

exports.internshipDailyPnlTWise = async (req, res, next) => {

  let { batch } = req.params

  const internship = await InternBatch.findOne({_id: new ObjectId(batch)})
  .select('batchStatus batchStartDate batchEndDate attendancePercentage referralCount payoutPercentage')

  const userData = await User.find()
  .populate('referrals.referredUserId', 'joining_date')
  .select("referrals")

  const batchEndDate = moment(internship.batchEndDate);
  const currentDate = moment();
  const endDate = batchEndDate.isBefore(currentDate) ? batchEndDate.format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD");
  const endDate1 = batchEndDate.isBefore(currentDate) ? batchEndDate.clone().set({ hour: 19, minute: 0, second: 0, millisecond: 0 }) : currentDate.clone().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });


  const holiday = await getHoliday(internship.batchStartDate, endDate)
  let traderWisePnlInfo = [];
  if (internship.batchStatus === "Completed") {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(batch),
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          name: {
            $concat: [
              {
                $arrayElemAt: ["$user.first_name", 0],
              },
              " ",
              {
                $arrayElemAt: ["$user.last_name", 0],
              },
            ],
          },
          gpnl: "$participants.gpnl",
          npnl: "$participants.npnl",
          noOfTrade: "$participants.noOfTrade",
          referralCount: "$participants.referral",
          attendancePercentage:
            "$participants.attendance",
          payout: "$participants.payout",
          tradingDays: "$participants.tradingdays",
          brokerage: {
            $abs: {
              $subtract: [
                "$participants.npnl",
                "$participants.gpnl",
              ],
            },
          },
          userId: "$participants.user",
          _id: 0,
        },
      },
      {
        $match: {
          tradingDays: {
            $gt: 0,
          },
        },
      },
      {
        $sort: {
          payout: -1,
          npnl: -1, // Add more fields if needed
        },
      },

    ]
    traderWisePnlInfo = await InternBatch.aggregate(pipeline)

  } else {
    const pipeline = [
      {
        $match: {
          status: "COMPLETE",
          batch: new ObjectId(batch),
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },

      // {
      //   $lookup: {
      //     from: "intern-batches",
      //     localField: "batch",
      //     foreignField: "_id",
      //     as: "batch",
      //   },
      // },
      {
        $group: {
          _id: {
            userId: "$trader",
            name: {
              $concat: [
                {
                  $arrayElemAt: [
                    "$user.first_name",
                    0,
                  ],
                },
                " ",
                {
                  $arrayElemAt: [
                    "$user.last_name",
                    0,
                  ],
                },
              ],
            },
          },
          gpnl: {
            $sum: {
              $multiply: ["$amount", -1],
            },
          },
          brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          trades: {
            $count: {},
          },
          tradingDays: {
            $addToSet: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$trade_time",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          name: "$_id.name",
          tradingDays: {
            $size: "$tradingDays",
          },
          gpnl: 1,
          brokerage: 1,
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          noOfTrade: "$trades",
          // batchStartDate: "$_id.batchStartDate",
          // batchEndDate: "$_id.batchEndDate",
          // payoutPercentage: "$_id.payoutPercentage",
          // attendancePercentage: "$_id.attendancePercentage",
          // referralCount: "$_id.referralCount",
        },
      },
      {
        $sort: {
          npnl: -1,
        },
      },
    ]

    const data = await InternTrades.aggregate(pipeline)

    data?.map((elem)=>{
      const attendanceLimit = internship.attendancePercentage;
      const referralLimit = internship.referralCount;
      const payoutPercentage = internship.payoutPercentage;
      const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
      const reliefReferralLimit = referralLimit - referralLimit * 10 / 100

      // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
      const referral = userData?.filter((subelem) => {
        return subelem?._id?.toString() == elem?.userId?.toString();
      })

      const attendance = (elem?.tradingDays * 100 / (calculateWorkingDays(internship.batchStartDate, endDate) - holiday.length), calculateWorkingDays(internship.batchStartDate, endDate));
      // console.log("attendance", attendance, calculateWorkingDays(internship.batchStartDate, endDate), holiday.length)
      let refCount = 0;
      if(referral[0]?.referrals){
        for (let subelem of referral[0]?.referrals) {
          const joiningDate = moment(subelem?.referredUserId?.joining_date);
        
          if (joiningDate.isSameOrAfter(moment(moment(internship.batchStartDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(endDate1)) {
            refCount += 1;
          }
        }
      } else{
        refCount = 0;
      }

      elem.isPayout = false;
      const profitCap = 15000;

      if (attendance >= attendanceLimit && refCount >= referralLimit && elem?.npnl > 0) {
        console.log("payout 1sr");
        elem.isPayout = true;
      }

      if (!(attendance >= attendanceLimit && refCount >= referralLimit) && (attendance >= attendanceLimit || refCount >= referralLimit) && elem?.npnl > 0) {
        if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
          elem.isPayout = true;
          console.log("payout relief");
        }
        if (refCount < referralLimit && refCount >= reliefReferralLimit) {
          elem.isPayout = true;
          console.log("payout relief");
        }
      }

      elem.referralCount = refCount;
      elem.payout = elem.isPayout ? Math.min((elem?.npnl * payoutPercentage / 100).toFixed(0), profitCap) : 0;
      // elem.tradingDays = (elem?.tradingDays * 100 / (calculateWorkingDays(internship.batchStartDate, endDate) - holiday.length)).toFixed(0)
      elem.attendancePercentage = (elem?.tradingDays * 100 / (calculateWorkingDays(internship.batchStartDate, endDate) - holiday.length)).toFixed(0);
      // console.log(elem?.tradingDays, internship.batchStartDate, endDate, holiday.length, (calculateWorkingDays(internship.batchStartDate, endDate) - holiday.length) )
      traderWisePnlInfo.push(elem);
    })
  }
  res.status(201).json({ message: "data received", data: traderWisePnlInfo });
}




const tradingDays = async (userId, batchId) => {
  const pipeline =
    [
      {
        $match: {
          batch: new ObjectId(batchId),
          trader: new ObjectId(userId),
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
          },
          count: {
            $count: {},
          },
        },
      },
    ]

  let x = await InternTrades.aggregate(pipeline);

  return x.length;
}

const pnlFunc = async (userId, batchId) => {
  let pnlDetails = await InternTrades.aggregate([
    {
      $match: {
        status: "COMPLETE",
        trader: new ObjectId(userId),
        batch: new ObjectId(batchId)
      },
    },
    {
      $group: {
        _id: {
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        trades: { $count: {} },
      },
    },
    {
      $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: 0,
        npnl: {
          $subtract: ["$amount", "$brokerage"],
        },
        gpnl: "$amount",
        noOfTrade: "$trades"
      },
    },
  ])

  return { npnl: pnlDetails[0]?.npnl, gpnl: pnlDetails[0]?.gpnl, noOfTrade: pnlDetails[0]?.noOfTrade };
}

function calculateWorkingDays(startDate, endDate) {
  // Convert the input strings to Date objects
  const start = new Date(startDate);
  let end = new Date(endDate);
  end = end.toISOString().split('T')[0];
  end = new Date(end)
  end.setDate(end.getDate() + 1);

  // console.log(start, end)
  // Check if the start date is after the end date
  if (start > end) {
    return 0;
  }

  let workingDays = 0;
  let currentDate = new Date(start);

  // Iterate over each day between the start and end dates
  while (currentDate <= end) {
    // Check if the current day is a weekday (Monday to Friday)
    if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
      
      workingDays++;
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}

const referrals = async (user, elem) => {
  // elem.batchStartDate, elem.batchEndDate
  let refCount = 0;
  for (let subelem of user?.referrals) {
    let joiningDate = moment(subelem?.referredUserId?.joining_date);
    joiningDate.add({ hours: 5, minutes: 30 });
    // console.log((moment(moment(elem.batchStartDate).format("YYYY-MM-DD"))), joiningDate, (moment(elem.batchEndDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 })))
    // console.log("joiningDate", moment(moment(elem.batchStartDate).format("YYYY-MM-DD")), joiningDate ,endDate, endDate1, moment(endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD HH:mm:ss"))
    if (joiningDate.isSameOrAfter(moment(moment(elem.batchStartDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(moment(elem.batchEndDate).set({ hour: 23, minute: 0, second: 0, millisecond: 0 }))) {
      // console.log("joiningDate if", batchEndDate, batchEndDate.format("YYYY-MM-DD"))
      refCount = refCount + 1;
      // console.log("joiningDate if")
    }
  }

  // console.log(refCount)
  return refCount;
  // user?.referrals?.length;
}

exports.updateUserWallet = async () => {

  try {

    let date = new Date();

    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // let todayDate = `2023-11-27`

    let endOfToday = todayDate + "T23:59:59.400Z"
    const setting = await Setting.find();

    const internship = await InternBatch.find({batchStatus: "Active", batchEndDate: {$gte: new Date(todayDate)}, batchEndDate: { $lte: new Date(endOfToday) }})
    .populate('career', 'listingType')
    .select('batchName participants batchStartDate batchEndDate attendancePercentage payoutPercentage referralCount')
  
    console.log(internship)

    for (let elem of internship) {
      if (elem.career.listingType === 'Job') {
        const attendanceLimit = elem.attendancePercentage;
        const referralLimit = elem.referralCount;
        const payoutPercentage = elem.payoutPercentage;
        const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
        const reliefReferralLimit = referralLimit - referralLimit * 10 / 100
        const workingDays = calculateWorkingDays(elem.batchStartDate, elem.batchEndDate);
        const users = elem.participants;
        const batchId = elem._id;

        const holiday = await Holiday.find({
          holidayDate: {
            $gte: elem.batchStartDate,
            $lte: elem.batchEndDate
          },
          $expr: {
            $and: [
              { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
              { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
            ]
          }
        });

        const profitCap = 15000;
        for (let i = 0; i < users.length; i++) {
          const session = await mongoose.startSession();
          try {
            session.startTransaction();
            const user = await User.findOne({ _id: new ObjectId(users[i].user), status: "Active" })
              .populate('referrals.referredUserId', 'joining_date').session(session);;
            let eligible = false;
            if (user) {
              const tradingdays = await tradingDays(users[i].user, batchId);
              const attendance = (tradingdays * 100) / (workingDays - holiday.length);
              const referral = await referrals(user, elem);
              const pnl = await pnlFunc(users[i].user, batchId);
              const payoutAmountWithoutTDS = Math.min(pnl.npnl * payoutPercentage / 100, profitCap)
              const creditAmount = payoutAmountWithoutTDS;
              // const creditAmount = payoutAmountWithoutTDS - payoutAmountWithoutTDS*setting[0]?.tdsPercentage/100;

              const wallet = await Wallet.findOne({ userId: new ObjectId(users[i].user) }).session(session);

              // console.log( users[i].user, referral, creditAmount);
              if (creditAmount > 0) {
                if (attendance >= attendanceLimit && referral >= referralLimit && pnl.npnl > 0) {
                  eligible = true;
                  console.log("no relief", users[i].user, pnl.npnl, creditAmount);
                }

                if (!(attendance >= attendanceLimit && referral >= referralLimit) && (attendance >= attendanceLimit || referral >= referralLimit) && pnl.npnl > 0) {
                  if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
                    eligible = true;
                    console.log("attendance relief");
                  }
                  if (referral < referralLimit && referral >= reliefReferralLimit) {
                    eligible = true;
                    console.log("referral relief", attendance, tradingdays, users[i].user, pnl.npnl);
                  }
                }
              }
              if (eligible) {
                if (process.env.PROD == 'true') {
                  sendMail(user?.email, 'Internship Payout Credited - StoxHero', `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Amount Credited</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
          
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                    }
          
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
          
                    p {
                        margin: 0 0 20px;
                    }
          
                    .userid {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
          
                    .password {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
          
                    .login-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }
          
                    .login-button:hover {
                        background-color: #0069d9;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <h1>Amount Credited</h1>
                    <p>Hello ${user.first_name},</p>
                    <p>Amount of ${creditAmount?.toFixed(2)}INR has been credited in you wallet</p>
                    <p>You can now purchase Tenx and participate in contest.</p>
                    
                    <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                    <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                    <br/><br/>
                    <p>Thanks,</p>
                    <p>StoxHero Team</p>
                    
                    </div>
                    </body>
                    </html>
                    `);
                }
                await createUserNotification({
                  title: 'Internship Payout Credited',
                  description: `₹${creditAmount?.toFixed(2)} credited for your internship profit`,
                  notificationType: 'Individual',
                  notificationCategory: 'Informational',
                  productCategory: 'Internship',
                  user: user?._id,
                  priority: 'High',
                  channels: ['App', 'Email'],
                  createdBy: '63ecbc570302e7cf0153370c',
                  lastModifiedBy: '63ecbc570302e7cf0153370c'
                }, session);
                wallet.transactions = [...wallet.transactions, {
                  title: 'Internship Payout',
                  description: `Amount credited for your internship profit`,
                  amount: (creditAmount?.toFixed(2)),
                  transactionId: uuid.v4(),
                  transactionType: 'Cash'
                }];
                await wallet.save({ session });
                users[i].payout = creditAmount.toFixed(2);
                users[i].tradingdays = tradingdays;
                users[i].attendance = attendance.toFixed(2);
                users[i].referral = referral;
                users[i].gpnl = pnl?.gpnl?.toFixed(2);
                users[i].npnl = pnl?.npnl?.toFixed(2);
                users[i].noOfTrade = pnl?.noOfTrade;

                if(user?.fcmTokens?.length>0){
                  await sendMultiNotifications('Internship Payout Credited', 
                    `₹${creditAmount?.toFixed(2)} credited to your wallet for your Internship profit as payout`,
                    user?.fcmTokens?.map(item=>item.token), null, {route:'wallet'}
                    )  
                }
              } else {
                users[i].payout = 0;
                users[i].tradingdays = tradingdays;
                users[i].attendance = attendance.toFixed(2);
                users[i].referral = referral;
                users[i].gpnl = pnl?.gpnl?.toFixed(2);
                users[i].npnl = pnl?.npnl?.toFixed(2);
                users[i].noOfTrade = pnl?.noOfTrade?.toFixed(2);

              }
              await session.commitTransaction();
            }

          } catch (e) {
            console.log(e);
            await session.abortTransaction();
          } finally {
            await session.endSession();
          }
        }

        elem.workingDays = workingDays;
        elem.batchStatus = 'Completed';

        await elem.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getDailyInternshipUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: { date: "$_id.date" },
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: "$_id.trader" },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
    ];

    const internshipTraders = await InternTrades.aggregate(pipeline);

    // Create a date-wise mapping of DAUs for different products
    const dateWiseDAUs = {};

    internshipTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
            internshipTrading: 0,
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].internshipTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { internshipTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = internshipTrading
      dateWiseDAUs[date].uniqueUsers = [...new Set(uniqueUsers)];
    });

    const response = {
      status: "success",
      message: "Contest Scoreboard fetched successfully",
      data: Object.values(dateWiseDAUs),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.downloadCompletedInternshipReport = async (req, res) => {
  try { 

    const pipeline = [
      {
        $match: {
          status: "COMPLETE",
        },
      },
      {
        $lookup: {
          from: "intern-batches",
          localField: "batch",
          foreignField: "_id",
          as: "batch_details",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "batch_details.portfolio",
          foreignField: "_id",
          as: "portfolio",
        },
      },
      {
        $project: {
          trade_time: {
            $toDate: "$trade_time",
          },
          amount: 1,
          brokerage: 1,
          batchName: {
            $arrayElemAt: [
              "$batch_details.batchName",
              0,
            ],
          },
          payoutPercentage: {
            $arrayElemAt: [
              "$batch_details.payoutPercentage",
              0,
            ],
          },
          attendancePercentage: {
            $arrayElemAt: [
              "$batch_details.attendancePercentage",
              0,
            ],
          },
          referralCount: {
            $arrayElemAt: [
              "$batch_details.referralCount",
              0,
            ],
          },
          portfolioValue: {
            $arrayElemAt: [
              "$portfolio.portfolioValue",
              0,
            ],
          },
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          referrals: {
            $arrayElemAt: ["$user.referrals", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: {
            $add: [
              {
                $toDate: {
                  $arrayElemAt: [
                    "$user.joining_date",
                    0,
                  ],
                },
              },
              5 * 60 * 60 * 1000,
              // Add 5 hours (5 * 60 * 60 * 1000 milliseconds)
              30 * 60 * 1000, // Add 30 minutes (30 * 60 * 1000 milliseconds)
            ],
          },
          batchStartDate: {
            $add: [
              {
                $toDate: {
                  $arrayElemAt: [
                    "$batch_details.batchStartDate",
                    0,
                  ],
                },
              },
              5 * 60 * 60 * 1000,
              // Add 5 hours (5 * 60 * 60 * 1000 milliseconds)
              30 * 60 * 1000, // Add 30 minutes (30 * 60 * 1000 milliseconds)
            ],
          },
    
          batchEndDate: {
            $add: [
              {
                $toDate: {
                  $arrayElemAt: [
                    "$batch_details.batchEndDate",
                    0,
                  ],
                },
              },
              5 * 60 * 60 * 1000,
              // Add 5 hours (5 * 60 * 60 * 1000 milliseconds)
              30 * 60 * 1000, // Add 30 minutes (30 * 60 * 1000 milliseconds)
            ],
          },
        },
      },
      {
        $match: {
          $expr: {
            $lt: [
              "$batchEndDate",
              {
                $add: [
                  new Date(),
                  5 * 60 * 60 * 1000,
                  30 * 60 * 1000,
                ], // Add 5 hours and 30 minutes
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            trade_date: {
              $substr: ["$trade_time", 0, 10],
            },
            first_name: "$first_name",
            last_name: "$last_name",
            email: "$email",
            mobile: "$mobile",
            referrals: "$referrals",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            batchStartDate: "$batchStartDate",
            batchEndDate: "$batchEndDate",
            batchName: "$batchName",
            portfolio: "$portfolioValue",
            payoutPercentage: "$payoutPercentage",
            referralCount: "$referralCount",
            attendancePercentage:
              "$attendancePercentage",
          },
          tradeCount: {
            $sum: 1,
          },
          grosspnl: {
            $sum: {
              $multiply: ["$amount", -1],
            },
          },
          brokerage: {
            $sum: "$brokerage",
          },
        },
      },
      {
        $project: {
          _id: 0,
          trade_date: "$_id.trade_date",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          email: "$_id.email",
          mobile: "$_id.mobile",
          referrals:'$_id.referrals',
          creationProcess: "$_id.creationProcess",
          joining_date: "$_id.joining_date",
          batchStartDate: "$_id.batchStartDate",
          batchEndDate: "$_id.batchEndDate",
          batchName: "$_id.batchName",
          portfolio: "$_id.portfolio",
          payoutPercentage: "$_id.payoutPercentage",
          referralCount: "$_id.referralCount",
          attendancePercentage:
            "$_id.attendancePercentage",
          tradeCount: 1,
          grosspnl: 1,
          brokerage: 1,
        },
      },
      {
        $group: {
          _id: {
            first_name: "$first_name",
            last_name: "$last_name",
            email: "$email",
            mobile: "$mobile",
            referrals: "$referrals",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            batchStartDate: "$batchStartDate",
            batchEndDate: "$batchEndDate",
            batchName: "$batchName",
            portfolio: "$portfolio",
            payoutPercentage: "$payoutPercentage",
            referralCount: "$referralCount",
            attendancePercentage:
              "$attendancePercentage",
          },
          tradingDays: {
            $sum: 1,
          },
          totalTrades: {
            $sum: "$tradeCount",
          },
          grosspnl: {
            $sum: "$grosspnl",
          },
          brokerage: {
            $sum: "$brokerage",
          },
        },
      },
      {
        $project: {
          _id: 0,
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          email: "$_id.email",
          mobile: "$_id.mobile",
          referrals: "$_id.referrals",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          batchStartDate: {$substr : ["$_id.batchStartDate",0,10]},
          batchEndDate: {$substr : ["$_id.batchEndDate",0,10]},
          batchName: "$_id.batchName",
          portfolio: "$_id.portfolio",
          payoutPercentage: "$_id.payoutPercentage",
          referralCount: "$_id.referralCount",
          attendancePercentage:
            "$_id.attendancePercentage",
          totalTrades: 1,
          tradingDays: 1,
          grosspnl: 1,
          brokerage: 1,
        },
      },
      {
        $addFields: {
          netpnl: {
            $subtract: ["$grosspnl", "$brokerage"],
          },
        },
      },
      {
        $sort: {
          batchEndDate:-1,
          batchName:-1,
        }
      }
    ];

    const internshipReport = await InternTrades.aggregate(pipeline);
    console.log("Internship Report:",internshipReport)
    // Create a date-wise mapping of DAUs for different products

    const response = {
      status: "success",
      message: "Internship Report Downloaded Successfully",
      data: internshipReport,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getReferralCount = async(req,res) => {
  const {id} = req.params;
  const user = await User.findById(req.user._id)
  .populate('referrals.referredUserId', 'joining_date')
  .select("referrals");
  const elem = await InternBatch.findOne({_id: new ObjectId(id)})
  .select('batchStatus batchStartDate batchEndDate attendancePercentage referralCount payoutPercentage')
  const count = await referrals(user, elem);
  res.status(200).json({status:'success', data:count});
}