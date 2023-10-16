const express = require("express");
const router = express.Router({mergeParams: true});
const {myTodaysPendingTrade, myTodaysProcessedTrade, cancelOrder} = require('../../controllers/PendingOrderController');
const Authenticate = require('../../authentication/authentication');


router.route('/:id').patch(Authenticate, cancelOrder);
router.route('/my/todaysProcessed/:id/:from').get(Authenticate, myTodaysProcessedTrade);
router.route('/my/todaysPending/:id/:from').get(Authenticate, myTodaysPendingTrade);



module.exports = router;
