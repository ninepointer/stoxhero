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


exports.getTestZoneRevenue = async (req, res) => {
  try {
    const pipeline = [
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
              $sum: "$entryFee",
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            monthRevenue: "$totalRevenue",
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
                  $toString: {$substr : ["$year",2,4]},
                },
              ],
            },
          },
        },
        {
            $sort: {
            year: 1,
            month: 1,
            },
        },
        {
            $limit: 6,
        },
      ]

      const totalRevenuePipeline = [
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
                $sum: "$entryFee",
            },
            },
        },
        {
            $project: {
            _id: 0,
            totalRevenue: 1,
            },
        },
      ];
  

    const [testZoneMonthWiseRevenue, totalRevenue] = await Promise.all([
        TestZone.aggregate(pipeline),
        TestZone.aggregate(totalRevenuePipeline),
    ]);

    const response = {
      data: testZoneMonthWiseRevenue,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
      status: "success",
      message: "TestZone Revenue fetched successfully",
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









  
  
  
  

