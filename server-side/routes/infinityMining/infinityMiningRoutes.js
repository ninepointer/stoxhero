const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats, getTraderTimePeriodStats, getTradersBothTradesData, getWeekWiseBothSideData} = require('../../controllers/infinityMiningController');

const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(getTraderStats);
router.route('/tradertradesoverview/:id').get(getTraderTimePeriodStats);
router.route('/bothtradesdata/:id').get(getTradersBothTradesData);
router.route('/bothtradesdataweek/:id').get(getWeekWiseBothSideData);



module.exports = router;