const TradeData = require("../models/mock-trade/paperTrade");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const HistoryDataNew = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataTemp");
const User = require("../models/User/userDetailSchema");
const moment = require("moment");
// const TradableInstrumentSchema = require("../models/Instruments/tradableInstrumentsSchema");
// const AllTradableInstrumentSchema = require("../models/Instruments/allTradableInstrumentsSchema");
const {
  convertToTradingDataToGroup,
  mailSender,
  teamIndividualPerformance,
  getPreviousLots,
  createTradeDoc,
} = require("./timeframePnlChartHelper");
const IndiaVix = require("../models/Instruments/indiaVix");
const ThirdPartyPnl = require("../models/mock-trade/thirdPartyTradesPnl");
const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");
const UserDetail = require("../models/User/userDetailSchema");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("csv");
const { BlockBlobClient } = require("@azure/storage-blob");
let getStream;
(async () => {
  getStream = (await import("into-stream")).default;
})();
const csv = require("csv-parser");
const containerName = "dmt-trade";
const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

const uploadFileToAzure = async (file) => {
  const blobName = getBlobName(file.originalname);
  const blobService = new BlockBlobClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName,
    blobName
  );
  const stream = getStream(file.buffer);
  const streamLength = file.buffer.length;

  await blobService.uploadStream(stream, streamLength);

  const fileUrl = `${blobService.url}`;

  return { fileUrl, blobName };
};

exports.uploadMulter = uploadStrategy;

exports.isThirdPartyDataExist = async (req, res) => {
  try {
    const userId = req?.query?.user ?? req?.user?._id;
    const data = await ThirdPartyTrades.findOne({
      trader: new ObjectId(userId),
    });

    const checkDataProcessing = await User.findOne({
      _id: new ObjectId(userId),
    }).select("thirdPartyDataProcessing");
    res.status(200).json({
      status: "success",
      isExist: data ? true : false,
      isProcessing:
        userId === "team"
          ? false
          : checkDataProcessing?.thirdPartyDataProcessing,
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

const timeArray = async (todaysDatePart, timePeriod, frequency) => {
  const starting = new Date(`${todaysDatePart}T09:15:00.000+00:00`);
  const startTime = new Date(`${todaysDatePart}T09:15:59.000+00:00`);
  const test = new Date(`${todaysDatePart}T09:16:59.000+00:00`);
  const endTime = new Date(`${todaysDatePart}T15:30:59.000+00:00`);
  const timeArr = [];

  // Function to increment the time based on frequency
  const incrementTime = (time, period, freq) => {
    const newTime = new Date(time);
    switch (freq) {
      case "Min":
        newTime.setMinutes(newTime.getMinutes() + period);
        break;
      case "Hour":
        newTime.setHours(newTime.getHours() + period);
        break;
      case "Day":
        newTime.setDate(newTime.getDate() + period);
        break;
      default:
        throw new Error("Invalid frequency");
    }
    return newTime;
  };

  for (
    let time = startTime;
    time < endTime;
    time = incrementTime(time, timePeriod, frequency)
  ) {
    timeArr.push(time.toISOString());
  }

  return [starting.toISOString(), ...timeArr, endTime.toISOString()];
  // return [startTime.toISOString(), test.toISOString()];
};

const timeArrayForAvg = async (todaysDatePart, timePeriod, frequency) => {
  const starting = new Date(`${todaysDatePart}T09:15:00.000+00:00`);
  const startTime = new Date(`${todaysDatePart}T09:15:59.000+00:00`);
  const endTime = new Date(`${todaysDatePart}T15:30:59.000+00:00`);
  const timeArr = [];
  const test = new Date(`${todaysDatePart}T09:16:59.000+00:00`);

  // Function to increment the time based on frequency 2024-04-01T15:30:59.000+00:00
  const incrementTime = (time, period, freq) => {
    const newTime = new Date(time);
    switch (freq) {
      case "Min":
        newTime.setMinutes(newTime.getMinutes() + period);
        break;
      case "Hour":
        newTime.setHours(newTime.getHours() + period);
        break;
      case "Day":
        newTime.setDate(newTime.getDate() + period);
        break;
      default:
        throw new Error("Invalid frequency");
    }
    return newTime;
  };

  for (
    let time = startTime;
    time < endTime;
    time = incrementTime(time, timePeriod, frequency)
  ) {
    timeArr.push(time.toISOString().substring(11, 19));
  }

  return [
    starting.toISOString().substring(11, 19),
    ...timeArr,
    endTime.toISOString().substring(11, 19),
  ];
  // return [test.toISOString().substring(11, 19)];
};

const newPriceArray = async (
  timeArray,
  candlesArray,
  HistoryTickModel,
  thirdParty
) => {
  const priceObj = {};
  const symbolWiseArray = {};
  for (const [timeIndex, time] of timeArray.entries()) {
    if (!priceObj[time]) {
      priceObj[time] = [];
    }
    const utcTime = new Date(time);
    utcTime.setHours(utcTime.getHours() - 5);
    utcTime.setMinutes(utcTime.getMinutes() - 30);
    // utcTime.setHours(utcTime.getHours() - 5);
    // utcTime.setMinutes(utcTime.getMinutes() - 29);
    // utcTime.setSeconds(utcTime.getSeconds() - 1);

    for (const [candleIndex, candleObj] of candlesArray.entries()) {
      const candles = candleObj?.candles;
      if (!symbolWiseArray[candleObj?.symbol]) {
        symbolWiseArray[candleObj?.symbol] = [];
      }
      // const newCandleArr = [];
      // let particularCandle = candles[timeIndex];
      let particularCandle = candles.filter((elem) => {
        if (thirdParty === "false") {
          // Create a new Date object to avoid mutating the original timestamp
          const adjustedTimestamp = new Date(elem.timestamp);
          adjustedTimestamp.setSeconds(adjustedTimestamp.getSeconds() + 59);
          return adjustedTimestamp.getTime() === new Date(utcTime).getTime();
        } else {
          // Handle the case where thirdParty is not 'false'
          return (
            new Date(elem.timestamp).getTime() === new Date(utcTime).getTime()
          );
        }
      })?.[0];

      if (!particularCandle && timeIndex === 0) {
        // const historyData = await HistoryTickModel.findOne({symbol: candleObj?.symbol, 'candles.timestamp': {$lt: new Date(utcTime)}}).sort({'candles.timestamp': -1});
        // const lastCandleHistoryData = historyData?.candles?.[historyData.candles?.length-1] || {};
        const lastCandleHistoryData = {};

        lastCandleHistoryData.open = lastCandleHistoryData?.close || 0;
        symbolWiseArray[candleObj?.symbol].push(lastCandleHistoryData);
        priceObj[time].push({
          time: lastCandleHistoryData?.timestamp,
          symbol: candleObj?.symbol,
          open: lastCandleHistoryData?.open,
          close: lastCandleHistoryData?.close,
        });
      } else if (!particularCandle) {
        const arr = symbolWiseArray[candleObj?.symbol];
        const lastCandleHistoryData = JSON.parse(
          JSON.stringify(arr?.[arr?.length - 1])
        );
        lastCandleHistoryData.open = lastCandleHistoryData?.close || 0;
        symbolWiseArray[candleObj?.symbol].push(lastCandleHistoryData);
        priceObj[time].push({
          time: lastCandleHistoryData?.timestamp,
          symbol: candleObj?.symbol,
          open: lastCandleHistoryData?.open,
          close: lastCandleHistoryData?.close,
        });
      } else {
        symbolWiseArray[candleObj?.symbol].push(particularCandle);
        priceObj[time].push({
          time: particularCandle?.timestamp,
          symbol: candleObj?.symbol,
          open: particularCandle?.open,
          close: particularCandle?.close,
        });
      }
    }
  }
  return priceObj;
};

exports.avgPnlChart = async (req, res) => {
  try {
    const first = performance.now();
    let userIds = [];
    const fromDate = req.query.from;
    console.log(req.query.from, req.query.to);
    const weekday = req.query.weekday ?? "allDays";
    const demography = req.query.demography;
    const demographicGroup = req.query.demographicGroup;
    const timePeriod = Number(req.query.timePeriod) || 1;
    const frequency =
      req.query.frequency === "undefined" || !req.query.frequency
        ? "Hour"
        : req.query.frequency;
    const toDate =
      req.query.to === "undefined" || req.query.to === "Invalid date"
        ? req.query.from
        : req.query.to;
    console.log("toDate", toDate, fromDate);
    const user = req?.query?.user ?? req?.user?._id;
    let teamPerformance = [];
    console.log("user", user);
    if (user === "team") {
      const teamLead = await User.findOne({
        _id: new ObjectId(req?.user?._id),
      }).select("reportedBy");
      userIds = [...teamLead.reportedBy];
    } else {
      console.log("in else");
      userIds.push(new ObjectId(user));
    }

    console.log(demography, demographicGroup);
    if (demography && demographicGroup) {
      userIds = await demographicWiseChartHelper(
        demography,
        demographicGroup,
        req?.user?._id
      );
    }

    const startFromDate = moment(fromDate)
      .clone()
      .startOf("day")
      .subtract(5, "hours")
      .subtract(30, "minutes");
    const endToDate = moment(toDate).clone().endOf("day");

    if (user === "team") {
      const performance = await teamIndividualPerformance(
        startFromDate,
        endToDate,
        userIds
      );
      teamPerformance = [...performance];
    }

    console.log(userIds);

    const newtimeArr = await timeArrayForAvg(
      "2024-05-05",
      timePeriod,
      frequency
    );

    let dayOfWeek;
    if (weekday === "allDays") {
      dayOfWeek = [1, 2, 3, 4, 5, 6, 7];
    } else {
      const weekdays = [
        0,
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      dayOfWeek = [weekdays.findIndex((week) => week === weekday)];
    }

    const pnlData = await ThirdPartyPnl.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startFromDate),
            $lte: new Date(endToDate),
          },
          trader: {
            $in: userIds,
          },
        },
      },
      {
        $addFields: {
          dayOfWeek: {
            $dayOfWeek: "$date",
          },
        },
      },
      {
        $match: {
          dayOfWeek: { $in: dayOfWeek },
        },
      },
      {
        $unwind: {
          path: "$pnl",
        },
      },
      {
        $addFields: {
          stockPnl: {
            $cond: {
              if: {
                $not: {
                  $regexMatch: {
                    input: "$symbol",
                    regex: /\d/,
                  },
                },
                //   },
              },
              then: "$pnl.gpnl",
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            timestamp: "$pnl.timestamp",
            vix: "$pnl.vix",
          },
          gpnl: {
            $sum: "$pnl.gpnl",
          },
          pnlFinNifty: {
            $sum: "$pnl.pnlFinNifty",
          },
          sellPnl: {
            $sum: "$pnl.sellPnl",
          },
          buyPnl: {
            $sum: "$pnl.buyPnl",
          },
          noOfTrades: {
            $sum: "$pnl.noOfTrades",
          },
          entryLotsFrequency: {
            $sum: "$pnl.entryLotsFrequency",
          },
          usedLots: {
            $sum: "$pnl.usedLots",
          },
          entryLots: {
            $sum: { $abs: "$pnl.entryLots" },
          },
          pnlBankNifty: {
            $sum: "$pnl.pnlBankNifty",
          },
          pnlNifty: {
            $sum: "$pnl.pnlNifty",
          },
          runningLots: {
            $sum: "$pnl.runningLots",
          },
          stockPnl: {
            $sum: "$stockPnl",
          },
        },
      },
      {
        $project: {
          _id: 0,
          timestamp: "$_id.timestamp",
          vix: "$_id.vix",
          pnlNifty: 1,
          pnlBankNifty: 1,
          pnlFinNifty: 1,
          stockPnl: 1,
          averageEntryLots: {
            $cond: {
              if: {
                $eq: ["$entryLotsFrequency", 0],
              },
              then: 0,
              else: {
                $divide: ["$entryLots", "$entryLotsFrequency"],
              },
            },
          },
          averageLotsUsed: {
            $cond: {
              if: {
                $eq: ["$noOfTrades", 0],
              },
              then: 0,
              else: {
                $divide: ["$usedLots", "$noOfTrades"],
              },
            },
          },
          buyPnl: 1,
          sellPnl: 1,
          gpnl: 1,
          runningLots: 1,
        },
      },
      {
        $group: {
          _id: {
            time: {
              $dateToString: {
                format: "%H:%M:%S",
                date: "$timestamp",
              },
            },
          },
          averageLotsUsed: {
            $avg: "$averageLotsUsed",
          },
          averageEntryLots: {
            $avg: "$averageEntryLots",
          },
          vix: {
            $avg: "$vix",
          },
          pnlNifty: {
            $avg: "$pnlNifty",
          },
          pnlBankNifty: {
            $avg: "$pnlBankNifty",
          },
          buyPnl: {
            $avg: "$buyPnl",
          },
          sellPnl: {
            $avg: "$sellPnl",
          },
          pnlFinNifty: {
            $avg: "$pnlFinNifty",
          },
          gpnl: {
            $avg: "$gpnl",
          },
          runningLots: {
            $avg: "$runningLots",
          },
          stockPnl: {
            $avg: "$stockPnl",
          },
        },
      },
      {
        $project: {
          _id: 0,
          timestamp: "$_id.time",
          vix: 1,
          pnlNifty: 1,
          pnlBankNifty: 1,
          pnlFinNifty: 1,
          averageEntryLots: 1,
          averageLotsUsed: 1,
          buyPnl: 1,
          sellPnl: 1,
          gpnl: 1,
          runningLots: 1,
          stockPnl: 1,
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
      {
        $match: {
          timestamp: {
            $in: [...newtimeArr, "12:59:59", "15:30:59"],
          },
        },
      },
    ]);

    const pnlDiffrence = [];
    for (const elem of pnlData) {
      if (elem.timestamp === "12:59:59" || elem.timestamp === "15:30:59") {
        pnlDiffrence.push(elem);
      }
    }

    const performanceObj = {
      topPerformer: teamPerformance[teamPerformance?.length - 1],
      bottomPerformer: teamPerformance[0],
    };

    res.status(200).json({
      status: "success",
      data: pnlData,
      pnlDiffrence,
      teamPerformance: performanceObj,
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

exports.hourChart = async (req, res) => {
  try {
    const now = performance.now();
    const date = req.query.date;
    const thirdParty = req.query.thirdParty ?? "false";
    const timePeriod = Number(req.query.timePeriod) || 1;
    const frequency =
      req.query.frequency === "undefined" ? "Hour" : req.query.frequency;
    const TradeModel = thirdParty == "true" ? ThirdPartyTrades : TradeData;
    const HistoryTickModel =
      thirdParty == "true" ? HistoryDataNew : HistoryData;

    const userId = req?.user?._id;
    const today = moment(date);
    const startToday = today
      .clone()
      .startOf("day")
      .subtract(5, "hours")
      .subtract(30, "minutes");
    const endToday = today.clone().endOf("day");
    const pnlObjArr = [];

    const tradeData = await TradeModel.find({
      status: "COMPLETE",
      trader: new ObjectId(userId),
      trade_time: { $gt: new Date(startToday), $lt: new Date(endToday) },
    });

    const vixData = await IndiaVix.find({
      timestamp: { $gt: new Date(startToday), $lt: new Date(endToday) },
    });
    const symbolArr = tradeData.map((elem) => {
      return elem?.symbol;
    });

    const uniqueSymbolArr = [...new Set(symbolArr)];

    const todaysDatePart = new Date(endToday).toISOString()?.split("T")?.[0];
    const timeArr = await timeArray(todaysDatePart, timePeriod, frequency);

    const timeArrUtc = timeArr.map((elem) => {
      const utcTime = new Date(elem);
      utcTime.setHours(utcTime.getHours() - 5);
      utcTime.setMinutes(utcTime.getMinutes() - 30);
      return utcTime;
    });

    // console.log(uniqueSymbolArr, new Date(startToday), new Date(endToday), timeArrUtc)
    const historyTicksInstrument =
      thirdParty == "true"
        ? await HistoryTickModel.aggregate([
            {
              $match: {
                symbol: {
                  $in: uniqueSymbolArr,
                },
                "candles.timestamp": {
                  $gt: new Date(startToday),
                  $lt: new Date(endToday),
                },
              },
            },
            {
              $unwind: "$candles",
            },
            {
              $match: {
                "candles.timestamp": {
                  $in: timeArrUtc,
                },
              },
            },
            {
              $group: {
                _id: {
                  id: "$_id",
                  symbol: "$symbol",
                },
                candles: {
                  $push: "$candles",
                },
              },
            },
            {
              $project: {
                candles: 1,
                symbol: "$_id.symbol",
                _id: 0,
              },
            },
          ])
        : await HistoryTickModel.find({
            "candles.timestamp": {
              $gt: new Date(startToday),
              $lt: new Date(endToday),
            },
            symbol: { $in: uniqueSymbolArr },
          });

    const uniqueTicksArr = [
      ...new Map(
        historyTicksInstrument.map((item) => [item.symbol, item])
      ).values(),
    ];

    const newHistoryTicks = await newPriceArray(
      timeArr,
      uniqueTicksArr,
      HistoryTickModel,
      thirdParty
    );

    for (let i = 0; i < timeArr.length; i++) {
      const timePriceArr = newHistoryTicks[timeArr[i]];
      const filteredArr = tradeData.filter((elem) => {
        return (
          new Date(elem.trade_time) >= new Date(timeArr[0]) &&
          new Date(elem.trade_time) <= new Date(timeArr[i])
        );
      });

      const isLastElement = i === timeArr.length - 1;
      const vixFilteredArr = vixData.filter((elem) => {
        const elemDate = new Date(
          moment(elem.timestamp)
            .add(5, "hours")
            .add(30, "minutes")
            .add(59, "seconds")
            .toISOString()
        );

        const timeArrDate = new Date(timeArr[isLastElement ? i - 1 : i]);
        return elemDate.getTime() === timeArrDate.getTime();
      });

      const vix = isLastElement
        ? vixFilteredArr?.[0]?.["close"]
        : vixFilteredArr?.[0]?.["open"];

      filteredArr.sort((a, b) => {
        if (a.trade_time > b.trade_time) {
          return 1;
        }
        if (a.trade_time <= b.trade_time) {
          return -1;
        }
      });

      const marginUtilise = await getMarginUtilisation(filteredArr);
      const newData = await distinctBuySell(
        JSON.parse(JSON.stringify(filteredArr))
      );
      const arrData = await formatTradeData(filteredArr);
      const averageEntryLots = newData?.averageEntryLots;
      const formatedBuyArr = await formatTradeData(newData?.buyArr);
      const formatedSellArr = await formatTradeData(newData?.sellArr);

      if (tradeData.length && timePriceArr.length) {
        const buyPnlObj = await calculatePnl(
          formatedBuyArr,
          timePriceArr,
          timeArr[i],
          thirdParty
        );
        const sellPnlObj = await calculatePnl(
          formatedSellArr,
          timePriceArr,
          timeArr[i],
          thirdParty
        );
        const pnlObj = await calculatePnl(
          arrData,
          timePriceArr,
          timeArr[i],
          thirdParty
        );

        pnlObj.averageEntryLots = averageEntryLots;
        pnlObj.marginUtilise = marginUtilise;
        pnlObj.buyPnl = buyPnlObj.gpnl;
        pnlObj.sellPnl = sellPnlObj.gpnl;
        pnlObj.vix = vix;
        pnlObj.averageLotsUsed = newData?.averageLotsUsed;
        pnlObjArr.push(pnlObj);
      }
    }

    let pnl1PM = {},
      pnl3PM = {};
    for (const pnl of pnlObjArr) {
      new Date(pnl.timestamp), new Date(`${todaysDatePart}T13:00:59.000+00:00`);
      if (
        new Date(pnl.timestamp).getTime() ===
        new Date(`${todaysDatePart}T13:00:59.000+00:00`).getTime()
      ) {
        pnl1PM = pnl;
      }

      if (
        new Date(pnl.timestamp).getTime() ===
        new Date(`${todaysDatePart}T15:30:59.000+00:00`).getTime()
      ) {
        pnl3PM = pnl;
      }
    }

    console.log("check performance again", performance.now() - now);

    pnl1PM.pnlDiffrence = 0;
    pnl3PM.pnlDiffrence = pnl3PM?.gpnl - pnl1PM?.gpnl;
    res.status(200).json({
      status: "success",
      data: pnlObjArr,
      pnlDiffrence: [pnl1PM, pnl3PM],
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

const getMarginUtilisation = async (tradeData) => {
  const map = new Map();

  tradeData.forEach((trade) => {
    const { symbol, margin } = trade;
    if (map.has(symbol)) {
      const existingTrade = map.get(symbol);
      existingTrade.margin = Math.max(margin, existingTrade.margin);
    } else {
      map.set(symbol, { symbol, margin });
    }
  });
  // Convert map values back to an array
  const formattedData = Array.from(map.values());

  const totalMarginUtilised = formattedData.reduce((total, acc) => {
    return total + acc?.margin;
  }, 0);

  return totalMarginUtilised;
};

const distinctBuySell = async (tradeData) => {
  let totalEntryLots = 0;
  let totalEntryLotsFrequency = 0;
  let totalLotsUsed = 0;
  const buyArr = [];
  const sellArr = [];

  for (const elem of tradeData) {
    const { Quantity, buyOrSell, trade_time, symbol, average_price, amount } =
      elem;

    totalLotsUsed += Math.abs(Quantity);
    const previousTrades = tradeData.filter((trades) => {
      return new Date(trades.trade_time) < new Date(trade_time);
    });

    const pnlData = await formatTradeData(previousTrades);

    const mySymbol = pnlData.filter((pnl) => {
      return pnl?.symbol === symbol;
    });

    const runningLotForSymbol = mySymbol[0]?.Quantity;
    const transactionTypeForSymbol =
      mySymbol[0]?.Quantity >= 0 ? "BUY" : mySymbol[0]?.Quantity < 0 && "SELL";
    const quantity = Quantity;
    const transaction_type = buyOrSell;

    if (
      Math.abs(runningLotForSymbol) > Math.abs(quantity) &&
      transactionTypeForSymbol !== transaction_type
    ) {
      // if squaring of some quantity
      if (transactionTypeForSymbol === "BUY") {
        buyArr.push(elem);
      } else {
        sellArr.push(elem);
      }
    } else if (
      Math.abs(runningLotForSymbol) < Math.abs(quantity) &&
      transactionTypeForSymbol !== transaction_type
    ) {
      // if squaring of all quantity and adding more in reverse direction (square off more quantity)
      totalEntryLotsFrequency += 1;
      totalEntryLots += Math.abs(Quantity) - Math.abs(runningLotForSymbol);
      const newObjBuy = { ...elem };
      const newObjSell = { ...elem };

      if (transactionTypeForSymbol === "BUY") {
        const newAmountBuy =
          (Math.abs(amount) * Math.abs(runningLotForSymbol)) /
          Math.abs(Quantity);
        const newAmountsell =
          (Math.abs(amount) *
            (Math.abs(Quantity) - Math.abs(runningLotForSymbol))) /
          Math.abs(Quantity);
        buyArr.push({
          ...newObjBuy,
          Quantity: 0 - Math.abs(runningLotForSymbol),
          amount: 0 - newAmountBuy,
        });
        newObjSell.Quantity =
          0 - (Math.abs(Quantity) - Math.abs(runningLotForSymbol));

        newObjSell.amount = 0 - newAmountsell;
        sellArr.push(newObjSell);
      } else {
        const newAmountSell =
          (Math.abs(amount) * Math.abs(runningLotForSymbol)) /
          Math.abs(Quantity);
        const newAmountBuy =
          (Math.abs(amount) *
            (Math.abs(Quantity) - Math.abs(runningLotForSymbol))) /
          Math.abs(Quantity);

        sellArr.push({
          ...newObjSell,
          Quantity: Math.abs(runningLotForSymbol),
          amount: newAmountSell,
        });
        newObjBuy.Quantity = Math.abs(Quantity) - Math.abs(runningLotForSymbol);

        newObjBuy.amount = newAmountBuy;
        buyArr.push(newObjBuy);
      }
    } else if (
      Math.abs(runningLotForSymbol) === Math.abs(quantity) &&
      transactionTypeForSymbol !== transaction_type
    ) {
      // if squaring off all quantity
      if (transactionTypeForSymbol === "BUY") {
        buyArr.push(elem);
      } else {
        sellArr.push(elem);
      }
    } else if (transactionTypeForSymbol === transaction_type) {
      // if adding more quantity
      totalEntryLotsFrequency += 1;
      totalEntryLots += Quantity;

      if (transactionTypeForSymbol === "BUY") {
        buyArr.push(elem);
      } else {
        sellArr.push(elem);
      }
    } else {
      totalEntryLotsFrequency += 1;
      totalEntryLots += Quantity;

      if (buyOrSell === "BUY") {
        buyArr.push(elem);
      } else {
        sellArr.push(elem);
      }
    }
  }

  const averageEntryLots =
    Math.ceil(totalEntryLots / totalEntryLotsFrequency) || 0;
  const averageLotsUsed = totalLotsUsed / tradeData.length || 0;
  return {
    averageEntryLots,
    buyArr,
    sellArr,
    averageLotsUsed,
    totalEntryLots,
    totalEntryLotsFrequency,
    totalLotsUsed,
  };
};

const formatTradeData = async (tradeData) => {
  const map = new Map();

  console.log(
    "quantity3",
    tradeData.length,
    tradeData.reduce((total, acc) => total + acc.Quantity, 0)
  );

  tradeData.forEach((trade) => {
    const { symbol, amount, brokerage, Quantity, buyOrSell } = trade;
    if (map.has(symbol)) {
      const existingTrade = map.get(symbol);
      existingTrade.amount += amount * -1;
      existingTrade.brokerage += brokerage;
      existingTrade.Quantity += Quantity;
    } else {
      map.set(symbol, {
        symbol,
        amount: amount * -1,
        brokerage,
        Quantity,
        buyOrSell,
      });
    }
  });
  // Convert map values back to an array
  const formattedData = Array.from(map.values());
  return formattedData;
};

const calculatePnl = async (tradeData, ltpData, timestamp, thirdParty) => {
  // const timeInCalculate1 = performance.now();
  let totalGpnl = 0;
  let totalRunningLots = 0;
  let pnlNifty = 0;
  let pnlBankNifty = 0;
  let pnlFinNifty = 0;

  // const HistoryTickModel = thirdParty == "true" ? HistoryDataNew : HistoryData;
  console.log(
    "quantity4",
    tradeData.length,
    tradeData.reduce((total, acc) => total + acc.Quantity, 0)
  );

  for (const elem of tradeData) {
    const utcTimeStamp = new Date(timestamp);
    utcTimeStamp.setHours(utcTimeStamp.getHours() - 5);
    utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() - 30);
    // const newUtcTimeStamp = new Date(utcTimeStamp);
    // let isDayEnd = false;

    const getCandleArray = ltpData?.find(
      (subelem) => subelem?.symbol === elem?.symbol
    );

    if (!getCandleArray) continue;

    const ltp = getCandleArray?.open;
    // isDayEnd ? ltpCandle?.close || 0 : ltpCandle?.open || 0;
    if (ltp === undefined) continue;

    const gpnl =
      elem.Quantity !== 0 ? elem.amount + elem.Quantity * ltp : elem.amount;

    totalGpnl += gpnl;
    totalRunningLots += elem.Quantity;
    pnlNifty += elem?.symbol?.startsWith("NIFTY") ? gpnl : 0;
    pnlBankNifty += elem?.symbol?.startsWith("BANKNIFTY") ? gpnl : 0;
    pnlFinNifty += elem?.symbol?.startsWith("FINNIFTY") ? gpnl : 0;
  }

  // const timeInCalculate2 = performance.now();
  return {
    gpnl: totalGpnl,
    timestamp,
    runningLots: totalRunningLots,
    pnlNifty,
    pnlBankNifty,
    pnlFinNifty,
  };
};

exports.uploadCSV = async (req, res) => {
  try {
    const userId = req?.user?._id || "662f804700f04a05fe3c941f";
    const data = await uploadFileToAzure(req.file);
    const originalUrl = data?.fileUrl;
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/045115758852909416-shareIndia46099Aprtrunc.csv'
    const url = originalUrl?.split("/")[originalUrl?.split("/").length - 1];

    const savedData = await saveDataToDB(url, userId, res);
    await mailSender(userId);
    // const savedData = await saveDataToDBTesting(url, userId);
  } catch (err) {
    console.log(err);
    // res.status(400).json({
    //   status: "error",
    //   message: err?.message,
    // });
  }
};

async function downloadCsvBlob(url) {
  try {
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName,
      url
    );
    const downloadBlockBlobResponse = await blobService.download();
    return downloadBlockBlobResponse.readableStreamBody;
  } catch (err) {
    throw new Error(err);
  }
}

async function parseCsvStream(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    stream
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

const saveDataToDB = async (url, userId, res) => {
  try {
    const csvStream = await downloadCsvBlob(url);
    console.log("downloaded");
    const csvData = await parseCsvStream(csvStream);
    console.log("parsed");

    const tradeData = await convertToTradingDataToGroup(csvData, userId, res);
    if (tradeData === "Data Exist") {
      return "Data Exist";
    }

    await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          thirdPartyDataProcessing: true,
        },
      }
    );
    const symbolArr = [];
    let minDate = "3000-01-01";
    let maxDate = "2000-01-01";

    for (const key in tradeData) {
      const [symbol, date] = key.split("_");

      symbolArr.push(symbol);

      if (new Date(date).getTime() < new Date(minDate).getTime()) {
        minDate = date;
      }
      if (new Date(date).getTime() > new Date(maxDate).getTime()) {
        maxDate = date;
      }
    }

    let pointer = 0;
    const previousLotsObj = {};

    for (const key in tradeData) {
      pointer++;
      const symbolTradeArr = tradeData[key];
      const datePart = key.split("_")?.[1];
      const symbol = key.split("_")?.[0];
      let previousLots = 0;

      if (datePart === minDate) {
        previousLots = await getPreviousLots(symbol, datePart);
      } else {
        if (
          new Date(datePart).getTime() ===
          new Date(symbolTradeArr?.[0]?.expiry).getTime()
        ) {
          previousLots = 0;
        } else {
          previousLots = previousLotsObj[symbol] || 0;
        }
      }

      const startOfDate = moment(datePart)
        .clone()
        .startOf("day")
        .subtract(5, "hours")
        .subtract(30, "minutes");
      const endOfDate = moment(datePart).clone().endOf("day");

      const historyTick = await HistoryDataNew.find({
        "candles.timestamp": {
          $gt: new Date(startOfDate),
          $lt: new Date(endOfDate),
        },
        symbol: symbol,
      });

      console.log(
        new Date(startOfDate),
        new Date(endOfDate),
        historyTick.length
      );

      const previousLotTradeDoc = await createTradeDoc(
        symbol,
        datePart,
        historyTick?.[0]?.candles?.[0]?.open,
        previousLots,
        symbolTradeArr?.[0]?.expiry
      );
      const newSymbolArr = previousLots
        ? [previousLotTradeDoc, ...symbolTradeArr]
        : [...symbolTradeArr];

      const calculateLots = newSymbolArr.reduce((total, acc) => {
        return total + acc.Quantity;
      }, 0);

      if (calculateLots !== 0) {
        previousLotsObj[symbol] = calculateLots;
      }

      const pnlData = await chartHelper(newSymbolArr, datePart, historyTick);
      const saveData = await ThirdPartyPnl.create([
        {
          trader: userId,
          symbol,
          date: datePart,
          pnl: pnlData?.data,
        },
      ]);
    }

    await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          thirdPartyDataProcessing: false,
        },
      }
    );
    return "ok";
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const chartHelper = async (tradeData, date, historyTicksInstrument) => {
  try {
    // const now = performance.now();
    // const date = req.query.date;
    const thirdParty = "true";
    const timePeriod = 1;
    const frequency = "Min";
    // const TradeModel = thirdParty == "true" ? ThirdPartyTrades : TradeData;
    const HistoryTickModel =
      thirdParty == "true" ? HistoryDataNew : HistoryData;

    // const userId = req?.user?._id;
    const today = moment(date);
    const startToday = today
      .clone()
      .startOf("day")
      .subtract(5, "hours")
      .subtract(30, "minutes");
    const endToday = today.clone().endOf("day");
    const pnlObjArr = [];

    const vixData = await IndiaVix.find({
      timestamp: { $gt: new Date(startToday), $lt: new Date(endToday) },
    });
    // const symbolArr = tradeData.map((elem) => {
    //   return elem?.symbol;
    // });

    // const uniqueSymbolArr = [...new Set(symbolArr)];

    const todaysDatePart = new Date(endToday).toISOString()?.split("T")?.[0];
    const timeArr = await timeArray(todaysDatePart, timePeriod, frequency);

    const uniqueTicksArr = [
      ...new Map(
        historyTicksInstrument.map((item) => [item.symbol, item])
      ).values(),
    ];

    const newHistoryTicks = await newPriceArray(
      timeArr,
      uniqueTicksArr,
      HistoryTickModel,
      thirdParty
    );

    for (let i = 0; i < timeArr.length; i++) {
      const timePriceArr = newHistoryTicks[timeArr[i]];
      const filteredArr = tradeData.filter((elem) => {
        return (
          new Date(elem.trade_time) >= new Date(timeArr[0]) &&
          new Date(elem.trade_time) <= new Date(timeArr[i])
        );
      });

      console.log(
        "quantity2",
        filteredArr.length,
        filteredArr.reduce((total, acc) => total + acc.Quantity, 0)
      );

      const isLastElement = i === timeArr.length - 1;
      const vixFilteredArr = vixData.filter((elem) => {
        const elemDate = new Date(
          moment(elem.timestamp)
            .add(5, "hours")
            .add(30, "minutes")
            .add(59, "seconds")
            .toISOString()
        );

        const timeArrDate = new Date(timeArr[isLastElement ? i - 1 : i]);
        return elemDate.getTime() === timeArrDate.getTime();
      });

      const vix = isLastElement
        ? vixFilteredArr?.[0]?.["close"]
        : vixFilteredArr?.[0]?.["open"];

      filteredArr.sort((a, b) => {
        if (a.trade_time > b.trade_time) {
          return 1;
        }
        if (a.trade_time <= b.trade_time) {
          return -1;
        }
      });

      const marginUtilise = await getMarginUtilisation(filteredArr);
      const newData = await distinctBuySell(
        JSON.parse(JSON.stringify(filteredArr))
      );
      const arrData = await formatTradeData(filteredArr);
      const averageEntryLots = newData?.averageEntryLots;
      const formatedBuyArr = await formatTradeData(newData?.buyArr);
      const formatedSellArr = await formatTradeData(newData?.sellArr);

      if (tradeData.length && timePriceArr.length) {
        const buyPnlObj = await calculatePnl(
          formatedBuyArr,
          timePriceArr,
          timeArr[i],
          thirdParty
        );
        const sellPnlObj = await calculatePnl(
          formatedSellArr,
          timePriceArr,
          timeArr[i],
          thirdParty
        );
        const pnlObj = await calculatePnl(
          arrData,
          timePriceArr,
          timeArr[i],
          thirdParty
        );

        pnlObj.averageEntryLots = averageEntryLots;
        pnlObj.marginUtilise = marginUtilise;
        pnlObj.buyPnl = buyPnlObj.gpnl;
        pnlObj.sellPnl = sellPnlObj.gpnl;
        pnlObj.vix = vix;
        pnlObj.averageLotsUsed = newData?.averageLotsUsed;

        pnlObj.entryLots = newData?.totalEntryLots;
        pnlObj.usedLots = newData?.totalLotsUsed;
        pnlObj.entryLotsFrequency = newData?.totalEntryLotsFrequency;
        pnlObj.noOfTrades = filteredArr?.length;
        pnlObjArr.push(pnlObj);
      }
    }

    return {
      data: pnlObjArr,
      // pnlDiffrence: [pnl1PM, pnl3PM],
      // pipeline
    };
  } catch (err) {
    console.log(err);
  }
};

const demographicWiseChartHelper = async (
  demography,
  demographicGroup,
  teamLeadId
) => {
  let userIds = [];
  const experienceLevel = 3;
  const users = (
    await User.findOne({
      _id: new ObjectId(teamLeadId),
    })
      .populate(
        "reportedBy",
        "first_name last_name city_tier gender trading_exp family_yearly_income employeed _id"
      )
      .select("reportedBy")
  ).reportedBy;

  // console.log(users, demography, demographicGroup)

  if (demography === "gender") {
    userIds = users.map((user) => {
      if (user.gender === demographicGroup) {
        return user._id;
      }
    });
  }

  if (demography === "city_tier") {
    userIds = users.map((user) => {
      if (user.toObject().city_tier == demographicGroup) {
        return user._id;
      }
    });
  }

  if (demography === "experience") {
    // const regex = /\d+/;
    // const result = demographicGroup.match(regex);
    // const number = parseInt(result[0], 10);

    // if(demographicGroup.includes('Less') || demographicGroup.includes('<')){
    //   userIds = users.map((user)=>{
    //     if(user.trading_exp <= number){
    //       return user._id;
    //     }
    //   })
    // }
    // if(demographicGroup.includes('Greater') || demographicGroup.includes('>')){
    //   userIds = users.map((user)=>{
    //     if(user.trading_exp >= number){
    //       return user._id;
    //     }
    //   })
    // }
    if (demographicGroup === "experienced") {
      userIds = users.map((user) => {
        if (user.trading_exp >= experienceLevel) {
          return user._id;
        }
      });
    } else {
      userIds = users.map((user) => {
        if (user.trading_exp < experienceLevel) {
          return user._id;
        }
      });
    }
  }

  if (demography === "family_income") {
    const regex = /(\d+)/g;
    const numbers = demographicGroup.match(regex).map(Number);

    if (demographicGroup.includes("Less") || demographicGroup.includes("<")) {
      userIds = users
        .map((user) => {
          if (user.family_yearly_income <= numbers[0]) {
            return user._id;
          }
        })
        .filter(Boolean);
    } else if (
      demographicGroup.includes("Greater") ||
      demographicGroup.includes(">")
    ) {
      userIds = users
        .map((user) => {
          if (user.family_yearly_income >= numbers[0]) {
            return user._id;
          }
        })
        .filter(Boolean);
    } else if (numbers.length === 2) {
      // Handling range case
      userIds = users
        .map((user) => {
          if (
            user.family_yearly_income >= numbers[0] &&
            user.family_yearly_income <= numbers[1]
          ) {
            return user._id;
          }
        })
        .filter(Boolean);
    }
  }

  if (demography === "employment") {
    const employeed =
      demographicGroup === "employed"
        ? true
        : demographicGroup === "unemployed" && false;
    userIds = users.map((user) => {
      if (user.employeed === employeed) {
        return user._id;
      }
    });
  }

  return userIds;
};

// 'Male'
// 'Female'
// 'Tier1'
// 'Tier2'
// 'Tier3'

exports.deleteThirdParty = async (req, res) => {
  const data = await ThirdPartyTrades.deleteMany({
    trader: new ObjectId(
      // "63788f3991fc4bf629de6df0"
      "6666997a93c01d363f79419f"
    ),
    // new ObjectId("642c6434573edbfcb2ac45a5"),
  });

  const newdata = await ThirdPartyPnl.deleteMany({
    trader: new ObjectId(
      // "63788f3991fc4bf629de6df0"
      "6666997a93c01d363f79419f"
    ),
  });

  res.status(200).json({
    status: "success",
    data: { data, newdata },
  });
};

exports.addBrokerage = async (req, res) => {
  try {
    // Update documents where brokerage is less than 0
    // await ThirdPartyTrades.updateMany(
    //   { brokerage: { $lt: 0 } },
    //   [
    //     { $set: { brokerage: { $abs: "$brokerage" } } }
    //   ]
    // );

    // Update documents where brokerage is not defined
    await ThirdPartyTrades.updateMany({ brokerage: { $exists: false } }, [
      { $set: { brokerage: { $multiply: [{ $toDouble: "$amount" }, 0.001] } } },
    ]);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getReportedBy = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await UserDetail.findById(userId)
      .populate("reportedBy", "first_name _id") // Populate only the first_name and _id fields
      .select("first_name _id reportedBy"); // Select only the relevant fields

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the response array
    const response = [
      {
        first_name: currentUser.first_name,
        _id: currentUser._id,
      },
      ...currentUser.reportedBy.map((user) => ({
        first_name: user.first_name,
        _id: user._id,
      })),
    ];

    // Send the response
    res.status(200).json({ status: "success", data: response });
  } catch (error) {
    console.error("Error fetching reportedBy users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
