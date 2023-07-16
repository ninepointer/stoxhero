const express = require("express");
const router = express.Router({mergeParams: true});
const {createPayment, getPayment, getUserPayment, getUsers} = require('../../controllers/paymentController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPayment).get(getPayment);
router.route('/users').get(Authenticate, getUsers)
router.route('/user/:id').get(getUserPayment);


module.exports = router;
