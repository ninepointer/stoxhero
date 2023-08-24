const express = require("express");
const router = express.Router({mergeParams: true});

const {traderPnlTWiseSingleUserLive, companyDailyPnlTWiseSingleUserLive, 
        companyPnlReportLive, brokerReportMatchLive, traderPnlTWiseLive, traderMatrixPnlLive, pnlTraderCompany, overallLivePnlToday, 
        getLetestLiveTradeCompany, overallInfinityLiveCompanyPnlYesterday,
        traderLiveComapny, overallPnlBatchWiseLive, traderwiseBatchLive,overallInfinityLiveCompanyPnlMTD, 
        overallCompanySidePnlLive, mockLiveTotalTradersCountLiveSide, companyDailyPnlTWiseLive, 
        } = require("../../controllers/dailyContest/dailyContestLiveCompany")


const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization')


router.route('/live/overallcompanypnltoday').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallCompanySidePnlLive)
router.route('/live/overallinfinitylivecompanypnlyesterday').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallInfinityLiveCompanyPnlYesterday)
router.route('/live/overallinfinitylivecompanypnlMTD').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallInfinityLiveCompanyPnlMTD)
router.route('/live/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'Super Admin'), mockLiveTotalTradersCountLiveSide)
router.route('/live/letestTradeCompany').get(Authenticate, restrictTo('Admin', 'Super Admin'), getLetestLiveTradeCompany)

router.route('/livePnlCompany/:id').get(Authenticate, overallLivePnlToday)
router.route('/live/traderWiseCompany/:id').get(Authenticate, traderLiveComapny)

router.route('/live/traderPnlCompany/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), pnlTraderCompany)
router.route('/live/traderwisecompanypnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), companyDailyPnlTWiseLive)
router.route('/live/brokerreportmatch/:printDate/:fromDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), brokerReportMatchLive)
router.route('/live/traderwisetraderpnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderPnlTWiseLive)

router.route('/live/tradermatrixpnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderMatrixPnlLive)
router.route('/live/mockPnlBatchWise/:batchname').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallPnlBatchWiseLive)
router.route('/live/traderwiseBatchWise/:batchname').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderwiseBatchLive)
router.route('/live/traderwisetraderpnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderPnlTWiseLive)
router.route('/live/companypnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), companyPnlReportLive)
router.route('/live/traderwisecompanypnlreport/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), companyDailyPnlTWiseLive)
router.route('/live/companypnlreportsingleuser/:userId/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), companyDailyPnlTWiseSingleUserLive)
router.route('/live/traderpnlreportsingleuser/:userId/:startDate/:endDate').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderPnlTWiseSingleUserLive)


module.exports = router;