const mongoose = require('mongoose');
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");


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
        const affiliates = (await Affiliate.find({status:'Active'})
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
            return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        }

        const checkUser = await Affiliate.find({"affiliates.userId": new ObjectId(userId)});
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