const express = require("express");
const router = express.Router();
const openPositions = require("../../marketData/getOpenPosition")
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');



router.get("/getOpenPositions", Authenticate, restrictTo('Admin', 'SuperAdmin'), openPositions);

module.exports = router;