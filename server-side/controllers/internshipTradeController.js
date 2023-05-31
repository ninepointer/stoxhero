const InternTrades = require("../models/mock-trade/internshipTrade");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const InternBatch = require("../models/Careers/internBatch");
const {client, getValue} = require('../marketData/redisClient');

const { ObjectId } = require("mongodb");


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

    console.log(today, batch)

    try{

      if(isRedisConnected && await client.exists(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`)){
        let pnl = await client.get(`${req.user._id.toString()}${batch.toString()}: overallpnlIntern`)
        pnl = JSON.parse(pnl);
        console.log("pnl redis", pnl)
        
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
  console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InternTrades.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1, 'batch': 1}).populate('batch', 'batchName')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myTodaysTrade)
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
  console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await InternTrades.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1, 'batch': 1}).populate('batch', 'batchName')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.marginDetail = async (req, res, next) => {
  let {batch} = req.params;
  console.log("Batch:",batch)
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  try {
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
            from: "tenx-trade-users",
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
                "trades.trade_time": {$lt: today},
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
                $sum:{
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
    console.log("subs", subscription)
    if(subscription.length > 0){
      console.log("subs", subscription)

        res.status(200).json({status: 'success', data: subscription[0]});
    } else{
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

        console.log("portfolioValue", portfolioValue, subscription)
        res.status(200).json({status: 'success', data: portfolioValue[0]});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
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
    console.log("autoExpireInternBatch running");
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
  console.log(today);

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
          status: "COMPLETE",
        },
      },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
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
}

exports.myInternshipTradingDays = async (req, res, next) => {
  const {batchId} = req.params;
  const userId = req.user._id;
  console.log("Batch Id & User ID: ",batchId,userId)
  // let date = new Date();
  // date.setDate(new Date(date) - 1)
  // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  // todayDate = todayDate + "T23:59:59.000Z";
  // const today = new Date(todayDate);
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
}