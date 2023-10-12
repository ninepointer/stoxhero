const mongoose = require('mongoose');
const Coupon = require('../../models/coupon/coupon');
const MarginX = require('../../models/marginX/marginX');
const Product = require('../../models/Product/product');
const Setting = require('../../models/settings/setting');
const TenX = require('../../models/TenXSubscription/TenXSubscriptionSchema');
const DailyContest = require('../../models/DailyContest/dailyContest');
const{stringify} = require('flatted');


exports.createCouponCode = async (req, res) => {
    try {
        const {
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,
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
            code, description, discountType, rewardType, discount, liveDate, expiryDate, status,
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
            metrics,
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
            metrics,
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
        const { code, product, orderValue } = req.body;
        const userId = req.user._id;
        let coupon = await Coupon.findOne({ code: code, expiryDate:{$gte: new Date()}, status:'Active' });

        
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
        if(coupon?.isOneTimeUse){
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
            return res.status(400).json({
                status: 'error',
                message: `Your order is not eligible for this coupon. The minimum order value for this couon is ${coupon?.minOrderValue}`,
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

async function getCollectionAndData(productName, specificProduct, coupon) {
    // Determine the collection name and field name based on the productName
    // Replace the following logic with your own mapping of productName to collection name and field name
    let discountAmount = 0;
    let gstAmount =0;
    let setting = await Setting.findOne({}).select('gstPercentage');
    let gstPercentage = setting?.gstPercentage;
    switch (productName) {
        case 'TenX':
            const subscription  = await TenX.findById(specificProduct).select('discounted_price plan_name');
            discountAmount = calculateDiscountAmount(coupon, subscription?.discounted_price);
            gstAmount = gstPercentage/100*(subscription?.discounted_price-discountAmount);
            return {name: subscription?.plan_name, price: subscription?.discounted_price, discountAmount, effectivePrice: (subscription?.discounted_price- discountAmount+gstAmount)}
        case 'MarginX':
            const marginx = await MarginX.findById(specificProduct).populate('marginXTemplate', 'entryFee').select('marginXName marginXTemplate');
            discountAmount = calculateDiscountAmount(coupon, marginx?.marginXTemplate?.entryFee);
            gstAmount = gstPercentage/100*(marginx?.marginXTemplate?.entryFee-discountAmount);
            return { name: marginx?.marginXName, price: marginx?.marginXTemplate?.entryFee, discountAmount, effectivePrice: (marginx?.marginXTemplate?.entryFee- discountAmount+gstAmount) };
        case 'Contest':
            const contest = await DailyContest.findById(specificProduct).select('contestName entryFee');
            discountAmount = calculateDiscountAmount(coupon, contest?.entryFee);
            gstAmount = gstPercentage/100*(contest?.entryFee-discountAmount);
            return { name: contest?.contestName, price: contest?.entryFee, discountAmount, effectivePrice: (contest?.entryFee- discountAmount+gstAmount) };
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
async function appendAdditionalData(coupons) {
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

function calculateMetrics(coupon) {
    // Convert Mongoose document to a plain object if it's not already
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

    // Iterate through each usedBySuccessful entry
    for (let usedBySuccessful of couponObj.usedBySuccessful) {
        // Access the specificProductDetail
        const detail = usedBySuccessful.specificProductDetail;

        // Update total counters
        metrics.totalRevenue += detail.effectivePrice;
        metrics.totalDiscount += detail.discountAmount;
        metrics.totalPurchases++;

        // Update counters based on product type
        switch (usedBySuccessful.product.productName) {
            case 'TenX':
                metrics.tenXPurchases++;
                metrics.tenXRevenue += detail.effectivePrice;
                metrics.tenXDiscount += detail.discountAmount;
                break;
            case 'MarginX':
                metrics.marginXPurchases++;
                metrics.marginXRevenue += detail.effectivePrice;
                metrics.marginXDiscount += detail.discountAmount;
                break;
            case 'Contest':
                metrics.contestPurchases++;
                metrics.contestRevenue += detail.effectivePrice;
                metrics.contestDiscount += detail.discountAmount;
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
                case 'Contest':
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