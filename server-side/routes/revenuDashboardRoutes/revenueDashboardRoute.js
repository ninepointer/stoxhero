const express = require("express");
const router = express.Router({mergeParams: true});
const {getReferralRevenueData, getAutoSignUpRevenueData, getCareerRevenueData, 
    getAffiliateRevenueData, getUsersBetweenDate, 
    getSignupChannelBetweenDate, getRevenueBetweenDate, getTestZoneRevenue, 
    getOverallRevenue, downloadTestZoneRevenueData, downloadMarginXRevenueData, 
    getRetentionPercentageForMonth, getPaidRetentionPercentageForMonth, getCampaignRevenueData} = require('../../controllers/revenueController/revenuDashboardController');

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
router.route('/affiliaterevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliateRevenueData);
router.route('/careerrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getCareerRevenueData);
router.route('/campaignrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getCampaignRevenueData);
router.route('/referralrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getReferralRevenueData);
router.route('/autosignuprevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAutoSignUpRevenueData);


module.exports = router;