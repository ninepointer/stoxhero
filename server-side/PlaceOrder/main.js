const express = require("express");
const router = express.Router();
require("../db/conn");
const authoizeTrade = require('../controllers/authoriseTrade');
const ApplyAlgo = require("../PlaceOrder/applyAlgo")
const MockTradeFunc = require("../PlaceOrder/mockTrade")
const LiveTradeFunc = require("../PlaceOrder/liveTrade")
const authentication = require("../authentication/authentication")


router.post("/placingOrder", authentication, ApplyAlgo, authoizeTrade.fundCheck,  async (req, res)=>{
    console.log("caseStudy 4: placing")
    if(req.body.apiKey && req.body.accessToken){
        LiveTradeFunc.liveTrade(req.body, res);
    } else{
        MockTradeFunc.mockTrade(req, res);
    }
    
})

router.post("/paperTrade", authentication, authoizeTrade.fundCheckPaperTrade,  async (req, res)=>{

    console.log("in papper trade")

    MockTradeFunc.mockTrade(req, res)
    
})

module.exports = router;