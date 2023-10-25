const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
const AccessAndRequestToken = require("../models/Trading Account/requestTokenSchema");
const {disconnectTicker, createNewTicker}  = require('../marketData/kiteTicker');
const getKiteCred = require('../marketData/getKiteCred');
const totp = require("totp-generator");
// const {client, isRedisConnected} = require("../marketData/redisClient");
const { ObjectId } = require("mongodb");
const {zerodhaAccountType} = require("../constant");

// const {client, getValue} = require("../marketData/redisClient");


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function zerodhaLogin(ApiKey,SecretKey,UserId,Password, req, resp) {

  console.log(ApiKey,SecretKey,UserId,Password, totp(process.env.KUSH_ACCOUNT_HASH_CODE))
    const {accountId, status} = req.body;
    const HASH_CODE = accountId===process.env.PRATEEK_ACCOUNT_ID ? process.env.PRATEEK_ACCOUNT_HASH_CODE : process.env.KUSH_ACCOUNT_HASH_CODE;
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
        await page.waitForSelector("input[type=text]",{visible:true});
        await page.focus("input[type=text]").then((value) => console.log(value));
        await page.keyboard.type(totp(HASH_CODE));
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

          const requestTokens = new AccessAndRequestToken({accountId, accessToken, requestToken, status, createdBy: new ObjectId(userId), lastModifiedBy: new ObjectId(userId), accountType: zerodhaAccountType});
      
          requestTokens.save().then(async ()=>{
              await client.set(`kiteCredToday:${process.env.PROD}`, JSON.stringify({getApiKey: ApiKey, getAccessToken: accessToken}));
              let date = new Date();

              let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+1).padStart(2, '0')}`
              tempTodayDate = tempTodayDate + "T01:30:00.000Z";
              const tempDate = new Date(tempTodayDate);
              const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);
                    
              console.log("secondsRemaining", secondsRemaining)
          
              await client.expire(`kiteCredToday:${process.env.PROD}`, secondsRemaining);
          
              disconnectTicker();
              getKiteCred.getAccess().then((data) => {
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
