const express = require("express");
const router = express.Router({mergeParams: true});
const {liveTotalTradersCount, overallDailyContestTraderPnl, overallDailyContestCompanySidePnlThisMonth,
    overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData, getRedisMyRankHTTP,overallDailyContestCompanySidePnlLifetime,
    myPnlAndPayout, overallDailyContestPnlYesterday, MarginXPayoutChart,
    liveTotalTradersCountYesterday, traderWiseMockCompanySide, DailyContestPnlTWiseTraderSide,
    DailyContestPnlTWise, traderWiseMockTraderSide, getRedisLeaderBoard } = require('../../controllers/marginX/marginxTradeController');

const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');


router.route('/payoutchart').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), MarginXPayoutChart);
// router.route('/overalltraderpnltoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestTraderPnl)
// router.route('/overalltraderpnlyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestPnlYesterday)
// router.route('/overalltraderpnlthismonth').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlThisMonth)
// router.route('/overalltraderpnllifetime').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlLifetime)
// router.route('/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCount)
// router.route('/liveandtotaltradercountyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCountYesterday)
// router.route('/allcontestPnl').get(Authenticate, myPnlAndPayout);

router.route('/:id/traderWisePnl').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockCompanySide)
router.route('/:id/traderWisePnlTside').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockTraderSide)
// router.route('/:id/traderwisecompanypnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWise)
// router.route('/:id/traderwisetraderpnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWiseTraderSide)

router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;