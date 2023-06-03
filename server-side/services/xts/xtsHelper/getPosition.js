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