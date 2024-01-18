const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, overallTenXPnl, liveTotalTradersCount, getDailyTenXUsers,
    marginDetail, tradingDays, traderWiseMockTrader, overallTenXPnlYesterday, liveTotalTradersCountYesterday, 
    tenxPnlReport, tenxDailyPnlTWise, backfillPayout, liveSubscriptionAnalytics, liveSubscriptionAnalyticsWeb} = require('../../controllers/tenXTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl);
router.route('/marginDetail').get(Authenticate, marginDetail)
router.route('/dailytenxusers').get(getDailyTenXUsers)
router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/traderWisePnl').get(Authenticate, traderWiseMockTrader)
router.route('/tenxoveralltraderpnltoday').get(overallTenXPnl)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/tenxoveralltraderpnlyesterday').get(overallTenXPnlYesterday)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/traderwisecompanypnlreport').get(tenxDailyPnlTWise);
router.route('/backfill').get(backfillPayout);
router.route('/companypnlreport').get(tenxPnlReport)
router.route('/livesubscriptionpnl/:starttime').get(Authenticate, liveSubscriptionAnalytics);
router.route('/livesubscriptionpnlweb/:starttime').get(Authenticate, liveSubscriptionAnalyticsWeb);


module.exports = router;