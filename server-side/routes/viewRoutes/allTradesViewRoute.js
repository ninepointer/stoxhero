const express = require("express");
const router = express.Router({mergeParams: true});
const {createTradeView} = require('../../controllers/viewControllers/allTradesViewController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), createTradeView)

module.exports = router;