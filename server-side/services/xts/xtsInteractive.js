const XTSInteractive = require('xts-interactive-api').Interactive;
const XTSInteractiveWS = require('xts-interactive-api').WS;
const RetrieveOrder = require("../../models/TradeDetails/retreiveOrder")
const io = require('../../marketData/socketio');
const { xtsAccountType, zerodhaAccountType} = require("../../constant");
const { client, getValue, clientForIORedis } = require('../../marketData/redisClient');
const InfinityLiveTrader = require("../../models/TradeDetails/infinityLiveUser");
const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const InfinityMockTrader = require("../../models/mock-trade/infinityTrader");
const InfinityMockCompany = require("../../models/mock-trade/infinityTradeCompany");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const Setting = require("../../models/settings/setting");
const RedisBackup = require("../../models/TradeDetails/orderIdKeyBackup");
const mongoose = require('mongoose');
const { save } = require("./xtsHelper/saveXtsCred");
const { ObjectId } = require('mongodb');
const RequestToken = require("../../models/Trading Account/requestTokenSchema")
const axios = require("axios");
const {overallLivePnlRedis, overallLivePnlTraderWiseRedis, letestTradeLive} = require("../adminRedis/infinityLive")
const {overallMockPnlRedis, overallMockPnlTraderWiseRedis, letestTradeMock, overallPnlUsers} = require("../adminRedis/infinityMock");
const UserPermission = require("../../models/User/permissionSchema");

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
      // console.log(loginRequest, process.env.INTERACTIVE_URL)
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
        // console.log("joinedData", joinedData);
      });

      await placedOrderData();
      if(process.env.PROD){
        await ifServerCrashAfterOrder();
      }
      await save(logIn?.result?.userID, logIn?.result?.token, "Interactive")

    })();
  } catch (err) {
    console.log(err);
  }

}

const placedOrderData = async () => {
  // let isRedisConnected = getValue();
  xtsInteractiveWS.onOrder(async (orderData) => {
    console.log(orderData)
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
            // console.log("inside if listener")
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
  // console.log("inside placedOrderDataHelper")
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

  // console.log("traderData", traderData)
  if(!traderData?.trader){
    // console.log("running recursively")
    await placedOrderDataHelper(initialTime, orderData); 
  }

  if(orderData?.OrderUniqueIdentifier.includes("TMS")){
    console.log("inside saveToMockSwitch")
    await saveToMockSwitch(orderData, traderData, startTime);
    return;
  }

  if(traderData?.trader){
    // console.log("inside getPlacedOrderAndSave")

    await getPlacedOrderAndSave(orderData, traderData, startTime);
    return;
  }
}

const placeOrder = async (obj, req, res) => {
  let date = new Date();
  try {
    let isRedisConnected = getValue();
    let exchangeSegment;
    if (obj.exchange === "NFO") {
      exchangeSegment = 'NSEFO'
    }
    if (obj.exchange === "NSE") {
      exchangeSegment = 'NSECM'
    }

console.log({
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
  orderUniqueIdentifier: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
})

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
      orderUniqueIdentifier: `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
    });

    //check status, if status is 400 then send below error response.
    console.log("response", response)
    
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
      uniqueId: `${req.user.first_name}${req.user.mobile}`,
      marginData: req.body.marginData
    }

    // console.log(traderDataObj, response?.result?.AppOrderID)
    if (response?.result?.AppOrderID) {
      if (isRedisConnected && await client.exists(`liveOrderBackupKey`)) {
        let data = await client.HSET('liveOrderBackupKey', (response?.result?.AppOrderID).toString(), JSON.stringify(traderDataObj));
        // traderData = JSON.parse(data);
        // console.log("this is data", data);
        const save = await RedisBackup.create(traderDataObj)
        // console.log(save)
      } else {
        const save = await RedisBackup.create(traderDataObj)
        // console.log("save in else", save)
      }
      res.send("ok");

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

  let url = `${process.env.INTERACTIVE_URL}/interactive/orders?clientID=${process.env.XTS_CLIENTID}`;
  const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});
  let token = accessToken[0]?.accessToken;

  let authOptions = {
    headers: {
      Authorization: token,
    },
  };

  try {
    // console.log(authOptions)
    const response = await axios.get(url, authOptions)
    let orders = response.data?.result;

    // console.log(orders.length, liveCompany.length)

    let openTrade = orders.filter((elem1) => !liveCompany.some((elem2) => elem1.AppOrderID == elem2.appOrderId));

    for(let i = 0; i < openTrade.length; i++){
      let { ExchangeInstrumentID, OrderSide, OrderType, ProductType,
        TimeInForce, OrderQuantity, ExchangeSegment } = openTrade[i]
  
      if(OrderSide === "Buy"){
        OrderSide = "SELL";
      } else{
        OrderSide = "BUY"
      }
  
      // console.log("openTrade", openTrade[i])
  
      const tradeRsponse = await xtsInteractiveAPI.placeOrder({
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
      // console.log(tradeRsponse)
    }

  } catch (err) {
    console.log(err)
  }
}

const autoPlaceOrder = (obj, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let date = new Date();
      let {
        symbol,
        Product,
        exchangeInstrumentToken,
        exchange,
        validity,
        OrderType,
        variety,
        buyOrSell,
        realBuyOrSell,
        trader,
        algoBoxId,
        mockSwitch,
        autoTrade,
        dontSendResp,
        createdBy,
        Quantity,
        userQuantity,
        instrumentToken,
        singleUser
      } = obj;
      let isRedisConnected = getValue();
      isReverseTrade = false;
      let exchangeSegment;
      if (exchange === "NFO") {
        exchangeSegment = 'NSEFO'
      }
      if (exchange === "NSE") {
        exchangeSegment = 'NSECM'
      }
      let uniqueIdentifier;
      if (mockSwitch) {
        uniqueIdentifier = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}TMS`
      } else {
        uniqueIdentifier = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
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
        orderUniqueIdentifier: uniqueIdentifier
      });

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
        autoTrade: autoTrade,
        singleUser: singleUser
      }

      if (response?.result?.AppOrderID) {
        if (isRedisConnected) {
          await client.HSET('liveOrderBackupKey', `${(response?.result?.AppOrderID).toString()}`, JSON.stringify(traderDataObj));
        }
        const redisBackup = await RedisBackup.create(traderDataObj);
        resolve({ message: "Live" });
      } else {
        reject({ message: "Something Went Wrong. Please Trade Again.", err: "Error" });
      }

      if(!dontSendResp){
        setTimeout(()=>{
          res.status(200).json(`ok${Math.random()}`);
        }, 1000)
       
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getPlacedOrderAndSave = async (orderData, traderData, startTime) => {
  
  let isRedisConnected = getValue();

  let { algoBoxId, exchange, symbol, buyOrSell, Quantity, variety, trader,
    instrumentToken, dontSendResp, tradedBy, autoTrade, marginData } = traderData

  let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
    TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
    ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI } = orderData;


    if (exchange === "NFO") {
      exchangeSegment = 2;
    }
    console.log("inside getPlacedOrderAndSave for check")

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
    let status, transaction_type, order_type;
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

    if(OrderType === "Market"){
      order_type = "MARKET";
    }

    traderData.realBuyOrSell = transaction_type;
    traderData.realQuantity = Math.abs(OrderQuantity);


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

    const saveMarginCompany = await marginCalculationCompany(marginData, traderData, OrderAverageTradedPrice, order_id);
    const saveMarginUser = await marginCalculationTrader(marginData, traderData, OrderAverageTradedPrice, order_id);

    const companyDoc = {
      appOrderId: AppOrderID, order_id: order_id,
      disclosed_quantity: OrderDisclosedQuantity, price: OrderPrice, guid: `${ExchangeOrderID}${AppOrderID}`,
      status, createdBy: tradedBy, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
      Product: ProductType, buyOrSell: transaction_type,
      variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
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
      variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
      instrumentToken, brokerage: brokerageUser, trader: trader,
      isRealTrade: true, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
      exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false,
      exchangeInstrumentToken: ExchangeInstrumentID
    }

    const companyDocMock = {
      appOrderId: AppOrderID, order_id: order_id,
      status, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
      Product: ProductType, buyOrSell: transaction_type, variety, validity: TimeInForce, exchange, order_type: order_type,
      symbol, placed_by: ClientID, algoBox: algoBoxId,
      instrumentToken, brokerage: brokerageCompany, createdBy: tradedBy,
      trader: trader, isRealTrade: false, amount: (Number(OrderQuantity) * OrderAverageTradedPrice),
      trade_time: LastUpdateDateTime, exchangeInstrumentToken: ExchangeInstrumentID
    }

    const traderDocMock = {
      appOrderId: AppOrderID, order_id: order_id,
      status, average_price: OrderAverageTradedPrice, Quantity: Quantity,
      Product: ProductType, buyOrSell, exchangeInstrumentToken: ExchangeInstrumentID,
      variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
      isRealTrade: false, instrumentToken, brokerage: brokerageUser,
      createdBy: tradedBy, trader: trader, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
    }
    let isInsertedAllDB;
    try{

    const liveCompanyTrade = await InfinityLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
    const algoTraderLive = await InfinityLiveTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });
    const mockCompany = await InfinityMockCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDocMock }, { upsert: true, session });
    const algoTrader = await InfinityMockTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDocMock }, { upsert: true, session });

    // console.log(liveCompanyTrade, algoTraderLive, mockCompany, algoTrader, new Date())

     isInsertedAllDB = (algoTrader.upsertedId && mockCompany.upsertedId && algoTraderLive.upsertedId && liveCompanyTrade.upsertedId)

    } catch(err){
      console.log(err);
    }



    const pipeline = clientForIORedis.pipeline();

    await pipeline.get(`${trader.toString()} overallpnl`)
    await pipeline.get(`overallLivePnlCompany`);
    await pipeline.get(`traderWiseLivePnlCompany`);
    await pipeline.get(`lastTradeLive`);
    await pipeline.get(`overallMockPnlCompany`);
    await pipeline.get(`traderWiseMockPnlCompany`);
    await pipeline.get(`lastTradeDataMock`);

    const results = await pipeline.exec();

    const traderOverallPnl = results[0][1];
    const companyLiveOverallPnl = results[1][1];
    const traderWiseLivePnl = results[2][1];
    const liveLastTrade = results[3][1];
    const companyMockOverallPnl = results[4][1];
    const traderWiseMockPnl = results[5][1];
    const mockLastTrade = results[6][1];
    
    const overallPnlUser = await overallPnlUsers(traderDocMock, trader, traderOverallPnl);
    const overallLivePnlCompany = await overallLivePnlRedis(companyDoc, companyLiveOverallPnl);
    const overallLiveTraderWisePnl = await overallLivePnlTraderWiseRedis(companyDoc, traderWiseLivePnl);  
    const overallMockPnlCompany = await overallMockPnlRedis(companyDocMock, companyMockOverallPnl);
    const overallMockTraderWisePnl = await overallMockPnlTraderWiseRedis(companyDocMock, traderWiseMockPnl);  
    const lastTradeMock = await letestTradeMock(companyDocMock, liveLastTrade);
    const lastTradeLive = await letestTradeLive(companyDocMock, mockLastTrade);

    // console.log(traderOverallPnl, companyOverallPnl, traderWisePnl)
    let pipelineForSet; 
    
    // if(isInsertedAllDB){
    if(isInsertedAllDB !== null && status == "COMPLETE"){
      pipelineForSet = clientForIORedis.pipeline();

      await pipelineForSet.set(`${trader.toString()} overallpnl`, overallPnlUser);
      await pipelineForSet.set(`overallMockPnlCompany`, overallMockPnlCompany);
      await pipelineForSet.set(`traderWiseMockPnlCompany`, overallMockTraderWisePnl);
      await pipelineForSet.set(`overallLivePnlCompany`, overallLivePnlCompany);
      await pipelineForSet.set(`traderWiseLivePnlCompany`, overallLiveTraderWisePnl);
      await pipelineForSet.set(`lastTradeLive`, lastTradeLive);
      await pipelineForSet.set(`lastTradeDataMock`, lastTradeMock);
  
      await pipelineForSet.exec();
    }


    if(isRedisConnected){
        const pipeline = clientForIORedis.pipeline();

        pipeline.expire(`${trader.toString()} overallpnl`, secondsRemaining);
        pipeline.expire(`overallMockPnlCompany`, secondsRemaining);
        pipeline.expire(`traderWiseMockPnlCompany`, secondsRemaining);
        pipeline.expire(`lastTradeDataMock`, secondsRemaining);
        pipeline.expire(`overallLivePnlCompany`, secondsRemaining);
        pipeline.expire(`traderWiseLivePnlCompany`, secondsRemaining);
        pipeline.expire(`lastTradeLive`, secondsRemaining);

        await pipeline.exec();
    }

    // console.log("pipelineForSet", pipelineForSet, isInsertedAllDB, status)
    let redisApproval = pipelineForSet?._result[0][1] === "OK" && pipelineForSet?._result[1][1] === "OK" && pipelineForSet?._result[2][1] === "OK" && pipelineForSet?._result[3][1] === "OK" && pipelineForSet?._result[4][1] === "OK"

    // let redisApproval = settingRedis === "OK" && redisValueOverall === "OK" && redisValueTrader === "OK" && redisValueMockOverall === "OK" && redisValueMockTrader === "OK"
    // console.log(redisApproval, pipelineForSet?._result[0][1], pipelineForSet?._result[1][1], pipelineForSet?._result[2][1], pipelineForSet?._result[3][1], pipelineForSet?._result[4][1] )
    // if (settingRedis === "OK") {
    if (redisApproval) {
      console.log("in redisApproval")
      await session.commitTransaction();
    } else if (status == "REJECTED") {
      console.log("in rejected")
      await session.commitTransaction();

      if (!autoTrade){
        io.emit(`sendResponse${trader.toString()}`, { message: "Something went wrong. Please try after some time.", status: "error" })
      }
      return; //check return statement
    } else if (!isRedisConnected) {
      await session.commitTransaction();
    } else {
      console.log("in errr")
      throw new Error();
    }


    console.log("data saved in retreive order for", AppOrderID)

    // if (!dontSendResp ) {
    if (!dontSendResp && redisApproval) {
      await client.expire(`liveOrderBackupKey`, 600);
      await client.HDEL('liveOrderBackupKey', AppOrderID.toString());
      io.emit("updatePnl", traderDocMock)
      io.emit(`sendResponse${trader.toString()}`, { message: { Quantity: Quantity, symbol: symbol }, status: "complete" })
      // return res.status(201).json({ message: responseMsg, err: responseErr })
    }
    // }
  } catch (err) {

    if (isRedisConnected) {
      const pipeline = clientForIORedis.pipeline();

      await pipeline.del(`${trader.toString()} overallpnl`);
      await pipeline.del(`overallLivePnlCompany`)
      await pipeline.del(`traderWiseLivePnlCompany`)
      await pipeline.del(`lastTradeLive`)
      await pipeline.del(`overallMockPnlCompany`)
      await pipeline.del(`traderWiseMockPnlCompany`)
      await pipeline.del(`lastTradeDataMock`)

      const results = await pipeline.exec();
    }
    // await client.del(`${trader.toString()} overallpnl`)
    await session.abortTransaction();

    console.error('Transaction failed, documents not saved:', err);
    // console.log(traderData, startTime);
    await getPlacedOrderAndSave(orderData, traderData, startTime);
    // return res.status(201).json({ message: "Order Rejected Unexpexctedly. Please Place Your Order Again.", err: "Error" })

  } finally {
    session.endSession();
  }

  return;
}

const saveToMockSwitch = async (orderData, traderData, startTime, res) => {
  
  // let isRedisConnected = getValue();

  let { algoBoxId, exchange, symbol, buyOrSell, Quantity, variety, trader,
    instrumentToken, dontSendResp, tradedBy, autoTrade, singleUser } = traderData

  let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
    TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
    ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI } = orderData;

    if (exchange === "NFO") {
      exchangeSegment = 2;
    }
    // console.log("inside getPlacedOrderAndSave 2")

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
    let status, transaction_type, order_type;
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

    if(OrderType === "Market"){
      order_type = "MARKET";
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
      variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
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
      variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
      instrumentToken, brokerage: brokerageUser, trader: trader,
      isRealTrade: true, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
      exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false,
      exchangeInstrumentToken: ExchangeInstrumentID
    }



    const liveCompanyTrade = await InfinityLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
    const algoTraderLive = await InfinityLiveTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });

      await session.commitTransaction();

    console.log("data saved in retreive order for", AppOrderID)

    // console.log("dontSendResp bahr", dontSendResp)
    if(!dontSendResp){
      // console.log("dontSendResp", dontSendResp)
      // res.status(201).json({ message: "Switched all traders to mock.", status: "success" })
      // io.emit("updatePnl", traderDocMock)
      if(singleUser){
        const updateRealTrade = await UserPermission.updateOne({userId: new ObjectId(trader)}, { $set: { isRealTradeEnable: false } })
        // console.log("in single user")
      } else{
        const updateRealTrade = await UserPermission.updateMany({}, { $set: { isRealTradeEnable: false } })

        const setting = await Setting.updateOne({}, {
          modifiedOn: new Date(),
          infinityLive: true
        }, { new: true });
      }


      console.log("i am running in last")

    }
    // if (!dontSendResp && redisApproval) {
    //   await client.expire(`liveOrderBackupKey`, 600);
    //   await client.HDEL('liveOrderBackupKey', AppOrderID.toString());
    //   io.emit(`sendResponse${trader.toString()}`, { message: { Quantity: Quantity, symbol: symbol }, status: "complete" })
    //   // return res.status(201).json({ message: responseMsg, err: responseErr })
    // }

  } catch (err) {

    await session.abortTransaction();

    console.error('Transaction failed, documents not saved:', err);
    // console.log(traderData, startTime);
    await saveToMockSwitch(orderData, traderData, startTime);

  } finally {
    session.endSession();
  }

  return;
}


module.exports = { interactiveLogin, placeOrder, autoPlaceOrder, ifServerCrashAfterOrder };

