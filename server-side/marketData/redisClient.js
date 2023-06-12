// if(process.env.PROD){

    // let isRedisConnected ;
    // function setValue(value){
    //     isRedisConnected = value;
    // }

    // function getValue(){
    //     return isRedisConnected;
    // }
    // const redis = require('redis');
    // client = redis.createClient(
    //     {
    //         url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //     }
    // )
    // module.exports = {client, isRedisConnected, setValue, getValue}

// }
// else if(process.env.STAGE){
    // let isRedisConnected ;
    // function setValue(value){
    //     isRedisConnected = value;
    // }

    // function getValue(){
    //     return isRedisConnected;
    // }
    // const redis = require('redis');
    // client = redis.createClient(
    //     {
    //         // url:  `redis://stoxhero-redis.zvfkqy.ng.0001.aps1.cache.amazonaws.com`,
    //         url: `redis://stoxhero-staging-redis-001.zvfkqy.0001.aps1.cache.amazonaws.com`
    //     }
    // )
    // module.exports = {client, isRedisConnected, setValue, getValue}

// }
// else{

    let isRedisConnected ;
    function setValue(value){
        isRedisConnected = value;
    }

    function getValue(){
        return isRedisConnected;
    }
    const redis = require('redis');

    const client = redis.createClient(6379, 'http://127.0.0.1:8081/');

    module.exports = {client, isRedisConnected, setValue, getValue}


// }



// [
//     {
//       "type": "success",
//       "code": "s-user-0001",
//       "description": "OK",
//       "result": {
//         "BalanceList": {
//           "limitHeader": "ALL|ALL|ALL",
//           "limitObject": {
//             "RMSSubLimits": {
//               "cashAvailable": 99999999999999,
//               "collateral": 0,
//               "marginUtilized": 52955.278,
//               "netMarginAvailable": 99999999949541.72,
//               "MTM": 0,
//               "UnrealizedMTM": 0,
//               "RealizedMTM": 0
//             },
//             "marginAvailable": {
//               "CashMarginAvailable": 99999999999999,
//               "AdhocMargin": 0,
//               "NotinalCash": 0,
//               "PayInAmount": 0,
//               "PayOutAmount": 0,
//               "CNCSellBenifit": 0,
//               "DirectCollateral": 0,
//               "HoldingCollateral": 0,
//               "ClientBranchAdhoc": 0,
//               "SellOptionsPremium": 0,
//               "TotalBranchAdhoc": 0,
//               "AdhocFOMargin": 0,
//               "AdhocCurrencyMargin": 0,
//               "AdhocCommodityMargin": 0
//             },
//             "marginUtilized": {
//               "GrossExposureMarginPresent": 0,
//               "BuyExposureMarginPresent": 0,
//               "SellExposureMarginPresent": 0,
//               "VarELMarginPresent": 0,
//               "ScripBasketMarginPresent": 0,
//               "GrossExposureLimitPresent": 0,
//               "BuyExposureLimitPresent": 0,
//               "SellExposureLimitPresent": 0,
//               "CNCLimitUsed": 0,
//               "CNCAmountUsed": 1671,
//               "MarginUsed": 52955.2789,
//               "LimitUsed": 0,
//               "TotalSpanMargin": 0,
//               "ExposureMarginPresent": 0
//             },
//             "limitsAssigned": {
//               "CNCLimit": 0,
//               "TurnoverLimitPresent": 0,
//               "MTMLossLimitPresent": 0,
//               "BuyExposureLimit": 0,
//               "SellExposureLimit": 0,
//               "GrossExposureLimit": 0,
//               "GrossExposureDerivativesLimit": 0,
//               "BuyExposureFuturesLimit": 0,
//               "BuyExposureOptionsLimit": 0,
//               "SellExposureOptionsLimit": 0,
//               "SellExposureFuturesLimit": 0
//             },
//             "AccountID": "SYMP1"
//           }
//         }
//       }
//     }
//   ]

// margin with zerodha
// instrument remive bug
// ril, axis, icici, kotak, dr reddy, sbi
