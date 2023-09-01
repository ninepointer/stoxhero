const mongoose = require('mongoose');
const MarginX = require('../models/marginX/marginX'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../models/User/userDetailSchema");
const ContestTrading = require('../models/DailyContest/dailyContestMockUser');
const Wallet = require("../models/UserWallet/userWalletSchema");
const { ObjectId } = require('mongodb');
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const uuid = require("uuid")
const UserWallet = require("../models/UserWallet/userWalletSchema")
const emailService = require("../utils/emailService")

exports.createMarginX = async (req, res) => {
    try {
        const { 
            marginXName, startTime, endTime, marginXTemplate, maxParticipants, 
            status, payoutStatus, marginXExpiry, isNifty, isBankNifty, isFinNifty 
        } = req.body;

        const getMarginX = await MarginX.findOne({ marginXName: marginXName });

        if (getMarginX) {
            return res.status(500).json({
                status: 'error',
                message: "MarginX is already exist with this name.",
            });
        }

        const marginX = await MarginX.create({
            marginXName, startTime, endTime, marginXTemplate, maxParticipants, 
            status, payoutStatus, createdBy: req.user._id, lastModifiedBy: req.user._id,
            marginXExpiry, isNifty, isBankNifty, isFinNifty
        });

        res.status(201).json({
            status: 'success',
            message: "MarginX created successfully",
            data: marginX
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

// Controller for editing a MarginX
exports.editMarginX = async (req, res) => {
    try {
        const { id } = req.params; // ID of the marginX to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid marginX ID" });
        }
        const marginX = await MarginX.findById(id);

        // Your additional checks and logic go here if necessary

        const result = await MarginX.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "MarginX not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "MarginX updated successfully",
        });
    } catch (error) {
        console.log('error' ,error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating MarginX",
            error: error.message
        });
    }
};
