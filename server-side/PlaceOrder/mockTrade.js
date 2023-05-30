// const axios = require("axios")
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const singleLivePrice = require('../marketData/sigleLivePrice');
const TenxTrader = require("../models/mock-trade/tenXTraderSchema");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
// const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");
const io = require('../marketData/socketio');
const {client, getValue} = require('../marketData/redisClient');
const mongoose = require('mongoose')
const singleXTSLivePrice = require("../services/xts/xtsHelper/singleXTSLivePrice");
const {xtsAccountType, zerodhaAccountType} = require("../constant");
const Setting = require("../models/settings/setting");
const InternshipTrade = require("../models/mock-trade/internshipTrade");


exports.mockTrade = async (req, res) => {
    const setting = await Setting.find().select('toggle');
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    // console.log(`There are ${secondsRemaining} seconds remaining until the end of the day.`);

    console.log("caseStudy 8: mocktrade", isRedisConnected)
    // let stoxheroTrader ;
    // const InfinityTrader = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTrader : InfinityTrader;
    // const InfinityTradeCompany = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTradeCompany : InfinityTradeCompany;

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, exchangeInstrumentToken, fromAdmin,
        validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath, internPath,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade } = req.body 

        if(exchange === "NFO"){
            exchangeSegment = 2;
        }

        let accountType;
        if(setting.ltp == xtsAccountType || setting.complete == xtsAccountType){
            accountType = xtsAccountType;
        } else{
            accountType = zerodhaAccountType;
        }

      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: accountType});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: accountType});
      const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
      const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
    
    //   console.log("req body", req.body)

    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
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
        // let liveData = await singleLivePrice(exchange, symbol) TODO toggle
        // let liveData = await singleXTSLivePrice(exchangeSegment, instrumentToken);
        let liveData;
        if(setting.ltp == xtsAccountType || setting.complete == xtsAccountType){
            liveData = await singleXTSLivePrice(exchangeSegment, instrumentToken);
        } else{
            liveData = await singleLivePrice(exchange, symbol)
        }
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



    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
        let brokerage = Number(buyBrokerData.brokerageCharge);
        let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(buyBrokerData.gst) / 100);
        let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
        let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
        let brokerage = Number(sellBrokerData.brokerageCharge);
        let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(sellBrokerData.gst) / 100);
        let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
        let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

        return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    console.log(Number(realQuantity), originalLastPriceCompany)
    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany, brokerageDetailBuy[0]); // TODO 
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany, brokerageDetailSell[0]);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }
    
    console.log(paperTrade, isAlgoTrader);
    if(!paperTrade && isAlgoTrader){

        let settingRedis ;
        const session = await mongoose.startSession();
        try{

            const mockCompany = await InfinityTradeCompany.findOne({order_id : order_id});
            const mockInfintyTrader = await InfinityTrader.findOne({order_id : order_id});
            if((mockCompany || mockInfintyTrader) && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
                return res.status(422).json({message : "data already exist", error: "Fail to trade"})
            }
    
            
            session.startTransaction();
    
            const companyDoc = {
                status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
                Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: OrderType, 
                symbol: realSymbol, placed_by: "stoxhero", algoBox:algoBoxId, order_id, 
                instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
                trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
                trade_time:trade_time, exchangeInstrumentToken
            }
    
            const traderDoc = {
                status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            }
    
            const mockTradeDetails = await InfinityTradeCompany.create([companyDoc], { session });
            const algoTrader = await InfinityTrader.create([traderDoc], { session });
            console.log(algoTrader[0].order_id, mockTradeDetails[0].order_id)
            if(isRedisConnected && await client.exists(`${trader.toString()} overallpnl`)){
                let pnl = await client.get(`${trader.toString()} overallpnl`)
                pnl = JSON.parse(pnl);
                console.log("redis pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === algoTrader[0].instrumentToken && element._id.product === algoTrader[0].Product ));
                // if instrument is same then just updating value
                if (matchingElement) {
                  // Update the values of the matching element with the values of the first document
                  matchingElement.amount += (algoTrader[0].amount * -1);
                  matchingElement.brokerage += Number(algoTrader[0].brokerage);
                  matchingElement.lastaverageprice = algoTrader[0].average_price;
                  matchingElement.lots += Number(algoTrader[0].Quantity);
      
                } else {
                  // Create a new element if instrument is not matching
                  pnl.push({
                    _id: {
                      symbol: algoTrader[0].symbol,
                      product: algoTrader[0].Product,
                      instrumentToken: algoTrader[0].instrumentToken,
                      exchangeInstrumentToken: algoTrader[0].exchangeInstrumentToken,
                      exchange: algoTrader[0].exchange,
                    },
                    amount: (algoTrader[0].amount * -1),
                    brokerage: Number(algoTrader[0].brokerage),
                    lots: Number(algoTrader[0].Quantity),
                    lastaverageprice: algoTrader[0].average_price,
                  });
                }
                settingRedis = await client.set(`${trader.toString()} overallpnl`, JSON.stringify(pnl))
                console.log("settingRedis", settingRedis)
            }

            if(isRedisConnected){
                await client.expire(`${trader.toString()} overallpnl`, secondsRemaining);
            }
            // Commit the transaction
            
            io.emit("updatePnl", mockTradeDetails)
            if(fromAdmin){
                console.log("in admin side")
                io.emit(`${trader.toString()}autoCut`, algoTrader)
            }

            if(settingRedis === "OK"){
                await session.commitTransaction();
            } else{
                // await session.commitTransaction();
                throw new Error();
            }
            
             
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});

        } catch(err){
            if(isRedisConnected){
                const del = await client.del(`${trader.toString()} overallpnl`)
            }
            await session.abortTransaction();
            console.error('Transaction failed, documents not saved:', err);
            res.status(201).json({status: 'error', message: 'Your trade was not completed. Please attempt the trade once more'});
        } finally {
        // End the session
            session.endSession();
        }
    }
    
    if(paperTrade){
        
        PaperTrade.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                return res.status(422).json({error : "date already exist..."})
            }
    
            const paperTrade = new PaperTrade({
                status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });
    
            console.log("mockTradeDetails", paperTrade);
            paperTrade.save().then(async ()=>{
                console.log("sending response", isRedisConnected);
                if(isRedisConnected && await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)){
                    console.log("in the if condition")
                    let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
                    pnl = JSON.parse(pnl);
                    console.log("before pnl", pnl)
                    const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperTrade.instrumentToken && element._id.product === paperTrade.Product ));
          
                    // if instrument is same then just updating value
                    if (matchingElement) {
                      // Update the values of the matching element with the values of the first document
                      matchingElement.amount += (paperTrade.amount * -1);
                      matchingElement.brokerage += Number(paperTrade.brokerage);
                      matchingElement.lastaverageprice = paperTrade.average_price;
                      matchingElement.lots += Number(paperTrade.Quantity);
                      //console.log("matchingElement", matchingElement)
          
                    } else {
                    //   Create a new element if instrument is not matching
                      pnl.push({
                        _id: {
                          symbol: paperTrade.symbol,
                          product: paperTrade.Product,
                          instrumentToken: paperTrade.instrumentToken,
                          exchangeInstrumentToken: paperTrade.exchangeInstrumentToken,
                          exchange: paperTrade.exchange,
                        },
                        amount: (paperTrade.amount * -1),
                        brokerage: Number(paperTrade.brokerage),
                        lots: Number(paperTrade.Quantity),
                        lastaverageprice: paperTrade.average_price,
                      });
                    }
                    
                    await client.set(`${req.user._id.toString()}: overallpnlPaperTrade`, JSON.stringify(pnl))
                    
                }

                if(isRedisConnected){
                    await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
                }
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
        }).catch(err => {console.log(err, "fail")});  
    }
    
    if(tenxTraderPath){
        
        TenxTrader.findOne({order_id : order_id})
        .then((dataExist)=>{
            if(dataExist){
                return res.status(422).json({error : "date already exist..."})
            }
    
            const tenx = new TenxTrader({
                status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });

            console.log("tenx tenx", tenx)

    
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
                          exchangeInstrumentToken: tenx.exchangeInstrumentToken,
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
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
        }).catch(err => {console.log(err, "fail")});  
    }

    if(internPath){
        
        InternshipTrade.findOne({order_id : order_id})
        .then((dataExist)=>{
            if(dataExist){
                return res.status(422).json({error : "date already exist..."})
            }
    
            const internship = new InternshipTrade({
                status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: subscriptionId, exchangeInstrumentToken,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });

            console.log("internship", internship, req.body)

    
            //console.log("mockTradeDetails", paperTrade);
            internship.save().then(async ()=>{
                console.log("sending response");
                if(isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)){
                    //console.log("in the if condition")
                    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
                    pnl = JSON.parse(pnl);
                    //console.log("before pnl", pnl)
                    const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product ));
          
                    // if instrument is same then just updating value
                    if (matchingElement) {
                      // Update the values of the matching element with the values of the first document
                      matchingElement.amount += (internship.amount * -1);
                      matchingElement.brokerage += Number(internship.brokerage);
                      matchingElement.lastaverageprice = internship.average_price;
                      matchingElement.lots += Number(internship.Quantity);
                      //console.log("matchingElement", matchingElement)

                    } else {
                      // Create a new element if instrument is not matching
                      pnl.push({
                        _id: {
                          symbol: internship.symbol,
                          product: internship.Product,
                          instrumentToken: internship.instrumentToken,
                          exchangeInstrumentToken: internship.exchangeInstrumentToken,
                          exchange: internship.exchange,
                        },
                        amount: (internship.amount * -1),
                        brokerage: Number(internship.brokerage),
                        lots: Number(internship.Quantity),
                        lastaverageprice: internship.average_price,
                      });
                    }
                    
                    await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, JSON.stringify(pnl))
                    
                }

                if(isRedisConnected){
                    await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, secondsRemaining);
                }
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
        }).catch(err => {console.log(err, "fail")});  
    }


}