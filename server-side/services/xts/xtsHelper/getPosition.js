const express = require("express");
const router = express.Router();
require("../../../db/conn");
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const axios = require("axios");
const {xtsAccountType} = require("../../../constant");


router.get("/getPositions", async (req, res)=>{
    const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});

    let url = `${process.env.INTERACTIVE_URL}/interactive/portfolio/dealerpositions?dayOrNet=DayWise`;
    let token = accessToken[0]?.accessToken;

    // console.log("token", token)
  
    let authOptions = {
      headers: {
        Authorization: token,
      },
    };

    try{
      const response = await axios.get(url, authOptions)
      let position = response.data?.result?.positionList;
      res.status(200).json({message: "position data", data: position})
    } catch (err){
      console.log(err)
      return res.status(422).json({error : "Fail to fetch position data"});
  }

})

module.exports = router;


// {
//   "type": "success",
//   "code": "s-user-0001",
//   "description": "Success position",
//   "result": [
//     {
//       "AccountID": "SYMP1",
//       "TradingSymbol": "ACC",
//       "ExchangeSegment": "NSECM",
//       "ExchangeInstrumentID": 22,
//       "ProductType": "CNC",
//       "Marketlot": 1,
//       "Multiplier": 1,
//       "BuyAveragePrice": 41.78,
//       "SellAveragePrice": 41.63,
//       "OpenBuyQuantity": 10,
//       "OpenSellQuantity": 0,
//       "Quantity": 10,
//       "BuyAmount": 1671,
//       "SellAmount": 2498,
//       "NetAmount": 827,
//       "UnrealizedMTM": 0,
//       "RealizedMTM": 0,
//       "MTM": 0,
//       "BEP": 0,
//       "SumOfTradedQuantityAndPriceBuy": 1671,
//       "SumOfTradedQuantityAndPriceSell": 2498,
//       "statisticsLevel": "ParentLevel",
//       "isInterOpPosition": "true",
//       "childPositions": {
//         "AccountID\"": "SYMP1",
//         "TradingSymbol": "ACC",
//         "ExchangeSegment": "NSECM",
//         "ExchangeInstrumentID": "22",
//         "ProductType": "CNC",
//         "Marketlot": "1",
//         "Multiplier": "1",
//         "BuyAveragePrice": "41.78",
//         "SellAveragePrice": "41.63",
//         "OpenBuyQuantity": "10",
//         "OpenSellQuantity": "0",
//         "Quantity": "10",
//         "BuyAmount": "1671.00",
//         "SellAmount": "2498.00",
//         "NetAmount": "827.00",
//         "UnrealizedMTM": "0",
//         "RealizedMTM": "0",
//         "MTM": "0",
//         "BEP": "0",
//         "SumOfTradedQuantityAndPriceBuy": "1671.00",
//         "SumOfTradedQuantityAndPriceSell": "2498.00",
//         "statisticsLevel": "ParentLevel",
//         "isInterOpPosition": "true"
//       },
//       "MessageCode": 9002,
//       "MessageVersion": 1,
//       "TokenID": 0,
//       "ApplicationType": 0,
//       "SequenceNumber": 0
//     }
//   ]
// }