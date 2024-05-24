const express = require("express");
const router = express.Router();
const {getDashboardStats, getUserSummary, getExpectedPnl, getDashboardStatsContest, getDashboardStatsTenX} = require('../../controllers/userDashboardController');
const Authenticate = require('../../authentication/authentication');



router.route('/stats').get(Authenticate, getDashboardStats);
router.route('/conteststats').get(Authenticate, getDashboardStatsContest);
router.route('/tenxstats').get(Authenticate, getDashboardStatsTenX);
router.route('/summary').get(Authenticate, getUserSummary);
router.route('/expectedpnl').get(Authenticate, getExpectedPnl);
module.exports = router;