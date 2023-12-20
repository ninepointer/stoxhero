const mongoose = require('mongoose');
const Coupon = require('../../models/coupon/coupon');
const MarginX = require('../../models/marginX/marginX');
const Product = require('../../models/Product/product');
const Setting = require('../../models/settings/setting');
const TenX = require('../../models/TenXSubscription/TenXSubscriptionSchema');
const DailyContest = require('../../models/DailyContest/dailyContest');
const{stringify} = require('flatted');
const moment = require('moment');
const AffiliateProgram = require('../../models/affiliateProgram/affiliateProgram');
const ReferralProgram = require("../../models/campaigns/referralProgram")
const User = require("../../models/User/userDetailSchema")

exports.createCouponCode = async (req, res) => {
    try {
        const {
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status, affiliatePercentage, eligiblePlatforms,
            isOneTimeUse, usedBy, maxUse, eligibleProducts, campaign, maxDiscount, minOrderValue
        } = req.body;

        const existingCode = await Coupon.findOne({ code: code, status:'Active' });

        if (existingCode) {
            return res.status(400).json({
                status: 'error',
                message: "Coupon code already exists.",
            });
        }

        const coupon = await Coupon.create({
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,affiliatePercentage, eligiblePlatforms,
            isOneTimeUse, usedBy, maxUse, eligibleProducts, campaign, maxDiscount, minOrderValue,
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
        const { id } = req.params;
        const updateFields = req.body;

        let coupon = await Coupon.findOne({ _id: id });

        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }

        updateFields.lastModifiedBy = req.user._id;
        coupon = await Coupon.findOneAndUpdate({  _id: id }, updateFields, { new: true });

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
        const activeCoupons = await Coupon.find({ status: 'Active', expiryDate:{$gte: new Date()} })
        .populate('usedBySuccessful.user', 'first_name last_name email mobile joining_date creationProcess')
        .populate('usedBy.user', 'first_name last_name email mobile creationProcess joining_date')
        .populate('usedBy.product', 'productName')
        .populate('usedBySuccessful.product', 'productName')

        await appendAdditionalData(activeCoupons);
        for (let i = 0; i < activeCoupons.length; i++) {
            // Replace each Mongoose document with a modified plain object
            activeCoupons[i] = calculateMetrics(activeCoupons[i]);
        }

        
        res.status(200).json({
            status: 'success',
            data: activeCoupons,
            count: activeCoupons.length
        });
        console.log('response sent');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getInActiveCouponCodes = async (req, res) => {
    try {
        const inactiveCoupons = await Coupon.find({ status: 'Inactive' })
        .populate('usedBySuccessful.user', 'first_name last_name email mobile joining_date creationProcess')
        .populate('usedBy.user', 'first_name last_name email mobile creationProcess joining_date')
        .populate('usedBy.product', 'productName')
        .populate('usedBySuccessful.product', 'productName')

        await appendAdditionalData(inactiveCoupons);
        for (let i = 0; i < inactiveCoupons.length; i++) {
            // Replace each Mongoose document with a modified plain object
            inactiveCoupons[i] = calculateMetrics(inactiveCoupons[i]);
        }

        
        res.status(200).json({
            status: 'success',
            data: inactiveCoupons,
            count: inactiveCoupons.length
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

exports.getDraftCouponCodes = async (req, res) => {
    try {
        const draftCoupons = await Coupon.find({ status: 'Draft' })
        .populate('usedBySuccessful.user', 'first_name last_name email mobile joining_date creationProcess')
        .populate('usedBy.user', 'first_name last_name email mobile joining_date creationProcess')
        .populate('usedBy.product', 'productName')
        .populate('usedBySuccessful.product', 'productName')

        await appendAdditionalData(draftCoupons);
        for (let i = 0; i < draftCoupons.length; i++) {
            // Replace each Mongoose document with a modified plain object
            draftCoupons[i] = calculateMetrics(draftCoupons[i]);
        }

        
        res.status(200).json({
            status: 'success',
            data: draftCoupons,
            count: draftCoupons.length
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

exports.getExpiredCouponCodes = async (req, res) => {
    try {
        const expiredCoupons = await Coupon.find({$or: [{status: 'Expired'}, {expiryDate: {$lt: new Date()}}]})
        .populate('usedBySuccessful.user', 'first_name last_name email mobile creationProcess joining_date')
        .populate('usedBy.user', 'first_name last_name email mobile creationProcess joining_date')
        .populate('usedBy.product', 'productName')
        .populate('usedBySuccessful.product', 'productName')

        await appendAdditionalData(expiredCoupons);
        for (let i = 0; i < expiredCoupons.length; i++) {
            // Replace each Mongoose document with a modified plain object
            expiredCoupons[i] = calculateMetrics(expiredCoupons[i]);
        }
        
        res.status(200).json({
            status: 'success',
            data: expiredCoupons,
            count: expiredCoupons.length
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
        const { code, product, orderValue, platform, paymentMode} = req.body;
        console.log("Coupon Data:",req.body)
        const userId = req.user._id;
        let coupon = await Coupon.findOne({ code: code, expiryDate:{$gte: new Date()}, status:'Active' });
        console.log("Coupon:",coupon)
        if(!coupon){
            let match = false;
            const affiliatePrograms = await AffiliateProgram.find({status:'Active'});
            if(affiliatePrograms.length != 0){
                
                for(program of affiliatePrograms){
                    match = program?.affiliates?.some(item => item?.affiliateCode.toString() == code?.toString());
                    if(match){
                        console.log('match', match, program?.maxDiscount);
                        //check for eligible platforms
                        if(program?.eligiblePlatforms?.length != 0 && !program?.eligiblePlatforms.includes(platform)){
                            return res.status(400).json({
                                status: 'error',
                                message: "This coupon is not valid for your device platform",
                            });
                        }

                        if(program?.minOrderValue && orderValue<program?.minOrderValue){
                            console.log("Inside Min Order and order value check:",paymentMode,program?.rewardType )
                            return res.status(400).json({
                                status: 'error',
                                message: `Your order is not eligible for this coupon. The minimum order value for this coupon is ₹${program?.minOrderValue}`,
                            });
                        }
                        //check for eligible products
                        if(program?.eligibleProducts?.length != 0 && !program?.eligibleProducts.includes(product)){
                            return res.status(400).json({
                                status: 'error',
                                message: "This coupon is not valid for the product you're purchasing.",
                            });
                        }
                        return res.status(200).json({
                            status: 'success',
                            data: {
                                discount: program?.discountPercentage,
                                discountType: 'Percentage',
                                rewardType: 'Discount',
                                maxDiscount: program?.maxDiscount
                            }
                        })
                    }
                }
            }   
            console.log("this is match", match)
            if(!match){
                const userCoupon = await User.findOne({myReferralCode: code?.toString()})
                if(req.user._id.toString() === userCoupon._id.toString()){
                    return res.status(400).json({
                        status: 'error',
                        message: "You cannot apply a self-coupon to your own purchase.",
                    });
                }
                const referralProgram = await ReferralProgram.findOne({status: "Active"});

                // console.log("referralProgram", referralProgram, userCoupon)
                if(userCoupon){
                    if(referralProgram?.affiliateDetails?.eligiblePlatforms?.length != 0 && !referralProgram?.affiliateDetails?.eligiblePlatforms.includes(platform)){
                        return res.status(400).json({
                            status: 'error',
                            message: "This coupon is not valid for your device platform",
                        });
                    }
                    //check for eligible products
                    if(referralProgram?.affiliateDetails?.eligibleProducts?.length != 0 && !referralProgram?.affiliateDetails?.eligibleProducts.includes(product)){
                        return res.status(400).json({
                            status: 'error',
                            message: "This coupon is not valid for the product you're purchasing.",
                        });
                    }
                    if(referralProgram?.affiliateDetails?.minOrderValue && orderValue<referralProgram?.affiliateDetails?.minOrderValue){
                        console.log("Inside Min Order and order value check:",paymentMode,referralProgram?.affiliateDetails?.rewardType )
                        return res.status(400).json({
                            status: 'error',
                            message: `Your order is not eligible for this coupon. The minimum order value for this coupon is ₹${referralProgram?.affiliateDetails?.minOrderValue}`,
                        });
                    }
                    return res.status(200).json({
                        status: 'success',
                        data: {
                            discount: referralProgram?.affiliateDetails?.discountPercentage,
                            discountType: 'Percentage',
                            rewardType: 'Discount',
                            maxDiscount: referralProgram?.affiliateDetails?.maxDiscount
                        }
                    })
                }
            }
        }
        
        if (!coupon) {
            return res.status(404).json({
                status: 'error',
                message: "Coupon code not found.",
            });
        }
        if(paymentMode=='wallet' && coupon?.rewardType == 'Cashback'){
            console.log("Payment Mode & RewardType:",paymentMode,coupon?.rewardType )
            return res.status(400).json({
                status: 'error',
                message: "This coupon is not valid for your selected payment mode",
            });
        }
        if(paymentMode=='addition' && coupon?.rewardType == 'Discount'){
            console.log("Payment Mode & RewardType:",paymentMode,coupon?.rewardType )
            return res.status(400).json({
                status: 'error',
                message: "This coupon is not valid for wallet topup",
            });
        }
        if(coupon?.eligiblePlatforms?.length != 0 && !coupon?.eligiblePlatforms.includes(platform)){
            return res.status(400).json({
                status: 'error',
                message: "This coupon is not valid for your device platform",
            });
        }
        if(coupon?.eligibleProducts?.length != 0 && !coupon?.eligibleProducts.includes(product)){
            return res.status(400).json({
                status: 'error',
                message: "This coupon is not valid for the product you're purchasing.",
            });
        }
        if(coupon?.isOneTimeUse){
            console.log("Inside Onetime Use:",paymentMode,coupon?.rewardType )
            if(coupon?.usedBySuccessful.length >0){
                const uses = coupon?.usedBySuccessful?.filter((item)=>item?.user?.toString() == userId?.toString());
                if(uses?.length>0){
                    return res.status(400).json({
                        status: 'error',
                        message: "You've already used this coupon once. Try another code.",
                    });
                }
            }
        }
        if(coupon?.minOrderValue && orderValue<coupon?.minOrderValue){
            console.log("Inside Min Order and order value check:",paymentMode,coupon?.rewardType )
            return res.status(400).json({
                status: 'error',
                message: `Your order is not eligible for this coupon. The minimum order value for this coupon is ₹${coupon?.minOrderValue}`,
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

exports.saveSuccessfulCouponUse = async (userId, code, product, specificProduct) => {
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
            specificProduct:specificProduct
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

async function getCollectionAndData(productName, specificProduct, coupon, userId, appliedOn) {
    // Determine the collection name and field name based on the productName
    // Replace the following logic with your own mapping of productName to collection name and field name
    let discountAmount = 0;
    let gstAmount =0;
    let setting = await Setting.findOne({}).select('gstPercentage');
    let gstPercentage = setting?.gstPercentage;
    let participants, participant;
    switch (productName) {
        case 'TenX':
            const subscription  = await TenX.findById(specificProduct).select('discounted_price plan_name users');
            participants = subscription?.users;
            participant = participants?.find(
                elem=>elem?.userId?.toString() == userId?._id?.toString() 
                && Math.abs(moment(appliedOn).diff(elem?.subscribedOn, 'seconds', true)) <= 5
                );  
            discountAmount = calculateDiscountAmount(coupon, subscription?.discounted_price);
            gstAmount = gstPercentage/100*(participant?.fee - participant?.bonusRedemption??0);
            return {
                name: subscription?.plan_name, 
                price: participant?.actualPrice??subscription?.discounted_price, 
                discountAmount: (participant?.actualPrice - participant?.fee +(participant?.bonusRedemption??0) )?(participant?.actualPrice - participant?.fee - (participant?.bonusRedemption??0)):discountAmount,
                bonusAmount:(participant?.bonusRedemption ?? 0),
                effectivePrice: (participant?.fee) + (gstAmount?gstAmount:0)
            }
            break;
        case 'MarginX':
            const marginx = await MarginX.findById(specificProduct).populate('marginXTemplate', 'entryFee').select('marginXName marginXTemplate participants');
            participants = marginx?.participants;
            participant = participants?.find(
                elem=>elem?.userId?.toString() == userId?._id?.toString()
                && Math.abs(moment(appliedOn).diff(elem?.boughtAt, 'seconds', true)) <= 5
                );
            discountAmount = calculateDiscountAmount(coupon, marginx?.marginXTemplate?.entryFee);
            gstAmount = gstPercentage/100*(participant?.fee - participant?.bonusRedemption??0);
            return {
                name: marginx?.marginXName, 
                price: participant?.actualPrice??marginx?.marginXTemplate?.entryFee, 
                discountAmount: (participant?.actualPrice - participant?.fee + participant?.bonusRedemption)?(participant?.actualPrice - participant?.fee - (participant?.bonusRedemption??0)):discountAmount,
                bonusAmount:(participant?.bonusRedemption ?? 0),
                effectivePrice: (participant?.fee) + (gstAmount?gstAmount:0)
            };
            break;
        case 'TestZone':
            const contest = await DailyContest.findById(specificProduct).select('contestName entryFee participants');
            participants = contest?.participants;
            participant = participants?.find(
                elem=>elem?.userId?.toString() == userId?._id?.toString()
                && Math.abs(moment(appliedOn).diff(elem?.participatedOn, 'seconds', true)) <= 5
                );
            discountAmount = calculateDiscountAmount(coupon, contest?.entryFee);
            gstAmount = gstPercentage/100*(participant?.fee - participant?.bonusRedemption??0);
            return {
                name: contest?.contestName, 
                price: participant?.actualPrice??contest?.entryFee, 
                discountAmount: (participant?.actualPrice - participant?.fee + participant?.bonusRedemption)?(participant?.actualPrice - participant?.fee-(participant?.bonusRedemption??0)):discountAmount,
                bonusAmount:(participant?.bonusRedemption ?? 0),
                effectivePrice: (participant?.fee) +(gstAmount?gstAmount:0)
            };
        case 'Wallet':
            return {
                name: '', 
                price: 0, 
                discountAmount:0,
                bonusAmount:0,
                effectivePrice:0
            };    
        default:
            throw new Error(`Unknown product name: ${productName}`);
    }
}

function calculateDiscountAmount(coupon, entryFee){
    let discountAmount = 0;
    if(coupon?.rewardType == 'Discount'){
        if(coupon?.discountType == 'Flat'){
            discountAmount = Math.min(coupon?.discount, coupon?.maxDiscount);
        }else{
            discountAmount = Math.min(coupon?.discount*entryFee/100, coupon?.maxDiscount)
        }
    }

    return discountAmount;
}

async function appendAdditionalDataa(coupons) {
    // Prepare a map to avoid fetching specificProduct more than once from the same collection
    // const specificProductCache = new Map();
    // Iterate through the coupons to fetch specificProduct details
    for (let coupon of coupons) {
        const couponObj = coupon.toObject();
        for (let usedBySuccessful of couponObj?.usedBySuccessful) {
            // const cacheKey = `${usedBySuccessful.product.productName}_${usedBySuccessful?.specificProduct?.toString()}`;
            // if (specificProductCache.has(cacheKey)) {
            //     usedBySuccessful.specificProductDetail = specificProductCache.get(cacheKey);
            // } else {
                // Call getCollectionAndData function to get specific product details
                const specificProductDetail = await getCollectionAndData(
                    usedBySuccessful.product.productName,
                    usedBySuccessful.specificProduct,
                    coupon
                );
                console.log('product detail', specificProductDetail);
                // usedBySuccessful.specificProductDetail = specificProductDetail;
                usedBySuccessful.specificProductDetail = specificProductDetail;
                // specificProductCache.set(cacheKey, specificProductDetail);
            // }
        }
    }
}
async function appendaAdditionalData(coupons) {
    try {
        // Prepare a map to avoid fetching specificProduct more than once from the same collection
        const specificProductCache = new Map();

        // Iterate through the coupons to fetch specificProduct details
        for (let coupon of coupons) {
            // Convert Mongoose document to a plain object
            const couponObj = coupon.toObject();

            for (let i = 0; i < coupon.usedBySuccessful.length; i++) {
                const usedBySuccessful = coupon.usedBySuccessful[i];
                const cacheKey = `${usedBySuccessful.product.productName}_${usedBySuccessful?.specificProduct?.toString()}`;
                if (specificProductCache.has(cacheKey)) {
                    couponObj.usedBySuccessful[i].specificProductDetail = specificProductCache.get(cacheKey);
                } else {
                    // Call getCollectionAndData function to get specific product details
                    const specificProductDetail = await getCollectionAndData(
                        usedBySuccessful.product.productName,
                        usedBySuccessful.specificProduct,
                        coupon
                    );
                    couponObj.usedBySuccessful[i].specificProductDetail = specificProductDetail;
                    specificProductCache.set(cacheKey, specificProductDetail);
                }
            }

            // Replace the original Mongoose document with the modified plain object
            coupons[coupons.indexOf(coupon)] = couponObj;
        }
    } catch (error) {
        console.error('Error appending additional data:', error);
    }
}
async function appendAdditionalData(coupons) {
    try {
        // Prepare a map to avoid fetching specificProduct more than once from the same collection

        // Iterate through the coupons to fetch specificProduct details
        for (let coupon of coupons) {
            // Convert Mongoose document to a plain object
            const couponObj = coupon.toObject();

            for (let i = 0; i < coupon.usedBySuccessful.length; i++) {
                const usedBySuccessful = coupon.usedBySuccessful[i];
                    // Call getCollectionAndData function to get specific product details
                    const specificProductDetail = await getCollectionAndData(
                        usedBySuccessful.product.productName,
                        usedBySuccessful.specificProduct,
                        coupon,
                        usedBySuccessful?.user,
                        usedBySuccessful?.appliedOn,
                    );
                    couponObj.usedBySuccessful[i].specificProductDetail = specificProductDetail;
                }
            // Replace the original Mongoose document with the modified plain object
            coupons[coupons.indexOf(coupon)] = couponObj;
        }    
    } catch (error) {
        console.error('Error appending additional data:', error);
    }
}

function calculateMetrics(coupon) {
    // Convert Mongoose document to a plain object if it's not already
    const couponObj = coupon.toObject ? coupon.toObject() : coupon;

    // Initialize counters
    let metrics = {
        totalRevenue: 0,
        totalDiscount: 0,
        totalPurchases: 0,
        totalBonus:0,
        tenXPurchases: 0,
        marginXPurchases: 0,
        contestPurchases: 0,
        tenXRevenue: 0,
        tenXDiscount: 0,
        marginXRevenue: 0,
        marginXDiscount: 0,
        contestRevenue: 0,
        contestDiscount: 0,
        contestBonus:0,
        tenXBonus:0,
        marginXBonus:0
    };

    // Iterate through each usedBySuccessful entry
    for (let usedBySuccessful of couponObj.usedBySuccessful) {
        // Access the specificProductDetail
        const detail = usedBySuccessful.specificProductDetail;

        // Update total counters
        metrics.totalRevenue += detail.effectivePrice??0;
        metrics.totalDiscount += detail.discountAmount??0;
        metrics.totalBonus += detail.bonusAmount??0;
        metrics.totalPurchases++;

        // Update counters based on product type
        switch (usedBySuccessful.product.productName) {
            case 'TenX':
                metrics.tenXPurchases++;
                metrics.tenXRevenue += detail?.effectivePrice ?? 0;
                metrics.tenXDiscount += detail?.discountAmount?? 0;
                metrics.tenXBonus += detail?.bonusAmount??0;
                break;
            case 'MarginX':
                metrics.marginXPurchases++;
                metrics.marginXRevenue += detail?.effectivePrice??0;
                metrics.marginXDiscount += detail?.discountAmount??0;
                metrics.marginXBonus += detail?.bonusAmount??0;
                break;
            case 'TestZone':
                metrics.contestPurchases++;
                metrics.contestRevenue += detail?.effectivePrice??0;
                metrics.contestDiscount += detail?.discountAmount??0;
                metrics.contestBonus += detail?.bonusAmount??0;
                break;
            default:
                console.log(`Unknown product name: ${usedBySuccessful.product.productName}`);
                break;
        }
    }

    // Assign metrics to the plain object
    couponObj.metrics = metrics;

    return couponObj;  // Return the modified plain object
}

function calculateMetricss(coupon) {
    const couponObj = coupon.toObject ? coupon.toObject() : coupon;
    // Initialize counters
    let metrics = {
        totalRevenue: 0,
        totalDiscount: 0,
        totalPurchases: 0,
        tenXPurchases: 0,
        marginXPurchases: 0,
        contestPurchases: 0,
        tenXRevenue: 0,
        tenXDiscount: 0,
        marginXRevenue: 0,
        marginXDiscount: 0,
        contestRevenue: 0,
        contestDiscount: 0,
    };

    // Iterate through each coupon
        // Iterate through each usedBySuccessful entry
        for (let usedBySuccessful of coupon.usedBySuccessful) {
            // Access the specificProductDetail
            const detail = usedBySuccessful?.specificProductDetail;

            // Update total counters
            metrics.totalRevenue += detail?.effectivePrice;
            metrics.totalDiscount += detail?.discountAmount;
            metrics.totalPurchases++;

            // Update counters based on product type
            switch (usedBySuccessful?.product?.productName) {
                case 'TenX':
                    metrics.tenXPurchases++;
                    metrics.tenXRevenue += detail?.effectivePrice;
                    metrics.tenXDiscount += detail?.discountAmount;
                    break;
                case 'MarginX':
                    metrics.marginXPurchases++;
                    metrics.marginXRevenue += detail?.effectivePrice;
                    metrics.marginXDiscount += detail?.discountAmount;
                    break;
                case 'TestZone':
                    metrics.contestPurchases++;
                    metrics.contestRevenue += detail?.effectivePrice;
                    metrics.contestDiscount += detail?.discountAmount;
                    break;
                default:
                    console.log(`Unknown product name: ${usedBySuccessful?.product?.productName}`);
                    break;
            }
        }
        couponObj.metrics = metrics;
        return couponObj;
    
}