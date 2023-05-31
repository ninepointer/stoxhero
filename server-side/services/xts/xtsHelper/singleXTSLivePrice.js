const axios = require('axios');
// const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const {xtsAccountType} = require("../../../constant");

async function singleXTSLivePrice (exchangeSegment, instrumentToken){
    // let date = new Date();
    // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // todayDate = todayDate + "T00:00:00.000Z";
    // const today = new Date(todayDate);
    // const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType});

    let url = `http://14.142.188.188:23000/apimarketdata/instruments/quotes`;
    let token = accessToken[0].accessToken;
  
    let authOptions = {
      headers: {
        Authorization: token,
      },
    };

    let body = {
        instruments: [{
            exchangeSegment: exchangeSegment,
            exchangeInstrumentID: instrumentToken
        }],
        xtsMessageCode: 1502,
        publishFormat: "JSON"
    }
  
    let arr = [];
      try{

        const response = await axios.post(url, body, authOptions)
        let marketData = response.data?.result?.listQuotes;

        for (let instrument of marketData) {
            instrument = JSON.parse(instrument);
            // console.log(instrument.Touchline, instrument)
            let obj = {};
            obj.last_price = instrument.Touchline.LastTradedPrice;
            obj.instrument_token = instrument.ExchangeInstrumentID;
            obj.average_price = instrument.Touchline.AverageTradedPrice;
            obj.timestamp = new Date(instrument.ExchangeTimeStamp),
            obj.change = instrument.Touchline.PercentChange
            arr.push(obj);
        }
        return arr;
  
      } catch (err){
        console.log(err)
        return res.status(422).json({error : "Failed to send data"});
    }
  

}

module.exports = singleXTSLivePrice;