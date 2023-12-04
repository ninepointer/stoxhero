const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../marketData/sigleLivePrice');
const {client, getValue} = require('../marketData/redisClient');
const singleXTSLivePrice = require("../services/xts/xtsHelper/singleXTSLivePrice");
const {xtsAccountType, zerodhaAccountType} = require("../constant");
const Setting = require("../models/settings/setting");
const {dailyContestTrade} = require("./saveDataInDB/dailycontest")
const {virtualTrade} = require("./saveDataInDB/paperTrade")
const {tenxTrade} = require("./saveDataInDB/tenx")
const {internTrade} = require("./saveDataInDB/internship")
const {infinityTrade} = require("./saveDataInDB/infinity")
const {marginxTrade} = require("./saveDataInDB/marginx")
const {battleTrade} = require("./saveDataInDB/battle");
const UserDetail = require("../models/User/userDetailSchema")
const {ObjectId} = require("mongodb")
const DailyContest = require("../models/DailyContest/dailyContest")
const MarginX = require("../models/marginX/marginX");
const TenxSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");

exports.mockTrade = async (req, res) => {
    const setting = await Setting.find().select('toggle');
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


    let {exchange, symbol, buyOrSell, Quantity, Product, order_type,
        validity, variety, instrumentToken, tenxTraderPath, internPath, battle,
        realBuyOrSell, realQuantity, isAlgoTrader, paperTrade, dailyContest, marginx, deviceDetails } = req.body 

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety){
        return res.status(422).json({error : "Something went wrong"})
    }

    req.body.order_id = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

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
    } else{
        brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: accountType});
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

    if(buyOrSell === "SELL"){
        req.body.Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        req.body.realQuantity = "-"+realQuantity;
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

        newTimeStamp = liveData?.timestamp;
        originalLastPriceUser = liveData?.last_price ;
        originalLastPriceCompany = liveData?.last_price ;

        if(!liveData?.last_price){
            return res.status(400).json({status: "error", message: "Market orders are blocked for in the money options due to illiquidity. Try again later."})
        }

        trade_time = new Date(newTimeStamp);
        if(trade_time < new Date()){
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
        brokerageCompany: brokerageCompany,
        isRedisConnected: isRedisConnected,
        secondsRemaining: secondsRemaining
    }


    if(dailyContest){
        await dailyContestTrade(req, res, otherData);
        if (!req?.user?.activationDetails?.activationDate) {
            const contest = await DailyContest.findOne({_id: new ObjectId(req.body.contestId)})
            const userActivationDateUpdate = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req?.user?._id) }, {
                $set: {
                    activationDetails: {
                        activationDate: new Date(),
                        activationProduct: "6517d48d3aeb2bb27d650de5",
                        activationType: contest?.entryFee > 0 ? "Paid" : "Free",
                        activationStatus: "Active",
                        activationProductPrice: contest?.entryFee
                    }
                }
            })
            await client.del(`${req?.user?._id.toString()}authenticatedUser`);
        }
    }
    
    if(paperTrade){
        await virtualTrade(req, res, otherData);
        if (!req?.user?.activationDetails?.activationDate) {
            const userActivationDateUpdate = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req?.user?._id) }, {
                $set: {
                    activationDetails: {
                        activationDate: new Date(),
                        activationProduct: "65449ee06932ba3a403a681a",
                        activationType: "Free",
                        activationStatus: "Active",
                        activationProductPrice: 0
                    }
                }
            })
            await client.del(`${req?.user?._id.toString()}authenticatedUser`);
        }
    }
    
    if(tenxTraderPath){
        await tenxTrade(req, res, otherData);
        if (!req?.user?.activationDetails?.activationDate) {
            let tenx = [];
            const user = await UserDetail.findOne({ _id: new ObjectId(req?.user?._id) }).select('subscription');
            let data;
            for(let elem of user.subscription){
                if(elem.status === "Live"){
                    data = JSON.parse(JSON.stringify(elem));
                }
            }

            if(!data?.fee){
                tenx = await TenxSubscription.findOne({_id: new ObjectId(req?.body?.subscriptionId)}).select('discounted_price');
            }

            const userActivationDateUpdate = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req?.user?._id) }, {
                $set: {
                    activationDetails: {
                        activationDate: new Date(),
                        activationProduct: "6517d3803aeb2bb27d650de0",
                        activationType: "Paid",
                        activationStatus: "Active",
                        activationProductPrice: data?.fee || tenx?.discounted_price
                    }
                }
            })

            await client.del(`${req?.user?._id.toString()}authenticatedUser`);
        }
    }

    if(internPath){
        await internTrade(req, res, otherData);
        if (!req?.user?.activationDetails?.activationDate) {
            const userActivationDateUpdate = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req?.user?._id) }, {
                $set: {
                    activationDetails: {
                        activationDate: new Date(),
                        activationProduct: "6517d46e3aeb2bb27d650de3",
                        activationType: "Free",
                        activationStatus: "Active",
                        activationProductPrice: 0
                    }
                }
            })
            await client.del(`${req?.user?._id.toString()}authenticatedUser`);
        }
    }

    if(marginx){
        await marginxTrade(req, res, otherData);
        if (!req?.user?.activationDetails?.activationDate) {
            const marginx = await MarginX.findOne({_id: new ObjectId(req?.body?.marginxId)})
            .populate('marginXTemplate', 'entryFee')
            const userActivationDateUpdate = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req?.user?._id) }, {
                $set: {
                    activationDetails: {
                        activationDate: new Date(),
                        activationProduct: "6517d40e3aeb2bb27d650de1",
                        activationType: "Paid",
                        activationStatus: "Active",
                        activationProductPrice: marginx?.marginXTemplate?.entryFee
                    }
                }
            })

            await client.del(`${req?.user?._id.toString()}authenticatedUser`);
        }
    }

    if(battle){
        await battleTrade(req, res, otherData)
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