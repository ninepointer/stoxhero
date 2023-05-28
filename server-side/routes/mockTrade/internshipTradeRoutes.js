const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, overallInternshipPnlYesterday, liveTotalTradersCountYesterday,
    marginDetail, overallInternshipPnl, liveTotalTradersCount, tradingDays, overallPnlAllTrader, traderWiseMockTrader} = require('../../controllers/internshipTradeController');
const Authenticate = require('../../authentication/authentication');



router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)

router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/overallinternshippnltoday').get(overallInternshipPnl)
router.route('/overallinternshippnlyesterday').get(overallInternshipPnlYesterday)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/pnl/:batch').get(Authenticate, overallPnl);
router.route('/pnlAllTrader/:batchId').get(Authenticate, overallPnlAllTrader);
router.route('/traderwiseAllTrader/:batchId').get(Authenticate, traderWiseMockTrader);
router.route('/marginDetail/:batch').get(Authenticate, marginDetail)


module.exports = router;
