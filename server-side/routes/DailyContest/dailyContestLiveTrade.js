const express = require("express");
const router = express.Router({mergeParams: true});

const {traderPnlTWiseSingleUserLive, companyDailyPnlTWiseSingleUserLive, 
        companyPnlReportLive, brokerReportMatchLive, traderPnlTWiseLive, traderMatrixPnlLive, pnlTraderCompany, overallLivePnlToday, 
        switchWindowPnlData, overallLivePnlMismatchToday, overallAllContestPnlCompany,
        traderLiveComapny, DailyContestPnlTWiseTraderSide, DailyContestPnlTWise,
        overallDailyContestTraderPnl, overallDailyContestPnlYesterday,       
        overallDailyContestCompanySidePnlThisMonth, overallDailyContestCompanySidePnlLifetime, 
        liveTotalTradersCount, liveTotalTradersCountYesterday
} = require("../../controllers/dailyContest/dailyContestLiveCompany")


const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization')


router.route('/live/overalltraderpnltoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestTraderPnl)//
router.route('/live/overalltraderpnlyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestPnlYesterday)//
router.route('/live/overalltraderpnlthismonth').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlThisMonth)
router.route('/live/overalltraderpnllifetime').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlLifetime)
router.route('/live/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCount)//
router.route('/live/liveandtotaltradercountyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCountYesterday)//

router.route('/livePnlCompanymismatch').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallLivePnlMismatchToday)
router.route('/live/overallAllContestPnlCompany').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallAllContestPnlCompany)

router.route('/livePnlCompany/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), overallLivePnlToday)
router.route('/live/traderwisetraderpnlreport/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWiseTraderSide)
router.route('/live/traderwisecompanypnlreport/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWise)

router.route('/live/traderWiseCompany/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), traderLiveComapny)
router.route('/live/singleswitchcontest/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), switchWindowPnlData)

router.route('/live/traderPnlCompany/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), pnlTraderCompany)


module.exports = router;