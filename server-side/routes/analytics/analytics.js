const express = require("express");
const router = express.Router();
const Authenticate = require('../../authentication/authentication');
const { getTraderOverview, setCurrentUser, getDateWiseStats } = require('../../controllers/analyticsController');
const paperTradeRouter = require('../../routes/analytics/paperTrade/paperTrade');

router.use('/papertrade', paperTradeRouter);
// router.use('/infinity',);
// router.use('/stoxhero',);


module.exports = router;