// const TenxTrader = require("../../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../../models/PendingOrder/pendingOrderSchema")
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../../../marketData/redisClient');



exports.applyingSLSP = async (req, otherData, session, docId) => {
    let isRedisConnected = await getValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
        exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
        stopProfitPrice, stopLossPrice, createdBy, order_type } = req.body ? req.body : req 
        console.log("stopProfitPrice && stopLossPrice", req.body ? req.body : req)

    let originalLastPriceUser;
    if(Object.keys(otherData).length > 0){
        Quantity = otherData.quantity ? otherData.quantity : Quantity;
        stopProfitPrice = otherData.stopProfitPrice ? otherData.stopProfitPrice : stopProfitPrice;
        stopLossPrice = otherData.stopLossPrice ? otherData.stopLossPrice : stopLossPrice;
        originalLastPriceUser = otherData.ltp;
    }

    console.log("originalLastPriceUser", originalLastPriceUser)
  
    let pendingOrderRedis = "";
    const pendingBuyOrSell = buyOrSell === "BUY" ? "SELL" : "BUY";
    let pendingOrder = [];
    console.log("stopProfitPrice && stopLossPrice", stopProfitPrice , stopLossPrice)
    if (stopProfitPrice && stopLossPrice) {
      const pendingOrderStopLoss = {
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopLossPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopLoss"
      }

      const pendingOrderStopProfit = {
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopProfitPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopProfit"
      }

      pendingOrder.push(pendingOrderStopLoss);
      pendingOrder.push(pendingOrderStopProfit);
    } else if (stopProfitPrice || stopLossPrice) {
      let executionPrice = stopProfitPrice ? stopProfitPrice : stopLossPrice;
      let type = stopProfitPrice ? "StopProfit" : "StopLoss";
      pendingOrder = [{
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: executionPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type
      }]
    }

    let order = [];
    if(session){
        order = await PendingOrder.create(pendingOrder, { session });
    } else{
        order = await PendingOrder.create(pendingOrder);
    }

    let dataObj = {};
    let dataArr = [];

    for (let elem of order) {
      dataArr.push({
        product_type: elem?.product_type, execution_price: elem?.execution_price, Quantity: elem?.Quantity,
        Product: elem?.Product, buyOrSell: elem?.buyOrSell, variety: elem?.variety, validity: elem?.validity,
        exchange: elem?.exchange, order_type: elem?.order_type, symbol: elem?.symbol, execution_time: elem?.execution_time,
        instrumentToken: elem?.instrumentToken, exchangeInstrumentToken: elem?.exchangeInstrumentToken,
        last_price: elem?.last_price, createdBy: elem?.createdBy, type: elem?.type, subscriptionId, order_id, _id: elem?._id
      })
    }

    dataObj[`${instrumentToken}`] = dataArr;

    if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
      const order = await PendingOrder.find({status: "Pending"});
      const transformedObject = {};

      order.forEach(item => {
        const { instrumentToken, ...rest } = item;
        
        if (!transformedObject[instrumentToken]) {
          transformedObject[instrumentToken] = [];
        }
        // console.log(rest._doc)
        rest._doc.subscriptionId = subscriptionId;
        rest._doc.order_id = order_id;
        transformedObject[instrumentToken].push(rest._doc);
      });

      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(transformedObject));
    }

    if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
      data = await client.get('stoploss-stopprofit');
      data = JSON.parse(data);
      if (data[`${instrumentToken}`]) {
        data[`${instrumentToken}`] = data[`${instrumentToken}`].concat(dataArr);
      } else {
        data[`${instrumentToken}`] = dataArr;
      }
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(data));
    } else {
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(dataObj));
    }

    console.log("pendingOrderRedis", pendingOrderRedis)
    return pendingOrderRedis;

}