const DailyContest = require("../../models/DailyContest/dailyContest");
const { ObjectId } = require('mongodb');
const User = require("../../models/User/userDetailSchema");
const Course = require('../../models/courses/courseSchema');


exports.userFreeCompleted = async (req, res) => {
    try {
        const userId = req.user._id;
        const dailyContest = await DailyContest.aggregate([
            {
                $match: {
                    entryFee: 0,
                    contestStatus: "Completed",
                    payoutStatus: "Completed",
                },
            },
            {
                $unwind: {
                    path: "$participants",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "participants.userId": new ObjectId(
                        userId
                    ),
                    "participants.trades": {
                        $gt: 0,
                    },
                },
            },
            {
                $lookup: {
                    from: "user-portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio",
                },
            },
            {
                $project: {
                    contestName: 1,
                    contestStartTime: 1,
                    contestEndTime: 1,
                    isAllIndex: 1,
                    payoutType: 1,
                    isNifty: 1,
                    isBankNifty: 1,
                    isFinNifty: 1,
                    entryFee: 1,
                    rewardType: 1,
                    contestStatus: 1,
                    payoutPercentage: 1,
                    payoutCapPercentage: 1,
                    rewards: 1,
                    rank: "$participants.rank",
                    npnl: "$participants.npnl",
                    gpnl: "$participants.gpnl",
                    contestExpiry: 1,
                    payout: "$participants.payout",
                    portfolioValue: {
                        $arrayElemAt: [
                            "$portfolio.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    contestEndTime: -1,
                },
            },
        ])

        if (!dailyContest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        res.status(200).json({ data: dailyContest, status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.userPaidCompleted = async (req, res) => {
    try {
        const userId = req.user._id;
        const dailyContest = await DailyContest.aggregate([
            {
                $match: {
                    entryFee: { $gt: 0 },
                    contestStatus: "Completed",
                    payoutStatus: "Completed",
                },
            },
            {
                $unwind: {
                    path: "$participants",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "participants.userId": new ObjectId(
                        userId
                    ),
                    "participants.trades": {
                        $gt: 0,
                    },
                },
            },
            {
                $lookup: {
                    from: "user-portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio",
                },
            },
            {
                $project: {
                    contestName: 1,
                    contestStartTime: 1,
                    contestEndTime: 1,
                    isAllIndex: 1,
                    payoutType: 1,
                    isNifty: 1,
                    isBankNifty: 1,
                    isFinNifty: 1,
                    entryFee: 1,
                    rewardType: 1,
                    contestStatus: 1,
                    payoutPercentage: 1,
                    payoutCapPercentage: 1,
                    rewards: 1,
                    rank: "$participants.rank",
                    npnl: "$participants.npnl",
                    gpnl: "$participants.gpnl",
                    contestExpiry: 1,
                    payout: "$participants.payout",
                    portfolioValue: {
                        $arrayElemAt: [
                            "$portfolio.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    contestEndTime: -1,
                },
            },
        ])

        if (!dailyContest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        res.status(200).json({ data: dailyContest, status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.userUpcoming = async (req, res) => {
    try {
        const referredBy = req.user.referredBy;
        const userId = req.user._id; // Assuming this is the logged-in user's ID
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        
        const contests = await DailyContest.aggregate([
            {
                $match: {
                    contestStartTime: { $gte: new Date() },
                    contestFor: "StoxHero",
                    contestStatus: "Active",
                    contestLiveTime: { $lte: new Date() },
                    $or: [
                        { visibility: true },
                        {
                            visibility: false,
                            potentialParticipants: {
                                $elemMatch: { $eq: new ObjectId(userId) },
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "user-portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio",
                },
            },
            {
                $addFields: {
                    isInterested: {
                        $in: [new ObjectId(userId), "$interestedUsers.userId"],
                    },
                },
            },
            {
                $addFields: {
                    isPaid: {
                        $in: [new ObjectId(userId), "$participants.userId"],
                    },
                },
            },
            {
                $project: {
                    isInterested: 1,
                    isPaid: 1,
                    contestName: 1,
                    contestStartTime: 1,
                    contestEndTime: 1,
                    isAllIndex: 1,
                    payoutType: 1,
                    isNifty: 1,
                    isBankNifty: 1,
                    isFinNifty: 1,
                    entryFee: 1,
                    rewardType: 1,
                    contestStatus: 1,
                    payoutPercentage: 1,
                    maxParticipants: 1,
                    featured: 1,
                    payoutCapPercentage: 1,
                    rewards: 1,
                    contestExpiry: 1,
                    courseInstructors: 1,
                    participants: {
                        $size: '$participants'
                    },
                    interestedUsers: {
                        $size: '$interestedUsers'
                    },
                    portfolioValue: {
                        $arrayElemAt: [
                            "$portfolio.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    contestEndTime: -1,
                },
            },
        ])

        if (!contests) {
            return res.status(404).json({ message: "Contest not found" });
        }
        const newContest = [];
        for(const elem of contests){
          if(elem?.courseInstructors?.length > 0){
            for(const subelem of elem?.courseInstructors){
              if(subelem?.id?.toString() === (referredBy)?.toString()){ //referredBy Id            
                if(subelem?.fee !== undefined || subelem?.fee !== null){
                  
                  const checkCoursePurchased = await Course.aggregate([
                    {
                      $match: {
                        "courseInstructors.id": new ObjectId(
                          referredBy
                        ),
                        "enrollments.userId": new ObjectId(userId)
                      },
                    }
                  ])
                  if(checkCoursePurchased[0]){
                    elem.entryFee = subelem?.fee
                    newContest.push(elem);
                  } else{
                    newContest.push(elem);
                  }
                } else{
                  newContest.push(elem);
                }
              }
            }
          } else{
            newContest.push(elem);
          }
        }
    
        res.status(200).json({
          status: "success",
          message: "Upcoming TestZones fetched successfully",
          data: newContest,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.userLive = async (req, res) => {
    try {
        const userId = req.user._id;
        const referredBy = req.user.referredBy;

        const contests = await DailyContest.aggregate([
            {
                $match: {
                    contestFor: "StoxHero",
                    contestStatus: "Active",
                    contestStartTime: { $lte: new Date() },
                    contestEndTime: { $gte: new Date() },
                    $or: [
                      { visibility: true },
                      {
                        visibility: false,
                        potentialParticipants: {
                          $elemMatch: { $eq: new ObjectId(userId) },
                        },
                      },
                    ],
                  },
            },
            {
                $lookup: {
                    from: "user-portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio",
                },
            },
            {
                $addFields: {
                    isInterested: {
                        $in: [new ObjectId(userId), "$interestedUsers.userId"],
                    },
                },
            },
            {
                $addFields: {
                    isPaid: {
                        $in: [new ObjectId(userId), "$participants.userId"],
                    },
                },
            },
            {
                $project: {
                    isInterested: 1,
                    isPaid: 1,
                    contestName: 1,
                    contestStartTime: 1,
                    contestEndTime: 1,
                    isAllIndex: 1,
                    payoutType: 1,
                    isNifty: 1,
                    isBankNifty: 1,
                    isFinNifty: 1,
                    entryFee: 1,
                    rewardType: 1,
                    contestStatus: 1,
                    payoutPercentage: 1,
                    maxParticipants: 1,
                    featured: 1,
                    payoutCapPercentage: 1,
                    rewards: 1,
                    contestExpiry: 1,
                    courseInstructors: 1,
                    visibleToInfluencerUser: 1,
                    participants: {
                        $size: '$participants'
                    },
                    interestedUsers: {
                        $size: '$interestedUsers'
                    },
                    portfolioValue: {
                        $arrayElemAt: [
                            "$portfolio.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    contestEndTime: -1,
                },
            },
        ])

        if (!contests) {
            return res.status(404).json({ message: "Contest not found" });
        }
        
        const newContest = [];
        const influencerTestzone = [];
        let isInfluencerReferred = await User.findOne({_id: referredBy, role: new ObjectId('65dc6817586cba2182f05561')})
        for(const elem of contests){
          if(elem?.courseInstructors?.length > 0){
            for(const subelem of elem?.courseInstructors){
              if(subelem?.id?.toString() === (referredBy)?.toString()){
                // isInfluencerReferred = true;         
                if(subelem?.fee !== undefined || subelem?.fee !== null){
                  
                  const checkCoursePurchased = await Course.aggregate([
                    {
                      $match: {
                        "courseInstructors.id": new ObjectId(
                          referredBy
                        ),
                        "enrollments.userId": new ObjectId(userId)
                      },
                    }
                  ])
                  if(checkCoursePurchased[0]){
                    elem.entryFee = subelem?.fee
                    influencerTestzone.push(elem);
                    newContest.push(elem);
                  } else{
                    influencerTestzone.push(elem);
                    newContest.push(elem);
                  }
                } else{
                  influencerTestzone.push(elem);
                  newContest.push(elem);
                }
              }
            }
          } else{
            newContest.push(elem);
            if(elem?.visibleToInfluencerUser && isInfluencerReferred){
              influencerTestzone.push(elem);
            }
          }
        }
    
        res.status(200).json({
          status: "success",
          message: "Live TestZones fetched successfully",
          data: isInfluencerReferred ? influencerTestzone : newContest,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};