const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const User = require("../models/User/userDetailSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const whatsAppService = require("../utils/whatsAppService")
const mediaURL = "https://dmt-trade.s3.amazonaws.com/carousels/WhastAp%20Msg%20Photo/photos/1697228055934Welcome%20to%20the%20world%20of%20Virtual%20Trading%20but%20real%20earning%21.png";
const mediaFileName = 'StoxHero'
const { client, getValue } = require('../marketData/redisClient');
const Wallet = require("../models/UserWallet/userWalletSchema");
const uuid = require('uuid');
const { ObjectId } = require("mongodb");
const sendMail = require('../utils/emailService');
const moment = require('moment');
const mongoose = require('mongoose');
const {createUserNotification} = require('../controllers/notification/notificationController');
const Setting = require("../models/settings/setting")

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

  // console.log(new Date(time) ,today)

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
            trade_time_utc: {
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

  let {subscriptionId} = req.params;
  // subscription = JSON.parse(subscription);
  // let {subscriptionId} =  subscription;

  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({ subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time_utc: { $gte: today } })
  // console.log("Under my today orders", userId, today)
  try {
    const myTodaysTrade = await TenXTrader.find({ subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time_utc: { $gte: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time_utc': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
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

  let {subscriptionId, subscribedOn, expiredOn  } = req.params;
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
  const count = await TenXTrader.countDocuments({subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time_utc: {$gte: subscribedOn, $lt: expiredOn } })
  // console.log("Under my today orders", userId, today)
  try {
    const myHistoryTrade = await TenXTrader.find({subscriptionId: new ObjectId(subscriptionId), trader: userId, trade_time_utc: {$gte: subscribedOn, $lt: expiredOn } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time_utc': 1, 'order_id': 1, 'subscriptionId': 1 }).populate('subscriptionId', 'plan_name')
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
                { $gt: ["$trades.trade_time_utc", "$users.subscribedOn"] },
                { $lt: ["$trades.trade_time_utc", today] }
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

      // console.log("subscription", subscription);
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
  // console.log("subscriptionId", subscriptionId, userId, today)

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
          date: "$trade_time_utc",
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

exports.autoExpireTenXSubscription = async () => {
  console.log("autoExpireSubscription running");
  const subscription = await Subscription.find();
  const setting = await Setting.find();

  for (let i = 0; i < subscription.length; i++) {
    let users = subscription[i].users;
    let subscriptionId = subscription[i]._id
    let validity = subscription[i].validity;
    let payoutPercentage = subscription[i].payoutPercentage;
    let expiryDays = subscription[i].expiryDays;
    for (let j = 0; j < users.length; j++) {
      const session = await mongoose.startSession();
      try{
        session.startTransaction();
        let userId = users[j].userId;
        let fee = users[j]?.fee;
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
                  date: "$trade_time_utc",
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
                        expiryDays,
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
                trade_time_utc: {
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
          let payoutAmountWithoutTDS = Math.min(pnl, profitCap);
          let payoutAmount = payoutAmountWithoutTDS;
          if(payoutAmountWithoutTDS>users[j]?.fee){
            payoutAmount = payoutAmountWithoutTDS - (payoutAmountWithoutTDS-users[j]?.fee)*setting[0]?.tdsPercentage/100;
          }
    

          // console.log("payoutAmount", (payoutAmount > 0 && tradingDays[0]?.totalTradingDays === validity))

          if (tradingDays.length && Math.floor(tradingDays[0]?.actualRemainingDay) <= 0) {
            // console.log(pnlDetails[0]?.npnl, pnl, profitCap, payoutAmount, userId)

            const user = await User.findOne({ _id: new ObjectId(userId), status: "Active" });
            if(user){


              let len = user.subscription.length;
              
              for (let k = len - 1; k >= 0; k--) {
                if (user.subscription[k].subscriptionId?.toString() === subscription[i]._id?.toString()) {
                  user.subscription[k].status = "Expired";
                  user.subscription[k].expiredOn = new Date();
                  user.subscription[k].expiredBy = "System";
                  if(tradingDays[0]?.totalTradingDays >= validity){
                    user.subscription[k].payout = (payoutAmount>0 ? payoutAmount?.toFixed(2) : 0) 
                    user.subscription[k].tdsAmount = payoutAmountWithoutTDS>users[j]?.fee? ((payoutAmountWithoutTDS-users[j]?.fee)*setting[0]?.tdsPercentage/100).toFixed(2):0;
                  }else{
                    user.subscription[k].payout=0;
                    user.subscription[k].tdsAmount=0;
                  }
                  // console.log("this is user", user)
                  // await user.save({session});
                  break;
                }
              }

              const subs = await Subscription.findOne({ _id: new ObjectId(subscription[i]._id) });
              let Subslen = subs.users.length;
              let subscribedOn;
              for (let k = Subslen - 1; k >= 0; k--) {
                if (subs.users[k].userId?.toString() === userId?.toString()) {
                  subs.users[k].status = "Expired";
                  subs.users[k].expiredOn = new Date();
                  subs.users[k].expiredBy = "System";
                  if(tradingDays[0]?.totalTradingDays >= validity){
                    subs.users[k].payout = (payoutAmount>0 ? payoutAmount?.toFixed(2) : 0) 
                    subs.users[k].tdsAmount = payoutAmountWithoutTDS>users[j]?.fee? ((payoutAmountWithoutTDS-users[j]?.fee)*setting[0]?.tdsPercentage/100).toFixed(2):0; 
                    subscribedOn = subs.users[k]?.subscribedOn;
                  }else{
                    subs.users[k].payout=0;
                    subs.users[k].tdsAmount=0;
                  }
                  // console.log("this is subs", subs)
                  // await subs.save({session});
                  break;
                }
              }
    
              console.log(payoutAmount, tradingDays[0]?.totalTradingDays, new ObjectId(userId));
              
              if(payoutAmount > 0 && tradingDays[0]?.totalTradingDays >= validity){
                console.log(user._id, user.first_name)
                const wallet = await Wallet.findOne({userId: new ObjectId(userId)});
                wallet.transactions = [...wallet.transactions, {
                      title: 'TenX Trading Payout',
                      description: `Amount Credited for the profit of ${subscription[i]?.plan_name} subscription`,
                      amount: (payoutAmount?.toFixed(2)),
                      transactionId: uuid.v4(),
                      transactionType: 'Cash'
                }];
                // await wallet.save({session});

                if (process.env.PROD == 'true') {
                  sendMail(user?.email, 'Tenx Payout Credited - StoxHero', `
                  <!DOCTYPE html>
                  <html>
                  <head>
                      <meta charset="UTF-8">
                      <title>StoxHero - TenX Payout</title>
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
                      <h1>StoxHero - TenX Payout</h1>
                      <p>Hi ${user.first_name},</p>
                      <p>Great news! We're thrilled to inform you that your TenX Subscription 💰 payout has been processed, and ${subscription[i]?.payoutPercentage}% of the Net P&L made under this subscription has been credited to your StoxHero Wallet 🎉. Please find the details below:</p>
                      <p>TenX Subscription: ${subscription[i]?.plan_name}</p>
                      <p>Subscription Purchase Date: ${moment.utc(subscribedOn).utcOffset('+05:30').format("DD-MMM hh:mm a")}</p>
                      <p>Amount Credited in StoxHero Wallet: ₹${payoutAmount.toLocaleString('en-IN')}</p>
                      <p>We are delighted to have traders like you on our platform. Keep learning and earning!</p>
                      <p>Note: 30% TDS has been deducted from your net payout amount.</p>
                      
                      <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                      <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                      <br/><br/>
                      <p>Thanks!</p>
                      <p>StoxHero Team</p>
            
                      </div>
                  </body>
                  </html>
                  `);
                }

                if(process.env.PROD == 'true'){
                  whatsAppService.sendWhatsApp({destination : user?.mobile, campaignName : 'tenx_payout_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, (subscription[i]?.payoutPercentage).toString(),subscription[i]?.plan_name, moment.utc(subscribedOn).utcOffset('+05:30').format("DD-MMM hh:mm a"), payoutAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
                  whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'tenx_payout_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, (subscription[i]?.payoutPercentage).toString(),subscription[i]?.plan_name, moment.utc(subscribedOn).utcOffset('+05:30').format("DD-MMM hh:mm a"), payoutAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
                }
                else {
                  whatsAppService.sendWhatsApp({destination : '7976671752', campaignName : 'tenx_payout_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, (subscription[i]?.payoutPercentage).toString(),subscription[i]?.plan_name, moment.utc(subscribedOn).utcOffset('+05:30').format("DD-MMM hh:mm a"), payoutAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
                  // whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'tenx_payout_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, subscription[i]?.payoutPercentage,subscription[i]?.plan_name, moment.utc(subs.users[k].subscribedOn).utcOffset('+05:30').format("DD-MMM hh:mm a"), payoutAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
                }
                
                await createUserNotification({
                  title:'TenX Payout Credited',
                  description:`₹${payoutAmount?.toFixed(2)} credited for your profit in TenX plan ${subscription[i]?.plan_name}`,
                  notificationType:'Individual',
                  notificationCategory:'Informational',
                  productCategory:'TenX',
                  user: user?._id,
                  priority:'High',
                  channels:['App', 'Email'],
                  createdBy:'63ecbc570302e7cf0153370c',
                  lastModifiedBy:'63ecbc570302e7cf0153370c'  
                }, session);

              }
              await session.commitTransaction();
            }
          }
        }
      }catch(e){
        console.log(e);
        await session.abortTransaction();
      }finally{
        await session.endSession();
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
        trade_time_utc: {
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
  // console.log(id, x)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallTenXPnl = async (req, res, next) => {
    // console.log("Inside overall tenx pnl")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    // console.log(today)
    let pnlDetails = await TenXTrader.aggregate([
      {
        $match: {
          trade_time_utc: {
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
          trade_time_utc: {
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
//           trade_time_utc: {
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
          trade_time_utc: {
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
          trade_time_utc: {
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

  let {id } = req.params

  // startDate = startDate + "T00:00:00.000Z";
  // endDate = endDate + "T23:59:59.000Z";

// console.log(startDate, endDate, id)
  let pipeline = [
    {
      $match: {
        // trade_time_utc: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        subscriptionId: new ObjectId(id)
      }
      // trade_time_utc : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group:
      {
        _id: {
          "date": { $substr: ["$trade_time_utc", 0, 10] },
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

  const {id} = req.params;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const subs = await Subscription.findOne({_id: id});

  const live = [
    {
      $match:
  
        {
          _id: new ObjectId(id),
        },
    },
    {
      $unwind: {
        path: "$users",
      },
    },
    {
      $lookup: {
        from: "tenx-trade-users",
        localField: "users.userId",
        foreignField: "trader",
        as: "trade",
      },
    },
    {
      $match: {
        "users.status": "Live",
      },
    },
    {
      $unwind: {
        path: "$trade",
      },
    },
    {
      $match: {
        "trade.status": "COMPLETE",
        "trade.subscriptionId": new ObjectId(id),
        $expr: {
          $and: [
            {
              $lte: [
                "$users.subscribedOn",
                "$trade.trade_time_utc",
              ],
            },
            {
              $gte: [
                today,
                "$trade.trade_time_utc",
              ],
            },
          ],
        },
      },
    },
    {
      $group:

        {
          _id: {
            startDate: "$users.subscribedOn",
            endDate: "$users.expiredOn",
            userId: "$trade.trader",
            validity: "$validity",
            profitCap: "$profitCap",
            isRenew: "$users.isRenew",
          },
          amount: {
            $sum: {
              $multiply: ["$trade.amount", -1],
            },
          },
          brokerage: {
            $sum: {
              $toDouble: "$trade.brokerage",
            },
          },
          trades: {
            $count: {},
          },
          tradingDays: {
            $addToSet: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$trade.trade_time_utc",
              },
            },
          },
        },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "_id.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        startDate: "$_id.startDate",
        endDate: "$_id.endDate",
        userId: "$_id.userId",
        grossPnl: "$amount",
        brokerage: "$brokerage",
        isRenew: "$_id.isRenew",
        _id: 0,
        npnl: {
          $subtract: ["$amount", "$brokerage"],
        },
        tradingDays: {
          $size: "$tradingDays",
        },
        trades: 1,
        payout: {
          $max: [
            {
              $min: [
                {
                  $divide: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $multiply: [
                                {
                                  $subtract: [
                                    "$amount",
                                    "$brokerage",
                                  ],
                                },
                                "$_id.validity",
                              ],
                            },
                            {
                              $size: "$tradingDays",
                            },
                          ],
                        },
                        10,
                      ],
                    },
                    100,
                  ],
                },
                "$_id.profitCap",
              ],
            },
            0,
          ],
        },
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
      },
    },
    {
      $sort:
  
        {
          payout: -1,
        },
    },
  ]

  const expired = [
    {
      $match:
      {
        _id: new ObjectId(id),
      },
    },
    {
      $unwind: {
        path: "$users",
      },
    },
    {
      $lookup: {
        from: "tenx-trade-users",
        localField: "users.userId",
        foreignField: "trader",
        as: "trade",
      },
    },
    {
      $match: {
        "users.status": "Expired",
      },
    },
    {
      $unwind: {
        path: "$trade",
      },
    },
    {
      $match: {
        "trade.status": "COMPLETE",
        "trade.subscriptionId": new ObjectId(id),
        $expr: {
          $and: [
            {
              $lte: [
                "$users.subscribedOn",
                "$trade.trade_time_utc",
              ],
            },
            {
              $gte: [
                "$users.expiredOn",
                "$trade.trade_time_utc",
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          startDate: "$users.subscribedOn",
          endDate: "$users.expiredOn",
          payout: "$users.payout",
          userId: "$trade.trader",
          cap: "$profitCap",
          expiredBy: "$users.expiredBy",
          isRenew: "$users.isRenew",
          validity: "$validity"
        },
        amount: {
          $sum: {
            $multiply: ["$trade.amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$trade.brokerage",
          },
        },
        trades: {
          $count: {},
        },
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$trade.trade_time_utc",
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "_id.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        expiredBy: "$_id.expiredBy",
        isRenew: "$_id.isRenew",
        startDate: "$_id.startDate",
        endDate: "$_id.endDate",
        userId: "$_id.userId",
        grossPnl: "$amount",
        brokerage: "$brokerage",
        _id: 0,
        npnl: {
          $subtract: ["$amount", "$brokerage"],
        },
        tradingDays: {
          $size: "$tradingDays",
        },
        trades: 1,
        payout: "$_id.payout",
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
      },
    },
    {
      $sort: {
        payout: -1,
        tradingDays: -1,
        npnl: -1
      },
    },
  ]



  let obj = {
    totalLiveUser: 0,
    totalExpiredUser: 0,
    totalExpectedPayout: 0,
    totalPayout: 0,
    totalRenewed: 0
  }
  const liveUser = await Subscription.aggregate(live)
  const expiredUser = await Subscription.aggregate(expired)

  liveUser.sort((a, b) => {
    if (a.npnl > 0 && b.npnl > 0) {
      return b.tradingDays - a.tradingDays;
    } else if (a.npnl <= 0 && b.npnl <= 0) {
      return b.npnl - a.npnl;
    } else {
      return b.npnl - a.npnl;
    }
  });

  for(let elem of liveUser){
    // obj.totalRenewed += elem?.isRenew ? 1 : 0;
    obj.totalExpectedPayout += elem?.payout
  }
  for(let elem of expiredUser){
    obj.totalPayout += elem?.payout
  }

  for(let elem of subs.users){
    if(elem.status === "Live"){
      obj.totalLiveUser += 1;
    }
    if(elem.status === "Expired"){
      obj.totalExpiredUser += 1;
    }
    if(elem.isRenew){
      obj.totalRenewed += 1;
    }
  }

  res.status(201).json({ message: "data received", liveUser: liveUser, expiredUser: expiredUser, data: obj });
}

exports.getDailyTenXUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time_utc", 0, 10],
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
    const userId = req.user._id;
    // "64647f61a09e4677cb5431e8"
    
    const subs = await Subscription.find({"users.userId": new ObjectId(userId)});
    
    // console.log("userId", userId)
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


// exports.backfillPayout = async(req,res) => {
//   try{
//     const inactive = await Subscription.find({status:'Inactive'});
//     let totalPayout = 0;
//     for(let sub of inactive){
//       let netPayout = 0;
//       const users = sub.users.filter((elem)=>elem?.status == 'Expired' && elem?.expiredBy!='User');
//       for(let user of users){
//         const pnl = await TenXTrader.aggregate([
//           {
//             $match: {
//               trade_time_utc: {
//                 $gte: new Date(user?.subscribedOn),
//                 $lte: new Date(user?.expiredOn)
//               },
//               status: "COMPLETE",
//               trader: new ObjectId(user?.userId),
//               subscriptionId: new ObjectId(sub?._id)
//             },
//           },
//           {
//             $group: {
//               _id: {
//                 // symbol: "$symbol",
//                 // product: "$Product",
//                 // instrumentToken: "$instrumentToken",
//                 // exchangeInstrumentToken: "$exchangeInstrumentToken",
//                 // exchange: "$exchange"
//                 "date": { $substr: ["$trade_time_utc", 0, 10] },
//               },
//               amount: {
//                 $sum: { $multiply: ["$amount", -1] },
//               },
//               brokerage: {
//                 $sum: {
//                   $toDouble: "$brokerage",
//                 },
//               },
//               lots: {
//                 $sum: {
//                   $toInt: "$Quantity",
//                 },
//               },
//               lastaverageprice: {
//                 $last: "$average_price",
//               },
//             },
//           },
//           {
//             $group: {
//               _id: { date: "$_id.date" },
//               tradingDays: { $sum: 1 },
//             },
//           },

//           {
//             $project:{
//               npnl: {$subtract:["$amount", "$brokerage"]},
//               tradingDays:1
//             }
//           },
//           {
//             $sort: {
//               _id: -1,
//             },
//           },
//         ]);
//         console.log('pnl', pnl[0]?.tradingDays);
//         const payout = pnl[0]?.tradingDays>=20 ? pnl[0]?.npnl*0.1>sub?.profitCap ? sub?.profitCap:pnl[0]?.npnl*0.1>=0?pnl[0]?.npnl*0.1:0: 0;
//         netPayout+=payout;
//         // console.log(`payout for user${user?.userId}`, payout, user?.subscribedOn, user?.expiredOn);
//       }
//       console.log(`Net payout for ${sub?.plan_name}`, netPayout);
//       totalPayout+=netPayout;
//     }
//     console.log('Total payout', totalPayout);
//   }catch(e){
//     console.log(e);
//   }
// }

exports.backfillPayouts = async (req, res) => {
  try {
      const inactive = await Subscription.find({ status: 'Inactive' });
      let totalPayout = 0;
      let subPayout = 0;
      let userPayout = 0;
      for (let sub of inactive) {
          let netPayout = 0;
          const users = sub.users.filter((elem) => elem?.status === 'Expired' && elem?.expiredBy !== 'User');
          for (let user of users) {
              const pnl = await TenXTrader.aggregate([
                  {
                      $match: {
                          trade_time_utc: {
                              $gte: new Date(user?.subscribedOn),
                              $lte: new Date(user?.expiredOn)
                          },
                          status: "COMPLETE",
                          trader: new ObjectId(user?.userId),
                          subscriptionId: new ObjectId(sub?._id)
                      },
                  },
                  {
                      $group: {
                          _id: {
                              "date": { $substr: ["$trade_time_utc", 0, 10] },
                          },
                          amount: {
                              $sum: { $multiply: ["$amount", -1] },
                          },
                          brokerage: {
                              $sum: { $toDouble: "$brokerage" },
                          }
                      },
                  },
                  {
                      $project: {
                          npnl: { $subtract: ["$amount", "$brokerage"] }
                      }
                  },
                  {
                      $group: {
                          _id: null,
                          totalNpnl: { $sum: "$npnl" },
                          tradingDays: { $sum: 1 }
                      }
                  }
              ]);
              let payout = 0;
              if (pnl[0]?.tradingDays >= 20) {
                  const possiblePayout = pnl[0]?.totalNpnl * 0.1;
                  const cappedPayout = Math.min(possiblePayout, sub?.profitCap);
                  payout = cappedPayout >= 0 ? cappedPayout : 0;
                  user.payout = payout.toFixed(2);
                  netPayout += payout;
              }else{
                user.payout = 0;
              }
              subPayout+=payout;
              // console.log('user', user);
              await sub.save({validateBeforeSave:false});
              let targetUser = await User.findOne({_id:new ObjectId(user?.userId)});
              // console.log('target', targetUser);
              if (targetUser) {
                for (let subscription of targetUser?.subscription) {
                    if (subscription.subscriptionId.toString() == sub._id.toString() && subscription?.status == 'Expired' && subscription?.expiredBy!= 'User') {
                        const isWithinMargin = moment(subscription.subscribedOn).isBetween(
                            moment(user.subscribedOn).subtract(2, 'minutes'),
                            moment(user.subscribedOn).add(2, 'minutes')
                        ) && moment(subscription.expiredOn).isBetween(
                            moment(user.expiredOn).subtract(2, 'minutes'),
                            moment(user.expiredOn).add(2, 'minutes')
                        );

                        // If the subscription dates match within the margin
                        if (isWithinMargin) {
                            // 3. Add the payout to the found subscription
                            subscription.payout = payout.toFixed(2);
                            userPayout+=payout;
                            // console.log(targetUser.subscription);
                            await targetUser.save({validateBeforeSave:false});
                        }
                    }
                }  
          }
          console.log(`Net payout for ${sub?.plan_name}`, netPayout);
          totalPayout += netPayout;
        }
        
        console.log('sub user', subPayout, userPayout);
      console.log('Total payout', totalPayout);

  } }catch (e) {
      console.log(e);
  }
  }

  exports.backfillPayout = async (req, res) => {
    try {
        const inactive = await Subscription.find({ status: 'Inactive' });
        let totalPayout = 0;
        let subPayout = 0;
        let userPayout = 0;

        for (let sub of inactive) {
            let netPayout = 0;
            const users = sub.users.filter((elem) => elem?.status === 'Expired' && elem?.expiredBy !== 'User');

            for (let user of users) {
              const pnl = await TenXTrader.aggregate([
                {
                    $match: {
                        trade_time_utc: {
                            $gte: new Date(user?.subscribedOn),
                            $lte: new Date(user?.expiredOn)
                        },
                        status: "COMPLETE",
                        trader: new ObjectId(user?.userId),
                        subscriptionId: new ObjectId(sub?._id)
                    },
                },
                {
                    $group: {
                        _id: {
                            "date": { $substr: ["$trade_time_utc", 0, 10] },
                        },
                        amount: {
                            $sum: { $multiply: ["$amount", -1] },
                        },
                        brokerage: {
                            $sum: { $toDouble: "$brokerage" },
                        }
                    },
                },
                {
                    $project: {
                        npnl: { $subtract: ["$amount", "$brokerage"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalNpnl: { $sum: "$npnl" },
                        tradingDays: { $sum: 1 }
                    }
                }
            ]);
                
                let payout = 0;
                if (pnl[0]?.tradingDays >= 20) {
                    const possiblePayout = pnl[0]?.totalNpnl * 0.1;
                    const cappedPayout = Math.min(possiblePayout, sub?.profitCap);
                    payout = cappedPayout >= 0 ? cappedPayout : 0;
                    
                    // Find and update the user object inside sub.users array
                    let userInSubscription = sub.users.id(user._id);
                    userInSubscription.payout = payout.toFixed(2);
                    if(payout>0) console.log('userid', user?.userId);
                    netPayout += payout;
                } else {
                    let userInSubscription = sub.users.id(user._id);
                    userInSubscription.payout = 0;
                }

                subPayout += payout;
                await sub.save({ validateBeforeSave: false });

                let targetUser = await User.findOne({ _id: new ObjectId(user?.userId) });
                if (targetUser) {
                    for (let subscription of targetUser?.subscription) {
                        if (subscription.subscriptionId.toString() == sub._id.toString() && subscription?.status == 'Expired' && subscription?.expiredBy != 'User') {
                            const isWithinMargin = moment(subscription.subscribedOn).isBetween(
                                moment(user.subscribedOn).subtract(2, 'minutes'),
                                moment(user.subscribedOn).add(2, 'minutes')
                            ) && moment(subscription.expiredOn).isBetween(
                                moment(user.expiredOn).subtract(2, 'minutes'),
                                moment(user.expiredOn).add(2, 'minutes')
                            );

                            if (isWithinMargin) {
                                subscription.payout = payout.toFixed(2);
                                userPayout += payout;
                                await targetUser.save({ validateBeforeSave: false });
                            }
                        }
                    }
                }

            }
            console.log(`Net payout for ${sub?.plan_name}`, netPayout);
            totalPayout += netPayout;
        }

        console.log('sub user', subPayout, userPayout);
        console.log('Total payout', totalPayout);

    } catch (e) {
        console.log(e);
    }
}
