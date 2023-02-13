const kiteTicker = require('kiteconnect').KiteTicker;
const fetchData = require('./fetchToken');
const getKiteCred = require('./getKiteCred'); 
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder")
const RetreiveTrade = require("../models/TradeDetails/retireivingTrade")









let ticker;
const createNewTicker = (api_key, access_token) => {
    ticker = new kiteTicker({
        api_key,
        access_token 
    });
   
    ticker.connect();
    ticker.autoReconnect(true, 10000000000, 5);
    return ticker;    
}

const disconnectTicker = () => {
    console.log('disconnecting ticker');
    ticker.disconnect();
}

const subscribeTokens = async() => {
  getKiteCred.getAccess().then(async (data)=>{
    let tokens = await fetchData(data.getApiKey, data.getAccessToken);
    ticker.subscribe(tokens);
  });
}

const unSubscribeTokens = async(token) => {
    let tokens = [];
    tokens.push(token)
   let x =  ticker.unsubscribe(tokens);
  //  console.log("unsubscribed token", x, tokens);
}

const getTicks = (socket, tokens) => {
    ticker.on('ticks', (ticks) => {
      if(ticks.length == tokens.length){
        // console.log('sending ticks', ticks);
        socket.emit('tick', ticks); 
      }
    });
}

const onError = ()=>{
    ticker.on('error', (error)=>{
      // console.log(error);
    });
}

const onOrderUpdate = ()=>{
  // ticker.on("order_update", onTrade)
  ticker.on('order_update', (orderUpdate)=>{
    // console.log("orderUpdate", orderUpdate);
    let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
      validity, exchange, exchange_timestamp, order_type, price, 
      filled_quantity, pending_quantity, cancelled_quantity, 
      guid, market_protection, disclosed_quantity, tradingsymbol, 
      placed_by, status_message, status_message_raw, 
      instrument_token, exchange_update_timestamp, account_id} = orderUpdate

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
      if(!exchange_update_timestamp){
          exchange_update_timestamp = "null"
      }

      RetreiveTrade.findOne({order_id : order_id})
      .then((dataExist)=>{
          // if(dataExist ){
          //   console.log("data already in retreiveorder")
          //     return;
          // }
   
          const retreiveTrade = new RetreiveTrade({
            order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
            validity, exchange, exchange_timestamp, order_type, price, 
            filled_quantity, pending_quantity, cancelled_quantity, 
            guid, market_protection, disclosed_quantity, tradingsymbol, 
            placed_by, status_message, status_message_raw, 
            instrument_token, exchange_update_timestamp, account_id
          });
          // console.log("this is REAL CompanyTradeData", companyTradeData);
          retreiveTrade.save().then(()=>{
          }).catch((err)=> console.log(err, "failed to enter data"));
      }).catch(err => {console.log( err,"fail company live data saving")});

      if(status === "COMPLETE" || status === "REJECTED"){
        const retreiveOrder = new RetreiveOrder({order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
            validity, exchange, exchange_timestamp, order_type, price, 
            filled_quantity, pending_quantity, cancelled_quantity, 
            guid, market_protection, disclosed_quantity, tradingsymbol, 
            placed_by, status_message, status_message_raw, 
            instrument_token, exchange_update_timestamp, account_id});
            
        console.log("retreiveOrder", retreiveOrder)
        retreiveOrder.save().then(async ()=>{
            // await subscribeTokens();
            // res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> console.log(err, "failed to enter data"));
      }

  });
}
//       async function orderUpdateFunc() {
//         // console.log("updated order", orderUpdate)
//       }



const getTicker = () => ticker;
module.exports = {createNewTicker, disconnectTicker, subscribeTokens, getTicker, getTicks, onError, unSubscribeTokens, onOrderUpdate };

