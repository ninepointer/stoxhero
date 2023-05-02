const axios = require('axios');
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");

async function singleLivePrice (exchange, symbol){
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active"});
    let getApiKey, getAccessToken;
    for(let elem of accessToken){
        for(let subElem of apiKey){
            if(elem.accountId === subElem.accountId && new Date(elem.generatedOn) > today){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
    }
  
  
      let addUrl = ('i=' + exchange + ':' + symbol);
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
            
        //   const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
          const response = await axios.get(url, authOptions);

          // console.log("response", response.data.data)
          console.log("caseStudy 9: single live")
          for (let instrument in response.data.data) {
              let obj = {};
              obj.last_price = response.data.data[instrument].last_price;
              obj.instrument_token = response.data.data[instrument].instrument_token;
              obj.average_price = response.data.data[instrument].ohlc.close;
              obj.timestamp = response.data.data[instrument].timestamp
              arr.push(obj);
          }
          return arr;
    
        } catch (err){
          // console.log(err)
        }  
  

}

module.exports = singleLivePrice;