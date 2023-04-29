const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getTraderOverview, setCurrentUser, getDateWiseStats, getDailyPnlData, getMonthlyPnlData } = require('../../../controllers/analyticsController');

router.route('/myoverview').get(Authenticate, setCurrentUser, getTraderOverview);
router.route('/mystats').get(Authenticate, setCurrentUser, getDateWiseStats);
router.route('/mydailypnl').get(Authenticate, setCurrentUser, getDailyPnlData);
router.route('/mymonthlypnl').get(Authenticate, setCurrentUser, getMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getDateWiseStats);
router.route('/overview/:id').get(Authenticate, getTraderOverview);


module.exports = router;