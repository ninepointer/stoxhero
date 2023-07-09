const express = require("express");
const router = express.Router({mergeParams: true});
const {getDailyActiveUsers, getMonthlyActiveUsers, 
    getWeeklyActiveUsers, getDailyActiveUsersOnPlatform,
    getMonthlyActiveUsersOnPlatform} = require('../../controllers/StoxHeroUserDashboard/userAnalytics');

const Authenticate = require('../../authentication/authentication');


router.route('/dailyactiveusers').get(getDailyActiveUsers);
router.route('/monthlyactiveusers').get(getMonthlyActiveUsers);
router.route('/weeklyactiveusers').get(getWeeklyActiveUsers);
router.route('/dailyactiveusersonplatform').get(getDailyActiveUsersOnPlatform);
router.route('/monthlyactiveusersonplatform').get(getMonthlyActiveUsersOnPlatform);


module.exports = router;