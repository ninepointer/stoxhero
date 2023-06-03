const express = require("express");
const router = express.Router({mergeParams: true});
const {getRetreiveOrder, getAllRetreiveOrder, getTodaysRetreiveOrder} = require('../../controllers/retreiveOrderController');
const Authenticate = require('../../authentication/authentication');


router.route('/backorderxts').get(getRetreiveOrder);
router.route('/allXTS').get(Authenticate, getAllRetreiveOrder);
router.route('/todayXTS').get(Authenticate, getTodaysRetreiveOrder)


module.exports = router;