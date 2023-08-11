// const axios = require("axios")
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../marketData/sigleLivePrice');
const {client, getValue} = require('../marketData/redisClient');
const singleXTSLivePrice = require("../services/xts/xtsHelper/singleXTSLivePrice");
const {xtsAccountType, zerodhaAccountType} = require("../constant");
const Setting = require("../models/settings/setting");
const {dailyContestTrade} = require("./saveDataInDB/dailycontest")
// const {PaperTrade} = require("./saveDataInDB/paperTrade")
// const {tenxTrade} = require("./saveDataInDB/tenx")
// const {internTrade} = require("./saveDataInDB/internship")
const infinityTrade = require("./saveDataInDB/infinity")

exports.mockTrade = async (req, res) => {
    const setting = await Setting.find().select('toggle');
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, exchangeInstrumentToken, fromAdmin,
        validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath, internPath, contestId,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, dailyContest } = req.body 

        if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
            return res.status(422).json({error : "Something went wrong"})
        }

        order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        console.log("caseStudy 8: mocktrade", )

        if(exchange === "NFO"){
            exchangeSegment = 2;
        }

        let accountType;
        if(setting.ltp == xtsAccountType || setting.complete == xtsAccountType){
            accountType = xtsAccountType;
        } else{
            accountType = zerodhaAccountType;
        }


        let brokerageDetailBuy;
        let brokerageDetailSell;
        let brokerageDetailBuyUser;
        let brokerageDetailSellUser;

        if(isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)){
            brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
            brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
        } else{
            brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: accountType});
            await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
        }

        if(isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)){
            
            brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
            brokerageDetailSell = JSON.parse(brokerageDetailSell);
            console.log("in if 2nd if", brokerageDetailSell)
        } else{
            console.log("in if 2nd else")
            brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: accountType});
            await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
        }

        if(isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)){
            console.log("in if 3rd if")
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

        // console.log(brokerageDetailBuy,
        //     brokerageDetailSell,
        //     brokerageDetailBuyUser,
        //     brokerageDetailSellUser)

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try {
        let liveData;
        if (setting.ltp == xtsAccountType || setting.complete == xtsAccountType) {
            liveData = await singleXTSLivePrice(exchangeSegment, instrumentToken);
        } else {
            liveData = await singleLivePrice(exchange, symbol)
        }
        newTimeStamp = liveData[0]?.timestamp;
        originalLastPriceUser = liveData[0]?.last_price;
        originalLastPriceCompany = liveData[0]?.last_price;

        trade_time = new Date(newTimeStamp);
        if(trade_time < new Date()){
            console.log("in if")
            const subtractedTime = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
            trade_time = trade_time.getTime() + subtractedTime;
        }
    } catch (err) {
        console.log(err)
        return new Error(err);
    }

    let brokerageUser;
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany, brokerageDetailBuy[0]);
    } else if(realBuyOrSell === "SELL"){
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany, brokerageDetailSell[0]);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else if(buyOrSell === "SELL"){
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    let otherData={
        originalLastPriceUser: originalLastPriceUser,
        originalLastPriceCompany: originalLastPriceCompany,
        trade_time: trade_time,
        brokerageUser: brokerageUser,
        brokerageCompany: brokerageCompany
    }

    if(!paperTrade && isAlgoTrader && !dailyContest){

        await infinityTrade(req, res, otherData)

    }

    if(dailyContest){

        await dailyContestTrade(req, res, otherData)
    }
    
    if(paperTrade){
        
    }
    
    if(tenxTraderPath){
        
    }

    if(internPath){
        
    }


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