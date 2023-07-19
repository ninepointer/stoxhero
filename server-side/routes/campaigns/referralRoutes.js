const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const axios = require('axios');
// const Contest = require('../../models/Contest/contestSchema');
const {createReferral, getReferral, editReferral, getReferrals, 
    getActiveReferral, editReferralWithId, getReferralLeaderboard, getMyLeaderBoardRank} = require('../../controllers/referral');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');



router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), createReferral).get(getReferrals)
.patch(Authenticate, restrictTo('Admin', 'Super Admin'), editReferral);
router.route('/active').get(getActiveReferral)
router.route('/leaderboard').get(getReferralLeaderboard);
router.route('/myrank').get(Authenticate, getMyLeaderBoardRank);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), editReferralWithId).get(getReferral)
module.exports = router;