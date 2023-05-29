const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, overallTenXPnl, liveTotalTradersCount, 
    marginDetail, tradingDays, traderWiseMockTrader, overallTenXPnlYesterday, liveTotalTradersCountYesterday} = require('../../controllers/tenXTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl);
// router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
// router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/marginDetail').get(Authenticate, marginDetail)
router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/traderWisePnl').get(Authenticate, traderWiseMockTrader)
router.route('/tenxoveralltraderpnltoday').get(overallTenXPnl)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/tenxoveralltraderpnlyesterday').get(overallTenXPnlYesterday)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
// router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
// router.route('/myOpening').get(Authenticate, openingBalance)


module.exports = router;
