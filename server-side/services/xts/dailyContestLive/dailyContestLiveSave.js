const {getIOValue} = require('../../../marketData/socketio');
const { xtsAccountType, zerodhaAccountType} = require("../../../constant");
const { client, getValue, clientForIORedis } = require('../../../marketData/redisClient');
const BrokerageDetail = require("../../../models/Trading Account/brokerageSchema");
const DailyContestMockUser = require("../../../models/DailyContest/dailyContestMockUser")
const DailyContestLiveUser = require("../../../models/DailyContest/dailyContestLiveUser")
const DailyContestMockCompany = require("../../../models/DailyContest/dailyContestMockCompany")
const DailyContestLiveCompany = require("../../../models/DailyContest/dailyContestLiveCompany")
const {overallLivePnlCompanyDailyContest, traderWiseLivePnlCompanyDailyContest, lastTradeDataLiveDailyContest} = require("../../adminRedis/Live")
const {overallMockPnlCompanyDailyContest, traderWiseMockPnlCompanyDailyContest, lastTradeDataMockDailyContest, overallpnlDailyContest} = require("../../adminRedis/Mock");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const axios = require("axios");
const AccessToken = require("../../../models/Trading Account/requestTokenSchema");




const dailyContestLiveSave = async (orderData, traderData, startTime) => {
  
    let isRedisConnected = getValue();
    const io = getIOValue();
    let { algoBoxId, exchange, symbol, buyOrSell, Quantity, variety, trader,
      instrumentToken, dontSendResp, tradedBy, autoTrade, marginData, userQuantity, dailyContestId } = traderData
  
    let { ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
      TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice, OrderDisclosedQuantity,
      ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI } = orderData;
  
  
  
      if (exchange === "NFO") {
        exchangeSegment = 2;
      }
  
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

      let token;
      if(await client.exists('interactive-token')){
        console.log("in if condition")
        token = await client.get('interactive-token');
        token = JSON.parse(token);
      } else{
        let tokenData = await AccessToken.findOne({xtsType: "Interactive"}).sort({_id: -1});
        token = tokenData.accessToken
      }
  
      let orderData = new URLSearchParams({
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
      })
  
      let headers = {
        'Authorization': token,
        "content-type": "application/x-www-form-urlencoded"
      }
  
  
     let placedOrder = await axios.post(`${process.env.INTERACTIVE_URL}/interactive/orders`, orderData, {headers : headers})
     const response = placedOrder.data;
  
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
  
    let brokerageDetailBuy;
    let brokerageDetailSell;
    let brokerageDetailBuyUser;
    let brokerageDetailSellUser;

    if(isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)){
        brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
        brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
    } else{
        brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: xtsAccountType});
        await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)){
        brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
        brokerageDetailSell = JSON.parse(brokerageDetailSell);
    } else{
        brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: xtsAccountType});
        await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)){
        brokerageDetailBuyUser = await client.HGET('brokerage', `buy-user`);
        brokerageDetailBuyUser = JSON.parse(brokerageDetailBuyUser);
    } else{
        brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `buy-user`, JSON.stringify(brokerageDetailBuyUser));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage', `sell-user`)){
        brokerageDetailSellUser = await client.HGET('brokerage', `sell-user`);
        brokerageDetailSellUser = JSON.parse(brokerageDetailSellUser);
    } else{
        brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `sell-user`, JSON.stringify(brokerageDetailSellUser));
    }  
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
        algoBox: algoBoxId, instrumentToken, brokerage: brokerageCompany, contestId: dailyContestId,
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
        instrumentToken, brokerage: brokerageUser, trader: trader, contestId: dailyContestId,
        isRealTrade: true, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
        exchange_order_id: ExchangeOrderID, exchange_timestamp: ExchangeTransactTime, isMissed: false,
        exchangeInstrumentToken: ExchangeInstrumentID
      }
  
      const companyDocMock = {
        appOrderId: AppOrderID, order_id: order_id,
        status, average_price: OrderAverageTradedPrice, Quantity: OrderQuantity,
        Product: ProductType, buyOrSell: transaction_type, variety, validity: TimeInForce, exchange, order_type: order_type,
        symbol, placed_by: ClientID, algoBox: algoBoxId, contestId: dailyContestId,
        instrumentToken, brokerage: brokerageCompany, createdBy: tradedBy,
        trader: trader, isRealTrade: false, amount: (Number(OrderQuantity) * OrderAverageTradedPrice),
        trade_time: LastUpdateDateTime, exchangeInstrumentToken: ExchangeInstrumentID
      }
  
      const traderDocMock = {
        appOrderId: AppOrderID, order_id: order_id,
        status, average_price: OrderAverageTradedPrice, Quantity: Quantity,
        Product: ProductType, buyOrSell, exchangeInstrumentToken: ExchangeInstrumentID,
        variety, validity: TimeInForce, exchange, order_type: order_type, symbol, placed_by: ClientID,
        isRealTrade: false, instrumentToken, brokerage: brokerageUser, contestId: dailyContestId,
        createdBy: tradedBy, trader: trader, amount: (Number(Quantity) * OrderAverageTradedPrice), trade_time: LastUpdateDateTime,
      }
      let isInsertedAllDB;
      try{
  
      const liveCompanyTrade = await DailyContestLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
      const algoTraderLive = await DailyContestLiveUser.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });
      const mockCompany = await DailyContestMockCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDocMock }, { upsert: true, session });
      const algoTrader = await DailyContestMockUser.updateOne({ order_id: order_id }, { $setOnInsert: traderDocMock }, { upsert: true, session });
  
       isInsertedAllDB = (algoTrader.upsertedId && mockCompany.upsertedId && algoTraderLive.upsertedId && liveCompanyTrade.upsertedId)
  
      } catch(err){
        console.log(err);
      }
  
  
  
      const pipeline = clientForIORedis.pipeline();
  
      await pipeline.get(`${trader.toString()}${dailyContestId.toString()} overallpnlDailyContest`)
      await pipeline.get(`overallLivePnlCompanyDailyContest`);
      await pipeline.get(`traderWiseLivePnlCompanyDailyContest`);
      await pipeline.get(`lastTradeDataLiveDailyContest`);
      await pipeline.get(`overallMockPnlCompanyDailyContest`);
      await pipeline.get(`traderWiseMockPnlCompanyDailyContest`);
      await pipeline.get(`lastTradeDataMockDailyContest`);
  
      const results = await pipeline.exec();
  
      const traderOverallPnl = results[0][1];
      const companyLiveOverallPnl = results[1][1];
      const traderWiseLivePnl = results[2][1];
      const liveLastTrade = results[3][1];
      const companyMockOverallPnl = results[4][1];
      const traderWiseMockPnl = results[5][1];
      const mockLastTrade = results[6][1];
      
      const overallPnlUser = await overallpnlDailyContest(traderDocMock, trader, traderOverallPnl, dailyContestId);
      const overallLivePnlCompany = await overallLivePnlCompanyDailyContest(companyDoc, companyLiveOverallPnl, dailyContestId);
      const overallLiveTraderWisePnl = await traderWiseLivePnlCompanyDailyContest(companyDoc, traderWiseLivePnl, dailyContestId);  
      const overallMockPnlCompany = await overallMockPnlCompanyDailyContest(companyDocMock, companyMockOverallPnl, dailyContestId);
      const overallMockTraderWisePnl = await traderWiseMockPnlCompanyDailyContest(companyDocMock, traderWiseMockPnl, dailyContestId);  
      const lastTradeMock = await lastTradeDataMockDailyContest(companyDocMock, liveLastTrade, dailyContestId);
      const lastTradeLive = await lastTradeDataLiveDailyContest(companyDocMock, mockLastTrade, dailyContestId);
  
      console.log("overallPnlUser", overallPnlUser, lastTradeLive, dailyContestId)
      let pipelineForSet; 
      
      // if(isInsertedAllDB){
      if(isInsertedAllDB !== null && status == "COMPLETE"){
        pipelineForSet = clientForIORedis.pipeline();
  
        await pipelineForSet.set(`${trader.toString()}${dailyContestId.toString()} overallpnlDailyContest`, overallPnlUser);
        await pipelineForSet.set(`overallMockPnlCompanyDailyContest`, overallMockPnlCompany);
        await pipelineForSet.set(`traderWiseMockPnlCompanyDailyContest`, overallMockTraderWisePnl);
        await pipelineForSet.set(`overallLivePnlCompanyDailyContest`, overallLivePnlCompany);
        await pipelineForSet.set(`traderWiseLivePnlCompanyDailyContest`, overallLiveTraderWisePnl);
        await pipelineForSet.set(`lastTradeDataLiveDailyContest`, lastTradeLive);
        await pipelineForSet.set(`lastTradeDataMockDailyContest`, lastTradeMock);
    
        await pipelineForSet.exec();
      }
  
  
      if(isRedisConnected){
          const pipeline = clientForIORedis.pipeline();
  
          pipeline.expire(`${trader.toString()}${dailyContestId.toString()} overallpnlDailyContest`, secondsRemaining);
          pipeline.expire(`overallMockPnlCompanyDailyContest`, secondsRemaining);
          pipeline.expire(`traderWiseMockPnlCompanyDailyContest`, secondsRemaining);
          pipeline.expire(`lastTradeDataMockDailyContest`, secondsRemaining);
          pipeline.expire(`overallLivePnlCompanyDailyContest`, secondsRemaining);
          pipeline.expire(`traderWiseLivePnlCompanyDailyContest`, secondsRemaining);
          pipeline.expire(`lastTradeDataLiveDailyContest`, secondsRemaining);
  
          await pipeline.exec();
      }
  
      // console.log("pipelineForSet", pipelineForSet, isInsertedAllDB, status)
      let redisApproval = pipelineForSet?._result[0][1] === "OK" && pipelineForSet?._result[1][1] === "OK" && pipelineForSet?._result[2][1] === "OK" && pipelineForSet?._result[3][1] === "OK" && pipelineForSet?._result[4][1] === "OK"
  
      if (redisApproval) {
        // console.log("in redisApproval")
        await session.commitTransaction();
      } else if (status == "REJECTED") {
        console.log("in rejected")
        await session.commitTransaction();
  
        if (!autoTrade){
          io.emit(`sendResponse${trader.toString()}`, { message: "Something went wrong. Please try after some time.", status: "error" })
        }
        return; //check return statement
      } else if (!isRedisConnected || autoTrade) {
        await session.commitTransaction();
      } else {
        console.log("in errr")
        throw new Error();
      }
  
  
      if (!dontSendResp && redisApproval) {
        await client.expire(`liveOrderBackupKey`, 600);
        await client.HDEL('liveOrderBackupKey', AppOrderID.toString());
        io.emit("updatePnl", traderDocMock)
        io.emit(`sendResponse${trader.toString()}`, { message: { Quantity: Quantity, symbol: symbol }, status: "complete" })
      }
    } catch (err) {
  
      if (isRedisConnected) {
        const pipeline = clientForIORedis.pipeline();
  
        await pipeline.del(`${trader.toString()}${dailyContestId.toString()} overallpnlDailyContest`);
        await pipeline.del(`overallLivePnlCompanyDailyContest`)
        await pipeline.del(`traderWiseLivePnlCompanyDailyContest`)
        await pipeline.del(`lastTradeDataLiveDailyContest`)
        await pipeline.del(`overallMockPnlCompanyDailyContest`)
        await pipeline.del(`traderWiseMockPnlCompanyDailyContest`)
        await pipeline.del(`lastTradeDataMockDailyContest`)
  
        const results = await pipeline.exec();
      }
      await session.abortTransaction();
  
      console.error('Transaction failed, documents not saved:', err);
      // console.log(traderData, startTime);
      await dailyContestLiveSave(orderData, traderData, startTime);
      // return res.status(201).json({ message: "Order Rejected Unexpexctedly. Please Place Your Order Again.", err: "Error" })
  
    } finally {
      session.endSession();
    }
  
    return;
}


function buyBrokerage(totalAmount, buyBrokerData) {
    let brokerage = Number(buyBrokerData.brokerageCharge);
    let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
}

function sellBrokerage(totalAmount, sellBrokerData) {
    let brokerage = Number(sellBrokerData.brokerageCharge);
    let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

    return finalCharge
}

module.exports = {dailyContestLiveSave}