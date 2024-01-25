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
const {sendMultiNotifications} = require('../../utils/fcmService')

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

    const checkUser = await Affiliate.find({ "affiliates.userId": new ObjectId(userId), status: 'Active' })
    .populate('affiliates.userId', 'first_name last_name mobile email creationProcess myReferralCode');

    if (checkUser.length > 0) {
      // console.log(checkUser)
      const user = checkUser[0].affiliates.filter((elem)=>{
        return elem?.userId?._id?.toString() === userId?.toString();
      })
      if(user[0].affiliateStatus === "Active"){
        return res.status(500).json({
          status: "error",
          message: "User already added in this or another affiliate programme.",
        });
      } else{
        user[0].affiliateStatus = "Active";
        const result = await checkUser[0].save({validateBeforeSave: false, new: true});
        return res.status(200).json({
          status: "success",
          message: "User added to allowedUsers successfully",
          data: result
        });
      }
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

    let user = await User.findOneAndUpdate({ _id: new ObjectId(userId) },
    {
      $set: {
        isAffiliate: true,
        affiliateStatus: "Active"
      }
    });

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
  // const wallet = await Wallet.findOne({ userId: new ObjectId(affiliate?.userId) });
  const user = await User.findOne({ _id: buyer }).select('first_name last_name fcmTokens');
  const productDoc = await Product.findOne({ _id: product });
  const affiliateUser = await User.findOne({ _id: affiliate?.userId }).select('first_name last_name mobile fcmTokens');
  let discount = Math.min(affiliateProgram?.discountPercentage / 100 * actualPrice, affiliateProgram?.maxDiscount);
  const affiliatePayout = affiliateProgram?.commissionPercentage / 100 * (actualPrice - discount);
  let walletTransactionId = uuid.v4();

  const wallet = await Wallet.findOneAndUpdate({ userId: new ObjectId(affiliate?.userId) }, {
    $push: {
      transactions: {
        title: 'StoxHero Affiliate Reward Credit',
        description: `Amount credited for affiliate reward for ${user?.first_name}'s product purchase`,
        transactionDate: new Date(),
        amount: affiliatePayout?.toFixed(2),
        transactionId: walletTransactionId,
        transactionType: 'Cash'    
      }
    }
  });
  // wallet?.transactions?.push({
  //   title: 'StoxHero Affiliate Reward Credit',
  //   description: `Amount credited for affiliate reward for ${user?.first_name}'s product purchase`,
  //   transactionDate: new Date(),
  //   amount: affiliatePayout?.toFixed(2),
  //   transactionId: walletTransactionId,
  //   transactionType: 'Cash'
  // });
  // await wallet.save();

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
    user: affiliateUser?._id,
    priority: 'Medium',
    channels: ['App', 'Email'],
    createdBy: '63ecbc570302e7cf0153370c',
    lastModifiedBy: '63ecbc570302e7cf0153370c'
  });

  if(affiliateUser?.fcmTokens?.length>0){
      await sendMultiNotifications('StoxHero Affiliate Reward Credited',
        `₹${affiliatePayout} credited for affiliate reward for ${user?.first_name} ${user?.last_name}'s product purchase`,
        affiliateUser?.fcmTokens?.map(item=>item.token), null, {route:'wallet'}
        )
    }


}

exports.removeAffiliateUser = async (req, res) => {
  try {
    const { id, userId } = req.params; // ID of the contest and the user to remove

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: "success", message: "Invalid affiliate ID or user ID" });
    }

    const affiliate = await Affiliate.findOne({ _id: id })
      .populate('affiliates.userId', 'first_name last_name email mobile creationProcess myReferralCode');

      console.log("userId", userId)
      for(let elem of affiliate?.affiliates){
        if(elem.userId._id.toString() === userId.toString()){
          elem.affiliateStatus = "Inactive";
        }
      }
    // let participants = affiliate?.affiliates?.filter((item) => {
    //   return item.userId._id.toString() !== userId.toString()
    // })

    // affiliate.affiliates = [...participants];
    await affiliate.save({ validateBeforeSave: false });

    let user = await User.findOneAndUpdate({ _id: new ObjectId(userId) },
    {
      $set: {
        affiliateStatus: "Inactive"
      }
    });

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
  // console.log(programme, new Date(startDate), new Date(endDate), (lifetime))
  if(new Date(startDate)>new Date(endDate)){
    return res.status(400).json({status:'error', message:'Invalid Date range'});
  }
  const matchStage = {
    affiliateProgram: programme !== "Cummulative" && new ObjectId(programme),
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }

  const newMatchStage = 
  programme === "Cummulative" ? {
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } : matchStage;
  try {
    const leaderboard = await AffiliateTransaction.aggregate([
      {
        $match: newMatchStage
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
          },
          "signup.creationProcess": "Affiliate SignUp",
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
                          { $lte: ["$$signupUser.joining_date", new Date(endDate)] },
                          {
                            $eq: [
                              "$$signupUser.creationProcess",
                              "Affiliate SignUp",
                            ],
                          },
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

    const userIds = leaderboard.map((elem)=>{
      return elem.affiliate;
    })
    // console.log(userIds)
    const affilifateUser = await User.find({_id: {$in: userIds}}).select('affiliateReferrals')
    .populate('affiliateReferrals.referredUserId', 'joining_date');

    // console.log("affilifateUser.length", affilifateUser[0].affiliateReferrals[0])
    for(let elem of leaderboard){
      let filteredUser = affilifateUser.filter((item)=>{
        // console.log(elem?.affiliate, item?.referredUserId?._id ,  item?.referredUserId?.joining_date , new Date(startDate) , item?.referredUserId?.joining_date , new Date(endDate))
        // console.log("elem", elem)
        console.log( elem?.affiliate?.toString() , item?._id?.toString())
        return elem?.affiliate?.toString() === item?._id?.toString()
        // 645cc77c2f0bba5a7a3ff427 63788f3991fc4bf629de6df0 return (elem?.affiliate===item?.referredUserId?._id && item?.referredUserId?.joining_date >= new Date(startDate) && item?.referredUserId?.joining_date <= new Date(endDate))
      })



      console.log("filteredUser", filteredUser?.[0]?.affiliateReferrals?.length, elem.first_name)
      // elem.signup = filteredUser?.[0]?.affiliateReferrals?.length;
      elem.signup_payout = filteredUser?.[0]?.affiliateReferrals.reduce((total, acc)=>{
        return (acc?.referredUserId?.joining_date >= new Date(startDate) && acc?.referredUserId?.joining_date <= new Date(endDate)) && (total + acc?.affiliateEarning);
      }, 0)
    }
    res.status(200).json({
      status: "success",
      message: "Affiliate leaderboard fetched successfully",
      data: leaderboard
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


exports.getMyAffiliatePayout = async (req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    if(new Date(startDate)>new Date(endDate)){
      return res.status(400).json({status:'error', message:'Invalid Date range'});
    }
    // console.log(userId, startDate, endDate)
    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    const product = await AffiliateTransaction.aggregate([
      {
        $facet:
          {
            summery: [
              {
                $match: {
                  affiliate: new ObjectId(
                    userId
                  ),
                  createdOn: {
                    $gte: new Date(startDate),
                    $lte: new Date(newEndDate)
                  },
                  product: {$ne: new ObjectId('6586e95dcbc91543c3b6c181')}
                },
              },
              {
                $group: {
                  _id: {},
                  payout: {
                    $sum: "$affiliatePayout",
                  },
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  totalProductCount: "$count",
                  _id: 0,
                  totalProductCPayout: "$payout",
                },
              },
            ],
          },
      },
    ])

    const affiliateRaffrelData = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$affiliateReferrals",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField:
            "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          "user.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
        },
      },
      {
        $unwind:{
          path:"$user"
        }
      },
      {
        $group: {
          _id: {},
          count: {
            $count: {},
          },
          activeCount: {
            $sum: {
              $cond: [
                { $eq: ["$user.activationDetails.activationStatus", "Active"] },
                1,
                0
              ]
            }
          },
          paidCount: {
            $sum: {
              $cond: [
                { $in: ["$user.paidDetails.paidStatus", ["Active", "Inactive"]] },
                1,
                0
              ]
            }
          },
          payout: {
            $sum: "$affiliateReferrals.affiliateEarning",
          },
        },
      },
      {
        $project: {
          affiliateRefferalCount: "$count",
          activeAffiliateRefferalCount: "$activeCount",
          paidAffiliateRefferalCount: "$paidCount",
          _id: 0,
          affiliateRefferalPayout: "$payout",
        },
      },
    ])
    res.status(200).json({status: "success", data: product, affiliateRafferalSummery: affiliateRaffrelData, message: "Data received"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "error", message: "Something went wrong"});
  }
}

exports.getMyAffiliateTransaction = async (req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000

    if(new Date(startDate)>new Date(endDate)){
      return res.status(400).json({status:'error', message:'Invalid Date range'});
    }

    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    // console.log(userId, startDate, endDate)
    const count = await AffiliateTransaction.countDocuments({
      affiliate: new ObjectId(
        userId
      ),
      createdOn: {
        $gte: new Date(startDate),
        $lte: new Date(newEndDate)
      }

    });
    const product = await AffiliateTransaction.aggregate([
      {
        $match: {
          affiliate: new ObjectId(
            userId
          ),
          createdOn: {
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
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
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
            product_name: {
              $arrayElemAt: [
                "$product.productName",
                0,
              ],
            },
            _id: 0,
            payout: "$affiliatePayout",
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

exports.getAffiliateReferralsSummery = async(req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    // endDate.setHours(23, 59, 59, 999);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000

    if(new Date(startDate) > new Date(endDate)){
      return res.status(400).json({status:'error', message:"Invalid Date Range"});
    }
    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    // Fetch the user and populate the referrals
    const count = await User.aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $project: {
          affiliateReferrals: 1,
        },
      },
      {
        $unwind: "$affiliateReferrals",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "referredUser",
        },
      },
      {
        $match: {
          "referredUser.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
          "affiliateReferrals.referredUserId": { $ne: null }, // Exclude null userId
        },
      },
      {
        $count: "string",
      },
    ])

      // console.log(count)

    // console.log(count?.affiliateReferrals?.length)
    const user = await User.aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $project: {
          affiliateReferrals: 1,
        },
      },
      {
        $unwind: "$affiliateReferrals",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "referredUser",
        },
      },
      {
        $match: {
          "referredUser.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
          "affiliateReferrals.referredUserId": { $ne: null }, // Exclude null userId
        },
      },
      {
        $sort: { "referredUser.joining_date": -1 },
      },
      {
        $project: {
          _id: 0,
          name: {
            $concat: [
              {
                $arrayElemAt: [
                  "$referredUser.first_name",
                  0,
                ],
              },
              " ",
              {
                $arrayElemAt: [
                  "$referredUser.last_name",
                  0,
                ],
              },
            ],
          },
          joining_date: {
            $arrayElemAt: [
              "$referredUser.joining_date",
              0,
            ],
          },
          payout:
            "$affiliateReferrals.affiliateEarning",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
  

    // Filter out referrals where the referredUserId is null
    // const filteredReferrals = user && user.affiliateReferrals 
    //   ? user.affiliateReferrals.filter(referral => referral.referredUserId != null) 
    //   : [];

    // Construct the response object with filtered referrals
    const response = {
      status: "success",
      data: user,
      count: count?.[0]?.string || 0
      //  {...user.toObject(), affiliateReferrals: filteredReferrals}  // maintain structure, but with filtered referrals
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({status: "error", message: "Internal server error"});
  }
}


// exports.getAffiliateReferralsSummery = async(req, res) => {
//   try {
//     const userId = req.user._id;
//     const {startDate, endDate} = req.query;
//     if(new Date(startDate) > new Date(endDate)){
//       return res.status(400).json({status:'error', message:"Invalid Date Range"});
//     }

//     // Fetch the user and populate the referrals
//     const user = await User.findOne({_id: new ObjectId(userId)})
//       .select('affiliateReferrals')
//       .populate({
//         path: 'affiliateReferrals.referredUserId',
//         select: 'first_name last_name joining_date',
//         match: {
//           joining_date: {
//             $gte: new Date(startDate),
//             $lte: new Date(endDate)
//           }
//         }
//       });

//     // Filter out referrals where the referredUserId is null
//     const filteredReferrals = user && user.affiliateReferrals 
//       ? user.affiliateReferrals.filter(referral => referral.referredUserId != null) 
//       : [];

//     // Construct the response object with filtered referrals
//     const response = {
//       status: "success",
//       data: {...user.toObject(), affiliateReferrals: filteredReferrals}  // maintain structure, but with filtered referrals
//     };

//     // Send the response
//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({status: "error", message: "Internal server error"});
//   }
// }

exports.getBasicAffiliateOverview = async(req,res) => {
  // console.log(req.user.role)
  let userId = req.user._id;

  if(req?.user?.role === "6448f834446977851c23b3f5"){
    userId = req.query.affiliateId;
  }
  // console.log("userId", userId)
  const user = await User.findById(new ObjectId(userId)).select('first_name last_name profilePhoto');
  const affiliateProgram = await Affiliate.findOne({
    "affiliates.userId": new ObjectId(userId)
  }).select('rewardPerSignup commissionPercentage');

  const affiliateRaffrelData = await User.aggregate([
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $unwind: {
        path: "$affiliateReferrals",
      },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField:
          "affiliateReferrals.referredUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind:{
        path:"$user"
      }
    },
    {
      $group: {
        _id: {},
        count: {
          $count: {},
        },
        activeCount: {
          $sum: {
            $cond: [
              { $eq: ["$user.activationDetails.activationStatus", "Active"] },
              1,
              0
            ]
          }
        },
        paidCount: {
          $sum: {
            $cond: [
              { $in: ["$user.paidDetails.paidStatus", ["Active", "Inactive"]] },
              1,
              0
            ]
          }
        },
        paidActiveCount:{
          $sum: {
            $cond: [
              { $eq: ["$user.paidDetails.paidStatus", "Active"] },
              1,
              0
            ]
          }
        },
        payout: {
          $sum: "$affiliateReferrals.affiliateEarning",
        },
      },
    },
    {
      $project: {
        affiliateRefferalCount: "$count",
        activeAffiliateRefferalCount: "$activeCount",
        paidAffiliateRefferalCount: "$paidCount",
        paidActiveAffiliateRefferalCount: "$paidActiveCount",
        _id: 0,
        affiliateRefferalPayout: "$payout",
      },
    },
  ]);

  const lifetimeearningProduct = await AffiliateTransaction.aggregate([
    {
      $match: {
        affiliate: new ObjectId(
          userId
        ),
        product: {$ne: new ObjectId("6586e95dcbc91543c3b6c181")}
      },
    },
    {
      $group: {
        _id: {},
        amount: {
          $sum: "$affiliatePayout",
        },
      },
    },
    {
      $project: {
        amount: 1,
        _id: 0,
      },
    },
  ])

  const lifetimeearningSignUp = await User.aggregate([
    {
      $match: {
        _id: new ObjectId(
          userId
        ),
      },
    },
    {
      $unwind: {
        path: "$affiliateReferrals",
      },
    },
    {
      $group: {
        _id: {},
        payout: {
          $sum: "$affiliateReferrals.affiliateEarning",
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: "$payout",
      },
    },
  ])

  res.status(200).json({status:"success", data:{
    ...affiliateRaffrelData[0], 
    rewardPerReferral:affiliateProgram?.rewardPerSignup, 
    commissionPercentage: affiliateProgram?.commissionPercentage, 
    userName: `${user?.first_name} ${user?.last_name}`, 
    image: user?.profilePhoto, 
    lifetimeEarning: ((lifetimeearningSignUp[0]?.amount || 0) + (lifetimeearningProduct[0]?.amount || 0))}})

}

exports.getLast30daysAffiliateData = async(req,res) => {
  const endDate = moment();
  const startDate = moment().subtract(30, 'days').startOf('day');
  let userId = req.user._id;

  if(req?.user?.role === "6448f834446977851c23b3f5"){
    userId = req.query.affiliateId;
  }
  const SIGNUP_PRODUCT_ID = '6586e95dcbc91543c3b6c181';
  const TESTZONE_PRODUCT_ID = '6517d48d3aeb2bb27d650de5';
  const TENX_PRODUCT_ID = '6517d3803aeb2bb27d650de0';
  const data = await AffiliateTransaction.aggregate([
    {
      $match: {
        affiliate: mongoose.Types.ObjectId(userId),
        transactionDate: {
          $gte: new Date(startDate),
          // $lte: new Date(endDate)
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
        },
        totalOrder: {
          $sum: {
            $cond: [
              { $ne: ['$product', new ObjectId(SIGNUP_PRODUCT_ID)] },
              1,
              0,
            ],
          },
        },
        totalSignupEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(SIGNUP_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalTestzoneEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(TESTZONE_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalTenxEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(TENX_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalEarnings:{
          $sum: "$affiliatePayout"
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).json({status:'success', data:data});
}

exports.getAffiliateType = async(req, res)=>{
  try{
    const type = await Affiliate.aggregate([
      {
        $group:
          {
            _id: {
              affiliateType: "$affiliateType",
            },
          },
      },
      {
        $project:
          {
            type: "$_id.affiliateType",
            _id: 0,
          },
      },
    ])
  
    res.status(200).json({data: type, status: "success"})
  
  } catch(err){
    res.status(500).json({message: "Something went wrong.", status: "error"})

  }
}

exports.getAffiliateProgrammeByType = async(req, res)=>{
  try{
    const {type} = req.query;
    const programme = await Affiliate.aggregate([
      {
        $match:
          {
            affiliateType: type,
          },
      },
      {
        $project:
          {
            _id: 1,
            affiliateProgramName: 1,
          },
      },
    ])
  
    res.status(200).json({data: programme, status: "success"})
  
  } catch(err){
    res.status(500).json({message: "Something went wrong.", status: "error"})

  }
}

exports.getAffiliateByProgramme = async(req, res)=>{
  try{
    const {id} = req.query;
    const programme = await Affiliate.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$affiliates",
        },
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
        $project: {
          _id: 1,
          affiliateProgramName: 1,
          affiliateMobile: {
            $arrayElemAt: ["$user.mobile", 0]
          },
          affiliateName: {
            $concat: [
              {
                $arrayElemAt: ["$user.first_name", 0],
              },
              " ",
              {
                $arrayElemAt: ["$user.last_name", 0],
              },
            ],
          },
          affiliateId: "$affiliates.userId",
          rewardPerSignup: "$rewardPerSignup",
          commissionPercentage:
            "$commissionPercentage",
        },
      },
    ])
  
    res.status(200).json({data: programme, status: "success"})
  
  } catch(err){
    res.status(500).json({message: "Something went wrong.", status: "error"})

  }
}



exports.getAdminAffiliatePayout = async (req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    if(new Date(startDate)>new Date(endDate)){
      return res.status(400).json({status:'error', message:'Invalid Date range'});
    }
    // console.log("check data", req.query.affiliateId)
    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    const {affiliateType, affiliatePrograme, affiliateId} = req.query;
    let matchStageUser = {};
    let matchStageTransactions = {};
    let userIds = [];
    if (affiliateType === "All") {
      const allprogramme = await Affiliate.find();
      for (let elem of allprogramme) {
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }
  
      matchStageTransactions = {
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        },
        product: {$ne: new ObjectId('6586e95dcbc91543c3b6c181')}
      }
  
    } else if (affiliatePrograme === "All") {
      const programmeId = [];
      const getPrograme = await Affiliate.find({ affiliateType: affiliateType });
      for (let elem of getPrograme) {
        programmeId.push(elem._id);
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }
  
      matchStageTransactions = {
        affiliateProgram: { $in: programmeId },
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        },
        product: {$ne: new ObjectId('6586e95dcbc91543c3b6c181')}
      }
  
    } else if (affiliateId === "All"){
      const programmeId = [];
      const getPrograme = await Affiliate.find({ _id: new ObjectId(affiliatePrograme) });
      for (let elem of getPrograme) {
        programmeId.push(elem._id);
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }
  
      matchStageTransactions = {
        affiliate: { $in: userIds },
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        },
        product: {$ne: new ObjectId('6586e95dcbc91543c3b6c181')}
      }
    } else{
      matchStageUser = {
        _id: new ObjectId(userId),
      }
  
      matchStageTransactions = {
        affiliate: new ObjectId(
          userId
        ),
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        },
        product: {$ne: new ObjectId('6586e95dcbc91543c3b6c181')}
      }
    }

    const product = await AffiliateTransaction.aggregate([
      {
        $facet:
          {
            summery: [
              {
                $match: matchStageTransactions,
              },
              {
                $group: {
                  _id: {},
                  payout: {
                    $sum: "$affiliatePayout",
                  },
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  totalProductCount: "$count",
                  _id: 0,
                  totalProductCPayout: "$payout",
                },
              },
            ],
          },
      },
    ])

    const affiliateRaffrelData = await User.aggregate([
      {
        $match: matchStageUser,
      },
      {
        $unwind: {
          path: "$affiliateReferrals",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField:
            "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          "user.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $group: {
          _id: {},
          count: {
            $count: {},
          },
          activeCount: {
            $sum: {
              $cond: [
                { $eq: ["$user.activationDetails.activationStatus", "Active"] },
                1,
                0
              ]
            }
          },
          paidCount: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$user.paidDetails.paidStatus",
                    ["Active", "Inactive"],
                  ],
                },
                1,
                0,
              ],
            },
          },
          payout: {
            $sum: "$affiliateReferrals.affiliateEarning",
          },
        },
      },
      {
        $project: {
          affiliateRefferalCount: "$count",
          activeAffiliateRefferalCount: "$activeCount",
          paidAffiliateRefferalCount: "$paidCount",
          _id: 0,
          affiliateRefferalPayout: "$payout",
        },
      },
    ])
    res.status(200).json({status: "success", data: product, affiliateRafferalSummery: affiliateRaffrelData, message: "Data received"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "error", message: "Something went wrong"});
  }
}

exports.getAdminAffiliateTransaction = async (req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000

    if(new Date(startDate)>new Date(endDate)){
      return res.status(400).json({status:'error', message:'Invalid Date range'});
    }

    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    const {affiliateType, affiliatePrograme, affiliateId} = req.query;
    let matchStageTransactions = {};
    let userIds = [];
    if (affiliateType === "All") {
  
      matchStageTransactions = {
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        }}
  
    } else if (affiliatePrograme === "All") {
      const programmeId = [];
      const getPrograme = await Affiliate.find({ affiliateType: affiliateType });
      for (let elem of getPrograme) {
        programmeId.push(elem._id);
      }
    
      matchStageTransactions = {
        affiliateProgram: { $in: programmeId }
      }
  
    } else if (affiliateId === "All"){
      const getPrograme = await Affiliate.find({ _id: new ObjectId(affiliatePrograme) });
      for (let elem of getPrograme) {
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageTransactions = {
        affiliate: { $in: userIds }
        ,
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        }
      }
    } else{
  
      matchStageTransactions ={
        affiliate: new ObjectId(
          userId
        ),
        createdOn: {
          $gte: new Date(startDate),
          $lte: new Date(newEndDate)
        }
      }
    }

    const count = await AffiliateTransaction.countDocuments(matchStageTransactions);
    const product = await AffiliateTransaction.aggregate([
      {
        $match: matchStageTransactions,
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
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
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
            product_name: {
              $arrayElemAt: [
                "$product.productName",
                0,
              ],
            },
            _id: 0,
            payout: "$affiliatePayout",
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

exports.getAdminAffiliateReferralsSummery = async(req, res) => {
  try {
    let userId = req.user._id;

    if(req?.user?.role === "6448f834446977851c23b3f5"){
      userId = req.query.affiliateId;
    }
    const {startDate, endDate} = req.query;
    // endDate.setHours(23, 59, 59, 999);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000

    if(new Date(startDate) > new Date(endDate)){
      return res.status(400).json({status:'error', message:"Invalid Date Range"});
    }
    const newEndDate = new Date(endDate).setHours(23, 59, 59, 999)

    const {affiliateType, affiliatePrograme, affiliateId} = req.query;
    let matchStageUser = {};
    let userIds = [];
    if (affiliateType === "All") {
      const allprogramme = await Affiliate.find();
      for (let elem of allprogramme) {
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }
    
    } else if (affiliatePrograme === "All") {
      const getPrograme = await Affiliate.find({ affiliateType: affiliateType });
      for (let elem of getPrograme) {
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }
  
    } else if (affiliateId === "All"){
      const getPrograme = await Affiliate.find({ _id: new ObjectId(affiliatePrograme) });
      for (let elem of getPrograme) {
        for (let subelem of elem.affiliates) {
          userIds.push(subelem.userId);
        }
      }
  
      matchStageUser = {
        _id: { $in: userIds },
      }

    } else{
      matchStageUser = {
        _id: new ObjectId(userId),
      }
  
    }
    // Fetch the user and populate the referrals
    const count = await User.aggregate([
      {
        $match: matchStageUser,
      },
      {
        $project: {
          affiliateReferrals: 1,
        },
      },
      {
        $unwind: "$affiliateReferrals",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "referredUser",
        },
      },
      {
        $match: {
          "referredUser.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
          "affiliateReferrals.referredUserId": { $ne: null }, // Exclude null userId
        },
      },
      {
        $count: "string",
      },
    ])

      // console.log(count)

    // console.log(count?.affiliateReferrals?.length)
    const user = await User.aggregate([
      {
        $match: matchStageUser,
      },
      {
        $project: {
          affiliateReferrals: 1,
        },
      },
      {
        $unwind: "$affiliateReferrals",
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "affiliateReferrals.referredUserId",
          foreignField: "_id",
          as: "referredUser",
        },
      },
      {
        $match: {
          "referredUser.joining_date": {
            $gte: new Date(startDate),
            $lte: new Date(newEndDate),
          },
          "affiliateReferrals.referredUserId": { $ne: null }, // Exclude null userId
        },
      },
      {
        $sort: { "referredUser.joining_date": -1 },
      },
      {
        $project: {
          _id: 0,
          name: {
            $concat: [
              {
                $arrayElemAt: [
                  "$referredUser.first_name",
                  0,
                ],
              },
              " ",
              {
                $arrayElemAt: [
                  "$referredUser.last_name",
                  0,
                ],
              },
            ],
          },
          joining_date: {
            $arrayElemAt: [
              "$referredUser.joining_date",
              0,
            ],
          },
          payout:
            "$affiliateReferrals.affiliateEarning",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
  

    // Filter out referrals where the referredUserId is null
    // const filteredReferrals = user && user.affiliateReferrals 
    //   ? user.affiliateReferrals.filter(referral => referral.referredUserId != null) 
    //   : [];

    // Construct the response object with filtered referrals
    const response = {
      status: "success",
      data: user,
      count: count?.[0]?.string || 0
      //  {...user.toObject(), affiliateReferrals: filteredReferrals}  // maintain structure, but with filtered referrals
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({status: "error", message: "Internal server error"});
  }
}

exports.getAdminBasicAffiliateOverview = async(req,res) => {
  // console.log(req.user.role)
  let userId = req.user._id;

  if(req?.user?.role === "6448f834446977851c23b3f5"){
    userId = req.query.affiliateId;
  }
  const {affiliateType, affiliatePrograme, affiliateId} = req.query;
  let matchStageUser = {};
  let matchStageTransactions = {};
  let userIds = [];
  if (affiliateType === "All") {
    const allprogramme = await Affiliate.find();
    for (let elem of allprogramme) {
      for (let subelem of elem.affiliates) {
        userIds.push(subelem.userId);
      }
    }

    matchStageUser = {
      _id: { $in: userIds },
    }

    matchStageTransactions = {}
    userId = "";
  } else if (affiliatePrograme === "All") {
    const programmeId = [];
    const getPrograme = await Affiliate.find({ affiliateType: affiliateType });
    for (let elem of getPrograme) {
      programmeId.push(elem._id);
      for (let subelem of elem.affiliates) {
        userIds.push(subelem.userId);
      }
    }

    matchStageUser = {
      _id: { $in: userIds },
    }

    matchStageTransactions = {
      affiliateProgram: { $in: programmeId }
    }
    userId = "";
  } else if (affiliateId === "All"){
    const programmeId = [];
    const getPrograme = await Affiliate.find({ _id: new ObjectId(affiliatePrograme) });
    for (let elem of getPrograme) {
      programmeId.push(elem._id);
      for (let subelem of elem.affiliates) {
        userIds.push(subelem.userId);
      }
    }

    matchStageUser = {
      _id: { $in: userIds },
    }

    matchStageTransactions = {
      affiliate: { $in: userIds }
    }
    userId = "";
  } else{
    matchStageUser = {
      _id: new ObjectId(userId),
    }

    matchStageTransactions = {
      affiliate: new ObjectId(
        userId
      ),
    }
  }

  let user; let affiliateProgram;
  if(userId){
    user = await User.findById(new ObjectId(userId)).select('first_name last_name profilePhoto');
    affiliateProgram = await Affiliate.findOne({
      "affiliates.userId": new ObjectId(userId)
    }).select('rewardPerSignup commissionPercentage');
  
  }

  const affiliateRaffrelData = await User.aggregate([
    {
      $match: matchStageUser,
    },
    {
      $unwind: {
        path: "$affiliateReferrals",
      },
    },
    {
      $lookup: {
        from: "user-personal-details",
        localField:
          "affiliateReferrals.referredUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind:{
        path:"$user"
      }
    },
    {
      $group: {
        _id: {},
        count: {
          $count: {},
        },
        activeCount: {
          $sum: {
            $cond: [
              { $eq: ["$user.activationDetails.activationStatus", "Active"] },
              1,
              0
            ]
          }
        },
        paidCount: {
          $sum: {
            $cond: [
              { $in: ["$user.paidDetails.paidStatus", ["Active", "Inactive"]] },
              1,
              0,
            ],
          },
        },
        paidActiveCount:{
          $sum: {
            $cond: [
              { $eq: ["$user.paidDetails.paidStatus", "Active"] },
              1,
              0
            ]
          }
        },
        payout: {
          $sum: "$affiliateReferrals.affiliateEarning",
        },
      },
    },
    {
      $project: {
        affiliateRefferalCount: "$count",
        activeAffiliateRefferalCount: "$activeCount",
        paidAffiliateRefferalCount: "$paidCount",
        paidActiveAffiliateRefferalCount: "$paidActiveCount",
        _id: 0,
        affiliateRefferalPayout: "$payout",
      },
    },
  ]);

  const lifetimeearningProduct = await AffiliateTransaction.aggregate([
    {
      $match: {
        ...matchStageTransactions,
        product: {$ne: new ObjectId("6586e95dcbc91543c3b6c181")}
      },
    },
    {
      $group: {
        _id: {},
        amount: {
          $sum: "$affiliatePayout",
        },
      },
    },
    {
      $project: {
        amount: 1,
        _id: 0,
      },
    },
  ])

  const lifetimeearningSignUp = await User.aggregate([
    {
      $match: matchStageUser,
    },
    {
      $unwind: {
        path: "$affiliateReferrals",
      },
    },
    {
      $group: {
        _id: {},
        payout: {
          $sum: "$affiliateReferrals.affiliateEarning",
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: "$payout",
      },
    },
  ])

  res.status(200).json({status:"success", data: {
    ...affiliateRaffrelData[0], 
    rewardPerReferral:affiliateProgram?.rewardPerSignup, 
    commissionPercentage: affiliateProgram?.commissionPercentage, 
    userName: `${user?.first_name} ${user?.last_name}`, 
    image: user?.profilePhoto, 
    lifetimeEarning: ((lifetimeearningSignUp[0]?.amount || 0) + (lifetimeearningProduct[0]?.amount || 0))}})

}

exports.getAdminLast30daysAffiliateData = async(req,res) => {
  const endDate = moment();
  const startDate = moment().subtract(30, 'days').startOf('day');
  let userId = req.user._id;

  if(req?.user?.role === "6448f834446977851c23b3f5"){
    userId = req.query.affiliateId;
  }
  const SIGNUP_PRODUCT_ID = '6586e95dcbc91543c3b6c181';
  const TESTZONE_PRODUCT_ID = '6517d48d3aeb2bb27d650de5';
  const TENX_PRODUCT_ID = '6517d3803aeb2bb27d650de0';
  const {affiliateType, affiliatePrograme, affiliateId} = req.query;
  let matchStageTransactions = {};
  let userIds = [];
  if (affiliateType === "All") {

    matchStageTransactions = {
      transactionDate: {
        $gte: new Date(startDate),
        // $lte: new Date(endDate)
      }
    }

  } else if (affiliatePrograme === "All") {
    const programmeId = [];
    const getPrograme = await Affiliate.find({ affiliateType: affiliateType });
    for (let elem of getPrograme) {
      programmeId.push(elem._id);
    }

    matchStageTransactions = {
      affiliateProgram: { $in: programmeId },
      transactionDate: {
        $gte: new Date(startDate),
        // $lte: new Date(endDate)
      }
    }

  } else if (affiliateId === "All"){
    const getPrograme = await Affiliate.find({ _id: new ObjectId(affiliatePrograme) });
    for (let elem of getPrograme) {
      for (let subelem of elem.affiliates) {
        userIds.push(subelem.userId);
      }
    }

    matchStageTransactions = {
      transactionDate: {
        $gte: new Date(startDate),
        // $lte: new Date(endDate)
      },
      affiliate: { $in: userIds }
    }
  } else{
    matchStageTransactions = {
      affiliate: mongoose.Types.ObjectId(userId),
      transactionDate: {
        $gte: new Date(startDate),
        // $lte: new Date(endDate)
      },
    }
  }

  // console.log("matchStageTransactions", matchStageTransactions)
  const data = await AffiliateTransaction.aggregate([
    {
      $match: matchStageTransactions,
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
        },
        totalOrder: {
          $sum: {
            $cond: [
              { $ne: ['$product', new ObjectId(SIGNUP_PRODUCT_ID)] },
              1,
              0,
            ],
          },
        },
        totalSignupEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(SIGNUP_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalTestzoneEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(TESTZONE_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalTenxEarnings: {
          $sum: {
            $cond: [{ $eq: ["$product", new ObjectId(TENX_PRODUCT_ID)] }, "$affiliatePayout", 0],
          },
        },
        totalEarnings:{
          $sum: "$affiliatePayout"
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // console.log("data", data)
  res.status(200).json({status:'success', data:data});
}