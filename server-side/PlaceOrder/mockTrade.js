const axios = require("axios")
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const singleLivePrice = require('../marketData/sigleLivePrice');
const TenxTrader = require("../models/mock-trade/tenXTraderSchema");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");
const io = require('../marketData/socketio');
const client = require('../marketData/redisClient');
const mongoose = require('mongoose')


exports.mockTrade = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    // console.log(`There are ${secondsRemaining} seconds remaining until the end of the day.`);

    console.log("caseStudy 8: mocktrade")
    let stoxheroTrader ;
    const AlgoTrader = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTrader : InfinityTrader;
    const MockTradeDetails = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTradeCompany : InfinityTradeCompany;

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
        validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade } = req.body 


      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


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
        let liveData = await singleLivePrice(exchange, symbol)
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
        let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge;
    }

    function sellBrokerage(totalAmount){
        let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
        let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
    
    console.log(paperTrade, isAlgoTrader);
    if(!paperTrade && isAlgoTrader){

        const session = await mongoose.startSession();
        try{

            const mockCompany = await MockTradeDetails.findOne({order_id : order_id});
            const mockInfintyTrader = await AlgoTrader.findOne({order_id : order_id});
            if((mockCompany || mockInfintyTrader) && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
                return res.status(422).json({message : "data already exist", error: "Fail to trade"})
            }
    
            
            session.startTransaction();
    
            const companyDoc = {
                status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
                Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: OrderType, 
                symbol: realSymbol, placed_by: "ninepointer", algoBox:algoBoxId, order_id, 
                instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
                trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
                trade_time:trade_time,
            }
    
            const traderDoc = {
                status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            }
    
            const mockTradeDetails = await MockTradeDetails.create([companyDoc], { session });
            const algoTrader = await AlgoTrader.create([traderDoc], { session });
            console.log(algoTrader, mockTradeDetails)
            if(await client.exists(`${req.user._id.toString()} overallpnl`)){
                let pnl = await client.get(`${req.user._id.toString()} overallpnl`)
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
                      exchange: algoTrader[0].exchange,
                    },
                    amount: (algoTrader[0].amount * -1),
                    brokerage: Number(algoTrader[0].brokerage),
                    lots: Number(algoTrader[0].Quantity),
                    lastaverageprice: algoTrader[0].average_price,
                  });
                }
                await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnl))          
            }

            await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);
            // Commit the transaction
            await session.commitTransaction();
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});

        } catch(err){
            await client.del(`${req.user._id.toString()} overallpnl`)
            await session.abortTransaction();
            console.error('Transaction failed, documents not saved:', err);
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
                order_id, instrumentToken, brokerage: brokerageUser, portfolioId,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });
    
            //console.log("mockTradeDetails", paperTrade);
            paperTrade.save().then(async ()=>{
                console.log("sending response");
                if(await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)){
                    //console.log("in the if condition")
                    let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
                    pnl = JSON.parse(pnl);
                    //console.log("before pnl", pnl)
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
                      // Create a new element if instrument is not matching
                      pnl.push({
                        _id: {
                          symbol: paperTrade.symbol,
                          product: paperTrade.Product,
                          instrumentToken: paperTrade.instrumentToken,
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

                await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
        }).catch(err => {console.log(err, "fail")});  
    }

    if(tenxTraderPath){
        
        PaperTrade.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                return res.status(422).json({error : "date already exist..."})
            }
    
            const paperTrade = new PaperTrade({
                status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, portfolioId,
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });
    
            //console.log("mockTradeDetails", paperTrade);
            paperTrade.save().then(async ()=>{
                console.log("sending response");
                if(await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)){
                    //console.log("in the if condition")
                    let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
                    pnl = JSON.parse(pnl);
                    //console.log("before pnl", pnl)
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
                      // Create a new element if instrument is not matching
                      pnl.push({
                        _id: {
                          symbol: paperTrade.symbol,
                          product: paperTrade.Product,
                          instrumentToken: paperTrade.instrumentToken,
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

                await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
        }).catch(err => {console.log(err, "fail")});  
    }

}