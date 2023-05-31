const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getTenXTradersOverview, setCurrentUser, getTenXTradersDateWiseStats, getPaperTradesDailyPnlData,getInternshipTradersMonthlyPnlData ,getTenXTradersMonthlyPnlData, getInternshipTradersOverview, getInternshipTradersDateWiseStats } = require('../../../controllers/analyticsController');

router.route('/myoverview/:batchId').get(Authenticate, setCurrentUser, getInternshipTradersOverview);
router.route('/mystats/:batchId').get(Authenticate, setCurrentUser, getInternshipTradersDateWiseStats);
// router.route('/mydailypnl').get(Authenticate, setCurrentUser, getPaperTradesDailyPnlData);
router.route('/mymonthlypnl/:batchId').get(Authenticate, setCurrentUser, getInternshipTradersMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getInternshipTradersDateWiseStats);
router.route('/overview/:id').get(Authenticate, getInternshipTradersOverview);


module.exports = router;