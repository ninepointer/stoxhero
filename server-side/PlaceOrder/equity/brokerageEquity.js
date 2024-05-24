const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const { client, getValue } = require('../../marketData/redisClient');
const {zerodhaAccountType} = require("../../constant");


exports.equityBrokerage = async(amount, product, buyOrSell)=>{
    const isRedisConnected = getValue();
    let brokerageIntradayBuy;
    let brokerageIntradaySell;
    let brokerageDeliveryBuy;
    let brokerageDeliverySell;

    if(isRedisConnected && await client.HEXISTS('brokerage-equity', `buy-intraday`)){
        brokerageIntradayBuy = await client.HGET('brokerage-equity', `buy-intraday`);
        brokerageIntradayBuy = JSON.parse(brokerageIntradayBuy);
    } else{
        brokerageIntradayBuy = await BrokerageDetail.find({transaction:"BUY", accountType: zerodhaAccountType, type: "Equity", product: "Intraday"});
        await client.HSET('brokerage-equity', `buy-intraday`, JSON.stringify(brokerageIntradayBuy));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage-equity', `sell-intraday`)){
        brokerageIntradaySell = await client.HGET('brokerage-equity', `sell-intraday`);
        brokerageIntradaySell = JSON.parse(brokerageIntradaySell);
    } else{
        brokerageIntradaySell = await BrokerageDetail.find({transaction:"SELL", accountType: zerodhaAccountType, type: "Equity", product: "Intraday"});
        await client.HSET('brokerage-equity', `sell-intraday`, JSON.stringify(brokerageIntradaySell));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage-equity', `buy-delivery`)){
        brokerageDeliveryBuy = await client.HGET('brokerage-equity', `buy-delivery`);
        brokerageDeliveryBuy = JSON.parse(brokerageDeliveryBuy);
    } else{
        brokerageDeliveryBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType, type: "Equity", product: "Delivery" });
        await client.HSET('brokerage-equity', `buy-delivery`, JSON.stringify(brokerageDeliveryBuy));
    }

    if(isRedisConnected && await client.HEXISTS('brokerage-equity', `sell-delivery`)){
        brokerageDeliverySell = await client.HGET('brokerage-equity', `sell-delivery`);
        brokerageDeliverySell = JSON.parse(brokerageDeliverySell);
    } else{
        brokerageDeliverySell = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType, type: "Equity", product: "Delivery" });
        await client.HSET('brokerage-equity', `sell-delivery`, JSON.stringify(brokerageDeliverySell));
    }

    if(product==="MIS" && buyOrSell==="BUY"){
        return buyBrokerage(amount, brokerageIntradayBuy[0], true)
    } else if(product==="MIS" && buyOrSell==="SELL"){
        return sellBrokerage(amount, brokerageIntradaySell[0], true)
    } else if(product==="CNC" && buyOrSell==="BUY"){
        return buyBrokerage(amount, brokerageDeliveryBuy[0])
    } else if(product==="CNC" && buyOrSell==="SELL"){
        return sellBrokerage(amount, brokerageDeliverySell[0])
    }

}

function buyBrokerage(totalAmount, buyBrokerData, checkMax) {
    let brokerage = totalAmount * Number(buyBrokerData.brokerageCharge)/100;
    if(checkMax) brokerage = Math.min(brokerage, buyBrokerData?.maxBrokerage);
    let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
}

function sellBrokerage(totalAmount, sellBrokerData, checkMax) {
    let brokerage = totalAmount * Number(sellBrokerData.brokerageCharge)/100;
    if(checkMax) brokerage = Math.min(brokerage, sellBrokerData?.maxBrokerage);
    let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

    return finalCharge
}