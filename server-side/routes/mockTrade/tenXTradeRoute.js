const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, overallTenXPnl, liveTotalTradersCount, 
    marginDetail, tradingDays, traderWiseMockTrader, overallTenXPnlYesterday, liveTotalTradersCountYesterday, tenxPnlReport, tenxDailyPnlTWise} = require('../../controllers/tenXTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl);
router.route('/marginDetail').get(Authenticate, marginDetail)
router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/traderWisePnl').get(Authenticate, traderWiseMockTrader)
router.route('/tenxoveralltraderpnltoday').get(overallTenXPnl)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/tenxoveralltraderpnlyesterday').get(overallTenXPnlYesterday)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/traderwisecompanypnlreport/:startDate/:endDate').get(tenxDailyPnlTWise)
router.route('/companypnlreport/:startDate/:endDate').get(tenxPnlReport)


module.exports = router;
