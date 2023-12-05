const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany");
const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const ContestLiveTradeCompany = require("../../models/DailyContest/dailyContestLiveCompany");
const Algo = require("../../models/AlgoBox/tradingAlgoSchema")
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const Internship = require("../../models/mock-trade/internshipTrade");
const BattleTrade = require("../../models/battle/battleTrade");
const PaperTrader = require("../../models/mock-trade/paperTrade");
const User = require("../../models/User/userDetailSchema");
const {autoPlaceOrder} = require("../../services/xts/xtsInteractive")
const { takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade, takeAutoDailyContestMockTrade, 
  takeInternshipTrades, takeDailyContestMockTrades, takeMarginXMockTrades, takeBattleTrades } = require("./autoTradeManually");
const DailyContestMock = require("../../models/DailyContest/dailyContestMockCompany");
const MarginXMock = require("../../models/marginX/marginXCompanyMock");
const singleLivePrice = require('../../marketData/sigleLivePrice');
const getLivePrices = require('../../marketData/multipleLivePrices');
const { ObjectId } = require("mongodb");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema");
let { client } = require("../../marketData/redisClient");

const delay = ms => new Promise(res => setTimeout(res, ms));

const tenx = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
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

  if(data.length == 0){
    // console.log("in base case")
    return;
  }

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
    let system = await User.findOne({ email: "system@ninepointer.in" })
    let createdBy = system._id

    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.order_type = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.subscriptionId = data[i].subscriptionId;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));
    Obj.createdBy = createdBy;

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity <= 0) {
        return;
      }
      else if (quantity <= (data[i].symbol.includes("BANK") ? 900 : 1800)) {

        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        const auto = await takeAutoTenxTrade(Obj);
        if(data.length > 0 && i == data.length-1){
          await tenx();
        }
        return;
      } else {
        let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

        Obj.Quantity = tempQuantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoTenxTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  return ;
}

const internship = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  // let tradeArr = [];
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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
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

  if(data.length == 0){
    // console.log("in base case")
    return;
  }

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

    let system = await User.findOne({ email: "system@ninepointer.in" })
    let createdBy = system._id

    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.order_type = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.batch = data[i].batch;
    Obj.autoTrade = true;
    Obj.dontSendResp = (i !== (data.length - 1));
    Obj.createdBy = createdBy;


    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity <= (data[i].symbol.includes("BANK") ? 900 : 1800)) {
        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInternshipTrade(Obj);

        if(data.length > 0 && i == data.length-1){
          // console.log("recursive calling")
          await internship();
        }

        return;
      } else {
        let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

        Obj.Quantity = tempQuantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInternshipTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  return ;
}

const paperTrade = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  // let tradeArr = [];
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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
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

  if(data.length == 0){
    return;
  }

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

    let system = await User.findOne({ email: "system@ninepointer.in" })
    let createdBy = system._id

    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.order_type = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.trader = data[i].userId;
    Obj.portfolioId = data[i].portfolioId;
    Obj.autoTrade = true;
    Obj.dontSendResp = (i !== (data.length - 1));
    Obj.createdBy = createdBy

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity <= (data[i].symbol.includes("BANK") ? 900 : 1800)) {
        Obj.Quantity = quantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        await takeAutoPaperTrade(Obj);
        if(data.length > 0 && i == data.length-1){
          await paperTrade();
        }
        return;
      } else {
        let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

        Obj.Quantity = tempQuantity;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        await takeAutoPaperTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  if(data.length > 0){
    await paperTrade();
  }

  return ;
}

const infinityTrade = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

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

  if(data.length == 0){
    return;
  }

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

    let system = await User.findOne({ email: "system@ninepointer.in" })
    let createdBy = system._id

    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.order_type = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.realBuyOrSell = realBuyOrSell;
    Obj.trader = data[i].userId;
    Obj.algoBoxId = data[i].algoBoxId;
    // Obj.subscriptionId = data[i].subscriptionId ;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));
    Obj.createdBy = createdBy

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity <= (data[i].symbol.includes("BANK") ? 900 : 1800)) {
        Obj.Quantity = quantity;
        Obj.userQuantity = quantity / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        Obj.marginData = {isSquareOff: true, isAddMoreFund: false, isReleaseFund: false, zerodhaMargin: 0, runningLots: quantity};
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInfinityTrade(Obj);
        if(data.length > 0 && i == data.length-1){
          // console.log("recursive calling")
          await infinityTrade();
        }
        return;
      } else {
        let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;
        Obj.Quantity = tempQuantity;
        Obj.userQuantity = tempQuantity / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        Obj.marginData = {isSquareOff: false, isAddMoreFund: false, isReleaseFund: true, zerodhaMargin: 0, runningLots: quantity};

        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoInfinityTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  if(data.length > 0){
    await infinityTrade();
  }
//2306022200026054  1100000111395801  
  return ;
}

const dailyContestMock = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const data = await DailyContestMock.aggregate(
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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
            // algoBoxId: "$algoBox",
            contestId: "$contestId"
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
          algoBoxId: "$_id.algoBoxId",
          contestId: "$_id.contestId"
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

  

  if(data.length == 0){
    return;
  }

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

    let system = await User.findOne({ email: "system@ninepointer.in" })
    let createdBy = system._id

    let Obj = {};
    Obj.symbol = data[i].symbol;
    Obj.Product = data[i].Product;
    Obj.instrumentToken = data[i].instrumentToken;
    Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
    Obj.real_instrument_token = data[i].instrumentToken;
    Obj.exchange = data[i].exchange;
    Obj.validity = data[i].validity;
    Obj.order_type = data[i].order_type;
    Obj.variety = data[i].variety;
    Obj.buyOrSell = buyOrSell;
    Obj.realBuyOrSell = realBuyOrSell;
    Obj.trader = data[i].userId;
    Obj.algoBoxId = data[i].algoBoxId;
    Obj.contestId = data[i].contestId ;
    Obj.autoTrade = true;
    // Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    Obj.dontSendResp = (i !== (data.length - 1));
    Obj.createdBy = createdBy

    await recursiveFunction(quantity)

    async function recursiveFunction(quantity) {
      if (quantity == 0) {
        return;
      }
      else if (quantity <= (data[i].symbol.includes("BANK") ? 900 : 1800)) {
        Obj.Quantity = quantity;
        Obj.userQuantity = quantity / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoDailyContestMockTrade(Obj);
        return;
      } else {
        let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

        Obj.Quantity = tempQuantity;
        Obj.userQuantity = tempQuantity / algoBox.lotMultipler;
        Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoDailyContestMockTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  return ;
}

const infinityTradeLive = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      todayDate = todayDate + "T00:00:00.000Z";
      const today = new Date(todayDate);

      const data = await InfinityLiveTradeCompany.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            },
            status: "COMPLETE",
          },
        },
        {
          $group: {
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
          $project: {
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
      ]);

      // console.log("collectiong", data);

      for (let i = 0; i < data.length; i++) {
        let date = new Date();
        let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].runningLots);

        let algoBox = await Algo.findOne({ status: "Active" });

        let realBuyOrSell;
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

        let system = await User.findOne({ email: "system@ninepointer.in" });
        let createdBy = system._id;

        let Obj = {};
        Obj.symbol = data[i].symbol;
        Obj.Product = data[i].Product;
        Obj.instrumentToken = data[i].instrumentToken;
        Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
        Obj.real_instrument_token = data[i].instrumentToken;
        Obj.exchange = data[i].exchange;
        Obj.validity = data[i].validity;
        Obj.order_type = data[i].order_type;
        Obj.variety = data[i].variety;
        Obj.buyOrSell = buyOrSell;
        Obj.realBuyOrSell = realBuyOrSell;
        Obj.trader = data[i].userId;
        Obj.algoBoxId = data[i].algoBoxId;
        Obj.autoTrade = true;
        Obj.dontSendResp = true;
        Obj.createdBy = createdBy;

        const processOrder = async () => {
          if (quantity == 0) {
            return;
          }
           else if (quantity > (data[i].symbol.includes("BANK") ? 900 : 1800)) {
            let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

            Obj.Quantity = tempQuantity;
            Obj.userQuantity = tempQuantity / algoBox.lotMultipler;
            Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
            // console.log("before autoplaceorder in elseif");
            Obj.marginData = {isSquareOff: false, isAddMoreFund: false, isReleaseFund: true, zerodhaMargin: 0, runningLots: quantity};

            await autoPlaceOrder(Obj);
            quantity = quantity - tempQuantity;
            await delay(300);
            return processOrder(); // Ensure that the promise returned by processOrder is returned
          } else {
            Obj.Quantity = quantity;
            Obj.userQuantity = quantity / algoBox.lotMultipler;
            Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
            Obj.marginData = {isSquareOff: true, isAddMoreFund: false, isReleaseFund: false, zerodhaMargin: 0, runningLots: quantity};

            // console.log("before autoplaceorder in else");
            await autoPlaceOrder(Obj);
          }
        };

        await processOrder();
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const internshipTradeMod = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  // let tradeArr = [];
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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
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
  if(data.length == 0) return;
  const system = await User.findOne({email:'system@ninepointer.in'}).select('_id');  
  //const uniqueInstrumentTokens = [...new Set(data.map(item => item.instrumentToken))];
  const uniqueTokensMap = {};
  const uniqueInstrumentObjects = data.filter(item => {
      if (!uniqueTokensMap[item.instrumentToken]) {
          uniqueTokensMap[item.instrumentToken] = true;
          return true; // Keep this item
      }
      return false; // Discard this item
  }).map(item => ({
      instrumentToken: item.instrumentToken,
      exchange: item.exchange,
      symbol: item.symbol
  }));
  console.log('getting internship', data?.length);
  const pricesByTokens = await fetchPricesForTokensArr(uniqueInstrumentObjects);
  const tradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity:-(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots>0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, 
      instrumentToken: item?.instrumentToken, batch: item?.batch, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(-item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  // console.log('tradeObjects', tradeObjects);
  
  await takeInternshipTrades(tradeObjects);

}

const dailyContestMockMod = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const data = await DailyContestMock.aggregate(
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
            // exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
            // algoBoxId: "$algoBox",
            contestId: "$contestId"
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
          algoBoxId: "$_id.algoBoxId",
          contestId: "$_id.contestId"
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
  if(data.length == 0) return;
  const system = await User.findOne({email:'system@ninepointer.in'}).select('_id');  
  //const uniqueInstrumentTokens = [...new Set(data.map(item => item.instrumentToken))];
  const uniqueTokensMap = {};
  const uniqueInstrumentObjects = data.filter(item => {
      if (!uniqueTokensMap[item.instrumentToken]) {
          uniqueTokensMap[item.instrumentToken] = true;
          return true; // Keep this item
      }
      return false; // Discard this item
  }).map(item => ({
      instrumentToken: item.instrumentToken,
      exchange: item.exchange,
      symbol: item.symbol
  }));
  console.log('getting contest');
  const pricesByTokens = await fetchPricesForTokensArr(uniqueInstrumentObjects);
  const companyTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity: -(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots>0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, 
      instrumentToken: item?.instrumentToken,contestId: item?.contestId, algoBox: item?.algoBoxId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(-item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  const userTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity:(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots<0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, isRealTrade:false,
      instrumentToken: item?.instrumentToken,contestId: item?.contestId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  // console.log('userTrades', userTradeObjects);
  // console.log('company trades', companyTradeObjects);
  
  await takeDailyContestMockTrades(companyTradeObjects, userTradeObjects);

}

const dailyContestSingleMockMod = async (contestId) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const updates = await PendingOrder.updateMany(
    {
      status: 'Pending',
      sub_product_id: new ObjectId(contestId)
    },
    {
    $set: {
      status: "Cancelled"
    }
  })

  let stopLossData = await client.get('stoploss-stopprofit');
  stopLossData = JSON.parse(stopLossData);
  
  for(let elem in stopLossData){
    console.log(elem);
    let indicesToRemove = [];
    const symbolArr = stopLossData[elem];
    for(let i = 0; i < symbolArr.length; i++){
      if(symbolArr[i]?.sub_product_id?.toString() === contestId?.toString()){
        indicesToRemove.push(i);
        // console.log(symbolArr[i])
      }
    }

    // console.log(indicesToRemove);
    indicesToRemove.forEach(index => stopLossData[elem].splice(index, 1, {}));
  }
  await client.set('stoploss-stopprofit', JSON.stringify(stopLossData));


  const data = await DailyContestMock.aggregate(
    [
      {
        $match:
        {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
          contestId: new ObjectId(contestId)
        },
      },
      {
        $group:
        {
          _id: {
            userId: "$trader",
            // subscriptionId: "$subscriptionId",
            // exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
            // algoBoxId: "$algoBox",
            contestId: "$contestId"
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
          algoBoxId: "$_id.algoBoxId",
          contestId: "$_id.contestId"
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
  console.log(data.length);
  if(data.length == 0) return;
  const system = await User.findOne({email:'system@ninepointer.in'}).select('_id');  
  //const uniqueInstrumentTokens = [...new Set(data.map(item => item.instrumentToken))];
  const uniqueTokensMap = {};
  const uniqueInstrumentObjects = data.filter(item => {
      if (!uniqueTokensMap[item.instrumentToken]) {
          uniqueTokensMap[item.instrumentToken] = true;
          return true; // Keep this item
      }
      return false; // Discard this item
  }).map(item => ({
      instrumentToken: item.instrumentToken,
      exchange: item.exchange,
      symbol: item.symbol
  }));
  console.log('getting contest');
  const pricesByTokens = await fetchPricesForTokensArr(uniqueInstrumentObjects);
  const companyTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity: -(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots>0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, 
      instrumentToken: item?.instrumentToken,contestId: item?.contestId, algoBox: item?.algoBoxId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(-item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  const userTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity:(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots<0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, isRealTrade:false,
      instrumentToken: item?.instrumentToken,contestId: item?.contestId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  console.log('userTrades', userTradeObjects);
  console.log('company trades', companyTradeObjects);
  
  await takeDailyContestMockTrades(companyTradeObjects, userTradeObjects);

}

const marginXMockMod = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const data = await MarginXMock.aggregate(
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
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
            // algoBoxId: "$algoBox",
            marginxId: "$marginxId"
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
          algoBoxId: "$_id.algoBoxId",
          marginxId: "$_id.marginxId"
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
  if(data.length == 0) return;
  const system = await User.findOne({email:'system@ninepointer.in'}).select('_id');  
  //const uniqueInstrumentTokens = [...new Set(data.map(item => item.instrumentToken))];
  const uniqueTokensMap = {};
  const uniqueInstrumentObjects = data.filter(item => {
      if (!uniqueTokensMap[item.instrumentToken]) {
          uniqueTokensMap[item.instrumentToken] = true;
          return true; // Keep this item
      }
      return false; // Discard this item
  }).map(item => ({
      instrumentToken: item.instrumentToken,
      exchange: item.exchange,
      symbol: item.symbol
  }));
  const pricesByTokens = await fetchPricesForTokensArr(uniqueInstrumentObjects);
  const companyTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity: -(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots>0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, 
      instrumentToken: item?.instrumentToken,marginxId: item?.marginxId, algoBox: item?.algoBoxId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(-item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  const userTradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity:(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots<0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, isRealTrade:false,
      instrumentToken: item?.instrumentToken,marginxId: item?.marginxId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  
  await takeMarginXMockTrades(companyTradeObjects, userTradeObjects);

}


async function fetchPricesForTokens(tokenObjects) {
  // Initiate all the fetch operations in parallel
  const fetchPromises = tokenObjects.map(async (obj) => {
      const priceObj = await singleLivePrice(obj.exchange, obj.symbol);
      return{price: priceObj.last_price, token: obj.instrumentToken}
  });

  // Wait for all fetch operations to complete
  const fetchedPrices = await Promise.all(fetchPromises);

  // Convert the array of results into the desired object format
  const priceByToken = {};
  for (let item of fetchedPrices) {
      priceByToken[item.token] = item.price;
  }

  return priceByToken;
}

async function fetchPricesForTokensArr(tokenObjects) {
  try {
    // Fetch all the prices in one API call
    console.log('token objects', tokenObjects);
    const fetchedPrices = await getLivePrices(tokenObjects);
    console.log('fetched prices', fetchedPrices);

    // Convert the array of results into the desired object format
    const priceByToken = {};

    for (let item of fetchedPrices) {
      const matchedTokenObj = tokenObjects.find(obj => obj?.instrumentToken.toString() == item.instrument_token.toString());

      if (matchedTokenObj && matchedTokenObj?.instrumentToken) {
        priceByToken[matchedTokenObj?.instrumentToken.toString()] = item.last_price;
      }
    }

    return priceByToken;

  } catch (err) {
    console.error(err);
    return {};
  }
}

const contestTradeLive = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let date = new Date();
      let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      todayDate = todayDate + "T00:00:00.000Z";
      const today = new Date(todayDate);

      const data = await ContestLiveTradeCompany.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            },
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              userId: "$trader",
              contestId:"$contestId",
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
          $project: {
            _id: 0,
            userId: "$_id.userId",
            contestId:"$_id.contestId",
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
      ]);
      console.log("collectiong", data);

      if(data.length ==0){
        resolve();
        return;
      }

      for (let i = 0; i < data.length; i++) {
        let date = new Date();
        let transaction_type = data[i].runningLots > 0 ? "BUY" : "SELL";
        let quantity = Math.abs(data[i].runningLots);

        let algoBox = await Algo.findOne({ status: "Active" });

        let realBuyOrSell;
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

        let system = await User.findOne({ email: "system@ninepointer.in" });
        let createdBy = system._id;

        let Obj = {};
        Obj.symbol = data[i].symbol;
        Obj.Product = data[i].Product;
        Obj.instrumentToken = data[i].instrumentToken;
        Obj.exchangeInstrumentToken = data[i].exchangeInstrumentToken;
        Obj.real_instrument_token = data[i].instrumentToken;
        Obj.exchange = data[i].exchange;
        Obj.validity = data[i].validity;
        Obj.order_type = data[i].order_type;
        Obj.variety = data[i].variety;
        Obj.buyOrSell = buyOrSell;
        Obj.realBuyOrSell = realBuyOrSell;
        Obj.trader = data[i].userId;
        Obj.algoBoxId = data[i].algoBoxId;
        Obj.autoTrade = true;
        Obj.dontSendResp = true;
        Obj.createdBy = createdBy;
        Obj.contestId = data[i].contestId;

        const processOrder = async () => {
          if (quantity == 0) {
            return;
          }
           else if (quantity > (data[i].symbol.includes("BANK") ? 900 : 1800)) {
            let tempQuantity = data[i].symbol.includes("BANK") ? 900 : 1800;

            Obj.Quantity = tempQuantity;
            Obj.userQuantity = tempQuantity / algoBox?.lotMultipler;
            Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
            // console.log("before autoplaceorder in elseif");
            Obj.marginData = {isSquareOff: false, isAddMoreFund: false, isReleaseFund: true, zerodhaMargin: 0, runningLots: quantity};

            await autoPlaceOrder(Obj);
            quantity = quantity - tempQuantity;
            await delay(300);
            return processOrder(); // Ensure that the promise returned by processOrder is returned
          } else {
            Obj.Quantity = quantity;
            Obj.userQuantity = quantity / algoBox.lotMultipler;
            Obj.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`;
            Obj.marginData = {isSquareOff: true, isAddMoreFund: false, isReleaseFund: false, zerodhaMargin: 0, runningLots: quantity};

            // console.log("before autoplaceorder in else");
            await autoPlaceOrder(Obj);
          }
        };

        await processOrder();
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const battleTradeMod = async () => {
  console.log("in battle trade mode")
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  // let tradeArr = [];
  const data = await BattleTrade.aggregate(
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
            battleId: "$battleId",
            exchange: "$exchange",
            symbol: "$symbol",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            // variety: "$variety",
            // validity: "$validity",
            // order_type: "$order_type",
            // Product: "$Product",
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
          battleId: "$_id.battleId",
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
  if(data.length == 0) return;
  const system = await User.findOne({email:'system@ninepointer.in'}).select('_id');  
  //const uniqueInstrumentTokens = [...new Set(data.map(item => item.instrumentToken))];
  const uniqueTokensMap = {};
  const uniqueInstrumentObjects = data.filter(item => {
      if (!uniqueTokensMap[item.instrumentToken]) {
          uniqueTokensMap[item.instrumentToken] = true;
          return true; // Keep this item
      }
      return false; // Discard this item
  }).map(item => ({
      instrumentToken: item.instrumentToken,
      exchange: item.exchange,
      symbol: item.symbol
  }));
  const pricesByTokens = await fetchPricesForTokensArr(uniqueInstrumentObjects);
  const tradeObjects = data.map((item)=>{
    return {
      status: "COMPLETE", average_price: pricesByTokens[item?.instrumentToken.toString()], Quantity:-(item?.runningLots), Product:item?.Product, 
      buyOrSell:item?.runningLots>0?'SELL':'BUY',variety:item?.variety, validity: item?.validity, exchange:item?.exchange, order_type:item?.order_type, 
      symbol: item?.symbol, placed_by: "stoxhero",order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`, 
      instrumentToken: item?.instrumentToken, battleId: item?.battleId, exchangeInstrumentToken: item?.exchangeInstrumentToken,createdBy:system?._id, trader: item?.userId, amount: (Number(-item?.runningLots) * pricesByTokens[item?.instrumentToken.toString()]), trade_time: new Date(new Date().getTime() + (5*60 + 30) * 60 * 1000),
    }
  });
  console.log('tradeObjects', tradeObjects);
  
  await takeBattleTrades(tradeObjects);

}



module.exports = { dailyContestSingleMockMod, dailyContestMock, tenx, paperTrade, infinityTrade, internship, infinityTradeLive, contestTradeLive, internshipTradeMod, dailyContestMockMod, marginXMockMod, battleTradeMod };

