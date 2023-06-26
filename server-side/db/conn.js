const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

// STAGINGDB
const DB = process.env.DATABASE;
const devDB = process.env.DEVDATABASE;
const stagingDB = process.env.STAGINGDB;


mongoose.connect(devDB, {
        //  mongoose.connect(DB, {
        // mongoose.connect(stagingDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log(err);
    console.log("no connection");
})

// INTERACTIVE_SECRET_KEY = 'Cmmx505#ru'
// INTERACTIVE_APP_KEY = '2e8ba9a6a40d0a4b1ae258'
// MARKETDATA_SECRET_KEY = 'Rfqq316#0v'
// MARKETDATA_APP_KEY = '01f2ecf691a168b067c412'
// INTERACTIVE_URL = 'http://14.142.188.188:23000'
// MARKETDATA_URL = 'http://14.142.188.188:23000/apimarketdata'
// XTS_USERID = "JPKS2"
// XTS_CLIENTID = "CF1"



// XTS_USERID = "KUSH_MARKET"
// XTS_CLIENTID = "KUSH"
// INTERACTIVE_URL = 'https://developers.symphonyfintech.in'
// MARKETDATA_URL = 'https://developers.symphonyfintech.in/apimarketdata'
// INTERACTIVE_SECRET_KEY = 'Vpcj303$VU'
// INTERACTIVE_APP_KEY = '319309f79e919405e5c245'
// MARKETDATA_SECRET_KEY = 'Yqyl575#Z8'
// MARKETDATA_APP_KEY = '37a43d49c099e7a4db1249'


    // "instrument": "NIFTY50",
    // "exchange": "NFO",
    // "status": "Active",
    // "symbol": "NIFTY2362218200CE",
    // "lotSize": 50,
    // "instrumentToken": 14758658,
    // "uId": liy3uh90,
    // "contractDate": "2023-06-22",
    // "maxLot": 1800,
    // "from": Infinity Trader,
    // "exchangeSegment": "NFO-OPT",
    // "exchangeInstrumentToken": 57651

/*
index.js
autoTrde.js
autoTradeManually.js
collectingTradeManually.js

xtsInteractive.js
mainManually.js
collleactingtrade
index.js

price 160
/*
in openprice of infinity set flag only for nifty and banknifty
also set maxlot in finnifty
stock index me accountType ko update krna h
*/