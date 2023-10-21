const express = require("express");
const router = express.Router({mergeParams: true});
const {myTodaysPendingTrade, myTodaysProcessedTrade, cancelOrder, modifyOrder, editPrice} = require('../../controllers/PendingOrderController');
const Authenticate = require('../../authentication/authentication');


router.route('/modify').post(Authenticate, modifyOrder);
router.route('/:id').patch(Authenticate, cancelOrder);
router.route('editprice/:id').patch(Authenticate, editPrice);
router.route('/my/todaysProcessed/:id/:from').get(Authenticate, myTodaysProcessedTrade);
router.route('/my/todaysPending/:id/:from').get(Authenticate, myTodaysPendingTrade);



module.exports = router;
