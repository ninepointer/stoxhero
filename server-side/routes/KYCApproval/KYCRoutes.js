const express = require("express");
const router = express.Router({mergeParams: true});
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const {getAllPendingApprovalKYC, getApporvedKYC, getRejectedKYCS, approveKYC, rejectKYC} = require('../../controllers/KYCController');

const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/pendingapproval').get(Authenticate, restrictTo('Admin', 'Super Admin'), getAllPendingApprovalKYC);
router.route('/rejected').get(Authenticate, restrictTo('Admin', 'Super Admin'), getRejectedKYCS);
router.route('/approved').get(Authenticate, restrictTo('Admin', 'Super Admin'), getApporvedKYC);
router.route('/approve/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), approveKYC);
router.route('/reject/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), rejectKYC);


module.exports = router;