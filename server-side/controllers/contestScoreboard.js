const mongoose = require('mongoose');
const Contest = require('../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../models/User/userDetailSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const { ObjectId } = require('mongodb');
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");



// Controller for getting all contests
exports.getContestScoreboard = async (req, res) => {
    try {
        const pipeline = [
          {
            $match: {
              status: "COMPLETE",
            },
          },
          {
            $group: {
              _id: {
                trader: "$trader",
                contest: "$contestId",
              },
              gpnl: {
                $sum: {
                  $multiply: ["$amount", -1],
                },
              },
              brokerage: {
                $sum: "$brokerage",
              },
            },
          },
          {
            $addFields: {
              npnl: {
                $subtract: ["$gpnl", "$brokerage"],
              },
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "_id.trader",
              foreignField: "_id",
              as: "trader_details",
            },
          },
          {
            $lookup: {
              from: "daily-contests",
              localField: "_id.contest",
              foreignField: "_id",
              as: "contest",
            },
          },
          {
            $addFields: {
              payout: {
                $divide: [
                  {
                    $multiply: [
                      "$npnl",
                      {
                        $arrayElemAt: [
                          "$contest.payoutPercentage",
                          0,
                        ],
                      },
                    ],
                  },
                  100,
                ],
              },
            },
          },
          {
            $match: {
              "contest.contestStatus": "Completed",
              "contest.payoutStatus": "Completed",
            },
          },
          {
            $group: {
              _id: {
                trader: "$_id.trader",
              },
              contestParticipated: {
                $sum: 1,
              },
              contestWon: {
                $sum: {
                  $cond: [
                    {
                      $gt: ["$payout", 0],
                    },
                    1,
                    0,
                  ],
                },
              },
              totalPayout: {
                $sum: {
                  $cond: [
                    {
                      $gt: ["$payout", 0],
                    },
                    "$payout",
                    0,
                  ],
                },
              },
              trader_details: {
                $first: "$trader_details",
              },
            },
          },
          {
            $project: {
              traderFirstName: {
                $arrayElemAt: [
                  "$trader_details.first_name",
                  0,
                ],
              },
              traderLastName: {
                $arrayElemAt: [
                  "$trader_details.last_name",
                  0,
                ],
              },
              traderProfilePhoto: {
                $arrayElemAt: [
                  "$trader_details.profilePhoto.url",
                  0,
                ],
              },
              contestParticipated: 1,
              contestWon: 1,
              totalPayout: 1,
            },
          },
          {
            $addFields: {
              strikeRate: {
                $multiply: [
                  {
                    $divide: [
                      "$contestWon",
                      "$contestParticipated",
                    ],
                  },
                  100,
                ],
              },
            },
          },
          {
            $match:
              {
                totalPayout: {
                  $gt: 0,
                },
              },
          },
          {
            $sort:
            {
              totalPayout: -1
            }
          }
        ]

        const contestScoreboard = await DailyContestMockUser.aggregate(pipeline)

        res.status(200).json({
            status:"success",
            message: "Contest Scoreboard fetched successfully",
            data: contestScoreboard
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message: "Something went wrong",
            error: error.message
        });
    }
};


