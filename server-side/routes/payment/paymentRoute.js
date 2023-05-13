const express = require("express");
const router = express.Router({mergeParams: true});
const {createPayment, getPayment, getUserPayment} = require('../../controllers/paymentController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPayment).get(getPayment);
router.route('/user/:id').get(getUserPayment);
// router.route('/appliedBatch').get(Authenticate, appliedBatch);
// router.route('/:id').get(Authenticate, getApplicant).patch(Authenticate, editBatch);
// router.route('/:id/apply').patch(Authenticate, applyToBatch)
// router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
