const express = require("express");
const router = express.Router();
require("../../../db/conn");
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const axios = require("axios");
const {xtsAccountType} = require("../../../constant");
const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema")
const InfinityCompany = require("../../../models/mock-trade/infinityTradeCompany")
const getKiteCred = require('../../../marketData/getKiteCred'); 

router.get("/xtsMargin", async (req, res)=>{

  getKiteCred.getAccess().then(async (data) => {
    let total = 0;
    // const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
      'X-Kite-Version': '3',
      'Authorization': auth,
      "content-type": "application/json"
    }
    let pnlLiveDetails = await InfinityLiveCompany.aggregate([
      {
        $lookup: {
          from: 'algo-tradings',
          localField: 'algoBox',
          foreignField: '_id',
          as: 'algo'
        }
      },
      {
        $match: {
          trade_time: {
            $gte: today
          },
          status: "COMPLETE",
          "algo.isDefault": true
        },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            product: "$Product",
            instrumentToken: "$instrumentToken",
            exchangeInstrumentToken: "$exchangeInstrumentToken",
            exchange: "$exchange",
            variety: "$variety",
            order_type: "$order_type"
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id.symbol",
          product: "$_id.product",
          amount: 1,
          brokerage: 1,
          instrumentToken: "$_id.instrumentToken",
          exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
          lots: 1,
          exchange: "$_id.exchange",
          variety: "$_id.variety",
          order_type: "$_id.order_type"
        },
      },
    ])

    for(let i = 0; i < pnlLiveDetails.length; i++){
      if(pnlLiveDetails[i].lots !== 0){
        let buyOrSell = pnlLiveDetails[i].lots > 0 ? "BUY" : "SELL";
        let orderData = [{
          "exchange": pnlLiveDetails[i].exchange,
          "tradingsymbol": pnlLiveDetails[i].symbol,
          "transaction_type": buyOrSell,
          "variety": pnlLiveDetails[i].variety,
          "product": pnlLiveDetails[i].product,
          "order_type": pnlLiveDetails[i].order_type,
          "quantity": Math.abs(pnlLiveDetails[i].lots),
          "price": 0,
          "trigger_price": 0
        }]
    
        // console.log("orderData", orderData)
        let marginData;
        let zerodhaMargin;
    
        try {
          marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
          zerodhaMargin = marginData.data.data.orders[0].total;
          total += zerodhaMargin
          console.log(zerodhaMargin)
          // console.log(total, marginData.data.data.orders[0])
        } catch (e) {
          // console.log("error fetching zerodha margin", e);
        }
      }
    }


    res.status(200).json({message: "margin data", data: total})

  }); 




    // const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});

    // let url = `${process.env.INTERACTIVE_URL}/interactive/user/balance?clientID=${process.env.XTS_CLIENTID}`;
    // let token = accessToken[0]?.accessToken;

    // // console.log("token", token)
  
    // let authOptions = {
    //   headers: {
    //     Authorization: token,
    //   },
    // };

    // try{
    //   const response = await axios.get(url, authOptions)
    //   console.log(response.data.result?.BalanceList)
    //   let margin = response.data.result?.BalanceList[0].limitObject?.RMSSubLimits;
    //   res.status(200).json({message: "margin data", data: margin})
    // } catch (err){
    //   console.log(err)
    //   return res.status(422).json({error : "Fail to fetch margin data"});
    // }

})

module.exports = router;