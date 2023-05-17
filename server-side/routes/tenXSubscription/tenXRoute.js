const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription, editTanx, getActiveTenXSubs, 
    getTenXSubscription, editFeature, removeFeature, getTenXSubs, getInactiveTenXSubs, getDraftTenXSubs, createTenXPurchaseIntent, getTenXSubscriptionPurchaseIntent} = require("../../controllers/tenXSubscriptionController");
const authentication = require("../../authentication/authentication")
const tenXTradeRoute = require("../mockTrade/tenXTradeRoute")
const {myTodaysTrade, myHistoryTrade} = require("../../controllers/tenXTradeController")

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, createTenXSubscription);
router.route('/capturepurchaseintent').post(authentication, createTenXPurchaseIntent);
router.route('/active').get(authentication, getActiveTenXSubs, getInactiveTenXSubs, getDraftTenXSubs);
router.route('/inactive').get(authentication, getInactiveTenXSubs);

router.route('/my/todayorders').get(authentication, myTodaysTrade)
router.route('/my/historyorders').get(authentication, myHistoryTrade)

router.route('/subscriptionpurchaseintent/:id').get(authentication, getTenXSubscriptionPurchaseIntent);
router.route('/draft').get(authentication, getDraftTenXSubs);
router.route('/:id').get(getTenXSubscription).patch(authentication, editTanx);
router.route('/feature/:id').patch(authentication, editFeature);
router.route('/removefeature/:id').patch(authentication, removeFeature);
router.use('/:id/trade', tenXTradeRoute)

module.exports = router;