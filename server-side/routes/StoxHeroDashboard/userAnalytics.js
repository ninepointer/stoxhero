const express = require("express");
const router = express.Router({mergeParams: true});
const {getDailyActiveUsers, getMonthlyActiveUsers, getDateWiseTradeInformation, getOverallTradeInformation, getCummMonthlyActiveUsersOnPlatform,
    getWeeklyActiveUsers, getDailyActiveUsersOnPlatform, getRollingActiveUsersOnPlatform, getOverallRevenue, getSignUpAndCummSignup,
    getMonthlyActiveUsersOnPlatform, getWeeklyActiveUsersOnPlatform, getMonthWiseCummActiveUsers, getDateWiseAverageActiveUsers} = require('../../controllers/StoxHeroUserDashboard/userAnalytics');

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
router.route('/overallrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOverallRevenue);
// router.route('/monthwiseactiveusers').get(Authenticate, getMonthWiseActiveUsers);
// router.route('/datewiseactiveusers').get(Authenticate, getDateWiseActiveUsers);


router.route('/monthlyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsersOnPlatform);
// router.route('/monthwiseactiveusers').get(Authenticate, getMonthWiseCummActiveUsers);
router.route('/averagedatewiseactiveusers').get(Authenticate, getDateWiseAverageActiveUsers);
router.route('/cummMonthactiveuser').get(Authenticate, getCummMonthlyActiveUsersOnPlatform);

router.route('/getsignupandcummsignup').get(Authenticate, getSignUpAndCummSignup);


module.exports = router;