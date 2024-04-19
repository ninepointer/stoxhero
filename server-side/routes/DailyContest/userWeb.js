const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const userWeb = require('../../controllers/dailyContest/userWeb');

router.get('/freecompleted', Authenticate, userWeb.userFreeCompleted);
router.get('/paidcompleted', Authenticate, userWeb.userPaidCompleted);
router.get('/live', Authenticate, userWeb.userLive);
router.get('/upcoming', Authenticate, userWeb.userUpcoming);


module.exports=router;