const mongoose = require('mongoose');
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");
const AffiliateTransactions = require("../../models/affiliateProgram/affiliateTransactions");
const whatsAppService = require("../../utils/whatsAppService")
const moment = require('moment');

// Controller for creating a affiliate
exports.createAffiliate = async (req, res) => {
    try {
        const { affiliateProgramName ,startDate ,endDate ,commissionPercentage, maxDiscount, minOrderValue ,discountPercentage, 
            eligiblePlatforms, eligibleProducts, description, status  } = req.body;

        const affiliate = await Affiliate.create({
            affiliateProgramName ,startDate ,endDate ,commissionPercentage ,discountPercentage, 
            eligiblePlatforms, eligibleProducts, description, status, maxDiscount, minOrderValue,
            createdBy: req.user._id, lastModifiedBy: req.user._id,
        });

        res.status(201).json({
            status: 'success',
            message: "Affiliate programe created successfully",
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
            message: "Affiliate Program updated successfully",
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

exports.getActiveAffiliatePrograms = async (req, res) => {
    try {
        const affiliates = (await Affiliate.find({$or: [{status: 'Active'}, {endDate: {$gte: new Date()}}]})
        .populate('affiliates.userId', 'first_name last_name email mobile creationProcess myReferralCode'))
        
        res.status(200).json({
            status: "success",
            message: "affiliates fetched successfully",
            data: affiliates,
            count: affiliates.length
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getDraftAffiliatePrograms = async (req, res) => {
    try {
        const affiliates = await Affiliate.find({status:'Draft'})
        res.status(200).json({
            status: "success",
            message: "affiliates fetched successfully",
            data: affiliates,
            count: affiliates.length
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getInactiveAffiliatePrograms = async (req, res) => {
    try {
        const affiliates = await Affiliate.find({status:'Inactive'})
        res.status(200).json({
            status: "success",
            message: "affiliates fetched successfully",
            data: affiliates,
            count: affiliates.length
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getExpiredAffiliatePrograms = async (req, res) => {
    try {
        const expiredAffiliatePrograms = await Affiliate.find({$or: [{status: 'Expired'}, {endDate: {$lt: new Date()}}]})
        
        res.status(200).json({
            status: 'success',
            data: expiredAffiliatePrograms,
            count: expiredAffiliatePrograms.length
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
            return res.status(400).json({ status: "success", message: "User Id invalid!" });
        }

        const checkUser = await Affiliate.find({"affiliates.userId": new ObjectId(userId), status: 'Active'});
        if(checkUser.length > 0){
            return  res.status(500).json({
                    status: "error",
                    message: "User already added in this or another affiliate programme.",
            });
        }

        const result = await Affiliate.findByIdAndUpdate(
          id,
          {
            $push: {
            affiliates: { userId: userId, joinedOn: new Date(), affiliateCode: myReferralCode },
            }
          },
          { new: true } // This option ensures the updated document is returned
        ).populate('affiliates.userId', 'first_name last_name mobile email creationProcess myReferralCode');

        if (!result) {
            return res.status(404).json({ status: "error", message: "Affiliate not found" });
        }

        let user = await User.findOne({_id: new ObjectId(userId)});

        try{
            if(process.env.PROD == 'true'){
              whatsAppService.sendWhatsApp({destination : user?.mobile, campaignName : 'affiliatepartner_addition_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags : '', attributes : ''});
              whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'affiliatepartner_addition_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags : '', attributes : ''});
          }
          else {
              whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'affiliatepartner_addition_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags : '', attributes : ''});
              whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'affiliatepartner_addition_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, user.myReferralCode,  moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags : '', attributes : ''});
          }
        }catch(e){
          console.log(e);
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

exports.removeAffiliateUser = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to remove

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "success", message: "Invalid affiliate ID or user ID" });
        }

        const affiliate = await Affiliate.findOne({ _id: id })
        .populate('affiliates.userId', 'first_name last_name email mobile creationProcess myReferralCode');

        let participants = affiliate?.affiliates?.filter((item) => {
            return  item.userId._id.toString() !== userId.toString()
        })

        affiliate.affiliates = [...participants];
        await affiliate.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "User removed from affiliate successfully",
            data: affiliate
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getAffiliateProgramTransactions = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await AffiliateTransactions.findOne({affiliateProgram: id})
        
        res.status(200).json({
            status: "success",
            message: "Affiliate Transactions fetched successfully",
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