const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,overallVirtualTraderPnl,liveTotalTradersCount,liveTotalTradersCountYesterday,
    overallVirtualPnlYesterday,myHistoryTrade, marginDetail, getDailyVirtualUsers, findOpenLots, treaderWiseMockTrader} = require('../../controllers/paperTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl)
router.route('/dailyvirtualusers').get(getDailyVirtualUsers)
router.route('/virtualoveralltraderpnltoday').get(overallVirtualTraderPnl)
router.route('/virtualoveralltraderpnlyesterday').get(overallVirtualPnlYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/margin').get(Authenticate, marginDetail)
router.route('/openlots').get(findOpenLots);
router.route('/traderWisePnl').get(Authenticate, treaderWiseMockTrader)

module.exports = router;
