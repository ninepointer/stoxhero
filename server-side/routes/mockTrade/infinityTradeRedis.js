const express = require("express");
const router = express.Router({mergeParams: true});
const {overallCompanySidePnlRedis, treaderWiseMockTraderRedis, treaderWiseLiveTraderRedis, overallCompanySideLivePnlRedis, 
    getLetestLiveTradeCompany, getLetestMockTradeCompany} = require('../../controllers/infinityControllerRedis');

const Authenticate = require('../../authentication/authentication');


router.route('/mock/overallcompanypnltoday').get(overallCompanySidePnlRedis)
router.route('/mock/traderwiseAllTrader').get(treaderWiseMockTraderRedis)
router.route('/livePnlCompany').get(overallCompanySideLivePnlRedis)
router.route('/live/traderWiseCompany').get(treaderWiseLiveTraderRedis)

router.route('/live/letestTradeCompany').get(getLetestLiveTradeCompany)
router.route('/mock/letestTradeCompany').get(getLetestMockTradeCompany)



module.exports = router;