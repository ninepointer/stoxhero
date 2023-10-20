// const TenxTrader = require("../../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../../models/PendingOrder/pendingOrderSchema")
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../../../marketData/redisClient');



exports.applyingSLSP = async (req, otherData, session, docId) => {

  try{
    let isRedisConnected = await getValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
        exchangeInstrumentToken, validity, variety, order_id, instrumentToken, last_price,
        stopProfitPrice, stopLossPrice, createdBy, order_type, deviceDetails, id } = req.body ? req.body : req 

    last_price = last_price?.includes("₹") && last_price?.slice(1);
    id = id ? id : subscriptionId;
    if(Object.keys(otherData).length > 0){
        Quantity = otherData.quantity ? otherData.quantity : Quantity;
        stopProfitPrice = otherData.stopProfitPrice ? otherData.stopProfitPrice : stopProfitPrice;
        stopLossPrice = otherData.stopLossPrice ? otherData.stopLossPrice : stopLossPrice;
        last_price = otherData.ltp;
    }

  
    let pendingOrderRedis = "";
    const pendingBuyOrSell = buyOrSell === "BUY" ? "SELL" : "BUY";
    let pendingOrder = [];
    if (stopProfitPrice && stopLossPrice) {
      const pendingOrderStopLoss = {
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopLossPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopLoss", sub_product_id: id
      }

      const pendingOrderStopProfit = {
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopProfitPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopProfit", sub_product_id: id
      }

      pendingOrder.push(pendingOrderStopLoss);
      pendingOrder.push(pendingOrderStopProfit);
    } else if (stopProfitPrice || stopLossPrice) {
      let executionPrice = stopProfitPrice ? stopProfitPrice : stopLossPrice;
      let type = stopProfitPrice ? "StopProfit" : "StopLoss";
      pendingOrder = [{
        order_referance_id: docId, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: executionPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType ? OrderType : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type, sub_product_id: id
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
        last_price: elem?.last_price, createdBy: elem?.createdBy, type: elem?.type, sub_product_id: id, order_id, _id: elem?._id
      })
    }

    dataObj[`${instrumentToken}`] = dataArr;

    if (isRedisConnected && (!await client.exists('stoploss-stopprofit') || !JSON.parse(await client.get('stoploss-stopprofit')) )) {
      const neworder = await PendingOrder.find({status: "Pending"});
      const transformedObject = {};


      neworder.forEach(item => {
        let flag = true;
        for(let elem of order){
          if (elem._id.toString() === item._id.toString()){
            flag = false;
          }
        }

        const { instrumentToken, ...rest } = item;
        
        if (!transformedObject[instrumentToken]) {
          transformedObject[instrumentToken] = [];
        }
        rest._doc.order_id = order_id;

        if(flag){
          transformedObject[instrumentToken].push(rest._doc);
        }
      });

      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(transformedObject));
    }
    
    if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
      data = await client.get('stoploss-stopprofit');
      data = JSON.parse(data);
      if (data && data[`${instrumentToken}`]) {
        data[`${instrumentToken}`] = data[`${instrumentToken}`].concat(dataArr);
      } else {
        data[`${instrumentToken}`] = dataArr;
      }
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(data));
    } else {
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(dataObj));
    }

    return pendingOrderRedis;

  } catch(err){
    console.log(err);
  }

}