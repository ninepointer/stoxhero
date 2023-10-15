const express = require("express");
const router = express.Router({mergeParams: true});
const {myTodaysTrade, cancelOrder} = require('../../controllers/PendingOrderController');
const Authenticate = require('../../authentication/authentication');


router.route('/:id').patch(Authenticate, cancelOrder);
router.route('/my/today/:id/:from').get(Authenticate, myTodaysTrade);



module.exports = router;
