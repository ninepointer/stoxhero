const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({ mergeParams: true });
// const { removeAffiliateUser, createAffiliate, editAffiliate, getAffiliates, affiliateLeaderboard,
//     getAffiliateById, addAffiliateUser, getActiveAffiliatePrograms, getStoxHeroAffiliateOverview, getOfflineInstituteAffiliateOverview,
//     getInactiveAffiliatePrograms, getDraftAffiliatePrograms, getAffiliateOverview, getYoutubeAffiliateOverview, getMyAffiliateTransaction,
//     getExpiredAffiliatePrograms, getAffiliateProgramTransactions, getMyAffiliatePayout, getAffiliateReferralsSummery } = require('../../controllers/influencer/influencerController');
const restrictTo = require('../../authentication/authorization');
const controller = require('../../controllers/influencer/influencerController');
// router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.createAffiliate).
//     get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getAffiliates);
// router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getActiveAffiliatePrograms);
// router.route('/leaderboard').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), affiliateLeaderboard);
// router.route('/myaffiliaterafferals').get(Authenticate, getAffiliateReferralsSummery);
// router.route('/mysummery').get(Authenticate, getMyAffiliatePayout);
router.route('/mytransactions').get(Authenticate, controller.getMyInfluencerTransaction);

router.route('/overview').get(Authenticate, controller.getBasicInfluencerOverview);
router.route('/last30daysdata').get(Authenticate, controller.getLast30daysInfluencerData);

router.route('/userdata').get(Authenticate, controller.getInfluencerUsersApi);
router.route('/last60daysuserdata').get(Authenticate, controller.getLast60daysInfluencerUserData);


router.route('/revenuedata').get(Authenticate, controller.getInfluencerRevenueApi);
router.route('/last60daysrevenuedata').get(Authenticate, controller.getLast60daysInfluencerRevenueData);

// router.route('/affiliatetype').get(Authenticate, controller.getAffiliateType);
// router.route('/programbytype').get(Authenticate, controller.getAffiliateProgrammeByType);
// router.route('/affiliatebyprograme').get(Authenticate, controller.getAffiliateByProgramme);


// router.route('/adminsummery').get(Authenticate, controller.getAdminAffiliatePayout);
// router.route('/admintransactions').get(Authenticate, controller.getAdminAffiliateTransaction);
// router.route('/adminaffiliaterafferals').get(Authenticate, controller.getAdminAffiliateReferralsSummery);
// router.route('/adminlast30daysdata').get(Authenticate, controller.getAdminLast30daysAffiliateData);
// router.route('/adminoverview').get(Authenticate, controller.getAdminBasicAffiliateOverview);


// router.route('/affiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getAffiliateOverview);
// router.route('/ytaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getYoutubeAffiliateOverview);
// router.route('/shaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getStoxHeroAffiliateOverview);
// router.route('/oiaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getOfflineInstituteAffiliateOverview);
// router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getDraftAffiliatePrograms);
// router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getInactiveAffiliatePrograms);
// router.route('/expired').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getExpiredAffiliatePrograms);
// router.route('/transactions/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getAffiliateProgramTransactions);
// router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.editAffiliate).
//     get(Authenticate, restrictTo('Admin', 'SuperAdmin'), controller.getAffiliateById);

// router.patch('/:id/:userId', Authenticate, addAffiliateUser);
// router.patch('/remove/:id/:userId', Authenticate, removeAffiliateUser);



module.exports = router;