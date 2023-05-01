const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getStoxHeroTradesOverview, setCurrentUser, getStoxHeroTradesDateWiseStats, getPaperTradesDailyPnlData, getStoxHeroTradesMonthlyPnlData } = require('../../../controllers/analyticsController');

router.route('/myoverview').get(Authenticate, setCurrentUser, getStoxHeroTradesOverview);
router.route('/mystats').get(Authenticate, setCurrentUser, getStoxHeroTradesDateWiseStats);
// router.route('/mydailypnl').get(Authenticate, setCurrentUser, getPaperTradesDailyPnlData);
router.route('/mymonthlypnl').get(Authenticate, setCurrentUser, getStoxHeroTradesMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getStoxHeroTradesDateWiseStats);
router.route('/overview/:id').get(Authenticate, getStoxHeroTradesOverview);


module.exports = router;