const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData } = require('../../controllers/dailyContestTradeController');

router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;