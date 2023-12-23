const mongoose = require('mongoose');
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Affiliate = require("../../models/affiliateProgram/affiliateProgram");
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");
const Wallet = require("../../models/UserWallet/userWalletSchema");
const { createUserNotification } = require('../notification/notificationController');
const whatsAppService = require("../../utils/whatsAppService")
const moment = require('moment');
const Product = require('../../models/Product/product');
const uuid = require('uuid');

// Controller for creating a affiliate
exports.createAffiliate = async (req, res) => {
  try {
    const {referralSignupBonus, rewardPerSignup, affiliateProgramName, startDate, endDate, commissionPercentage, affiliateType, maxDiscount, minOrderValue, discountPercentage,
      eligiblePlatforms, eligibleProducts, description, status, currency } = req.body;

    const affiliate = await Affiliate.create({
      affiliateProgramName, startDate, endDate, commissionPercentage, affiliateType, discountPercentage,
      eligiblePlatforms, eligibleProducts, description, status, maxDiscount, minOrderValue,
      createdBy: req.user._id, lastModifiedBy: req.user._id, referralSignupBonus, rewardPerSignup, currency
    });

    res.status(201).json({
      status: 'success',
      message: "Affiliate programe created successfully",
      data: affiliate
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

// Controller for editing a affiliate
exports.editAffiliate = async (req, res) => {
  try {
    const { id } = req.params; // ID of the contest to edit
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", message: "Invalid affiliate ID" });
    }

    const result = await Affiliate.findByIdAndUpdate(id, updates, { new: true });

    if (!result) {
      return res.status(404).json({ status: "error", message: "Affiliate not found" });
    }

    res.status(200).json({
      status: 'success',
      message: "Affiliate Program updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: "Error in updating contest",
      error: error.message
    });
  }
};

exports.getAffiliates = async (req, res) => {
  try {
    const affiliates = await Affiliate.find()
      .populate('affiliates.userId', 'first_name last_name')
      .populate('eligibleProducts', '_id productName')
    res.status(200).json({
      status: "success",
      message: "affiliates fetched successfully",
      data: affiliates
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getActiveAffiliatePrograms = async (req, res) => {
  try {
    const affiliates = (await Affiliate.find({ $or: [{ status: 'Active' }, { endDate: { $gte: new Date() } }] })
      .populate('affiliates.userId', 'first_name last_name email mobile creationProcess myReferralCode'))

    res.status(200).json({
      status: "success",
      message: "affiliates fetched successfully",
      data: affiliates,
      count: affiliates.length
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getDraftAffiliatePrograms = async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ status: 'Draft' })
    res.status(200).json({
      status: "success",
      message: "affiliates fetched successfully",
      data: affiliates,
      count: affiliates.length
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getInactiveAffiliatePrograms = async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ status: 'Inactive' })
    res.status(200).json({
      status: "success",
      message: "affiliates fetched successfully",
      data: affiliates,
      count: affiliates.length
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getExpiredAffiliatePrograms = async (req, res) => {
  try {
    const expiredAffiliatePrograms = await Affiliate.find({ $or: [{ status: 'Expired' }, { endDate: { $lt: new Date() } }] })

    res.status(200).json({
      status: 'success',
      data: expiredAffiliatePrograms,
      count: expiredAffiliatePrograms.length
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

exports.getAffiliateById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Affiliate.findOne({ _id: id })


    res.status(200).json({
      status: "success",
      message: "Affiliate fetched successfully",
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

exports.addAffiliateUser = async (req, res) => {
  try {
    const { id, userId } = req.params; // ID of the contest and the user to add
    const { myReferralCode } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: "success", message: "User Id invalid!" });
    }

    const checkUser = await Affiliate.find({ "affiliates.userId": new ObjectId(userId), status: 'Active' });
    if (checkUser.length > 0) {
      return res.status(500).json({
        status: "error",
        message: "User already added in this or another affiliate programme.",
      });
    }

    const result = await Affiliate.findByIdAndUpdate(
      id,
      {
        $push: {
          affiliates: { userId: userId, joinedOn: new Date(), affiliateCode: myReferralCode },
        }
      },
      { new: true } // This option ensures the updated document is returned
    ).populate('affiliates.userId', 'first_name last_name mobile email creationProcess myReferralCode');

    if (!result) {
      return res.status(404).json({ status: "error", message: "Affiliate not found" });
    }

    let user = await User.findOne({ _id: new ObjectId(userId) });

    try {
      if (process.env.PROD == 'true') {
        whatsAppService.sendWhatsApp({ destination: user?.mobile, campaignName: 'affiliatepartner_addition_campaign', userName: user.first_name, source: user.creationProcess, templateParams: [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags: '', attributes: '' });
        whatsAppService.sendWhatsApp({ destination: '8076284368', campaignName: 'affiliatepartner_addition_campaign', userName: user.first_name, source: user.creationProcess, templateParams: [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags: '', attributes: '' });
      }
      else {
        whatsAppService.sendWhatsApp({ destination: '9319671094', campaignName: 'affiliatepartner_addition_campaign', userName: user.first_name, source: user.creationProcess, templateParams: [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags: '', attributes: '' });
        whatsAppService.sendWhatsApp({ destination: '8076284368', campaignName: 'affiliatepartner_addition_campaign', userName: user.first_name, source: user.creationProcess, templateParams: [user.first_name, user.myReferralCode, moment.utc(result.startDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 'team@stoxhero.com', '9319671094', (result.discountPercentage).toString(), (result.commissionPercentage).toString(), user.myReferralCode, (result.discountPercentage).toString(), (result.commissionPercentage).toString()], tags: '', attributes: '' });
      }
    } catch (e) {
      console.log(e);
    }

    res.status(200).json({
      status: "success",
      message: "User added to allowedUsers successfully",
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
};

exports.creditAffiliateAmount = async (affiliate, affiliateProgram, product, specificProduct, actualPrice, buyer) => {
  // console.log("in transaction", product, specificProduct, actualPrice, buyer);
  //add amount to wallet
  if (affiliate?.userId?.toString() === buyer?.toString()) {
    return;
  }
  const wallet = await Wallet.findOne({ userId: new ObjectId(affiliate?.userId) });
  const user = await User.findOne({ _id: buyer }).select('first_name last_name');
  const productDoc = await Product.findOne({ _id: product });
  const affiliateUser = await User.findOne({ _id: affiliate?.userId }).select('first_name last_name mobile');
  let discount = Math.min(affiliateProgram?.discountPercentage / 100 * actualPrice, affiliateProgram?.maxDiscount);
  const affiliatePayout = affiliateProgram?.commissionPercentage / 100 * (actualPrice - discount);
  let walletTransactionId = uuid.v4();
  wallet?.transactions?.push({
    title: 'StoxHero Affiliate Reward Credit',
    description: `Amount credited for affiliate reward for ${user?.first_name}'s product purchase`,
    transactionDate: new Date(),
    amount: affiliatePayout?.toFixed(2),
    transactionId: walletTransactionId,
    transactionType: 'Cash'
  });
  await wallet.save();

  //create affiliate transaction
  await AffiliateTransaction.create({
    affiliateProgram: new ObjectId(affiliateProgram?._id),
    affiliateWalletTId: walletTransactionId,
    product: new ObjectId(product),
    specificProduct: new ObjectId(specificProduct),
    productActualPrice: actualPrice,
    productDiscountedPrice: actualPrice - discount,
    buyer: new ObjectId(buyer),
    affiliate: new ObjectId(affiliate?.userId),
    lastModifiedBy: new ObjectId(buyer),
    affiliatePayout: affiliatePayout
  })

  // console.log("in create transaction", product, specificProduct, actualPrice, buyer);

  //send whatsapp message
  try {
    if (process.env.PROD == 'true') {
      whatsAppService.sendWhatsApp({ destination: affiliateUser?.mobile, campaignName: 'affiliate_transaction_campaign', userName: affiliateUser?.first_name, source: affiliateUser?.creationProcess, templateParams: [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice - discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags: '', attributes: '' });
      whatsAppService.sendWhatsApp({ destination: '8076284368', campaignName: 'affiliate_transaction_campaign', userName: user?.first_name, source: user?.creationProcess, templateParams: [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice - discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags: '', attributes: '' });
    } else {
      console.log("sending msg")
      whatsAppService.sendWhatsApp({ destination: '9319671094', campaignName: 'affiliate_transaction_campaign', userName: affiliateUser?.first_name, source: affiliateUser?.creationProcess, templateParams: [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice - discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags: '', attributes: '' });
      whatsAppService.sendWhatsApp({ destination: '8076284368', campaignName: 'affiliate_transaction_campaign', userName: affiliateUser?.first_name, source: affiliateUser?.creationProcess, templateParams: [affiliateUser.first_name, `${user.first_name} ${user.last_name}`, productDoc?.productName, (actualPrice - discount).toLocaleString('en-IN'), moment.utc(new Date()).utcOffset('+05:30').format("DD-MMM hh:mm a"), affiliatePayout.toLocaleString('en-IN')], tags: '', attributes: '' });
    }
  } catch (e) {
    console.log(e);
  }

  //create notification
  await createUserNotification({
    title: 'StoxHero Affiliate Reward Credited',
    description: `₹${affiliatePayout} Amount credited for affiliate reward for ${user?.first_name} ${user?.last_name}'s product purchase`,
    notificationType: 'Individual',
    notificationCategory: 'Informational',
    productCategory: 'General',
    user: user?._id,
    priority: 'Medium',
    channels: ['App', 'Email'],
    createdBy: '63ecbc570302e7cf0153370c',
    lastModifiedBy: '63ecbc570302e7cf0153370c'
  });


}

exports.removeAffiliateUser = async (req, res) => {
  try {
    const { id, userId } = req.params; // ID of the contest and the user to remove

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: "success", message: "Invalid affiliate ID or user ID" });
    }

    const affiliate = await Affiliate.findOne({ _id: id })
      .populate('affiliates.userId', 'first_name last_name email mobile creationProcess myReferralCode');

    let participants = affiliate?.affiliates?.filter((item) => {
      return item.userId._id.toString() !== userId.toString()
    })

    affiliate.affiliates = [...participants];
    await affiliate.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "User removed from affiliate successfully",
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.affiliateLeaderboard = async (req, res) => {
  let { programme, startDate, endDate, lifetime } = req.query;
  lifetime = lifetime === "false" ? false : lifetime === "true" && true;
  startDate = (lifetime) ? "2000-01-01" : startDate;
  endDate = (lifetime) ? new Date() : endDate;
  console.log(programme, new Date(startDate), new Date(endDate), (lifetime))
  const matchStage = {
    affiliateProgram: programme !== "Cummulative" && new ObjectId(programme),
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
  try {
    const leaderboard = await AffiliateTransaction.aggregate([
      {
        $match: programme === "Cummulative" ? {
          transactionDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        } : matchStage
      },
      {
        $group: {
          _id: {
            affiliate: "$affiliate",
            product: "$product",
          },
          payout: {
            $sum: "$affiliatePayout",
          },
          totalAmount: {
            $sum: "$productDiscountedPrice",
          },
          count: {
            $count: {},
          },
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "_id.affiliate",
          foreignField: "_id",
          as: "affiliate",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          first_name: {
            $arrayElemAt: [
              "$affiliate.first_name",
              0,
            ],
          },
          last_name: {
            $arrayElemAt: ["$affiliate.last_name", 0],
          },
          affiliate: "$_id.affiliate",
          code: {
            $arrayElemAt: [
              "$affiliate.myReferralCode",
              0,
            ],
          },
          product: {
            $concat: [
              {
                $toLower: {
                  $arrayElemAt: [
                    "$product.productName",
                    0,
                  ],
                },
              },
              "_payout",
            ],
          },
          payout: 1,
          totalAmount: 1,
          count: 1,
        },
      },
      {
        $group: {
          _id: {
            first_name: "$first_name",
            last_name: "$last_name",
            code: "$code",
            affiliate: "$affiliate",
          },
          data: {
            $push: {
              k: "$product",
              v: "$$ROOT.payout",
            },
          },
          totalAmount: {
            $push: {
              k: {
                $concat: ["$product", "_totalAmount"],
              },
              v: "$$ROOT.totalAmount",
            },
          },
          allCount: {
            $push: {
              k: {
                $concat: ["$product", "_count"],
              },
              v: "$$ROOT.count",
            },
          },
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "_id.code",
          foreignField: "referrerCode",
          as: "signup",
        },
      },
      {
        $match: {
          "signup.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                first_name: "$_id.first_name",
                last_name: "$_id.last_name",
                code: "$_id.code",
                affiliate: "$_id.affiliate",

                signup: {
                  $size: {
                    $filter: {
                      input: "$signup",
                      as: "signupUser",
                      cond: {
                        $and: [
                          { $gte: ["$$signupUser.joining_date", new Date(startDate)] },
                          { $lte: ["$$signupUser.joining_date", new Date(endDate)] }
                        ]
                      }
                    }
                  }
                },
              },
              {
                $arrayToObject: "$data",
              },
              {
                $arrayToObject: "$totalAmount",
              },
              {
                $arrayToObject: "$allCount",
              },
            ],
          },
        },
      }
    ])
    res.status(200).json({
      status: "success",
      message: "Affiliate leaderboard fetched successfully",
      data: leaderboard
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getAffiliateProgramTransactions = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AffiliateTransaction.find({ affiliateProgram: id }).populate('buyer', 'first_name last_name mobile').populate('affiliate', 'first_name last_name mobile myReferralCode').populate('product', 'productName');
    res.status(200).json({
      status: "success",
      message: "Affiliate Transactions fetched successfully",
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

exports.getAffiliateOverview = async (req, res) => {
  const { id } = req.params;

  const pipeline = [
    {
      $group: {
        _id: null,
        totalGMV: {
          $sum: "$productActualPrice",
        },
        totalRevenue: {
          $sum: "$productDiscountedPrice",
        },
        totalCommission: {
          $sum: "$affiliatePayout",
        },
        totalOrders: {
          $sum: 1,
        },
        uniqueUsers: {
          $addToSet: "$buyer",
        },
        activeAffiliateUsers: {
          $addToSet: "$affiliate"
        },
      },
    },
    {
      $addFields: {
        uniqueUsersCount: {
          $size: "$uniqueUsers",
        },
        activeAffiliateCount: {
          $size: "$activeAffiliateUsers",
        },
      },
    },
    {
      $addFields: {
        totalDiscount: {
          $subtract: ["$totalGMV", "$totalRevenue"],
        },
        arpu: {
          $divide: [
            "$totalRevenue",
            "$uniqueUsersCount",
          ],
        },
        aov: {
          $divide: [
            "$totalRevenue",
            "$totalOrders",
          ],
        },
      },
    },
  ]

  const referralPipeline = [
    {
      $unwind: "$affiliates",
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "affiliates.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        referrals: {
          $size: "$user.referrals",
        },
        referralPayout: {
          $sum: "$user.referrals.referralEarning",
        },
      },
    },
    {
      $group: {
        _id: null,
        referrals: {
          $sum: "$referrals",
        },
        referralPayout: {
          $sum: "$referralPayout",
        },
        affiliateCount: {
          $sum: 1,
        },
      },
    },
  ]

  try {
    const result = await AffiliateTransaction.aggregate(pipeline)
    const referrals = await Affiliate.aggregate(referralPipeline)
    res.status(200).json({
      status: "success",
      message: "Affiliate Data fetched successfully",
      data: result,
      referrals: referrals[0]
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getYoutubeAffiliateOverview = async (req, res) => {
  const { id } = req.params;

  const pipeline = [
    {
      $lookup: {
        from: "affiliate-programs",
        localField: "affiliateProgram",
        foreignField: "_id",
        as: "program",
      },
    },
    {
      $match: {
        "program.affiliateType":
          "Youtube Influencer",
      },
    },
    {
      $group: {
        _id: null,
        totalGMV: {
          $sum: "$productActualPrice",
        },
        totalRevenue: {
          $sum: "$productDiscountedPrice",
        },
        totalCommission: {
          $sum: "$affiliatePayout",
        },
        totalOrders: {
          $sum: 1,
        },
        uniqueUsers: {
          $addToSet: "$buyer",
        },
        activeAffiliateUsers: {
          $addToSet: "$affiliate",
        },
      },
    },
    {
      $addFields: {
        uniqueUsersCount: {
          $size: "$uniqueUsers",
        },
        activeAffiliateCount: {
          $size: "$activeAffiliateUsers",
        },
      },
    },
    {
      $addFields: {
        totalDiscount: {
          $subtract: ["$totalGMV", "$totalRevenue"],
        },
        arpu: {
          $divide: [
            "$totalRevenue",
            "$uniqueUsersCount",
          ],
        },
        aov: {
          $divide: [
            "$totalRevenue",
            "$totalOrders",
          ],
        },
      },
    },
  ]

  const referralPipeline = [
    {
      $match: {
        affiliateType: 'Youtube Influencer'
      },
    },
    {
      $unwind: "$affiliates",
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "affiliates.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        referrals: {
          $size: "$user.referrals",
        },
        referralPayout: {
          $sum: "$user.referrals.referralEarning",
        },
      },
    },
    {
      $group: {
        _id: null,
        referrals: {
          $sum: "$referrals",
        },
        referralPayout: {
          $sum: "$referralPayout",
        },
        affiliateCount: {
          $sum: 1,
        },
      },
    },
  ]

  try {
    const result = await AffiliateTransaction.aggregate(pipeline)
    const referrals = await Affiliate.aggregate(referralPipeline)
    res.status(200).json({
      status: "success",
      message: "Youtube Affiliate Data fetched successfully",
      data: result,
      referrals: referrals[0]
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getStoxHeroAffiliateOverview = async (req, res) => {
  const { id } = req.params;

  const pipeline = [
    {
      $lookup: {
        from: "affiliate-programs",
        localField: "affiliateProgram",
        foreignField: "_id",
        as: "program",
      },
    },
    {
      $match: {
        "program.affiliateType":
          "StoxHero User",
      },
    },
    {
      $group: {
        _id: null,
        totalGMV: {
          $sum: "$productActualPrice",
        },
        totalRevenue: {
          $sum: "$productDiscountedPrice",
        },
        totalCommission: {
          $sum: "$affiliatePayout",
        },
        totalOrders: {
          $sum: 1,
        },
        uniqueUsers: {
          $addToSet: "$buyer",
        },
        activeAffiliateUsers: {
          $addToSet: "$affiliate",
        },
      },
    },
    {
      $addFields: {
        uniqueUsersCount: {
          $size: "$uniqueUsers",
        },
        activeAffiliateCount: {
          $size: "$activeAffiliateUsers",
        },
      },
    },
    {
      $addFields: {
        totalDiscount: {
          $subtract: ["$totalGMV", "$totalRevenue"],
        },
        arpu: {
          $divide: [
            "$totalRevenue",
            "$uniqueUsersCount",
          ],
        },
        aov: {
          $divide: [
            "$totalRevenue",
            "$totalOrders",
          ],
        },
      },
    },
  ]

  const referralPipeline = [
    {
      $match: {
        affiliateType: 'StoxHero User'
      },
    },
    {
      $unwind: "$affiliates",
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "affiliates.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        referrals: {
          $size: "$user.referrals",
        },
        referralPayout: {
          $sum: "$user.referrals.referralEarning",
        },
      },
    },
    {
      $group: {
        _id: null,
        referrals: {
          $sum: "$referrals",
        },
        referralPayout: {
          $sum: "$referralPayout",
        },
        affiliateCount: {
          $sum: 1,
        },
      },
    },
  ]

  try {
    const result = await AffiliateTransaction.aggregate(pipeline)
    const referrals = await Affiliate.aggregate(referralPipeline)
    res.status(200).json({
      status: "success",
      message: "StoxHero Affiliate Data fetched successfully",
      data: result,
      referrals: referrals[0]
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.getOfflineInstituteAffiliateOverview = async (req, res) => {
  const { id } = req.params;

  const pipeline = [
    {
      $lookup: {
        from: "affiliate-programs",
        localField: "affiliateProgram",
        foreignField: "_id",
        as: "program",
      },
    },
    {
      $match: {
        "program.affiliateType":
          "Offline Institute",
      },
    },
    {
      $group: {
        _id: null,
        totalGMV: {
          $sum: "$productActualPrice",
        },
        totalRevenue: {
          $sum: "$productDiscountedPrice",
        },
        totalCommission: {
          $sum: "$affiliatePayout",
        },
        totalOrders: {
          $sum: 1,
        },
        uniqueUsers: {
          $addToSet: "$buyer",
        },
        activeAffiliateUsers: {
          $addToSet: "$affiliate",
        },
      },
    },
    {
      $addFields: {
        uniqueUsersCount: {
          $size: "$uniqueUsers",
        },
        activeAffiliateCount: {
          $size: "$activeAffiliateUsers",
        },
      },
    },
    {
      $addFields: {
        totalDiscount: {
          $subtract: ["$totalGMV", "$totalRevenue"],
        },
        arpu: {
          $divide: [
            "$totalRevenue",
            "$uniqueUsersCount",
          ],
        },
        aov: {
          $divide: [
            "$totalRevenue",
            "$totalOrders",
          ],
        },
      },
    },
  ]

  const referralPipeline = [
    {
      $match: {
        affiliateType: 'Offline Institute'
      },
    },
    {
      $unwind: "$affiliates",
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField: "affiliates.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        referrals: {
          $size: "$user.referrals",
        },
        referralPayout: {
          $sum: "$user.referrals.referralEarning",
        },
      },
    },
    {
      $group: {
        _id: null,
        referrals: {
          $sum: "$referrals",
        },
        referralPayout: {
          $sum: "$referralPayout",
        },
        affiliateCount: {
          $sum: 1,
        },
      },
    },
  ]

  try {
    const result = await AffiliateTransaction.aggregate(pipeline)
    const referrals = await Affiliate.aggregate(referralPipeline)
    res.status(200).json({
      status: "success",
      message: "Offline Affiliate Data fetched successfully",
      data: result,
      referrals: referrals[0]
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};
