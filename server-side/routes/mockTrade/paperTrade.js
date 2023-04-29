const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl,myTodaysTrade,myHistoryTrade, marginDetail} = require('../../controllers/paperTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl)
router.route('/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders').get(Authenticate, myHistoryTrade)
router.route('/margin').get(Authenticate, marginDetail)

module.exports = router;
