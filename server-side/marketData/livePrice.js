const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const Instrument = require("../models/Instruments/instrumentSchema");
const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
const ContestInstrument = require("../models/Instruments/contestInstrument");
const {client, getValue} = require("../marketData/redisClient")



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


//, contractDate: new Date("2023-05-25T00:00:00.000Z")

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

    // contestInstrument.forEach((elem, index) => {
    //   // if (index === 0) {
    //   //   addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
    //   // } else {
    //   // }
    //   addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);

    // });

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
        // console.log(url, authOptions)
        const response = await axios.get(url, authOptions);
        // console.log(response.data)
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

