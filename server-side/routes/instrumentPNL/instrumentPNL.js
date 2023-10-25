const express = require("express");
const router = express.Router({mergeParams: true});
const {createInstrumentPNLData} = require('../../controllers/insturmentPNL/instrumentPNL');
const authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');

router.route('/:startDate/:endDate').get(authentication, restrictTo('Admin', 'SuperAdmin'), createInstrumentPNLData);

module.exports = router;
