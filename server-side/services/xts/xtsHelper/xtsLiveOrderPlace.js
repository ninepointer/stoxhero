

// const axios = require("axios")
const BrokerageDetail = require("../../../models/Trading Account/brokerageSchema");
// const PaperTrade = require("../../../models/mock-trade/paperTrade");
// const singleLivePrice = require('../../../marketData/sigleLivePrice');
// const StoxheroTrader = require("../../../models/mock-trade/stoxheroTrader");
const InfinityLiveTrader = require("../../../models/TradeDetails/infinityLiveUser");
const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema");
const InfinityMockTrader = require("../../../models/mock-trade/infinityTrader");
const InfinityMockCompany = require("../../../models/mock-trade/infinityTradeCompany");
// const StoxheroTradeCompany = require("../../../models/mock-trade/stoxheroTradeCompany");
const io = require('../../../marketData/socketio');
const {client} = require('../../../marketData/redisClient');
const mongoose = require('mongoose');
// const singleXTSLivePrice = require("./singleXTSLivePrice");
const {placeOrder} = require("../xtsInteractive")
const RetreiveOrder = require("../../../models/TradeDetails/retreiveOrder");
const {xtsAccountType} = require("../../../constant");

exports.liveTrade = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


    let {algoBoxId, exchange, symbol, buyOrSell, Quantity, 
        Product, OrderType, validity, variety,trader,
        uId, instrumentToken, realBuyOrSell, realQuantity, 
        dontSendResp} = req.body

    // if(exchange === "NFO"){
    //     exchangeSegment = 2;
    // }

    // const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: xtsAccountType});
    // const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: xtsAccountType});


    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    let obj = {
        exchange: exchange,
        instrumentToken: instrumentToken,
        Product: Product,
        OrderType: OrderType,
        buyOrSell: realBuyOrSell,
        validity: validity,
        disclosedQuantity: 0,
        Quantity: realQuantity,
    }
    const placeorder = await placeOrder(obj, req, res);

    // if(buyOrSell === "SELL"){
    //     Quantity = "-"+Quantity;
    // }
    // if(realBuyOrSell === "SELL"){
    //     realQuantity = "-"+realQuantity;
    // }


    // const AppOrderID = placeorder?.result?.AppOrderID;
    // console.log(placeorder?.result, placeorder?.result?.AppOrderID)
    // await saveData();
    function saveData(){
        setTimeout(async ()=>{
            const gettingOrder = await RetreiveOrder.findOne({order_id: AppOrderID});
            if(!gettingOrder){
                console.log("retreiveOrderAndSaveXTS function calling again")
                await saveData();
                return;
            }
            let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
                order_timestamp, validity, exchange_timestamp, order_type, price, filled_quantity, 
                pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, placed_by,     
                status_message, status_message_raw} = gettingOrder
      
            if(!status_message){
                status_message = "null"
            }
            if(!status_message_raw){
                status_message_raw = "null"
            }
            if(!exchange_timestamp){
                exchange_timestamp = "null"
            }
            if(!exchange_order_id){
                exchange_order_id = "null"
            }
            if(!average_price){
                average_price = 0;
            }
    
            let responseMsg = status;
            let responseErr = status_message;

            console.log("transaction_type", transaction_type)
            if(transaction_type == "SELL"){
                console.log("in if", quantity);
                quantity = 0-quantity;
                console.log("after if", quantity);
            }
            if(buyOrSell == "SELL"){
                console.log("in if", Quantity);
                Quantity = 0-Quantity;
                console.log("after if", Quantity);
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
        
            let brokerageCompany;
            let brokerageUser;
        
            if(transaction_type === "BUY"){
                brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * average_price);
            } else{
                brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * average_price);
            }

            if(buyOrSell === "BUY"){
                brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * average_price);
            } else{
                brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * average_price);
            }

            let settingRedis ;
            const session = await mongoose.startSession();
            try{
        
                const liveCompany = await InfinityLiveCompany.findOne({order_id : order_id});
                const mockInfintyTrader = await InfinityLiveTrader.findOne({order_id : order_id});
                if((liveCompany || mockInfintyTrader) && checkingMultipleAlgoFlag === 1){
                    return res.status(422).json({message : "data already exist", error: "Fail to trade"})
                }
        
                
                session.startTransaction();
                
                console.log(quantity, Quantity)
                const companyDoc = {
                    disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                    status, uId, createdBy: req.user._id, average_price, Quantity: quantity, 
                    Product:product, buyOrSell:transaction_type, 
                    variety, validity, exchange, order_type: order_type, symbol, placed_by: placed_by,
                    algoBox: algoBoxId, order_id, instrumentToken, brokerage: brokerageCompany,
                    trader: trader, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:order_timestamp,
                    exchange_order_id, exchange_timestamp, isMissed: false
                }
        
                const traderDoc = {
                    disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                    status, uId, createdBy: req.user._id, average_price, Quantity: Quantity, 
                    Product:Product, buyOrSell:buyOrSell,
                    variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by,
                    order_id, instrumentToken, brokerage: brokerageUser, trader: trader,
                    isRealTrade: true, amount: (Number(Quantity)*average_price), trade_time:order_timestamp,
                    exchange_order_id, exchange_timestamp, isMissed: false
                }

                const companyDocMock = {
                    status, average_price, Quantity: quantity, 
                    Product: product, buyOrSell: transaction_type, variety, validity, exchange, order_type: order_type, 
                    symbol, placed_by: placed_by, algoBox:algoBoxId, order_id, 
                    instrumentToken, brokerage: brokerageCompany, createdBy: req.user._id,
                    trader: trader, isRealTrade: false, amount: (Number(quantity)*average_price), 
                    trade_time: order_timestamp,
                }
        
                const traderDocMock = {
                    status, average_price, Quantity: Quantity, Product, buyOrSell,
                    variety, validity, exchange, order_type: OrderType, symbol, placed_by: placed_by,
                    isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
                    createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*average_price), trade_time:order_timestamp,
                }
        
                const liveCompanyTrade = await InfinityLiveCompany.create([companyDoc], { session });
                const algoTraderLive = await InfinityLiveTrader.create([traderDoc], { session });
                const mockCompany = await InfinityMockCompany.create([companyDocMock], {session});
                const algoTrader = await InfinityMockTrader.create([traderDocMock], {session})

                // console.log(algoTrader, mockTradeDetails)
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
                    settingRedis = await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnl))          
                }
        
                await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);
                // Commit the transaction

                if(settingRedis === "OK"){
                    await session.commitTransaction();
                } else{
                    // await session.commitTransaction();
                    throw new Error();
                }
                // res.status(201).json({status: 'Complete', message: 'COMPLETE'});

            } catch(err){
                await client.del(`${req.user._id.toString()} overallpnl`)
                await session.abortTransaction();
                console.error('Transaction failed, documents not saved:', err);
            } finally {
            // End the session
                session.endSession();
            }
        
            setTimeout(()=>{
                if(!dontSendResp){
                    return res.status(201).json({message : responseMsg, err: responseErr})
                }
            },0)
    
        }, 500)
    }

// console.log("in live order", req.body, obj)

}
