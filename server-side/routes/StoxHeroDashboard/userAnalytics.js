const express = require("express");
const router = express.Router({mergeParams: true});
const {getDailyActiveUsers, getMonthlyActiveUsers, getDateWiseTradeInformation, getOverallTradeInformation,
    getWeeklyActiveUsers, getDailyActiveUsersOnPlatform, getRollingActiveUsersOnPlatform, getOverallRevenue,
    getMonthlyActiveUsersOnPlatform, getWeeklyActiveUsersOnPlatform, getMonthWiseActiveUsers, getDateWiseActiveUsers} = require('../../controllers/StoxHeroUserDashboard/userAnalytics');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/dailyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsers);
router.route('/monthlyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsers);
router.route('/weeklyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeeklyActiveUsers);
router.route('/dailyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsersOnPlatform);
router.route('/monthlyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsersOnPlatform);
router.route('/weeklyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeeklyActiveUsersOnPlatform);
router.route('/rollingactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getRollingActiveUsersOnPlatform);
router.route('/tradeinformation').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDateWiseTradeInformation);
router.route('/overalltradeinformation').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOverallTradeInformation);
router.route('/overallrevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOverallRevenue);
router.route('/monthwiseactiveusers').get(Authenticate, getMonthWiseActiveUsers);
router.route('/datewiseactiveusers').get(Authenticate, getDateWiseActiveUsers);


module.exports = router;