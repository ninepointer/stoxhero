const express = require("express");
const router = express.Router({mergeParams: true});
const {getBonusRevenueSplit, getUsersBetweenDate, getSignupChannelBetweenDate, getRevenueBetweenDate, getTestZoneRevenue, getOverallRevenue, downloadTestZoneRevenueData, downloadMarginXRevenueData, getRetentionPercentageForMonth, getPaidRetentionPercentageForMonth} = require('../../controllers/revenueController/revenuDashboardController');
const {reportMail} = require("../../controllers/dailyReportMail")
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/gettestzonerevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTestZoneRevenue);
router.route('/overallrevenue').get(getOverallRevenue);
router.route('/getretention').get(getRetentionPercentageForMonth);
router.route('/getpaidretention').get(getPaidRetentionPercentageForMonth);
router.route('/downloadtestzonerevenuedata').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadTestZoneRevenueData);
router.route('/downloadmarginxrevenuedata').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadMarginXRevenueData);
router.route('/betweendates').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getRevenueBetweenDate);
router.route('/signupchannels').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getSignupChannelBetweenDate);
router.route('/usersbetweendate').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUsersBetweenDate);
router.route('/revenuemail').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), reportMail);
router.route('/bonusrevenuesplit').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getBonusRevenueSplit);


module.exports = router;