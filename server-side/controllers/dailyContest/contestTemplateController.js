const mongoose = require('mongoose');
const Contest = require('../../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const { ObjectId } = require('mongodb');


// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const { contestStatus, contestEndTime, contestStartTime, contestOn, description,
            contestType, contestFor, entryFee, payoutPercentage, payoutStatus, contestName, portfolio,
            maxParticipants, contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex, contestLiveTime } = req.body;

        const getContest = await Contest.findOne({ contestName: contestName });

        if (getContest) {
            return res.status(500).json({
                status: 'error',
                message: "Contest is already exist with this name.",
            });
        }

        const contest = await Contest.create({
            maxParticipants, contestStatus, contestEndTime, contestStartTime, contestOn, description, portfolio,
            contestType, contestFor, college, entryFee, payoutPercentage, payoutStatus, contestName, createdBy: req.user._id, lastModifiedBy: req.user._id,
            contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex, collegeCode, contestLiveTime
        });

        // console.log(contest)
        res.status(201).json({
            status: 'success',
            message: "Contest created successfully",
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

        // const getContest = await Contest.findOne({contestName: updates?.contestName});

        // if(getContest){
        //     return res.status(500).json({
        //         status:'error',
        //         message: "Contest is already exist with this name.",
        //     });
        // }

        const result = await Contest.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Contest updated successfully",
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

        const result = await Contest.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Contest deleted successfully",
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
exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({}).sort({ contestStartTime: -1 })

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

// Controller for getting all contests
exports.getContest = async (req, res) => {
    const { id } = req.params;
    try {
        const contests = await Contest.findOne({ _id: id })
            .populate('allowedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('college', 'collegeName zone')
            .sort({ contestStartTime: -1 })

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
