const mongoose = require('mongoose');
const Coupon = require('../../models/coupon/coupon');


exports.createCouponCode = async (req, res) => {
    try {
        const {
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,
            isOneTimeUse, usedBy, maxUse, eligibleProducts, campaign
        } = req.body;

        const existingCode = await couponCodeSchema.findOne({ code: code });

        if (existingCode) {
            return res.status(400).json({
                status: 'error',
                message: "Coupon code already exists.",
            });
        }

        const coupon = await couponCodeSchema.create({
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,
            isOneTimeUse, usedBy, maxUse, eligibleProducts, campaign,
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "Coupon code created successfully",
            data: coupon
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.editCouponCode = async (req, res) => {
    try {
        const { code } = req.params;
        const updateFields = req.body;

        let coupon = await couponCodeSchema.findOne({ code: code });

        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }

        updateFields.lastModifiedBy = req.user._id;
        coupon = await couponCodeSchema.findOneAndUpdate({ code: code }, updateFields, { new: true });

        res.status(200).json({
            status: 'success',
            message: "Coupon code updated successfully",
            data: coupon
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getAllCouponCodes = async (req, res) => {
    try {
        const coupons = await couponCodeSchema.find();
        
        res.status(200).json({
            status: 'success',
            data: coupons
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getActiveCouponCodes = async (req, res) => {
    try {
        const activeCoupons = await couponCodeSchema.find({ status: 'Active' });
        
        res.status(200).json({
            status: 'success',
            data: activeCoupons
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.verifyCouponCode = async (req, res) => {
    try {
        const { code, product } = req.body;

        let coupon = await Coupon.findOne({ code: code, expiryDate:{$gte: new Date()} });

        
        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }
        if(coupon?.eligibleProducts?.length != 0 && !coupon?.eligibleProducts.includes(product)){
            return res.status(400).json({
                status: 'error',
                message: "This coupon is not valid for the product you're purchasing.",
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                discount: coupon.discount,
                discountType: coupon.discountType
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

