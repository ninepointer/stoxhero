const mongoose = require('mongoose');
const Contest = require('../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path

// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const {contestStatus, contestEndTime, contestStartTime, contestOn, description, 
            contestType, entryFee, payoutPercentage, payoutStatus, contestName, maxParticipants
        } = req.body;
        console.log(req.body)
        const contest = Contest.create({maxParticipants, contestStatus, contestEndTime, contestStartTime, contestOn, description, 
            contestType, entryFee, payoutPercentage, payoutStatus, contestName, createdBy: req.user._id, lastModifiedBy:req.user._id});
        res.status(201).json({
            status:'success',
            message: "Contest created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:'error',
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
            return res.status(400).json({ status:"error", message: "Invalid contest ID" });
        }

        const result = await Contest.findByIdAndUpdate(id, updates, { new: true }); 

        if (!result) {
            return res.status(404).json({ status:"error", message: "Contest not found" });
        }

        res.status(200).json({
            status:'success',
            message: "Contest updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status:'error',
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
            return res.status(400).json({ status:"error", message: "Invalid contest ID" });
        }

        const result = await Contest.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ status:"error", message: "Contest not found" });
        }

        res.status(200).json({
            status:"success",
            message: "Contest deleted successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};
// Controller for getting all contests
exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({});

        res.status(200).json({
            status:"success",
            message: "Contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for getting upcoming contests
exports.getUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestEndTime: { $gt: new Date() }
        });

        res.status(200).json({
            status:"success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting completed contests
exports.getCompletedContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestEndTime: { $lt: new Date() }
        });

        res.status(200).json({
            status:"success",
            message: "Completed contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for getting draft contests
exports.getDraftContests = async (req, res) => {
    try {
        const contests = await Contest.find({ contestStatus: 'Draft' });

        res.status(200).json({
            status:"success",
            message: "Draft contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for adding a user to allowedUsers
exports.addAllowedUser = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to add

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({status:"success", message: "Invalid contest ID or user ID" });
        }

        const result = await Contest.findByIdAndUpdate(
            id,
            { $push: { allowedUsers: { userId: userId, addedOn: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({status:"error", message: "Contest not found" });
        }

        res.status(200).json({
            status:"success",
            message: "User added to allowedUsers successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for adding a user to registeredUsers
exports.registerUserToContest = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to register

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({status:"error", message: "Invalid contest ID or user ID" });
        }

        const result = await Contest.findByIdAndUpdate(
            id,
            { $push: { registeredUsers: { userId: userId, registeredOn: new Date(), status: 'Joined' } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({status:"error", message: "Contest not found" });
        }

        res.status(200).json({
            status:"success",
            message: "User registered to contest successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};
