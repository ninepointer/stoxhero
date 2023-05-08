const express = require("express");
const router = express.Router();
const Authenticate = require('../../authentication/authentication');
const { getTraderOverview, setCurrentUser, getDateWiseStats } = require('../../controllers/analyticsController');
const virtualTradeRouter = require('../../routes/analytics/paperTrade/paperTrade');
const infinityTradeRouter = require('../../routes/analytics/infintyTrade/infinityTrade');
const stoxheroTradeRouter = require('../../routes/analytics/stoxHeroTrade/stoxheroTrade');

router.use('/papertrade', virtualTradeRouter);
router.use('/infinity', infinityTradeRouter);
router.use('/stoxhero', stoxheroTradeRouter)
// router.use('/stoxhero',);


module.exports = router;