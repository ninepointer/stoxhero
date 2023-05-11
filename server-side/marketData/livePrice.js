const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const ContestInstrument = require("../models/Instruments/contestInstrument");
const client = require("../marketData/redisClient")



router.get("/getliveprice", async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // let getApiKey, getAccessToken;

  const apiKey = await Account.find({status: "Active"});
  const accessToken = await RequestToken.find({status: "Active"});
  let getApiKey, getAccessToken;
  for(let elem of accessToken){
      for(let subElem of apiKey){
          if(elem.accountId === subElem.accountId ){
              getAccessToken = elem.accessToken;
              getApiKey = subElem.apiKey
          }
      }
    }


//   if(await client.exists(`kiteCredToday:${process.env.PROD}`)){
//     let credentials = await client.get(`kiteCredToday:${process.env.PROD}`)
//     credentials = JSON.parse(credentials);
//     getAccessToken = credentials.getAccessToken;
//     getApiKey = credentials.getApiKey
// } else{

//     const apiKey = await Account.find({status: "Active"});
//     const accessToken = await RequestToken.find({status: "Active"});
//     // console.log("accessToken", accessToken);
//     console.log("in kite cred")

//     for(let elem of accessToken){
//         for(let subElem of apiKey){
//             //  console.log("inside 2");
//             if(elem.accountId === subElem.accountId ){
//                 getAccessToken = elem.accessToken;
//                 getApiKey = subElem.apiKey
//             }
//         }
//         }

//     try{
//         await client.set(`kiteCredToday:${process.env.PROD}`, JSON.stringify({getApiKey, getAccessToken}))
//     }catch(e){
//         console.log(e);
//     }
    
// }




    const ans = await Instrument.find({status: "Active"});
    const contestInstrument = await ContestInstrument.find({status: "Active"});
    const resp2 = await InstrumentMapping.find({Status: "Active"})
    // let ans = resp.filter((elem) => {
    //   return elem.status === 'Active'
    // });
    
    let addUrl;
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      } else {
        addUrl += ('&i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      }
    });

    contestInstrument.forEach((elem, index) => {
      // if (index === 0) {
      //   addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      // } else {
      // }
      addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);

    });

    // resp2.forEach((elem, index) => {
    //   // console.log(addUrl)
    //   addUrl += ('&i=' + elem.incomingInstrumentExchange + ':' + elem.InstrumentNameIncoming + '&i=' + elem.outgoingInstrumentExchange + ':' + elem.InstrumentNameOutgoing);
    // });

    let url = `https://api.kite.trade/quote?${addUrl}`;
    const api_key = getApiKey; 
    const access_token = getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
  
    let authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };
  
    let arr = [];
      try{

        const response = await axios.get(url, authOptions);
        for (let instrument in response.data.data) {
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            obj.average_price = response.data.data[instrument].ohlc.close;
            obj.timestamp = response.data.data[instrument].timestamp
            arr.push(obj);
        }
        return res.status(201).send((arr));
  
      } catch (err){
        console.log(err)
        return res.status(422).json({error : "Failed to send data"});
    }  
  
})

module.exports = router;


[
  {
    "type": "success",
    "code": "s-quotes-0001",
    "description": "Get quotes successfully!",
    "result": {
      "mdp": 1502,
      "quoteList": {
        "exchangeSegment": 1,
        "exchangeInstrumentID": 2885
      },
      "listQuotes": "{\"MessageCode\":1502,\"MessageVersion\":4,\"ApplicationType\":0,\"TokenID\":0,\"ExchangeSegment\":1,\"ExchangeInstrumentID\":2885,\"ExchangeTimeStamp\":1317900958,\"Bids\":[{\"Size\":120,\"Price\":2558.9,\"TotalOrders\":3,\"BuyBackMarketMaker\":0},{\"Size\":21,\"Price\":2558.8,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":25,\"Price\":2558.7,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":2,\"Price\":2558.65,\"TotalOrders\":2,\"BuyBackMarketMaker\":0},{\"Size\":25,\"Price\":2558.55,\"TotalOrders\":1,\"BuyBackMarketMaker\":0}],\"Asks\":[{\"Size\":42,\"Price\":2559,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":154,\"Price\":2559.25,\"TotalOrders\":4,\"BuyBackMarketMaker\":0},{\"Size\":5,\"Price\":2559.3,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":33,\"Price\":2559.4,\"TotalOrders\":2,\"BuyBackMarketMaker\":0},{\"Size\":198,\"Price\":2559.45,\"TotalOrders\":1,\"BuyBackMarketMaker\":0}],\"Touchline\":{\"BidInfo\":{\"Size\":120,\"Price\":2558.9,\"TotalOrders\":3,\"BuyBackMarketMaker\":0},\"AskInfo\":{\"Size\":42,\"Price\":2559,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},\"LastTradedPrice\":2559,\"LastTradedQunatity\":3,\"TotalBuyQuantity\":150573,\"TotalSellQuantity\":356995,\"TotalTradedQuantity\":1458511,\"AverageTradedPrice\":2560.5,\"LastTradedTime\":1317900958,\"LastUpdateTime\":1317900958,\"PercentChange\":0.11149580423683858,\"Open\":2555.1,\"High\":2573.15,\"Low\":2551.1,\"Close\":2556.15,\"TotalValueTraded\":null,\"BuyBackTotalBuy\":0,\"BuyBackTotalSell\":0},\"BookType\":1,\"XMarketType\":1,\"SequenceNumber\":555886964773282}"
    }
  }
]
