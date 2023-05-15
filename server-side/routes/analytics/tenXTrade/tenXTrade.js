const express = require("express");
const router = express.Router();
const Authenticate = require('../../../authentication/authentication');
const { getTenXTradersOverview, setCurrentUser, getTenXTradersDateWiseStats, getPaperTradesDailyPnlData, getTenXTradersMonthlyPnlData } = require('../../../controllers/analyticsController');

router.route('/myoverview').get(Authenticate, setCurrentUser, getTenXTradersOverview);
router.route('/mystats').get(Authenticate, setCurrentUser, getTenXTradersDateWiseStats);
// router.route('/mydailypnl').get(Authenticate, setCurrentUser, getPaperTradesDailyPnlData);
router.route('/mymonthlypnl').get(Authenticate, setCurrentUser, getTenXTradersMonthlyPnlData);
router.route('/stats/:id').get(Authenticate, getTenXTradersDateWiseStats);
router.route('/overview/:id').get(Authenticate, getTenXTradersOverview);


module.exports = router;