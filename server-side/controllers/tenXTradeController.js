const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const { client, getValue } = require('../marketData/redisClient');
const Wallet = require("../models/UserWallet/userWalletSchema");
const uuid = require('uuid');
const { ObjectId } = require("mongodb");
const sendMail = require('../utils/emailService');


exports.overallPnl = async (req, res, next) => {
  let isRedisConnected = getValue();
  const userId = req.user._id;
  const subscriptionId = req.params.id;

  const subs = await Subscription.findById(new ObjectId(subscriptionId));
  let timeElem = subs.users.filter((elem)=>{
    return (elem.userId.toString() === userId.toString() && elem.status === "Live");
  })
  const time = timeElem[0].subscribedOn;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  const matchingTime = new Date(time) > today ? time : today;

  console.log(new Date(time) ,today)

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
              $gte: new Date(matchingTime)
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

  let {subscription} = req.params;

  console.log("subscription", subscription)
  subscription = JSON.parse(subscription);
  let {subscriptionId} =  subscription;

  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({ subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time: { $gte: today } })
  // console.log("Under my today orders", userId, today)
  try {
    const myTodaysTrade = await TenXTrader.find({ subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time: { $gte: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.myHistoryTrade = async (req, res, next) => {

  let {subscription, usersubscription} = req.params;
  let {subscribedOn, expiredOn} = usersubscription  ? JSON.parse(usersubscription) : usersubscription
  let {subscriptionId} = subscription ? JSON.parse(subscription) : subscription

  expiredOn = expiredOn && new Date(expiredOn);
  subscribedOn = subscribedOn && new Date(subscribedOn);

  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  if(!expiredOn){
    expiredOn  = today;
  }

  // console.log(expiredOn, subscribedOn, JSON.parse(usersubscription))

  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time: {$gte: subscribedOn, $lt: expiredOn } })
  // console.log("Under my today orders", userId, today)
  try {
    const myHistoryTrade = await TenXTrader.find({subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time: {$gte: subscribedOn, $lt: expiredOn } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res.status(200).json({ status: 'success', data: myHistoryTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.marginDetail = async (req, res, next) => {
  let isRedisConnected = getValue();
  let subscriptionId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)) {
      let marginDetail = await client.get(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)
      marginDetail = JSON.parse(marginDetail);

      res.status(201).json({ message: "pnl received", data: marginDetail });

    } else {

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
          $unwind: {
            path: "$users",
          },
        },
        {
          $match: {
            "users.userId": new ObjectId(req.user._id),
            "users.status": "Live",
          },
        },
        {
          $unwind: {
            path: "$trades",
            includeArrayIndex: "string",
          },
        },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$trades.trade_time", "$users.subscribedOn"] },
                { $lt: ["$trades.trade_time", today] }
              ]
            },
            "trades.status": "COMPLETE",
            "trades.trader": new ObjectId(req.user._id),
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
            totalAmount: {
              $sum: {
                $multiply: ["$trades.amount", -1],
              },
            },
            totalBrokerage: {
              $sum: "$trades.brokerage",
            },
          },
        },
        {
          $project: {
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
                {
                  $subtract: [
                    "$totalAmount",
                    "$totalBrokerage",
                  ],
                },
              ],
            },
          },
        },
      ])

      console.log("subscription", subscription);
      if (subscription.length > 0) {
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`, JSON.stringify(subscription[0]))
          await client.expire(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`, secondsRemaining);
        }
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
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`, JSON.stringify(portfolioValue[0]))
          await client.expire(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`, secondsRemaining);
        }
        res.status(200).json({ status: 'success', data: portfolioValue[0] });
      }

    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}
// TODO remove hardcode of 60 days
exports.tradingDays = async (req, res, next) => {
  let subscriptionId = req.params.id;
  let userId = req.user._id;

  
  const today = new Date();
  console.log("subscriptionId", subscriptionId, userId, today)

  const tradingDays = await TenXTrader.aggregate([
    {
      $match: {
        trader: new ObjectId(
          userId
        ),
        status: "COMPLETE",
        subscriptionId: new ObjectId(
          subscriptionId
        ),
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
          date: "$trade_time",
        },
      },
    },
    {
      $group: {
        _id: {
          users: {
            $arrayElemAt: ["$_id.users", 0],
          },
          id: "$_id.subscriptionId",
          validity: {
            $arrayElemAt: ["$_id.validity", 0],
          },
          date: "$_id.date",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $unwind: {
        path: "$_id.users",
      },
    },
    {
      $match:
  
        {
          "_id.users.userId": new ObjectId(
            userId
          ),
          "_id.users.status": "Live",
          $expr: {
            $gte: [
              "$_id.date",
              "$_id.users.subscribedOn",
            ],
          },
        },
    },
    {
      $group: {
        _id: {
          id: "$_id.id",
          users: "$_id.users",
          validity: "$_id.validity",
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$_id.date",
            },
          },
        },
      },
    },
    {
      $group: {
        _id: {
          subscriptionId: "$_id.id",
          users: "$_id.users",
          validity: "$_id.validity",
        },
        count: {
          $count: {},
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscriptionId: "$_id.subscriptionId",
        totalTradingDays: "$count",
        actualRemainingDay: {
          $subtract: ["$_id.validity", "$count"],
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
                60,
                {
                  $divide: [
                    {
                      $subtract: [
                        today,
                        {
                          $toDate:
                            "$_id.users.subscribedOn",
                        },
                      ],
                    },
                    24 * 60 * 60 * 1000, // Convert milliseconds to days
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ])

  // console.log("tradingDays ", tradingDays)
  if(tradingDays.length> 0){
    // console.log("tradingDays in if", tradingDays)
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
    // console.log("tradingDays in else", tradingDay)
    res.status(200).json({ status: 'success', data: tradingDay });
  }
}

exports.autoExpireSubscription = async () => {
  console.log("autoExpireSubscription running");
  const subscription = await Subscription.find({ status: "Active" });

  for (let i = 0; i < subscription.length; i++) {
    let users = subscription[i].users;
    let subscriptionId = subscription[i]._id
    let payoutPercentage = 10;
    for (let j = 0; j < users.length; j++) {
      let userId = users[j].userId;
      let subscribedOn = users[j].subscribedOn;
      let status = users[j].status;

      const today = new Date();  // Get the current date

      if(status === "Live"){
        const tradingDays = await TenXTrader.aggregate([
          {
            $match: {
              trader: new ObjectId(
                userId
              ),
              status: "COMPLETE",
              subscriptionId: new ObjectId(
                subscriptionId
              ),
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
                date: "$trade_time",
              },
            },
          },
          {
            $group: {
              _id: {
                users: {
                  $arrayElemAt: ["$_id.users", 0],
                },
                id: "$_id.subscriptionId",
                validity: {
                  $arrayElemAt: ["$_id.validity", 0],
                },
                date: "$_id.date",
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $unwind: {
              path: "$_id.users",
            },
          },
          {
            $match:
        
              {
                "_id.users.userId": new ObjectId(
                  userId
                ),
                "_id.users.status": "Live",
                $expr: {
                  $gte: [
                    "$_id.date",
                    "$_id.users.subscribedOn",
                  ],
                },
              },
          },
          {
            $group: {
              _id: {
                id: "$_id.id",
                users: "$_id.users",
                validity: "$_id.validity",
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$_id.date",
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: {
                subscriptionId: "$_id.id",
                users: "$_id.users",
                validity: "$_id.validity",
              },
              count: {
                $count: {},
              },
            },
          },
          {
            $project: {
              _id: 0,
              subscriptionId: "$_id.subscriptionId",
              totalTradingDays: "$count",
              actualRemainingDay: {
                $subtract: ["$_id.validity", "$count"],
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
                      60,
                      {
                        $divide: [
                          {
                            $subtract: [
                              today,
                              {
                                $toDate:
                                  "$_id.users.subscribedOn",
                              },
                            ],
                          },
                          24 * 60 * 60 * 1000, // Convert milliseconds to days
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ])
  
        let pnlDetails = await TenXTrader.aggregate([
          {
            $match: {
              trade_time: {
                $gte: new Date(subscribedOn)
              },
              status: "COMPLETE",
              trader: new ObjectId(userId),
              subscriptionId: new ObjectId(subscriptionId)
            },
          },
          {
            $group: {
              _id: {},
              amount: {
                $sum: {
                  $multiply: ["$amount", -1],
                },
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
              {
                _id: 0,
                npnl: {
                  $subtract: ["$amount", "$brokerage"],
                },
              },
          },
        ])

        let pnl = pnlDetails[0]?.npnl * payoutPercentage/100;
        let profitCap = subscription[i].profitCap;
        let payoutAmount = Math.min(pnl, profitCap);
  

        // console.log(Math.floor(tradingDays[0]?.actualRemainingDay), tradingDays)
        if (tradingDays.length && Math.floor(tradingDays[0]?.actualRemainingDay) <= 0) {
          console.log(pnlDetails[0]?.npnl, pnl, profitCap, payoutAmount, userId)
          // "subscription.subscribedOn": {$gte: new Date(subscribedOn)}
          console.log(new Date(subscribedOn))
          // await User.find().sort({_id: -1})

          const user = await User.findOne({ _id: new ObjectId(userId) });
          let len = user.subscription.length;
          
          for (let k = len - 1; k >= 0; k--) {
            if (user.subscription[k].subscriptionId?.toString() === subscription[i]._id?.toString()) {
              user.subscription[k].status = "Expired";
              user.subscription[k].expiredOn = new Date();
              console.log("this is user", user)
              await user.save();
              break;
            }
          }

          const subs = await Subscription.findOne({ _id: new ObjectId(subscription[i]._id) });
          let Subslen = subs.users.length;
          
          for (let k = Subslen - 1; k >= 0; k--) {
            if (subs.users[k].userId?.toString() === userId?.toString()) {
              subs.users[k].status = "Expired";
              subs.users[k].expiredOn = new Date();
              console.log("this is subs", subs)
              await subs.save();
              break;
            }
          }
 
          // console.log(updateUser, updateSubscription)
          if(payoutAmount > 0){
            const wallet = await Wallet.findOne({userId: new ObjectId(userId)});
            wallet.transactions = [...wallet.transactions, {
                  title: 'TenX Trading Payout',
                  description: `Amount Credited for the profit of ${subscription[i]?.plan_name} subscription`,
                  amount: (payoutAmount?.toFixed(2)),
                  transactionId: uuid.v4(),
                  transactionType: 'Cash'
            }];
            wallet.save();

            if (process.env.PROD == 'true') {
              sendMail(user?.email, 'Tenx Payout Credited - StoxHero', `
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
                  <p>Amount of ${payoutAmount?.toFixed(2)}INR has been credited in you wallet</p>
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

          }
        }
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

// exports.overallTenXPnlYesterday = async (req, res, next) => {
  
//   let date;
//   let i = 1;
//   async function pnlDetails(i){
//     console.log("i",i)
//     let yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - i);
//     let yesterdayStartTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
//     yesterdayStartTime = yesterdayStartTime + "T00:00:00.000Z";
//     let yesterdayEndTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
//     yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
//     const startTime = new Date(yesterdayStartTime); 
//     date = startTime;
//     const endTime = new Date(yesterdayEndTime); 
//     console.log("STime & ETime:",startTime,endTime)
   
//     let pnlDetailsData = await TenXTrader.aggregate([
//       {
//         $match: {
//           trade_time: {
//             $gte: startTime, $lte: endTime
//             // $gte: new Date("2023-06-23T00:00:00.000+00:00"), $lte: new Date("2023-06-23T23:59:59.000+00:00")
//             // $gte: new Date("2023-05-26T00:00:00.000+00:00")
//           },
//           status: "COMPLETE",
//         },
//       },
//         {
//           $group: {
//             _id: null,

//             amount: {
//               $sum: {$multiply : ["$amount",-1]},
//             },
//             turnover: {
//               $sum: {
//                 $toInt: {$abs : "$amount"},
//               },
//             },
//             brokerage: {
//               $sum: {
//                 $toDouble: "$brokerage",
//               },
//             },
//             lots: {
//               $sum: {
//                 $toInt: "$Quantity",
//               },
//             },
//             totallots: {
//               $sum: {
//                 $toInt: {$abs : "$Quantity"},
//               },
//             },
//             trades: {
//               $count:{}
//             },
//           },
//         },
//         {
//           $sort: {
//             _id: -1,
//           },
//         },
//       ])
//       console.log("Length:",pnlDetailsData.length,pnlDetailsData)
//       if(!pnlDetailsData || pnlDetailsData.length === 0){
//         console.log("Inside length check")
//         await pnlDetails(i+1);
//       }
//       else{
//         console.log("inside else statement:",pnlDetailsData)
//         return pnlDetailsData;
        
//       }    
//     }
    
//     let pnlData = await pnlDetails(i)
//     console.log("PNL Data:",i,pnlData)
//     res.status(201).json({ message: "pnl received", data: pnlData, results:(pnlData ? pnlData.length : 0), date:date });
// }

exports.overallTenXPnlYesterday = async (req, res, next) => {
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
    
    pnlDetailsData = await TenXTrader.aggregate([
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

exports.getDailyTenXUsers = async (req, res) => {
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

    const tenXTraders = await TenXTrader.aggregate(pipeline);

    // Create a date-wise mapping of DAUs for different products
    const dateWiseDAUs = {};

    tenXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
            tenXTrading: 0,
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].tenXTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { tenXTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = tenXTrading
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

exports.userSubscriptions = async (req, res) => {
  try {
    const userId = "63788f3991fc4bf629de6df0"
    // req.user._id;
    const subs = await Subscription.find({"users.userId": new ObjectId(userId)});
    
    console.log("userId", userId)
    let main = [];

    for(let elem of subs){
      const subsDetail = elem.users.filter((subelem)=>{
        return subelem.userId.toString() === userId.toString();
      })

      main.push({subscriptionName: elem.plan_name, subscriptionId: elem._id, userPurchaseDetail: subsDetail});
    }

    res.status(200).json({message: "user subscription fetched", data: main});
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};