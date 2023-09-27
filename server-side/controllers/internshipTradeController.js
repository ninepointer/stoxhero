const InternTrades = require("../models/mock-trade/internshipTrade");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const InternBatch = require("../models/Careers/internBatch");
const {client, getValue} = require('../marketData/redisClient');
const Careers = require("../models/Careers/careerSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const uuid = require('uuid');
const Holiday = require("../models/TradingHolidays/tradingHolidays");
const moment = require('moment');
const { ObjectId } = require("mongodb");
const sendMail = require('../utils/emailService');
const {createUserNotification} = require('./notification/notificationController');
const mongoose = require('mongoose');


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
            $group: {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange"
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
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])
        // console.log("pnlDetails in else", pnlDetails)
        if(isRedisConnected){
          await client.set(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnlDetails))
          await client.expire(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);  
        }

        res.status(201).json({message: "pnl received", data: pnlDetails});
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

exports.internshipDailyPnlTWise = async (req, res, next) => {

  let { batch } = req.params

  let pipeline = [
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        status: "COMPLETE",
        batch: new ObjectId(batch),
      },
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
          batchStartDate: {
            $arrayElemAt: [
              "$batch.batchStartDate",
              0,
            ],
          },
          batchEndDate: {
            $arrayElemAt: [
              "$batch.batchEndDate",
              0,
            ],
          },

          payoutPercentage: {
            $arrayElemAt: [
              "$batch.payoutPercentage",
              0,
            ],
          },
          attendancePercentage: {
            $arrayElemAt: [
              "$batch.attendancePercentage",
              0,
            ],
          },
          referralCount: {
            $arrayElemAt: [
              "$batch.referralCount",
              0,
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
        batchStartDate: "$_id.batchStartDate",
        batchEndDate: "$_id.batchEndDate",
        payoutPercentage: "$_id.payoutPercentage",
        attendancePercentage: "$_id.attendancePercentage",
        referralCount: "$_id.referralCount",
      },
    },
    {
      $sort: {
        npnl: -1,
      },
    },
  ]


  let userData = await User.find()
  .populate('referrals.referredUserId', 'joining_date')
  .select("referrals")
  let x = await InternTrades.aggregate(pipeline)

  // res.status(201).json(x);

  res.status(201).json({ message: "data received", data: x, userData: userData });
}


exports.updateUserWallet = async () => {

  try {

    let date = new Date();
 
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // let todayDate = `2023-09-03`

    const internship = await Careers.aggregate([
      {
        $match:
        {
          listingType: "Job",
        },
      },
      {
        $lookup:

        {
          from: "intern-batches",
          localField: "_id",
          foreignField: "career",
          as: "batch",
        },
      },
      {
        $unwind:

        {
          path: "$batch",
        },
      },
      {
        $match:

        {
          $expr: {
            $eq: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$batch.batchEndDate",
                },
              },
              todayDate,

            ],
          },
          "batch.batchStatus": "Active",
        },
      },
      {
        $project:

        {
          _id: 0,
          batchId: "$batch._id",
          users: "$batch.participants",
          startDate: "$batch.batchStartDate",
          endDate: "$batch.batchEndDate",
          attendancePercentage: "$batch.attendancePercentage",
          payoutPercentage: "$batch.payoutPercentage",
          referralCount: "$batch.referralCount"
        }
      },

    ])


    for (let elem of internship) {
      const attendanceLimit = elem.attendancePercentage;
      const referralLimit = elem.referralCount;
      const payoutPercentage = elem.payoutPercentage;
      const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
      const reliefReferralLimit = referralLimit - referralLimit * 10 / 100
      const workingDays = calculateWorkingDays(elem.startDate, elem.endDate);
      const users = elem.users;
      const batchId = elem.batchId;

      const holiday = await Holiday.find({
        holidayDate: {
          $gte: elem.startDate,
          $lte: elem.endDate
        },
        $expr: {
          $ne: [{ $dayOfWeek: "$holidayDate" }, 1], // 1 represents Sunday
          $ne: [{ $dayOfWeek: "$holidayDate" }, 7], // 7 represents Saturday
        }
      });

      // console.log("holiday date" , elem.endDate, elem.startDate, holiday)

      const profitCap = 15000;

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

      const pnl = async (userId, batchId) => {
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
            },
          },
        ])

        return pnlDetails[0]?.npnl;
      }

      function calculateWorkingDays(startDate, endDate) {
        // Convert the input strings to Date objects
        const start = new Date(startDate);
        let end = new Date(endDate);
        end = end.toISOString().split('T')[0];
        end = new Date(end)
        end.setDate(end.getDate() + 1);

        // Check if the start date is after the end date
        if (start > end) {
          return 0;
        }

        let workingDays = 0;
        let currentDate = new Date(start);

        // Iterate over each day between the start and end dates
        while (currentDate <= end) {
          // Check if the current day is a weekday (Monday to Friday)
          if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
            workingDays++;
          }

          // Move to the next day
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
      }

      const referrals = async (user) => {
        // elem.startDate, elem.endDate
        let refCount = 0;
        for (let subelem of user?.referrals) {
          const joiningDate = moment(subelem?.referredUserId?.joining_date);
        
          // console.log((moment(moment(elem.startDate).format("YYYY-MM-DD"))), joiningDate, (moment(elem.endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 })))
          // console.log("joiningDate", moment(moment(elem.batchStartDate).format("YYYY-MM-DD")), joiningDate ,endDate, endDate1, moment(endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD HH:mm:ss"))
          if (joiningDate.isSameOrAfter(moment(moment(elem.startDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(moment(elem.endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 }))) {
            // console.log("joiningDate if", batchEndDate, batchEndDate.format("YYYY-MM-DD"))
            refCount = refCount + 1;
            // console.log("joiningDate if")
          }
        }

        // console.log(refCount)
        return refCount;
        // user?.referrals?.length;
      }


      for (let i = 0; i < users.length; i++) {
      const session = await mongoose.startSession();
      try{
          session.startTransaction();
          const user = await User.findOne({ _id: new ObjectId(users[i].user), status: "Active" })
          .populate('referrals.referredUserId', 'joining_date').session(session);;
          let eligible = false;
          if(user){
            const tradingdays = await tradingDays(users[i].user, batchId);
            const attendance = (tradingdays * 100) / (workingDays - holiday.length);
            const referral = await referrals(user);
            const npnl = await pnl(users[i].user, batchId);
            const creditAmount = Math.min(npnl * payoutPercentage / 100, profitCap)
  
            const wallet = await Wallet.findOne({ userId: new ObjectId(users[i].user) }).session(session);
  
            // console.log( users[i].user, referral, creditAmount);
            if (creditAmount > 0) {
              if (attendance >= attendanceLimit && referral >= referralLimit && npnl > 0) {
                eligible = true;      
                console.log("no relief", users[i].user, npnl, creditAmount);
                }
  
              if (!(attendance >= attendanceLimit && referral >= referralLimit) && (attendance >= attendanceLimit || referral >= referralLimit) && npnl > 0) {
                if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
                  eligible = true;
                  console.log("attendance relief");
                }
                if (referral < referralLimit && referral >= reliefReferralLimit) {
                  eligible = true;
                  console.log("referral relief", attendance, tradingdays, users[i].user, npnl);
                }
              }
            }
            if(eligible){
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
                  title:'Internship Payout Credited',
                  description:`₹${creditAmount?.toFixed(2)} credited for your internship profit`,
                  notificationType:'Individual',
                  notificationCategory:'Informational',
                  productCategory:'Internship',
                  user: user?._id,
                  priority:'High',
                  channels:['App', 'Email'],
                  createdBy:'63ecbc570302e7cf0153370c',
                  lastModifiedBy:'63ecbc570302e7cf0153370c'  
                }, session);
                wallet.transactions = [...wallet.transactions, {
                  title: 'Internship Payout',
                  description: `Amount credited for your internship profit`,
                  amount: (creditAmount?.toFixed(2)),
                  transactionId: uuid.v4(),
                  transactionType: 'Cash'
                }];
                wallet.save({session});
              }
              await session.commitTransaction();      
          }
        
      }catch(e){
        console.log(e);
        await session.abortTransaction();
      }finally{
        await session.endSession();
      }
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