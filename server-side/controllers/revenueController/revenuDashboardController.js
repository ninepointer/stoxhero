const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const TestZone = require("../../models/DailyContest/dailyContest")
const TenX = require("../../models/TenXSubscription/TenXSubscriptionSchema")
const MarginX = require("../../models/marginX/marginX")
const Battle = require("../../models/battle/battle")


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











  
  
  
  

