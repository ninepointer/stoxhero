const kiteTicker = require('kiteconnect').KiteTicker;
const fetchToken = require('./fetchToken');
const getKiteCred = require('./getKiteCred'); 
const RetreiveOrder = require("../models/TradeDetails/retreiveOrder")
const StockIndex = require("../models/StockIndex/stockIndexSchema");
const ContestInstrument = require("../models/Instruments/contestInstrument");
const {DummyMarketData} = require("./dummyMarketData")
const User = require("../models/User/userDetailSchema")
const {getIOValue} = require('../marketData/socketio');
const {client, getValue} = require("./redisClient");
const { ObjectId } = require('mongodb');
const {xtsAccountType, zerodhaAccountType} = require("../constant");



let ticker;

const createNewTicker = (api_key, access_token) => {
  console.log("createNewTicker")
    ticker = new kiteTicker({
        api_key,
        access_token 
    });
   
    ticker?.connect();
    ticker?.autoReconnect(true, 10000000000, 5);
    return ticker;    
}

const disconnectTicker = () => {
    console.log('disconnecting ticker');
    ticker?.disconnect();
}

const subscribeTokens = async() => {
    let tokens = await fetchToken();
    let data = ticker?.subscribe(tokens);
    ticker?.setMode(ticker.modeFull, tokens);
}

const subscribeSingleToken = async(instrumentToken) => {
  ticker?.subscribe(instrumentToken);
  ticker?.setMode(ticker.modeFull, instrumentToken);
 
}

const unSubscribeTokens = async(token) => {
    let tokens = [];
    tokens?.push(token)
   let x =  ticker?.unsubscribe(tokens);
}

const getTicks = async (socket) => {
  const io = getIOValue();
  let isRedisConnected = getValue();
  let indecies;
  if(isRedisConnected){
    indecies = await client.get("index")
  }
  
  if(!indecies){
    indecies = await StockIndex.find({status: "Active"});
    if(isRedisConnected){
      await client.set("index", JSON.stringify(indecies));
    }
  } else{
    indecies = JSON.parse(indecies);
  }

  ticker.on('ticks', async (ticks) => {
    socket.emit('tick', ticks);

    // socket.emit('check', ticks);

    let indexObj = {};
    let now = performance.now();
    // populate hash table with indexObj from indecies
    for (let i = 0; i < indecies?.length; i++) {
      indexObj[indecies[i]?.instrumentToken] = true;
    }
    // filter ticks using hash table lookups
    let indexData = ticks.filter(function(item) {
      return indexObj[item.instrument_token];
    });

    try{

      let instrumentTokenArr = [];
      let userId ;
      if(isRedisConnected){
        userId = await client.get(socket.id);
      }
      
      if(isRedisConnected && await client.exists((userId).toString())){
        let instruments = await client.SMEMBERS((userId).toString())
        instrumentTokenArr = new Set(instruments)
      } else{
        // console.log("in else part")
        const user = await User.findById(new ObjectId(userId))
        .populate('watchlistInstruments')
  
        userId = user._id;
        for(let i = 0; i < user.watchlistInstruments.length; i++){
          instrumentTokenArr.push(user.watchlistInstruments[i].instrumentToken);
        }
        instrumentTokenArr = new Set(instrumentTokenArr)
      }

      // let userId = await client.get(socket.id)
      // let instruments = await client.SMEMBERS(userId)
      // let instrumentTokenArr = new Set(instruments); // create a Set of tokenArray elements
      let filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.instrument_token).toString()));
      if(indexData?.length > 0){
        socket.emit('index-tick', indexData)
      }
      
      if(filteredTicks.length > 0){
        io.to(`${userId}`).emit('contest-ticks', filteredTicks);
        io.to(`${userId}`).emit('tick-room', filteredTicks);
      }

      console.log("performance", performance.now()-now, socket.id);

      filteredTicks = null;
      ticks = null;
      indexData = null;
      instrumentTokenArr = null;
      instruments = null;


    } catch (err){
      console.log(err)
    }


  });
}

const getDummyTicks = async(socket) => {
  const io = getIOValue();
  let userId = await client.get(socket.id);
  let filteredTicks = await DummyMarketData(socket);
  io.to(userId).emit('tick-room-test', filteredTicks);
}

const getTicksForUserPosition = async (socket, id) => {
  const io = getIOValue();
  let isRedisConnected = getValue();
  // console.log("this is getter1", getValue());
  let indecies;
  if(isRedisConnected){
    indecies = await client.get("index")
  }
  
  if(!indecies){
    indecies = await StockIndex.find({status: "Active", accountType: zerodhaAccountType});
    if(isRedisConnected){
      await client.set("index", JSON.stringify(indecies));
    }
  } else{
    indecies = JSON.parse(indecies);
  }
  // console.log("indecies", indecies)

  try {
    // console.log("above ticks", ticker)
    ticker.on('ticks', async (ticks) => {

      let indexObj = {};
      let now = performance.now();
      // populate hash table with indexObj from indecies
      for (let i = 0; i < indecies?.length; i++) {
        indexObj[indecies[i]?.instrumentToken] = true;
      }
      // filter ticks using hash table lookups
      let indexData = ticks.filter(function (item) {
        return indexObj[item.instrument_token];
      });


      try {
        let instrumentTokenArr;
        let userId;
        if (isRedisConnected) {
          userId = await client.get(socket.id);
        }
        // console.log(isRedisConnected)
        if (isRedisConnected && await client.exists(`${userId?.toString()}allInstrument`)) {
          let instruments = await client.SMEMBERS(`${userId?.toString()}allInstrument`)
          // instrumentTokenArr = new Set(instruments)
          const parsedInstruments = instruments.map(jsonString => JSON.parse(jsonString));
          instrumentTokenArr = new Set();

          parsedInstruments.forEach(obj => {
            instrumentTokenArr.add(obj.instrumentToken);
            instrumentTokenArr.add(obj.exchangeInstrumentToken);
          });

          // console.log("this is instrumentTokenArr");
        } else {
          const user = await User.findById({_id: new ObjectId(id)})
            .populate('allInstruments')

          userId = user._id;
          instrumentTokenArr = [];
          for (let i = 0; i < user.allInstruments.length; i++) {
            
            instrumentTokenArr.push(user.allInstruments[i].instrumentToken);
            instrumentTokenArr.push(user.allInstruments[i].exchangeInstrumentToken);
            let obj = {
              instrumentToken: user.allInstruments[i].instrumentToken,
              exchangeInstrumentToken: user.allInstruments[i].exchangeInstrumentToken
            }
            const newredisClient = await client.SADD(`${userId?.toString()}allInstrument`, JSON.stringify(obj));

          }
          instrumentTokenArr = new Set(instrumentTokenArr)
        }

        let filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.instrument_token)));
        if (indexData?.length > 0) {
          socket.emit('index-tick', indexData)
        }


        if (filteredTicks.length > 0) {
          io.to(`${userId}`).emit('tick-room', filteredTicks);
        }

        filteredTicks = null;
        ticks = null;
        indexData = null;
        instrumentTokenArr = null;
        instruments = null;

      } catch (err) {
        // console.log(err)
      }
    });
  } catch (e) {
    console.log(e)
  }

}

const getTicksForCompanySide = async (socket) => {
  ticker.on('ticks', async (ticks) => {
    try {
      socket.emit('tick', ticks);
      ticks = null;
    } catch (err) {
      console.log(err)
    }
  });
}

const onError = ()=>{
    ticker?.on('error', (error)=>{
      console.log(error);
    });
}

const onOrderUpdate = ()=>{
  // ticker.on("order_update", onTrade)
  ticker.on('order_update', (orderUpdate)=>{
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

      if(status === "COMPLETE" || status === "REJECTED"){
        RetreiveOrder.findOne({order_id : order_id, guid: guid})
        .then((dataExist)=>{
          if(dataExist ){
              return;
          }

          const retreiveOrder = new RetreiveOrder({order_id, status, average_price, quantity, product, transaction_type, exchange_order_id, order_timestamp, variety, 
              validity, exchange, exchange_timestamp, order_type, price, 
              filled_quantity, pending_quantity, cancelled_quantity, 
              guid, market_protection, disclosed_quantity, tradingsymbol, 
              placed_by, status_message, status_message_raw, 
              instrument_token, exchange_update_timestamp, account_id});
              
          // console.log("retreiveOrder", retreiveOrder._id, retreiveOrder.status, retreiveOrder.order_id)
          retreiveOrder.save().then(async ()=>{
              // await subscribeTokens();
              // res.status(201).json({massage : "data enter succesfully"});
          }).catch((err)=> console.log( "failed to enter data"));
          
    

        }).catch(err => {console.log("fail company live data saving")});
      }

  });
}


const getTicker = () => ticker;
module.exports = {createNewTicker, disconnectTicker, subscribeTokens, getTicker, getTicks, onError, unSubscribeTokens, onOrderUpdate, subscribeSingleToken, getTicksForUserPosition, getDummyTicks, getTicksForCompanySide };