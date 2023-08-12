const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription, editTanx, getActiveTenXSubs, renewSubscription,
    getTenXSubscription, editFeature, getBeginnerSubscription, getIntermediateSubscription, 
    getProSubscription, removeFeature, getTenXSubs, getInactiveTenXSubs, getDraftTenXSubs, 
    createTenXPurchaseIntent, getTenXSubscriptionPurchaseIntent, myActiveSubsciption} = require("../../controllers/tenXSubscriptionController");
const Authenticate = require('../../authentication/authentication');
const tenXTradeRoute = require("../mockTrade/tenXTradeRoute")
const {myTodaysTrade, myHistoryTrade, tradingDays, userSubscriptions} = require("../../controllers/tenXTradeController")
const restrictTo = require('../../authentication/authorization');

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createTenXSubscription);
router.route('/capturepurchaseintent').post(Authenticate, createTenXPurchaseIntent);
router.route('/active').get(Authenticate, getActiveTenXSubs, getInactiveTenXSubs, getDraftTenXSubs);
router.route('/inactive').get(Authenticate, getInactiveTenXSubs);
router.route('/beginner').get(Authenticate, getBeginnerSubscription);
router.route('/intermediate').get(Authenticate, getIntermediateSubscription);
router.route('/pro').get(Authenticate, getProSubscription);
router.route('/renew').patch(Authenticate, renewSubscription);


router.route('/mySubscription').get(Authenticate, userSubscriptions);


router.route('/myactivesubscription').get(Authenticate, myActiveSubsciption)

router.route('/subscriptionpurchaseintent/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTenXSubscriptionPurchaseIntent);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftTenXSubs);
router.route('/:id').get(Authenticate, getTenXSubscription).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editTanx);
router.route('/feature/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editFeature);
router.route('/removefeature/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), removeFeature);

router.use('/:id/trade', tenXTradeRoute)
router.route('/my/todayorders/:subscription').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders/:subscription/:usersubscription').get(Authenticate, myHistoryTrade)


module.exports = router;