const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany");
const Algo = require("../../models/AlgoBox/tradingAlgoSchema")
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const Internship = require("../../models/mock-trade/internshipTrade");
const PaperTrader = require("../../models/mock-trade/paperTrade");
const { takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade } = require("./autoTradeManually");

const tenx = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tradeArr = [];
  const data = await TenxTrader.aggregate(
    [
      {
        $match:
        {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
        },
      },
      {
        $group:
        {
          _id: {
            userId: "$trader",
            subscriptionId: "$subscriptionId",
            exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            variety: "$variety",
            validity: "$validity",
            order_type: "$order_type",
            Product: "$Product",
          },
          runningLots: {
            $sum: "$Quantity",
          },
          takeTradeQuantity: {
            $sum: {
              $multiply: ["$Quantity", -1],
            },
          },
        },
      },
      {
        $project:
        {
          _id: 0,
          userId: "$_id.userId",
          subscriptionId: "$_id.subscriptionId",
          exchange: "$_id.exchange",
          symbol: "$_id.symbol",
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          variety: "$_id.variety",
          validity: "$_id.validity",
          order_type: "$_id.order_type",
          Product: "$_id.Product",
          runningLots: "$runningLots",
          takeTradeQuantity: "$takeTradeQuantity",
        },
      },
      {
        $match: {
          runningLots: {
            $ne: 0
          },
        }
      }

    ]
  );

  for (let i = 0; i < data.length; i++) {
    let date = new Date();
    let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
    let quantity = Math.abs(data[i].runningLots);

    let buyOrSell
    if (transaction_type === "BUY") {
      buyOrSell = "SELL";
    } else {
      buyOrSell = "BUY";
    }

    // console.log("this is data", data[i])
    // realSymbol: data[i]._id.symbol,
    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.OrderType = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.subscriptionId = data[i].subscriptionId;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity < 1800) {
        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoTenxTrade(Obj);
        return;
      } else {
        Obj.Quantity = 1800;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoTenxTrade(Obj);
        return recursiveFunction(quantity - 1800);
      }
    }
  }

  // return tradeArr;
}

const internship = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tradeArr = [];
  const data = await Internship.aggregate(
    [
      {
        $match:
        {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
        },
      },
      {
        $group:
        {
          _id: {
            userId: "$trader",
            batch: "$batch",
            exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            variety: "$variety",
            validity: "$validity",
            order_type: "$order_type",
            Product: "$Product",
          },
          runningLots: {
            $sum: "$Quantity",
          },
          takeTradeQuantity: {
            $sum: {
              $multiply: ["$Quantity", -1],
            },
          },
        },
      },
      {
        $project:
        {
          _id: 0,
          userId: "$_id.userId",
          batch: "$_id.batch",
          exchange: "$_id.exchange",
          symbol: "$_id.symbol",
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          variety: "$_id.variety",
          validity: "$_id.validity",
          order_type: "$_id.order_type",
          Product: "$_id.Product",
          runningLots: "$runningLots",
          takeTradeQuantity: "$takeTradeQuantity",
        },
      },
      {
        $match: {
          runningLots: {
            $ne: 0
          },
        }
      }

    ]
  );

  for (let i = 0; i < data.length; i++) {
    let date = new Date();
    let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
    let quantity = Math.abs(data[i].runningLots);

    let buyOrSell
    if (transaction_type === "BUY") {
      buyOrSell = "SELL";
    } else {
      buyOrSell = "BUY";
    }

    // console.log("this is data", data[i])
    // realSymbol: data[i]._id.symbol,
    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.OrderType = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.batch = data[i].batch;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity < 1800) {
        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInternshipTrade(Obj);
        return;
      } else {
        Obj.Quantity = 1800;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInternshipTrade(Obj);
        return recursiveFunction(quantity - 1800);
      }
    }
  }

  // return tradeArr;
}

const paperTrade = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tradeArr = [];
  const data = await PaperTrader.aggregate(
    [
      {
        $match:
        {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
        },
      },
      {
        $group:
        {
          _id: {
            userId: "$trader",
            portfolioId: "$portfolioId",
            exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            variety: "$variety",
            validity: "$validity",
            order_type: "$order_type",
            Product: "$Product",
          },
          runningLots: {
            $sum: "$Quantity",
          },
          takeTradeQuantity: {
            $sum: {
              $multiply: ["$Quantity", -1],
            },
          },
        },
      },
      {
        $project:
        {
          _id: 0,
          userId: "$_id.userId",
          portfolioId: "$_id.portfolioId",
          exchange: "$_id.exchange",
          symbol: "$_id.symbol",
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          variety: "$_id.variety",
          validity: "$_id.validity",
          order_type: "$_id.order_type",
          Product: "$_id.Product",
          runningLots: "$runningLots",
          takeTradeQuantity: "$takeTradeQuantity",
        },
      },
      {
        $match: {
          runningLots: {
            $ne: 0
          },
        }
      }

    ]
  );

  for (let i = 0; i < data.length; i++) {
    let date = new Date();
    let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
    let quantity = Math.abs(data[i].runningLots);

    let buyOrSell
    if (transaction_type === "BUY") {
      buyOrSell = "SELL";
    } else {
      buyOrSell = "BUY";
    }

    // console.log("this is data", data[i])
    // realSymbol: data[i]._id.symbol,
    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.OrderType = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.portfolioId = data[i].portfolioId;
    Obj.autoTrade = true;
    Obj.dontSendResp = (i !== (data.length - 1));

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity < 1800) {
        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoPaperTrade(Obj);
        return;
      } else {
        Obj.Quantity = 1800;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoPaperTrade(Obj);
        return recursiveFunction(quantity - 1800);
      }
    }
  }

  // return tradeArr;
}

const infinityTrade = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tradeArr = [];
  const data = await InfinityTradeCompany.aggregate(
    [
      {
        $match:
        {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
        },
      },
      {
        $group:
        {
          _id: {
            userId: "$trader",
            // subscriptionId: "$subscriptionId",
            exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            variety: "$variety",
            validity: "$validity",
            order_type: "$order_type",
            Product: "$Product",
            algoBoxId: "$algoBox"
          },
          runningLots: {
            $sum: "$Quantity",
          },
          takeTradeQuantity: {
            $sum: {
              $multiply: ["$Quantity", -1],
            },
          },
        },
      },
      {
        $project:
        {
          _id: 0,
          userId: "$_id.userId",
          // subscriptionId: "$_id.subscriptionId",
          exchange: "$_id.exchange",
          symbol: "$_id.symbol",
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          variety: "$_id.variety",
          validity: "$_id.validity",
          order_type: "$_id.order_type",
          Product: "$_id.Product",
          runningLots: "$runningLots",
          takeTradeQuantity: "$takeTradeQuantity",
          algoBoxId: "$_id.algoBoxId"
        },
      },
      {
        $match: {
          runningLots: {
            $ne: 0
          },
        }
      }

    ]
  );

  for (let i = 0; i < data.length; i++) {
    let date = new Date();
    let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
    let quantity = Math.abs(data[i].runningLots);

    let algoBox = await Algo.findOne({ status: "Active" })


    let realBuyOrSell
    if (transaction_type === "BUY") {
      realBuyOrSell = "SELL";
    } else {
      realBuyOrSell = "BUY";
    }

    let buyOrSell;
    if (algoBox.transactionChange) {
      if (realBuyOrSell === "BUY") {
        buyOrSell = "SELL";
      } else {
        buyOrSell = "BUY";
      }
    } else {
      buyOrSell = realBuyOrSell;
    }

    // console.log("this is data", data[i])
    // realSymbol: data[i]._id.symbol,
    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.OrderType = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.realBuyOrSell = realBuyOrSell;
    Obj.trader = data[i].userId;
    Obj.algoBoxId = data[i].algoBoxId;
    // Obj.subscriptionId = data[i].subscriptionId ;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity < 1800) {
        Obj.Quantity = quantity;
        Obj.userQuantity = quantity / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInfinityTrade(Obj);
        return;
      } else {
        Obj.Quantity = 1800;
        Obj.userQuantity = 1800 / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInfinityTrade(Obj);
        return recursiveFunction(quantity - 1800);
      }
    }
  }

  // return tradeArr;
}

module.exports = { tenx, paperTrade, infinityTrade, internship };

