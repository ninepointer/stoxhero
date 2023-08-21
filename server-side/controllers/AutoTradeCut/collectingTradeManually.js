const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany");
const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const Algo = require("../../models/AlgoBox/tradingAlgoSchema")
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const Internship = require("../../models/mock-trade/internshipTrade");
const PaperTrader = require("../../models/mock-trade/paperTrade");
const User = require("../../models/User/userDetailSchema");
const {autoPlaceOrder} = require("../../services/xts/xtsInteractive")
const { takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade, takeAutoDailyContestMockTrade } = require("./autoTradeManually");
const DailyContestMock = require("../../models/DailyContest/dailyContestMockCompany");

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
    Obj.OrderType = data[i].order_type;
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
    Obj.OrderType = data[i].order_type;
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
    Obj.OrderType = data[i].order_type;
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
            variety: "$variety",
            validity: "$validity",
            order_type: "$order_type",
            Product: "$Product",
            algoBoxId: "$algoBox",
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
    Obj.OrderType = data[i].order_type;
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
        // tradeArr.push({ value: JSON.stringify(Obj) });
        await takeAutoDailyContestMockTrade(Obj);
        return recursiveFunction(quantity - tempQuantity);
      }
    }
  }

  if(data.length > 0){
    await infinityTrade();
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
        Obj.OrderType = data[i].order_type;
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

module.exports = { dailyContestMock, tenx, paperTrade, infinityTrade, internship, infinityTradeLive };

