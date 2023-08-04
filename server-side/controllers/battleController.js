const mongoose = require('mongoose');
const Battle = require('../models/battles/battle');
const User = require("../models/User/userDetailSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const { ObjectId } = require('mongodb');

exports.createBattle = async (req, res) => {
    try {
        const { 
            battleStatus, battleEndTime, battleStartTime, battleLiveTime, description, college, collegeCode,
            battleType, battleFor, entryFee, portfolio, minParticipants, battleExpiry, 
            isNifty, isBankNifty, isFinNifty
        } = req.body;

        const getBattle = await Battle.findOne({ battleName: req.body.battleName });
        if (getBattle) {
            return res.status(500).json({
                status: 'error',
                message: "Battle already exists with this name.",
            });
        }

        const battle = await Battle.create({
            battleStatus, battleEndTime, battleStartTime, battleLiveTime, description, portfolio, college, 
            battleType, battleFor, entryFee, createdBy: req.user._id, lastModifiedBy: req.user._id, 
            battleExpiry, isNifty, isBankNifty, isFinNifty, collegeCode, minParticipants, battleName: req.body.battleName
        });

        res.status(201).json({
            status: 'success',
            message: "Battle created successfully",
            data: battle
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


exports.editBattle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid battle ID" });
        }

        const result = await Battle.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Battle updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Error in updating battle",
            error: error.message
        });
    }
};


exports.getAllBattles = async (req, res) => {
    try {
        const battles = await Battle.find({}).sort({ battleStartTime: -1 });
        res.status(200).json({
            status: "success",
            message: "Battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getBattle = async (req, res) => {
    const { id } = req.params;
    try {
        const battle = await Battle.findOne({ _id: id })
            .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('college', 'collegeName zone')
            .sort({ battleStartTime: -1 });
        res.status(200).json({
            status: "success",
            message: "Battle fetched successfully",
            data: battle
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getUpcomingBattles = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleEndTime: { $gt: new Date() }, battleFor: "StoxHero", battleStatus:"Active"
        }).sort({ battleStartTime: 1 });
        res.status(200).json({
            status: "success",
            message: "Upcoming battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming battles",
            error: error.message
        });
    }
};

exports.getOnlyUpcomingBattles = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStartTime: { $gt: new Date() }, battleFor: "StoxHero", battleStatus:"Active"
        }).sort({ battleStartTime: 1 });
        res.status(200).json({
            status: "success",
            message: "Only upcoming battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching only upcoming battles",
            error: error.message
        });
    }
};


