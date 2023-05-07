const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription} = require("../../controllers/tenXSubscriptionController");
const authentication = require("../../authentication/authentication")
// createTenXSubscription

router.route('/create').post(authentication, createTenXSubscription);

module.exports = router;