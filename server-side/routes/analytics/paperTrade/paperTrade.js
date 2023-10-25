const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getPaperTradesOverview, setCurrentUser, getPaperTradesDateWiseStats, getPaperTradesDailyPnlData, getPaperTradesMonthlyPnlData } = require('../../../controllers/analyticsController');

router.route('/myoverview').get(Authenticate, setCurrentUser, getPaperTradesOverview);
router.route('/mystats').get(Authenticate, setCurrentUser, getPaperTradesDateWiseStats);
router.route('/mydailypnl').get(Authenticate, setCurrentUser, getPaperTradesDailyPnlData);
router.route('/mymonthlypnl').get(Authenticate, setCurrentUser, getPaperTradesMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getPaperTradesDateWiseStats);
router.route('/overview/:id').get(Authenticate, getPaperTradesOverview);


module.exports = router;