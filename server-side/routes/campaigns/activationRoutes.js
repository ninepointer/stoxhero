const express = require("express");
const router = express.Router();

// const {getReferredProduct, getReferralName, createReferral, getReferral, editActivation, getReferrals, 
//     getActiveactivation, editReferralWithId, getReferralLeaderboard, getMyLeaderBoardRank} = require('../../controllers/referral');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const activation = require('../../controllers/activationProgramme');



router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), activation.createActivation).get(activation.getActivations)
.patch(Authenticate, restrictTo('Admin', 'Super Admin'), activation.editActivation);
router.route('/active').get(activation.getActiveactivation)
router.route('/name').get(Authenticate, restrictTo('Admin', 'Super Admin'), activation.getActivationName)
// router.route('/leaderboard').get(activation.getReferralLeaderboard);
// router.route('/myrank').get(Authenticate, activation.getMyLeaderBoardRank);
// router.route('/referredproduct').get(Authenticate, activation.getReferredProduct);

router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), activation.editActivation).get(activation.getActivation)
module.exports = router;