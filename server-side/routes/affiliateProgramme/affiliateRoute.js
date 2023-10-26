const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({ mergeParams: true });
const { createAffiliate, editAffiliate, getAffiliates, getAffiliateById, addAffiliateUser, getActiveAffiliatePrograms, getInactiveAffiliatePrograms, getDraftAffiliatePrograms, getExpiredAffiliatePrograms } = require('../../controllers/affiliateProgramme/affiliateController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createAffiliate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliates);
router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getActiveAffiliatePrograms);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftAffiliatePrograms);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getInactiveAffiliatePrograms);
router.route('/expired').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getExpiredAffiliatePrograms);
router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'), editAffiliate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAffiliateById);

router.patch('/:id/:userId', Authenticate, addAffiliateUser);


module.exports = router;