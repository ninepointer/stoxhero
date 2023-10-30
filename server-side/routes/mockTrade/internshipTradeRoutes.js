const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, overallInternshipPnlYesterday, liveTotalTradersCountYesterday,
    marginDetail, overallInternshipPnl,myInternshipTradingDays, myOverallInternshipPnl, liveTotalTradersCount, tradingDays, overallPnlAllTrader, 
    traderWiseMockTrader, internshipPnlReport, internshipDailyPnlTWise, myWorkshopOrder, getDailyInternshipUsers, downloadCompletedInternshipReport, getReferralCount} = require('../../controllers/internshipTradeController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');



router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/countTradingDays').get(Authenticate, tradingDays)
router.route('/downloadinternshipreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadCompletedInternshipReport)
router.route('/overallinternshippnltoday').get(overallInternshipPnl)
router.route('/dailyinternshipusers').get(getDailyInternshipUsers)
router.route('/overallinternshippnlyesterday').get(overallInternshipPnlYesterday)
router.route('/liveandtotaltradercountyesterday').get(liveTotalTradersCountYesterday)
router.route('/liveandtotaltradercounttoday').get(liveTotalTradersCount)
router.route('/my/overallinternshippnl/:batchId').get(Authenticate ,myOverallInternshipPnl);
router.route('/my/tradingDays/:batchId').get(Authenticate, myInternshipTradingDays)
router.route('/my/referrals/:id').get(Authenticate, getReferralCount)
router.route('/my/workshoporders/:batchId').get(Authenticate, myWorkshopOrder)

router.route('/pnl/:batch').get(Authenticate, overallPnl);
router.route('/pnlAllTrader/:batchId').get(Authenticate, overallPnlAllTrader);
router.route('/traderwiseAllTrader/:batchId').get(Authenticate, traderWiseMockTrader);
router.route('/marginDetail/:batch').get(Authenticate, marginDetail)
router.route('/traderwisecompanypnlreport/:batch').get(internshipDailyPnlTWise)
router.route('/companypnlreport/:batch').get(internshipPnlReport)


module.exports = router;
