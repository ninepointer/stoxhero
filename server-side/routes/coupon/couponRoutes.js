const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createCouponCode, editCouponCode, getAllCouponCodes,
        getActiveCouponCodes, getActiveProductCouponCodes, verifyCouponCode
} = require('../../controllers/coupon/couponController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), createCouponCode).get(getAllCouponCodes);
router.route('/active').get(getActiveCouponCodes);
router.route('/active/:productId').get(getActiveProductCouponCodes);
router.route('/verify').post(verifyCouponCode);
router.route('/:id').patch(editCouponCode);



module.exports = router;