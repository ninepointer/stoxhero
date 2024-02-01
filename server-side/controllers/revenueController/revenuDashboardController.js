const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const TestZone = require("../../models/DailyContest/dailyContest")
const TenX = require("../../models/TenXSubscription/TenXSubscriptionSchema")
const MarginX = require("../../models/marginX/marginX")
const Battle = require("../../models/battle/battle")
const User = require("../../models/User/userDetailSchema")
const PaperTrading = require("../../models/mock-trade/paperTrade")
const TenXTrading = require("../../models/mock-trade/tenXTraderSchema")
const TestZoneTrading = require("../../models/DailyContest/dailyContestMockUser")
const MarginXTrading = require("../../models/marginX/marginXUserMock")
const InternshipTrading = require("../../models/mock-trade/internshipTrade")
const BattleTrading = require("../../models/battle/battleTrade")
const moment = require('moment');
const Wallet = require("../../models/UserWallet/userWalletSchema");
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");
const Career = require("../../models/Careers/careerSchema");
const CareerApplication = require("../../models/Careers/careerApplicationSchema")

exports.getTestZoneRevenue = async (req, res) => {
  try {
    const testZonepipeline = [
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.participatedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          monthRevenue: "$totalRevenue",
          monthGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          discountAmount: {
            $subtract: ["$monthGMV", "$monthRevenue"],
          },
          arpu: {
            $divide: [
              "$monthRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$monthRevenue", "$totalOrder"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ]

    const totalTestZoneRevenuePipeline = [
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
          arpu: {
            $divide: [
              "$totalRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$totalRevenue", "$totalOrder"],
          },
        },
      },
    ]

    const tenXpipeline = [
      {
        $unwind: "$users",
      },
      {
        $match: {
          "users.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$users.subscribedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$users.fee",
                "$discounted_price",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$users.actualPrice",
                "$discounted_price",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$users.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          monthRevenue: "$totalRevenue",
          monthGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          discountAmount: {
            $subtract: ["$monthGMV", "$monthRevenue"],
          },
          arpu: {
            $divide: [
              "$monthRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$monthRevenue", "$totalOrder"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ]

    const totalTenXRevenuePipeline = [
      {
        $unwind: "$users",
      },
      {
        $match: {
          "users.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$users.fee",
                "$discounted_price",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$users.actualPrice",
                "$actual_price",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$users.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
          arpu: {
            $divide: [
              "$totalRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$totalRevenue", "$totalOrder"],
          },
        },
      },
    ]

    const marginXpipeline = [
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginx-template",
        },
      },
      {
        $unwind: "$marginx-template",
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$marginx-template.entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$marginx-template.entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          monthRevenue: "$totalRevenue",
          monthGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          discountAmount: {
            $subtract: ["$monthGMV", "$monthRevenue"],
          },
          arpu: {
            $divide: [
              "$monthRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$monthRevenue", "$totalOrder"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ]

    const totalMarginXRevenuePipeline = [
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginx-template",
        },
      },
      {
        $unwind: "$marginx-template",
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$marginx-template.entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$marginx-template.entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: "$totalRevenue",
          totalGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
          arpu: {
            $divide: [
              "$totalRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$totalRevenue", "$totalOrder"],
          },
        },
      },
    ]

    const battlepipeline = [
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle-template",
        },
      },
      {
        $unwind: "$battle-template",
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$battle-template.entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$battle-template.entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          monthRevenue: "$totalRevenue",
          monthGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          discountAmount: {
            $subtract: ["$monthGMV", "$monthRevenue"],
          },
          arpu: {
            $divide: [
              "$monthRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$monthRevenue", "$totalOrder"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ]

    const totalBattleRevenuePipeline = [
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle-template",
        },
      },
      {
        $unwind: "$battle-template",
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$participants.fee",
                "$battle-template.entryFee",
              ],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: [
                "$participants.actualPrice",
                "$battle-template.entryFee",
              ],
            },
          },
          totalOrder: {
            $sum: 1,
          },
          uniqueUsers: {
            $addToSet: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: "$totalRevenue",
          totalGMV: "$totalGMV",
          totalOrder: 1,
          uniqueUsersCount: {
            $size: "$uniqueUsers",
          },
        },
      },
      {
        $addFields: {
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
          arpu: {
            $divide: [
              "$totalRevenue",
              "$uniqueUsersCount",
            ],
          },
          aov: {
            $divide: ["$totalRevenue", "$totalOrder"],
          },
        },
      },
    ]
  

    const [testZoneMonthWiseRevenue, totalTestZoneRevenue, tenXMonthWiseRevenue, totalTenXRevenue, marginXMonthWiseRevenue, totalMarginXRevenue, battleMonthWiseRevenue, totalBattleRevenue] = await Promise.all([
        TestZone.aggregate(testZonepipeline),
        TestZone.aggregate(totalTestZoneRevenuePipeline),
        TenX.aggregate(tenXpipeline),
        TenX.aggregate(totalTenXRevenuePipeline),
        MarginX.aggregate(marginXpipeline),
        MarginX.aggregate(totalMarginXRevenuePipeline),
        Battle.aggregate(battlepipeline),
        Battle.aggregate(totalBattleRevenuePipeline),
    ]);

    const response = {
      testZoneData: testZoneMonthWiseRevenue?.slice(0, 6)?.reverse(),
      totalTestZoneRevenue: totalTestZoneRevenue[0] ? totalTestZoneRevenue[0] : 0,
      tenXData: tenXMonthWiseRevenue?.slice(0, 6)?.reverse(),
      totalTenXRevenue: totalTenXRevenue[0] ? totalTenXRevenue[0] : 0,
      marginXData: marginXMonthWiseRevenue?.slice(0, 6)?.reverse(),
      totalMarginXRevenue: totalMarginXRevenue[0] ? totalMarginXRevenue[0] : 0,
      battleData: battleMonthWiseRevenue?.slice(0, 6)?.reverse(),
      totalBattleRevenue: totalBattleRevenue[0] ? totalBattleRevenue[0] : 0,
      status: "success",
      message: "Revenue Data fetched successfully",
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

exports.getOverallRevenue = async(req,res,next) => {
  try{
    const totalTestZonePipeline =[
      {
        $match: {
          entryFee: { $gt: 0 },
        },
      },
      {
        $project: {
          entryFee: 1,
          participants: 1,
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", "$entryFee"],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", "$entryFee"],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
    ];
    const totalTestZoneMonthPipeline =[
      {
        $match: {
          entryFee: { $gt: 0 },
        },
      },
      {
        $project: {
          entryFee: 1,
          participants: 1,
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.participatedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", "$entryFee"],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", "$entryFee"],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ];
    
    const totalTenxPipeline = [
      {
        $unwind: "$users",
      },
      {
        $match: {
          "users.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: ["$users.fee", "$discounted_price"],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$users.actualPrice", "$actual_price"],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$users.userId" },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:1,
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
      },
    },
    ];
    const totalTenxMonthPipeline = [
      {
        $unwind: "$users",
      },
      {
        $match: {
          "users.userId": { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$users.subscribedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: ["$users.fee", "$discounted_price"],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$users.actualPrice", "$actual_price"],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$users.userId" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:1,
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
      },
    },
    {
      $addFields: {
        monthName: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: ["$month", 1],
                },
                then: "Jan",
              },
              {
                case: {
                  $eq: ["$month", 2],
                },
                then: "Feb",
              },
              {
                case: {
                  $eq: ["$month", 3],
                },
                then: "Mar",
              },
              {
                case: {
                  $eq: ["$month", 4],
                },
                then: "Apr",
              },
              {
                case: {
                  $eq: ["$month", 5],
                },
                then: "May",
              },
              {
                case: {
                  $eq: ["$month", 6],
                },
                then: "Jun",
              },
              {
                case: {
                  $eq: ["$month", 7],
                },
                then: "Jul",
              },
              {
                case: {
                  $eq: ["$month", 8],
                },
                then: "Aug",
              },
              {
                case: {
                  $eq: ["$month", 9],
                },
                then: "Sep",
              },
              {
                case: {
                  $eq: ["$month", 10],
                },
                then: "Oct",
              },
              {
                case: {
                  $eq: ["$month", 11],
                },
                then: "Nov",
              },
              {
                case: {
                  $eq: ["$month", 12],
                },
                then: "Dec",
              },
            ],
            default: null,
          },
        },
      },
    },
    {
      $addFields: {
        formattedDate: {
          $concat: [
            "$monthName",
            "-",
            {
              $toString: {
                $substr: ["$year", 2, 4],
              },
            },
          ],
        },
      },
    },
    {
      $sort: {
        year: -1,
        month: -1,
      },
    },
    ];

    const totalMarginXPipeline = [
      {
        $lookup: {
          from: 'marginx-templates', // Replace with the actual name of the marginX-template collection
          localField: 'marginXTemplate',
          foreignField: '_id',
          as: 'templateData',
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
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
    ];
    const totalMarginXMonthPipeline = [
      {
        $lookup: {
          from: 'marginx-templates', // Replace with the actual name of the marginX-template collection
          localField: 'marginXTemplate',
          foreignField: '_id',
          as: 'templateData',
        },
      },
      {
        $unwind: {
          path: "$participants",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $match: {
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ];

    const totalBattlePipeline = [
      {
        $lookup: {
          from: 'battle-templates', // Replace with the actual name of the marginX-template collection
          localField: 'battleTemplate',
          foreignField: '_id',
          as: 'templateData',
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
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
    ];
    const totalBattleMonthPipeline = [
      {
        $lookup: {
          from: 'battle-templates', // Replace with the actual name of the marginX-template collection
          localField: 'battleTemplate',
          foreignField: '_id',
          as: 'templateData',
        },
      },
      {
        $unwind: {
          path: "$participants",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $match: {
          "participants.userId": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$purchaseDate",
            },
            year: {
              $year: "$purchaseDate",
            },
          },
          totalRevenue: {
            $sum: {
              $ifNull: ["$participants.fee", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalGMV: {
            $sum: {
              $ifNull: ["$participants.actualPrice", { $arrayElemAt: ["$templateData.entryFee", 0] }],
            },
          },
          totalOrder: { $sum: 1 },
          uniqueUsers: { $addToSet: "$participants.userId" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalRevenue: 1,
          totalGMV: 1,
          totalOrder: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          uniqueUsers:"$uniqueUsers",
          totalDiscountAmount: {
            $subtract: ["$totalGMV", "$totalRevenue"],
          },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$month", 1],
                  },
                  then: "Jan",
                },
                {
                  case: {
                    $eq: ["$month", 2],
                  },
                  then: "Feb",
                },
                {
                  case: {
                    $eq: ["$month", 3],
                  },
                  then: "Mar",
                },
                {
                  case: {
                    $eq: ["$month", 4],
                  },
                  then: "Apr",
                },
                {
                  case: {
                    $eq: ["$month", 5],
                  },
                  then: "May",
                },
                {
                  case: {
                    $eq: ["$month", 6],
                  },
                  then: "Jun",
                },
                {
                  case: {
                    $eq: ["$month", 7],
                  },
                  then: "Jul",
                },
                {
                  case: {
                    $eq: ["$month", 8],
                  },
                  then: "Aug",
                },
                {
                  case: {
                    $eq: ["$month", 9],
                  },
                  then: "Sep",
                },
                {
                  case: {
                    $eq: ["$month", 10],
                  },
                  then: "Oct",
                },
                {
                  case: {
                    $eq: ["$month", 11],
                  },
                  then: "Nov",
                },
                {
                  case: {
                    $eq: ["$month", 12],
                  },
                  then: "Dec",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          formattedDate: {
            $concat: [
              "$monthName",
              "-",
              {
                $toString: {
                  $substr: ["$year", 2, 4],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ];
    
    const [totalTestZoneRevenue, totalTestZoneMonthRevenue, totalTenXRevenue, totalTenXMonthRevenue, 
      totalMarginXRevenue, totalMarginXMonthRevenue, totalBattleRevenue, totalBattleMonthRevenue] = await Promise.all([
      TestZone.aggregate(totalTestZonePipeline),
      TestZone.aggregate(totalTestZoneMonthPipeline),
      TenX.aggregate(totalTenxPipeline),
      TenX.aggregate(totalTenxMonthPipeline),
      MarginX.aggregate(totalMarginXPipeline),
      MarginX.aggregate(totalMarginXMonthPipeline),
      Battle.aggregate(totalBattlePipeline),
      Battle.aggregate(totalBattleMonthPipeline),
  ]);

  let allUniqueUsers = new Set();
  let totalRevenueSum = 0;
  let totalGMVSum = 0;
  let totalOrderSum = 0;
  let totalDiscountSum = 0;
  [totalTestZoneRevenue, totalTenXRevenue, totalMarginXRevenue, totalBattleRevenue].forEach(response => {
    if (response.length > 0) {
      if (response[0].uniqueUsers) {
        response[0].uniqueUsers.forEach(userId => {
          allUniqueUsers.add(userId.toString());
        });
      }
      totalRevenueSum += response[0].totalRevenue || 0;
      totalGMVSum += response[0].totalGMV || 0;
      totalOrderSum += response[0].totalOrder || 0;
      totalDiscountSum += response[0].totalDiscountAmount || 0;
    }
  });
  const getMonthYearFromFormattedDate = (formattedDate) => {
    const parts = formattedDate.split('-'); // Assuming formattedDate is like "Nov-23"
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames.indexOf(parts[0]) + 1;
    const year = parseInt(parts[1], 10) + 2000; // Adjust this based on your actual data format
    return { month, year };
  };
  
  const isWithinLastSixMonths = (formattedDate, currentMonth, currentYear) => {
    const { month, year } = getMonthYearFromFormattedDate(formattedDate);
    const monthDifference = currentMonth - month + (currentYear - year) * 12;
    return monthDifference >= 0 && monthDifference < 6;
  };
  
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  let monthlyAggregates = {};
  [totalTestZoneMonthRevenue, totalTenXMonthRevenue, totalMarginXMonthRevenue, totalBattleMonthRevenue].forEach(response => {
    response.forEach(monthData => {
      if(isWithinLastSixMonths(monthData.formattedDate, currentMonth, currentYear)){

        const monthKey = monthData.formattedDate;
        
        if (!monthlyAggregates[monthKey]) {
          monthlyAggregates[monthKey] = {
            totalRevenue: 0,
            totalGMV: 0,
            totalOrder: 0,
            uniqueUsers: new Set(),
          };
        }
    
        monthlyAggregates[monthKey].totalRevenue += monthData.totalRevenue;
        monthlyAggregates[monthKey].totalGMV += monthData.totalGMV;
        monthlyAggregates[monthKey].totalOrder += monthData.totalOrder;
        monthData.uniqueUsers.forEach(user => monthlyAggregates[monthKey].uniqueUsers.add(user.toString()));
      }
    });
  });

  // Object.keys(monthlyAggregates).forEach(monthKey => {
  //   monthlyAggregates[monthKey].uniqueUsers = Array.from(monthlyAggregates[monthKey].uniqueUsers);
  //   monthlyAggregates[monthKey].uniqueUsersCount = monthlyAggregates[monthKey].uniqueUsers.length;
  // });

  // const sortedMonthlyAggregates = Object.keys(monthlyAggregates)
  // .sort((a, b) => new Date(getMonthYearFromFormattedDate(a).year, getMonthYearFromFormattedDate(a).month) - new Date(getMonthYearFromFormattedDate(b).year, getMonthYearFromFormattedDate(b).month))
  // .reduce((obj, key) => {
  //   obj[key] = monthlyAggregates[key];
  //   return obj;
  // }, {});
  Object.keys(monthlyAggregates).forEach(monthKey => {
    monthlyAggregates[monthKey] = {
      monthRevenue: monthlyAggregates[monthKey].totalRevenue,
      monthGMV: monthlyAggregates[monthKey].totalGMV,
      totalOrder: monthlyAggregates[monthKey].totalOrder,
      uniqueUsersCount: monthlyAggregates[monthKey].uniqueUsers.size,
      formattedDate: monthKey,
      arpu: monthlyAggregates[monthKey].totalRevenue/monthlyAggregates[monthKey].uniqueUsers.size,
      aov: monthlyAggregates[monthKey].totalRevenue/monthlyAggregates[monthKey].totalOrder,
      aos: monthlyAggregates[monthKey].totalOrder/monthlyAggregates[monthKey].uniqueUsers.size,
    };
  });
  
  // Sort the monthly data in ascending order and convert to an array of objects
  const sortedMonthlyAggregatesArray = Object.keys(monthlyAggregates)
    .sort((a, b) => new Date(getMonthYearFromFormattedDate(a).year, getMonthYearFromFormattedDate(a).month) - new Date(getMonthYearFromFormattedDate(b).year, getMonthYearFromFormattedDate(b).month))
    .map(key => monthlyAggregates[key]);
  
  let allUniqueUsersArray = Array.from(allUniqueUsers);
  // console.log("All Users:",allUniqueUsersArray, allUniqueUsersArray?.length)
  let allUniqueUsersCount = allUniqueUsersArray.length;
  let formattedUserDetails;
  async function fetchUserDetails() {
    try {
      const userDetails = await User.find({ _id: { $in: allUniqueUsersArray } }, '_id creationProcess');
      formattedUserDetails = userDetails?.map(({ _id, creationProcess }) => ({ _id, creationProcess }));
    } catch (err) {
      console.error('Error:', err);
    }
  }
  await fetchUserDetails();

  const userCountsByProcess = formattedUserDetails?.reduce((result, { creationProcess }) => {
    result[creationProcess] = (result[creationProcess] || 0) + 1;
    return result;
  }, {});

  const userCountsByProcessArray = Object.entries(userCountsByProcess).map(([creationProcess, count]) => ({
    creationProcess,
    count,
  }));

  // console.log(userCountsByProcess)
  
  let overallAOV = totalRevenueSum/totalOrderSum;
  let overallArpu = totalRevenueSum/allUniqueUsersCount;
  let overallAOS =  totalOrderSum/allUniqueUsersCount;
  // console.log("Total Revenue:", totalRevenueSum);
  // console.log("Total GMV:", totalGMVSum);
  // console.log("Total Orders:", totalOrderSum);
  // console.log("Unique Users:", allUniqueUsersCount); 
  // console.log("Total AOV:", overallAOV); 
  // console.log("Total Arpu:", overallArpu);
  
  const response = {
    totalRevenueData:{
      totalRevenue: totalRevenueSum,
      totalGMV: totalGMVSum,
      totalOrder: totalOrderSum,
      uniqueUsers: allUniqueUsersCount,
      totalAOV: overallAOV,
      totalArpu: overallArpu,
      totalAOS: overallAOS,
      totalDiscount: totalDiscountSum,
    },
    totalMonthWiseData:sortedMonthlyAggregatesArray,
    userByCreationProcess: userCountsByProcessArray,
    status: "success",
    message: "Revenue Data fetched successfully",
  }
  res.status(200).json(response);
  }catch(e){
    console.log(e);
  }
}

exports.downloadTestZoneRevenueData = async (req, res) => {

  try {

    const testZoneRevenueDataPipeline = [
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "portfolio",
          foreignField: "_id",
          as: "portfolio-details",
        },
      },
      {
        $unwind: "$portfolio-details",
      },
      {
        $addFields: {
          testzoneDate: {
            $add: [
              "$contestStartTime",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
          purchaseDate: {
            $add: [
              "$participants.participatedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
          joiningDate: {
            $add: [
              "$user.joining_date",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          first_name: "$user.first_name",
          last_name: "$user.last_name",
          mobile: "$user.mobile",
          email: "$user.email",
          testzone: "$contestName",
          testzoneDate: "$testzoneDate",
          testzonePortfolio:
            "$portfolio-details.portfolioValue",
          purchaseDate: "$purchaseDate",
          joiningDate: "$joiningDate",
          campaignCode: {
            $ifNull: ["$user.campaignCode", ""],
          },
          referrerCode: {
            $ifNull: ["$user.referrerCode", ""],
          },
          myReferralCode: {
            $ifNull: ["$user.myReferralCode", ""],
          },
          contestStatus: {
            $ifNull: ["$contestStatus", ""],
          },
          actualPrice: {
            $ifNull: ["$actualPrice", "$entryFee"],
          },
          creationProcess: {
            $ifNull: ["$user.creationProcess", ""],
          },
          buyingPrice: {
            $ifNull: [
              "$participants.fee",
              "$entryFee",
            ],
          },
          bonusRedemption: {
            $ifNull: ["$bonusRedemption", 0],
          },
          tdsAmount: {
            $ifNull: ["$tdsAmount", 0],
          },
          rank: {
            $ifNull: ["$participants.rank", ""],
          },
          payout: {
            $ifNull: ["$participants.payout", 0],
          },
          npnl: {
            $ifNull: ["$participants.npnl", 0],
          },
          gpnl: {
            $ifNull: ["$participants.gpnl", 0],
          },
          trades: {
            $ifNull: ["$participants.trades", 0],
          },
        },
      },
      {
        $sort:{
          testzoneDate:-1
        }
      }
    ]

    const testZoneRevenueData = await TestZone.aggregate(testZoneRevenueDataPipeline);

    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: testZoneRevenueData,
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

exports.downloadMarginXRevenueData = async (req, res) => {

  try {

    const marginXRevenueDataPipeline = [
      {
        $unwind: "$participants",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginx-template",
        },
      },
      {
        $unwind: "$marginx-template",
      },
      {
        $addFields: {
          testzoneDate: {
            $add: [
              "$startTime",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
          purchaseDate: {
            $add: [
              "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
          joiningDate: {
            $add: [
              "$user.joining_date",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          first_name: "$user.first_name",
          last_name: "$user.last_name",
          mobile: "$user.mobile",
          email: "$user.email",
          testzone: "$marginXName",
          testzoneDate: "$testzoneDate",
          testzonePortfolio:
            "$marginx-template.portfolioValue",
          purchaseDate: "$purchaseDate",
          joiningDate: "$joiningDate",
          campaignCode: {
            $ifNull: ["$user.campaignCode", ""],
          },
          referrerCode: {
            $ifNull: ["$user.referrerCode", ""],
          },
          myReferralCode: {
            $ifNull: ["$user.myReferralCode", ""],
          },
          creationProcess: {
            $ifNull: ["$user.creationProcess", ""],
          },
          contestStatus: {
            $ifNull: ["$status", ""],
          },
          actualPrice: {
            $ifNull: ["$actualPrice", "$marginx-template.entryFee"],
          },
          buyingPrice: {
            $ifNull: [
              "$participants.fee",
              "$marginx-template.entryFee",
            ],
          },
          bonusRedemption: {
            $ifNull: ["$bonusRedemption", 0],
          },
          tdsAmount: {
            $ifNull: ["$tdsAmount", 0],
          },
          rank: {
            $ifNull: ["$participants.rank", ""],
          },
          payout: {
            $ifNull: ["$participants.payout", 0],
          },
          npnl: {
            $ifNull: ["$participants.npnl", 0],
          },
          gpnl: {
            $ifNull: ["$participants.gpnl", 0],
          },
          trades: {
            $ifNull: ["$participants.trades", 0],
          },
        },
      },
    ]

    const marginXRevenueData = await MarginX.aggregate(marginXRevenueDataPipeline);
    
    const response = {
      status: "success",
      message: "MatginX Revenue Data fetched",
      data: marginXRevenueData,
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

exports.getRetentionPercentageForMonth = async(req,res,next) => {
  try{
    
    let getActiveUsersBeforeTheMonth = async() => {

    const traderpipeline =[
      {
          $match: {
              trade_time: {
                  $gte: new Date("2023-05-01"),
                  $lte: new Date("2023-12-01")
              }
          }
      },
      {
          $group: {
              _id: '$trader',
          }
      },
      {
          $project: {
              _id: 0, 
              trader: '$_id'
          }
      }
    ]

    const collections = [PaperTrading, TenXTrading, TestZoneTrading, InternshipTrading, MarginXTrading, BattleTrading];
    const uniqueUsersSet = new Set();

    for (const collection of collections) {
      const traders = await collection.aggregate(traderpipeline);
      traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
    }

    return Array.from(uniqueUsersSet);
    }

    let getActiveUsersDuringTheMonth = async() => {

      const pipeline = [
          {
              $match: {
                  trade_time: {
                      $gte: new Date("2023-11-01"),
                      $lte: new Date("2023-12-01")
                  }
              }
          },
          {
              $group: {
                  _id: '$trader',
              }
          },
          {
              $project: {
                  _id: 0, 
                  trader: '$_id'
              }
          }
      ];

      const collections = [PaperTrading, TenXTrading, TestZoneTrading, InternshipTrading, MarginXTrading, BattleTrading];
      const uniqueUsersSet = new Set();

      // Iterate over each collection and add unique traders to the set
      for (const collection of collections) {
          const traders = await collection.aggregate(pipeline);
          traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
      }

      return Array.from(uniqueUsersSet);
    }

    const getRetentionPercentageForMonth = async () => {
      // Get traders from the last 180 days before the month
      const tradersLast180Days = await getActiveUsersBeforeTheMonth();
      console.log("tradersLast180Days",tradersLast180Days?.length)
      // Get traders during the month
      const tradersDuringMonth = await getActiveUsersDuringTheMonth();
      console.log("tradersDuringMonth",tradersDuringMonth?.length)
      // Find the overlap between the two lists
      const overlap = tradersDuringMonth.filter(trader => tradersLast180Days.includes(trader));
      const lostUsers = tradersLast180Days.filter(trader => !tradersDuringMonth.includes(trader))
      console.log("Lost Users:",lostUsers?.length)
      console.log("Retained Users:",overlap?.length)
      console.log("Last Months Users:",tradersLast180Days?.length)
      console.log("This Months Users:",tradersDuringMonth?.length)
      // Calculate the retention percentage
      const retentionPercentage = overlap.length / tradersLast180Days.length * 100;
    
      return retentionPercentage;
    };
  
    const retentionPercentage = await getRetentionPercentageForMonth();
  
  const response = {
    data: retentionPercentage,
    status: "success",
    message: "Revenue Data fetched successfully",
  }
  res.status(200).json(response);
  }catch(e){
    console.log(e);
  }
}

exports.getPaidRetentionPercentageForMonth = async(req,res,next) => {
  try{
    let field;
    let getActiveUsersBeforeTheMonth = async() => {

    const testzonepipeline =[
      {
        $unwind: "$participants",
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
          "participants.participatedOn": {
            $gte: new Date("2023-05-01"),
            $lt: new Date("2023-11-01"),
          },
        },
      },
      {
        $group: {
          _id: {
            trader: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          trader: "$_id.trader",
        },
      },
    ]

    const tenxpipeline=[
      {
        $unwind: "$users",
      },
      {
        $match: {
          "users.subscribedOn": {
            $gte: new Date("2023-05-01"),
            $lt: new Date("2023-11-01"),
          },
        },
      },
      {
        $group: {
          _id: {
            trader: "$users.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          trader: "$_id.trader",
        },
      },
    ]

    const battleandmarginxpipeline=[
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants.boughtAt": {
            $gte: new Date("2023-05-01"),
            $lt: new Date("2023-11-01"),
          },
        },
      },
      {
        $group: {
          _id: {
            trader: "$participants.userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          trader: "$_id.trader",
        },
      },
    ]

    const collections = [TenX, TestZone, MarginX, Battle];
    const uniqueUsersSet = new Set();

    // for (const collection of collections) {
      const tenxtraders = await TenX.aggregate(tenxpipeline);
      const testzonetraders = await TestZone.aggregate(testzonepipeline);
      const marginxtraders = await MarginX.aggregate(battleandmarginxpipeline);
      const battletraders = await TestZone.aggregate(battleandmarginxpipeline);
      const traders = [
        ...tenxtraders,
        ...testzonetraders,
        ...marginxtraders,
        ...battletraders
      ];
      traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
    // }

    return Array.from(uniqueUsersSet);
    }

    let getActiveUsersDuringTheMonth = async() => {

      const testzonepipeline =[
        {
          $unwind: "$participants",
        },
        {
          $match: {
            entryFee: {
              $gt: 0,
            },
            "participants.participatedOn": {
              $gte: new Date("2023-11-01"),
              $lt: new Date("2023-12-01"),
            },
          },
        },
        {
          $group: {
            _id: {
              trader: "$participants.userId",
            },
          },
        },
        {
          $project: {
            _id: 0,
            trader: "$_id.trader",
          },
        },
      ]
  
      const tenxpipeline=[
        {
          $unwind: "$users",
        },
        {
          $match: {
            "users.subscribedOn": {
              $gte: new Date("2023-11-01"),
              $lt: new Date("2023-12-01"),
            },
          },
        },
        {
          $group: {
            _id: {
              trader: "$users.userId",
            },
          },
        },
        {
          $project: {
            _id: 0,
            trader: "$_id.trader",
          },
        },
      ]
  
      const battleandmarginxpipeline=[
        {
          $unwind: "$participants",
        },
        {
          $match: {
            "participants.boughtAt": {
              $gte: new Date("2023-11-01"),
              $lt: new Date("2023-12-01"),
            },
          },
        },
        {
          $group: {
            _id: {
              trader: "$participants.userId",
            },
          },
        },
        {
          $project: {
            _id: 0,
            trader: "$_id.trader",
          },
        },
      ]
  
      const collections = [TenX, TestZone, MarginX, Battle];
      const uniqueUsersSet = new Set();
  
      // for (const collection of collections) {
        const tenxtraders = await TenX.aggregate(tenxpipeline);
        const testzonetraders = await TestZone.aggregate(testzonepipeline);
        const marginxtraders = await MarginX.aggregate(battleandmarginxpipeline);
        const battletraders = await TestZone.aggregate(battleandmarginxpipeline);
        const traders = [
          ...tenxtraders,
          ...testzonetraders,
          ...marginxtraders,
          ...battletraders
        ];
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
      // }
  
      return Array.from(uniqueUsersSet);
    }

    const getRetentionPercentageForMonth = async () => {
      // Get traders from the last 180 days before the month
      const tradersLast180Days = await getActiveUsersBeforeTheMonth();
      console.log("tradersLast180Days",tradersLast180Days?.length)
      // Get traders during the month
      const tradersDuringMonth = await getActiveUsersDuringTheMonth();
      console.log("tradersDuringMonth",tradersDuringMonth?.length)
      // Find the overlap between the two lists
      const overlap = tradersDuringMonth.filter(trader => tradersLast180Days.includes(trader));
      const lostUsers = tradersLast180Days.filter(trader => !tradersDuringMonth.includes(trader))
      console.log("Lost Users:",lostUsers?.length)
      console.log("Retained Users:",overlap?.length)
      console.log("Last Months Users:",tradersLast180Days?.length)
      console.log("This Months Users:",tradersDuringMonth?.length)
    
      // Calculate the retention percentage
      const retentionPercentage = overlap.length / tradersLast180Days.length * 100;
    
      return retentionPercentage;
    };
  
    const retentionPercentage = await getRetentionPercentageForMonth();
  
  const response = {
    data: retentionPercentage,
    status: "success",
    message: "Revenue Data fetched successfully",
  }
  res.status(200).json(response);
  }catch(e){
    console.log(e);
  }
}

exports.getRevenueBetweenDate = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);
    const data = await Wallet.aggregate([
      {
        $facet: {
          "newUser": [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $match: {
                "transactions.title": {
                  $in: [
                    "Bought TenX Trading Subscription",
                    "TestZone Fee",
                    "MarginX Fee",
                  ], // Assuming "TestZone Fee" is not repeated intentionally
                },
                "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                },
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                joining_date: {
                  $arrayElemAt: ["$user.joining_date", 0],
                },
              },
            },
            {
              $match: {
                joining_date: {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: "$transactions.title", // Assuming transactions is an array of objects
  
                totalUnits: {
                  $sum: 1,
                },
                totalRevenue: {
                  $sum: "$transactions.amount", // Assuming transactions is an array of objects
                },
              },
            },
            {
              $project: {
                _id: 0,
                product: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ["$_id", "TestZone Fee"],
                        },
                        then: "TestZone",
                      },
                      {
                        case: {
                          $eq: ["$_id", "MarginX Fee"],
                        },
                        then: "MarginX",
                      },
                      {
                        case: {
                          $eq: [
                            "$_id",
                            "Bought TenX Trading Subscription",
                          ],
                        },
                        then: "TenX",
                      },
                    ],
                    default: "Other",
                  },
                },
                totalRevenue: 1,
                totalUnits: 1,
              },
            },
          ],
          "oldUser": [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $match: {
                "transactions.title": {
                  $in: [
                    "Bought TenX Trading Subscription",
                    "TestZone Fee",
                    "MarginX Fee",
                  ], // Assuming "TestZone Fee" is not repeated intentionally
                },
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                joining_date: {
                  $arrayElemAt: ["$user.joining_date", 0],
                },
              },
            },
            {
              $match: {
                joining_date: {
                  $lt: new Date(startDate),
                },
              },
            },
            {
              $group: {
                _id: "$transactions.title", // Assuming transactions is an array of objects
  
                totalUnits: {
                  $sum: 1,
                },
                totalRevenue: {
                  $sum: "$transactions.amount", // Assuming transactions is an array of objects
                },
              },
            },
            {
              $project: {
                _id: 0,
                product: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ["$_id", "TestZone Fee"],
                        },
                        then: "TestZone",
                      },
                      {
                        case: {
                          $eq: ["$_id", "MarginX Fee"],
                        },
                        then: "MarginX",
                      },
                      {
                        case: {
                          $eq: [
                            "$_id",
                            "Bought TenX Trading Subscription",
                          ],
                        },
                        then: "TenX",
                      },
                    ],
                    default: "Other",
                  },
                },
                totalRevenue: 1,
                totalUnits: 1,
              },
            },
          ],
          "total": [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $match: {
                "transactions.title": {
                  $in: [
                    "Bought TenX Trading Subscription",
                    "TestZone Fee",
                    "MarginX Fee",
                  ], // Assuming "TestZone Fee" is not repeated intentionally
                },
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: "$transactions.title", // Assuming transactions is an array of objects
  
                totalUnits: {
                  $sum: 1,
                },
                totalRevenue: {
                  $sum: "$transactions.amount", // Assuming transactions is an array of objects
                },
              },
            },
            {
              $project: {
                _id: 0,
                product: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ["$_id", "TestZone Fee"],
                        },
                        then: "TestZone",
                      },
                      {
                        case: {
                          $eq: ["$_id", "MarginX Fee"],
                        },
                        then: "MarginX",
                      },
                      {
                        case: {
                          $eq: [
                            "$_id",
                            "Bought TenX Trading Subscription",
                          ],
                        },
                        then: "TenX",
                      },
                    ],
                    default: "Other",
                  },
                },
                totalRevenue: 1,
                totalUnits: 1,
              },
            },
          ]
        }
      }
    ])


    const total = {
      new: {
        unit: 0,
        revenue: 0
      },
      old: {
        unit: 0,
        revenue: 0
      },
      total: {
        unit: 0,
        revenue: 0
      }
    };
    data.map((elem)=>{
      
      elem.newUser.map((subelem)=>{
        total.new.unit += subelem.totalUnits;
        total.new.revenue += subelem.totalRevenue;
      })
      elem.oldUser.map((subelem)=>{
        total.old.unit += subelem.totalUnits;
        total.old.revenue += subelem.totalRevenue;
      })
      elem.total.map((subelem)=>{
        total.total.unit += subelem.totalUnits;
        total.total.revenue += subelem.totalRevenue;
      })
    })

    const response = {
      data: data,
      total: total,
      status: "success",
      message: "Revenue Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getSignupChannelBetweenDate = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);

    const data = await Wallet.aggregate([
      {
        $unwind: {
          path: "$transactions",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "transactions.title": {
            $in: [
              "Bought TenX Trading Subscription",
              "TestZone Fee",
              "MarginX Fee",
            ], // Assuming "TestZone Fee" is not repeated intentionally
          },
    
          
                "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                },
        },
      },
      {
        $group: {
          _id: {
            title: "$transactions.title",
            creationProcess:
              "$userData.creationProcess",
          },
          totalUnits: {
            $sum: 1,
          },
          totalRevenue: {
            $sum: {
              $multiply: ["$transactions.amount", -1],
            },
          },
        },
      },
      {
        $project:
          {
            _id: 0,
            channel:"$_id.creationProcess",
            product: {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: [
                        "$_id.title",
                        "TestZone Fee",
                      ],
                    },
                    then: "TestZone",
                  },
                  {
                    case: {
                      $eq: [
                        "$_id.title",
                        "MarginX Fee",
                      ],
                    },
                    then: "MarginX",
                  },
                  {
                    case: {
                      $eq: [
                        "$_id.title",
                        "Bought TenX Trading Subscription",
                      ],
                    },
                    then: "TenX",
                  },
                ],
                default: "Other",
              },
            },
            totalRevenue: 1,
            totalUnits: 1,
          },
      },
    ])

    const response = {
      data: data,
      status: "success",
      message: "Revenue Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getUsersBetweenDate = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);

    const users = await Wallet.aggregate([
      {
        $facet: {
          newUser: [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $match: {
                "transactions.title": {
                  $in: [
                    "Bought TenX Trading Subscription",
                    "TestZone Fee",
                    "MarginX Fee",
                  ], // Assuming "TestZone Fee" is not repeated intentionally
                },
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                joining_date: {
                  $arrayElemAt: ["$user.joining_date", 0],
                },
              },
            },
            {
              $match: {
                joining_date: {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: "$userId", // Assuming transactions is an array of objects
              },
            },
            {
              $count:
                "users",
            },
          ],
          oldUser: [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $match: {
                "transactions.title": {
                  $in: [
                    "Bought TenX Trading Subscription",
                    "TestZone Fee",
                    "MarginX Fee",
                  ], // Assuming "TestZone Fee" is not repeated intentionally
                },
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                joining_date: {
                  $arrayElemAt: ["$user.joining_date", 0],
                },
              },
            },
            {
              $match: {
                joining_date: {
                  $lt: new Date(startDate),
                },
              },
            },
            {
              $group: {
                _id: "$userId", // Assuming transactions is an array of objects
              },
            },
            {
              $count:
                "users",
            },
          ],
        },
      },
    ])

    const response = {
      data: users,
      status: "success",
      message: "User Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getAffiliateRevenueData = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);

    const affiliate = await Affiliate.find().select('affiliates');

    const extractAllAffiliate = affiliate.map((elem) => {
      return elem.affiliates.map((subelem) => {
        return subelem?.userId;
      });
    });
    
    const affiliateIds = [].concat(...extractAllAffiliate);
    
    const users = await User.find({
      // joining_date: { $gt: new Date(startDate), $lt: new Date(endDate) },
      referredBy: { $in: affiliateIds }
    })
    .select('_id');

    
    const userIds = users.map((elem) => elem?._id);
    
    const wallet = await Wallet.aggregate([{
      $facet: {
        'total': [
          {
            $unwind: {
              path: "$transactions",
            },
          },

          {
            $match: {
              userId: {
                $in: userIds,
              },
              $or: [
                {
                  "transactions.title": "TestZone Fee",
                },
                {
                  "transactions.title": "Battle Fee",
                },
                {
                  "transactions.title": "MarginX Fee",
                },
                {
                  "transactions.title":
                    "Bought TenX Trading Subscription",
                },
                {
                  "transactions.title": "Sign up Bonus",
                },
                {
                  "transactions.title":
                    "TenX Joining Bonus",
                },
              ],
              "transactions.transactionDate": {
                $gt: new Date(startDate),
                $lt: new Date(endDate),
              },
            },
          },
          {
            $group: {
              _id: {
                user: "$userId",
              },
              amount: {
                $sum: {
                  $cond: {
                    if: {
                      $not: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                    },
                    then: {
                      $multiply: [
                        "$transactions.amount",
                        -1,
                      ],
                    },
                    else: 0,
                  },
                },
              },
              bonusAmount: {
                $sum: {
                  $cond: {
                    if: {
                      $or: [
                        {
                          $eq: [
                            "$transactions.title",
                            "Sign up Bonus",
                          ],
                        },
                        {
                          $eq: [
                            "$transactions.title",
                            "Tenx Joining Bonus",
                          ],
                        },
                      ],
                    },
                    then: "$transactions.amount",
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "_id.user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
            },
          },
          {
            $project: {
              joining_date: "$user.joining_date",
              email: "$user.email",
              mobile: "$user.mobile",
              referredBy: "$user.referredBy",
              activationDetails:
                "$user.activationDetails",
              paidDetails: "$user.paidDetails",
              amount: 1,
              bonusAmount: 1,
              _id: 0,
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "referredBy",
              foreignField: "_id",
              as: "referredBy",
            },
          },
          {
            $project: {
              amount: 1,
              bonusAmount: 1,
              joining_date: 1,
              activationDetails: 1,
              paidDetails: 1,
              referredBy: {
                $arrayElemAt: ["$referredBy._id", 0],
              },
              first_name: {
                $arrayElemAt: [
                  "$referredBy.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$referredBy.last_name",
                  0,
                ],
              },
              code: {
                $arrayElemAt: [
                  "$referredBy.myReferralCode",
                  0,
                ],
              },
              bonusUsed: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $subtract: [
                          "$bonusAmount",
                          "$amount",
                        ],
                      },
                      0,
                    ],
                  },
                  then: "$amount",
                  else: "$bonusAmount",
                },
              },
            },
          },
          {
            $group: {
              _id: {
                affiliate: "$referredBy",
                code: "$code",
                first_name: "$first_name",
                last_name: "$last_name",
              },
              totalAmount: {
                $sum: "$amount",
              },
              totalBonusAmount: {
                $sum: "$bonusAmount",
              },
              totalBonusUsed: {
                $sum: "$bonusUsed",
              },
            },
          },
          {
            $project: {
              affiliate: "$_id.affiliate",
              code: "$_id.code",
              name: {
                $concat: [
                  "$_id.first_name",
                  " ",
                  "$_id.last_name",
                ],
              },
              _id: 0,
              totalAmount: 1,
              totalBonusUsed: 1,
              totalBonusAmount: 1,
            },
          },
        ],
        'new': [
          {
            $unwind: {
              path: "$transactions",
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
            },
          },
          {
            $match: {
              userId: {
                $in: userIds,
              },
              "user.joining_date": {
                $gt: new Date(startDate),
                $lt: new Date(endDate),
              },
              $or: [
                {
                  "transactions.title": "TestZone Fee",
                },
                {
                  "transactions.title": "Battle Fee",
                },
                {
                  "transactions.title": "MarginX Fee",
                },
                {
                  "transactions.title":
                    "Bought TenX Trading Subscription",
                },
                {
                  "transactions.title": "Sign up Bonus",
                },
                {
                  "transactions.title":
                    "TenX Joining Bonus",
                },
              ],
              "transactions.transactionDate": {
                $gt: new Date(startDate),
                $lt: new Date(endDate),
              },
            },
          },
          {
            $group: {
              _id: {
                userId: "$userId",
                user: "$user",
              },
              amount: {
                $sum: {
                  $cond: {
                    if: {
                      $not: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                    },
                    then: {
                      $multiply: [
                        "$transactions.amount",
                        -1,
                      ],
                    },
                    else: 0,
                  },
                },
              },
              bonusAmount: {
                $sum: {
                  $cond: {
                    if: {
                      $or: [
                        {
                          $eq: [
                            "$transactions.title",
                            "Sign up Bonus",
                          ],
                        },
                        {
                          $eq: [
                            "$transactions.title",
                            "Tenx Joining Bonus",
                          ],
                        },
                      ],
                    },
                    then: "$transactions.amount",
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              joining_date: "$_id.user.joining_date",
              email: "$_id.user.email",
              mobile: "$_id.user.mobile",
              referredBy: "$_id.user.referredBy",
              activationDetails:
                "$_id.user.activationDetails",
              paidDetails: "$_id.user.paidDetails",
              amount: 1,
              bonusAmount: 1,
              _id: 0,
            },
          },
          {
            $lookup: {
              from: "user-personal-details",
              localField: "referredBy",
              foreignField: "_id",
              as: "referredBy",
            },
          },
          {
            $project: {
              amount: 1,
              bonusAmount: 1,
              joining_date: 1,
              activationDetails: 1,
              paidDetails: 1,
              referredBy: {
                $arrayElemAt: ["$referredBy._id", 0],
              },
              first_name: {
                $arrayElemAt: [
                  "$referredBy.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$referredBy.last_name",
                  0,
                ],
              },
              code: {
                $arrayElemAt: [
                  "$referredBy.myReferralCode",
                  0,
                ],
              },
            },
          },
          {
            $group:
              {
                _id: {
                  affiliate: "$referredBy",
                  code: "$code",
                  first_name: "$first_name",
                  last_name: "$last_name",
                },
                total: {
                  $sum: 1,
                },
                // Total documents
                active: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$activationDetails.activationStatus",
                          "Active",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                paid: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ["$amount", 0]
                      },
                      1,
                      0,
                    ],
                  },
                },
                amount: {
                  $sum: "$amount",
                },
              },
          },
          {
            $project: {
              affiliate: "$_id.affiliate",
              code: "$_id.code",
              name: {
                $concat: [
                  "$_id.first_name",
                  " ",
                  "$_id.last_name",
                ],
              },
              _id: 0,
              total: 1,
              active: 1,
              paid: 1,
              amount: 1,
            },
          },
          
        ],
      }
    }])

    const totalUsersRevenue = wallet?.[0]?.total;
    const newUsersRevenue = wallet?.[0]?.new;

    const groupedData = totalUsersRevenue.reduce((result, item) => {
      const affiliate = item?.affiliate?.toString();
    
      if (!result[affiliate]) {
        const match = newUsersRevenue.filter(elem=>elem.affiliate.toString() === affiliate?.toString())?.[0];

        result[affiliate] = {
          total: match?.total || 0,
          active: match?.active || 0,
          paid: match?.paid || 0,
          name: match?.name || item?.name,
          code: match?.code || item?.code,
          revenue: item?.totalAmount || 0,
          oldRevenue: (item?.totalAmount || 0) - (match?.amount || 0),
          newRevenue: match?.amount || 0,
          bonusUsed: item?.totalBonusUsed || 0,
          bonus: item?.totalBonusAmount || 0,
          actualRevenue: (item?.totalAmount || 0) - (item?.totalBonusUsed || 0)
        };
      }

      return result;
    }, {});
    
    const groupedArray = Object.entries(groupedData).map(([affiliate, { 
      total,
      active,
      paid,
      name,
      code,
      revenue,
      oldRevenue,
      newRevenue,
      bonusUsed,
      bonus,
      actualRevenue,
     }]) => ({
      total,
      active,
      paid,
      name,
      code,
      revenue,
      oldRevenue,
      newRevenue,
      bonusUsed,
      bonus,
      actualRevenue,
    }));

    groupedArray.sort((a, b)=>{
      if(a.revenue > b.revenue){
        return -1;
      } else if(a.revenue < b.revenue){
        return 1;
      } else{
        return 1
      }
    })

    const response = {
      data: groupedArray,
      // groupedArray,
      status: "success",
      message: "User Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getCampaignRevenueData = async (req, res, next) => {
    try {
      const { period } = req.query;
      const { startDate, endDate } = getDates(period);
      
      const wallet = await Wallet.aggregate([{
        $facet: {
          'total': [
            {
              $unwind:

                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": {$in:["Campaign SignUp", "Auto SignUp"]},
                  "user.campaignCode":{$ne:null},
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  joining_date: "$_id.user.joining_date",
                  email: "$_id.user.email",
                  mobile: "$_id.user.mobile",
                  campaignCode: "$_id.user.campaignCode",
                  activationDetails:
                    "$_id.user.activationDetails",
                  paidDetails: "$_id.user.paidDetails",
                  amount: 1,
                  bonusAmount: 1,
                  _id: 0,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "campaigns",
                  localField: "campaignCode",
                  foreignField: "campaignCode",
                  as: "campaign",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$campaign",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  activationDetails: 1,
                  paidDetails: 1,
                  campaignId: "$campaign._id",
                  campaignCode: "$campaign.campaignCode",
                  campaignName: "$campaign.campaignName",
                  bonusUsed: {
                    $cond: {
                      if: {
                        $gt: [
                          {
                            $subtract: [
                              "$bonusAmount",
                              "$amount",
                            ],
                          },
                          0,
                        ],
                      },
                      then: "$amount",
                      else: "$bonusAmount",
                    },
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    campaignId: "$campaignId",
                    campaignCode: "$campaignCode",
                    campaignName: "$campaignName",
                  },
                  totalAmount: {
                    $sum: "$amount",
                  },
                  totalBonusAmount: {
                    $sum: "$bonusAmount",
                  },
                  totalBonusUsed: {
                    $sum: "$bonusUsed",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  campaignName: "$_id.campaignName",
                  campaignCode: "$_id.campaignCode",
                  _id: 0,
                  totalAmount: 1,
                  totalBonusUsed: 1,
                  totalBonusAmount: 1,
                },
            },
          ],
          'new': [
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": {$in:["Campaign SignUp", "Auto SignUp"]},
                  "user.campaignCode":{$ne:null},
                  "user.joining_date": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    userId: "$userId",
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  joining_date: "$_id.user.joining_date",
                  email: "$_id.user.email",
                  mobile: "$_id.user.mobile",
                  campaignCode: "$_id.user.campaignCode",
                  activationDetails:
                    "$_id.user.activationDetails",
                  paidDetails: "$_id.user.paidDetails",
                  amount: 1,
                  bonusAmount: 1,
                  _id: 0,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "campaigns",
                  localField: "campaignCode",
                  foreignField: "campaignCode",
                  as: "campaign",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$campaign",
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  activationDetails: 1,
                  paidDetails: 1,
                  campaignId: "$campaign._id",
                  campaignCode: "$campaign.campaignCode",
                  campaignName: "$campaign.campaignName",
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    campaignId: "$campaignId",
                    campaignCode: "$campaignCode",
                    campaignName: "$campaignName",
                  },
                  total: {
                    $sum: 1,
                  },
                  // Total documents
                  active: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$activationDetails.activationStatus",
                            "Active",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  paid: {
                    $sum: {
                      $cond: [
                        {
                          $gt: ["$amount", 0],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  amount: {
                    $sum: "$amount",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  campaignName: "$_id.campaignName",
                  campaignCode: "$_id.campaignCode",
                  _id: 0,
                  total: 1,
                  active: 1,
                  paid: 1,
                  amount: 1,
                },
            },
          ]
        }
      }])
  
      const totalUsersRevenue = wallet?.[0]?.total;
      const newUsersRevenue = wallet?.[0]?.new;
  
      const groupedData = totalUsersRevenue.reduce((result, item) => {
        const campaignCode = item?.campaignCode?.toString();
      
        if (!result[campaignCode]) {
          const match = newUsersRevenue.filter(elem=>elem.campaignCode.toString() === campaignCode?.toString())?.[0];
  
          result[campaignCode] = {
            total: match?.total || 0,
            active: match?.active || 0,
            paid: match?.paid || 0,
            campaignName: match?.campaignName || item?.campaignName,
            campaignCode: match?.campaignCode || item?.campaignCode,
            revenue: item?.totalAmount || 0,
            oldRevenue: (item?.totalAmount || 0) - (match?.amount || 0),
            newRevenue: match?.amount || 0,
            bonusUsed: item?.totalBonusUsed || 0,
            bonus: item?.totalBonusAmount || 0,
            actualRevenue: (item?.totalAmount || 0) - (item?.totalBonusUsed || 0)
          };
        }
  
        return result;
      }, {});
      
      const groupedArray = Object.entries(groupedData).map(([affiliate, { 
        total,
        active,
        paid,
        campaignName,
        campaignCode,
        revenue,
        oldRevenue,
        newRevenue,
        bonusUsed,
        bonus,
        actualRevenue,
       }]) => ({
        total,
        active,
        paid,
        campaignName,
        campaignCode,
        revenue,
        oldRevenue,
        newRevenue,
        bonusUsed,
        bonus,
        actualRevenue,
      }));
  
      groupedArray.sort((a, b)=>{
        if(a.revenue > b.revenue){
          return -1;
        } else if(a.revenue < b.revenue){
          return 1;
        } else{
          return 1
        }
      })
  
      const response = {
        data: groupedArray,
        // groupedArray,
        status: "success",
        message: "User Data fetched successfully",
      }
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
 
}

exports.getReferralRevenueData = async (req, res, next) => {
    try {
      const { period } = req.query;
      const { startDate, endDate } = getDates(period);
      
      const wallet = await Wallet.aggregate([{
        $facet: {
          'total': [
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": "Referral SignUp",
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "referredBy",
                  foreignField: "_id",
                  as: "referredBy",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$referredBy",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  activationDetails: 1,
                  paidDetails: 1,
                  referredBy: "$referredBy._id",
                  first_name: "$referredBy.first_name",
                  last_name: "$referredBy.last_name",
                  code: "$referredBy.myReferralCode",
                  bonusUsed: {
                    $cond: {
                      if: {
                        $gt: [
                          {
                            $subtract: [
                              "$bonusAmount",
                              "$amount",
                            ],
                          },
                          0,
                        ],
                      },
                      then: "$amount",
                      else: "$bonusAmount",
                    },
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    affiliate: "$referredBy",
                    code: "$code",
                    first_name: "$first_name",
                    last_name: "$last_name",
                  },
                  totalAmount: {
                    $sum: "$amount",
                  },
                  totalBonusAmount: {
                    $sum: "$bonusAmount",
                  },
                  totalBonusUsed: {
                    $sum: "$bonusUsed",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  affiliate: "$_id.affiliate",
                  code: "$_id.code",
                  name: {
                    $concat: [
                      "$_id.first_name",
                      " ",
                      "$_id.last_name",
                    ],
                  },
                  _id: 0,
                  totalAmount: 1,
                  totalBonusUsed: 1,
                  totalBonusAmount: 1,
                },
            },
            {
              $sort:
                /**
                 * Provide any number of field/order pairs.
                 */
                {
                  totalAmount: -1,
                },
            },
            {
              $limit:
                /**
                 * Provide the number of documents to limit.
                 */
                20,
            },
          ],
          'new': [
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": "Referral SignUp",
                  "user.joining_date": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    userId: "$userId",
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  joining_date: "$_id.user.joining_date",
                  email: "$_id.user.email",
                  mobile: "$_id.user.mobile",
                  referredBy: "$_id.user.referredBy",
                  activationDetails:
                    "$_id.user.activationDetails",
                  paidDetails: "$_id.user.paidDetails",
                  amount: 1,
                  bonusAmount: 1,
                  _id: 0,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "referredBy",
                  foreignField: "_id",
                  as: "referredBy",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$referredBy",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  activationDetails: 1,
                  paidDetails: 1,
                  referredBy: "$referredBy._id",
                  first_name: "$referredBy.first_name",
                  last_name: "$referredBy.last_name",
                  code: "$referredBy.myReferralCode",
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    affiliate: "$referredBy",
                    code: "$code",
                    first_name: "$first_name",
                    last_name: "$last_name",
                  },
                  total: {
                    $sum: 1,
                  },
                  // Total documents
                  active: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$activationDetails.activationStatus",
                            "Active",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  paid: {
                    $sum: {
                      $cond: [
                        {
                          $gt: ["$amount", 0],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  amount: {
                    $sum: "$amount",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  affiliate: "$_id.affiliate",
                  code: "$_id.code",
                  name: {
                    $concat: [
                      "$_id.first_name",
                      " ",
                      "$_id.last_name",
                    ],
                  },
                  _id: 0,
                  total: 1,
                  active: 1,
                  paid: 1,
                  amount: 1,
                },
            },
          ],
        }
      }])
  
      const totalUsersRevenue = wallet?.[0]?.total;
      const newUsersRevenue = wallet?.[0]?.new;
  
      const groupedData = totalUsersRevenue.reduce((result, item) => {
        const affiliate = item?.affiliate?.toString();
      
        if (!result[affiliate]) {
          const match = newUsersRevenue.filter(elem=>elem.affiliate.toString() === affiliate?.toString())?.[0];
  
          result[affiliate] = {
            total: match?.total || 0,
            active: match?.active || 0,
            paid: match?.paid || 0,
            name: match?.name || item?.name,
            code: match?.code || item?.code,
            revenue: item?.totalAmount || 0,
            oldRevenue: (item?.totalAmount || 0) - (match?.amount || 0),
            newRevenue: match?.amount || 0,
            bonusUsed: item?.totalBonusUsed || 0,
            bonus: item?.totalBonusAmount || 0,
            actualRevenue: (item?.totalAmount || 0) - (item?.totalBonusUsed || 0)
          };
        }
  
        return result;
      }, {});
      
      const groupedArray = Object.entries(groupedData).map(([affiliate, { 
        total,
        active,
        paid,
        name,
        code,
        revenue,
        oldRevenue,
        newRevenue,
        bonusUsed,
        bonus,
        actualRevenue,
       }]) => ({
        total,
        active,
        paid,
        name,
        code,
        revenue,
        oldRevenue,
        newRevenue,
        bonusUsed,
        bonus,
        actualRevenue,
      }));
  
      groupedArray.sort((a, b)=>{
        if(a.revenue > b.revenue){
          return -1;
        } else if(a.revenue < b.revenue){
          return 1;
        } else{
          return 1
        }
      })
  
      const response = {
        data: groupedArray,
        // groupedArray,
        status: "success",
        message: "User Data fetched successfully",
      }
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
  
}

exports.getAutoSignUpRevenueDataa = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);

    const result = await Wallet.aggregate([
      {
        $facet:
          {
            revenue: [
              {
                $unwind:
                  {
                    path: "$transactions",
                  },
              },
              {
                $match:
                  {
                    "transactions.title": {
                      $in: [
                        "Bought TenX Trading Subscription",
                        "TestZone Fee",
                        "MarginX Fee",
                      ], // Assuming "TestZone Fee" is not repeated intentionally
                    },
            
                    "transactions.transactionDate": {
                      $gt: new Date(startDate),
                      $lt: new Date(endDate),
                    },
                  },
              },
              {
                $lookup:
                  {
                    from: "user-personal-details",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                  },
              },
              {
                $unwind:
                  {
                    path: "$userData",
                  },
              },
              {
                $match:
                  {
                    "userData.creationProcess": "Auto SignUp",
                  },
              },
              {
                $group:
                  {
                    _id: "$userData.campaignCode",
                    totalRevenue: {
                      $sum: "$transactions.amount",
                    },
                    paidUsers: {
                      $addToSet: "$userId",
                    },
                  },
              },
              {
                $project:
                  {
                    _id: 0,
                    campaign: "$_id",
                    paidUsers: {
                      $size: "$paidUsers",
                    },
                    totalRevenue: 1,
                  },
              },
            ],
            signUpBonus:[
              {
                $unwind:
                  {
                    path: "$transactions",
                    preserveNullAndEmptyArrays: true,
                  },
              },
              {
                $lookup:
                  {
                    from: "user-personal-details",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                  },
              },
              {
                $unwind:
                  {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                  },
              },
              {
                $match:
                  {
                    "userData.creationProcess": "Auto SignUp",
                    "transactions.transactionDate": {
                      $gt: new Date(startDate),
                      $lt: new Date(endDate),
                    },
                  },
              },
              {
                $group:
                  {
                    _id: "$userData.campaignCode",
                    signUpBonus: {
                      $sum: {
                        $cond: [
                          {
                            $in: [
                              "$transactions.title",
                              [
                                "Sign up Bonus",
                                "TenX Joining Bonus",
                              ],
                            ],
                          },
                          "$transactions.amount",
                          0,
                        ],
                      },
                    },
                    totalUsers: {
                      $addToSet: "$userId",
                    },
                    activeUsers: {
                      $addToSet: {
                        $cond: [
                          {
                            $eq: [
                              "$userData.activationDetails.activationStatus",
                              "Active",
                            ],
                          },
                          "$userId",
                          "$$REMOVE", // This will not add the element if the condition is not met
                        ],
                      },
                    },
                  },
              },
              {
                $project:
                  {
                    _id: 0,
                    campaign: "$_id",
                    totalUsers: {
                      $size: "$totalUsers",
                    },
                    activeUsers: {
                      $size: "$activeUsers",
                    },
                    signUpBonus: 1,
                  },
              },
            ],
          }
        }
    ]);
    let signUpBonusDict = {};
  for (let sub of result[0].signUpBonus) {
      signUpBonusDict[sub.campaign] = sub;
  }
  
  let autoSignUpArr = [];
  for (let rev of result[0].revenue) {
      let sub = signUpBonusDict[rev.campaign];
      if (sub) {
          autoSignUpArr.push({
              campaignCode: rev.campaign,
              totalRevenue: -rev.totalRevenue,
              signUpBonus: sub.signUpBonus,
              totalUsers: sub.totalUsers,
              activeUsers: sub.activeUsers,
              paidUsers: rev.paidUsers 
          });
      }
  }
  
    console.log(autoSignUpArr);

    const response = {
      data: autoSignUpArr,
      status: "success",
      message: "User Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getCareerRevenueData = async (req, res, next) => {
  try {
    const { period } = req.query;
    const { startDate, endDate } = getDates(period);
    console.log(new Date(startDate), new Date(endDate))
    const allusers = await User.find({
      creationProcess: "Career SignUp"
    })
    .select('_id mobile');

    const userMobiles = allusers.map((elem) => elem?.mobile);
    const application = await CareerApplication.aggregate([
      {
        $match: {
          mobileNo: {
            $in: userMobiles,
          },
          status: "OTP Verified",
          // appliedOn: {
          //   $gt: new Date("2023-01-01"),
          //   $lt: new Date(endDate),
          // },
        },
      },
      {
        $group: {
          _id: "$mobileNo",
          firstDocument: {
            $first: "$$ROOT",
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$firstDocument",
        },
      },
      {
        $lookup: {
          from: "careers",
          localField: "career",
          foreignField: "_id",
          as: "career",
        },
      },
      {
        $project: {
          mobile: "$mobileNo",
          _id: 0,
          listingType: {
            $arrayElemAt: ["$career.listingType", 0],
          },
        },
      },
    ])
    
// Extract mobile numbers for Job listings
    const mobileJob = application
    .map((elem) => {
      if (elem.listingType === 'Job') {
        return elem.mobile;
      }
    })
    .filter((mobile) => mobile !== undefined);

    // Extract mobile numbers for Workshop listings
    const mobileWorkShop = application
    .map((elem) => {
      if (elem.listingType === 'Workshop') {
        return elem.mobile;
      }
    })
    .filter((mobile) => mobile !== undefined);


    const workshop = await Wallet.aggregate([
      {
        $facet: {
          'total': [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
              },
            },
            {
              $match: {
                "user.mobile": {
                  $in: mobileWorkShop,
                },
                $or: [
                  {
                    "transactions.title": "TestZone Fee",
                  },
                  {
                    "transactions.title": "Battle Fee",
                  },
                  {
                    "transactions.title": "MarginX Fee",
                  },
                  {
                    "transactions.title":
                      "Bought TenX Trading Subscription",
                  },
                  {
                    "transactions.title": "Sign up Bonus",
                  },
                  {
                    "transactions.title":
                      "TenX Joining Bonus",
                  },
                ],
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: {
                  userId: "$userId",
                  user: "$user",
                },
                amount: {
                  $sum: {
                    $cond: {
                      if: {
                        $not: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                      },
                      then: {
                        $multiply: [
                          "$transactions.amount",
                          -1,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
                bonusAmount: {
                  $sum: {
                    $cond: {
                      if: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                      then: "$transactions.amount",
                      else: 0,
                    },
                  },
                },
              },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $project: {
                amount: 1,
                bonusAmount: 1,
                joining_date: 1,
                activationDetails: 1,
                paidDetails: 1,
                bonusUsed: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $subtract: [
                            "$bonusAmount",
                            "$amount",
                          ],
                        },
                        0,
                      ],
                    },
                    then: "$amount",
                    else: "$bonusAmount",
                  },
                },
              },
            },
            {
              $group: {
                _id: {},
                totalAmount: {
                  $sum: "$amount",
                },
                totalBonusAmount: {
                  $sum: "$bonusAmount",
                },
                totalBonusUsed: {
                  $sum: "$bonusUsed",
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmount: 1,
                totalBonusUsed: 1,
                totalBonusAmount: 1,
              },
            },
          ],
          'new': [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
              },
            },
            {
              $match: {
                "user.mobile": {
                  $in: mobileWorkShop,
                },
                "user.joining_date": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
                $or: [
                  {
                    "transactions.title": "TestZone Fee",
                  },
                  {
                    "transactions.title": "Battle Fee",
                  },
                  {
                    "transactions.title": "MarginX Fee",
                  },
                  {
                    "transactions.title":
                      "Bought TenX Trading Subscription",
                  },
                  {
                    "transactions.title": "Sign up Bonus",
                  },
                  {
                    "transactions.title":
                      "TenX Joining Bonus",
                  },
                ],
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: {
                  userId: "$userId",
                  user: "$user",
                },
                amount: {
                  $sum: {
                    $cond: {
                      if: {
                        $not: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                      },
                      then: {
                        $multiply: [
                          "$transactions.amount",
                          -1,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
                bonusAmount: {
                  $sum: {
                    $cond: {
                      if: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                      then: "$transactions.amount",
                      else: 0,
                    },
                  },
                },
              },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $project: {
                amount: 1,
                bonusAmount: 1,
                joining_date: 1,
                activationDetails: 1,
                paidDetails: 1,
              },
            },
            {
              $group:
              {
                _id: {
                },
                total: {
                  $sum: 1,
                },
                // Total documents
                active: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$activationDetails.activationStatus",
                          "Active",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                paid: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ["$amount", 0]
                      },
                      1,
                      0,
                    ],
                  },
                },
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                active: 1,
                paid: 1,
                amount: 1,
              },
            },
          ]
        }
      }
    ])

    const job = await Wallet.aggregate([
      {
        $facet: {
          'total': [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
              },
            },
            {
              $match: {
                "user.mobile": {
                  $in: mobileJob,
                },
                $or: [
                  {
                    "transactions.title": "TestZone Fee",
                  },
                  {
                    "transactions.title": "Battle Fee",
                  },
                  {
                    "transactions.title": "MarginX Fee",
                  },
                  {
                    "transactions.title":
                      "Bought TenX Trading Subscription",
                  },
                  {
                    "transactions.title": "Sign up Bonus",
                  },
                  {
                    "transactions.title":
                      "TenX Joining Bonus",
                  },
                ],
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: {
                  userId: "$userId",
                  user: "$user",
                },
                amount: {
                  $sum: {
                    $cond: {
                      if: {
                        $not: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                      },
                      then: {
                        $multiply: [
                          "$transactions.amount",
                          -1,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
                bonusAmount: {
                  $sum: {
                    $cond: {
                      if: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                      then: "$transactions.amount",
                      else: 0,
                    },
                  },
                },
              },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $project: {
                amount: 1,
                bonusAmount: 1,
                joining_date: 1,
                activationDetails: 1,
                paidDetails: 1,
                bonusUsed: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $subtract: [
                            "$bonusAmount",
                            "$amount",
                          ],
                        },
                        0,
                      ],
                    },
                    then: "$amount",
                    else: "$bonusAmount",
                  },
                },
              },
            },
            {
              $group: {
                _id: {},
                totalAmount: {
                  $sum: "$amount",
                },
                totalBonusAmount: {
                  $sum: "$bonusAmount",
                },
                totalBonusUsed: {
                  $sum: "$bonusUsed",
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmount: 1,
                totalBonusUsed: 1,
                totalBonusAmount: 1,
              },
            },
          ],
          'new': [
            {
              $unwind: {
                path: "$transactions",
              },
            },
            {
              $lookup: {
                from: "user-personal-details",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
              },
            },
            {
              $match: {
                "user.mobile": {
                  $in: mobileJob,
                },
                "user.joining_date": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
                $or: [
                  {
                    "transactions.title": "TestZone Fee",
                  },
                  {
                    "transactions.title": "Battle Fee",
                  },
                  {
                    "transactions.title": "MarginX Fee",
                  },
                  {
                    "transactions.title":
                      "Bought TenX Trading Subscription",
                  },
                  {
                    "transactions.title": "Sign up Bonus",
                  },
                  {
                    "transactions.title":
                      "TenX Joining Bonus",
                  },
                ],
                "transactions.transactionDate": {
                  $gt: new Date(startDate),
                  $lt: new Date(endDate),
                },
              },
            },
            {
              $group: {
                _id: {
                  userId: "$userId",
                  user: "$user",
                },
                amount: {
                  $sum: {
                    $cond: {
                      if: {
                        $not: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                      },
                      then: {
                        $multiply: [
                          "$transactions.amount",
                          -1,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
                bonusAmount: {
                  $sum: {
                    $cond: {
                      if: {
                        $or: [
                          {
                            $eq: [
                              "$transactions.title",
                              "Sign up Bonus",
                            ],
                          },
                          {
                            $eq: [
                              "$transactions.title",
                              "Tenx Joining Bonus",
                            ],
                          },
                        ],
                      },
                      then: "$transactions.amount",
                      else: 0,
                    },
                  },
                },
              },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $project: {
                amount: 1,
                bonusAmount: 1,
                joining_date: 1,
                activationDetails: 1,
                paidDetails: 1,
              },
            },
            {
              $group:
              {
                _id: {
                },
                total: {
                  $sum: 1,
                },
                // Total documents
                active: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$activationDetails.activationStatus",
                          "Active",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                paid: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ["$amount", 0]
                      },
                      1,
                      0,
                    ],
                  },
                },
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                active: 1,
                paid: 1,
                amount: 1,
              },
            },
          ]
        }
      }
    ])

    const data = formatData(job[0], workshop[0])
    
    const response = {
      data: data,
      status: "success",
      message: "User Data fetched successfully",
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

exports.getAutoSignUpRevenueData = async(req,res, next) => {
    console.log('affiliate');
    try {
      const { period } = req.query;
      const { startDate, endDate } = getDates(period);
      
      const wallet = await Wallet.aggregate([{
        $facet: {
          'total': [
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": "Auto SignUp",
                  "user.campaignCode": {$eq:null},
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project: {
                joining_date: "$_id.user.joining_date",
                creationProcess: "$_id.user.creationProcess",
                email: "$_id.user.email",
                mobile: "$_id.user.mobile",
                referredBy: "$_id.user.referredBy",
                activationDetails:
                  "$_id.user.activationDetails",
                paidDetails: "$_id.user.paidDetails",
                amount: 1,
                bonusAmount: 1,
                _id: 0,
              },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  creationProcess:1,
                  activationDetails: 1,
                  paidDetails: 1,
                  bonusUsed: {
                    $cond: {
                      if: {
                        $gt: [
                          {
                            $subtract: [
                              "$bonusAmount",
                              "$amount",
                            ],
                          },
                          0,
                        ],
                      },
                      then: "$amount",
                      else: "$bonusAmount",
                    },
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: "$creationProcess",
                  totalAmount: {
                    $sum: "$amount",
                  },
                  totalBonusAmount: {
                    $sum: "$bonusAmount",
                  },
                  totalBonusUsed: {
                    $sum: "$bonusUsed",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  _id: 0,
                  totalAmount: 1,
                  totalBonusUsed: 1,
                  totalBonusAmount: 1,
                },
            },
            {
              $sort:
                /**
                 * Provide any number of field/order pairs.
                 */
                {
                  totalAmount: -1,
                },
            },
            {
              $limit:
                /**
                 * Provide the number of documents to limit.
                 */
                20,
            },
          ],
          'new': [
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$transactions",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                  from: "user-personal-details",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
            },
            {
              $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                  path: "$user",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $match:
                /**
                 * query: The query in MQL.
                 */
                {
                  "user.creationProcess": "Auto SignUp",
                  "user.campaignCode": {$eq:null},
                  "user.joining_date": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                  $or: [
                    {
                      "transactions.title": "TestZone Fee",
                    },
                    {
                      "transactions.title": "Battle Fee",
                    },
                    {
                      "transactions.title": "MarginX Fee",
                    },
                    {
                      "transactions.title":
                        "Bought TenX Trading Subscription",
                    },
                    {
                      "transactions.title": "Sign up Bonus",
                    },
                    {
                      "transactions.title":
                        "TenX Joining Bonus",
                    },
                  ],
                  "transactions.transactionDate": {
                    $gt: new Date(startDate),
                    $lt: new Date(endDate),
                  },
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: {
                    userId: "$userId",
                    user: "$user",
                  },
                  amount: {
                    $sum: {
                      $cond: {
                        if: {
                          $not: {
                            $or: [
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Sign up Bonus",
                                ],
                              },
                              {
                                $eq: [
                                  "$transactions.title",
                                  "Tenx Joining Bonus",
                                ],
                              },
                            ],
                          },
                        },
                        then: {
                          $multiply: [
                            "$transactions.amount",
                            -1,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                  bonusAmount: {
                    $sum: {
                      $cond: {
                        if: {
                          $or: [
                            {
                              $eq: [
                                "$transactions.title",
                                "Sign up Bonus",
                              ],
                            },
                            {
                              $eq: [
                                "$transactions.title",
                                "Tenx Joining Bonus",
                              ],
                            },
                          ],
                        },
                        then: "$transactions.amount",
                        else: 0,
                      },
                    },
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  joining_date: "$_id.user.joining_date",
                  email: "$_id.user.email",
                  mobile: "$_id.user.mobile",
                  creationProcess: "$_id.user.creationProcess",
                  referredBy: "$_id.user.referredBy",
                  activationDetails:
                    "$_id.user.activationDetails",
                  paidDetails: "$_id.user.paidDetails",
                  amount: 1,
                  bonusAmount: 1,
                  _id: 0,
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  amount: 1,
                  bonusAmount: 1,
                  joining_date: 1,
                  activationDetails: 1,
                  paidDetails: 1,
                  creationProcess:1
                },
            },
            {
              $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                  _id: "$creationProcess",
                  total: {
                    $sum: 1,
                  },
                  // Total documents
                  active: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$activationDetails.activationStatus",
                            "Active",
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  paid: {
                    $sum: {
                      $cond: [
                        {
                          $gt: ["$amount", 0],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  amount: {
                    $sum: "$amount",
                  },
                },
            },
            {
              $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                  _id: 0,
                  total: 1,
                  active: 1,
                  paid: 1,
                  amount: 1,
                },
            },
          ],
        }
      }])
  
      const totalUsersRevenue = wallet?.[0]?.total[0];
      const newUsersRevenue = wallet?.[0]?.new[0];
      console.log(totalUsersRevenue, newUsersRevenue);
      let merged = {...totalUsersRevenue, ...newUsersRevenue, oldRevenue:((totalUsersRevenue?.totalAmount ?? 0) - (newUsersRevenue?.amount ?? 0)), newRevenue:newUsersRevenue?.amount||0, actualRevenue:totalUsersRevenue?.totalAmount || 0 - Math.abs(totalUsersRevenue?.totalBonusUsed)}
      
  
      const response = {
        data: [merged],
        // groupedArray,
        status: "success",
        message: "User Data fetched successfully",
      }
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
}

function formatData(job, workshop){

  const obj1 = {
    type: 'Job',
    total: job?.new?.[0]?.total || 0,
    active: job?.new?.[0]?.active || 0,
    paid: job?.new?.[0]?.paid || 0,
    revenue: job?.total?.[0]?.totalAmount || 0,
    oldRevenue: (job?.total?.[0]?.totalAmount || 0) - (job?.new?.[0]?.amount || 0),
    newRevenue: job?.new?.[0]?.amount || 0,
    bonusUsed: job?.total?.[0]?.totalBonusUsed || 0,
    bonus: job?.total?.[0]?.totalBonusAmount || 0,
    actualRevenue: (job?.total?.[0]?.totalAmount || 0) - (job?.total?.[0]?.totalBonusUsed || 0)
  }

  const obj2 = {
    type: 'Workshop',
    total: workshop?.new?.[0]?.total || 0,
    active: workshop?.new?.[0]?.active || 0,
    paid: workshop?.new?.[0]?.paid || 0,
    revenue: workshop?.total?.[0]?.totalAmount || 0,
    oldRevenue: (workshop?.total?.[0]?.totalAmount || 0) - (workshop?.new?.[0]?.amount || 0),
    newRevenue: workshop?.new?.[0]?.amount || 0,
    bonusUsed: workshop?.total?.[0]?.totalBonusUsed || 0,
    bonus: workshop?.total?.[0]?.totalBonusAmount || 0,
    actualRevenue: (workshop?.total?.[0]?.totalAmount || 0) - (workshop?.total?.[0]?.totalBonusUsed || 0)
  }

  return [obj1, obj2];
}

function getDates(period) {
  const today = moment();
  let startDate, endDate;

  switch (period) {
    case 'Today':
      startDate = today.clone().startOf('day');
      endDate = today.endOf('day');
      break;
    case 'Yesterday':
      const yesterday = today.clone().subtract(1, 'day');
      startDate = today.clone().subtract(1, 'day').startOf('day');
      endDate = today.clone().subtract(1, 'day').endOf('day');
      break;
    case 'This Month':
      const firstDayOfMonth = today.clone().startOf('month');
      startDate = firstDayOfMonth;
      endDate = today.endOf('day');
      break;
    case 'Last Month':
      const firstDayOfLastMonth = today.clone().subtract(1, 'month').startOf('month');
      const lastDayOfLastMonth = today.clone().subtract(1, 'month').endOf('month');
      startDate = firstDayOfLastMonth;
      endDate = lastDayOfLastMonth.endOf('day');
      break;
    case 'Last 30 Days':
      startDate = today.clone().subtract(30, 'days');
      endDate = today.endOf('day');
      break;
    case 'Last 60 Days':
      startDate = today.clone().subtract(60, 'days');
      endDate = today.endOf('day');
      break;
    case 'Last 90 Days':
      startDate = today.clone().subtract(90, 'days');
      endDate = today.endOf('day');
      break;
    case 'Last 180 Days':
      startDate = today.clone().subtract(180, 'days');
      endDate = today.endOf('day');
      break;

    default:
      break;
  }

  return { startDate, endDate };
}
