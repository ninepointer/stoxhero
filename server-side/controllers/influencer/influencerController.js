const mongoose = require('mongoose');
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");
const Course = require("../../models/courses/courseSchema");
const Wallet = require("../../models/UserWallet/userWalletSchema");
const { createUserNotification } = require('../notification/notificationController');
const whatsAppService = require("../../utils/whatsAppService")
const moment = require('moment');
const Product = require('../../models/Product/product');
const uuid = require('uuid');
const {sendMultiNotifications} = require('../../utils/fcmService')
const InfluencerTransaction = require('../../models/Influencer/influencer-transaction')



exports.getMyInfluencerTransaction = async (req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "65dc6817586cba2182f05561"){
      userId = req.query.influencerId;
    }
    const {startDate, endDate} = req.query;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000

    if(new Date(startDate)>new Date(endDate)){
      return res.status(400).json({status:'error', message:'Invalid Date range'});
    }

    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    // console.log(userId, startDate, endDate)
    const count = await InfluencerTransaction.countDocuments({
      influencer: new ObjectId(
        userId
      ),
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(newEndDate)
      }

    });
    const product = await InfluencerTransaction.aggregate([
      {
        $match: {
          influencer: new ObjectId(
            userId
          ),
          transactionDate: {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate)
          }
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
   
      {
        $project:
          {
            buyer_first_name: {
              $arrayElemAt: [
                "$buyer.first_name",
                0,
              ],
            },
            _id: 0,
            payout: "$influencerPayout",
            userPaid: "$pricePaidByUser",
            productDiscountedPrice:
              "$productDiscountedPrice",
            date: "$createdOn",
            transactionId: "$transactionId"
          },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])

    res.status(200).json({status: "success", data: product, count: count, message: "Data received"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "error", message: "Something went wrong"});
  }
}

exports.getBasicInfluencerOverview = async(req,res) => {
  // console.log(req.user.role)
  let userId = req.user._id;

  if(req?.user?.role === "65dc6817586cba2182f05561"){
    userId = req.query.influencerId;
  }
  // console.log("userId", userId)
  const user = await User.findById(new ObjectId(userId)).select('first_name last_name profilePhoto referrals');

  const affiliateRaffrelData = await Course.aggregate([
    {
      $match: {
        "courseInstructors.id": new ObjectId(
          userId
        ),
      },
    },
    {
      $unwind: {
        path: "$enrollments",
      },
    },
    {
      $group: {
        _id: {
        },
        totalOrder: {
          $sum: 1,
        },
        totalEarnings: {
          $sum: {
            $multiply: [
              {
                $subtract: [
                  "$enrollments.pricePaidByUser",
                  "$enrollments.gstAmount",
                ],
              },
              {
                $divide: [
                  "$commissionPercentage",
                  100,
                ],
              },
            ],
          },
        },
      },
    },
  ]);


  res.status(200).json({status:"success", data:{
    ...affiliateRaffrelData[0], 
    userName: `${user?.first_name} ${user?.last_name}`, 
    image: user?.profilePhoto, 
    totalSignUp: user?.referrals?.length
  }})

}

exports.getLast30daysInfluencerData = async(req,res) => {
  const endDate = moment();
  const startDate = moment().subtract(30, 'days').startOf('day');
  let userId = req.user._id;

  if(req?.user?.role === "65dc6817586cba2182f05561"){
    userId = req.query.influencerId;
  }
  const data = await Course.aggregate([
    {
      $match: {
        "courseInstructors.id": new ObjectId(
          userId
        ),
      },
    },
    {
      $unwind: {
        path: "$enrollments",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$enrollments.enrolledOn",
          },
        },
        totalOrder: {
          $sum: 1,
        },
        totalEarnings: {
          $sum: {
            $multiply: [
              {
                $subtract: [
                  "$enrollments.pricePaidByUser",
                  "$enrollments.gstAmount",
                ],
              },
              {
                $divide: [
                  "$commissionPercentage",
                  100,
                ],
              },
            ],
          },
        },
      },
    },
  ]);
  res.status(200).json({status:'success', data:data});
}

exports.getInfluencerUsers = async (influencerId) => {
  const data = await influencerUser(influencerId);
  return data;
}

const influencerUser = async(influencerId) => {
  try {

    // Get today's date
    const today = moment();
    const todayStartDate = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    const firstDayOfWeek = today.clone().startOf('week').subtract(5, 'hours').subtract(30, 'minutes');
    const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    // Get the start of the week (assuming the week starts on Sunday)
    const users = await User.aggregate([
      {
        $match: {
          referredBy: new ObjectId(influencerId),
        }
      },
      {
        $group: {
          _id: null,
          todayCount: {
            $sum: {
              $cond: [{ $gte: ["$joining_date", new Date(todayStartDate)] }, 1, 0] // Count documents created today
            }
          },
          thisWeekCount: {
            $sum: {
              $cond: [{ $gte: ["$joining_date", new Date(firstDayOfWeek)] }, 1, 0] // Count documents created this week
            }
          },
          thisMonthCount: {
            $sum: {
              $cond: [{ $gte: ["$joining_date", new Date(firstDayOfMonth)] }, 1, 0] // Count documents created this week
            }
          },
          lifetimeCount: { $sum: 1 } // Count all documents (lifetime count)
        }
      }
    ]);

    // Access the counts
    const obj = {};
    const countResult = users[0];
    obj.todayCount = countResult.todayCount;
    obj.thisWeekCount = countResult.thisWeekCount;
    obj.thisMonthCount = countResult.thisMonthCount;
    obj.lifetimeCount = countResult.lifetimeCount;

    return obj;

  } catch (err) {
    console.log(err);
  }
}

exports.getInfluencerUsersApi = async (req, res) => {
  try{
    const influencerId = req.user._id;
    const data = await influencerUser(influencerId);
  
    res.status(200).json({status:'success', data:data});
  } catch(err){
    res.status(500).json({status:'error', error: err.message});
  }
}

exports.getLast60daysInfluencerUserData = async(req,res) => {
  try{
    const endDate = moment();
    const startDate = moment().subtract(60, 'days').startOf('day');
    const userId = req.user._id;
  
    // if(req?.user?.role === "65dc6817586cba2182f05561"){
    //   userId = req.query.influencerId;
    // }
    const data = await User.aggregate([
      {
        $match: {
          referredBy: new ObjectId(userId),
          joining_date: {$gte: new Date(startDate)}
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$joining_date",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    res.status(200).json({status:'success', data:data});
  
  } catch(err){
    res.status(500).json({status:'error', error: err.message});
  }
}

const influencerRevenue = async(influencerId) => {
  try {

    // Get today's date
    const today = moment();
    const todayStartDate = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    const firstDayOfWeek = today.clone().startOf('week').subtract(5, 'hours').subtract(30, 'minutes');
    const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    // Get the start of the week (assuming the week starts on Sunday)
    const revenueData = await Course.aggregate([
      {
        $match: {
          "courseInstructors.id": ObjectId(
            "63788f3991fc4bf629de6df0"
          ),
        },
      },
      {
        $unwind: {
          path: "$enrollments",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "enrollments.userId",
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
        $facet: {
          normalUser: [
            {
              $match: {
                "user.referredBy": {
                  $ne: ObjectId(
                    "63788f3991fc4bf629de6df0"
                  ),
                },
              },
            },
            {
              $group: {
                _id: {},
                totalOrder: {
                  $sum: 1,
                },
                totalEarnings: {
                  $sum: {
                    $multiply: [
                      {
                        $subtract: [
                          "$enrollments.pricePaidByUser",
                          "$enrollments.gstAmount",
                        ],
                      },
                      {
                        $divide: [
                          "$commissionPercentage",
                          100,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ],
          influencerUser: [
            {
              $match: {
                "user.referredBy": ObjectId(
                  "63788f3991fc4bf629de6df0"
                ),
              },
            },
            {
              $group: {
                _id: {},
                totalOrder: {
                  $sum: 1,
                },
                totalEarnings: {
                  $sum: {
                    $multiply: [
                      {
                        $subtract: [
                          "$enrollments.pricePaidByUser",
                          "$enrollments.gstAmount",
                        ],
                      },
                      {
                        $divide: [
                          "$commissionPercentage",
                          100,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {},
          todayCount: {
            $sum: {
              $cond: [{ $gte: ["$enrollments.enrolledOn", new Date(todayStartDate)] }, 1, 0] // Count documents created today
            }
          },
          thisWeekCount: {
            $sum: {
              $cond: [{ $gte: ["$enrollments.enrolledOn", new Date(firstDayOfWeek)] }, 1, 0] // Count documents created this week
            }
          },
          thisMonthCount: {
            $sum: {
              $cond: [{ $gte: ["$enrollments.enrolledOn", new Date(firstDayOfMonth)] }, 1, 0] // Count documents created this week
            }
          },
          lifetimeCount: { $sum: 1 },
          totalOrder: {
            $sum: 1,
          },
          totalEarnings: {
            $sum: {
              $multiply: [
                {
                  $subtract: [
                    "$enrollments.pricePaidByUser",
                    "$enrollments.gstAmount",
                  ],
                },
                {
                  $divide: [
                    "$commissionPercentage",
                    100,
                  ],
                },
              ],
            },
          },
        },
      },
    ]);

    // Access the counts
    const obj = {};
    const countResult = users[0];
    obj.todayCount = countResult.todayCount;
    obj.thisWeekCount = countResult.thisWeekCount;
    obj.thisMonthCount = countResult.thisMonthCount;
    obj.lifetimeCount = countResult.lifetimeCount;

    return obj;

  } catch (err) {
    console.log(err);
  }
}

