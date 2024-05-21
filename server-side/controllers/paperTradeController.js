const PaperTrade = require("../models/mock-trade/paperTrade");
const Stock = require("../models/mock-trade/stockSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const { client, getValue } = require("../marketData/redisClient");
const { ObjectId } = require("mongodb");
const PaperTradeLeaderboard = require("../models/mock-trade/paperTradeLeaderboard");
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema");
const User = require("../models/User/userDetailSchema");
const mongoose = require("mongoose");
const moment = require('moment');
const LeaderboardParams = require('../models/LeaderboardParams/leaderboardSchema');
const { getIOValue } = require('../marketData/socketio');
const getKiteCred = require('../marketData/getKiteCred');
const axios = require('axios');
const UserPortfolio = require('../models/userPortfolio/UserPortfolio');
const { virtualPortfolioId } = require('../constant');
const {
  dailyPayout, weekPayout, monthPayout, quarterPayout
} = require('./paperTradePayoutController')
const PaperTradePayout = require("../models/mock-trade/paperTradePayout");
const Setting = require('../models/settings/setting');
const TradingHoliday = require('../models/TradingHolidays/tradingHolidays');
const {pnlPositionDatabase, pnlHoldingDatabase} = require("../controllers/stockTradeController");




exports.overallPnl = async (req, res, next) => {
  let isRedisConnected = getValue();
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round(
    (tempDate.getTime() - date.getTime()) / 1000
  );

  try {
    if (
      isRedisConnected &&
      (await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`))
    ) {
      let pnl = await client.get(
        `${req.user._id.toString()}: overallpnlPaperTrade`
      );
      pnl = JSON.parse(pnl);
      // console.log("pnl redis", pnl)

      res.status(201).json({ message: "pnl received", data: pnl });
    } else {
      let pnlDetails = await PaperTrade.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today,
            },
            status: "COMPLETE",
            trader: new ObjectId(userId),
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
              // exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              variety: "$variety",
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
      ]);

      const limitMargin = await PendingOrder.aggregate([
        {
          $match: {
            createdBy: new ObjectId(userId),
            type: "Limit",
            status: "Pending",
            createdOn: {
              $gte: today,
            },
            product_type: new ObjectId("65449ee06932ba3a403a681a"),
          },
        },
        {
          $sort: {
            createdOn: 1,
          },
        },
        {
          $group: {
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
          },
        },
      ]);

      const arr = [];
      for (let elem of limitMargin) {
        arr.push({
          _id: {
            symbol: elem._id.symbol,
            product: elem._id.product,
            instrumentToken: elem._id.instrumentToken,
            exchangeInstrumentToken: elem._id.exchangeInstrumentToken,
            exchange: elem._id.exchange,
            validity: elem._id.validity,
            variety: elem._id.variety,
            isLimit: true,
          },
          // amount: (tenxDoc.amount * -1),
          // brokerage: Number(tenxDoc.brokerage),
          lots: Number(elem.lots),
          // lastaverageprice: tenxDoc.average_price,
          margin: elem.margin,
        });
      }

      const newPnl = pnlDetails.concat(arr);

      if (isRedisConnected) {
        await client.set(
          `${req.user._id.toString()}: overallpnlPaperTrade`,
          JSON.stringify(newPnl)
        );
        await client.expire(
          `${req.user._id.toString()}: overallpnlPaperTrade`,
          secondsRemaining
        );
      }
      res.status(201).json({ message: "pnl received", data: newPnl });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "success", message: "something went wrong." });
  }
};

exports.myTodaysTrade = async (req, res, next) => {
  // const id = req.params.id
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const count = await PaperTrade.countDocuments({
    trader: userId,
    trade_time: { $gte: today },
  });
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await PaperTrade.find(
      { trader: userId, trade_time: { $gte: today } },
      {
        symbol: 1,
        buyOrSell: 1,
        Product: 1,
        Quantity: 1,
        amount: 1,
        status: 1,
        average_price: 1,
        trade_time: 1,
        order_id: 1,
        requiredMargin: 1
      }
    )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res
      .status(200)
      .json({ status: "success", data: myTodaysTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

exports.myHistoryTrade = async (req, res, next) => {
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const count = await PaperTrade.countDocuments({
    trader: userId,
    trade_time: { $lt: today },
  });
  // console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await PaperTrade.find(
      { trader: userId, trade_time: { $lt: today } },
      {
        symbol: 1,
        buyOrSell: 1,
        Product: 1,
        Quantity: 1,
        amount: 1,
        status: 1,
        average_price: 1,
        trade_time: 1,
        order_id: 1,
        requiredMargin: 1
      }
    )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res
      .status(200)
      .json({ status: "success", data: myHistoryTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

exports.marginDetail = async (req, res, next) => {
  let isRedisConnected = getValue();

  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round(
    (tempDate.getTime() - date.getTime()) / 1000
  );

  try {
    if (
      isRedisConnected &&
      (await client.exists(
        `${req.user._id.toString()} openingBalanceAndMarginPaper`
      ))
    ) {
      let marginDetail = await client.get(
        `${req.user._id.toString()} openingBalanceAndMarginPaper`
      );
      marginDetail = JSON.parse(marginDetail);

      res.status(201).json({ message: "pnl received", data: marginDetail });
    } else {
      const papertrade = await PaperTrade.find({trader: new ObjectId(req?.user?._id), portfolioId: new ObjectId('6433e2e5500dc2f2d20d686d')});
      const stocktrade = await Stock.find({trader: new ObjectId(req?.user?._id), portfolioId: new ObjectId('6433e2e5500dc2f2d20d686d')})

      const portfoliosFund = await Portfolio.aggregate([
        {
          $match: {
            status: "Active",
            portfolioType: "Virtual Trading",
          },
        },
        // {
        //   $lookup: {
        //     from: "paper-trades",
        //     localField: "_id",
        //     foreignField: "portfolioId",
        //     as: "paperTrades",
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "stock-trades",
        //     localField: "_id",
        //     foreignField: "portfolioId",
        //     as: "stockTrades",
        //   },
        // },
        {
          $addFields: {
            trades: {
              $concatArrays: [papertrade, stocktrade]
            }
          }
        },
        {
          $unwind: {
            path: "$trades",
          },
        },
        {
          $match: {
            "trades.trade_time": {
              $lt: today,
            },
            "trades.status": "COMPLETE",
            "trades.trader": new ObjectId(req.user._id),
          },
        },
        {
          $group: {
            _id: {
              portfolioId: "$_id",
              portfolioName: "$portfolioName",
              totalFund: "$portfolioValue",
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
            portfolioId: "$_id.portfolioId",
            portfolioName: "$_id.portfolioName",
            totalFund: "$_id.totalFund",
            npnl: {
              $subtract: ["$totalAmount", "$totalBrokerage"],
            },
            openingBalance: {
              $sum: [
                "$_id.totalFund",
                {
                  $subtract: ["$totalAmount", "$totalBrokerage"],
                },
              ],
            },
          },
        },
      ]);

      if (portfoliosFund.length > 0) {
        portfoliosFund[0].openingBalance =
          portfoliosFund[0].openingBalance <= 0
            ? 0
            : portfoliosFund[0].openingBalance;
        if (isRedisConnected) {
          await client.set(
            `${req.user._id.toString()} openingBalanceAndMarginPaper`,
            JSON.stringify(portfoliosFund[0])
          );
          await client.expire(
            `${req.user._id.toString()} openingBalanceAndMarginPaper`,
            secondsRemaining
          );
        }
        res.status(200).json({ status: "success", data: portfoliosFund[0] });
      } else {
        const portfoliosFund = await Portfolio.aggregate([
          {
            $match: {
              status: "Active",
              portfolioType: "Virtual Trading",
            },
          },
          {
            $group: {
              _id: {
                portfolioId: "$_id",
                portfolioName: "$portfolioName",
                totalFund: "$portfolioValue",
              },
            },
          },
          {
            $project: {
              _id: 0,
              portfolioId: "$_id.portfolioId",
              portfolioName: "$_id.portfolioName",
              totalFund: "$_id.totalFund",
            },
          },
        ]);
        if (isRedisConnected) {
          await client.set(
            `${req.user._id.toString()} openingBalanceAndMarginPaper`,
            JSON.stringify(portfoliosFund[0])
          );
          await client.expire(
            `${req.user._id.toString()} openingBalanceAndMarginPaper`,
            secondsRemaining
          );
        }
        res.status(200).json({ status: "success", data: portfoliosFund[0] });
      }
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "success", message: "something went wrong." });
  }
};

exports.findOpenLots = async (req, res, next) => {
  // console.log(new Date('2023-05-26'));
  const pipeline = [
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        trade_time: {
          $gt: new Date("2023-05-26"),
        },
        status: "COMPLETE",
      },
    },

    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: { trader: "$trader", symbol: "$symbol" },
        lots: {
          $sum: "$Quantity",
        },
      },
    },
  ];
  const lots = await InfinityTradeCompany.aggregate(pipeline);
  // console.log('open',lots, lots.length);
};


exports.treaderWiseMockTrader = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const pipeline = [
    {
      $match: {
        trade_time: {
          $gte: today,
        },
        status: "COMPLETE",
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
      $group: {
        _id: {
          traderId: "$trader",
          traderName: {
            $arrayElemAt: ["$user.name", 0],
          },
          symbol: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
          traderEmail: {
            $arrayElemAt: ["$user.email", 0],
          },
          traderMobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
        },
        margin: {
          $max: '$margin'
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" },
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        trades: {
          $count: {},
        },
        lotUsed: {
          $sum: { $abs: { $toInt: "$Quantity" } },
        },
      },
    },
    { $sort: { _id: -1 } },
  ];

  let x = await PaperTrade.aggregate(pipeline);
  res.status(201).json({ message: "data received", data: x });
};

async function fetchReferredUsersByInfluencer(influencerId) {
  let referredUserIds = await client.get(`referredUsers:${influencerId}`);
  if (!referredUserIds) {
    // Cache miss, query the database
    const users = await User.find({ referredBy: influencerId }, "_id");
    // console.log("users ref", users?.length);
    referredUserIds = users.map((user) => user._id.toString());
    // Update the cache
    await client.set(
      `referredUsers:${influencerId}`,
      JSON.stringify(referredUserIds),
      "EX",
      3600
    );
  } else {
    referredUserIds = JSON.parse(referredUserIds);
    // console.log(referredUserIds.length);
  }
  return referredUserIds;
}

async function fetchOrCacheUserDetail(userId) {
  let userDetails = await client.get(`userDetail:${userId}`);
  if (!userDetails) {
    // UserDetails not in cache, fetch from DB
    const userDetail = await User.findById(userId);
    if (userDetail) {
      userDetails = {
        name: userDetail.name,
        email: userDetail.email,
        mobile: userDetail.mobile,
      };
      // Cache the user details with an expiration time
      await client.set(
        `userDetail:${userId}`,
        JSON.stringify(userDetails),
        "EX",
        3600
      );
    }
  } else {
    userDetails = JSON.parse(userDetails);
  }
  return userDetails;
}

exports.influencerTraderWiseMockTrader = async (req, res, next) => {
  let date = new Date();
  let influencerId = req?.user?._id;
  // if (!influencerId) {
  //   influencerId = "65c314351716c34c69ff6b41";
  // }
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const referredUserIds = await fetchReferredUsersByInfluencer(influencerId);
  // console.log("length", referredUserIds.length);
  const referredUserObjectIds = referredUserIds.map((id) =>
    mongoose.Types.ObjectId(id)
  );

  // console.log(referredUserObjectIds, influencerId, req?.user?._id)

  const pipeline = [
    {
      $match: {
        trade_time: {
          $gte: today,
        },
        status: "COMPLETE",
        trader: { $in: referredUserObjectIds },
      },
    },
    {
      $group: {
        _id: {
          traderId: "$trader",
          symbol: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" },
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        trades: {
          $count: {},
        },
        lotUsed: {
          $sum: { $abs: { $toInt: "$Quantity" } },
        },
      },
    },
    { $sort: { _id: -1 } },
  ];

  let trades = await PaperTrade.aggregate(pipeline);
  for (let trade of trades) {
    // Fetch or cache user details dynamically
    const userDetails = await fetchOrCacheUserDetail(trade._id.traderId);
    if (userDetails) {
      // Enrich trade object with user details
      trade._id = { ...trade._id, ...userDetails };
    }
  }
  // console.log(trades.length);
  res.status(201).json({ message: "data received", data: trades });
};

exports.overallVirtualTraderPnl = async (req, res, next) => {
  // console.log("Inside overall virtual pnl")
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(today)
  let pnlDetails = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: today,
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
          $sum: { $multiply: ["$amount", -1] },
        },
        turnover: {
          $sum: {
            $toInt: { $abs: "$amount" },
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
            $toInt: { $abs: "$Quantity" },
          },
        },
        trades: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  res.status(201).json({ message: "pnl received", data: pnlDetails });
};

exports.liveTotalTradersCount = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  let pnlDetails = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: today,
          // $gte: new Date("2023-05-26T00:00:00.000+00:00")
        },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          trader: "$trader",
        },
        runninglots: {
          $sum: "$Quantity",
        },
      },
    },
    {
      $group: {
        _id: null,
        zeroLotsTraderCount: {
          $sum: {
            $cond: [{ $eq: ["$runninglots", 0] }, 1, 0],
          },
        },
        nonZeroLotsTraderCount: {
          $sum: {
            $cond: [{ $ne: ["$runninglots", 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        zeroLotsTraderCount: 1,
        nonZeroLotsTraderCount: 1,
      },
    },
  ]);
  res.status(201).json({ message: "pnl received", data: pnlDetails });
};

exports.overallVirtualPnlYesterday = async (req, res, next) => {
  let date;
  let i = 1;
  let maxDaysBack = 30; // define a maximum limit to avoid infinite loop
  let pnlDetailsData;

  while (!pnlDetailsData && i <= maxDaysBack) {
    let day = new Date();
    day.setDate(day.getDate() - i);
    let startTime = new Date(day.setHours(0, 0, 0, 0));
    let endTime = new Date(day.setHours(23, 59, 59, 999));
    date = startTime;

    pnlDetailsData = await PaperTrade.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime,
            $lte: endTime,
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
            $count: {},
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
      pnlDetailsData = null; // reset the value to ensure the while loop continues
      i++; // increment the day counter
    }
  }

  res.status(201).json({
    message: "pnl received",
    data: pnlDetailsData,
    results: pnlDetailsData ? pnlDetailsData.length : 0,
    date: date,
  });
};

exports.liveTotalTradersCountYesterday = async (req, res, next) => {
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  // console.log(yesterdayDate)
  let yesterdayStartTime = `${yesterdayDate.getFullYear()}-${String(
    yesterdayDate.getMonth() + 1
  ).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;
  yesterdayStartTime = yesterdayStartTime + "T00:00:00.000Z";
  let yesterdayEndTime = `${yesterdayDate.getFullYear()}-${String(
    yesterdayDate.getMonth() + 1
  ).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;
  yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
  const startTime = new Date(yesterdayStartTime);
  const endTime = new Date(yesterdayEndTime);
  // console.log("Query Timing: ", startTime, endTime)
  let pnlDetails = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: startTime,
          $lte: endTime,
          // $gte: new Date("2023-05-26T00:00:00.000+00:00")
        },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          trader: "$trader",
        },
        runninglots: {
          $sum: "$Quantity",
        },
      },
    },
    {
      $group: {
        _id: null,
        zeroLotsTraderCount: {
          $sum: {
            $cond: [{ $eq: ["$runninglots", 0] }, 1, 0],
          },
        },
        nonZeroLotsTraderCount: {
          $sum: {
            $cond: [{ $ne: ["$runninglots", 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        zeroLotsTraderCount: 1,
        nonZeroLotsTraderCount: 1,
      },
    },
  ]);
  res.status(201).json({ message: "pnl received", data: pnlDetails });
};

exports.getDailyVirtualUsers = async (req, res) => {
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

    const virtualTraders = await PaperTrade.aggregate(pipeline);

    // Create a date-wise mapping of DAUs for different products
    const dateWiseDAUs = {};

    virtualTraders.forEach((entry) => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
            virtualTrading: 0,
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].virtualTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach((date) => {
      const { virtualTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = virtualTrading;
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

exports.saveLeaderboardData = async () => {
  try {

    const date = new Date();
    let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    
    const checkRunningLots = await PaperTrade.aggregate([
      {
        $match: {
          trade_time: {
            $gte: new Date(today),
          },
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $match: {
          lots: {
            $ne: 0,
          },
        },
      },
    ]);

    const checkRunningLotsStock = await Stock.aggregate([
      {
        $match: {
          trade_time: {
            $gte: new Date(today),
          },
          Product: "MIS",
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $match: {
          lots: {
            $ne: 0,
          },
        },
      },
    ]);

    if (checkRunningLots?.length > 0 || checkRunningLotsStock?.length > 0) {
      return false;
    }

    const data = await PaperTrade.aggregate([
      {
        $match: {
          trade_time: {
            $gte: new Date(today),
          },
          status: "COMPLETE",
        },
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "portfolioId",
          foreignField: "_id",
          as: "portfolio",
        },
      },
      {
        $group: {
          _id: {
            traderId: "$trader",
            portfolioValue: {
              $arrayElemAt: ['$portfolio.portfolioValue', 0]
            },
          },

          margin: {
            $max: "$margin",
          },
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
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
          trades: {
            $count: {},
          },
          lotUsed: {
            $sum: {
              $abs: {
                $toInt: "$Quantity",
              },
            },
          },
        },
      },
      {
        $match: {
          lots: 0,
        },
      },
      {
        $project: {
          portfolioValue: "$_id.portfolioValue",
          trader: "$_id.traderId",
          _id: 0,
          margin: "$margin",
          grossPnl: "$amount",
          brokerage: "$brokerage",
          lotUsed: "$lotUsed",
          trades: "$trades",
          runningLots: "$lots",
          netPnl: {
            $subtract: ["$amount", "$brokerage"],
          },
          roi: {
            $divide: [
              {
                $multiply: [
                  {
                    $subtract: [
                      "$amount",
                      "$brokerage",
                    ],
                  },
                  100,
                ],
              },
              "$margin",
            ],
          },
        },
      },
      {
        $sort: {
          roi: -1,
        },
      },
    ]);

    const dataStock = await Stock.aggregate([
      {
        $match: {
          trade_time: {
            $gte: new Date(today),
          },
          Product: "MIS",
          status: "COMPLETE",
        },
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "portfolioId",
          foreignField: "_id",
          as: "portfolio",
        },
      },
      {
        $group: {
          _id: {
            traderId: "$trader",
            portfolioValue: {
              $arrayElemAt: ['$portfolio.portfolioValue', 0]
            },
          },
          margin: {
            $max: "$margin",
          },
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
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
          trades: {
            $count: {},
          },
          lotUsed: {
            $sum: {
              $abs: {
                $toInt: "$Quantity",
              },
            },
          },
        },
      },
      {
        $match: {
          lots: 0,
        },
      },
      {
        $project: {
          portfolioValue: "$_id.portfolioValue",
          trader: "$_id.traderId",
          _id: 0,
          margin: "$margin",
          grossPnl: "$amount",
          brokerage: "$brokerage",
          lotUsed: "$lotUsed",
          trades: "$trades",
          runningLots: "$lots",
          netPnl: {
            $subtract: ["$amount", "$brokerage"],
          },
          roi: {
            $divide: [
              {
                $multiply: [
                  {
                    $subtract: [
                      "$amount",
                      "$brokerage",
                    ],
                  },
                  100,
                ],
              },
              "$margin",
            ],
          },
        },
      },
      {
        $sort: {
          roi: -1,
        },
      },
    ]);

    const resultObj = {} ;

    // Sum npnl and brokerage values from data
    data.forEach((dataItem) => {
      const { trader, netPnl, grossPnl, lotUsed, trades, brokerage, margin, ...rest } = dataItem
      if (!resultObj[trader]) {
        resultObj[trader] = { trader, netPnl, grossPnl, lotUsed, trades, brokerage, margin, ...rest };
        resultObj[trader].npnlOption = netPnl;
        resultObj[trader].npnlStock = 0;

      } else {
        resultObj[trader].npnlOption += netPnl
        resultObj[trader].netPnl += netPnl
        // ((netPnl || 0) + (resultObj[trader].npnlStock || 0))
        resultObj[trader].brokerage += brokerage
        resultObj[trader].grossPnl += grossPnl
        resultObj[trader].lotUsed += lotUsed
        resultObj[trader].trades += trades
        resultObj[trader].margin = Math.max(margin, resultObj[trader].margin)

      }
    })
  
    // Sum netPnl and brokerage values from leaderboard
    dataStock.forEach((leaderItem) => {
      const { trader, netPnl, grossPnl, lotUsed, trades, brokerage, margin, ...rest } = leaderItem
      if (!resultObj[trader]) {
        resultObj[trader] = { trader, netPnl, grossPnl, lotUsed, trades, brokerage, margin, ...rest };
        resultObj[trader].npnlStock = netPnl;
        resultObj[trader].npnlOption = 0;
      } else {
        resultObj[trader].npnlStock += netPnl
        resultObj[trader].netPnl += netPnl
        // ((netPnl || 0) + (resultObj[trader].npnlOption || 0))
        resultObj[trader].brokerage += brokerage
        resultObj[trader].grossPnl += grossPnl
        resultObj[trader].lotUsed += lotUsed
        resultObj[trader].trades += trades
        resultObj[trader].margin = Math.max(margin, resultObj[trader].margin)
      }
    })

    // Convert result object into an array
    const result = Object.values(resultObj)
  
    const create = await PaperTradeLeaderboard.create(result);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.todayLeaderboardData = async (req, res) => {
  try {
    const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Daily' })
    const today = moment();
    const startOfDay = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    const endOfDay = today.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    const workingDays = await calculateWorkingDay(startOfDay, endOfDay);
    const data = await leaderboardDataHelper(startOfDay, endOfDay, leaderboardParams, workingDays);

    res.status(200).json({
      status: "success",
      data: data,
      startDate: new Date(),
      leaderboardSetting: {
        usersPerTable: leaderboardParams?.usersPerTable,
        tradingDaysAttendance: leaderboardParams?.tradingDaysAttendance || 80,
        workingDays: workingDays
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

exports.weeklyLeaderboardData = async (req, res) => {
  try {
    const today = moment();
    const startOfWeek = today.clone().startOf('week').subtract(5, 'hours').subtract(30, 'minutes');
    const endOfWeek = today.endOf('week').subtract(5, 'hours').subtract(30, 'minutes');

    const workingDays = await calculateWorkingDay(startOfWeek, endOfWeek);

    const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Weekly' })
    const data = await leaderboardDataHelper(startOfWeek, endOfWeek, leaderboardParams, workingDays);

    res.status(200).json({
      status: "success",
      data: data,
      reward: leaderboardParams?.rewards,
      startDate: new Date(startOfWeek),
      endDate : new Date(endOfWeek),
      leaderboardSetting: {
        usersPerTable: leaderboardParams?.usersPerTable,
        tradingDaysAttendance: leaderboardParams?.tradingDaysAttendance || 80,
        workingDays: workingDays
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

exports.monthlyLeaderboardData = async (req, res) => {
  try {
    const today = moment();
    const startOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    const endOfMonth = today.endOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    const workingDays = await calculateWorkingDay(startOfMonth, endOfMonth);

    const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Monthly' })
    const data = await leaderboardDataHelper(startOfMonth, endOfMonth, leaderboardParams, workingDays);

    res.status(200).json({
      status: "success",
      data: data,
      reward: leaderboardParams?.rewards,
      startDate: startOfMonth,
      endDate : endOfMonth,
      leaderboardSetting: {
        usersPerTable: leaderboardParams?.usersPerTable,
        tradingDaysAttendance: leaderboardParams?.tradingDaysAttendance || 80,
        workingDays: workingDays
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

exports.quarterlyLeaderboardData = async (req, res) => {
  try {
    
    const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Quarter' });
    const workingDays = await calculateWorkingDay(leaderboardParams?.quarterStartDate, leaderboardParams?.quarterEndDate);

    const data = await leaderboardDataHelper(leaderboardParams?.quarterStartDate, leaderboardParams?.quarterEndDate, leaderboardParams, workingDays);

    res.status(200).json({
      status: "success",
      data: data,
      reward: leaderboardParams?.rewards,
      startDate: leaderboardParams?.quarterStartDate,
      endDate : leaderboardParams?.quarterEndDate,
      leaderboardSetting: {
        usersPerTable: leaderboardParams?.usersPerTable,
        tradingDaysAttendance: leaderboardParams?.tradingDaysAttendance || 80,
        workingDays: workingDays
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const calculateWorkingDay = async(startDate)=>{
  const today  = moment();
  const endDate = today.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

  const holidays = await TradingHoliday.find({
    holidayDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    $expr: {
      $and: [
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
      ]
    }
  });
  const setting = await Setting.findOne();
  const workingDays = await getWorkingTradingDays(startDate, endDate, holidays, setting?.weekStart, setting?.weekEnd);

  console.log(workingDays, holidays, startDate, (endDate));
  return workingDays;
}

const leaderboardDataHelper = async (startDate, endDate, leaderboardParams, workingDays) => {

  const pipeline = [
    {
      $match: {
        createdOn: {
          $gt: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          trader: "$trader",
          portfolioValue: "$portfolioValue",
        },
        margin: {
          $max: "$margin",
        },
        grossPnl: {
          $sum: "$grossPnl",
        },
        netPnl: {
          $sum: "$netPnl",
        },
        npnlStock: {
          $sum: "$npnlStock",
        },
        npnlOption: {
          $sum: "$npnlOption",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        trades: {
          $sum: "$trades",
        },
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdOn",
            },
          },
        }
      },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "_id.trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        daysOfInterest: {
          $cond: {
            if: {
              $gte: [
                new Date(startDate),
                "$_id.joining_date",
              ],
            },
            then: {
              $divide: [
                {
                  $subtract: [
                    new Date(endDate),
                    new Date(startDate),
                  ], // Replace "endDate" and "startDate" with your date fields
                },
                86400000, // milliseconds in a day
              ],
            },
            else: {
              $divide: [
                {
                  $subtract: [
                    new Date(),
                    "$_id.joining_date",
                  ], // Replace "endDate" and "startDate" with your date fields
                },
                86400000, // milliseconds in a day
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        interestCost: {
          $multiply: [
            {
              $divide: [
                leaderboardParams?.marginMoneyInterest,
                36600
              ]
            },
            "$_id.portfolioValue",
            { $ceil: '$daysOfInterest' }
          ]
        }
      }
    },
    {
      $project: {
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
        photo: {
          $arrayElemAt: ["$user.profilePhoto.url", 0]
        },
        // portfolioValue: "$portfolioValue",
        joining_date: {
          $arrayElemAt: ["$user.joining_date", 0],
        },
        employeeid: {
          $arrayElemAt: ["$user.employeeid", 0],
        },
        // photo: "$_id.photo",
        // joining_date: "$_id.joining_date",
        // employeeid: '$_id.employeeid',
        daysOfInterest: 1,
        weekDays: 1,
        monthDays: 1,
        moneyCost: '$interestCost',
        pnlAfterCost: {
          $subtract: ['$netPnl', "$interestCost"]
        },
        // name: "$_id.name",
        _id: 0,
        margin: 1,
        portfolioValue: "$_id.portfolioValue",
        grossPnl: 1,
        npnl: '$netPnl',
        npnlOption: 1,
        npnlStock: 1,
        brokerage: 1,
        trades: 1,
        roi: {
          $divide: [
            {
              $multiply: ["$netPnl", 100],
            },
            "$margin",
          ],
        },
        tradingDays: {
          $size: '$tradingDays'
        },
        // attendancePer: {
        //   $multiply: [
        //     {
        //       $divide: [
        //         {
        //           $size: '$tradingDays'
        //         }, workingDays
        //       ]
        //     }, 100
        //   ]
        // }
      },
    },
    {
      $addFields: {
        workingDays: workingDays,
      },
    },
    {
      $sort: {
        pnlAfterCost: -1,
        netPnl: -1,
        grossPnl: -1,
      },
    },
    {
      $limit: (Number(leaderboardParams?.usersPerTable) || 10)
    }
  ];

  const data = await PaperTradeLeaderboard.aggregate(pipeline)
  return data;
}

exports.lastWeekChampion = async(req, res)=>{

  try {
    const today = moment();
    const lastWeekStartDate = today.clone().startOf('week').subtract(1, 'week');
    const lastWeekEndDate = today.clone().endOf('week').subtract(1, 'week');
    console.log(new Date(lastWeekStartDate), new Date(lastWeekEndDate))
    const getData = await PaperTradePayout.find({date: {$gt: new Date(lastWeekStartDate), $lt: new Date(lastWeekEndDate)}, frequency: 'Weekly'})
    .populate('trader', 'first_name last_name')
    .sort({rewardAmount: -1}).limit(3);
  
    res.status(200).json({
      status: "success",
      data: getData,
      startDate: lastWeekStartDate,
      endDate: lastWeekEndDate
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }

}

let isProcessingQueue = false;
exports.sendVirtualLeaderboardData = async () => {
  try {
    const leaderboardParams = await LeaderboardParams.findOne({ frequeny: 'Daily', status: 'Active' });
    const virtualMargin = await UserPortfolio.findOne({ _id: virtualPortfolioId });

    if (!isProcessingQueue) {
      isProcessingQueue = true;
      setInterval(() => processContestQueue(leaderboardParams, virtualMargin), 10000);
    }
  } catch (err) {
    console.log(err);
  }
};

async function processContestQueue(leaderboardParams, virtualMargin) {
  const io = getIOValue();
  // Get the current time
  const currentTime = new Date();
  const startTime = new Date(currentTime);
  startTime.setHours(3, 0, 0, 0);
  const endTime = new Date(currentTime);
  endTime.setHours(9, 48, 0, 0);

  let leaderBoard = [];
  if ((currentTime >= startTime) && (currentTime <= endTime)) {
    leaderBoard = await Leaderboard(leaderboardParams, virtualMargin);
  }

  // if (process.env.STAGING === 'true') {
  //   leaderBoard = await Leaderboard(leaderboardParams, virtualMargin);
  // }

  io.to(`${virtualMargin._id?.toString()}`).emit(`virtual-leaderboardData`, leaderBoard);
}

exports.sendVirtualMyRankData = async () => {
  const io = getIOValue();
  try {
    const emitLeaderboardData = async () => {
      const currentTime = new Date();
      const startTime = new Date(currentTime);
      startTime.setHours(3, 0, 0, 0);
      const endTime = new Date(currentTime);
      endTime.setHours(9, 48, 0, 0);

      if (currentTime >= startTime && currentTime <= endTime) {
        const room = io.sockets.adapter.rooms.get(virtualPortfolioId?.toString());
        const socketIds = Array.from(room ?? []);
        for (let j = 0; j < socketIds?.length; j++) {
          let userId = await client.get(socketIds[j]);
          let data = await client.get(`paperTradeData:${userId}${virtualPortfolioId?.toString()}`);
          data = JSON.parse(data);
          if (data) {
            let { employeeId } = data;
            const myRank = await getRedisMyRank(employeeId);
            io.to(`${virtualPortfolioId?.toString()}`).emit(`virtual-myrank${userId}`, myRank);
          }
        }
      }
    };
    emitLeaderboardData();
    interval = setInterval(emitLeaderboardData, 5000);
  } catch (err) {
    console.log(err);
  }

}

const uniqueUsers = async (today) => {
  const paperTrade = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: new Date(today),
        },
        status: "COMPLETE",
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
      $group: {
        _id: {
          traderId: "$trader",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          employeeid: {
            $arrayElemAt: ["$user.employeeid", 0],
          },
          joining_date: {
            $arrayElemAt: ["$user.joining_date", 0],
          },
          profilePhoto: {
            $arrayElemAt: ["$user.profilePhoto", 0],
          },
        },
      },
    },
    {
      $project: {
        joining_date: '$_id.joining_date',
        trader: "$_id.traderId",
        first_name: "$_id.first_name",
        last_name: "$_id.last_name",
        employeeid: "$_id.employeeid",
        profilePhoto: "$_id.profilePhoto",
      },
    },
  ])

  const stockTrade = await Stock.aggregate([
    {
      $match: {
        trade_time: {
          $gte: new Date(today),
        },
        Product: "MIS",
        status: "COMPLETE",
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
      $group: {
        _id: {
          traderId: "$trader",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          employeeid: {
            $arrayElemAt: ["$user.employeeid", 0],
          },
          joining_date: {
            $arrayElemAt: ["$user.joining_date", 0],
          },
          profilePhoto: {
            $arrayElemAt: ["$user.profilePhoto", 0],
          },
        },
      },
    },
    {
      $project: {
        joining_date: '$_id.joining_date',
        trader: "$_id.traderId",
        first_name: "$_id.first_name",
        last_name: "$_id.last_name",
        employeeid: "$_id.employeeid",
        profilePhoto: "$_id.profilePhoto",
      },
    },
  ])

  const concatedArray = paperTrade.concat(stockTrade);

  const uniqueTradersMap = new Map();
  concatedArray.forEach(item => uniqueTradersMap.set(item.trader, item));
  const uniqueTraders = Array.from(uniqueTradersMap.values());

  return (uniqueTraders);
}

const pnlAddingToArray = async(allParticipants)=>{
  let ranks = [];

  for (let i = 0; i < allParticipants.length; i++) {
    let pnl, stockIntraday;
    pnl = await client.get(`${allParticipants[i].trader.toString()}: overallpnlPaperTrade`)
    pnl = JSON.parse(pnl);
    pnl = pnl?.filter((elem) => {
      return !elem?._id?.isLimit
    })

    if(await client.exists(`${allParticipants[i].trader.toString()}: overallpnlIntraday`)){
      stockIntraday = await client.get(`${allParticipants[i].trader.toString()}: overallpnlIntraday`);
      stockIntraday = JSON.parse(stockIntraday);
      // console.log('stockIntraday redis', stockIntraday)
    } else {
      stockIntraday = await pnlPositionDatabase(allParticipants[i]?.trader)
      // console.log('stockIntraday db', stockIntraday)
    }

  stockIntraday = stockIntraday?.filter((elem) => {
    elem.stock = true;
    return !elem?._id?.isLimit
  })
     
  pnl = pnl?.concat(stockIntraday) || [];

    if (pnl) {
      for (let elem of pnl) {
        elem.trader = allParticipants[i]?.trader?.toString();
        elem.name = allParticipants[i]?.employeeid;
        elem.userName = allParticipants[i]?.first_name + " " + allParticipants[i]?.last_name;
        elem.photo = allParticipants[i]?.profilePhoto?.url;
        elem.joining_date = allParticipants[i]?.joining_date;
      }
    }

    // console.log(pnl);
    ranks = ranks.concat(pnl)
  }

  return ranks;
}

const Leaderboard = async (leaderboardParams, virtualMargin) => {

  const date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const interest = leaderboardParams?.marginMoneyInterest || 10;
  const usersPerTable = leaderboardParams?.usersPerTable || 10;
  const portfolioValue = virtualMargin?.portfolioValue;

  const allParticipants = await uniqueUsers(today);

  try {
    const ranks = await pnlAddingToArray(allParticipants);

    const uniqueData = new Set();

    ranks.forEach(item => {
      if (item) {
        const { symbol, instrumentToken, exchange } = item._id;
        uniqueData.add({ symbol, instrumentToken, exchange, lots: item.lots });
      }
    });

    const uniqueDataArray = Array.from(uniqueData);

    let addUrl;
    let livePrices = {};

    const data = await getKiteCred.getAccess();
    uniqueDataArray.forEach((elem, index) => {
      if (elem.lots !== 0) {
        if (index === 0) {
          addUrl = ('i=' + elem?.exchange + ':' + elem?.symbol);
        } else {
          addUrl += ('&i=' + elem?.exchange + ':' + elem?.symbol);
        }
      }
    });
    const ltpBaseUrl = `https://api.kite.trade/quote?${addUrl}`;
    let auth = 'token' + data.getApiKey + ':' + data.getAccessToken;

    let authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };

    const response = await axios.get(ltpBaseUrl, authOptions);
    for (let instrument in response.data.data) {
      livePrices[response.data.data[instrument].instrument_token] = response.data.data[instrument].last_price;
    }

    for (doc of ranks) {
      if (doc) {
        doc.rpnl = doc?.lots !== 0
          ? doc?.amount + doc?.lots * livePrices[doc?._id?.instrumentToken]
          : doc?.amount;
        doc.npnl = doc?.rpnl - doc?.brokerage;
        doc.portfolioValue = portfolioValue;
        doc.interest = interest;
      }
    }

    const result = await aggregateRanks(ranks);
    // console.log('result', result)

    for (let rank of result) {
      try {
        await client.set(`${rank.name} investedAmount`, JSON.stringify(rank));
        await client.ZADD(`leaderboard-paper`, {
          score: (rank.npnl + rank.npnlStock),
          value: JSON.stringify({ name: rank.name })
        });
      } catch (err) {
        console.log(err);
      }
    }

    const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard-paper`, "0", `${usersPerTable}`, 'WITHSCORES'])
    const formattedLeaderboard = await formatData(leaderBoard, interest, portfolioValue)

    // console.log("formattedLeaderboard", formattedLeaderboard)
    return formattedLeaderboard;
  } catch (e) {
    console.log("redis error", e);
  }
}

const getRedisMyRank = async (employeeId) => {

  try {
    if (await client.exists(`leaderboard-paper`)) {

      const leaderBoardRank = await client.ZREVRANK(`leaderboard-paper`, JSON.stringify({ name: employeeId }));
      // await client.del(`leaderboard-paper`)
      if (leaderBoardRank == null) return null
      return leaderBoardRank + 1
    } else {
      console.log("loading rank")
    }

  } catch (err) {
    console.log(err);
  }

}

async function aggregateRanks(ranks) {
  const result = {};
  for (const curr of ranks) {
    if (curr) {
      const { npnl, trader, name, userName, photo, brokerage, portfolioValue, interest, joining_date, stock } = curr;
      const traderId = trader;

      if (!result[traderId]) {
        result[traderId] = {
          traderId,
          interest, portfolioValue,
          name,
          // : employeeidObj[traderId.toString()]?.employeeid,
          npnl: 0,
          npnlStock: 0,
          brokerage: 0,
          userName,
          // : employeeidObj[traderId.toString()]?.name,
          photo,
          joining_date
          // : employeeidObj[traderId.toString()]?.photo,
        };
      }
      if(stock){
        result[traderId].npnlStock += npnl
      }
      result[traderId].npnl += npnl;
      result[traderId].brokerage += brokerage;
    }
  }
  return Object.entries(result).map(([key, value]) => value);
}

async function formatData(arr, interest, portfolioValue) {
  const formattedLeaderboard = [];

  for (let i = 0; i < arr.length; i += 2) {
    // Parse the JSON string to an object
    const obj = JSON.parse(arr[i]);
    const daysInYear = 366;
    // Add the npnl property to the object
    let data = await client.get(`${obj.name} investedAmount`)
    data = JSON.parse(data);
    obj.npnl = data?.npnl + data?.npnlStock;
    obj.npnlOption = data?.npnl;
    obj.npnlStock = data?.npnlStock
    obj.interest = Number(interest);
    obj.portfolioValue = Number(portfolioValue);
    obj.userName = data.userName;
    obj.photo = data.photo;
    obj.joining_date = data.joining_date;
    obj.brokerage = data.brokerage;
    obj.employeeid = obj.name;
    obj.tradingDays = 1;
    obj.moneyCost = (Number(interest) / (daysInYear * 100)) * Number(portfolioValue);
    // Add the object to the formattedLeaderboard array
    formattedLeaderboard.push(obj);
  }

  return formattedLeaderboard;
}

exports.payouts = async () => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const getMonthDate = today.getDate();

  await dailyPayout();

  // if (today.getDay() === 5)
    await weekPayout();

  if (lastDayOfMonth === getMonthDate)
    await monthPayout();

  const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Quarter' });
  const startOfDay = moment(leaderboardParams?.quarterEndDate).clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
  const endOfDay = moment(leaderboardParams?.quarterEndDate).clone().endOf('day').subtract(5, 'hours').subtract(30, 'minutes');
  const check = (new Date(startOfDay) <= new Date()) && (new Date(endOfDay) >= new Date());
  if (check)
    await quarterPayout();
};

exports.todayLeaderboardReward = async (req, res) => {
  try {
    const reward = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Daily' }).select('rewards');

    res.status(200).json({
      status: "success",
      data: reward
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
}

const getWorkingTradingDays = async (startDate, endDate, holidays, weekStart, weekEnd) => {
  let newDate = moment(startDate);
  let dayCount = 0;

  while (newDate <= moment(endDate)) {
    // console.log(newDate, moment(endDate), !isHoliday(newDate, holidays) && !isWeekend(newDate, weekStart, weekEnd), !isHoliday(newDate, holidays) , !isWeekend(newDate, weekStart, weekEnd))
    if (!isHoliday(newDate, holidays) && !isWeekend(newDate, weekStart, weekEnd)) {
      dayCount++;
    }
    newDate.add(1, 'day'); // Increment the date
  }

  return dayCount;
};

const isHoliday = (date, holidays) => {
  return holidays.some(elem => {
    return moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'day') &&
      moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'month') &&
      moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'year')
  });
};

const isWeekend = (date, weekStart, weekEnd) => {
  const newDate = date.clone().add(5, 'hours').add(30, 'minutes');
  return newDate.day() === weekStart || newDate.day() === weekEnd; // Sunday or Saturday
};
