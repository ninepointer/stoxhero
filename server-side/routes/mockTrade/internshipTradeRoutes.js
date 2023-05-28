const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, 
    marginDetail, tradingDays} = require('../../controllers/internshipTradeController');
const Authenticate = require('../../authentication/authentication');



router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)

router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/pnl/:batch').get(Authenticate, overallPnl);
router.route('/marginDetail/:batch').get(Authenticate, marginDetail)
// router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
// router.route('/myOpening').get(Authenticate, openingBalance)


module.exports = router;
