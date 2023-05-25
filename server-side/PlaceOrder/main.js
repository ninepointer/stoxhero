const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const ApplyAlgo = require("../PlaceOrder/applyAlgo")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const LiveTradeFunc = require("../PlaceOrder/liveTrade")
const authentication = require("../authentication/authentication")
const Setting = require("../models/settings/setting");
const {liveTrade} = require("../services/xts/xtsHelper/xtsLiveOrderPlace");
const { xtsAccountType, zerodhaAccountType } = require("../constant");


router.post("/placingOrder", authentication, ApplyAlgo, authoizeTrade.fundCheck,  async (req, res)=>{
    console.log("caseStudy 4: placing")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
    }
    if(req.body.apiKey && req.body.accessToken){
        if(setting[0]?.toggle?.liveOrder !== zerodhaAccountType || setting[0]?.toggle?.complete !== zerodhaAccountType){
            console.log("in xts if")
            await liveTrade(req, res);
        } else{

            
            await LiveTradeFunc.liveTrade(req.body, res);
        }
        //  TODO toggle
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
//authoizeTrade.fundCheckPaperTrade
router.post("/tenxPlacingOrder", authentication, authoizeTrade.fundCheckTenxTrader,  async (req, res)=>{

    console.log("in tenxPlacingOrder trade")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
    }
    MockTradeFunc.mockTrade(req, res)
    
})


router.post("/internPlacingOrder", authentication, authoizeTrade.fundCheckInternship,  async (req, res)=>{

    console.log("in internPlacingOrder trade")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(!setting[0].isAppLive && req.user?.role?.roleName != 'Admin'){
        return res.status(401).send({message: "App is not Live right now. Please wait."}) 
      }
    MockTradeFunc.mockTrade(req, res)
})

module.exports = router;