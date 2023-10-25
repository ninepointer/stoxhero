const express = require("express");
const router = express.Router({mergeParams: true});
const {signupusersdata, getReferralsBetweenDates} = require('../../controllers/userController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/users').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), signupusersdata)
router.route('/referrals/:startDate/:endDate/:mobile').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getReferralsBetweenDates)

module.exports = router;