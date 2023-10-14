const express = require("express");
const router = express.Router({mergeParams: true});
const {myTodaysTrade} = require('../../controllers/PendingOrderController');
const Authenticate = require('../../authentication/authentication');


router.route('/my/today/:id/:from').get(Authenticate, myTodaysTrade);



module.exports = router;
