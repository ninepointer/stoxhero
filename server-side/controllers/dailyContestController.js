const mongoose = require('mongoose');
const Contest = require('../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../models/User/userDetailSchema");
const ContestTrading = require('../models/DailyContest/dailyContestMockUser');
const Wallet = require("../models/UserWallet/userWalletSchema");
const { ObjectId } = require('mongodb');
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const uuid = require("uuid")
const UserWallet = require("../models/UserWallet/userWalletSchema")
const emailService = require("../utils/emailService")


// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const { collegeContestType, contestLiveTime, contestStatus, contestEndTime, contestStartTime, 
                contestOn, description, college, collegeCode, contestMasterId,
                contestType, contestFor, entryFee, payoutPercentage, payoutStatus, contestName, portfolio,
                maxParticipants, contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex } = req.body;

            console.log("contestLiveTime", contestLiveTime)
        const getContest = await Contest.findOne({ contestName: contestName });

        if (getContest) {
            return res.status(500).json({
                status: 'error',
                message: "Contest is already exist with this name.",
            });
        }

        const contest = await Contest.create({
            maxParticipants, status: contestStatus, contestEndTime, contestStartTime, contestOn, description, portfolio,
            contestType, contestFor, college, entryFee, payoutPercentage, payoutStatus, contestName, createdBy: req.user._id, lastModifiedBy: req.user._id,
            contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex, collegeCode, contestLiveTime, collegeContestType, contestMaster: [{userId: contestMasterId, addedOn: new Date()}]
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

// Controller for getting upcoming contests getAdminUpcomingContests
exports.getUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestEndTime: { $gt: new Date() }, contestFor: "StoxHero", contestStatus:"Active"
        },
        {
            allowedUsers: 0,
            potentialParticipants: 0,
            contestSharedBy: 0,
            purchaseIntent: 0
        })
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
        .populate('portfolio', 'portfolioName _id portfolioValue')
        .sort({ contestStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting upcoming contests getAdminUpcomingContests
exports.getOnlyUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $gt: new Date() }, contestFor: "StoxHero", contestStatus:"Active", contestFor: "StoxHero"
        },
        {
            allowedUsers: 0,
            potentialParticipants: 0,
            contestSharedBy: 0,
            purchaseIntent: 0
        }
        ).sort({ contestStartTime: 1 })
        res.status(200).json({
            status: "success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting upcoming contests getAdminUpcomingContests
exports.getAdminUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $gt: new Date() }, contestStatus:"Active"
        }).populate('portfolio', 'portfolioName _id portfolioValue')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
            .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('contestSharedBy.userId', 'first_name last_name email mobile creationProcess')
            .populate('college', 'collegeName zone')
            .sort({ contestStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting todaysContest contests getAdminUpcomingContests
exports.todaysContest = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    try {
        const contests = await Contest.find({
            contestEndTime: { $gte: today }
        }).populate('portfolio', 'portfolioName _id portfolioValue')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .sort({ contestStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Today's contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting ongoing contest
exports.ongoingContest = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $lte: new Date() },
            contestEndTime: { $gte: new Date() },
            contestFor: "StoxHero"
        },
        {
            allowedUsers: 0,
            potentialParticipants: 0,
            contestSharedBy: 0,
            purchaseIntent: 0
        }
        ).sort({ contestStartTime: 1 })
        res.status(200).json({
            status: "success",
            message: "ongoing contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching ongoing contests",
            error: error.message
        });
    }
};

// Controller for getting ongoing contest
exports.ongoingContestAdmin = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $lte: new Date() },
            contestEndTime: { $gte: new Date() },
        }).populate('portfolio', 'portfolioName _id portfolioValue')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
        .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
        .populate('contestSharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('college', 'collegeName zone')
        .sort({ contestStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "ongoing contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching ongoing contests",
            error: error.message
        });
    }
};

// Controller for getting upcoming contests 
exports.getUpcomingCollegeContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestEndTime: { $gt: new Date() }, contestFor: "College", contestStatus: "Active"
        }).populate('portfolio', 'portfolioName _id portfolioValue')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
            .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('contestSharedBy.userId', 'first_name last_name email mobile creationProcess')
            .populate('college', 'collegeName zone')
            .sort({ contestStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

exports.getCommpletedContestsAdmin = async (req, res) => {
    try {
        const contests = await Contest.find({ contestStatus: 'Completed' })
            .populate('portfolio', 'portfolioName _id portfolioValue')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
            .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('contestSharedBy.userId', 'first_name last_name email mobile creationProcess')
            .sort({ contestStartTime: -1 })
        res.status(200).json({
            status: "success",
            message: "Upcoming contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming contests",
            error: error.message
        });
    }
};

// Controller for getting completed contests
exports.getCompletedContests = async (req, res) => {
    const userId = req.user._id;
    try {
        const contests = await Contest.find({
            contestEndTime: { $lt: new Date() },
            "participants.userId": new ObjectId(userId),
            contestFor: "StoxHero"
        }, {
            allowedUsers: 0,
            potentialParticipants: 0,
            contestSharedBy: 0
        }).sort({ contestStartTime: -1 })

        res.status(200).json({
            status: "success",
            message: "Completed contests fetched successfully",
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


// Controller for getting completed contests
exports.getCompletedCollegeContests = async (req, res) => {
    const userId = req.user._id;
    try {
        const contests = await Contest.find({
            contestEndTime: { $lt: new Date() }, "participants.userId": new ObjectId(userId), contestFor: "College"
        }).sort({ contestStartTime: -1 })

        res.status(200).json({
            status: "success",
            message: "Completed contests fetched successfully",
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

// Controller for getting draft contests
exports.getDraftContests = async (req, res) => {
    try {
        const contests = await Contest.find({ contestStatus: 'Draft' }).sort({ contestStartTime: -1 });

        res.status(200).json({
            status: "success",
            message: "Draft contests fetched successfully",
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

// Controller for adding a user to allowedUsers
exports.addAllowedUser = async (req, res) => {
    try {
        const { id, userId } = req.params; // ID of the contest and the user to add

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        }

        const result = await Contest.findByIdAndUpdate(
            id,
            { $push: { allowedUsers: { userId: userId, addedOn: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User added to allowedUsers successfully",
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
        // console.log(contest.allowedUsers, userId)
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
        const { id } = req.params; // ID of the contest and the user to register
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID or user ID" });
        }
        const result = await Contest.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    interestedUsers: {
                        $each: [
                            {
                                userId: userId,
                                registeredOn: new Date(),
                                status: 'Joined',
                            },
                        ],
                    },
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User registered to contest successfully",
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

//save purchase intent
exports.purchaseIntent = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const result = await Contest.findByIdAndUpdate(
            id,
            { $push: { purchaseIntent: { userId: userId, date: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        res.status(200).json({
            status: "success",
            message: "Intent Saved successfully",
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

exports.copyAndShare = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest and the user to register
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID or user ID" });
        }

        const result = await Contest.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    contestSharedBy: {
                        $each: [
                            {
                                userId: userId,
                                sharedAt: new Date(),
                            },
                        ],
                    },
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User share to contest successfully",
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

exports.participateUsers = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const contest = await Contest.findOne({ _id: id });

        for (let i = 0; i < contest.participants?.length; i++) {
            if (contest.participants[i]?.userId?.toString() === userId?.toString()) {
                return res.status(404).json({ status: "error", message: "You have already participated in this contest." });
            }
        }

        const getActiveContest = await Contest.find({
            participants: {
                $elemMatch: {
                    userId: new ObjectId(userId)
                }
            },
            contestStatus: "Active",
            // entryFee: 0,
            $or: [
                { contestStartTime: { $gte: new Date(contest.contestStartTime), $lte: new Date(contest.contestEndTime) } },
                { contestEndTime: { $gte: new Date(contest.contestStartTime), $lte: new Date(contest.contestEndTime) } },
                {
                    $and: [
                        { contestStartTime: { $lte: new Date(contest.contestStartTime) } },
                        { contestEndTime: { $gte: new Date(contest.contestEndTime) } }
                    ]
                }
            ]
        })

        // console.log("getActiveContest", getActiveContest)

        if (getActiveContest.length > 0) {
            if (!contest.potentialParticipants.includes(userId)) {
                contest.potentialParticipants.push(userId);
                contest.save();
            }
            return res.status(404).json({ status: "error", message: "You can only participate in another contest once your current contest ends!" });
        }



        if (contest?.maxParticipants <= contest?.participants?.length) {
            if (!contest.potentialParticipants.includes(userId)) {
                contest.potentialParticipants.push(userId);
                contest.save();
            }
            return res.status(404).json({ status: "error", message: "The contest is already full. We sincerely appreciate your enthusiasm to participate in our contest. Please join in our future contest." });
        }

        const result = await Contest.findByIdAndUpdate(
            id,
            { $push: { participants: { userId: userId, participatedOn: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        res.status(200).json({
            status: "success",
            message: "Participate successfully",
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

exports.verifyCollageCode = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;
        const { collegeCode } = req.body;

        const contest = await Contest.findOne({ _id: id });

        const getActiveContest = await Contest.find({
            participants: {
                $elemMatch: {
                    userId: new ObjectId(userId)
                }
            },
            contestStatus: "Active",
            $or: [
                { contestStartTime: { $gte: new Date(contest.contestStartTime), $lte: new Date(contest.contestEndTime) } },
                { contestEndTime: { $gte: new Date(contest.contestStartTime), $lte: new Date(contest.contestEndTime) } },
                {
                    $and: [
                        { contestStartTime: { $lte: new Date(contest.contestStartTime) } },
                        { contestEndTime: { $gte: new Date(contest.contestEndTime) } }
                    ]
                }
            ]
        })

        // if (getActiveContest.length > 0) {
        //     if (!contest.potentialParticipants.includes(userId)) {
        //         contest.potentialParticipants.push(userId);
        //         contest.save();
        //     }
        //     return res.status(404).json({ status: "error", message: "You can only participate in another contest once your current contest ends!" });
        // }

        // console.log("collageCode", collegeCode, contest?.collegeCode)

        if (collegeCode !== contest?.collegeCode) {
            return res.status(404).json({ status: "error", message: "The College Code which you have entered is incorrect. Please contact your college POC for the correct College Code." });
        }


        if (contest?.maxParticipants <= contest?.participants?.length) {
            if (!contest.potentialParticipants.includes(userId)) {
                contest.potentialParticipants.push(userId);
                contest.save();
            }
            return res.status(404).json({ status: "error", message: "The contest is already full. We sincerely appreciate your enthusiasm to participate in our contest. Please join in our future contest." });
        }

        if (contest?.entryFee === 0) {

            if (getActiveContest.length > 0) {
                if (!contest.potentialParticipants.includes(userId)) {
                    contest.potentialParticipants.push(userId);
                    contest.save();
                }
                return res.status(404).json({ status: "error", message: "You can only participate in another contest once your current contest ends!" });
            }

            const result = await Contest.findByIdAndUpdate(
                id,
                { $push: { participants: { userId: userId, participatedOn: new Date() } } },
                { new: true }  // This option ensures the updated document is returned
            );

            if (!result) {
                return res.status(404).json({ status: "error", message: "Something went wrong." });
            }

            res.status(200).json({
                status: "success",
                message: "Participate successfully",
                data: result
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "Code varified",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// run this function in cronjob
exports.creditAmountToWallet = async () => {
    console.log("in wallet")
    try {
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

        const contest = await Contest.find({ contestStatus: "Completed", payoutStatus: null, contestEndTime: {$gte: today} });

        console.log(contest.length, today, "contest")
        for (let j = 0; j < contest.length; j++) {
            // if (contest[j].contestEndTime < new Date()) {
            for (let i = 0; i < contest[j]?.participants?.length; i++) {
                let userId = contest[j]?.participants[i]?.userId;
                let payoutPercentage = contest[j]?.payoutPercentage
                let id = contest[j]._id;
                let pnlDetails = await DailyContestMockUser.aggregate([
                    {
                        $match: {
                            trade_time: {
                                $gte: today
                            },
                            status: "COMPLETE",
                            trader: new ObjectId(userId),
                            contestId: new ObjectId(id)
                        },
                    },
                    {
                        $group: {
                            _id: {
                            },
                            amount: {
                                $sum: {
                                    $multiply: ["$amount", -1],
                                },
                            },
                            brokerage: {
                                $sum: {
                                    $toDouble: "$brokerage",
                                },
                            },
                        },
                    },
                    {
                        $project:
                        {
                            npnl: {
                                $subtract: ["$amount", "$brokerage"],
                            },
                        },
                    },
                ])

                // console.log(pnlDetails[0]);
                if (pnlDetails[0]?.npnl > 0) {
                    const payoutAmount = pnlDetails[0]?.npnl * payoutPercentage / 100;
                    const wallet = await Wallet.findOne({ userId: userId });

                    console.log(userId, pnlDetails[0]);

                    wallet.transactions = [...wallet.transactions, {
                        title: 'Contest Credit',
                        description: `Amount credited for contest ${contest[j].contestName}`,
                        transactionDate: new Date(),
                        amount: payoutAmount?.toFixed(2),
                        transactionId: uuid.v4(),
                        transactionType: 'Cash'
                    }];
                    wallet.save();

                    contest[j].participants[i].payout = payoutAmount?.toFixed(2)
                }
                contest[j].payoutStatus = 'Completed'
                contest[j].contestStatus = "Completed";
                await contest[j].save();
            }
            // }
        }


    } catch (error) {
        console.log(error);
    }
};

exports.getDailyContestUsers = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: {
                        date: {
                            $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                    },
                },
            },
            {
                $group: {
                    _id: { date: "$_id.date" },
                    traders: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$_id.trader" },
                },
            },
            {
                $sort: {
                    "_id.date": 1,
                },
            },
        ];

        const contestTraders = await ContestTrading.aggregate(pipeline);

        // Create a date-wise mapping of DAUs for different products
        const dateWiseDAUs = {};

        contestTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        contest: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].contest = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        // Calculate the date-wise total DAUs and unique users
        Object.keys(dateWiseDAUs).forEach(date => {
            const { contest, uniqueUsers } = dateWiseDAUs[date];
            dateWiseDAUs[date].total = contest
            dateWiseDAUs[date].uniqueUsers = [...new Set(uniqueUsers)];
        });

        const response = {
            status: "success",
            message: "Contest Scoreboard fetched successfully",
            data: Object.values(dateWiseDAUs),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.deductSubscriptionAmount = async (req, res, next) => {

    try {
        const { contestFee, contestName, contestId } = req.body
        const userId = req.user._id;

        const contest = await Contest.findOne({ _id: contestId });
        const wallet = await UserWallet.findOne({ userId: userId });
        const user = await User.findOne({ _id: userId });

        const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
            return transaction.transactionType === "Cash";
        });

        const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
            return total + transaction?.amount;
        }, 0);

        if (totalCashAmount < contest?.entryFee) {
            return res.status(404).json({ status: "error", message: "You do not have enough balance to join this contest. Please add money to your wallet." });
        }

        for (let i = 0; i < contest.participants?.length; i++) {
            if (contest.participants[i]?.userId?.toString() === userId?.toString()) {
                return res.status(404).json({ status: "error", message: "You have already participated in this contest." });
            }
        }

        if (contest?.maxParticipants <= contest?.participants?.length) {
            if (!contest.potentialParticipants.includes(userId)) {
                contest.potentialParticipants.push(userId);
                contest.save();
            }
            return res.status(404).json({ status: "error", message: "The contest is already full. We sincerely appreciate your enthusiasm to participate in our contest. Please join in our future contest." });
        }

        const result = await Contest.findByIdAndUpdate(
            contestId,
            { $push: { participants: { userId: userId, participatedOn: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );


        wallet.transactions = [...wallet.transactions, {
            title: 'Contest Fee',
            description: `Amount deducted for the contest fee of ${contestName} contest`,
            transactionDate: new Date(),
            amount: (-contestFee),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
        }];
        wallet.save();

        if (!result || !wallet) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        let recipients = [user.email,'team@stoxhero.com'];
        let recipientString = recipients.join(",");
        let subject = "Contest Fee - StoxHero";
        let message = 
        `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contest Fee Deducted</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                p {
                    margin: 0 0 20px;
                }

                .userid {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .password {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .login-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                }

                .login-button:hover {
                    background-color: #0069d9;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>Contest Fee</h1>
                <p>Hello ${user.first_name},</p>
                <p>Thanks for participating in contest! Please find your transaction details below.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>Contest Name: <span class="password">${contest.contestName}</span></p>
                <p>Contest Fee: <span class="password">₹${contest.entryFee}/-</span></p>
                </div>
            </body>
            </html>

        `
        if(process.env.PROD === "true"){
            emailService(recipientString,subject,message);
            console.log("Subscription Email Sent")
        }

        res.status(200).json({
            status: "success",
            message: "Paid successfully",
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
}

exports.getDailyContestAllUsers = async (req, res) => {
    try {
        const pipeline = 
        [
            {
              $lookup: {
                from: "daily-contests",
                localField: "contestId",
                foreignField: "_id",
                as: "contest",
              },
            },
            {
              $addFields: {
                contestdetails: {
                  $arrayElemAt: ["$contest", 0],
                },
              },
            },
            {
              $facet: {
                paidcontest: [
                  {
                    $match: {
                      "contestdetails.entryFee": {
                        $gt: 0,
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: {
                          $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: "$_id.date",
                      },
                      traders: {
                        $sum: 1,
                      },
                      uniqueUsers: {
                        $addToSet: "$_id.trader",
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: "$_id.date",
                      traders: 1,
                    },
                  },
                  {
                    $sort: {
                      "_id.date": 1,
                    },
                  },
                ],
                freecontest: [
                  {
                    $match: {
                      "contestdetails.entryFee": {
                        $eq: 0,
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: {
                          $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: "$_id.date",
                      },
                      traders: {
                        $sum: 1,
                      },
                      uniqueUsers: {
                        $addToSet: "$_id.trader",
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: "$_id.date",
                      traders: 1,
                    },
                  },
                  {
                    $sort: {
                      "_id.date": 1,
                    },
                  },
                ],
                totalcontest: [
                  {
                    $match: {
                      "contestdetails.entryFee": {
                        $gte: 0,
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: {
                          $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: "$_id.date",
                      },
                      traders: {
                        $sum: 1,
                      },
                      uniqueUsers: {
                        $addToSet: "$_id.trader",
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: "$_id.date",
                      traders: 1,
                    },
                  },
                  {
                    $sort: {
                      "_id.date": 1,
                    },
                  },
                ],
              },
            },
          ]

        const contestTraders = await ContestTrading.aggregate(pipeline);
        
        try{
        
        const contestusers = []

        // console.log("Contest Traders:",contestTraders)
        contestTraders[0].totalcontest.forEach(entry => {
            const { date, traders } = entry;
    
            const freecontest = contestTraders[0].freecontest.filter((elem)=>{
                return elem.date === date
            })
            const paidcontest = contestTraders[0].paidcontest.filter((elem)=>{
                return elem.date === date
            })

            contestusers.push(
                {
                    date:date,paid:paidcontest.length !== 0 ? paidcontest[0].traders : 0,
                    free: freecontest.length !== 0 ? freecontest[0].traders : 0, 
                    total: traders
                }
                )
            
                contestusers.sort((a,b)=>{
                    if(a.date >= b.date) return 1
                    if(a.date < b.date) return -1 
                })
            
        });
        // Create a date-wise mapping of DAUs for different products
        
        const response = {
            status: "success",
            message: "Contest Users fetched successfully",
            data: contestusers
        };

        res.status(200).json(response);
    }catch(err){
        console.log(err);
    }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// Controller for adding a user to allowedUsers
exports.getContestMasterList = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest and the user to add

        // if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        //     return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        // }

        const result = await Contest.aggregate(
            [
                {
                    $match:
                    {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $unwind:
                    {
                        path: "$contestMaster",
                    },
                },
                {
                    $lookup:
                    {
                        from: "daily-contest-masters",
                        localField:
                            "contestMaster.contestMasterId",
                        foreignField: "_id",
                        as: "result",
                    },
                },
                {
                    $unwind:
                    {
                        path: "$result",
                    },
                },
                {
                    $lookup:
                    {
                        from: "user-personal-details",
                        localField: "result.contestMaster",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind:
                    {
                        path: "$user",
                    },
                },
                {
                    $lookup:
                    {
                        from: "colleges",
                        localField: "result.college",
                        foreignField: "_id",
                        as: "collegeData",
                    },
                },
                {
                    $project:
                    {
                        collegeId: {
                            $arrayElemAt: ["$collegeData._id", 0],
                        },
                        collegeName: {
                            $arrayElemAt: [
                                "$collegeData.collegeName",
                                0,
                            ],
                        },
                        first_name: "$user.first_name",
                        last_name: "$user.last_name",
                        mobile: "$user.mobile",
                        userId: "$user._id",
                        inviteCode: "$result.inviteCode",
                        _id: 0,
                    },
                },
            ]
        )

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "fetched successfully",
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