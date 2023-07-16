const express = require("express");
const router = express.Router();
const {getDashboardStats} = require('../../controllers/userDashboardController');
const Authenticate = require('../../authentication/authentication');



router.route('/stats').get(Authenticate, getDashboardStats);
module.exports = router;