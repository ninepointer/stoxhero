const PendingOrder = require("../../../models/PendingOrder/pendingOrderSchema")
const { client, getValue } = require('../../../marketData/redisClient');
const getKiteCred = require('../../../marketData/getKiteCred'); 
const {internTrader, tenxTrader, marginx, dailyContest, virtualTrader} = require("../../../constant")


exports.applyingSLSP = async (req, otherData, session, docId, from) => {

  let product_type;
  if(from === tenxTrader){
    product_type = "6517d3803aeb2bb27d650de0"
  } else if(from === marginx){
    product_type = "6517d40e3aeb2bb27d650de1"
  } else if(from === dailyContest){
    product_type = "6517d48d3aeb2bb27d650de5"
  } else if(from === internTrader){
    product_type = "6517d46e3aeb2bb27d650de3"
  } else if(from === virtualTrader){
    product_type = "65449ee06932ba3a403a681a"
  }

  console.log("product_type", product_type, from)

  try{
    let isRedisConnected = await getValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId, 
        exchangeInstrumentToken, validity, variety, order_id, instrumentToken, last_price,
        stopProfitPrice, stopLossPrice, createdBy, deviceDetails, id, margin, price,
        marginxId, contestId, portfolioId } = req.body ? req.body : req ;

        console.log("portfolioId", portfolioId)

    last_price = last_price && String(last_price)?.includes("₹") && last_price?.slice(1);
    id = id ? id : from === tenxTrader ? subscriptionId : from === marginx ? marginxId : from === dailyContest ? contestId : from === internTrader ? subscriptionId : from === virtualTrader && portfolioId;
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
        order_referance_id: docId, status: "Pending", product_type: product_type, execution_price: stopLossPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: order_type ? order_type : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price, price: stopLossPrice,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopLoss", sub_product_id: id, margin, deviceDetails
      }

      const pendingOrderStopProfit = {
        order_referance_id: docId, status: "Pending", product_type: product_type, execution_price: stopProfitPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: order_type ? order_type : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price, price: stopProfitPrice,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type: "StopProfit", sub_product_id: id, margin, deviceDetails
      }

      pendingOrder.push(pendingOrderStopLoss);
      pendingOrder.push(pendingOrderStopProfit);
    } else if (stopProfitPrice || stopLossPrice) {
      let executionPrice = stopProfitPrice ? stopProfitPrice : stopLossPrice;
      let type = stopProfitPrice ? "StopProfit" : "StopLoss";
      pendingOrder = [{
        order_referance_id: docId, status: "Pending", product_type: product_type,  price: executionPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: order_type ? order_type : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price, margin,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type, sub_product_id: id, deviceDetails
      }]
    } else if(price){
      let executionPrice = price;
      let type = "Limit";
      // const data = await getKiteCred.getAccess(); 
      // const margin = await limitOrderMargin(req, data);
      pendingOrder = [{
        order_referance_id: docId, status: "Pending", product_type: product_type,  price: executionPrice,
        Quantity: Math.abs(Quantity), Product, buyOrSell: buyOrSell, variety, validity, exchange, order_type: order_type ? order_type : order_type, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: last_price, margin,
        createdBy: req?.user?._id ? req?.user?._id : createdBy, type, sub_product_id: id, deviceDetails
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
        product_type: elem?.product_type, price: elem?.price, Quantity: elem?.Quantity,
        Product: elem?.Product, buyOrSell: elem?.buyOrSell, variety: elem?.variety, validity: elem?.validity,
        exchange: elem?.exchange, order_type: elem?.order_type, symbol: elem?.symbol, execution_time: elem?.execution_time,
        instrumentToken: elem?.instrumentToken, exchangeInstrumentToken: elem?.exchangeInstrumentToken,
        last_price: elem?.last_price, createdBy: elem?.createdBy, type: elem?.type, sub_product_id: id, order_id, _id: elem?._id,
        margin: elem?.margin, deviceDetails
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

      console.log(transformedObject)
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