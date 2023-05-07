let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;

let xtsMarketDataAPI = new XtsMarketDataAPI(
    'https://developers.symphonyfintech.in/marketdata'
);

let loginRequest = {
    secretKey: 'Awjq826##5',
    appKey: '9b584c581733cdc6773058',
};

(async ()=>{
    console.log(loginRequest)
    let logIn = await xtsMarketDataAPI.logIn(loginRequest);
    console.log(logIn)
    let response = await xtsMarketDataAPI.clientConfig();

    console.log(response);
})();
  
