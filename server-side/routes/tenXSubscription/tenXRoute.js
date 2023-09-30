const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription, editTanx, getActiveTenXSubs, renewSubscription,
    getTenXSubscription, editFeature, getBeginnerSubscription, getIntermediateSubscription, 
    getProSubscription, removeFeature, getAdminActiveTenXSubs, getInactiveTenXSubs, getDraftTenXSubs, 
    createTenXPurchaseIntent, getAllTenXSubs, getTenXSubscriptionPurchaseIntent, myActiveSubsciption, 
    myExpiredSubsciption, myActiveSubs, SubsUserCount, createTenXTutorialView, getTenXTutorialVideoView
    ,TenXLeaderboard, liveTenXSubscribers, expiredTenXSubscribers, downloadLiveTenXSubscribers, 
    downloadExpiredTenXSubscribers, tenXPurchaseToday, tenXExpiredToday} = require("../../controllers/tenXSubscriptionController");
const Authenticate = require('../../authentication/authentication');
const tenXTradeRoute = require("../mockTrade/tenXTradeRoute")
const {myTodaysTrade, myHistoryTrade, tradingDays, userSubscriptions} = require("../../controllers/tenXTradeController")
const restrictTo = require('../../authentication/authorization');

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createTenXSubscription);
router.route('/capturepurchaseintent').post(Authenticate, createTenXPurchaseIntent);
router.route('/tenxtutorialview').post(Authenticate, createTenXTutorialView);
router.route('/tenxleaderboard').get(Authenticate, TenXLeaderboard);
router.route('/active').get(Authenticate, getActiveTenXSubs);
router.route('/adminactive').get(Authenticate, getAdminActiveTenXSubs);
router.route('/allsubscription').get(Authenticate, getAllTenXSubs);

router.route('/inactive').get(Authenticate, getInactiveTenXSubs);
router.route('/beginner').get(Authenticate, getBeginnerSubscription);
router.route('/intermediate').get(Authenticate, getIntermediateSubscription);
router.route('/pro').get(Authenticate, getProSubscription);
router.route('/renew').patch(Authenticate, renewSubscription);


router.route('/mySubscription').get(Authenticate, userSubscriptions);
router.route('/livetenxsubscribers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTenXSubscribers);
router.route('/expiredtenxsubscribers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), expiredTenXSubscribers);
router.route('/tenxpurchasetoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), tenXPurchaseToday);
router.route('/tenxexpiredtoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), tenXExpiredToday);
router.route('/downloadlivetenxsubscribers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadLiveTenXSubscribers);
router.route('/downloadexpiredtenxsubscribers').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadExpiredTenXSubscribers);

router.route('/myactivesubscription').get(Authenticate, myActiveSubsciption)
router.route('/myactivesubs').get(Authenticate, myActiveSubs)
router.route('/myexpiredsubscription').get(Authenticate, myExpiredSubsciption)

router.route('/subscriptionpurchaseintent/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTenXSubscriptionPurchaseIntent);
router.route('/tutorialvideoview/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTenXTutorialVideoView);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftTenXSubs);
router.route('/:id').get(Authenticate, getTenXSubscription).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editTanx);
router.route('/feature/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editFeature);
router.route('/subscribercount/:id').get(Authenticate, SubsUserCount);
router.route('/removefeature/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), removeFeature);

router.use('/:id/trade', tenXTradeRoute)
router.route('/my/todayorders/:subscription').get(Authenticate, myTodaysTrade)
router.route('/my/historyorders/:subscription/:usersubscription').get(Authenticate, myHistoryTrade)


module.exports = router;