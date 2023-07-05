const express = require("express");
const router = express.Router();
require("../../../db/conn");
const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const axios = require("axios");
const {xtsAccountType} = require("../../../constant");
// const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema")
// const InfinityCompany = require("../../../models/mock-trade/infinityTradeCompany")
// const getKiteCred = require('../../../marketData/getKiteCred'); 
// const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
// const axios = require("axios");
// const {xtsAccountType} = require("../../../constant");

router.get("/xtsMargin", async (req, res) => {

  const accessToken = await RequestToken.find({ status: "Active", accountType: xtsAccountType, xtsType: "Interactive" });

  let url = `${process.env.INTERACTIVE_URL}/interactive/user/balance?clientID=${process.env.XTS_CLIENTID}`;
  let token = accessToken[0]?.accessToken;


  let authOptions = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.get(url, authOptions)
    let position = response.data?.result?.BalanceList[0]?.limitObject?.RMSSubLimits?.marginUtilized;
    // console.log(response.data?.result?.BalanceList[0]?.limitObject?.RMSSubLimits?.marginUtilized, position)

    res.status(200).json({ message: "position data", data: Number(position) })
  } catch (err) {
    console.log(err)
    return res.status(422).json({ error: "Fail to fetch position data" });
  }

})

module.exports = router;