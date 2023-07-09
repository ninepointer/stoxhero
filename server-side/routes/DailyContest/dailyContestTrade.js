const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {liveTotalTradersCount, overallDailyContestTraderPnl, 
    overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData, 
    myPnlAndPayout, overallDailyContestPnlYesterday, DailyContestPayoutChart,
    liveTotalTradersCountYesterday, traderWiseMockCompanySide, DailyContestPnlTWiseTraderSide,
    DailyContestPnlTWise, traderWiseMockTraderSide, getRedisLeaderBoard } = require('../../controllers/dailyContestTradeController');


router.route('/payoutchart').get(DailyContestPayoutChart)
router.route('/virtualoveralltraderpnltoday').get(overallDailyContestTraderPnl)
router.route('/virtualoveralltraderpnlyesterday').get(overallDailyContestPnlYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/allcontestPnl').get(Authenticate, myPnlAndPayout);
router.route('/:id/leaderboard').get( getRedisLeaderBoard)

router.route('/:id/traderWisePnl').get(Authenticate, traderWiseMockCompanySide)
router.route('/:id/traderWisePnlTside').get(Authenticate, traderWiseMockTraderSide)
router.route('/:id/traderwisecompanypnlreport').get(DailyContestPnlTWise)
router.route('/:id/traderwisetraderpnlreport').get(DailyContestPnlTWiseTraderSide)

router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;