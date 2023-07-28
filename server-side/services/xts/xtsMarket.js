let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;
let XtsMarketDataWS = require('xts-marketdata-api').WS;
const socketIoClient = require("socket.io-client");
const StockIndex = require("../../models/StockIndex/stockIndexSchema");
const User = require("../../models/User/userDetailSchema");
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema");
const {xtsAccountType} = require("../../constant");
const fetchXTSToken = require("./xtsHelper/fetchXTSToken");
const {client, isRedisConnected} = require("../../marketData/redisClient");
const io = require('../../marketData/socketio');
const {save} = require("./xtsHelper/saveXtsCred");
const { ObjectId } = require('mongodb');

let xtsMarketDataWS ;
let xtsMarketDataAPI ;
let filteredTicks = [];
let companyTicks = [];
const xtsMarketLogin = async ()=>{
    xtsMarketDataAPI = new XtsMarketDataAPI(
      process.env.MARKETDATA_URL
    );

    xtsMarketDataWS = new XtsMarketDataWS(
      process.env.MARKETDATA_URL
    );
    // console.log("xtsMarketDataAPI", xtsMarketDataAPI)
    let loginRequest = {
        secretKey: process.env.MARKETDATA_SECRET_KEY,
        appKey: process.env.MARKETDATA_APP_KEY,
    };
    
    try{
      (async ()=>{
        // console.log(loginRequest, process.env.MARKETDATA_URL)
        let logIn = await xtsMarketDataAPI.logIn(loginRequest);
        console.log(logIn)
        let socketInitRequest = {
            userID: process.env.XTS_USERID,
            publishFormat: 'JSON',
            broadcastMode: 'Full',
            token: logIn?.result?.token
          };
        xtsMarketDataWS.init(socketInitRequest);
  
        xtsMarketDataWS.onConnect((connectData) => {
          // console.log("socket connection", connectData);
        });
  
        xtsMarketDataWS.onJoined((joinedData) => {
          // console.log("joinedData", joinedData);
        });
  
        if(process.env.PROD === "true"){
          await save(logIn?.result?.userID, logIn?.result?.token, "Market")
        }
        await save(logIn?.result?.userID, logIn?.result?.token, "Market")

      
    })();
    } catch(err){
      console.log(err)
    }

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
    xtsMessageCode: 1502,
  });
  let response4 = await xtsMarketDataAPI.subscription({
    instruments: token,
    xtsMessageCode: 1512,
  });
  // console.log("subscription info", response4);
}

const subscribeSingleXTSToken = async(instrumentToken, exchangeSegment) => {
  // console.log(exchangeSegment)
  let response3 = await xtsMarketDataAPI.subscription({
    instruments: [
      {
        exchangeSegment: exchangeSegment,
        exchangeInstrumentID: instrumentToken,
      }
    ],
    xtsMessageCode: 1512,
  });

  let response4 = await xtsMarketDataAPI.subscription({
    instruments: [
      {
        exchangeSegment: exchangeSegment,
        exchangeInstrumentID: instrumentToken,
      }
    ],
    xtsMessageCode: 1502,
  });
  // console.log(response3)
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

  let response3 = await xtsMarketDataAPI.subscription({
    instruments: [
      {
        exchangeSegment: exchangeSegment,
        exchangeInstrumentID: instrumentToken,
      }
    ],
    xtsMessageCode: 1512,
  });
}

const getXTSTicksForCompanySide = async (socket) => {

  await emitCompanyTicks(socket);
  xtsMarketDataWS.onMarketDepthEvent((ticksObj) => {
    // console.log(ticksObj)
    let Obj = {};
    // if (ticksObj.ExchangeInstrumentID == marketDepth.ExchangeInstrumentID) {
      // console.log("tick", ticksObj.ExchangeInstrumentID)
      Obj.last_price = ticksObj.Touchline.LastTradedPrice;
      Obj.instrument_token = ticksObj.ExchangeInstrumentID;
      Obj.change = ticksObj.Touchline.PercentChange;
      Obj.ExchangeInstrumentID = ticksObj.ExchangeInstrumentID;
      Obj.ExchangeSegment = ticksObj.ExchangeSegment;
    
      const instrumentMap = new Map(companyTicks?.map(instrument => [instrument.ExchangeInstrumentID, instrument]));
      if (instrumentMap.has(Obj.ExchangeInstrumentID)) {
        const existingInstrument = instrumentMap.get(Obj.ExchangeInstrumentID);
        Object.assign(existingInstrument, Obj);
      } else {
        instrumentMap.set(Obj.ExchangeInstrumentID, Obj);
      }
      companyTicks = Array.from(instrumentMap.values());
  });

}

const getXTSTicksForUserPosition = async (socket, id) => {

  let ticks = [];
  // let marketDepth = {};
  let indecies = await client.get("index")
  if(!indecies){
    indecies = await StockIndex.find({status: "Active", accountType: xtsAccountType});
    await client.set("index", JSON.stringify(indecies));
  } else{
    indecies = JSON.parse(indecies);  
  }

  // xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
  //   marketDepth = marketDepthData;
  // });
  // let timeoutId = null;
  const userId = await client.get(socket.id)
  await emitTicks(userId);
  xtsMarketDataWS.onMarketDepthEvent(async (ticksObj) => {
    // console.log(ticksObj)
    // ticksObj = JSON.parse(ticksObj);
    let Obj = {};
    // if (ticksObj.ExchangeInstrumentID == marketDepth.ExchangeInstrumentID) {
      // console.log("tick", ticksObj.ExchangeInstrumentID)
      Obj.last_price = ticksObj.Touchline.LastTradedPrice;
      Obj.instrument_token = ticksObj.ExchangeInstrumentID;
      Obj.change = ticksObj.Touchline.PercentChange;
      Obj.ExchangeInstrumentID = ticksObj.ExchangeInstrumentID;
      Obj.ExchangeSegment = ticksObj.ExchangeSegment;
    
      const instrumentMap = new Map(ticks?.map(instrument => [instrument.ExchangeInstrumentID, instrument]));
      if (instrumentMap.has(Obj.ExchangeInstrumentID)) {
        const existingInstrument = instrumentMap.get(Obj.ExchangeInstrumentID);
        Object.assign(existingInstrument, Obj);
      } else {
        instrumentMap.set(Obj.ExchangeInstrumentID, Obj);
      }
      ticks = Array.from(instrumentMap.values());
    // }


    let indexObj = {};
    // populate hash table with indexObj from indecies
    for (let i = 0; i < indecies?.length; i++) {
      indexObj[indecies[i]?.instrumentToken] = true;
    }
    let indexData = [];
    // ticks.filter(function(item) {
    //   return indexObj[item.ExchangeInstrumentID];
    // });

    if(indexObj[ticksObj.ExchangeInstrumentID]){
      Obj.last_price = ticksObj.Touchline.LastTradedPrice;
      Obj.instrument_token = ticksObj.ExchangeInstrumentID;
      Obj.change = ticksObj.Touchline.PercentChange;
      Obj.ExchangeInstrumentID = ticksObj.ExchangeInstrumentID;
      Obj.ExchangeSegment = ticksObj.ExchangeSegment;
      indexData.push(Obj)
    }

    // console.log("indexData", indexData)


    try{
      let instrumentTokenArr ;
      // let userId = await client.get(socket.id)
      if(await client.exists((userId).toString())){
        let instruments = await client.SMEMBERS((userId).toString())
        // instruments = JSON.parse(instruments);
        const parsedInstruments = instruments.map(jsonString => JSON.parse(jsonString));
        instrumentTokenArr = new Set();

        parsedInstruments.forEach(obj => {
          instrumentTokenArr.add(obj.instrumentToken);
          instrumentTokenArr.add(obj.exchangeInstrumentToken);
        });
        // instrumentTokenArr = new Set([parsedInstruments.instrumentToken, parsedInstruments.exchangeInstrumentToken])

        // console.log(instrumentTokenArr, parsedInstruments)
      } else{
        // console.log("in else part")
        instrumentTokenArr = [];
        const user = await User.findById(new ObjectId(id))
        .populate('watchlistInstruments')
  
        for(let i = 0; i < user.watchlistInstruments.length; i++){
          instrumentTokenArr.push(user.watchlistInstruments[i].instrumentToken);
          instrumentTokenArr.push(user.watchlistInstruments[i].exchangeInstrumentToken);
        }
        instrumentTokenArr = new Set(instrumentTokenArr)
      }

      // console.log("tick", ticks.instrument_token)
      filteredTicks = ticks.filter((tick) => {
        
        return instrumentTokenArr.has(tick.instrument_token)
      })
      // console.log("filteredTicks", filteredTicks)
      if (indexData && indexData.length > 0) {
        socket.emit('index-tick', indexData);
      }
    

      indexData = [];
      instrumentTokenArr = [];

    } catch (err){
      console.log(err)
    }
  });
}


const emitTicks = async (userId) => {
  let intervalId;
  if (intervalId) {
    clearInterval(intervalId);
  }

  // console.log("Will emit filteredTicks in 2 seconds...");
  intervalId = setInterval(() => {
    if (filteredTicks && filteredTicks.length > 0) {
      io.to(`${userId}`).emit("tick-room", filteredTicks);
      filteredTicks = [];
    }
  }, 1000);
};


const emitCompanyTicks = async(socket)=>{
  let timeoutId;
  if(timeoutId){
    clearTimeout(timeoutId)
  }
  timeoutId = setInterval(() => {
    if (companyTicks && companyTicks.length > 0) {
      socket.emit('tick', companyTicks);
      companyTicks = [];
    }
  }, 1000);
}

const tradableInstrument = async(req, res)=>{
  let response = await xtsMarketDataAPI.searchInstrument({
    searchString: 'BAN',
    // searchString: 'NIF',
    source: "WEBAPI",
  });

  res.send(response)
  // console.log(response.result);
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
      // console.log("docs", docs)
      const tradableInstrument = await TradableInstrument.create(docs);
      // console.log(tradableInstrument)
    }
  }

}


module.exports = {xtsMarketLogin, getInstrument, onDisconnect, 
  tradableInstrument, subscribeInstrument, getXTSTicksForUserPosition,
  unSubscribeXTSToken, subscribeSingleXTSToken, getXTSTicksForCompanySide };
