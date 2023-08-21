const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../db/conn");
const Instrument = require("../models/Instruments/instrumentSchema");
const InfinityInstrument = require("../models/Instruments/infinityInstrument");
const StockIndex = require("../models/StockIndex/stockIndexSchema");
const getKiteCred = require('./getKiteCred'); 



router.get("/getliveprice", async (req, res)=>{

  getKiteCred.getAccess().then(async (data) => {
    let {getApiKey, getAccessToken} = data;
    const infinityInstrument = await InfinityInstrument.find({status: "Active"});
    const ans = await Instrument.find({status: "Active"});
    const stockIndex = await StockIndex.find({status: "Active"});
    
    let addUrl;
    ans.forEach((elem, index) => {
      if (index === 0) {
        addUrl = ('i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      } else {
        addUrl += ('&i=' + elem.exchange + ':' + elem.symbol + '&i=' + elem.exchange + ':' + elem.otm);
      }
    });


    infinityInstrument.forEach((elem, index) => {
      addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);
    });

    stockIndex.forEach((elem, index) => {
      addUrl += ('&i=' + "NSE" + ':' + elem.instrumentSymbol);
    });

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
  });
})

module.exports = router;


