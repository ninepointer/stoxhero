const express = require("express");
const router = express.Router();
const axios = require('axios');
require("../../../db/conn");
// const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const Instrument = require("../../../models/Instruments/instrumentSchema");
// const InstrumentMapping = require("../models/AlgoBox/instrumentMappingSchema");
// const ContestInstrument = require("../models/Instruments/contestInstrument");
// const client = require("../marketData/redisClient")
const {xtsAccountType} = require("../../../constant");
const fetchXTSData = require("./fetchXTSToken");



router.get("/getliveprice", async (req, res)=>{

  

    const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType});

    // const ans = await Instrument.find({status: "Active", accountType: xtsAccountType});
    
    // console.log("in live price 3", ans)


    let instruments = await fetchXTSData();
    // ans.forEach((elem) => {
    //     instruments.push({
    //         exchangeSegment: elem.exchangeSegment,
    //         exchangeInstrumentID: elem.instrumentToken
    //     })
    // });

    // console.log("in live price", instruments)
    let url = `http://14.142.188.188:23000/apimarketdata/instruments/quotes`;
    let token = accessToken[0]?.accessToken;
  
    let authOptions = {
      headers: {
        Authorization: token,
      },
    };

    let body = {
        instruments: instruments,
        xtsMessageCode: 1502,
        publishFormat: "JSON"
    }
  
    let arr = [];
      try{

        const response = await axios.post(url, body, authOptions)
        let marketData = response.data?.result?.listQuotes;

        for (let instrument of marketData) {
            instrument = JSON.parse(instrument);
            console.log(instrument.Touchline, instrument)
            let obj = {};
            obj.last_price = instrument.Touchline.LastTradedPrice;
            obj.instrument_token = instrument.ExchangeInstrumentID;
            obj.average_price = instrument.Touchline.AverageTradedPrice;
            obj.timestamp = new Date(instrument.ExchangeTimeStamp),
            obj.change = instrument.Touchline.PercentChange
            arr.push(obj);
        }
        return res.status(201).send((arr));
  
      } catch (err){
        console.log(err)
        return res.status(422).json({error : "Failed to send data"});
    }  
})

module.exports = router;


// [
//   {
//     "type": "success",
//     "code": "s-quotes-0001",
//     "description": "Get quotes successfully!",
//     "result": {
//       "mdp": 1502,
//       "quoteList": {
//         "exchangeSegment": 1,
//         "exchangeInstrumentID": 2885
//       },
//       "listQuotes": "{\"MessageCode\":1502,\"MessageVersion\":4,\"ApplicationType\":0,\"TokenID\":0,\"ExchangeSegment\":1,\"ExchangeInstrumentID\":2885,\"ExchangeTimeStamp\":1317900958,\"Bids\":[{\"Size\":120,\"Price\":2558.9,\"TotalOrders\":3,\"BuyBackMarketMaker\":0},{\"Size\":21,\"Price\":2558.8,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":25,\"Price\":2558.7,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":2,\"Price\":2558.65,\"TotalOrders\":2,\"BuyBackMarketMaker\":0},{\"Size\":25,\"Price\":2558.55,\"TotalOrders\":1,\"BuyBackMarketMaker\":0}],\"Asks\":[{\"Size\":42,\"Price\":2559,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":154,\"Price\":2559.25,\"TotalOrders\":4,\"BuyBackMarketMaker\":0},{\"Size\":5,\"Price\":2559.3,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},{\"Size\":33,\"Price\":2559.4,\"TotalOrders\":2,\"BuyBackMarketMaker\":0},{\"Size\":198,\"Price\":2559.45,\"TotalOrders\":1,\"BuyBackMarketMaker\":0}],\"Touchline\":{\"BidInfo\":{\"Size\":120,\"Price\":2558.9,\"TotalOrders\":3,\"BuyBackMarketMaker\":0},\"AskInfo\":{\"Size\":42,\"Price\":2559,\"TotalOrders\":1,\"BuyBackMarketMaker\":0},\"LastTradedPrice\":2559,\"LastTradedQunatity\":3,\"TotalBuyQuantity\":150573,\"TotalSellQuantity\":356995,\"TotalTradedQuantity\":1458511,\"AverageTradedPrice\":2560.5,\"LastTradedTime\":1317900958,\"LastUpdateTime\":1317900958,\"PercentChange\":0.11149580423683858,\"Open\":2555.1,\"High\":2573.15,\"Low\":2551.1,\"Close\":2556.15,\"TotalValueTraded\":null,\"BuyBackTotalBuy\":0,\"BuyBackTotalSell\":0},\"BookType\":1,\"XMarketType\":1,\"SequenceNumber\":555886964773282}"
//     }
//   }
// ]
