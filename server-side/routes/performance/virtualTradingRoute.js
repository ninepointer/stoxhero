const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats, getTraderTimePeriodStats} = require('../../controllers/performance/virtualTradingPerformance');
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTraderStats);
router.route('/tradertradesoverview/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTraderTimePeriodStats);



module.exports = router;