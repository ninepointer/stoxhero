const axios = require("axios")
// const getOrderData = require("./retrieveOrder");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const CompanyTradeData = require("../models/TradeDetails/liveTradeSchema");
const TradeData = require("../models/TradeDetails/allTradeSchema"); 
const UserTradeData = require("../models/TradeDetails/liveTradeUserSchema")
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeUser = require("../models/mock-trade/mockTradeUserSchema");
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");


// exports.liveTrade = async (reqBody, res) => {


//     let responseMsg;
//     let responseErr;

//     let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
//         TriggerPrice, validity, variety, createdBy,trader,
//          createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
//          accessToken, userId, real_instrument_token, realSymbol, switching, dontSendResp, tradeBy} = reqBody

//          console.log(reqBody)

//          if(switching){
//             tradeBy = "System"
//          } else{
//             tradeBy = createdBy
//          }

//     const {algoName, transactionChange, instrumentChange
//        , exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault} = algoBox

//        const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
//        const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});

//     const api_key = apiKey;
//     const access_token = accessToken;
//     let auth = 'token ' + api_key + ':' + access_token;

//     let headers = {
//         'X-Kite-Version':'3',
//         'Authorization': auth,
//         "content-type" : "application/x-www-form-urlencoded"
//     }
//     let orderData;


//     // variety = "amo";
//     // Price = 7;
//     // TriggerPrice = 7;
//     // realQuantity = 10;
//     // OrderType = "LIMIT";
//     // Product = "MIS"

//     if(variety === "amo"){
//         orderData = new URLSearchParams({
//             "tradingsymbol":realSymbol,
//             "exchange":exchange,
//             "transaction_type":realBuyOrSell,
//             "order_type":OrderType,
//             "quantity":realQuantity,
//             "product":Product,
//             "validity":validity,
//             "price":Price,
//             "trigger_price": TriggerPrice
//         })
//     } else if(variety === "regular"){
//         orderData = new URLSearchParams({
//             "tradingsymbol":realSymbol,
//             "exchange":exchange,
//             "transaction_type":realBuyOrSell,
//             "order_type":OrderType,
//             "quantity":realQuantity,
//             "product":Product,
//             "validity":validity
//         })
//     }

//     axios.post(`https://api.kite.trade/orders/${variety}`, orderData, {headers : headers})
//     .then(async (resp)=>{

//         const order_Id = resp.data.data.order_id
//         console.log("order_id", resp.data.data.order_id);

//         const url2 = `https://api.kite.trade/orders/${order_Id}`;
      
//         let authOptions = {
//           headers: {
//             'X-Kite-Version': '3',
//             Authorization: auth,
//           },
//         };


//         await retreiveOrderAndSave(url2, authOptions, false);


//     }).catch(async (err)=>{
//         console.log(err, "order id not receive---------------------")
//         if(err.response.data.message === "Order request timed out. Please check the order book and confirm before placing again."){
//             await ifOrderIdNotFound(false, realBuyOrSell);
//         } else if(!dontSendResp){
//             return res.status(422).json({error : err.response.data.message})
//         }
//     })

//     function retreiveOrderAndSave(url2, authOptions, isMissed){
//         setTimeout(()=>{
//             axios.get(url2, authOptions)
//             .then(async (response)=>{
//                 const allOrderData = (response.data).data;
//                 console.log("allOrderData", allOrderData.length);
//                 let len = allOrderData.length;
//                 let orderData;
    
//                 for(let i = len-1; i >= 0; i--){
//                     let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
//                         order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
//                         pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
//                         status_message, status_message_raw} = allOrderData[i]
    
//                         if(!status_message){
//                             status_message = "null"
//                         }
//                         if(!status_message_raw){
//                             status_message_raw = "null"
//                         }
//                         if(!exchange_timestamp){
//                             exchange_timestamp = "null"
//                         }
//                         if(!exchange_order_id){
//                             exchange_order_id = "null"
//                         }
    
//                     const tradeData = (new TradeData({order_id, status, average_price, quantity, product, transaction_type,
//                         order_timestamp, variety, validity, exchange, order_type, price, filled_quantity, 
//                         pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,
//                         status_message, status_message_raw, exchange_order_id, exchange_timestamp}))
                  
//                         // console.log("this is trade data", tradeData, typeof(tradeData));
//                         tradeData.save()
//                         .then(()=>{
//                             // console.log("data enter succesfully")
//                         }).catch((err)=> {
//                           res.status(500).json({error:"Failed to Enter trade data"});
//                           console.log("failed to enter data of order");
//                         })
//                 }
    
//                 for(let i = len-1; i >= 0; i--){
//                   if(allOrderData[i].status === "COMPLETE" || allOrderData[i].status === "REJECTED" || allOrderData[i].status === "AMO REQ RECEIVED"){
//                     orderData = JSON.parse(JSON.stringify(allOrderData[i]));
//                   }
//                 }
    
//                 if(!orderData){
//                     console.log("retreiveOrderAndSave function calling again")
//                     await retreiveOrderAndSave(url2, authOptions, false);
//                     return;
//                 }
//                 //console.log("order data", orderData);
//                 let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
//                        order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
//                        pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
//                        status_message, status_message_raw} = orderData
             
//                 if(!status_message){
//                     status_message = "null"
//                 }
//                 if(!status_message_raw){
//                     status_message_raw = "null"
//                 }
//                 if(!exchange_timestamp){
//                     exchange_timestamp = "null"
//                 }
//                 if(!exchange_order_id){
//                     exchange_order_id = "null"
//                 }

//                 if(isMissed){
//                     createdBy = "System";
//                     userId = "system@ninepointer.in";
//                 }
    
//                 responseMsg = status;
//                 responseErr = status_message;
    
//                 if(transaction_type === "SELL"){
//                     quantity = -quantity;
//                 }
//                 if(buyOrSell === "SELL"){
//                     Quantity = -Quantity;
//                 }

//                 let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

//                 let originalLastPriceUser;

//                 if(instrumentChange === "TRUE"){

//                     try{
                    
//                         let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
//                         //console.log(liveData)
//                         for(let elem of liveData.data){
//                             //console.log(elem)
//                             if(elem.instrument_token == instrumentToken){
//                                 originalLastPriceUser = elem.last_price;
//                             }
//                         }
                            
//                     } catch(err){
//                         return new Error(err);
//                     }

//                 } else {
//                     originalLastPriceUser = average_price;
//                 }

    
//                 let trade_time = order_timestamp
//                 let timestamp = order_timestamp.split(" ");
//                 let timestampArr = timestamp[0].split("-");
//                 let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`
    
//                 function buyBrokerage(totalAmount){
//                     let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
//                     // let totalAmount = Number(Details.last_price) * Number(quantity);
//                     let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
//                     // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
//                     let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
//                     let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
//                     let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
//                     // console.log("stampDuty", stampDuty);
//                     let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
//                     let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
//                     return finalCharge;
//                 }
            
//                 function sellBrokerage(totalAmount){
//                     let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
//                     // let totalAmount = Number(Details.last_price) * Number(quantity);
//                     let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
//                     let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
//                     let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
//                     let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
//                     let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
//                     let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
            
//                     return finalCharge
//                 }
            
//                 let brokerageCompany;
//                 let brokerageUser;
            
//                 if(transaction_type === "BUY"){
//                     brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * average_price);
//                 } else{
//                     brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * average_price);
//                 }
    
//                 if(buyOrSell === "BUY"){
//                     brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
//                 } else{
//                     brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
//                 }
            
    
//                 CompanyTradeData.findOne({order_id : order_id})
//                 .then((dataExist)=>{
//                     if(dataExist && dataExist.order_timestamp !== new_order_timestamp ){
//                         // console.log("data already in real company");
//                         return res.status(422).json({error : "data already exist..."})
//                     }
//                     const tempDate = new Date();
//                     let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                     function addMinutes(date, hours) {
//                       date.setMinutes(date.getMinutes() + hours);
//                       return date;
//                      }
//                     const date = new Date(temp_order_save_time);
//                     const newDate = addMinutes(date, 330);
//                     const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
             
//                     const companyTradeData = new CompanyTradeData({
//                         disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
//                         status, uId, createdBy, average_price, Quantity: quantity, 
//                         Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
//                         variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
//                         algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
//                         lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, 
//                         brokerage: brokerageCompany,
//                         tradeBy: tradeBy,trader: trader, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
//                         order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed
    
            
//                     });
//                     console.log("this is REAL CompanyTradeData", companyTradeData);
//                     companyTradeData.save().then(()=>{
//                     }).catch((err)=> {
//                         console.log(err, "fail in company live")
//                         res.status(500).json({error:"Failed to Trade company side"})
//                     });
//                 }).catch(err => {console.log( err,"fail company live data saving")});
    
//                     UserTradeData.findOne({order_id : order_id})
//                     .then((dataExist)=>{
//                         if(dataExist){
//                             // console.log("data already in real user");
//                             return res.status(422).json({error : "data already exist..."})
//                         }
//                         const tempDate = new Date();
//                         let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                         function addMinutes(date, hours) {
//                         date.setMinutes(date.getMinutes() + hours);
//                         return date;
//                         }
//                         const date = new Date(temp_order_save_time);
//                         const newDate = addMinutes(date, 330);
//                         const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
                
//                         const userTradeData = new UserTradeData({
//                             disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
//                             status, uId, createdBy, average_price: originalLastPriceUser, Quantity: Quantity, 
//                             Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
//                             variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
//                             order_id, instrumentToken, brokerage: brokerageUser,
//                             tradeBy: createdBy, isRealTrade: true, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
//                             order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed
                            
        
//                         });
//                         console.log("this is REALuserTradeData", userTradeData);
//                         userTradeData.save().then(()=>{
//                         }).catch((err)=> {
//                             console.log(err, "fail in user live")
//                             res.status(500).json({error:"Failed to Trade company side"})
//                         });
//                     }).catch(err => {console.log(err, "fail trader live data saving")});
    
//                 if(!switching){
//                     MockTradeCompany.findOne({order_id : order_id})
//                     .then((dataExist)=>{
//                         if(dataExist && dataExist.order_timestamp !== new_order_timestamp ){
//                             // console.log("data already in mock company");
//                             return res.status(422).json({error : "date already exist..."})
//                         }
//                         const tempDate = new Date();
//                         let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                         function addMinutes(date, hours) {
//                         date.setMinutes(date.getMinutes() + hours);
//                         return date;
//                         }
//                         const date = new Date(temp_order_save_time);
//                         const newDate = addMinutes(date, 330);
//                         const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
                
//                         const mockTradeDetails = new MockTradeCompany({
        
//                             status, uId, createdBy, average_price, Quantity: quantity, 
//                             Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
//                             variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
//                             algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
//                             lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, 
//                             brokerage: brokerageCompany,
//                             tradeBy: createdBy, trader: trader, isRealTrade: false, amount: (Number(quantity)*average_price), trade_time:trade_time,
//                             order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed
        
//                         });
                
//                         // console.log("mockTradeDetails comapny", mockTradeDetails);
//                         mockTradeDetails.save().then(()=>{
//                             // res.status(201).json({message : "data enter succesfully"});
//                         }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
//                     }).catch(err => {console.log(err, "fail company mock in placeorder")});
    
//                     MockTradeUser.findOne({order_id : order_id})
//                     .then((dataExist)=>{
//                         if(dataExist){
//                             // console.log("data already in mock user");
//                             return res.status(422).json({error : "date already exist..."})
//                         }
//                         const tempDate = new Date();
//                         let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                         function addMinutes(date, hours) {
//                         date.setMinutes(date.getMinutes() + hours);
//                         return date;
//                         }
//                         const date = new Date(temp_order_save_time);
//                         const newDate = addMinutes(date, 330);
//                         const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
                
//                         const mockTradeDetailsUser = new MockTradeUser({
        
//                             status, uId, createdBy, average_price: originalLastPriceUser, Quantity: Quantity, 
//                             Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
//                             variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
//                             order_id, instrumentToken, brokerage: brokerageUser,
//                             tradeBy: createdBy, trader: trader, isRealTrade: false, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
//                             order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed
        
//                         });
                
//                         // console.log("mockTradeDetails USER", mockTradeDetailsUser);
//                         mockTradeDetailsUser.save().then(()=>{
//                             // res.status(201).json({message : "data enter succesfully"});
//                         }).catch((err)=> {
//                             // res.status(500).json({error:"Failed to enter data"})
//                         });
                
//                     }).catch(err => {console.log(err, "fail company mock in placeorder")});
//                 }
//     // dontSendResp = false then resopse will sent
//                 setTimeout(()=>{
//                     if(!isMissed && !dontSendResp){
//                         return res.status(201).json({message : responseMsg, err: responseErr})
//                     }
//                 },0)
    
        
//             }).catch(async (err)=>{
//                 await retreiveOrderAndSave(url2, authOptions, false);
//                 console.log(err, "err in retreiving data in placeorder---------------");
//             })
    
//         }, 500)
//     }
    
//     async function ifOrderIdNotFound(isMissed, transactionType){
//         console.log("in order if func")
//         let breakingLoop = false;
//         let date = new Date(Date.now()-10000).toISOString().split('.')[0].replace('T', ' ')

//         for(let i = 0; i < 10; i++){
//             setTimeout(async ()=>{
    
//                 const missedOrderId = await RetreiveOrder.aggregate([
//                     { 
//                         $match: {
//                                 order_timestamp: {$gte: date},
//                                 quantity: realQuantity,
//                                 // transaction_type: transactionType,
//                                 tradingsymbol: realSymbol,
//                                 status: "COMPLETE"
//                         }
//                     },
//                     {
//                         $lookup: {
//                           from: "live-trade-companies",
//                           localField: "order_id",
//                           foreignField: "order_id",
//                           as: "completed_trade"
//                         }
//                       },
//                       {
//                         $match: {
//                           completed_trade: {
//                             $size: 0
//                           },
//                         },
//                       },
//                       {
//                         $group: {
//                           _id: "$_id",
//                           order_id: {$first: "$order_id"},
//                           status: {$first: "$status"},    
//                           average_price: {$first: "$average_price"},
//                           quantity: {$first: "$quantity"} ,
//                           product: {$first: "$product"},
//                           transaction_type: {$first: "$transaction_type"},
//                           exchange_order_id: {$first: "$exchange_order_id"},
//                           order_timestamp: {$first: "$order_timestamp"},
//                           variety: {$first: "$variety"},
//                           validity: {$first: "$validity"},
//                           exchange: {$first: "$exchange"},
//                           exchange_timestamp: {$first: "$exchange_timestamp"},
//                           order_type: {$first: "$order_type"},
//                           price: {$first: "$price"},
//                           filled_quantity: {$first: "$filled_quantity"},
//                           pending_quantity: {$first: "$pending_quantity"},
//                           cancelled_quantity: {$first: "$cancelled_quantity"},
//                           guid: {$first: "$guid"},
//                           market_protection: {$first: "$market_protection"},
//                           disclosed_quantity: {$first: "$disclosed_quantity"},
//                           tradingsymbol: {$first: "$tradingsymbol"},
//                           placed_by: {$first: "$placed_by"},
//                           status_message: {$first: "$status_message"},
//                           status_message_raw: {$first: "$status_message_raw"},
              
//                         }
//                       }
//                     ]);

//                     // console.log("missedOrderId",missedOrderId)
    
//                 if(!breakingLoop && !isMissed && missedOrderId.length > 0 && i < 5){
//                     console.log("in the first if condition")
//                     let missedTrade = missedOrderId.filter((elem)=>{
//                         return elem.transaction_type === realBuyOrSell;
//                     })

//                     // console.log("missedTrade", missedTrade)
//                     for(let elem of missedTrade){
//                         // console.log("elem", elem)
//                         // const checkData = await CompanyTradeData.findOne({order_id: elem.order_id})
//                         // console.log("checkData", checkData)
//                         // if(checkData.length === 0){
//                             console.log("in the second if condition for saving data")
//                             await savingDataInDB(elem, true, isMissed)
//                         // }
//                     }
                    
//                     breakingLoop = true;
//                 }
//                 if(isMissed){
//                     for(let elem of missedOrderId){
//                         console.log("in the third if condition for system saving")
//                         await savingDataInDB(elem, true, isMissed)
//                     }
                    
//                 }


    
//                 if(!breakingLoop && i >= 5){
//                     console.log("in the fifth if conditionfor reverse trade")
//                     if(i === 5){
//                         res.status(400).json({message : `your trade of ${realSymbol} and quantity ${realQuantity} was not placed`})
//                     }
                
//                     if(missedOrderId.length > 0){
//                         await reverseTrade(missedOrderId[0].transaction_type, true)
//                     }
//                 }
 
//             }, 1000)

//             if(breakingLoop){
//                 break;
//             }

//         }
//     }

//     async function savingDataInDB(orderData, isMissed, checkingIsMissed){
//         console.log("in savingDataInDB func")
//         let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
//                order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
//                pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
//                status_message, status_message_raw} = orderData
     
//             //    console.log("orderData in savingDataInDB", orderData)
//         if(!status_message){
//             status_message = "null"
//         }
//         if(!status_message_raw){
//             status_message_raw = "null"
//         }
//         if(!exchange_timestamp){
//             exchange_timestamp = "null"
//         }
//         if(!exchange_order_id){
//             exchange_order_id = "null"
//         }
//         if(checkingIsMissed){
//             createdBy = "System",
//             userId = "system@ninepointer.in"
//         }

//         responseMsg = status;
//         responseErr = status_message;

//         if(transaction_type === "SELL"){
//             quantity = -quantity;
//         }
//         if(buyOrSell === "SELL"){
//             Quantity = -Quantity;
//         }

//         let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

//         let originalLastPriceUser;

//         if(instrumentChange === "TRUE"){

//             try{
            
//                 let liveData = await axios.get(`${baseUrl}api/v1/getliveprice`)
//                 //console.log(liveData)
//                 for(let elem of liveData.data){
//                     //console.log(elem)
//                     if(elem.instrument_token == instrumentToken){
//                         originalLastPriceUser = elem.last_price;
//                     }
//                 }
                    
//             } catch(err){
//                 return new Error(err);
//             }

//         } else {
//             originalLastPriceUser = average_price;
//         }


//         let trade_time = order_timestamp
//         let timestamp = order_timestamp.split(" ");
//         let timestampArr = timestamp[0].split("-");
//         let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`

//         function buyBrokerage(totalAmount){
//             let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
//             // let totalAmount = Number(Details.last_price) * Number(quantity);
//             let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
//             // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
//             let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
//             let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
//             let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
//             // console.log("stampDuty", stampDuty);
//             let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
//             let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
//             return finalCharge;
//         }
    
//         function sellBrokerage(totalAmount){
//             let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
//             // let totalAmount = Number(Details.last_price) * Number(quantity);
//             let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
//             let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
//             let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
//             let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
//             let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
//             let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    
//             return finalCharge
//         }
    
//         let brokerageCompany;
//         let brokerageUser;
    
//         if(transaction_type === "BUY"){
//             brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * average_price);
//         } else{
//             brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * average_price);
//         }

//         if(buyOrSell === "BUY"){
//             brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
//         } else{
//             brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
//         }
    
//         console.log("outside saving")

//         CompanyTradeData.findOne({order_id : order_id})
//         .then((dataExist)=>{
//             if(dataExist && dataExist.order_timestamp !== new_order_timestamp ){
//                 // console.log("data already in real company");
//                 // return res.status(422).json({error : "data already exist..."})
//                 return;
//             }
//             const tempDate = new Date();
//             let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//             function addMinutes(date, hours) {
//               date.setMinutes(date.getMinutes() + hours);
//               return date;
//              }
//             const date = new Date(temp_order_save_time);
//             const newDate = addMinutes(date, 330);
//             const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
//              console.log("before saving")
//             const companyTradeData = new CompanyTradeData({
//                 disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
//                 status, uId, createdBy, average_price, Quantity: quantity, 
//                 Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
//                 variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
//                 algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
//                 lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, 
//                 brokerage: brokerageCompany,
//                 tradeBy: createdBy, trader: trader, isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
//                 order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed

    
//             });
//             // console.log("this is REAL CompanyTradeData", companyTradeData);
//             companyTradeData.save().then(()=>{
//             }).catch((err)=> {console.log( err,"fail company live data saving company")});
//         }).catch(err => {console.log( err,"fail company live data saving")});

//         // if(checkingMultipleAlgoFlag === 1){
//             UserTradeData.findOne({order_id : order_id})
//             .then((dataExist)=>{
//                 if(dataExist){
//                     // console.log("data already in real user");
//                     // return res.status(422).json({error : "data already exist..."});
//                     return;
//                 }
//                 const tempDate = new Date();
//                 let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                 function addMinutes(date, hours) {
//                 date.setMinutes(date.getMinutes() + hours);
//                 return date;
//                 }
//                 const date = new Date(temp_order_save_time);
//                 const newDate = addMinutes(date, 330);
//                 const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
        
//                 const userTradeData = new UserTradeData({
//                     disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
//                     status, uId, createdBy, average_price: originalLastPriceUser, Quantity: Quantity, 
//                     Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
//                     variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
//                     order_id, instrumentToken, brokerage: brokerageUser,
//                     tradeBy: createdBy, trader: trader, isRealTrade: true, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
//                     order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed


//                 });
//                 // console.log("this is REALuserTradeData", userTradeData);
//                 userTradeData.save().then(()=>{
//                 }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
//             }).catch(err => {console.log(err, "fail trader live data saving")});
//         // }

//         MockTradeCompany.findOne({order_id : order_id})
//         .then((dataExist)=>{
//             if(dataExist && dataExist.order_timestamp !== new_order_timestamp){
//                 // console.log("data already in mock company");
//                 // return res.status(422).json({error : "date already exist..."})
//                 return;
//             }
//             const tempDate = new Date();
//             let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//             function addMinutes(date, hours) {
//               date.setMinutes(date.getMinutes() + hours);
//               return date;
//              }
//             const date = new Date(temp_order_save_time);
//             const newDate = addMinutes(date, 330);
//             const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
     
//             const mockTradeDetails = new MockTradeCompany({

//                 status, uId, createdBy, average_price, Quantity: quantity, 
//                 Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
//                 variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId,
//                 algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
//                 lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, 
//                 brokerage: brokerageCompany,
//                 tradeBy: createdBy, trader: trader, isRealTrade: false, amount: (Number(quantity)*average_price), trade_time:trade_time,
//                 order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed

//             });
    
//             // console.log("mockTradeDetails comapny", mockTradeDetails);
//             mockTradeDetails.save().then(()=>{
//                 // res.status(201).json({message : "data enter succesfully"});
//             }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
//         }).catch(err => {console.log(err, "fail company mock in placeorder")});

//         // if(checkingMultipleAlgoFlag === 1){
//             MockTradeUser.findOne({order_id : order_id})
//             .then((dataExist)=>{
//                 if(dataExist){
//                     // console.log("data already in mock user");
//                     // return res.status(422).json({error : "date already exist..."})
//                     return;
//                 }
//                 const tempDate = new Date();
//                 let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
//                 function addMinutes(date, hours) {
//                 date.setMinutes(date.getMinutes() + hours);
//                 return date;
//                 }
//                 const date = new Date(temp_order_save_time);
//                 const newDate = addMinutes(date, 330);
//                 const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);
        
//                 const mockTradeDetailsUser = new MockTradeUser({

//                     status, uId, createdBy, average_price: originalLastPriceUser, Quantity: Quantity, 
//                     Product:Product, buyOrSell:buyOrSell, order_timestamp: new_order_timestamp,
//                     variety, validity, exchange, order_type: OrderType, symbol:symbol, placed_by: placed_by, userId,
//                     order_id, instrumentToken, brokerage: brokerageUser,
//                     tradeBy: createdBy, trader: trader, isRealTrade: false, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
//                     order_req_time: createdOn, order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed

//                 });
        
//                 // console.log("mockTradeDetails USER", mockTradeDetailsUser);
//                 mockTradeDetailsUser.save().then(()=>{
//                     // res.status(201).json({message : "data enter succesfully"});
//                 }).catch((err)=> {
//                     // res.status(500).json({error:"Failed to enter data"})
//                 });
        
//             }).catch(err => {console.log(err, "fail company mock in placeorder")});
//         // }


//         setTimeout(()=>{
//             if(!checkingIsMissed){
//                 console.log("sending resp to user")
//                 return res.status(201).json({message : responseMsg, err: responseErr})
//             }
//         },0)

//     }

//     async function reverseTrade(realBuyOrSell, isMissed){
//         console.log("in reverseTrade func")
//         let transactionType ;
//         if(realBuyOrSell === "BUY"){
//             transactionType = "SELL";
//         } else{
//             transactionType = "BUY"
//         }
//         const api_key = apiKey;
//         const access_token = accessToken;
//         let auth = 'token ' + api_key + ':' + access_token;
    
//         let headers = {
//             'X-Kite-Version':'3',
//             'Authorization': auth,
//             "content-type" : "application/x-www-form-urlencoded"
//         }
//         let orderData;

    
//         if(variety === "amo"){
//             orderData = new URLSearchParams({
//                 "tradingsymbol":realSymbol,
//                 "exchange":exchange,
//                 "transaction_type":transactionType,
//                 "order_type":OrderType,
//                 "quantity":realQuantity,
//                 "product":Product,
//                 "validity":validity,
//                 "price":Price,
//                 "trigger_price": TriggerPrice
//             })
//         } else if(variety === "regular"){
//             orderData = new URLSearchParams({
//                 "tradingsymbol":realSymbol,
//                 "exchange":exchange,
//                 "transaction_type":transactionType,
//                 "order_type":OrderType,
//                 "quantity":realQuantity,
//                 "product":Product,
//                 "validity":validity
//             })
//         }
    
//         axios.post(`https://api.kite.trade/orders/${variety}`, orderData, {headers : headers})
//         .then(async (resp)=>{
    
//             const order_Id = resp.data.data.order_id
//             console.log("order_id", resp.data.data.order_id);
    
//             const url2 = `https://api.kite.trade/orders/${order_Id}`;
          
//             let authOptions = {
//               headers: {
//                 'X-Kite-Version': '3',
//                 Authorization: auth,
//               },
//             };
    
    
//             await retreiveOrderAndSave(url2, authOptions, isMissed);
    
    
//         }).catch(async (err)=>{

//             if(err.response.data.message === "Order request timed out. Please check the order book and confirm before placing again."){
//                 await ifOrderIdNotFound(isMissed, transactionType);
//             } else{
//                 res.status(422).json({error : err.response.data.message})
//             }
//             console.log("order id not receive again---------------------")
//         })
    
//     }

// }



const axios = require("axios")
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const singleLivePrice = require('../marketData/sigleLivePrice');
const StoxheroTrader = require("../models/mock-trade/stoxheroTrader");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");
const io = require('../marketData/socketio');
const client = require('../marketData/redisClient');
const mongoose = require('mongoose');
const singleXTSLivePrice = require("../services/xts/xtsHelper/singleXTSLivePrice");


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
        validity, variety, algoBoxId, order_id, instrumentToken,  
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, 
        trader, isAlgoTrader, paperTrade, exchangeSegment } = req.body 

        if(exchange === "NFO"){
            exchangeSegment = 2;
        }

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
        // let liveData = await singleLivePrice(exchange, symbol) TODO toggle
        let liveData = await singleXTSLivePrice(exchangeSegment, instrumentToken);
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

    console.log(Number(realQuantity), originalLastPriceCompany)
    if(realBuyOrSell === "BUY"){
        brokerageCompany = 10
        // buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany); // TODO 
    } else{
        brokerageCompany = 10
        // sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = 10
        // buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = 10
        // sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
    
    console.log(paperTrade, isAlgoTrader);

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



// {
//     "type": "success",
//     "code": "s-user-0001",
//     "description": "Success order book",
//     "result": [
//       {
//         "LoginID": "SYMP1",
//         "ClientID": "SYMP1",
//         "AppOrderID": 648468730,
//         "OrderReferenceID": "",
//         "GeneratedBy": "TWSAPI",
//         "ExchangeOrderID": "1005239196374108",
//         "OrderCategoryType": "NORMAL",
//         "ExchangeSegment": "NSECM",
//         "ExchangeInstrumentID": 16921,
//         "OrderSide": "BUY",
//         "OrderType": "Limit",
//         "ProductType": "NRML",
//         "TimeInForce": "DAY",
//         "OrderPrice": 254.55,
//         "OrderQuantity": 15,
//         "OrderStopPrice": 0,
//         "OrderStatus": "New",
//         "OrderAverageTradedPrice": 250.4,
//         "LeavesQuantity": 1,
//         "CumulativeQuantity": 0,
//         "OrderDisclosedQuantity": 0,
//         "OrderGeneratedDateTime": "14-05-2021 11:17:29",
//         "ExchangeTransactTime": "14-05-2021 11:17:30",
//         "LastUpdateDateTime": "14-05-2021 11:17:29",
//         "OrderExpiryDate": "01-01-1980 00:00:00",
//         "CancelRejectReason": "",
//         "OrderUniqueIdentifier": "123abc",
//         "OrderLegStatus": "SingleOrderLeg",
//         "BoLegDetails": 0,
//         "IsSpread": false,
//         "BoEntryOrderId": "",
//         "MessageCode": 9004,
//         "MessageVersion": 4,
//         "TokenID": 0,
//         "ApplicationType": 0,
//         "SequenceNumber": 0
//       }
//     ]
//   }