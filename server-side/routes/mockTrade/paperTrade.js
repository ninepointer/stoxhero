const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl} = require('../../controllers/paperTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl)

module.exports = router;
