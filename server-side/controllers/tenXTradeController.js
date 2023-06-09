const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const { client, getValue } = require('../marketData/redisClient');

const { ObjectId } = require("mongodb");


exports.overallPnl = async (req, res, next) => {
  let isRedisConnected = getValue();
  const userId = req.user._id;
  const subscriptionId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  // console.log(today, subscriptionId)

  try {

    if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
      let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
      pnl = JSON.parse(pnl);
      // console.log("pnl redis", pnl)

      res.status(201).json({ message: "pnl received", data: pnl });

    } else {

      let pnlDetails = await TenXTrader.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            },
            status: "COMPLETE",
            trader: new ObjectId(userId),
            subscriptionId: new ObjectId(subscriptionId)
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange"
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
      ])
      // console.log("pnlDetails in else", pnlDetails)
      if (isRedisConnected) {
        await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlDetails))
        await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
      }

      res.status(201).json({ message: "pnl received", data: pnlDetails });
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }


}

exports.myTodaysTrade = async (req, res, next) => {

  // const id = req.params.id
  //   const subscriptionId = req.params.id;
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({ trader: userId, trade_time: { $gte: today } })
  console.log("Under my today orders", userId, today)
  try {
    const myTodaysTrade = await TenXTrader.find({ trader: userId, trade_time: { $gte: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    console.log(myTodaysTrade)
    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
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
  const count = await TenXTrader.countDocuments({ trader: userId, trade_time: { $lt: today } })
  console.log("Under my today orders", userId, today)
  try {
    const myHistoryTrade = await TenXTrader.find({ trader: userId, trade_time: { $lt: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    console.log(myHistoryTrade)
    res.status(200).json({ status: 'success', data: myHistoryTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.marginDetail = async (req, res, next) => {
  let subscriptionId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  try {
    const subscription = await Subscription.aggregate([
      {
        $match: {
          _id: new ObjectId(subscriptionId),
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
          foreignField: "subscriptionId",
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
            subscriptionId: "$_id",
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
          subscriptionId: "$_id.subscriptionId",
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
      res.status(200).json({ status: 'success', data: subscription[0] });
    } else {
      const portfolioValue = await Subscription.aggregate([
        {
          $match: {
            _id: new ObjectId(subscriptionId),
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
              subscriptionId: "$_id",
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
            subscriptionId: "$_id.subscriptionId",
            totalFund: "$_id.totalFund",
          },
        },
      ])
      res.status(200).json({ status: 'success', data: portfolioValue[0] });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
// TODO remove hardcode of 60 days
exports.tradingDays = async (req, res, next) => {
  let subscriptionId = req.params.id;
  let userId = req.user._id;

  console.log("subscriptionId", subscriptionId, userId)
  const today = new Date();

  const tradingDays = await TenXTrader.aggregate(
    [
    {
      $match: {
        trader: new ObjectId(
          userId
        ),
        status: "COMPLETE",
        subscriptionId: new ObjectId(subscriptionId)
      },
    },
    {
      $lookup: {
        from: "tenx-subscriptions",
        localField: "subscriptionId",
        foreignField: "_id",
        as: "subscriptionData",
      },
    },
  
    {
      $group: {
        _id: {
          subscriptionId: "$subscriptionId",
          users: "$subscriptionData.users",
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
          users:{$arrayElemAt:  ["$_id.users", 0]},
          id: "$_id.subscriptionId",
          validity: {
            $arrayElemAt: ["$_id.validity", 0],
          },
        },
        count: {
          $sum: 1,
        },
        firstMatchedDate: {
          $first: "$_id.date",
        },
      },
    },
    {
      $unwind: {
        path: "$_id.users"
      }
    },
      {
      $match:
  
        {
          "_id.users.userId": new ObjectId(
          userId
        ),
        },
    },
    {
      $project: {
        _id: 0,
        subscriptionId: "$_id.id",
        totalTradingDays: "$count",
        firstMatchedDate: 1,
        remainingDays: {
          $subtract: ["$_id.validity", "$count"],
        },
        defaultRemaining: {
          $divide: [
            {
              $subtract: [
                today,
                {
                  $toDate: "$_id.users.subscribedOn",
                },
                
              ],
            },
            24 * 60 * 60 * 1000, // Convert milliseconds to days
          ],
        },
  
        remainingAfterDefault: {
          $subtract: [
            60,
            {
              $divide: [
                {
                  $subtract: [
                    today,
                                 {
                  $toDate: "$_id.users.subscribedOn",
                },
                  
                  ],
                },
                24 * 60 * 60 * 1000, // Convert milliseconds to days
              ],
            },
          ],
        },
  
        actualRemainingDay: {
          $min: [
            {
              $subtract: [
                "$_id.validity",
                "$count",
              ],
            },
            {
              $subtract: [
                today,
                {
                  $toDate: "$_id.users.subscribedOn",
                },
                
              ],
            },
          ],
        },
      },
    },
  ])

  console.log("tradingDays ", tradingDays)
  if(tradingDays.length> 0){
    console.log("tradingDays in if", tradingDays)
    res.status(200).json({ status: 'success', data: tradingDays });
  } else{
    const tradingDay = await Subscription.aggregate(
    [
      {
        $match: {
          _id: new ObjectId(subscriptionId)
        },
      },
      {
        $addFields: {
          totalTradingDays: 0
        }
      },
      {
        $project: {
          _id: 0,
          totalTradingDays: 1,
          subscriptionId: "$_id",
          actualRemainingDay: "$validity",
        },
      },
    ])
    console.log("tradingDays in else", tradingDay)
    res.status(200).json({ status: 'success', data: tradingDay });
  }
}

exports.autoExpireSubscription = async () => {
  console.log("autoExpireSubscription running");
  const subscription = await Subscription.find({ status: "Active" });

  for (let i = 0; i < subscription.length; i++) {
    let users = subscription[i].users;
    for (let j = 0; j < users.length; j++) {
      let userId = users[j].userId;

      const today = new Date();  // Get the current date

      const tradingDays = await TenXTrader.aggregate(
        [
        {
          $match: {
            trader: new ObjectId(userId),
            subscriptionId: new ObjectId(subscription[i]._id),
            status: "COMPLETE",
          },
        },
        {
          $lookup: {
            from: "tenx-subscriptions",
            localField: "subscriptionId",
            foreignField: "_id",
            as: "subscriptionData",
          },
        },
      
        {
          $group: {
            _id: {
              subscriptionId: "$subscriptionId",
              users: "$subscriptionData.users",
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
              users:{$arrayElemAt:  ["$_id.users", 0]},
              id: "$_id.subscriptionId",
              validity: {
                $arrayElemAt: ["$_id.validity", 0],
              },
            },
            count: {
              $sum: 1,
            },
            firstMatchedDate: {
              $first: "$_id.date",
            },
          },
        },
        {
          $unwind: {
            path: "$_id.users"
          }
        },
          {
          $match:
      
            {
              "_id.users.userId": new ObjectId(
              req.user._id
            ),
            },
        },
        {
          $project: {
            _id: 0,
            // subscriptionId: "$_id.id",
            totalTradingDays: "$count",
            firstMatchedDate: 1,
            remainingDays: {
              $subtract: ["$_id.validity", "$count"],
            },
            defaultRemaining: {
              $divide: [
                {
                  $subtract: [
                    today,
                    {
                      $toDate: "$_id.users.subscribedOn",
                    },
                    
                  ],
                },
                24 * 60 * 60 * 1000, // Convert milliseconds to days
              ],
            },
      
            remainingAfterDefault: {
              $subtract: [
                60,
                {
                  $divide: [
                    {
                      $subtract: [
                        today,
                                     {
                      $toDate: "$_id.users.subscribedOn",
                    },
                      
                      ],
                    },
                    24 * 60 * 60 * 1000, // Convert milliseconds to days
                  ],
                },
              ],
            },
      
            actualRemainingDay: {
              $min: [
                {
                  $subtract: [
                    "$_id.validity",
                    "$count",
                  ],
                },
                {
                  $subtract: [
                    today,
                    {
                      $toDate: "$_id.users.subscribedOn",
                    },
                    
                  ],
                },
              ],
            },
          },
        },
      ]);


      // console.log("tradingDays", tradingDays, userId)

      if (tradingDays.length && Math.floor(tradingDays[0]?.actualRemainingDay) === 0) {
        const updateUser = await User.findOneAndUpdate(
          { _id: new ObjectId(userId), "subscription.subscriptionId": new ObjectId(subscription[i]._id) },
          {
            $set: {
              'subscription.$.status': "Expired"
            }
          },
          { new: true }
        );

        const updateSubscription = await Subscription.findOneAndUpdate(
          { _id: new ObjectId(subscription[i]._id), "users.userId": new ObjectId(userId) },
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

exports.traderWiseMockTrader = async (req, res, next) => {
  const{id} = req.params;
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
        subscriptionId: new ObjectId(id)
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

  
  let x = await TenXTrader.aggregate(pipeline)
  console.log(id, x)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallTenXPnl = async (req, res, next) => {
    console.log("Inside overall tenx pnl")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    console.log(today)
    let pnlDetails = await TenXTrader.aggregate([
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
              instrumentToken: "$instrumentToken",
              exchangeInstrumentToken: "$exchangeInstrumentToken"
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
    let pnlDetails = await TenXTrader.aggregate([
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

exports.overallTenXPnlYesterday = async (req, res, next) => {
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
    let pnlDetails = await TenXTrader.aggregate([
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
            _id: null,

            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            turnover: {
              $sum: {
                $toInt: {$abs : "$amount"},
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
                $toInt: {$abs : "$Quantity"},
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
    yesterdayDate.setDate(yesterdayDate.getDate() - 2);
    // console.log(yesterdayDate)
    let yesterdayStartTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayStartTime = yesterdayStartTime + "T00:00:00.000Z";
    let yesterdayEndTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
    const startTime = new Date(yesterdayStartTime); 
    const endTime = new Date(yesterdayEndTime); 
    // console.log("Query Timing: ", startTime, endTime)  
    let pnlDetails = await TenXTrader.aggregate([
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

exports.tenxPnlReport = async (req, res, next) => {

  let { startDate, endDate, id } = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";

// console.log(startDate, endDate, id)
  let pipeline = [
    {
      $match: {
        trade_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        subscriptionId: new ObjectId(id)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
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

  let x = await TenXTrader.aggregate(pipeline)
// console.log(x, startDate, endDate, subscriptionId)
  res.status(201).json({ message: "data received", data: x });
}

exports.tenxDailyPnlTWise = async (req, res, next) => {

  let { startDate, endDate, id } = req.params
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  // console.log("startDate", startDate,endDate )
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
        trade_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        subscriptionId: new ObjectId(id)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort: {
        npnl: -1,
      },
    },
  ]

  let x = await TenXTrader.aggregate(pipeline)

  // res.status(201).json(x);

  res.status(201).json({ message: "data received", data: x });
}