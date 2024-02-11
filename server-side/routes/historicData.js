const axios = require('axios');
const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");


async function fetchToken (exchange, symbol){
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";
    let getAccessToken;
    let getApiKey;
    let instrumentToken ;

    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active", generatedOn: {$gte: today}});
    // console.log(accessToken);
    console.log("in kite cred")
    for(let elem of accessToken){
        for(let subElem of apiKey){
         //  console.log("inside 2");
            if(elem.accountId === subElem.accountId && new Date(elem.generatedOn) > today){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
      }
    const addUrl = 'i=' + exchange + ':' + symbol;
    const urlToken = `https://api.kite.trade/quote?${addUrl}`

    let auth = 'token' + getApiKey + ':' + getAccessToken;
    
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };
    const resp = await axios.get(urlToken, authOptions);
    for (let elem in resp.data.data) {
        instrumentToken = (resp.data.data[elem].instrument_token);
    }
    return instrumentToken;
}

module.exports = fetchToken;