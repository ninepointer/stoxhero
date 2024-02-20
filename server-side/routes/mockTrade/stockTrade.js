const express = require("express");
const router = express.Router({mergeParams: true});
const {pnlPosition, pnlHolding,myTodaysTrade,overallTraderPnl,liveTotalTradersCount,liveTotalTradersCountYesterday,
    overallPnlYesterday,myHistoryTrade, marginDetail, getDailyUsers, getAllAdminOrders, getTodaysAdminOrders, treaderWiseMockTrader} = require('../../controllers/stockTradeController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/pnlposition').get(Authenticate, pnlPosition)
router.route('/pnlholding').get(Authenticate, pnlHolding)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/margin').get(Authenticate, marginDetail)

router.route('/dailystockusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyUsers)
router.route('/stockoveralltraderpnltoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallTraderPnl)
router.route('/stockoveralltraderpnlyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallPnlYesterday)
router.route('/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCount)
router.route('/liveandtotaltradercountyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCountYesterday)
router.route('/traderWisePnl').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), treaderWiseMockTrader);
router.route('/allorders').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllAdminOrders);
router.route('/todaysorders').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTodaysAdminOrders)


module.exports = router;
