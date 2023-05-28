const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnlBatchWiseMock, treaderWiseMockTrader, overallPnlAllTrader, overallPnlTrader,myTodaysTrade,myHistoryTrade, 
    getPnlAndCreditData, getMyPnlAndCreditData, openingBalance, traderwiseBatchMock,
    myAllTodaysTrade, overallPnlCompanySide, batchWisePnl, mockBatchToday, getLetestMockTradeCompany,
    companyDailyPnlTWise, companyPnlReport, traderPnlTWise, traderMatrixPnl, overallPnlTraderWise, getAllOrders, getAllOrdersForToday, getAllTradersMockOrders, getAllMockOrdersForToday, getAllMockOrders, getAllLiveOrders, getAllLiveOrdersForToday, getAllTradersLiveOrders, getAllTradersLiveOrdersForToday} = require('../../controllers/infinityController');

// const {pnlTraderCompany, overallLivePnlToday, getLetestLiveTradeCompany, 
//     traderLiveComapny, overallPnlBatchWiseLive, traderwiseBatchLive} = require("../../controllers/infinityTrading/infinityLiveCompany")
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnlTrader);
router.route('/batchwisepnl').get( batchWisePnl);
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/pnlandCreditData').get(getPnlAndCreditData)
router.route('/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)
router.route('/myOpening').get(Authenticate, openingBalance)
router.route('/mock/pnlAllTrader').get(overallPnlAllTrader)
router.route('/mock/cohortBatchToday').get(mockBatchToday)
router.route('/mock/traderwiseAllTrader').get(treaderWiseMockTrader)
// router.route('/livePnlCompany').get(overallLivePnlToday)
// router.route('/live/letestTradeCompany').get(getLetestLiveTradeCompany)
router.route('/mock/letestTradeCompany').get(getLetestMockTradeCompany)

// router.route('/live/traderWiseCompany').get(traderLiveComapny)

router.route('/userMockTrade/:id').get(myAllTodaysTrade)
router.route('/pnlCompnaySide/:id').get(overallPnlCompanySide)
router.route('/pnl/traderWise/:trader').get(Authenticate, overallPnlTraderWise)
router.route('mock/companyorders').get(getAllMockOrders);
router.route('mock/userorders').get(getAllTradersMockOrders);
router.route('mock/companyorderstoday').get(getAllMockOrdersForToday);
router.route('mock/userorderstoday').get(getAllMockOrdersForToday);
router.route('live/companyorders').get(getAllLiveOrders);
router.route('live/userorders').get(getAllTradersLiveOrders);
router.route('live/companyorderstoday').get(getAllLiveOrdersForToday);
router.route('live/userorderstoday').get(getAllTradersLiveOrdersForToday);
// router.route('/live/traderPnlCompany/:id').get(pnlTraderCompany)
router.route('/traderwisecompanypnlreport/:startDate/:endDate').get(companyDailyPnlTWise)
router.route('/companypnlreport/:startDate/:endDate').get(companyPnlReport)
router.route('/traderwisetraderpnlreport/:startDate/:endDate').get(traderPnlTWise)
router.route('/tradermatrixpnlreport/:startDate/:endDate').get(traderMatrixPnl)
router.route('/mock/mockPnlBatchWise/:batchname').get(overallPnlBatchWiseMock)
router.route('/mock/traderwiseBatchWise/:batchname').get(traderwiseBatchMock)
// router.route('/live/mockPnlBatchWise/:batchname').get(overallPnlBatchWiseLive)
// router.route('/live/traderwiseBatchWise/:batchname').get(traderwiseBatchLive)


module.exports = router;