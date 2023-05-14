const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const ApplyAlgo = require("../PlaceOrder/applyAlgo")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const LiveTradeFunc = require("../PlaceOrder/liveTrade")
const authentication = require("../authentication/authentication")
const Setting = require("../models/settings/setting");


router.post("/placingOrder", authentication, ApplyAlgo, authoizeTrade.fundCheck,  async (req, res)=>{
    console.log("caseStudy 4: placing")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
    }
    if(req.body.apiKey && req.body.accessToken){
        LiveTradeFunc.liveTrade(req.body, res);
    } else{
        MockTradeFunc.mockTrade(req, res);
    }
    
})

router.post("/paperTrade", authentication, authoizeTrade.fundCheckPaperTrade,  async (req, res)=>{

    console.log("in papper trade")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
      }
    MockTradeFunc.mockTrade(req, res)
    
})

router.post("/tenxPlacingOrder", authentication, authoizeTrade.fundCheckPaperTrade,  async (req, res)=>{

    console.log("in tenxPlacingOrder trade")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
      }
    MockTradeFunc.mockTrade(req, res)
    
})

module.exports = router;