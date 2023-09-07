const express = require("express");
const router = express.Router({mergeParams: true});
const {createPayment, getPayment, getUserPayment, getUsers, initiatePayment, handleCallback, checkPaymentStatus} = require('../../controllers/paymentController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createPayment).get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getPayment);
router.route('/initiate').post(Authenticate, initiatePayment);
router.route('/callback').post(handleCallback);
router.route('/users').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUsers)
router.route('/checkstatus/:merchantTransactionId').get(Authenticate, checkPaymentStatus);
router.route('/user/:id').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUserPayment);


module.exports = router;
//paymentRoute