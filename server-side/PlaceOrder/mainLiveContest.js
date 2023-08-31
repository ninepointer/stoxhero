const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const {ApplyAlgo, DailyContestApplyAlgo} = require("../PlaceOrder/applyAlgo")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const LiveTradeFunc = require("../PlaceOrder/liveTrade")
const authentication = require("../authentication/authentication")
const Setting = require("../models/settings/setting");
const {liveTrade} = require("../services/xts/xtsHelper/xtsLiveOrderPlace");
const { xtsAccountType, zerodhaAccountType } = require("../constant");
const{isAppLive, isInfinityLive} = require('./tradeMiddlewares');
const {infinityTradeLive, infinityTradeLiveSingle} = require("../services/xts/xtsHelper/switchAllUser");
const {contestChecks} = require("../PlaceOrder/dailyContestChecks")


router.post("/placingLiveOrderDailyContest", authentication, isAppLive, contestChecks, DailyContestApplyAlgo, authoizeTrade.fundCheckDailyContest,  async (req, res)=>{
    req.dailyContest = true;
    const setting = await Setting.find();

    if(req.body.apiKey && req.body.accessToken){
        if(setting[0]?.toggle?.liveOrder !== zerodhaAccountType || setting[0]?.toggle?.complete !== zerodhaAccountType){
            await liveTrade(req, res);
        } else{
            await LiveTradeFunc.liveTrade(req.body, res);
        }
        //  TODO toggle
    } else{
        MockTradeFunc.mockTrade(req, res);
    }
})


router.get("/switchRealToMock", authentication,  async (req, res)=>{
    await infinityTradeLive(res)
})

router.get("/switchRealToMockSingleUser/:userId", authentication,  async (req, res)=>{
    await infinityTradeLiveSingle(res, req)
})

module.exports = router;
