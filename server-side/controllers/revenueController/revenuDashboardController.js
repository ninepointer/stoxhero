const mongoose = require('mongoose');
const ContestTrading = require('../../models/DailyContest/dailyContestMockUser'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../../models/User/userDetailSchema");
const TenXTrading = require("../../models/mock-trade/tenXTraderSchema");
const PaperTrading = require("../../models/mock-trade/paperTrade");
const InternshipTrading = require("../../models/mock-trade/internshipTrade")
const MarginXTrading = require("../../models/marginX/marginXUserMock");
const BattleTrading = require("../../models/battle/battleTrade");
const { ObjectId } = require('mongodb');

const TestZone = require("../../models/DailyContest/dailyContest")
const TenX = require("../../models/TenXSubscription/TenXSubscriptionSchema")
const MarginX = require("../../models/marginX/marginX");
const Battle = require("../../models/battle/battle");


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
        $sort: {
          _id: -1,
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
        $sort: {
          _id: -1,
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
  

    const [testZoneMonthWiseRevenue, totalTestZoneRevenue, tenXMonthWiseRevenue, totalTenXRevenue] = await Promise.all([
        TestZone.aggregate(testZonepipeline),
        TestZone.aggregate(totalTestZoneRevenuePipeline),
        TenX.aggregate(tenXpipeline),
        TenX.aggregate(totalTenXRevenuePipeline),
    ]);

    const response = {
      testZoneData: testZoneMonthWiseRevenue?.reverse()?.slice(0, 6),
      totalTestZoneRevenue: totalTestZoneRevenue[0] ? totalTestZoneRevenue[0] : 0,
      tenXData: tenXMonthWiseRevenue?.slice(0, 6)?.reverse(),
      totalTenXRevenue: totalTenXRevenue[0] ? totalTenXRevenue[0] : 0,
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
          uniqueUsers:"$uniqueUsers"
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
          uniqueUsers:"$uniqueUsers"
        },
      },
    ];
    
    const [totalTestZoneRevenue, totalTenXRevenue, totalMarginXRevenue, totalBattleRevenue] = await Promise.all([
      TestZone.aggregate(totalTestZonePipeline),
      TenX.aggregate(totalTenxPipeline),
      MarginX.aggregate(totalMarginXPipeline),
      Battle.aggregate(totalBattlePipeline),
  ]);

  let allUniqueUsers = new Set();
  let totalRevenueSum = 0;
  let totalGMVSum = 0;
  let totalOrderSum = 0;
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
    }
  });
  
  let allUniqueUsersArray = Array.from(allUniqueUsers);
  let allUniqueUsersCount = allUniqueUsersArray.length;

  let overallAOV = totalRevenueSum/totalOrderSum;
  let overallArpu = totalRevenueSum/allUniqueUsersCount; 
  console.log("Total Revenue:", totalRevenueSum);
  console.log("Total GMV:", totalGMVSum);
  console.log("Total Orders:", totalOrderSum);
  console.log("Unique Users:", allUniqueUsersCount); 
  console.log("Total AOV:", overallAOV); 
  console.log("Total Arpu:", overallArpu); 

  }catch(e){
    console.log(e);
  }
}










  
  
  
  

