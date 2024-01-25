// const axios = require("axios")
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
// const PaperTrade = require("../models/mock-trade/paperTrade");
const singleLivePrice = require('../marketData/sigleLivePrice');
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
// const InfinityTrader = require("../models/mock-trade/infinityTrader");
// const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
// // const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");
// const io = require('../marketData/socketio');
const {client, isRedisConnected} = require('../../marketData/redisClient');
// const mongoose = require('mongoose')
const singleXTSLivePrice = require("../../services/xts/xtsHelper/singleXTSLivePrice");
const {xtsAccountType} = require("../../constant");
const Setting = require("../../models/settings/setting");

exports.takeAutoTrade = async (tradeDetails) => {

    const setting = await Setting.find().select('toggle');
    let {exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId, exchangeSegment,
        validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, dontSendResp } = tradeDetails

        if(exchange === "NFO"){
            exchangeSegment = 2;
        }

      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: xtsAccountType, type: "Option"});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: xtsAccountType, type: "Option"});

    //   console.log("req body", req.body)

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(order_type)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        return res.status(422).json({error : "please fill all the feilds..."})
    }

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
    try{
        // console.log("above data")
        let liveData;
        if(setting.ltp == xtsAccountType || setting.complete == xtsAccountType){
            liveData = await singleXTSLivePrice(exchangeSegment, instrumentToken);
        } else{
            liveData = await singleLivePrice(exchange, symbol)
        }
        // let  TODO toggle
        console.log("live data", liveData)
        for(let elem of liveData){
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                console.log("zerodha date", elem.timestamp)
                originalLastPriceUser = elem.last_price;
                originalLastPriceCompany = elem.last_price;
            }
        }

        trade_time = new Date(newTimeStamp);

    } catch(err){
        console.log(err)
        return new Error(err);
    }



    function buyBrokerage(totalAmount){
        let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
        let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
        let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailBuy[0].gst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge;
    }

    function sellBrokerage(totalAmount){

        let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
        let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
        let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailSell[0].gst) / 100);

        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    console.log(Number(realQuantity), originalLastPriceCompany)
    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany); // TODO 
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }

    TenxTrader.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const tenx = new TenxTrader({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        });

        // console.log("tenx tenx", tenx)


        //console.log("mockTradeDetails", paperTrade);
        tenx.save().then(async ()=>{
            console.log("sending response");
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)){
                //console.log("in the if condition")
                let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
                pnl = JSON.parse(pnl);
                //console.log("before pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenx.instrumentToken && element._id.product === tenx.Product ));
      
                // if instrument is same then just updating value
                if (matchingElement) {
                  // Update the values of the matching element with the values of the first document
                  matchingElement.amount += (tenx.amount * -1);
                  matchingElement.brokerage += Number(tenx.brokerage);
                  matchingElement.lastaverageprice = tenx.average_price;
                  matchingElement.lots += Number(tenx.Quantity);
                  //console.log("matchingElement", matchingElement)

                } else {
                  // Create a new element if instrument is not matching
                  pnl.push({
                    _id: {
                      symbol: tenx.symbol,
                      product: tenx.Product,
                      instrumentToken: tenx.instrumentToken,
                      exchange: tenx.exchange,
                    },
                    amount: (tenx.amount * -1),
                    brokerage: Number(tenx.brokerage),
                    lots: Number(tenx.Quantity),
                    lastaverageprice: tenx.average_price,
                  });
                }
                
                await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))
                
            }

            if(isRedisConnected){
                await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
            }
            // res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
    }).catch(err => {console.log(err, "fail")});  

  
}