const TradeData = require("../models/mock-trade/paperTrade");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const HistoryDataNew = require("../models/InstrumentHistoricalData/InstrumentHistoricalDataTemp");

const moment = require("moment");
const TradableInstrumentSchema = require("../models/Instruments/tradableInstrumentsSchema");
const AllTradableInstrumentSchema = require("../models/Instruments/allTradableInstrumentsSchema");

const IndiaVix = require("../models/Instruments/indiaVix");

const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");
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
    const userId = req.user._id;
    const data = await ThirdPartyTrades.findOne({
      trader: new ObjectId(userId),
    });
    res.status(200).json({
      status: "success",
      isExist: data ? true : false,
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
    const startTime = new Date(`${todaysDatePart}T09:15:59.000+00:00`);
    const endTime = new Date(`${todaysDatePart}T15:30:59.000+00:00`);
    const timeArr = [];

    // Function to increment the time based on frequency
    const incrementTime = (time, period, freq) => {
        const newTime = new Date(time);
        switch (freq) {
            case 'Min':
                newTime.setMinutes(newTime.getMinutes() + period);
                break;
            case 'Hour':
                newTime.setHours(newTime.getHours() + period);
                break;
            case 'Day':
                newTime.setDate(newTime.getDate() + period);
                break;
            default:
                throw new Error('Invalid frequency');
        }
        return newTime;
    }

    for (let time = startTime; time < endTime; time = incrementTime(time, timePeriod, frequency)) {
        timeArr.push(time.toISOString());
    }

    return [...timeArr, endTime.toISOString()];
}


const newPriceArray = async (timeArray, candlesArray, HistoryTickModel, thirdParty) => {
    const priceObj = {};
    const symbolWiseArray = {};
    for(const [timeIndex, time] of timeArray.entries()){
        if(!priceObj[time]){
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
            if(!symbolWiseArray[candleObj?.symbol]){
                symbolWiseArray[candleObj?.symbol] = [];
            }
            // const newCandleArr = [];
            // let particularCandle = candles[timeIndex];
            let particularCandle = candles.filter((elem) => {
              if (thirdParty === 'false') {
                  // Create a new Date object to avoid mutating the original timestamp
                  const adjustedTimestamp = new Date(elem.timestamp);
                  adjustedTimestamp.setSeconds(adjustedTimestamp.getSeconds() + 59);
                  console.log(adjustedTimestamp, new Date(utcTime))
                  return adjustedTimestamp.getTime() === new Date(utcTime).getTime();
              } else {
                  // Handle the case where thirdParty is not 'false'
                  return new Date(elem.timestamp).getTime() === new Date(utcTime).getTime();
              }
          })?.[0];
          

            if((!particularCandle) && timeIndex === 0){
                // const historyData = await HistoryTickModel.findOne({symbol: candleObj?.symbol, 'candles.timestamp': {$lt: new Date(utcTime)}}).sort({'candles.timestamp': -1});
                // const lastCandleHistoryData = historyData?.candles?.[historyData.candles?.length-1] || {};
                const lastCandleHistoryData = {};

                lastCandleHistoryData.open = lastCandleHistoryData?.close || 0;
                symbolWiseArray[candleObj?.symbol].push(lastCandleHistoryData);
                priceObj[time].push({
                    time: lastCandleHistoryData?.timestamp,
                    symbol: candleObj?.symbol,
                    open: lastCandleHistoryData?.open,
                    close: lastCandleHistoryData?.close
                })
            }else if(!particularCandle){
                const arr = symbolWiseArray[candleObj?.symbol];
                const lastCandleHistoryData = JSON.parse(JSON.stringify(arr?.[arr?.length-1]));
                lastCandleHistoryData.open = lastCandleHistoryData?.close || 0;
                symbolWiseArray[candleObj?.symbol].push(lastCandleHistoryData);
                priceObj[time].push({
                    time: lastCandleHistoryData?.timestamp,
                    symbol: candleObj?.symbol,
                    open: lastCandleHistoryData?.open,
                    close: lastCandleHistoryData?.close
                })
            } else{
                symbolWiseArray[candleObj?.symbol].push(particularCandle);
                priceObj[time].push({
                    time: particularCandle?.timestamp,
                    symbol: candleObj?.symbol,
                    open: particularCandle?.open,
                    close: particularCandle?.close
                })
            }
        }
    }
    return priceObj
}

exports.hourChart = async (req, res) => {
  try {
    const now = performance.now();
    const date = req.query.date;
    const thirdParty = req.query.thirdParty ?? "false";
    const timePeriod = Number(req.query.timePeriod) || 1;
    const frequency = req.query.frequency==='undefined' ? 'Hour' : req.query.frequency;
    const TradeModel = thirdParty == "true" ? ThirdPartyTrades : TradeData;
    const HistoryTickModel =
      thirdParty == "true" ? HistoryDataNew : HistoryData;

      console.log(frequency, timePeriod)
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

    console.log('case1', performance.now()-now)
    const vixData = await IndiaVix.find({
      timestamp: { $gt: new Date(startToday), $lt: new Date(endToday) },
    });
    const symbolArr = tradeData.map((elem) => {
      return elem?.symbol;
    });

    const uniqueSymbolArr = [...new Set(symbolArr)];

    const todaysDatePart = new Date(endToday).toISOString()?.split("T")?.[0];
    const timeArr = await timeArray(todaysDatePart, timePeriod, frequency);
    console.log('case2', performance.now()-now)

    const timeArrUtc = timeArr.map((elem)=>{
        const utcTime = new Date(elem);
        utcTime.setHours(utcTime.getHours() - 5);
        utcTime.setMinutes(utcTime.getMinutes() - 30);
        return utcTime
    })

    // console.log(uniqueSymbolArr, new Date(startToday), new Date(endToday), timeArrUtc)
    const historyTicksInstrument = (thirdParty == "true") ?
    await HistoryTickModel.aggregate([
        {
            $match:
            {
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
                symbol: '$_id.symbol',
                _id: 0
            }
        }
    ])
    :
    await HistoryTickModel.find({
      "candles.timestamp": {
        $gt: new Date(startToday),
        $lt: new Date(endToday),
      },
      symbol: { $in: uniqueSymbolArr },
    });

    console.log('case3', performance.now()-now)
    console.log(historyTicksInstrument.length, tradeData?.length, uniqueSymbolArr?.length)

    const uniqueTicksArr = [
      ...new Map(
        historyTicksInstrument.map((item) => [item.symbol, item])
      ).values(),
    ];

    
    const newHistoryTicks = await newPriceArray(timeArr, uniqueTicksArr, HistoryTickModel, thirdParty);    

    for (let i = 0; i < timeArr.length; i++) {
        const timePriceArr = newHistoryTicks[timeArr[i]];
      const filteredArr = tradeData.filter((elem) => {
        return (
          new Date(elem.trade_time) >= new Date(timeArr[0]) &&
          new Date(elem.trade_time) <= new Date(timeArr[i])
        );
      });

      const vix = vixData.filter((elem) => {
        const elemDate = new Date(
          moment(elem.timestamp)
            .add(5, "hours")
            .add(30, "minutes")
            .add(59, "seconds")
            .toISOString()
        );

        
        const timeArrDate = new Date(timeArr[i]);
        return elemDate.getTime() === timeArrDate.getTime();
      })?.[0]?.open;

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

    console.log('check performance again', performance.now() - now);

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

exports.avgHourChart = async (req, res) => {
  try {
    const first = performance.now();

    const fromDate = req.query.from;
    const timePeriod = Number(req.query.timePeriod) || 1;
    const frequency = ((req.query.frequency==='undefined') || !req.query.frequency) ? 'Hour' : req.query.frequency;
    const toDate = req.query.to;
    const thirdParty = req.query.thirdParty ?? "false";
    const TradeModel = thirdParty == "true" ? ThirdPartyTrades : TradeData;
    const HistoryTickModel =
      thirdParty == "true" ? HistoryDataNew : HistoryData;

    const userId = req?.user?._id;
    const startFromDate = moment(fromDate)
      .clone()
      .startOf("day")
      .subtract(5, "hours")
      .subtract(30, "minutes");
    const endToDate = moment(toDate).clone().endOf("day");

    const pnlObjArr = [];

    for (
      let day = startFromDate.clone();
      day.isBefore(endToDate);
      day.add(1, "days")
    ) {
      const startToday = day.clone().startOf("day");
      const endToday = day.clone().endOf("day");

      const todaysDatePart = new Date(endToday).toISOString()?.split("T")?.[0];
      const timeArr = await timeArray(todaysDatePart, timePeriod, frequency);
  
      const timeArrUtc = timeArr.map((elem)=>{
        const utcTime = new Date(elem);
        utcTime.setHours(utcTime.getHours() - 5);
        utcTime.setMinutes(utcTime.getMinutes() - 30);
        return utcTime
    })
  

      const tradeData = await TradeModel.find({
        status: "COMPLETE",
        trader: new ObjectId(userId),
        trade_time: { $gt: new Date(startToday), $lt: new Date(endToday) },
      });

      if(tradeData.length === 0){
        continue;
      }

      
      const symbolArr = tradeData.map((elem) => elem?.symbol);
      const uniqueSymbolArr = [...new Set(symbolArr)];
      const historyTicksInstrument = (thirdParty == "true") ?
      await HistoryTickModel.aggregate([
          {
              $match:
              {
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
                  symbol: '$_id.symbol',
                  _id: 0
              }
          }
      ])
      :
      await HistoryTickModel.find({
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

      const newHistoryTicks = await newPriceArray(timeArr, uniqueTicksArr, HistoryTickModel, thirdParty);
      for (let i = 0; i < timeArr.length; i++) {
        const timePriceArr = newHistoryTicks[`${timeArr[i]}`];
        const timestamp = `${timeArr[i]}`;
        const filteredArr = tradeData.filter(
          (elem) => new Date(elem.trade_time) <= new Date(timestamp)
        );

        const arrData = await formatTradeData(filteredArr);

        if (tradeData.length && uniqueTicksArr.length) {
          const pnlObj = await calculatePnl(
            arrData,
            timePriceArr,
            timestamp,
            thirdParty
          );
          pnlObj.timestamp = timestamp;
          pnlObjArr.push(pnlObj);
        }
      }
    }

    const newtimeArr = [
      "09:15:59",
      "10:15:59",
      "11:15:59",
      "12:15:59",
      "13:15:59",
      "14:15:59",
      "15:15:59",
      "15:30:59",
    ];
    const averageGpnlByTime = {};
    newtimeArr.forEach((time) => {
      const gpnlByTime = pnlObjArr
        .filter((pnl) => pnl.timestamp.includes(time))
        .map((pnl) => pnl.gpnl);
      const averageGpnl =
        gpnlByTime.reduce((acc, gpnl) => acc + gpnl, 0) / gpnlByTime.length;
      averageGpnlByTime[time] = Number(averageGpnl?.toFixed(2));
    });


    res.status(200).json({
      status: "success",
      data: averageGpnlByTime,
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
    const { Quantity, buyOrSell, trade_time, symbol, average_price, amount } = elem;

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
        const newAmountBuy = Math.abs(amount)*Math.abs(runningLotForSymbol)/Math.abs(Quantity);
        const newAmountsell = Math.abs(amount)*(Math.abs(Quantity) - Math.abs(runningLotForSymbol))/Math.abs(Quantity);
        buyArr.push({
          ...newObjBuy,
          Quantity: 0 - Math.abs(runningLotForSymbol),
        amount: 0-newAmountBuy
        });
        newObjSell.Quantity =
            0 - (Math.abs(Quantity) - Math.abs(runningLotForSymbol));

        newObjSell.amount = 0 - newAmountsell;
        sellArr.push(newObjSell);
      } else {
        const newAmountSell = Math.abs(amount)*Math.abs(runningLotForSymbol)/Math.abs(Quantity);
        const newAmountBuy = Math.abs(amount)*(Math.abs(Quantity) - Math.abs(runningLotForSymbol))/Math.abs(Quantity);

        sellArr.push({
          ...newObjSell,
          Quantity: Math.abs(runningLotForSymbol),
        amount: newAmountSell,
        });
        newObjBuy.Quantity = Math.abs(Quantity) - Math.abs(runningLotForSymbol);

        newObjBuy.amount =  newAmountBuy;
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
  return { averageEntryLots, buyArr, sellArr, averageLotsUsed };
};

const formatTradeData = async (tradeData) => {
  const map = new Map();

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
  const timeInCalculate1 = performance.now();
  let totalGpnl = 0;
  let totalRunningLots = 0;
  let pnlNifty = 0;
  let pnlBankNifty = 0;
  let pnlFinNifty = 0;

  const HistoryTickModel = thirdParty == "true" ? HistoryDataNew : HistoryData;

  for (const elem of tradeData) {
    const utcTimeStamp = new Date(timestamp);
    utcTimeStamp.setHours(utcTimeStamp.getHours() - 5);
    utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() - 30);
    const newUtcTimeStamp = new Date(utcTimeStamp);
    let isDayEnd = false;

    const getCandleArray = ltpData?.find(
      (subelem) => subelem?.symbol === elem?.symbol
    );

    if (!getCandleArray) continue;

    // if (utcTimeStamp.getUTCHours() === 10) {
    //   isDayEnd = true;
    //   utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() - 15);
    // }
    // let ltpCandle = getCandleArray?.find((subelem) => {
    //   return (
    //     new Date(subelem?.timestamp)?.toISOString() ===
    //     utcTimeStamp?.toISOString()
    //   );
    // });

    // // if(!ltpCandle){
    // //     console.log('inside no candles')
    // //     const historyData = await HistoryTickModel.findOne({symbol: elem?.symbol, 'candles.timestamp': {$lt: new Date(newUtcTimeStamp)}}).sort({'candles.timestamp': -1});
    // //     ltpCandle = historyData?.candles?.[historyData.candles?.length-1];
    // //     isDayEnd = true;
    // // }

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

  const timeInCalculate2 = performance.now();
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
    console.log(data)
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/045115758852909416-shareIndia46099Aprtrunc.csv'
    const url = originalUrl?.split("/")[originalUrl?.split("/").length - 1];
    const savedData = await saveDataToDB(url, userId);
    // const savedData = await saveDataToDBTesting(url, userId);

    if (savedData === "Data Exist") {
      return res.status(400).json({
        status: "error",
        message: "Uploaded data already exist!",
      });
    }

    res.status(200).json({
      status: "success",
      data: savedData,
      originalUrl,
    });
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/8375248682662133-NSEFO_1hr_4months.csv';
    // 'https://stagingdmt.blob.core.windows.net/dmt-trade/07252194481784469-Untitled spreadsheet - Sheet1.csv'
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/8901355588917994-Untitled%2520spreadsheet%2520-%2520Sheet1.csv'
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err?.message,
    });
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

const saveDataToDB = async (url, userId) => {
  try {
    // const url = 'https://stagingdmt.blob.core.windows.net/dmt-trade/06501232945102076-data_hour_calcluation.csv'
    // const userId = '662f804700f04a05fe3c941f';
    // const url = '06501232945102076-data_hour_calcluation.csv'
    const csvStream = await downloadCsvBlob(url);
    console.log('downloaded')
    const csvData = await parseCsvStream(csvStream);
    console.log('parsed')
    return await convertToTradingData(csvData, userId);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const convertToTradingData = async (data, userId) => {
  try {
    data.sort((a, b) => {
      if (a?.["Trade Date/Time"] > b?.["Trade Date/Time"]) {
        return 1;
      }
      if (a?.["Trade Date/Time"] <= b?.["Trade Date/Time"]) {
        return -1;
      }
    });
    // Step 1: Grouping the data
    const groupedData = {};

    data.forEach((elem) => {
      const groupKey = [
        elem?.["Strike Price"],
        elem?.["Option Type"],
        elem?.["Symbol"],
        elem?.["Buy/Sell"],
        elem?.["Trade Date/Time"],
        elem?.["Contract Name"],
      ].join("|");

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          ...elem,
          Quantity: 0,
          totalPrice: 0,
          count: 0,
          amount: 0,
        };
      }

      groupedData[groupKey].Quantity += Number(elem?.["Quantity"]);
      groupedData[groupKey].totalPrice += Number(elem?.["Price"]);
      groupedData[groupKey].amount +=
        Number(elem?.["Price"]) * Number(elem?.["Quantity"]);
      groupedData[groupKey].count += 1;
    });

    // Step 2: Converting the grouped data to the required format
    const tradeData = [];
    for (const key in groupedData) {
      const elem = groupedData[key];
      // const avgPrice = Number(elem.totalPrice / elem.count)
      const avgPrice = Math.round((elem.totalPrice / elem.count) * 100) / 100;
      let checkOption = false;
      let checkFuture = false;
      let checkStock = false;
      if (elem?.["Option Type"] == "CE" || elem?.["Option Type"] == "PE") {
        checkOption = true;
      }

      if (elem?.["Option Type"] == "FX") {
        checkFuture = true;
      }

      if(elem?.['Instrument Type'] === 'EQ'){
        checkStock = true;
      }

      let instrument;
      if (checkFuture) {
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}FUT`;
      } 
      if(checkOption){
        const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
          .clone()
          .format("DDMMMYY");
        instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}${
          elem?.["Strike Price"]
        }${elem?.["Option Type"]}`;
      }

      if(checkStock){
        instrument = elem?.["Symbol"]
      }

      let buyOrSell, quantity, amount;
      if (elem?.["Buy/Sell"] === "2") {
        buyOrSell = "SELL";
        quantity = 0 - elem.Quantity;
        // amount = avgPrice * quantity;
        amount = 0 - elem?.amount;
      } else {
        buyOrSell = "BUY";
        quantity = elem.Quantity;
        // amount = avgPrice * quantity;
        amount = elem?.amount;
      }

      tradeData.push({
        order_id: elem["Trade Id"],
        status: "COMPLETE",
        average_price: avgPrice,
        Quantity: quantity,
        buyOrSell,
        exchange: "NFO",
        symbol: instrument,
        amount: amount,
        trade_time: moment(elem?.["Trade Date/Time"], "DD MMMM YYYY HH:mm:ss"),
        // trade_time: moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format(),
        account_number: elem?.["Account Number"],
        cp_id: elem?.["CP ID"],
        ctcl_id: elem?.["CTCL ID"],
        user_id: elem?.["User Id"],
        modify_date: moment(
          elem?.["Modified Date/Time"],
          "DD MMMM YYYY HH:mm:ss"
        ),
        // modify_date: moment(elem?.["Modified Date/Time"], "DD MMMM YYYY HH:mm:ss").add(30, 'minutes').utc().format(),
        trader: userId,
        createdOn: new Date(),
        createdBy: userId,
      });
    }

    const getStartDate = moment(tradeData?.[0]?.trade_time)
      .startOf("day")
      .add(5, "hours")
      .add(30, "minutes");
    const getEndDate = moment(tradeData?.[0]?.trade_time)
      .endOf("day")
      .add(5, "hours")
      .add(30, "minutes");

    const checkExist = await ThirdPartyTrades.findOne({
      trader: new ObjectId(userId),
      order_id: tradeData?.[0]?.order_id,
      trade_time: { $gt: new Date(getStartDate), $lt: new Date(getEndDate) },
    });

    if (checkExist) {
      return "Data Exist";
    }

    const savedData = await ThirdPartyTrades.create(tradeData);
    // return 'ok';

    return savedData;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};












async function parseCsvStreamForTesting(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    const symbolsArr = [];
    let pointer = 0;
    stream
      .pipe(csv())
      .on("data", async (data) => {
        let checkOption = false;
        let checkFuture = false;
        let checkStock = false;
        if (elem?.["Option Type"] == "CE" || elem?.["Option Type"] == "PE") {
          checkOption = true;
        }
  
        if (elem?.["Option Type"] == "FX") {
          checkFuture = true;
        }
  
        if(elem?.['Instrument Type'] === 'EQ'){
          checkStock = true;
        }
  
        let instrument;
        if (checkFuture) {
          const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
            .clone()
            .format("DDMMMYY");
          instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}FUT`;
        } 
        if(checkOption){
          const newExpiry = moment(elem?.["Expiry Date"], "DD MMMM YYYY")
            .clone()
            .format("DDMMMYY");
          instrument = `${elem?.["Symbol"]}${newExpiry?.toUpperCase()}${
            elem?.["Strike Price"]
          }${elem?.["Option Type"]}`;
        }
  
        if(checkStock){
          instrument = elem?.["Symbol"]
        }
        // results.push({
        //     symbol: instrument,
        //     order_id: data?.['Trade Id'],

        // })
        results.push(data);
        symbolsArr.push(instrument);
      })
      // .on('end', () => resolve(results))
      .on("end", () => resolve([...new Set(symbolsArr)]))
      .on("error", (error) => reject(error));
  });
}

const saveDataToDBTesting = async (url, userId) => {
  try {
    // const url = 'https://stagingdmt.blob.core.windows.net/dmt-trade/045115758852909416-shareIndia46099Aprtrunc.csv'
    // const userId = '662f804700f04a05fe3c941f';
    // const url = '06501232945102076-data_hour_calcluation.csv'
    const csvStream = await downloadCsvBlob(url);
    const csvData = await parseCsvStream(csvStream);

    return await convertToTradingData(csvData, userId);
    // (await convertToTradingData(csvData, userId));
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const saveHistoryDataToDB = async (url) => {
  const csvStream = await downloadCsvBlob(url);

  const data = await new Promise((resolve, reject) => {
    const results = [];
    let pointer = 0;
    csvStream
      .pipe(csv())
      .on("data", async (data) => {
        pointer++;
        results.push({
          timestamp: new Date(`${data["Date"]}T${data["Time"]}`),
          open: data["Open"],
          high: data["High"],
          close: data["Close"],
          low: data["Low"],
          volume: data["Volume"],
          symbol: data["Ticker"]?.split(".")?.[0],
        });

        // if (pointer === 100) {
        //     csvStream.unpipe(); // Stop the stream from reading more data
        //     resolve(results); // Resolve the promise with the results
        // }
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });

  const save = await HistoryDataNew.create(data);

  return "ok";
};

exports.getUploadedData = async (req, res) => {
  try {
    const userId = req?.user?._id || "662f804700f04a05fe3c941f";
    // const data = await uploadFileToAzure(req.file);
    //  const originalUrl = data?.fileUrl;
    const originalUrl =
    'https://stagingdmt.blob.core.windows.net/dmt-trade/04333819805877015-OPTNewData-44090.csv';
    const url = originalUrl?.split("/")[originalUrl?.split("/").length - 1];
    // const savedData = await saveDataToDB(url, userId);
    const savedData = await saveDataToDB(url, userId);

    if (savedData === "Data Exist") {
      return res.status(400).json({
        status: "error",
        message: "Uploaded data already exist!",
      });
    }

    res.status(200).json({
      status: "success",
      data: savedData,
      originalUrl,
    });
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/8375248682662133-NSEFO_1hr_4months.csv';
    // 'https://stagingdmt.blob.core.windows.net/dmt-trade/07252194481784469-Untitled spreadsheet - Sheet1.csv'
    // const originalUrl = 'https://stagingdmt.blob.core.windows.net/dmt-trade/8901355588917994-Untitled%2520spreadsheet%2520-%2520Sheet1.csv'
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err?.message,
    });
  }

  // await hourChartTesting(req, res);
};

exports.deleteThirdParty = async (req, res) => {
  const data = await ThirdPartyTrades.deleteMany({
    trader: 
    new ObjectId("63788f3991fc4bf629de6df0"),
    // new ObjectId("642c6434573edbfcb2ac45a5"),
  });

  res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.fixAvgHourChart = async (req, res) => {
  const fromDate = req.query.from;
  const toDate = req.query.to;
  const data = {
    "2024-04-18": {
      "9:15": 0,
      "10:15": -20470,
      "11:15": -40863,
      "12:15": -40863,
      "13:15": -40863,
      "14:15": -6850,
      "15:15": 127590,
      "15:30": 127590,
    },
    "2024-04-23": {
      "9:15": 0,
      "10:15": 485130,
      "11:15": 71836,
      "12:15": 71836,
      "13:15": 71836,
      "14:15": 380702,
      "15:15": 184900,
      "15:30": 184900,
    },
    "2024-04-24": {
      "9:15": 0,
      "10:15": 85868,
      "11:15": 85868,
      "12:15": 85868,
      "13:15": 85868,
      "14:15": 441194,
      "15:15": 325595,
      "15:30": 325595,
    },
    "2024-04-25": {
      "9:15": 0,
      "10:15": -89373,
      "11:15": -89373,
      "12:15": -89373,
      "13:15": -89373,
      "14:15": -89373,
      "15:15": 261548,
      "15:30": 236423,
    },
  };
  const timePoints = [
    "9:15",
    "10:15",
    "11:15",
    "12:15",
    "13:15",
    "14:15",
    "15:15",
    "15:30",
  ];
  const startFromDate = moment(fromDate).startOf("day");
  const endToDate = moment(toDate).endOf("day");

  const filteredDates = Object.keys(data).filter((date) => {
    const current = moment(date);
    return current.isBetween(startFromDate, endToDate, undefined, "[]");
  });

  if (filteredDates.length === 0) {
    const result = {};
    timePoints.forEach((time) => (result[time] = 0));
    return res.status(200).json({
      status: "success",
      data: result,
    });
  }

  const averages = {};
  timePoints.forEach((time) => {
    const values = filteredDates.map((date) => data[date][time]);
    const average =
      values.reduce((acc, value) => acc + value, 0) / values.length;
    averages[time] = average;
  });

  res.status(200).json({
    status: "success",
    data: averages,
  });
};