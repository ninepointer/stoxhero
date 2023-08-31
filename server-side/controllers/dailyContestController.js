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
        const { liveThreshold, currentLiveStatus, contestStatus, contestEndTime, contestStartTime, contestOn, description, college, collegeCode,
            contestType, contestFor, entryFee, payoutPercentage, payoutStatus, contestName, portfolio,
            maxParticipants, contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex, payoutType } = req.body;

        const getContest = await Contest.findOne({ contestName: contestName });

        if (getContest) {
            return res.status(500).json({
                status: 'error',
                message: "Contest is already exist with this name.",
            });
        }

        const contest = await Contest.create({
            maxParticipants, contestStatus, contestEndTime, contestStartTime, contestOn, description, portfolio, payoutType,
            contestType, contestFor, college, entryFee, payoutPercentage, payoutStatus, contestName, createdBy: req.user._id, lastModifiedBy: req.user._id,
            contestExpiry, isNifty, isBankNifty, isFinNifty, isAllIndex, collegeCode, currentLiveStatus, liveThreshold
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
        const contest = await Contest.findById(id);
        if(updates?.liveThreshold && updates?.liveThreshold != contest?.liveThreshold){
            //Check if the update is before 5 minutes of the contest start time, send error
            if(new Date()>= new Date(new Date(contest.contestStartTime.toString()).getTime() - 5 * 60 * 1000)){
                return res.status(400).json({stauts:'error', message:'Can\'t edit live threshold five minutes before start time'});
            }
            //Update the participants according to the threshold
            const usersNumContests = await calculateNumContestsForUsers(id);
            const userIdsInSource = new Set(usersNumContests.filter(obj => obj.totalContestsCount <= updates?.liveThreshold).map(obj => obj.userId.toString()));
            const  len = contest?.participants?.length;    
            for (let i =0; i<len-1 ;i++) {
                if (userIdsInSource.has(contest?.participants[i].userId.toString())) {
                    contest?.participants[i]?.isLive = true;
                }
            }
            await contest.save({validateBeforeSave:false});
            res.status(200).json({
                status: 'success',
                message: "Contest updated successfully",
            });
        }
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

//Function to calculate the number of contests users have already participated in

async function calculateNumContestsForUsers(id){
    const pipeline = [
        // Match the contest with the given id
        {
          $match: {
            _id: ObjectId("64ee4363394876e5334aa672"),
          },
        },
        // Deconstruct the participants array to output a document for each participant
        { $unwind: "$participants" },
      
                  // Gather the userIds of the participants
        { $group: { _id: null, userIds: { $addToSet: "$participants.userId" } } },

        // Match all contests that these users have participated in
        { $unwind: "$userIds" },
        { $lookup: {
            from: "daily-contests",
            localField: "userIds",
            foreignField: "participants.userId",
            as: "userContests"
        } },

        // Determine if the contest is free or paid
        { $unwind: "$userContests" },
        { $addFields: {
            "userContests.isFree": { $eq: ["$userContests.entryFee", 0] },
            "userContests.isPaid": { $ne: ["$userContests.entryFee", 0] },
        } },

        // Group by userId to count and aggregate required fields
        { $group: { 
            _id: "$userIds",
            totalContestsCount: { $sum: 1 },
            uniqueTradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$userContests.contestStartTime" } } },
            totalFreeContests: { $sum: { $cond: ["$userContests.isFree", 1, 0] } },
            totalPaidContests: { $sum: { $cond: ["$userContests.isPaid", 1, 0] } },
        } },

        // Format the output
        {
            $project: {
                _id: 0,
                userId: "$_id",
                totalContestsCount: 1,
                totalTradingDays: { $size: "$uniqueTradingDays" },  // Note: Ensure "contestExpiry" can be represented as a numerical value to sum
                totalFreeContests: 1,
                totalPaidContests: 1
            }
        }
    ];
    const result = await Contest.aggregate(pipeline);

    return result;
}

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


// Controller for getting all contests , 
exports.getAllLiveContests = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let tomorrowDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()+1).padStart(2, '0')}`
    tomorrowDate = tomorrowDate + "T00:00:00.000Z";
    const tomorrow = new Date(tomorrowDate);
  
  
    try {
        const contests = await Contest.find({contestType: "Live", contestEndTime: {$lt: tomorrow}, contestStartTime: {$gte: today}})
        .populate('portfolio', 'portfolioValue portfolioName')
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

// Controller for getting all contests
exports.getContest = async (req, res) => {
    const { id } = req.params;
    try {
        const contests = await Contest.findOne({ _id: id })
            .populate('allowedUsers.userId', 'first_name last_name email mobile creationProcess currentLiveStatus')
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

exports.getCollegeUserUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $gt: new Date() }, contestFor: "College", contestStatus:"Active"
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

exports.getUserUpcomingContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $gte: new Date() }, contestFor: "StoxHero", contestStatus:"Active"
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

exports.getUserLiveContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $lte: new Date() },
            contestEndTime: { $gte: new Date() },
            contestFor: "StoxHero", 
            contestStatus:"Active"
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

exports.getCollegeUserLiveContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            contestStartTime: { $lte: new Date() },
            contestEndTime: { $gte: new Date() },
            contestFor: "College", 
            contestStatus:"Active"
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

exports.getCommpletedContestsAdminLive = async (req, res) => {
    try {
        const contests = await Contest.find({ contestStatus: 'Completed', contestType: "Live" })
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

exports.getRewards = async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ status: 'error', message: 'Contest not found' });
        }
        res.status(200).json({ status: 'success', message: 'rewards fetched', data: contest.rewards });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}

exports.addReward = async (req, res, next) => {
    const { id } = req.params;
    const { rankStart, rankEnd, prize } = req.body;
    if (rankStart > rankEnd) {
        return res.status(400).json({ status: 'error', message: 'Start Rank should be less than equal to end Rank' });
    }
    try {
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ status: 'error', message: 'Contest not found' });
        }
        for (let reward of contest.rewards) {
            if (contest.rewards.length > 0) {
                if ((rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
                    (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)) {
                    return res.status(400).json({ status: 'error', message: 'Ranks overlap with existing rewards' });
                }
            }
        }
        contest.rewards.push({ rankStart, rankEnd, prize });
        await contest.save({ validateBeforeSave: false });
        res.status(201).json({ status: 'success', message: 'Reward added' });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }

}

exports.editReward = async (req, res) => {
    const { rewardId, id } = req.params;
    const { rankStart, rankEnd, prize } = req.body;

    if (rankStart > rankEnd) {
        return res.status(400).json({ status: 'error', message: 'rankStart must be less than rankEnd' });
    }

    try {
        const contest = await Contest.findById(id);

        if (!contest) {
            return res.status(404).json({ status: 'error', message: 'Contest not found' });
        }

        const rewardIndex = contest.rewards.findIndex(r => r._id.toString() === rewardId);

        if (rewardIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Reward not found' });
        }

        // Check for overlap with other rewards, excluding the one being edited
        for (const [index, reward] of contest.rewards.entries()) {
            if (index === rewardIndex) continue; // Skip the current reward being edited
            if ((rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
                (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)) {
                return res.status(400).json({ status: 'error', message: 'Ranks overlap with existing rewards' });
            }
        }

        contest.rewards[rewardIndex] = { rankStart, rankEnd, prize };
        await contest.save();

        res.status(200).json({ status: 'success', message: 'Reward updated successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}

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
                        userId: userId,
                        registeredOn: new Date(),
                        status: 'Joined',
                        isLive: false // Default value, will be updated later
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


        const noOfContest = await DailyContestMockUser.aggregate([
            {
                $match:
                {
                    trader: new ObjectId(
                        userId
                    ),
                    status: "COMPLETE",
                },
            },
            {
                $group:
                {
                    _id: {
                        contestId: "$contestId",
                    },
                },
            },
            {
                $count: "noOfContest",
            }
        ])

        const result = await Contest.findOne({ _id: new ObjectId(contestId) });

        
        if (!result) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        let obj = {
            userId: userId,
            participatedOn: new Date(),
        }
        // Now update the isLive field based on the liveThreshold value
        if ((noOfContest[0]?.noOfContest < result?.liveThreshold) && result.currentLiveStatus === "Live") {
            obj.isLive = true;
            console.log("in if")
        } else {
            console.log("in else")
            obj.isLive = false;
        }

        result.participants.push(obj);




        console.log(result)
        // Save the updated document
        await result.save();


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

        // console.log(contest.length, contest)
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

        const noOfContest = await DailyContestMockUser.aggregate([
            {
                $match:
                {
                    trader: new ObjectId(
                        userId
                    ),
                    status: "COMPLETE",
                },
            },
            {
                $group:
                {
                    _id: {
                        contestId: "$contestId",
                    },
                },
            },
            {
                $count: "noOfContest",
            }
        ])

        const result = await Contest.findOne({ _id: new ObjectId(contestId) });

        let obj = {
            userId: userId,
            participatedOn: new Date(),
        }
        // Now update the isLive field based on the liveThreshold value
        if ((noOfContest[0]?.noOfContest < result?.liveThreshold) && result.currentLiveStatus === "Live") {
            obj.isLive = true;
            console.log("in if")
        } else {
            console.log("in else")
            obj.isLive = false;
        }

        result.participants.push(obj);




        console.log(result)
        // Save the updated document
        await result.save();


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