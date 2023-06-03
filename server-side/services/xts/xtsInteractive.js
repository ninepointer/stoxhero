const XTSInteractive = require('xts-interactive-api').Interactive;
const XTSInteractiveWS = require('xts-interactive-api').WS;
const RetrieveOrder = require("../../models/TradeDetails/retreiveOrder")
const io = require('../../marketData/socketio');
const { xtsAccountType, zerodhaAccountType} = require("../../constant");
const { client, getValue } = require('../../marketData/redisClient');
const InfinityLiveTrader = require("../../models/TradeDetails/infinityLiveUser");
const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const InfinityMockTrader = require("../../models/mock-trade/infinityTrader");
const InfinityMockCompany = require("../../models/mock-trade/infinityTradeCompany");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const RedisBackup = require("../../models/TradeDetails/orderIdKeyBackup");
const mongoose = require('mongoose');
const { save } = require("./xtsHelper/saveXtsCred");
const { ObjectId } = require('mongodb');
const RequestToken = require("../../models/Trading Account/requestTokenSchema")
const axios = require("axios");


let xtsInteractiveWS;
let xtsInteractiveAPI;
// let isReverseTrade = false;
const interactiveLogin = async () => {
  xtsInteractiveAPI = new XTSInteractive(
    process.env.INTERACTIVE_URL
  );

  xtsInteractiveWS = new XTSInteractiveWS(
    process.env.INTERACTIVE_URL
  );
  // console.log("xtsInteractiveAPI", xtsInteractiveAPI)
  let loginRequest = {
    secretKey: process.env.INTERACTIVE_SECRET_KEY,
    appKey: process.env.INTERACTIVE_APP_KEY,
  };

  try {
    (async () => {
      console.log(loginRequest, process.env.INTERACTIVE_URL)
      let logIn = await xtsInteractiveAPI.logIn(loginRequest);
      console.log(logIn)
      let socketInitRequest = {
        userID: process.env.XTS_USERID,
        publishFormat: 'JSON',
        broadcastMode: 'Full',
        token: logIn?.result?.token
      };
      xtsInteractiveWS.init(socketInitRequest);

      xtsInteractiveWS.onConnect((connectData) => {
        // console.log("socket connection", connectData);
      });

      xtsInteractiveWS.onJoined((joinedData) => {
        console.log("joinedData", joinedData);
      });

      await placedOrderData();
      await ifServerCrashAfterOrder();
      await save(logIn?.result?.userID, logIn?.result?.token, "Interactive")

    })();
  } catch (err) {
    console.log(err);
  }

}

const placedOrderData = async () => {
  // let isRedisConnected = getValue();
  xtsInteractiveWS.onOrder(async (orderData) => {
    // console.log(orderData)
    try{
      if (orderData.OrderStatus === "Rejected" || orderData.OrderStatus === "Filled") {

        let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
          TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
          ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI, OrderUniqueIdentifier } = orderData;
  
          const exchangeTime = ExchangeTransactTimeAPI;
          const date1 = exchangeTime.split(" ");
          const date2 = date1[0].split("-");
          const date3 = `${date2[2]}-${date2[1]}-${date2[0]} ${date1[1]}`
          const utcDate = new Date(date3).toUTCString();
  
          let date = new Date();
    
          const retreiveObj = {
            appOrderId: AppOrderID, order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${AppOrderID}`, status: (OrderStatus === "Filled" ? "COMPLETE" : "REJECTED"), average_price: OrderAverageTradedPrice,
            quantity: OrderQuantity, product: ProductType, transaction_type: OrderSide,
            exchange_order_id: ExchangeOrderID, order_timestamp: LastUpdateDateTime, validity: TimeInForce,
            exchange_timestamp: ExchangeTransactTime, order_type: OrderType, price: OrderPrice,
            disclosed_quantity: OrderDisclosedQuantity, placed_by: ClientID, status_message: CancelRejectReason,
            instrument_token: ExchangeInstrumentID, exchange_update_timestamp: new Date(utcDate), guid: `${ExchangeOrderID}${AppOrderID}`,
            exchangeInstrumentToken: ExchangeInstrumentID, orderUniqueIdentifier: OrderUniqueIdentifier
          };
  
          const saveOrder = await RetrieveOrder.updateOne({order_id: AppOrderID}, { $setOnInsert: retreiveObj }, { upsert: true });
  
          // let traderData = JSON.parse(OrderUniqueIdentifier);
          const initialTime = Date.now();

          if(OrderUniqueIdentifier){
            console.log("inside if listener")
            await placedOrderDataHelper(initialTime, orderData);
            return;
          }
      }
    } catch(err){
      console.log(err);
    }
  })
}

const placedOrderDataHelper = async(initialTime, orderData) => {
  let isRedisConnected = getValue();
  let date = new Date();
  console.log("inside placedOrderDataHelper")
  let {OrderSide, buyOrSell, ExchangeInstrumentID, ProductType,
        OrderType, TimeInForce, OrderQuantity} = orderData;
  let traderData = {};
  if (Date.now() - initialTime >= 2000) {
    let exchangeSegment;
    let exchange = "NFO";
    if (exchange === "NFO") {
      exchangeSegment = 'NSEFO'
    }
    if (exchange === "NSE") {
      exchangeSegment = 'NSECM'
    }
    if (OrderSide === "Buy") {
      buyOrSell = "SELL"
    } else {
      buyOrSell = "BUY"
    }

    const response = await xtsInteractiveAPI.placeOrder({
      exchangeSegment: exchangeSegment,
      exchangeInstrumentID: ExchangeInstrumentID,
      productType: ProductType,
      orderType: OrderType,
      orderSide: buyOrSell,
      timeInForce: TimeInForce,
      disclosedQuantity: 0,
      orderQuantity: Math.abs(OrderQuantity),
      limitPrice: 0,
      stopPrice: 0,
      clientID: process.env.XTS_CLIENTID,
    });

    // isReverseTrade = true;
    await client.HSET('liveOrderBackupKey', `${(response?.result?.AppOrderID).toString()}`, JSON.stringify(traderData));

    if(!autoTrade)
    io.emit(`sendResponse${traderData?.trader.toString()}`, { message: "Order Rejected Unexpexctedly. Please Place Your Order Again.", status: "Error" })
    return; // Terminate recursion
  }

  if(isRedisConnected && await client.exists(`liveOrderBackupKey`)){
    let data = await client.HGET('liveOrderBackupKey', `${(orderData?.AppOrderID).toString()}`);
    traderData = JSON.parse(data);
  } else{
    traderData = await RedisBackup.findOne({order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${orderData?.AppOrderID}`})
  }
  const startTime = Date.now();

  console.log("traderData", traderData)
  if(!traderData?.trader){
    console.log("running recursively")
    await placedOrderDataHelper(initialTime, orderData); 
  }

  if(traderData?.trader){
    console.log("inside getPlacedOrderAndSave")

    await getPlacedOrderAndSave(orderData, traderData, startTime);
    return;
  }
}

const placeOrder = async (obj, req, res) => {

  try {
    let isRedisConnected = getValue();
    let exchangeSegment;
    if (obj.exchange === "NFO") {
      exchangeSegment = 'NSEFO'
    }
    if (obj.exchange === "NSE") {
      exchangeSegment = 'NSECM'
    }



    const response = await xtsInteractiveAPI.placeOrder({
      exchangeSegment: exchangeSegment,
      exchangeInstrumentID: obj.exchangeInstrumentToken,
      productType: obj.Product,
      orderType: obj.OrderType,
      orderSide: obj.buyOrSell,
      timeInForce: obj.validity,
      disclosedQuantity: 0,
      orderQuantity: obj.Quantity,
      limitPrice: 0,
      stopPrice: 0,
      clientID: process.env.XTS_CLIENTID,
      orderUniqueIdentifier: `${Date.now()}`
    });

    //check status, if status is 400 then send below error response.
    console.log("response", response)
    let date = new Date();
    let traderDataObj = {
      appOrderId: response?.result?.AppOrderID,
      order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${response?.result?.AppOrderID}`,
      trader: req.body.trader,
      algoBoxId: req.body.algoBoxId,
      exchange: req.body.exchange,
      symbol: req.body.symbol,
      buyOrSell: req.body.buyOrSell,
      Quantity: req.body.Quantity,
      variety: req.body.variety,
      instrumentToken: req.body.instrumentToken,
      dontSendResp: req.body.dontSendResp,
      tradedBy: req.user._id,
      uniqueId: `${req.user.first_name}${req.user.mobile}`
    }

    if (response?.result?.AppOrderID) {
      if (isRedisConnected && await client.exists(`liveOrderBackupKey`)) {
        let data = await client.HSET('liveOrderBackupKey', `${(orderData?.AppOrderID).toString(), JSON.stringify(traderDataObj)}`);
        // traderData = JSON.parse(data);
        await RedisBackup.create(traderDataObj)
      } else {
        await RedisBackup.create(traderDataObj)
      }
    }
    if (!response?.result?.AppOrderID) {
      res.status(500).json({ message: "Something Went Wrong. Please Trade Again.", err: "Error" });
      await ifNoResponseFromXTS(`${req.user.first_name}${req.user.mobile}`);
      return;
    }

  } catch (err) {
    console.log("err in placeorder", err);
  }
}

const ifNoResponseFromXTS = async (uniqueId) => {

  
  let url = `${process.env.INTERACTIVE_URL}/interactive/orders`;
  const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});
  let token = accessToken[0]?.accessToken;

  let authOptions = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.get(url, authOptions)
    let orders = response.data?.result;
    for(let i = 0; i < orders.length; i++){

      let { ExchangeInstrumentID, OrderSide, OrderType, ProductType,
        TimeInForce, OrderQuantity, ExchangeSegment } = orders[i];
    
      let uniqueIdentifier = JSON.parse(orders[i].OrderUniqueIdentifier);
      if(uniqueIdentifier.uniqueId === uniqueId && orders[i].OrderStatus === "Filled"){
        if(OrderSide === "Buy"){
          OrderSide = "SELL";
        } else{
          OrderSide = "BUY"
        }
        const response = await xtsInteractiveAPI.placeOrder({
          exchangeSegment: ExchangeSegment,
          exchangeInstrumentID: ExchangeInstrumentID,
          productType: ProductType,
          orderType: OrderType,
          orderSide: OrderSide,
          timeInForce: TimeInForce,
          disclosedQuantity: 0,
          orderQuantity: Math.abs(OrderQuantity),
          limitPrice: 0,
          stopPrice: 0,
          clientID: process.env.XTS_CLIENTID,
        });
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const ifServerCrashAfterOrder = async () => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);


  let liveCompany = await InfinityLiveCompany.find({trade_time: {$gte: today }});

  let url = `${process.env.INTERACTIVE_URL}/interactive/orders`;
  const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});
  let token = accessToken[0]?.accessToken;

  let authOptions = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.get(url, authOptions)
    let orders = response.data?.result;
    for(let i = 0; i < orders.length; i++){
      let { ExchangeInstrumentID, OrderSide, OrderType, ProductType,
        TimeInForce, OrderQuantity, ExchangeSegment } = orders[i];

      for(let j = 0; j < liveCompany.length; j++){
        if(liveCompany[j].appOrderId !== orders[i].AppOrderID && orders[i].OrderStatus === "Filled"){
          if(OrderSide === "Buy"){
            OrderSide = "SELL";
          } else{
            OrderSide = "BUY"
          }
          const response = await xtsInteractiveAPI.placeOrder({
            exchangeSegment: ExchangeSegment,
            exchangeInstrumentID: ExchangeInstrumentID,
            productType: ProductType,
            orderType: OrderType,
            orderSide: OrderSide,
            timeInForce: TimeInForce,
            disclosedQuantity: 0,
            orderQuantity: Math.abs(OrderQuantity),
            limitPrice: 0,
            stopPrice: 0,
            clientID: process.env.XTS_CLIENTID,
          });
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const autoPlaceOrder = async (obj) => {
  let {symbol, Product, exchangeInstrumentToken, exchange, validity,
      OrderType, variety, buyOrSell, realBuyOrSell, trader, algoBoxId,
      autoTrade, dontSendResp, createdBy, Quantity, userQuantity, instrumentToken} = obj;
  let isRedisConnected = getValue();
  isReverseTrade = false;
  let exchangeSegment;
  if (exchange === "NFO") {
    exchangeSegment = 'NSEFO'
  }
  if (exchange === "NSE") {
    exchangeSegment = 'NSECM'
  }
  const response = await xtsInteractiveAPI.placeOrder({
    exchangeSegment: exchangeSegment,
    exchangeInstrumentID: exchangeInstrumentToken,
    productType: Product,
    orderType: OrderType,
    orderSide: realBuyOrSell,
    timeInForce: validity,
    disclosedQuantity: 0,
    orderQuantity: Quantity,
    limitPrice: 0,
    stopPrice: 0,
    clientID: process.env.XTS_CLIENTID,
    orderUniqueIdentifier: `${Date.now()}`
  });

  let date = new Date();

  // let backupObj = {
  //   appOrderId: response?.result?.AppOrderID,
  //   order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${response?.result?.AppOrderID}`,
  //   trader: trader,
  //   algoBoxId: algoBoxId,
  //   exchange: exchange,
  //   symbol: symbol,
  //   buyOrSell: buyOrSell,
  //   Quantity: userQuantity,
  //   variety: variety,
  //   instrumentToken: instrumentToken,
  //   dontSendResp: dontSendResp,
  //   tradedBy: createdBy
  // }

  let traderDataObj = {
    appOrderId: response?.result?.AppOrderID,
    order_id: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${response?.result?.AppOrderID}`,
    trader: trader,
    algoBoxId: algoBoxId,
    exchange: exchange,
    symbol: symbol,
    buyOrSell: buyOrSell,
    Quantity: userQuantity,
    variety: variety,
    instrumentToken: instrumentToken,
    dontSendResp: dontSendResp,
    tradedBy: createdBy,
    autoTrade: autoTrade
  }

  //check status, if status is 400 then send below error response.

  console.log("app order id", response?.result?.AppOrderID, response)
  // setTimeout(async ()=>{
    if (response?.result?.AppOrderID) {
      if(isRedisConnected){
        await client.HSET('liveOrderBackupKey', `${(response?.result?.AppOrderID).toString()}`, JSON.stringify(traderDataObj));
      }
      const redisBackup = await RedisBackup.create(traderDataObj);  
      // res.status(200).json({message: "Live"})
    } else{
      // return res.status(500).json({message: "Something Went Wrong. Please Trade Again.", err: "Error"})
    }
  // }, 4000)

}


const getPlacedOrderAndSave = async (orderData, traderData, startTime) => {
  
  let isRedisConnected = getValue();

  let { algoBoxId, exchange, symbol, buyOrSell, Quantity, variety, trader,
    instrumentToken, dontSendResp, tradedBy, autoTrade } = traderData

  let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
    TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
    ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI } = orderData;

    if (exchange === "NFO") {
      exchangeSegment = 2;
    }
    console.log("inside getPlacedOrderAndSave 2")

  if (Date.now() - startTime >= 10000) {
    let exchangeSegment;
    if (exchange === "NFO") {
      exchangeSegment = 'NSEFO'
    }
    if (exchange === "NSE") {
      exchangeSegment = 'NSECM'
    }
    if (OrderSide === "Buy") {
      buyOrSell = "SELL"
    } else {
      buyOrSell = "BUY"
    }

    const response = await xtsInteractiveAPI.placeOrder({
      exchangeSegment: exchangeSegment,
      exchangeInstrumentID: ExchangeInstrumentID,
      productType: ProductType,
      orderType: OrderType,
      orderSide: buyOrSell,
      timeInForce: TimeInForce,
      disclosedQuantity: 0,
      orderQuantity: Math.abs(OrderQuantity),
      limitPrice: 0,
      stopPrice: 0,
      clientID: process.env.XTS_CLIENTID,
    });
    await client.HSET('liveOrderBackupKey', `${(response?.result?.AppOrderID).toString()}`, JSON.stringify(traderData));

    if(!autoTrade)
    io.emit(`sendResponse${trader.toString()}`, { message: "Something went wrong. Please try again.", status: "Error" })
    return; // Terminate recursion
  }



  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.999Z";
  const today = new Date(todayDate);
  const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
  const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
  const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });

  const session = await mongoose.startSession();


  try {
    let status, transaction_type;
    session.startTransaction();
    if (OrderStatus === "Rejected") {
      status = "REJECTED";
    } else if (OrderStatus === "Filled") {
      status = "COMPLETE";
    }

    if (OrderSide == "Sell") {
      transaction_type = "SELL";
    } else if (OrderSide == "Buy") {
      transaction_type = "BUY";
    }

    if (!CancelRejectReason) {
      CancelRejectReason = "null"
    }
    if (!ExchangeTransactTime) {
      ExchangeTransactTime = "null"
    }
    if (!ExchangeOrderID) {
      ExchangeOrderID = "null"
    }
    if (!OrderAverageTradedPrice) {
      OrderAverageTradedPrice = 0;
    }

    if (transaction_type == "SELL") {
      OrderQuantity = 0 - OrderQuantity;
    }
    if (buyOrSell == "SELL") {
      Quantity = 0 - Quantity;
    }

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
        let brokerage = Number(sellBrokerData.brokerageCharge);
        let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
        let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
        let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
        let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
        let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

        return finalCharge
    }

    let brokerageCompany = 0;
    let brokerageUser = 0;

    if (transaction_type === "BUY" && status == "COMPLETE") {
      brokerageCompany = buyBrokerage(Math.abs(Number(OrderQuantity)) * OrderAverageTradedPrice, brokerageDetailBuy[0]);
    } else if (transaction_type === "SELL" && status == "COMPLETE")  {
      brokerageCompany = sellBrokerage(Math.abs(Number(OrderQuantity)) * OrderAverageTradedPrice, brokerageDetailSell[0]);
    }

    if (buyOrSell === "BUY" && status == "COMPLETE") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * OrderAverageTradedPrice, brokerageDetailBuyUser[0]);
    } else if (buyOrSell === "SELL" && status == "COMPLETE") {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * OrderAverageTradedPrice, brokerageDetailSellUser[0]);
    }

    let order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${AppOrderID}`;

    const companyDoc = {
      appOrderId: AppOrderID, order_id: order_id,
      disclosed_quantity: OrderDisclosedQuantity, price: OrderPrice, guid: `${ExchangeOrderID}${AppOrderID}`,
      status, createdBy: tradedBy, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
      Product: ProductType, buyOrSell: transaction_type,
      variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
      algoBox: algoBoxId, instrumentToken, brokerage: brokerageCompany,
      trader: trader, isRealTrade: true, amount: (Number(OrderQuantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
      exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false,
      exchangeInstrumentToken: ExchangeInstrumentID
    }

    const traderDoc = {
      appOrderId: AppOrderID, order_id: order_id,
      disclosed_quantity: OrderDisclosedQuantity, price: OrderPrice, guid: `${ExchangeOrderID}${AppOrderID}`,
      status, createdBy: tradedBy, average_price: OrderAverageTradedPrice, Quantity: Quantity,
      Product: ProductType, buyOrSell: buyOrSell,
      variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
      instrumentToken, brokerage: brokerageUser, trader: trader,
      isRealTrade: true, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
      exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false,
      exchangeInstrumentToken: ExchangeInstrumentID
    }

    const companyDocMock = {
      appOrderId: AppOrderID, order_id: order_id,
      status, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
      Product: ProductType, buyOrSell: transaction_type, variety, validity: TimeInForce, exchange, order_type: OrderType,
      symbol, placed_by: ClientID, algoBox: algoBoxId,
      instrumentToken, brokerage: brokerageCompany, createdBy: tradedBy,
      trader: trader, isRealTrade: false, amount: (Number(OrderQuantity) * OrderAverageTradedPrice),
      trade_time: LastUpdateDateTime, exchangeInstrumentToken: ExchangeInstrumentID
    }

    const traderDocMock = {
      appOrderId: AppOrderID, order_id: order_id,
      status, average_price: OrderAverageTradedPrice, Quantity: Quantity,
      Product: ProductType, buyOrSell, exchangeInstrumentToken: ExchangeInstrumentID,
      variety, validity: TimeInForce, exchange, order_type: OrderType, symbol, placed_by: ClientID,
      isRealTrade: false, instrumentToken, brokerage: brokerageUser,
      createdBy: tradedBy, trader: trader, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
    }

    const liveCompanyTrade = await InfinityLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
    const algoTraderLive = await InfinityLiveTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });
    const mockCompany = await InfinityMockCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDocMock }, { upsert: true, session });
    const algoTrader = await InfinityMockTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDocMock }, { upsert: true, session });
    // const traderDocMock = await InfinityMockTrader.findOne({ _id: algoTrader.upsertedId });
    console.log("algoTrader", algoTrader)
    console.log("algoTraderLive", algoTraderLive)
    console.log("mockCompany", mockCompany)
    console.log("liveCompanyTrade", liveCompanyTrade)

    let isInsertedAllDB = (algoTrader.upsertedId && mockCompany.upsertedId && algoTraderLive.upsertedId && liveCompanyTrade.upsertedId)

    let settingRedis;
    if (isInsertedAllDB && status == "COMPLETE" && await client.exists(`${trader.toString()} overallpnl`)) {
      let pnl = await client.get(`${trader.toString()} overallpnl`)
      pnl = JSON.parse(pnl);
      // console.log("redis pnl", pnl)
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === traderDocMock.instrumentToken && element._id.product === traderDocMock.Product));
      // if instrument is same then just updating value
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (traderDocMock.amount * -1);
        matchingElement.brokerage += Number(traderDocMock.brokerage);
        matchingElement.lastaverageprice = traderDocMock.average_price;
        matchingElement.lots += Number(traderDocMock.Quantity);

      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: traderDocMock.symbol,
            product: traderDocMock.Product,
            instrumentToken: traderDocMock.instrumentToken,
            exchangeInstrumentToken: traderDocMock.exchangeInstrumentToken,
            exchange: traderDocMock.exchange,
          },
          amount: (traderDocMock.amount * -1),
          brokerage: Number(traderDocMock.brokerage),
          lots: Number(traderDocMock.Quantity),
          lastaverageprice: traderDocMock.average_price,
        });
      }
      settingRedis = await client.set(`${trader.toString()} overallpnl`, JSON.stringify(pnl))
      // console.log("in chek if 3", settingRedis)
      console.log(settingRedis)
    }
//  todo, filled and rejected in socket listner
    await client.expire(`${trader.toString()} overallpnl`, secondsRemaining);
    // Commit the transaction

    // console.log("redis setting chaeck", settingRedis)


    if (settingRedis === "OK") {
      await session.commitTransaction();
    } else if(status == "REJECTED"){
      console.log("in rejected")
      await session.commitTransaction();

      if(!autoTrade)
      io.emit(`sendResponse${trader.toString()}`, { message: "Trade rejected due to insufficient balance", err: "Error" })
      return; //check return statement
    } else if(!isRedisConnected){
      await session.commitTransaction();
    } else {
      throw new Error();
    }


    console.log("data saved in retreive order for", AppOrderID)

    if (!dontSendResp ) {
      await client.expire(`liveOrderBackupKey`, 600);
      await client.HDEL('liveOrderBackupKey', AppOrderID.toString());
      io.emit("updatePnl", traderDocMock)
      io.emit(`sendResponse${trader.toString()}`, { message: {Quantity: Quantity, symbol: symbol}, status: "complete" })
      // return res.status(201).json({ message: responseMsg, err: responseErr })
    }
    // }
  } catch (err) {
    await client.del(`${trader.toString()} overallpnl`)
    await session.abortTransaction();

    console.error('Transaction failed, documents not saved:', err);
    console.log(traderData, startTime);
    await getPlacedOrderAndSave(orderData, traderData, startTime);
    // return res.status(201).json({ message: "Order Rejected Unexpexctedly. Please Place Your Order Again.", err: "Error" })

  } finally {
    session.endSession();
  }

  return;
}



//

module.exports = { interactiveLogin, }
  // placeOrder, autoPlaceOrder };


// {
//   "type": "success",
//   "code": "s-user-0001",
//   "description": "Success order book",
//   "result": [
//     {
//       "LoginID": "SYMP1",
//       "ClientID": "SYMP1",
//       "AppOrderID": 648468730,
//       "OrderReferenceID": "",
//       "GeneratedBy": "TWSAPI",
//       "ExchangeOrderID": "1005239196374108",
//       "OrderCategoryType": "NORMAL",
//       "ExchangeSegment": "NSECM",
//       "ExchangeInstrumentID": 16921,
//       "OrderSide": "BUY",
//       "OrderType": "Limit",
//       "ProductType": "NRML",
//       "TimeInForce": "DAY",
//       "OrderPrice": 254.55,
//       "OrderQuantity": 15,
//       "OrderStopPrice": 0,
//       "OrderStatus": "New",
//       "OrderAverageTradedPrice": 250.4,
//       "LeavesQuantity": 1,
//       "CumulativeQuantity": 0,
//       "OrderDisclosedQuantity": 0,
//       "OrderGeneratedDateTime": "14-05-2021 11:17:29",
//       "ExchangeTransactTime": "14-05-2021 11:17:30",
//       "LastUpdateDateTime": "14-05-2021 11:17:29",
//       "OrderExpiryDate": "01-01-1980 00:00:00",
//       "CancelRejectReason": "",
//       "OrderUniqueIdentifier": "123abc",
//       "OrderLegStatus": "SingleOrderLeg",
//       "BoLegDetails": 0,
//       "IsSpread": false,
//       "BoEntryOrderId": "",
//       "MessageCode": 9004,
//       "MessageVersion": 4,
//       "TokenID": 0,
//       "ApplicationType": 0,
//       "SequenceNumber": 0
//     }
//   ]
// }    // else{
    //   let date = new Date();
    //   let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //   todayDate = todayDate + "T00:00:00.000Z";
    //   const today = new Date(todayDate);

    //   let pnlDetails = await InfinityMockTrader.aggregate([
    //     {
    //       $match: {
    //         trade_time: {
    //           $gte: today
    //         },
    //         status: "COMPLETE",
    //         trader: new ObjectId(trader)
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: {
    //           symbol: "$symbol",
    //           product: "$Product",
    //           instrumentToken: "$instrumentToken",
// exchangeInstrumentToken: "$exchangeInstrumentToken",
    //           exchangeInstrumentToken: "$exchangeInstrumentToken",
    //           exchange: "$exchange"
    //         },
    //         amount: {
    //           $sum: { $multiply: ["$amount", -1] },
    //         },
    //         brokerage: {
    //           $sum: {
    //             $toDouble: "$brokerage",
    //           },
    //         },
    //         lots: {
    //           $sum: {
    //             $toInt: "$Quantity",
    //           },
    //         },
    //         lastaverageprice: {
    //           $last: "$average_price",
    //         },
    //       },
    //     },
    //     {
    //       $sort: {
    //         _id: -1,
    //       },
    //     },
    //   ])
    //   console.log("pnlDetails", pnlDetails)
    //   settingRedis = await client.set(`${trader.toString()} overallpnl`, JSON.stringify(pnlDetails))
    // }


