const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
const {client, getValue} = require("../marketData/redisClient")
const {disconnectTicker, createNewTicker}  = require('../marketData/kiteTicker');


exports.getAccess = async () => {

    if(await client.exists(`kiteCredToday:${process.env.PROD}`)){
        let credentials = await client.get(`kiteCredToday:${process.env.PROD}`)
        credentials = JSON.parse(credentials);
        const {getApiKey, getAccessToken} = credentials;
        return {getApiKey, getAccessToken};
    } else{

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

        await disconnectTicker();
        await createNewTicker(getApiKey, getAccessToken);

        try{
            await client.set(`kiteCredToday:${process.env.PROD}`, JSON.stringify({getApiKey, getAccessToken}));
            // await client.expire(`kiteCredToday:${process.env.PROD}`, secondsRemaining);
        }catch(e){
            console.log(e);
        }
        return {getApiKey, getAccessToken};
    }













    // const apiKey = await Account.find({status: "Active"});
    // const accessToken = await RequestToken.find({status: "Active"});
    // let getApiKey, getAccessToken;
    // for(let elem of accessToken){
    //     for(let subElem of apiKey){
    //         if(elem.accountId === subElem.accountId ){
    //             getAccessToken = elem.accessToken;
    //             getApiKey = subElem.apiKey
    //         }
    //     }
    // }

    // return {getApiKey, getAccessToken};
  
}