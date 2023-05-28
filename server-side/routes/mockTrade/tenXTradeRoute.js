const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, 
    marginDetail, tradingDays, traderWiseMockTrader} = require('../../controllers/tenXTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl);
// router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
// router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/marginDetail').get(Authenticate, marginDetail)
router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/traderWisePnl').get(Authenticate, traderWiseMockTrader)
// router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
// router.route('/myOpening').get(Authenticate, openingBalance)


module.exports = router;
