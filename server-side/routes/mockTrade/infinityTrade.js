const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnlTrader,myTodaysTrade,myHistoryTrade, 
    getPnlAndCreditData, getMyPnlAndCreditData, openingBalance} = require('../../controllers/infinityController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnlTrader)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/pnlandCreditData').get(getPnlAndCreditData)
router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
router.route('/myOpening').get(Authenticate, openingBalance)

module.exports = router;
