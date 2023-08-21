const mongoose = require('mongoose');
const ContestTemplate = require('../../models/DailyContest/dailyContestTemplate'); // Assuming your model is exported as ContestTemplate from the mentioned path
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');


// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const { contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status } = req.body;

        const getContestMaster = await ContestTemplate.findOne({ contestMasterMobile: contestMasterMobile });

        if (getContestMaster) {
            return res.status(500).json({
                status: 'error',
                message: "ContestTemplate is already exist with this name.",
            });
        }

        const contest = await ContestTemplate.create({
            contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status,
            createdBy: req.user._id, lastModifiedBy: req.user._id,
        });

        // console.log(contest)
        res.status(201).json({
            status: 'success',
            message: "ContestTemplate created successfully",
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

        const result = await ContestTemplate.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestTemplate not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "ContestTemplate updated successfully",
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

        const result = await ContestTemplate.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestTemplate not found" });
        }

        res.status(200).json({
            status: "success",
            message: "ContestTemplate deleted successfully",
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
        const contests = await ContestTemplate.find()

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

