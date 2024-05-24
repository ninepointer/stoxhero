const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createCouponCode, editCouponCode, getAllCouponCodes, getInActiveCouponCodes, getExpiredCouponCodes, 
        getActiveCouponCodes, getActiveProductCouponCodes, verifyCouponCode, getDraftCouponCodes, 
} = require('../../controllers/coupon/couponController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), createCouponCode).get(getAllCouponCodes);
router.route('/active').get(Authenticate, getActiveCouponCodes);
router.route('/inactive').get(Authenticate, getInActiveCouponCodes);
router.route('/draft').get(Authenticate, getDraftCouponCodes);
router.route('/expired').get(Authenticate, getExpiredCouponCodes);

router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), editCouponCode);

router.route('/active/:productId').get(Authenticate, getActiveProductCouponCodes);
router.route('/verify').post(Authenticate, verifyCouponCode);



module.exports = router;