const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getInfinityTradesOverview, setCurrentUser, getInfinityTradesDateWiseStats, getPaperTradesDailyPnlData, getInfinityTradesMonthlyPnlData } = require('../../../controllers/analyticsController');

router.route('/myoverview').get(Authenticate, setCurrentUser, getInfinityTradesOverview);
router.route('/mystats').get(Authenticate, setCurrentUser, getInfinityTradesDateWiseStats);
// router.route('/mydailypnl').get(Authenticate, setCurrentUser, getPaperTradesDailyPnlData);
router.route('/mymonthlypnl').get(Authenticate, setCurrentUser, getInfinityTradesMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getInfinityTradesDateWiseStats);
router.route('/overview/:id').get(Authenticate, getInfinityTradesOverview);


module.exports = router;