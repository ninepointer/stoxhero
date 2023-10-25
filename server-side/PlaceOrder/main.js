const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const {ApplyAlgo, DailyContestApplyAlgo, MarginXApplyAlgo} = require("../PlaceOrder/applyAlgo")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const LiveTradeFunc = require("../PlaceOrder/liveTrade")
const authentication = require("../authentication/authentication")
const Setting = require("../models/settings/setting");
const {liveTrade} = require("../services/xts/xtsHelper/xtsLiveOrderPlace");
const { xtsAccountType, zerodhaAccountType } = require("../constant");
const{isAppLive, isInfinityLive} = require('./tradeMiddlewares');
const {infinityTradeLive, infinityTradeLiveSingle} = require("../services/xts/xtsHelper/switchAllUser");
const {contestTradeLive} = require("../services/xts/xtsHelper/switchAllDailyContestLive");
const {contestChecks, marginxChecks, battleChecks} = require("../PlaceOrder/dailyContestChecks")

router.post("/placingOrder", authentication, isInfinityLive, ApplyAlgo, authoizeTrade.fundCheck,  async (req, res)=>{
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

router.post("/placingOrderDailyContest", isAppLive, authentication, contestChecks, DailyContestApplyAlgo, authoizeTrade.fundCheckDailyContest,  async (req, res)=>{
    req.dailyContest = true;
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

router.post("/placingOrderMarginx", isAppLive, authentication, marginxChecks, MarginXApplyAlgo, authoizeTrade.fundCheckMarginX, async (req, res)=>{
    // console.log("caseStudy 4: placing", req.body)
    req.marginx = true;
    const setting = await Setting.find();

    //  console.log("settings", setting, req.user?.role?.roleName )
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

router.post("/battleTrade", isAppLive, authentication, battleChecks, authoizeTrade.fundCheckBattle,  async (req, res)=>{
    req.body.battle = true;
    MockTradeFunc.mockTrade(req, res)
})
//authoizeTrade.fundCheckPaperTrade
router.post("/tenxPlacingOrder", isAppLive, authentication, authoizeTrade.fundCheckTenxTrader,  async (req, res)=>{


    MockTradeFunc.mockTrade(req, res)
    
})

router.post("/internPlacingOrder", isAppLive, authentication, authoizeTrade.fundCheckInternship,  async (req, res)=>{

    MockTradeFunc.mockTrade(req, res)
})

router.get("/switchRealToMock", authentication,  async (req, res)=>{

    await infinityTradeLive(res)
})
router.get("/switchRealToMockContest/:id", authentication,  async (req, res)=>{

    await contestTradeLive(req,res)
})

router.get("/switchRealToMockSingleUser/:userId", authentication,  async (req, res)=>{

    await infinityTradeLiveSingle(res, req)
})

module.exports = router;
