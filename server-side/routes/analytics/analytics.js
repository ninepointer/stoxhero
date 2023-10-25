const express = require("express");
const router = express.Router();
const Authenticate = require('../../authentication/authentication');
const { getTraderOverview, setCurrentUser, getDateWiseStats } = require('../../controllers/analyticsController');
const virtualTradeRouter = require('../../routes/analytics/paperTrade/paperTrade');
const infinityTradeRouter = require('../../routes/analytics/infintyTrade/infinityTrade');
const internshipAnalyticsRouter = require('../../routes/analytics/internshipTrade/internshipTrade');
const stoxheroTradeRouter = require('./tenXTrade/tenXTrade');

router.use('/papertrade', virtualTradeRouter);
router.use('/infinity', infinityTradeRouter);
router.use('/internship', internshipAnalyticsRouter);
router.use('/stoxhero', stoxheroTradeRouter)
// router.use('/stoxhero',);


module.exports = router;