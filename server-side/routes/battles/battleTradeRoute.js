const express = require("express");
const router = express.Router({mergeParams: true});
const {liveTotalTradersCount, overallMarginXTraderPnl, overallMarginXCompanySidePnlThisMonth,
    overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData,overallMarginXCompanySidePnlLifetime, 
    overallMarginXPnlYesterday, MarginXPayoutChart, liveTotalTradersCountYesterday, 
    traderWiseMockCompanySide, MarginxPnlTWiseTraderSide, MarginXPnlTWise, traderWiseMockTraderSide, 
    myAllOrder } = require('../../controllers/battles/battleTradeController');

const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');


router.route('/payoutchart').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), MarginXPayoutChart);
router.route('/overalltraderpnltoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallMarginXTraderPnl)
router.route('/overalltraderpnlyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallMarginXPnlYesterday)
router.route('/overalltraderpnlthismonth').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallMarginXCompanySidePnlThisMonth)
router.route('/overalltraderpnllifetime').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallMarginXCompanySidePnlLifetime)
router.route('/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCount)
router.route('/liveandtotaltradercountyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCountYesterday)
// router.route('/allcontestPnl').get(Authenticate, myPnlAndPayout);

router.route('/:id/traderWisePnl').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockCompanySide)
router.route('/:id/traderWisePnlTside').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockTraderSide)
router.route('/:id/traderwisecompanypnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), MarginXPnlTWise)
router.route('/:id/traderwisetraderpnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), MarginxPnlTWiseTraderSide)

router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/my/allorders').get(Authenticate, myAllOrder)

router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;