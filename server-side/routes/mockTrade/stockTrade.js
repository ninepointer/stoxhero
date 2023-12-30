const express = require("express");
const router = express.Router({mergeParams: true});
const {pnlPosition, pnlHolding,myTodaysTrade,overallVirtualTraderPnl,liveTotalTradersCount,liveTotalTradersCountYesterday,
    overallVirtualPnlYesterday,myHistoryTrade, marginDetail, getDailyVirtualUsers, findOpenLots, treaderWiseMockTrader} = require('../../controllers/stockTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnlposition').get(Authenticate, pnlPosition)
router.route('/pnlholding').get(Authenticate, pnlHolding)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/margin').get(Authenticate, marginDetail)

router.route('/dailyvirtualusers').get(getDailyVirtualUsers)
router.route('/virtualoveralltraderpnltoday').get(overallVirtualTraderPnl)
router.route('/virtualoveralltraderpnlyesterday').get(overallVirtualPnlYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
// router.route('/openlots').get(findOpenLots);
router.route('/traderWisePnl').get(Authenticate, treaderWiseMockTrader)

module.exports = router;
