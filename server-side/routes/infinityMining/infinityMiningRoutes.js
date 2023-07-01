const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats, getTraderTimePeriodStats, getTradersBothTradesData} = require('../../controllers/infinityMiningController');

const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(getTraderStats);
router.route('/tradertradesoverview/:id').get(getTraderTimePeriodStats);
router.route('/bothtradesdata/:id').get(getTradersBothTradesData);



module.exports = router;