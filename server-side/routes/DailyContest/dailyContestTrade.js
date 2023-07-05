const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {liveTotalTradersCount, overallDailyContestTraderPnl, overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData, myPnlAndPayout } = require('../../controllers/dailyContestTradeController');


router.route('/virtualoveralltraderpnltoday').get(overallDailyContestTraderPnl)
// router.route('/virtualoveralltraderpnlyesterday').get(overallVirtualPnlYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
// router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)

router.route('/allcontestPnl').get(Authenticate, myPnlAndPayout);
router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;