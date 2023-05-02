const axios = require('axios');
const Account = require("../models/Trading Account/accountSchema");
const RequestToken = require("../models/Trading Account/requestTokenSchema");

async function fetchToken (exchange, symbol){
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
    let getAccessToken;
    let getApiKey;
    let instrumentToken ;
    // console.log("Exchange & Symbol: ",exchange,symbol)

    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
  
  
    const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active"});
    for(let elem of accessToken){
        for(let subElem of apiKey){
            if(elem.accountId === subElem.accountId ){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
      }
    console.log(getAccessToken, getApiKey)
    const addUrl = 'i=' + exchange + ':' + symbol;
    const url = `https://api.kite.trade/quote?${addUrl}`
    // console.log("URL: ",url)
    let auth = 'token' + getApiKey + ':' + getAccessToken;
    // console.log("Auth: ",auth,getApiKey,getAccessToken)
    
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };

    // console.log(authOptions)
    try{
    const resp = await axios.get(url, authOptions);
    // console.log(resp)
    for (let elem in resp.data.data) {
        instrumentToken = (resp.data.data[elem].instrument_token);
        console.log(instrumentToken)
    }
    return instrumentToken;
    }
    catch(err){
        return console.log(err)
    }
}

module.exports = fetchToken;