let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;
let XtsMarketDataWS = require('xts-marketdata-api').WS;
const socketIoClient = require("socket.io-client");
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema");
const {xtsAccountType} = require("../../constant");
const fetchXTSToken = require("./xtsHelper/fetchXTSToken");
const client = require("../../marketData/redisClient");
const io = require('../../marketData/socketio');
const {save} = require("./xtsHelper/saveXtsCred")

let xtsMarketDataWS ;
let xtsMarketDataAPI ;
const data = async ()=>{
    xtsMarketDataAPI = new XtsMarketDataAPI(
      process.env.MARKETDATA_URL
    );

    xtsMarketDataWS = new XtsMarketDataWS(
      process.env.MARKETDATA_URL
    );
    console.log("xtsMarketDataAPI", xtsMarketDataAPI)
    let loginRequest = {
        secretKey: process.env.MARKETDATA_SECRET_KEY,
        appKey: process.env.MARKETDATA_APP_KEY,
    };
    
    (async ()=>{
      console.log(loginRequest, process.env.MARKETDATA_URL)
      let logIn = await xtsMarketDataAPI.logIn(loginRequest);
      console.log(logIn)
      let socketInitRequest = {
          userID: process.env.XTS_USERID,
          publishFormat: 'JSON',
          broadcastMode: 'Full',
          token: logIn.result.token
        };
      xtsMarketDataWS.init(socketInitRequest);

      xtsMarketDataWS.onConnect((connectData) => {
        console.log("socket connection", connectData);
      });

      xtsMarketDataWS.onJoined((joinedData) => {
        console.log("joinedData", joinedData);
      });

      await save(logIn.result.userID, logIn.result.token)
    
  })();
}

const onDisconnect = async()=>{
  xtsMarketDataWS.onDisconnect((disconnect) => {
    console.log("xts socket disconnected", disconnect);
  });
}

const getInstrument = async()=>{
    let response = await xtsMarketDataAPI.searchInstrument({
        searchString: 'NIF',
        source: "WEBAPI",
      });
    
    return (response);
}

const subscribeInstrument = async()=>{
  const token = await fetchXTSToken();
  let response3 = await xtsMarketDataAPI.subscription({
    instruments: token,
    xtsMessageCode: 1512,
  });
  console.log(response3);
}

const subscribeSingleXTSToken = async(instrumentToken, exchangeSegment) => {
  console.log(exchangeSegment)
  let response3 = await xtsMarketDataAPI.subscription({
    instruments: [
      {
        exchangeSegment: exchangeSegment,
        exchangeInstrumentID: instrumentToken,
      }
    ],
    xtsMessageCode: 1512,
  });
  console.log(response3)
}

const unSubscribeXTSToken = async(instrumentToken, exchangeSegment)=>{
  let response = await xtsMarketDataAPI.unSubscription({
    instruments: [
      {
        exchangeSegment: exchangeSegment,
        exchangeInstrumentID: instrumentToken,
      },
    ],
    xtsMessageCode: 1502,
  });
}

const getXTSTicksForUserPosition = async (socket) => {

  let indecies = await client.get("index")
  if(!indecies){
    indecies = await StockIndex.find({status: "Active"});
    await client.set("index", JSON.stringify(indecies));
  } else{
    indecies = JSON.parse(indecies);  
  }

  xtsMarketDataWS.onCandleDataEvent((candleData) => {
    console.log("candle data", candleData);
  });

  xtsMarketDataWS.onLTPEvent(async (ticksObj) => {
    let intervalId;
    if(intervalId){
      clearTimeout(intervalId);
    }
    ticksObj = JSON.parse(ticksObj);
    ticksObj.last_price = ticksObj.LastTradedPrice;
    ticksObj.instrument_token = ticksObj.ExchangeInstrumentID;
 
    let ticks = [];
    ticks.push(ticksObj);
    // console.log(ticks)
    let indexObj = {};
    let now = performance.now();
    // populate hash table with indexObj from indecies
    for (let i = 0; i < indecies?.length; i++) {
      indexObj[indecies[i]?.instrumentToken] = true;
    }
    // filter ticks using hash table lookups
    let indexData = ticks.filter(function(item) {
      return indexObj[item.ExchangeInstrumentID];
    });


    try{
      let userId = await client.get(socket.id)
      // await client.del(userId)
      let instruments = await client.SMEMBERS(userId)
      // console.log(userId, instruments)
      let instrumentTokenArr = new Set(instruments); // create a Set of tokenArray elements
      // console.log(instrumentTokenArr)
      let filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.ExchangeInstrumentID).toString()));
      if (indexData && indexData.length > 0) {
        socket.emit('index-tick', indexData);
      }
      
      // console.log("filteredTicks", filteredTicks);
      // setTimeout(()=>{
        filteredTicks = [...filteredTicks, ...filteredTicks];        
        
        if (filteredTicks.length > 0) {
          io.to(`${userId}`).emit('tick-room', filteredTicks);
        }
      // }, 1000)



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

const tradableInstrument = async(req, res)=>{
  let response = await xtsMarketDataAPI.searchInstrument({
    searchString: 'BAN',
    // searchString: 'NIF',
    source: "WEBAPI",
  });

  res.send(response)
  console.log(response.result);
  let response4 = response.result;
  for(let i = 0; i < response4.length; i++){ //Nifty Bank
    // if(response4[i].UnderlyingIndexName && response4[i].ContractExpiration && response4[i].StrikePrice){
    if(response4[i].UnderlyingIndexName === "Nifty Bank" && response4[i].ContractExpiration && response4[i].StrikePrice){
      const docs = {
        instrument_token: response4[i].ExchangeInstrumentID,
        exchange_token: response4[i].ExchangeInstrumentID,
        tradingsymbol: response4[i].CompanyName,
        name: response4[i].UnderlyingIndexName,
        expiry: response4[i].ContractExpiration,
        strike: response4[i].StrikePrice,
        tick_size: response4[i].TickSize,
        lot_size: response4[i].LotSize,
        instrument_type: response4[i].InstrumentType,
        segment: response4[i].ExchangeSegment,
        exchange: "NFO",
        accountType: xtsAccountType,
        lastModifiedBy: req.user._id,
        createdBy: req.user._id,

      }
      console.log("docs", docs)
      const tradableInstrument = await TradableInstrument.create(docs);
      console.log(tradableInstrument)
    }
  }

}


module.exports = {data, getInstrument, onDisconnect, 
  tradableInstrument, subscribeInstrument, getXTSTicksForUserPosition,
  unSubscribeXTSToken, subscribeSingleXTSToken };
