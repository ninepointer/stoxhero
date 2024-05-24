const express = require("express");
const router = express.Router({mergeParams: true});
const {getDailyActiveUsers, getMonthlyActiveUsers, getDateWiseTradeInformation, getOverallTradeInformation, getCummMonthlyActiveUsersOnPlatform,
    getWeeklyActiveUsers, getDailyActiveUsersOnPlatform, getRollingActiveUsersOnPlatform, getOverallRevenue, getSignUpAndCummSignup,
    getMonthlyActiveUsersOnPlatform, getWeeklyActiveUsersOnPlatform, getMonthWiseCummActiveUsers, getDateWiseAverageActiveUsers, 
    getMarketingFunnelData, getMarketingFunnelDataOptimised, getMarketingFunnelDataLifetime, getMonthlyActiveUsersMarketingFunnel,
    downloadThisMonthSignUp, downloadThisMonthPaid,downloadLifetimeSignUp, downloadLifetimeActive, downloadLifetimePaid,
    downloadThisMonthActive, retentionRate} = require('../../controllers/StoxHeroUserDashboard/userAnalytics');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/dailyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsers);
router.route('/monthlyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsers);
router.route('/weeklyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeeklyActiveUsers);
router.route('/dailyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsersOnPlatform);
router.route('/weeklyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeeklyActiveUsersOnPlatform);
router.route('/rollingactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getRollingActiveUsersOnPlatform);
router.route('/tradeinformation').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDateWiseTradeInformation);
router.route('/overalltradeinformation').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOverallTradeInformation);
router.route('/marketingfunnellifetime').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMarketingFunnelDataLifetime);
router.route('/marketingfunnel/:month/:year').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMarketingFunnelData);
router.route('/thismonthsignup/:month/:year').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadThisMonthSignUp);
router.route('/thismonthactive/:month/:year').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadThisMonthActive);
router.route('/thismonthpaid/:month/:year').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadThisMonthPaid);
router.route('/marketingfunnelactiveusers/:month/:year').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsersMarketingFunnel);
router.route('/lifetimesignup').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadLifetimeSignUp);
router.route('/lifetimeactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadLifetimeActive);
router.route('/lifetimepaid').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadLifetimePaid);
router.route('/marketingfunnelo').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMarketingFunnelDataOptimised);
router.route('/overallrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOverallRevenue);
// router.route('/monthwiseactiveusers').get(Authenticate, getMonthWiseActiveUsers);
// router.route('/datewiseactiveusers').get(Authenticate, getDateWiseActiveUsers);


router.route('/monthlyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsersOnPlatform);
// router.route('/monthwiseactiveusers').get(Authenticate, getMonthWiseCummActiveUsers);
router.route('/averagedatewiseactiveusers').get(Authenticate, getDateWiseAverageActiveUsers);
router.route('/cummMonthactiveuser').get(Authenticate, getCummMonthlyActiveUsersOnPlatform);

router.route('/getsignupandcummsignup').get(Authenticate, getSignUpAndCummSignup);

module.exports = router;