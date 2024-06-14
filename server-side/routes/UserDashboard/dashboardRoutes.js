const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUserSummary,
  getExpectedPnl,
  getDashboardStatsContest,
  getDashboardStatsTenX,
  getWeekdayExpectedPnl,
} = require("../../controllers/userDashboardController");
const Authenticate = require("../../authentication/authentication");

router.route("/stats").get(Authenticate, getDashboardStats);
router.route("/conteststats").get(Authenticate, getDashboardStatsContest);
router.route("/tenxstats").get(Authenticate, getDashboardStatsTenX);
router.route("/summary").get(Authenticate, getUserSummary);
router.route("/expectedpnl").get(Authenticate, getExpectedPnl);
router.route("/weekdayexpectedpnl").get(Authenticate, getWeekdayExpectedPnl);
module.exports = router;
