const express = require("express");
const router = express.Router({mergeParams: true});
const {getFullTransactions, getAllTransactions, createUserWallet, getUserWallets, getUserWallet, myWallet, deductSubscriptionAmount} = require('../../controllers/userWalletController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createUserWallet).get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUserWallets)

router.route('/wallet').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getUserWallet)
router.route('/my').get(Authenticate, myWallet);
router.route('/alltransaction').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllTransactions)
router.route('/fulltransaction').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getFullTransactions)

router.route('/deduct').patch(Authenticate, deductSubscriptionAmount)

module.exports = router;