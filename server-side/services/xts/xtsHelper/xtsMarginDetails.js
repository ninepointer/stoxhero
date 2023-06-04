const express = require("express");
const router = express.Router();
require("../../../db/conn");
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const axios = require("axios");
const {xtsAccountType} = require("../../../constant");
const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema")


router.get("/xtsMargin", async (req, res)=>{
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
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        lastaverageprice: {
          $last: "$average_price",
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
        npnl: {
          $subtract: ["$amount", "$brokerage"]
        },
        lots: 1,
        lastaverageprice: 1
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ])
    const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType, xtsType: "Interactive"});

    let url = `${process.env.INTERACTIVE_URL}/interactive/user/balance?clientID=${process.env.XTS_CLIENTID}`;
    let token = accessToken[0]?.accessToken;

    // console.log("token", token)
  
    let authOptions = {
      headers: {
        Authorization: token,
      },
    };

    try{
      const response = await axios.get(url, authOptions)
      console.log(response.data.result?.BalanceList)
      let margin = response.data.result?.BalanceList[0].limitObject?.RMSSubLimits;
      res.status(200).json({message: "margin data", data: margin})
    } catch (err){
      console.log(err)
      return res.status(422).json({error : "Fail to fetch margin data"});
    }

})

module.exports = router;