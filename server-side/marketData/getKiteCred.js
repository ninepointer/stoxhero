const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
exports.getAccess = async (req, res, next) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    console.log(today)
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