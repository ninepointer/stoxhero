const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnlTrader,myTodaysTrade,myHistoryTrade} = require('../../controllers/infinityController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnlTrader)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)

module.exports = router;
