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
const{isAppLive, isInfinityLive} = require('./tradeMiddlewares');


router.post("/placingOrder", isInfinityLive, authentication, ApplyAlgo, authoizeTrade.fundCheck,  async (req, res)=>{
    // console.log("caseStudy 4: placing")
    const setting = await Setting.find();
    // console.log("settings", setting, req.user?.role?.roleName )
    if(req.body.apiKey && req.body.accessToken){
        if(setting[0]?.toggle?.liveOrder !== zerodhaAccountType || setting[0]?.toggle?.complete !== zerodhaAccountType){
            // console.log("in xts if")
            await liveTrade(req, res);
        } else{

            
            await LiveTradeFunc.liveTrade(req.body, res);
        }
        //  TODO toggle
    } else{
        MockTradeFunc.mockTrade(req, res);
    }
    
})

router.post("/paperTrade", isAppLive, authentication, authoizeTrade.fundCheckPaperTrade,  async (req, res)=>{

    MockTradeFunc.mockTrade(req, res)
    
})
//authoizeTrade.fundCheckPaperTrade
router.post("/tenxPlacingOrder", isAppLive, authentication, authoizeTrade.fundCheckTenxTrader,  async (req, res)=>{


    MockTradeFunc.mockTrade(req, res)
    
})


router.post("/internPlacingOrder", isAppLive, authentication, authoizeTrade.fundCheckInternship,  async (req, res)=>{

    MockTradeFunc.mockTrade(req, res)
})

module.exports = router;