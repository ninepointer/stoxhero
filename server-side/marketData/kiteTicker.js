const kiteTicker = require('kiteconnect').KiteTicker;
const fetchToken = require('./fetchToken');
const getKiteCred = require('./getKiteCred');
// const RetreiveOrder = require("../models/TradeDetails/retreiveOrder")
const StockIndex = require("../models/StockIndex/stockIndexSchema");
// const ContestInstrument = require("../models/Instruments/contestInstrument");
const { DummyMarketData } = require("./dummyMarketData")
// const User = require("../models/User/userDetailSchema")
const { getIOValue } = require('../marketData/socketio');
const { client, getValue } = require("./redisClient");
// const { ObjectId } = require('mongodb');
const { zerodhaAccountType } = require("../constant");
const Instrument = require("../models/Instruments/instrumentSchema");
let { client6 } = require("../marketData/redisClient");
const {equityInstrumentArray} = require('../controllers/TradableInstrument/searchInstrument')
const axios = require('axios');
let ticker;
client6.connect().then(()=>{});

const createNewTicker = async (api_key, access_token) => {

  console.log("createNewTicker");

  ticker = new kiteTicker({
    api_key,
    access_token
  });

  try {
    await ticker?.connect();
    await ticker?.autoReconnect(true, 10000000000, 5);
    await subscribeTokens();
    // await getDummyTicks();
    await ticksData();

    await client6.SUBSCRIBE("subscribe-single-token", async (instruemnt) => {
      instruemnt = JSON.parse(instruemnt);
      ticker?.subscribe([Number(instruemnt?.instrumentToken)]);
      ticker?.setMode(ticker?.modeQuote, [Number(instruemnt?.instrumentToken)]);  
    })
    
    return ticker;
  } catch (error) {
    console.error('Error creating ticker:', error);
    throw error;
  }
}

const ticksData = async () => {
  const io = getIOValue();
  try{
    let indexObj = {};
    const indecies = await index();
    // populate hash table with indexObj from indecies
    for (let i = 0; i < indecies?.length; i++) {
      indexObj[indecies[i]?.instrumentToken] = true;
    }
    ticker?.on('ticks', async (ticks) => {
      const users = await instrumentAndUser();
      const indexData = ticks.filter(function (item) {
        return indexObj[item.instrument_token];
      });
  
      let userTickObj = {};
      for(let tick of ticks){
        const userIds = users[tick.instrument_token] || [];
        for(let subelem of userIds){
          userTickObj[subelem] = userTickObj[subelem] || [];
          userTickObj[subelem].push(tick);
        }
      }

      const equity = ticks.filter((elem)=>{
        return equityInstrumentArray.includes(elem.instrument_token);
      })

      for(let elem in (userTickObj)){
        io.to(`${elem}`).emit('tick-room', userTickObj[elem]);
      }
      // console.log(indexData.length)
      if (indexData?.length > 0) {
        io.emit('index-tick', indexData)
      }

      io?.to(`${'equity'}`).emit('equity-ticks', equity);
      io?.to(`${'company-side'}`).emit('tick', ticks);

      await pendingOrderProcess(ticks);
      userTickObj={};
      ticks=[];
  
    })
  } catch(err){
    console.log(err)
  }

}

const disconnectTicker = () => {
  console.log('disconnecting ticker');
  ticker?.disconnect();
}

const subscribeTokens = async () => {
  let tokens = await fetchToken();
  ticker?.subscribe(tokens);
  ticker?.setMode(ticker?.modeQuote, tokens);
}

const subscribeWatchListInstrument = async () => {
  let token = [];
  if (await client.exists(`all-token`)) {
    token = JSON.parse(await client.get('all-token'));
  } else {
    token = await fetchToken();
    await client.set('all-token', JSON.stringify(token));
  }

  ticker?.subscribe(token);
  ticker?.setMode(ticker?.modeQuote, token);

}

const unSubscribeTokens = async (token) => {
  let tokens = [];
  tokens?.push(token)
  let x = ticker?.unsubscribe(tokens);
}

const getDummyTicks = async (id) => {
  const io = getIOValue();
  // let userId = await client.get(id.id);
  let filteredTicks = await DummyMarketData(id);
  io.to(id.toString()).emit('tick-room', filteredTicks);
}

const tempGetTicks = async (id) => {
  const io = getIOValue();
  getKiteCred.getAccess().then(async (data) => {
    let {getApiKey, getAccessToken} = data;
    const stockIndex = await StockIndex.find({status: "Active"});
    
    let addUrl;
    stockIndex.forEach((elem, index) => {
      if (index === 0) {
        addUrl = ('i=' + elem.exchange + ':' + elem.instrumentSymbol);
      } else {
        addUrl += ('&i=' + elem.exchange + ':' + elem.instrumentSymbol);
      }
    });

    let url = `https://api.kite.trade/quote/ohlc?${addUrl}`;
    const api_key = getApiKey; 
    const access_token = getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
  
    let authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };
  // console.log(url, authOptions);
    let arr = [];
      try{
        const response = await axios.get(url, authOptions);
        
        for (let instrument in response.data.data) {
          // console.log("response", response.data.data[instrument])
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            obj.average_price = response.data.data[instrument].last_price;
            obj.timestamp = new Date();
            obj.change = (response.data.data[instrument].last_price - response.data.data[instrument].ohlc.close)*100/response.data.data[instrument].ohlc.close;
            arr.push(obj);
        }
  
        // console.log("Arr", arr)
        io.emit('index-tick', arr);

      } catch (err){
        console.log(err)
    }  
  });
}

async function pendingOrderProcess(ticks) {
  try {
    let data = await client.get('stoploss-stopprofit');
    data = JSON.parse(data);

    // console.log("this is data", data)
    if (data) {
      for (let tick of ticks) {

        let symbolArr = data[`${tick.instrument_token}`];
        // console.log("this is symbolArr", symbolArr, Boolean(symbolArr))
        try {
          if (symbolArr?.length > 0) {
            // for(let subelem of symbolArr){
            const length = symbolArr?.length
            for (let i = 0; i < length; i++) {
              // publish(take trade) only when 
              if (symbolArr[i]?.type === "StopLoss" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
                console.log("1st if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }
              if (symbolArr[i]?.type === "StopLoss" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
                console.log("2nd if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }
              if (symbolArr[i]?.type === "StopProfit" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
                console.log("3rd if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }
              if (symbolArr[i]?.type === "StopProfit" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
                console.log("4th if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }
              if (symbolArr[i]?.type === "Limit" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
                console.log("5th if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }
              if (symbolArr[i]?.type === "Limit" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
                console.log("6th if running")
                await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
              }

            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    ticks = null;
  } catch (err) {
    console.log(err)
  }
}

const onError = () => {
  ticker?.on('error', (error) => {
    console.log(error);
  });
}

async function instrumentAndUser(){
  if(await client.exists('instrument-user')){
    const data = JSON.parse(await client.get('instrument-user'));
    return data;
  } else{
    let obj = {};
    const instrument = await Instrument.find({status: "Active"});
    for(let elem of instrument){
      obj[elem.instrumentToken] = elem.users;
    }
    await client.set('instrument-user', JSON.stringify(obj));
    return obj;
  }
}

async function index(){
  let isRedisConnected = getValue();
  let indecies = isRedisConnected && await client.get("index");
  // console.log("indecies redis", indecies);
  if (!indecies) {
    indecies = await StockIndex.find({ status: "Active", accountType: zerodhaAccountType });
    isRedisConnected && await client.set("index", JSON.stringify(indecies));
    return indecies;
  } else {
    indecies = JSON.parse(indecies);
    // console.log("indecies oddfef", indecies)
    return indecies;
  }
}


const getTicker = () => ticker;
module.exports = {tempGetTicks, createNewTicker, disconnectTicker, subscribeTokens, getTicker, onError, unSubscribeTokens, subscribeWatchListInstrument, 
  // getTicksForUserPosition, 
  getDummyTicks, 
  // getTicksForCompanySide
 };


















