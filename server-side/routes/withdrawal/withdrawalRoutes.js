const express = require("express");
const router = express.Router({mergeParams: true});
const Withdrawal = require('../../models/withdrawal/withdrawal');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const{getAllWithdrwals, getPendingWithdrawals, getInitiatedWithdrawals, 
    getRejectedWithdrawals, getWithdrawalsUser, createWithdrawal, 
    approveWithdrawal, rejectWithdrawal, processWithdrawal, getApprovedWithdrawals,
    uploadMulter, uploadToS3,resizePhoto
}=require('../../controllers/withdrawalController');

const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(Authenticate, getAllWithdrwals).post(Authenticate, createWithdrawal);
router.route('/pending').get(Authenticate, restrictTo('Admin', 'Super Admin'), getPendingWithdrawals);
router.route('/initiated').get(Authenticate, restrictTo('Admin', 'Super Admin'), getInitiatedWithdrawals);
router.route('/rejected').get(Authenticate, restrictTo('Admin', 'Super Admin'), getRejectedWithdrawals);
router.route('/approved').get(Authenticate, restrictTo('Admin', 'Super Admin'), getApprovedWithdrawals);
router.route('/mywithdrawals').get(Authenticate, currentUser, getWithdrawalsUser);
router.route('/approve/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), uploadMulter, uploadToS3, approveWithdrawal);
router.route('/reject/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), rejectWithdrawal);
router.route('/process/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), processWithdrawal);




module.exports = router;