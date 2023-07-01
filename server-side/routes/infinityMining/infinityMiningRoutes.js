const express = require("express");
const router = express.Router({mergeParams: true});
const {getTraderStats, getTraderTimePeriodStats} = require('../../controllers/infinityMiningController');

const Authenticate = require('../../authentication/authentication');


router.route('/traderstats/:id').get(getTraderStats);
router.route('/tradertradesoverview/:id').get(getTraderTimePeriodStats);



module.exports = router;