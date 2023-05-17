const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const {client, isRedisConnected} = require("../marketData/redisClient")
exports.getAccess = async () => {
    // await client.connect();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    // let date = new Date();
    let todayDate2 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate2 = todayDate2 + "T23:59:59.999Z";
    const today2 = new Date(todayDate2);
    const secondsRemaining = Math.round((today2.getTime() - date.getTime()) / 1000);

    console.log(today)

    // if(await client.exists(`kiteCredToday:${process.env.PROD}`)){
    //     let credentials = await client.get(`kiteCredToday:${process.env.PROD}`)
    //     credentials = JSON.parse(credentials);
    //     const {getApiKey, getAccessToken} = credentials;
    //     // console.log("cred", credentials)
    //     return {getApiKey, getAccessToken};
    // } else{

    //     const apiKey = await Account.find({status: "Active"});
    //     const accessToken = await RequestToken.find({status: "Active"});
    //     // console.log("accessToken", accessToken);
    //     console.log("in kite cred")
    //     let getApiKey, getAccessToken;
    //     for(let elem of accessToken){
    //         for(let subElem of apiKey){
    //             //  console.log("inside 2");
    //             if(elem.accountId === subElem.accountId ){
    //                 getAccessToken = elem.accessToken;
    //                 getApiKey = subElem.apiKey
    //             }
    //         }
    //     }

    //     try{
    //         await client.set(`kiteCredToday:${process.env.PROD}`, JSON.stringify({getApiKey, getAccessToken}));
    //         await client.expire(`kiteCredToday:${process.env.PROD}`, secondsRemaining);
    //     }catch(e){
    //         console.log(e);
    //     }
    //     return {getApiKey, getAccessToken};
    // }

    const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active"});
    // console.log("accessToken", accessToken);
    console.log("in kite cred")
    let getApiKey, getAccessToken;
    for(let elem of accessToken){
        for(let subElem of apiKey){
            //  console.log("inside 2");
            if(elem.accountId === subElem.accountId ){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
    }

    return {getApiKey, getAccessToken};
  
}