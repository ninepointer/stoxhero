const mongoose = require('mongoose');
const Coupon = require('../../models/coupon/coupon');
const Product = require('../../models/Product/product');


exports.createCouponCode = async (req, res) => {
    try {
        const {
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,
            isOneTimeUse, usedBy, maxUse, eligibleProducts, campaign
        } = req.body;

        const existingCode = await Coupon.findOne({ code: code });

        if (existingCode) {
            return res.status(400).json({
                status: 'error',
                message: "Coupon code already exists.",
            });
        }

        const coupon = await Coupon.create({
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

        let coupon = await Coupon.findOne({ code: code });

        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }

        updateFields.lastModifiedBy = req.user._id;
        coupon = await Coupon.findOneAndUpdate({ code: code }, updateFields, { new: true });

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
        const coupons = await Coupon.find();
        
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
        const activeCoupons = await Coupon.find({ status: 'Active' });
        
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
        const userId = req.user._id;
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
        coupon?.usedBy?.push({
            user: userId,
            appliedOn: new Date(),
            product
        });
        await coupon.save({validateBeforeSave:false});
        res.status(200).json({
            status: 'success',
            data: {
                discount: coupon.discount,
                discountType: coupon.discountType,
                rewardType: coupon.rewardType,
                maxDiscount: coupon?.maxDiscount,
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

exports.getActiveProductCouponCodes = async(req,res,next) => {
    try{
        const {productId} = req.params;
        let coupons = await Coupon.find({expiryDate:{$gte: new Date()}, status:'Active', eligibleProducts:{$in:[productId]} });

        if(coupons.length == 0){
            return res.status(404).json({
                status: 'error',
                message: "No coupons found for this product",
            });
        }

        
        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
}

// exports.saveSuccessfulCouponUse = async(userId, code, product)=>{
//     const coupon = await Coupon.findOne({code}).select('usedBy usedBySuccessful');
//     let productString = product
//     if(product == 'TenX Renewal') productString = 'TenX';
//     const product = await Product.findOne({productName:productString});
//     if(!coupon){
//         //error
//     }
//     //Add user to the usedBySuccessful array field
//     coupon.usedBySuccessful.push({
//         user:userId,
//         appliedOn:new Date(),
//         product: product?._id
//     });

//     //remove last user element from the usedBySuccessful array
//     let userAppliedCoupons = coupon.usedBy.filter((item)=> item?.user == userId);
//     //Do this and update the usedBy field in the document such that the last element of userApplied Coupons is deleted from usedBy

// }

exports.saveSuccessfulCouponUse = async (userId, code, product) => {
    try {
        const coupon = await Coupon.findOne({ code }).select('usedBy usedBySuccessful');
        if (!coupon) {
            throw new Error('Coupon not found');
        }
        let productDoc;
        let productString = product;
        if (product === 'TenX Renewal') productString = 'TenX';
        console.log(userId, code, product);

        if(mongoose.Types.ObjectId.isValid(product)){
            productDoc = await Product.findOne({ _id: productString });
        }else{
            productDoc = await Product.findOne({ productName: productString });
        }

        if (!productDoc) {
            throw new Error('Product not found');
        }

        // Add user to the usedBySuccessful array field
        coupon.usedBySuccessful.push({
            user: userId,
            appliedOn: new Date(),
            product: productDoc._id,
        });

        // Remove the last user element from the usedBySuccessful array if exists
        let userAppliedCoupons = coupon.usedBy.filter(item => item?.user.toString() === userId.toString());

        if (userAppliedCoupons.length > 0) {
            const lastAppliedIndex = coupon.usedBy.findIndex(item => item._id.toString() === userAppliedCoupons[userAppliedCoupons.length - 1]._id.toString());
            if (lastAppliedIndex !== -1) {
                coupon.usedBy.splice(lastAppliedIndex, 1);
            }
        }

        await coupon.save({validateBeforeSave:false});

    } catch (error) {
        // Handle the error (e.g., logging, throw it further, etc.)
        console.error(error);
        throw error;
    }
}
