const mongoose = require('mongoose');
const Contest = require('../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../models/User/userDetailSchema")
// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const {contestStatus, contestEndTime, contestStartTime, contestOn, description, 
            contestType, entryFee, payoutPercentage, payoutStatus, contestName, portfolio
        } = req.body;
        const contest = Contest.create({contestStatus, contestEndTime, contestStartTime, contestOn, description, portfolio,
            contestType, entryFee, payoutPercentage, payoutStatus, contestName, createdBy: req.user._id, lastModifiedBy:req.user._id});

            console.log(contest)
        res.status(201).json({
            status:'success',
            message: "Contest created successfully",
            data: contest
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

// Controller for getting all contests
exports.getContest = async (req, res) => {
    const {id} = req.params;
    try {
        const contests = await Contest.findOne({_id: id}).populate('allowedUsers.userId', 'first_name last_name email mobile creationProcess')

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

// Controller for remove a user to allowedUsers
exports.removeAllowedUser = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to remove

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        }

        const contest = await Contest.findOne({ _id: id });
        if (contest?.allowedUsers?.length == 0) {
            return res.status(404).json({ status: 'error', message: 'No allowed user in this contest.' });
        }
        let participants = contest?.allowedUsers?.filter((item) => (item._id).toString() != userId.toString());
        contest.allowedUsers = [...participants];
        console.log(contest.allowedUsers, userId)
        await contest.save({ validateBeforeSave: false });

        // const result = await Contest.findByIdAndUpdate(
        //     id,
        //     { $pull: { allowedUsers: { userId:  mongoose.Types.ObjectId(userId) } } },
        //     { new: true }  // This option ensures the updated document is returned
        // );

        // if (!result) {
        //     return res.status(404).json({ status: "error", message: "Contest not found" });
        // }

        res.status(200).json({
            status: "success",
            message: "User removed from allowedUsers successfully",
            data: contest
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};


// Controller for getting users
exports.getUsers = async (req, res) => {
    const searchString = req.query.search;
    try {
        const data = await User.find({
            $and: [
                {
                    $or: [
                        { email: { $regex: searchString, $options: 'i' } },
                        { first_name: { $regex: searchString, $options: 'i' } },
                        { last_name: { $regex: searchString, $options: 'i' } },
                        { mobile: { $regex: searchString, $options: 'i' } },
                    ]
                },
                {
                    status: 'Active',
                },
            ]
        })
        res.status(200).json({
            status: "success",
            message: "Getting User successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
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
