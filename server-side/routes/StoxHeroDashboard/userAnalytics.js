const express = require("express");
const router = express.Router({mergeParams: true});
const {getDailyActiveUsers, getMonthlyActiveUsers, 
    getWeeklyActiveUsers, getDailyActiveUsersOnPlatform,
    getMonthlyActiveUsersOnPlatform} = require('../../controllers/StoxHeroUserDashboard/userAnalytics');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/dailyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsers);
router.route('/monthlyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsers);
router.route('/weeklyactiveusers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeeklyActiveUsers);
router.route('/dailyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDailyActiveUsersOnPlatform);
router.route('/monthlyactiveusersonplatform').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMonthlyActiveUsersOnPlatform);


module.exports = router;