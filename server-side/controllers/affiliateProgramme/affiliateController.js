const mongoose = require('mongoose');
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");
const Wallet = require("../../models/UserWallet/userWalletSchema");
const{createUserNotification} = require('../notification/notificationController');


// Controller for creating a affiliate
exports.createAffiliate = async (req, res) => {
    try {
        const { affiliateProgramName ,startDate ,endDate ,commissionPercentage ,discountPercentage, 
            eligiblePlatforms, eligibleProducts, description, status  } = req.body;

        const affiliate = await Affiliate.create({
            affiliateProgramName ,startDate ,endDate ,commissionPercentage ,discountPercentage, 
            eligiblePlatforms, eligibleProducts, description, status,
            createdBy: req.user._id, lastModifiedBy: req.user._id,
        });

        res.status(201).json({
            status: 'success',
            message: "Affiliate programme created successfully",
            data: affiliate
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

// Controller for editing a affiliate
exports.editAffiliate = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid affiliate ID" });
        }

        const result = await Affiliate.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Affiliate not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Affiliate updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Error in updating contest",
            error: error.message
        });
    }
};

exports.getAffiliates = async (req, res) => {
    try {
        const affiliates = await Affiliate.find()
        .populate('affiliates.userId', 'first_name last_name')
        .populate('eligibleProducts', '_id productName')
        res.status(200).json({
            status: "success",
            message: "affiliates fetched successfully",
            data: affiliates
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getAffiliateById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await Affiliate.findOne({_id: id})

        res.status(200).json({
            status: "success",
            message: "Affiliate fetched successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.addAffiliateUser = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to add
        const {myReferralCode} = req.body;
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        }

        const result = await Affiliate.findByIdAndUpdate(
          id,
          {
            $push: {
            affiliates: { userId: userId, joinedOn: new Date(), affiliateCode: myReferralCode },
            }
          },
          { new: true } // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Affiliate not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User added to allowedUsers successfully",
            data: result
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.creditAffiliateAmount = async(affiliate, affiliateProgram, product, specificProduct, actualPrice, buyer) => {
    //add amount to wallet
    const wallet = await Wallet.findOne({userId: new ObjectId(affiliate?._id)});
    const user = await User.findOne({_id:buyer}).select('first_name last_name');
    const productDoc = await Product.findOne({_id: product});
    const affiliateUser = await User.findOne({_id:affiliate?.userId}).select('first_name last_name mobile');
    let discount = Math.min(affiliateProgram?.discount/100 * actualPrice, affiliateProgram?.maxDiscount);
    const affiliatePayout = affiliateProgram?.commissionPercentage * (actualPrice- discount);
    let walletTransactionId = uuid.v4();
    wallet?.transactions?.push({
        title: 'StoxHero Affiliate Reward Credit',
        description: `Amount credited for affiliate reward for ${user?.first_name} ${user?.last_name}'s product purchase`,
        transactionDate: new Date(),
        amount:affiliatePayout?.toFixed(2),
        transactionId: walletTransactionId,
        transactionType: 'Cash'
    });
    
    //create affiliate transaction
    await AffiliateTransaction.create({
        affiliateProgram: new ObjectId(affiliateProgram?._id),
        affiliateWalletTId: walletTransactionId,
        product: new ObjectId(product),
        specificProduct: new ObjectId(specificProduct),
        productActualPrice: actualPrice,
        productDiscountedPrice: actualPrice - discount,
        buyer: new ObjectId(buyer),
        affiliate: new ObjectId(affiliate?.userId),
        lastModifiedBy: new ObjectId(buyer),
        affiliatePayout: affiliatePayout
    })
    
    //send whatsapp message
    try{
        if(process.env.PROD == 'true'){
          whatsAppService.sendWhatsApp({destination : affiliateUser?.mobile, campaignName : 'affiliate_transaction_campaign', userName : affiliateUser?.first_name, source : affiliateUser?.creationProcess, templateParams : [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice-discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags : '', attributes : ''});
          whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'affiliate_transaction_campaign', userName : user?.first_name, source : user?.creationProcess, templateParams : [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice-discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags : '', attributes : ''});
        }else {
          whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'affiliate_transaction_campaign', userName : affiliateUser?.first_name, source : affiliateUser?.creationProcess, templateParams : [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice-discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags : '', attributes : ''});
          whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'affiliate_transaction_campaign', userName : affiliateUser?.first_name, source : affiliateUser?.creationProcess, templateParams : [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice-discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags : '', attributes : ''});
      }
    }catch(e){
      console.log(e);
    }

    //create notification
    await createUserNotification({
        title:'StoxHero Affiliate Reward Credited',
        description:`₹${affiliatePayout} Amount credited for affiliate reward for ${user?.first_name} ${user?.last_name}'s product purchase`,
        notificationType:'Individual',
        notificationCategory:'Informational',
        productCategory:'General',
        user: user?._id,
        priority:'Medium',
        channels:['App', 'Email'],
        createdBy:'63ecbc570302e7cf0153370c',
        lastModifiedBy:'63ecbc570302e7cf0153370c'  
      }); 
    

}