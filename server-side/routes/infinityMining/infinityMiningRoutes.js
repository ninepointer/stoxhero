const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats, getTraderTimePeriodStats, getTradersBothTradesData, getWeekWiseBothSideData} = require('../../controllers/infinityMiningController');
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTraderStats);
router.route('/tradertradesoverview/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTraderTimePeriodStats);
router.route('/bothtradesdata/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTradersBothTradesData);
router.route('/bothtradesdataweek/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getWeekWiseBothSideData);



module.exports = router;