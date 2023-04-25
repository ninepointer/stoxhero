const express = require("express");
const router = express.Router({mergeParams: true});
const {createUserWallet, getUserWallets, getUserWallet, myWallet} = require('../../controllers/userWalletController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createUserWallet).get(getUserWallets)
router.route('/wallet').get(getUserWallet)
router.route('/my').get(Authenticate, myWallet)

module.exports = router;