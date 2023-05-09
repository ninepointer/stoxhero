const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
const AccessAndRequestToken = require("../models/Trading Account/requestTokenSchema");
const {disconnectTicker, createNewTicker}  = require('../marketData/kiteTicker');
const getKiteCred = require('../marketData/getKiteCred');
const totp = require("totp-generator");
const client = require("../marketData/redisClient");
const { ObjectId } = require("mongodb");
const {zerodhaAccountType} = require("../constant");



function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function zerodhaLogin(ApiKey,SecretKey,UserId,Password, req, resp) {

    const {accountId, status} = req.body;
    const {userId} = req.user;
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(
          `https://kite.trade/connect/login?api_key=${ApiKey}&v=3`
        );
        await sleep(2000);
        await page.type("input[type=text]", UserId);
        await page.type("input[type=password]", Password);
        await page.keyboard.press("Enter");
        await sleep(2000);
        await page.focus("input[type=text]").then((value) => console.log(value));
        await page.keyboard.type(totp(process.env.KUSH_ACCOUNT_HASH_CODE));
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        const reqUrl = page.url();
        console.log("Page URL:", page.url());
        const requestToken = new URL(reqUrl).searchParams.get('request_token');
        console.log("Request Token: ", requestToken);
        await browser.close();
        try{
          const kc = new KiteConnect({
            api_key: ApiKey,
          });
          const response = await kc.generateSession(requestToken, SecretKey);
          const accessToken = response.access_token;
          console.log("Access Token: ",accessToken);

          // AccessAndRequestToken.findOne({_id : _id})
          // .then((accountIdExist)=>{
          //     if(accountIdExist){
          //         //console.log("accountId already");
          //         return resp.status(422).json({error : "account Id already exist..."})
          //     }
          // }).catch(err => {console.log("fail in accesstoken auth")});

          const requestTokens = new AccessAndRequestToken({accountId, accessToken, requestToken, status, createdBy: new ObjectId(userId), lastModifiedBy: new ObjectId(userId), accountType: zerodhaAccountType});
      
          requestTokens.save().then(async ()=>{
            
              await client.del(`kiteCredToday:${process.env.PROD}`);
              disconnectTicker();
              getKiteCred.getAccess().then((data) => {
                  //console.log(data);
                  createNewTicker(data.getApiKey, data.getAccessToken);
              });
              
              resp.status(201).json({massage : "data enter succesfully"});
          }).catch((err)=> {console.log(err); resp.status(500).json({error:"Failed to enter data"})});

      
        //   return [requestToken, accessToken]
        }catch (e){
          console.error(e);
        }
        
      })();
}
module.exports = zerodhaLogin
