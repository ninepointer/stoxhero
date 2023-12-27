const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({ mergeParams: true });
const { removeAffiliateUser, createAffiliate, editAffiliate, getAffiliates, affiliateLeaderboard,
    getAffiliateById, addAffiliateUser, getActiveAffiliatePrograms, getStoxHeroAffiliateOverview, getOfflineInstituteAffiliateOverview,
    getInactiveAffiliatePrograms, getDraftAffiliatePrograms, getAffiliateOverview, getYoutubeAffiliateOverview, getMyAffiliateTransaction,
    getExpiredAffiliatePrograms, getAffiliateProgramTransactions, getMyAffiliatePayout, getAffiliateReferralsSummery } = require('../../controllers/affiliateProgramme/affiliateController');
const restrictTo = require('../../authentication/authorization');
const controller = require('../../controllers/affiliateProgramme/affiliateController');
router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createAffiliate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliates);
router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getActiveAffiliatePrograms);
router.route('/leaderboard').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), affiliateLeaderboard);
router.route('/myaffiliaterafferals').get(Authenticate, getAffiliateReferralsSummery);
router.route('/mysummery').get(Authenticate, getMyAffiliatePayout);
router.route('/mytransactions').get(Authenticate, getMyAffiliateTransaction);

router.route('/overview').get(Authenticate, controller.getBasicAffiliateOverview);
router.route('/last30daysdata').get(Authenticate, controller.getLast30daysAffiliateData);
router.route('/affiliatetype').get(Authenticate, controller.getAffiliateType);
router.route('/programbytype').get(Authenticate, controller.getAffiliateProgrammeByType);
router.route('/affiliatebyprograme').get(Authenticate, controller.getAffiliateByProgramme);

router.route('/affiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliateOverview);
router.route('/ytaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getYoutubeAffiliateOverview);
router.route('/shaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getStoxHeroAffiliateOverview);
router.route('/oiaffiliateoverview').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getOfflineInstituteAffiliateOverview);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftAffiliatePrograms);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getInactiveAffiliatePrograms);
router.route('/expired').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getExpiredAffiliatePrograms);
router.route('/transactions/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliateProgramTransactions);
router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'), editAffiliate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliateById);

router.patch('/:id/:userId', Authenticate, addAffiliateUser);
router.patch('/remove/:id/:userId', Authenticate, removeAffiliateUser);



module.exports = router;