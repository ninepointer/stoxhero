const mongoose = require('mongoose');
const ContestMaster = require('../../models/DailyContest/dailyContestMaster'); // Assuming your model is exported as ContestMaster from the mentioned path
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');


// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const { contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status, inviteCode } = req.body;

        const getContestMaster = await ContestMaster.findOne({ contestMasterMobile: contestMasterMobile });

        if (getContestMaster) {
            return res.status(500).json({
                status: 'error',
                message: "ContestMaster is already exist with this name.",
            });
        }

        const contest = await ContestMaster.create({
            contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status, inviteCode,
            createdBy: req.user._id, lastModifiedBy: req.user._id,
        });

        // console.log(contest)
        res.status(201).json({
            status: 'success',
            message: "ContestMaster created successfully",
            data: contest
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

// Controller for editing a contest
exports.editContest = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID" });
        }

        const result = await ContestMaster.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestMaster not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "ContestMaster updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Error in updating contest",
            error: error.message
        });
    }
};

// Controller for deleting a contest
exports.deleteContest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID" });
        }

        const result = await ContestMaster.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestMaster not found" });
        }

        res.status(200).json({
            status: "success",
            message: "ContestMaster deleted successfully",
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
// Controller for getting all contests
exports.getAllContestMaster = async (req, res) => {
    try {
        const contests = await ContestMaster.find().populate('contestMaster', 'first_name last_name')
        console.log(contests)
        res.status(200).json({
            status: "success",
            message: "Contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getContestMaster = async (req, res) => {
    const {id} = req.params;
    try {
        const contests = await ContestMaster.findOne({_id: id})

        res.status(200).json({
            status: "success",
            message: "Contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

