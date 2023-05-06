const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnlTrader,myTodaysTrade,myHistoryTrade, 
    getPnlAndCreditData, getMyPnlAndCreditData, openingBalance, 
    myAllTodaysTrade, overallPnlCompanySide, batchWisePnl, 
    companyDailyPnlTWise, companyPnlReport, traderPnlTWise, traderMatrixPnl} = require('../../controllers/infinityController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnlTrader);
router.route('/batchwisepnl').get( batchWisePnl);
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/pnlandCreditData').get(getPnlAndCreditData)
router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
router.route('/myOpening').get(Authenticate, openingBalance)
router.route('/userMockTrade/:id').get(myAllTodaysTrade)
router.route('/pnlCompnaySide/:id').get(overallPnlCompanySide)
router.route('/traderwisecompanypnlreport/:startDate/:endDate').get(companyDailyPnlTWise)
router.route('/companypnlreport/:startDate/:endDate').get(companyPnlReport)
router.route('/traderwisetraderpnlreport/:startDate/:endDate').get(traderPnlTWise)
router.route('/tradermatrixpnlreport/:startDate/:endDate').get(traderMatrixPnl)


module.exports = router;
