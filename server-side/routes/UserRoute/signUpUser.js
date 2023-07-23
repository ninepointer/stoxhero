const express = require("express");
const router = express.Router({mergeParams: true});
const {signupusersdata} = require('../../controllers/userController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/users').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), signupusersdata)

module.exports = router;