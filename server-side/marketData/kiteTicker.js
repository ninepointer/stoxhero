const kiteTicker = require('kiteconnect').KiteTicker;
const fetchToken = require('./fetchToken');
// const getKiteCred = require('./getKiteCred');
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
    // console.log("indecies", indecies.length)
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

      for(let elem in (userTickObj)){
        io.to(`${elem}`).emit('tick-room', userTickObj[elem]);
      }
      // console.log(indexData.length)
      if (indexData?.length > 0) {
        io.emit('index-tick', indexData)
      }

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


const getDummyTicks = async (socket) => {
  const io = getIOValue();
  let userId = await client.get(socket.id);
  let filteredTicks = await DummyMarketData(socket);
  io.to(userId).emit('tick-room-test', filteredTicks);
}

// const getTicksForUserPosition = async (socket, id) => {
//   const io = getIOValue();
//   let isRedisConnected = getValue();
//   let indecies = isRedisConnected && await client.get("index");

//   if (!indecies) {
//     indecies = await StockIndex.find({ status: "Active", accountType: zerodhaAccountType });
//     isRedisConnected && await client.set("index", JSON.stringify(indecies));
//   } else {
//     indecies = JSON.parse(indecies);
//   }


//   try {
//     ticker?.on('ticks', async (ticks) => {
//       /*
//       1. ticks array []
//       2. loop lgake instrument fetch kiya and instrunment 1000000, 1111111
//       3. userid ke array pe loop lgake [1,2,3], [1, 4, 6]
//       4. loop on user
//       5. [{1000000}]

//       1. for loop on ticks O(n)
//       2. fetch users against instruments O(1). {instrument_1: [users], instrument_2: [users]}
//       3. for loop on users O(n)
//       4. push ticks against user in array. {userId_1: [ticks_1], userId_2: [ticks_2]}
//       5. for loop in object of userIds and emit event. O(n)

//       so i want to do that in event haldler ticker.on

//       1. apply for loop on ticks
//       2. fetch userIds from an object which key is instrument and value is array of userIds
//       3. apply loop on userIds, and store tick object in array like this {userId_1: [ticks_1, ticks_2....], userId_2: [ticks_1, ticks_2....]}
//       4. finally itrate above userId and tick object and sending ticks to respective userid
//       like this io.to(`${userId}`).emit('tick-room', [ticks_1, ticks_2....]);

// O(n^2)

//       2nd approach
//       1. fetch users from redis array
//       2. users ke instrument extrzted from redis
//       3. extracted instruments ko ticks pe loop lgake bhejna h
//       */
//       let indexObj = {};
//       // populate hash table with indexObj from indecies
//       for (let i = 0; i < indecies?.length; i++) {
//         indexObj[indecies[i]?.instrumentToken] = true;
//       }
//       // filter ticks using hash table lookups
//       let indexData = ticks.filter(function (item) {
//         return indexObj[item.instrument_token];
//       });


//       try {
//         let instrumentTokenArr;
//         let userId = isRedisConnected && await client.get(socket.id);

//         if (isRedisConnected && (await client.exists(`${(id)?.toString()}allInstrument`) || await client.exists(`${(id)?.toString()}`))) {
//           let instruments = await client.SMEMBERS(`${(id)?.toString()}allInstrument`) || await client.exists(`${(id)?.toString()}`)
//           const parsedInstruments = instruments.map(jsonString => JSON.parse(jsonString));
//           instrumentTokenArr = new Set();

//           parsedInstruments.forEach(obj => {
//             if (obj) {
//               instrumentTokenArr.add(obj.instrumentToken);
//               instrumentTokenArr.add(obj.exchangeInstrumentToken);
//             }
//           });

//         } else {
//           const user = await User.findById({ _id: new ObjectId(id) })
//             .populate('allInstruments', 'instrumentToken exchangeInstrumentToken')
//             .select('allInstruments')

//           userId = user._id;
//           instrumentTokenArr = [];
//           for (let i = 0; i < user.allInstruments.length; i++) {

//             instrumentTokenArr.push(user.allInstruments[i].instrumentToken);
//             instrumentTokenArr.push(user.allInstruments[i].exchangeInstrumentToken);
//             let obj = {
//               instrumentToken: user.allInstruments[i].instrumentToken,
//               exchangeInstrumentToken: user.allInstruments[i].exchangeInstrumentToken
//             }

//             const newredisClient = await client.SADD(`${(user._id)?.toString()}allInstrument`, JSON.stringify(obj));
//             const newredis = await client.SADD(`${(user._id)?.toString()}`, JSON.stringify(obj));
//           }

//           if (!instrumentTokenArr.length) {
//             const newredisClient = await client.SADD(`${(user._id)?.toString()}allInstrument`, JSON.stringify({}));
//             const newredis = await client.SADD(`${(user._id)?.toString()}`, JSON.stringify({}));
//           }
//           instrumentTokenArr = new Set(instrumentTokenArr)
//         }

//         let filteredTicks = ticks.filter(tick => instrumentTokenArr.has((tick.instrument_token)));
//         if (indexData?.length > 0) {
//           socket.emit('index-tick', indexData)
//         }

//         if (filteredTicks.length > 0) {
//           io.to(`${userId}`).emit('tick-room', filteredTicks);
//         }

//         filteredTicks = null;
//         ticks = null;
//         indexData = null;
//         instrumentTokenArr = null;
//         instruments = null;

//       } catch (err) {
//         console.log(err)
//       }
//     });
//   } catch (e) {
//     console.log(e)
//   }

// }

// const getTicksForCompanySide = async (socket) => {
//   ticker?.on('ticks', async (ticks) => {
//     try {
//       socket?.emit('tick', ticks);
//       let data = await client.get('stoploss-stopprofit');
//       data = JSON.parse(data);

//       // console.log("this is data", data)
//       if (data) {
//         for (let tick of ticks) {

//           let symbolArr = data[`${tick.instrument_token}`];
//           // console.log("this is symbolArr", symbolArr, Boolean(symbolArr))
//           try {
//             if (symbolArr?.length > 0) {
//               // for(let subelem of symbolArr){
//               const length = symbolArr?.length
//               for (let i = 0; i < length; i++) {
//                 // publish(take trade) only when 
//                 if (symbolArr[i]?.type === "StopLoss" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
//                   console.log("1st if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }
//                 if (symbolArr[i]?.type === "StopLoss" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
//                   console.log("2nd if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }
//                 if (symbolArr[i]?.type === "StopProfit" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
//                   console.log("3rd if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }
//                 if (symbolArr[i]?.type === "StopProfit" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
//                   console.log("4th if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }
//                 if (symbolArr[i]?.type === "Limit" && symbolArr[i]?.price >= tick.last_price && symbolArr[i]?.buyOrSell === "BUY") {
//                   console.log("5th if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }
//                 if (symbolArr[i]?.type === "Limit" && symbolArr[i]?.price <= tick.last_price && symbolArr[i]?.buyOrSell === "SELL") {
//                   console.log("6th if running")
//                   await client.PUBLISH("place-order", JSON.stringify({ data: symbolArr[i], ltp: tick.last_price, index: i }))
//                 }

//               }
//             }
//           } catch (err) {
//             console.log(err);
//           }
//         }
//       }

//       ticks = null;
//     } catch (err) {
//       console.log(err)
//     }
//   });
// }

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
module.exports = { createNewTicker, disconnectTicker, subscribeTokens, getTicker, onError, unSubscribeTokens, subscribeWatchListInstrument, 
  // getTicksForUserPosition, 
  getDummyTicks, 
  // getTicksForCompanySide
 };


















