const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTraderCompany = require("../models/mock-trade/infinityTradeCompany");
const InfinityTradeCompanyLive = require('../models/TradeDetails/liveTradeSchema')
// const { ObjectId } = require("mongodb");
const { client, getValue } = require('../marketData/redisClient');
// const User = require("../models/User/userDetailSchema");
// const InfinityTraderLive = require("../models/TradeDetails/infinityLiveUser")

exports.overallCompanySidePnlRedis = async (req, res, next) => {
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`overallMockPnlCompany`)) {
      let pnl = await client.get(`overallMockPnlCompany`)
      pnl = JSON.parse(pnl);
      console.log("pnl overall redis", pnl)

      res.status(201).json(pnl);

    } else {

      let pnlDetails = await InfinityTraderCompany.aggregate([
        {
          $lookup: {
            from: 'algo-tradings',
            localField: 'algoBox',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
          $match: {
            trade_time: {
              $gte: today
            },
            // status: "COMPLETE",
            "result.isDefault": true
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
            trades: {
              $count: {}
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
        await client.set(`overallMockPnlCompany`, JSON.stringify(pnlDetails))
        await client.expire(`overallMockPnlCompany`, secondsRemaining);
      }

      res.status(201).json(pnlDetails);
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.treaderWiseMockTraderRedis = async (req, res, next) => {
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`traderWiseMockPnlCompany`)) {
      let pnl = await client.get(`traderWiseMockPnlCompany`)
      pnl = JSON.parse(pnl);
      console.log("pnl redis trader wise", pnl)

      res.status(201).json(pnl);

    } else {

      let pnlDetails = await InfinityTraderCompany.aggregate([
        {
          $lookup: {
            from: 'algo-tradings',
            localField: 'algoBox',
            foreignField: '_id',
            as: 'algoBox'
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
          $match: {
            trade_time: {
              $gte: today
            },
            // status: "COMPLETE",
            "algoBox.isDefault": true
          },
        },

        {
          $group: {
            _id: {
              "traderId": "$trader",
              "traderName": "$user.name",
              "symbol": "$instrumentToken",
              "exchangeInstrumentToken": "$exchangeInstrumentToken",
              "algoId": "$algoBox._id",
              "algoName": "$algoBox.algoName"
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

      ])

      if (isRedisConnected) {
        await client.set(`traderWiseMockPnlCompany`, JSON.stringify(pnlDetails))
        await client.expire(`traderWiseMockPnlCompany`, secondsRemaining);
      }

      res.status(201).json(pnlDetails);
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}


exports.overallCompanySideLivePnlRedis = async (req, res, next) => {
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`overallLivePnlCompany`)) {
      let pnl = await client.get(`overallLivePnlCompany`)
      pnl = JSON.parse(pnl);
      console.log("pnl overall redis", pnl)

      res.status(201).json({message: 'Live Trader Data Company.', data: pnl});

    } else {

      let pnlDetails = await InfinityTradeCompanyLive.aggregate([
        {
          $lookup: {
            from: 'algo-tradings',
            localField: 'algoBox',
            foreignField: '_id',
            as: 'algo'
          }
        },
        {
          $match: {
            trade_time: {
              $gte: today
            },
            // status: "COMPLETE",
            "algo.isDefault": true
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
          $project: {
            _id: 0,
            symbol: "$_id.symbol",
            product: "$_id.product",
            amount: 1,
            brokerage: 1,
            instrumentToken: "$_id.instrumentToken",
            exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
            npnl: {
              $subtract: ["$amount", "$brokerage"]
            },
            lots: 1,
            lastaverageprice: 1
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
        await client.set(`overallLivePnlCompany`, JSON.stringify(pnlDetails))
        await client.expire(`overallLivePnlCompany`, secondsRemaining);
      }

      res.status(201).json({message: 'Live Trader Data Company.', data: pnlDetails});
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.treaderWiseLiveTraderRedis = async (req, res, next) => {
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`traderWiseLivePnlCompany`)) {
      let pnl = await client.get(`traderWiseLivePnlCompany`)
      pnl = JSON.parse(pnl);
      console.log("pnl redis trader wise", pnl)

      res.status(201).json({message: 'Live Trader Data Company.', data: pnl});

    } else {

      let pnlDetails = await InfinityTradeCompanyLive.aggregate([
        {
          $lookup: {
            from: 'algo-tradings',
            localField: 'algoBox',
            foreignField: '_id',
            as: 'algoBox'
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
          $match: {
            trade_time: {
              $gte: today
            },
            // status: "COMPLETE",
            "algoBox.isDefault": true
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
              "algoId": {
                $arrayElemAt: ["$algoBox._id", 0]
              },
              "algoName": {
                $arrayElemAt: ["$algoBox.algoName", 0]
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
        {
          $project: {
            _id: 0,
            traderId: "$_id.traderId",
            traderName: "$_id.traderName",
            symbol: "$_id.symbol",
            exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
            algoId: "$_id.algoId",
            algoName: "$_id.algoName",
            amount: 1,
            brokerage: 1,
            lots: 1,
            trades: 1,
            lotUsed: 1

          }
        },
        { $sort: { _id: -1 } },
      ])

      if (isRedisConnected) {
        await client.set(`traderWiseLivePnlCompany`, JSON.stringify(pnlDetails))
        await client.expire(`traderWiseLivePnlCompany`, secondsRemaining);
      }

      res.status(201).json({message: 'Live Trader Data Company.', data: pnlDetails});
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.getLetestLiveTradeCompany = async(req, res, next)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);    
  let isRedisConnected = getValue();
  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`lastTradeLive`)) {
      let trade = await client.get(`lastTradeLive`)
      trade = JSON.parse(trade);
      console.log("trade redis trader wise", trade)

      res.status(201).json({message: 'Letest Live Trade.', data: trade});

    } else {

      let trade = await InfinityTradeCompanyLive.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            }
          }
        },
        {
          $lookup: {
            from: 'user-personal-details',
            localField: 'trader',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            "_id": 0,
            "trade_time": 1,
            createdBy: {
              $concat: [
                { $arrayElemAt: ["$user.first_name", 0] },
                " ",
                { $arrayElemAt: ["$user.last_name", 0] }
              ]
            },
            "buyOrSell": 1,
            "Quantity": 1,
            "symbol": {
              $substr: ["$symbol", { $subtract: [{ $strLenCP: "$symbol" }, 7] }, 7]
            },
            "status": 1
          }
        },
        { $sort: { "trade_time": -1 } },
        { $limit: 1 }
      ])

      if (isRedisConnected) {
        await client.set(`lastTradeLive`, JSON.stringify(trade[0]))
        await client.expire(`lastTradeLive`, secondsRemaining);
      }

      res.status(201).json({message: 'Letest Live Trade.', data: trade[0]});
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.getLetestMockTradeCompany = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);    
  let isRedisConnected = getValue();
  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  try {

    if (isRedisConnected && await client.exists(`lastTradeDataMock`)) {
      let trade = await client.get(`lastTradeDataMock`)
      trade = JSON.parse(trade);
      console.log("trade redis trader wise", trade)

      res.status(201).json({message: 'Letest Live Trade.', data: trade});

    } else {

      let trade = await InfinityTraderCompany.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            }
          }
        },
        {
          $lookup: {
            from: 'user-personal-details',
            localField: 'trader',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            "_id": 0,
            "trade_time": 1,
            createdBy: {
              $concat: [
                { $arrayElemAt: ["$user.first_name", 0] },
                " ",
                { $arrayElemAt: ["$user.last_name", 0] }
              ]
            },
            "buyOrSell": 1,
            "Quantity": 1,
            "symbol": {
              $substr: ["$symbol", { $subtract: [{ $strLenCP: "$symbol" }, 7] }, 7]
            },
            "status": 1
          }
        },
        { $sort: { "trade_time": -1 } },
        { $limit: 1 }
      ])

      if (isRedisConnected) {
        await client.set(`lastTradeDataMock`, JSON.stringify(trade[0]))
        await client.expire(`lastTradeDataMock`, secondsRemaining);
      }

      res.status(201).json({message: 'Letest Live Trade.', data: trade[0]});
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }

  // let letestLive = await InfinityTraderCompany.aggregate(pipeline)

  // res.status(201).json({ message: 'Letest Live Trade.', data: letestLive[0] });
}
