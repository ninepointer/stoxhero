const axios = require('axios');
const Account = require("../models/Trading Account/accountSchema");
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const {client, getValue} = require("../marketData/redisClient")


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



    // if(await client.exists(`kiteCredToday:${process.env.PROD}`)){
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
    console.log(resp)
    for (let elem in resp.data.data) {
        instrumentToken = (resp.data.data[elem].instrument_token);
        // console.log(resp.data.data[elem])

    }
    return instrumentToken;
    }
    catch(err){
        return console.log(err)
    }
}

module.exports = fetchToken;