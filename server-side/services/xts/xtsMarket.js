let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;
let XtsMarketDataWS = require('xts-marketdata-api').WS;
const socketIoClient = require("socket.io-client");
const StockIndex = require("../../models/StockIndex/stockIndexSchema");
const User = require("../../models/User/userDetailSchema");
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema");
const {xtsAccountType} = require("../../constant");
const fetchXTSToken = require("./xtsHelper/fetchXTSToken");
const client = require("../../marketData/redisClient");
const io = require('../../marketData/socketio');
const {save} = require("./xtsHelper/saveXtsCred");
const { ObjectId } = require('mongodb');

let xtsMarketDataWS ;
let xtsMarketDataAPI ;
let filteredTicks = [];
const xtsMarketLogin = async ()=>{
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
    xtsMessageCode: 1502,
  });
  let response4 = await xtsMarketDataAPI.subscription({
    instruments: token,
    xtsMessageCode: 1512,
  });
  console.log("subscription info", response4);
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

  let ticks = [];
  let marketDepth = {};
  let indecies = await client.get("index")
  if(!indecies){
    indecies = await StockIndex.find({status: "Active"});
    await client.set("index", JSON.stringify(indecies));
  } else{
    indecies = JSON.parse(indecies);  
  }

  xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
    marketDepth = marketDepthData;
  });
  // let timeoutId = null;
  let userId = await client.get(socket.id)
  await emitTicks(userId);
  xtsMarketDataWS.onLTPEvent(async (ticksObj) => {
    
    ticksObj = JSON.parse(ticksObj);

    if (ticksObj.ExchangeInstrumentID == marketDepth.ExchangeInstrumentID) {
      ticksObj.last_price = ticksObj.LastTradedPrice;
      ticksObj.instrument_token = ticksObj.ExchangeInstrumentID;
      ticksObj.change = marketDepth.Touchline.PercentChange;
    
      const instrumentMap = new Map(ticks.map(instrument => [instrument.ExchangeInstrumentID, instrument]));
      if (instrumentMap.has(ticksObj.ExchangeInstrumentID)) {
        const existingInstrument = instrumentMap.get(ticksObj.ExchangeInstrumentID);
        Object.assign(existingInstrument, ticksObj);
      } else {
        instrumentMap.set(ticksObj.ExchangeInstrumentID, ticksObj);
      }
      ticks = Array.from(instrumentMap.values());
    }
 

    let indexObj = {};
    // populate hash table with indexObj from indecies
    for (let i = 0; i < indecies?.length; i++) {
      indexObj[indecies[i]?.instrumentToken] = true;
    }
    let indexData = ticks.filter(function(item) {
      return indexObj[item.ExchangeInstrumentID];
    });


    try{
      let instrumentTokenArr = [];
      // let userId = await client.get(socket.id)
      if(await client.exists((userId).toString())){
        let instruments = await client.SMEMBERS((userId).toString())
        instrumentTokenArr = new Set(instruments)
      } else{
        console.log("in else part")
        const user = await User.findById(new ObjectId(userId))
        .populate('watchlistInstruments')
  
        for(let i = 0; i < user.watchlistInstruments.length; i++){
          instrumentTokenArr.push(user.watchlistInstruments[i].instrumentToken);
        }
        instrumentTokenArr = new Set(instrumentTokenArr)
      }

      filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.instrument_token).toString()));

      if (indexData && indexData.length > 0) {
        socket.emit('index-tick', indexData);
      }
      
      // if (filteredTicks.length > 0) {
      //   if (!timeoutId) {
      //     console.log("Will emit filteredTicks in 2 seconds...");
      //     timeoutId = setTimeout(() => {
      //       console.log("Emitting filteredTicks...");
      //       io.to(`${userId}`).emit("tick-room", filteredTicks);
      //       filteredTicks = null;
      //       clearTimeout(timeoutId);
      //       timeoutId = null; // reset timeoutId after executing the callback
      //     }, 1000); // wait for 2 seconds
      //   }
      // }

      indexData = null;
      instrumentTokenArr = null;

    } catch (err){
      console.log(err)
    }
  });
}

const emitTicks = async(userId)=>{
  // if (filteredTicks.length > 0) {
    // if (!timeoutId) {
      console.log("Will emit filteredTicks in 2 seconds...");
      timeoutId = setInterval(() => {
        console.log("Emitting filteredTicks...");
        io.to(`${userId}`).emit("tick-room", filteredTicks);
        filteredTicks = null;
        // clearTimeout(timeoutId);
        // timeoutId = null; // reset timeoutId after executing the callback
      }, 1000); // wait for 2 seconds
    // }
  // }
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


module.exports = {xtsMarketLogin, getInstrument, onDisconnect, 
  tradableInstrument, subscribeInstrument, getXTSTicksForUserPosition,
  unSubscribeXTSToken, subscribeSingleXTSToken };
