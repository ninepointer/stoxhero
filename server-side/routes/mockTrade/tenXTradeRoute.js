const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, 
    marginDetail} = require('../../controllers/tenXTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl);
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
// router.route('/pnlandCreditData').get(getPnlAndCreditData)
// router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
// router.route('/myOpening').get(Authenticate, openingBalance)


module.exports = router;
