

const axios = require("axios")
const BrokerageDetail = require("../../../models/Trading Account/brokerageSchema");
// const PaperTrade = require("../../../models/mock-trade/paperTrade");
const singleLivePrice = require('../../../marketData/sigleLivePrice');
// const StoxheroTrader = require("../../../models/mock-trade/stoxheroTrader");
const InfinityLiveTrader = require("../../../models/TradeDetails/liveTradeUserSchema");
const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema");
// const StoxheroTradeCompany = require("../../../models/mock-trade/stoxheroTradeCompany");
const io = require('../../../marketData/socketio');
const client = require('../../../marketData/redisClient');
const mongoose = require('mongoose');
const singleXTSLivePrice = require("./singleXTSLivePrice");
const {placeOrder} = require("../xtsInteractive")
const RetreiveOrder = require("../../../models/TradeDetails/retreiveOrder");

exports.liveTrade = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    // console.log(`There are ${secondsRemaining} seconds remaining until the end of the day.`);

    console.log("caseStudy 8: mocktrade")
    // let stoxheroTrader ;
    // const AlgoTrader = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTrader : InfinityTrader;
    // const MockTradeDetails = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTradeCompany : InfinityTradeCompany;

    let {algoBoxId, order_id, isAlgoTrader, exchangeSegment, exchange, symbol, buyOrSell, Quantity, 
        Price, Product, OrderType, TriggerPrice, validity, variety, createdBy,trader,
        createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, 
        userId, real_instrument_token, realSymbol, switching, dontSendResp, tradeBy} = req.body 

    if(exchange === "NFO"){
        exchangeSegment = 2;
    }

    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


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
        limitPrice: 15000,
        stopPrice: 0,
    }
    // const placeorder = await placeOrder(obj);

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let newTimeStamp = "";
    let trade_time = "";



    const AppOrderID = placeorder?.result?.AppOrderID;
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

            if(transaction_type === "SELL"){
                quantity = -quantity;
            }
            if(buyOrSell === "SELL"){
                Quantity = -Quantity;
            }
        
            function buyBrokerage(totalAmount){
                let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
                // let totalAmount = Number(Details.last_price) * Number(quantity);
                let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
                // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
                let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
                let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
                let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
                // console.log("stampDuty", stampDuty);
                let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
                let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
                return finalCharge;
            }
        
            function sellBrokerage(totalAmount){
                let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
                // let totalAmount = Number(Details.last_price) * Number(quantity);
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


            const session = await mongoose.startSession();
            try{
        
                const mockCompany = await InfinityLiveCompany.findOne({order_id : order_id});
                const mockInfintyTrader = await InfinityLiveTrader.findOne({order_id : order_id});
                if((mockCompany || mockInfintyTrader) && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
                    return res.status(422).json({message : "data already exist", error: "Fail to trade"})
                }
        
                
                session.startTransaction();
        
                const companyDoc = {
                    disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                    status, uId, createdBy, average_price, Quantity: quantity, 
                    Product:product, buyOrSell:transaction_type, order_timestamp: order_timestamp,
                    variety, validity, exchange, order_type: order_type, symbol, placed_by: placed_by,
                    algoBox: algoBoxId, order_id, instrumentToken, brokerage: brokerageCompany,
                    trader: trader, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
                    exchange_order_id, exchange_timestamp, isMissed
                }
        
                const traderDoc = {
                    disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
                    status, uId, createdBy, average_price, Quantity: Quantity, 
                    Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
                    variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
                    order_id, instrumentToken, brokerage: brokerageUser,
                    tradeBy: createdBy, isRealTrade: true, amount: (Number(Quantity)*average_price), trade_time:trade_time,
                    order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed
                }
        
                const mockTradeDetails = await InfinityLiveCompany.create([companyDoc], { session });
                const algoTrader = await InfinityLiveTrader.create([traderDoc], { session });
                console.log(algoTrader, mockTradeDetails)
                if(await client.exists(`${req.user._id.toString()} overallpnlLive`)){
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
        
                await client.expire(`${req.user._id.toString()} overallpnlLive`, secondsRemaining);
                // Commit the transaction
                await session.commitTransaction();
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        
            } catch(err){
                await client.del(`${req.user._id.toString()} overallpnlLive`)
                await session.abortTransaction();
                console.error('Transaction failed, documents not saved:', err);
            } finally {
            // End the session
                session.endSession();
            }
        
            setTimeout(()=>{
                if(!isMissed && !dontSendResp){
                    return res.status(201).json({message : responseMsg, err: responseErr})
                }
            },0)
    
        }, 500)
    }

console.log("in live order", req.body, obj)

}



// {
//     LoginID: 'CK68',
//  88   ClientID: 'CK68',
//  4   AppOrderID: 1200026157,
//     OrderReferenceID: '',
//     GeneratedBy: 'TWSAPI',
//  29   ExchangeOrderID: '',
//     OrderCategoryType: 'NORMAL',
//     ExchangeSegment: 'NSEFO',
// 102    ExchangeInstrumentID: 46292,
//  25   OrderSide: 'Buy',
// 51    OrderType: 'Market',
//  21   ProductType: 'NRML',
//  40   TimeInForce: 'DAY',
//   55  OrderPrice: 0,
//  17   OrderQuantity: 50,
//     OrderStopPrice: 0,
//  9   OrderStatus: 'Rejected',
//  13   OrderAverageTradedPrice: '',
//     LeavesQuantity: 50,
//     CumulativeQuantity: 0,
//  80   OrderDisclosedQuantity: 0,
//     OrderGeneratedDateTime: '2023-05-12T11:42:54.8611515',
//  48   ExchangeTransactTime: '2023-05-12T11:42:54+05:30',
//  32   LastUpdateDateTime: '2023-05-12T11:42:54.8621523',
//     OrderExpiryDate: '1980-01-01T00:00:00',
//  96   CancelRejectReason: 'OEMS:RMS : Margin Exceeds :  - Set Limit:[0] Total Required Margin:[8087.5] Available Margin[0] Margin Shortfall[8087.5] for entity [Client]-[CK68] across [ALL|ALL|ALL]',
//     OrderUniqueIdentifier: '',
//     OrderLegStatus: 'SingleOrderLeg',
//     IsSpread: false,
//     BoLegDetails: 0,
//     BoEntryOrderId: '',
//     OrderAverageTradedPriceAPI: 'NaN',
//     OrderSideAPI: 'BUY',
//     OrderGeneratedDateTimeAPI: '12-05-2023 11:42:54',
//  105   ExchangeTransactTimeAPI: '12-05-2023 11:42:54',
//     LastUpdateDateTimeAPI: '12-05-2023 11:42:54',
//     OrderExpiryDateAPI: '01-01-1980 00:00:00',
//     MessageCode: 9004,
//     MessageVersion: 4,
//     TokenID: 0,
//     ApplicationType: 146,
//     SequenceNumber: 1060436480762617
//   }

// exchange, tradingsymbol