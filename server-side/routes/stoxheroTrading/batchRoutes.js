const express = require("express");
const router = express.Router({mergeParams: true});
const {createBatch, getBatch, editBatch, getApplicant, applyToBatch, approveUser} = require('../../controllers/batchController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createBatch).get(getBatch);
router.route('/:id').get(Authenticate, getApplicant).patch(Authenticate, editBatch);
router.route('/:id/apply').patch(Authenticate, applyToBatch)
router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
