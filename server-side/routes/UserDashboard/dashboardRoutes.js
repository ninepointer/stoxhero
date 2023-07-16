const express = require("express");
const router = express.Router();
const {getDashboardStats, getUserSummary} = require('../../controllers/userDashboardController');
const Authenticate = require('../../authentication/authentication');



router.route('/stats').get(Authenticate, getDashboardStats);
router.route('/summary').get(Authenticate, getUserSummary);
module.exports = router;