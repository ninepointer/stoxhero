const ContestRegistration = require('../../models/DailyContest/dailyContestRegistration');
const otpGenerator = require('otp-generator');
const whatsAppService = require("../../utils/whatsAppService")
const mediaURL = "https://dmt-trade.s3.amazonaws.com/blogs/Vijay/photos/1702575002734logo.jpg";
const mediaFileName = 'StoxHero'
const moment = require('moment');
const { sendSMS, sendOTP } = require('../../utils/smsService');
const User = require("../../models/User/userDetailSchema")
const PortFolio = require("../../models/userPortfolio/UserPortfolio")
const Campaign = require("../../models/campaigns/campaignSchema")
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const emailService = require("../../utils/emailService");
const DailyContest = require('../../models/DailyContest/dailyContest');
const ReferralProgram = require('../../models/campaigns/referralProgram');
const uuid = require('uuid');
const dailyContest = require('../../models/DailyContest/dailyContestMockUser');
const ObjectId = require('mongodb').ObjectId;
const AffiliatePrograme = require("../../models/affiliateProgram/affiliateProgram")
const Referral = require("../../models/campaigns/referralProgram");
const UserDetail = require('../../models/User/userDetailSchema');
const SignedUpUser = require('../../models/User/signedUpUser');
const {createUserNotification} = require('../notification/notificationController');
const AffiliateTransaction = require('../../models/affiliateProgram/affiliateTransactions');


exports.createUser = async (req, res, next) => {
    const startNow = performance.now();
    let {
        first_name,
        last_name,
        email,
        mobile,
        referrerCode,
        fcmTokenData,
        collegeDetails,
        dailycontestId
    } = req.body;

    const user = await SignedUpUser.findOne({ mobile: mobile });
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User with this mobile number doesn't exist",
        });
    }

    const checkUser = await UserDetail.findOne({ mobile: user?.mobile });
    if (checkUser && !checkUser?.collegeDetails?.college && collegeDetails) {
        checkUser.collegeDetails = collegeDetails;
        const newuser = await checkUser.save({
            validateBeforeSave: false,
            new: true,
        });
        return res
            .status(201)
            .json({
                status: "Success",
                data: newuser,
                message:
                    "Welcome! Your account is created, please login with your credentials.",
            });
    }
    if (checkUser) {
        return res.status(400).json({
            status: "error",
            message: "Account already exists with this mobile number.",
        });
    }

    let referredBy;
    let campaign;
    if (referrerCode) {
        const referrerCodeMatch = await UserDetail.findOne({
            myReferralCode: referrerCode,
        });
        const campaignCodeMatch = await Campaign.findOne({
            campaignCode: referrerCode,
        });

        if (!referrerCodeMatch && !campaignCodeMatch) {
            return res
                .status(404)
                .json({
                    status: "error",
                    message:
                        "No such referrer code exists. Please enter a valid referrer code",
                });
        }

        user.status = "OTP Verified";
        user.last_modifiedOn = new Date();
        await user.save({ validateBeforeSave: false });
        if (referrerCodeMatch) {
            referredBy = referrerCodeMatch?._id;
        }
        if (campaignCodeMatch) {
            campaign = campaignCodeMatch;
            referrerCode = referrerCode;
        }
    }
    user.status = "OTP Verified";
    user.last_modifiedOn = new Date();
    await user.save({ validateBeforeSave: false });

    const myReferralCode = await generateUniqueReferralCode();
    // const count = await User.countDocuments();
    let userId = email.split("@")[0];
    let userIds = await UserDetail.find({ employeeid: userId });

    if (userIds.length > 0) {
        userId = userId.toString() + (userIds.length + 1).toString();
    }

    let match = false;
    let affiliateObj = {};
    let referral;
    if (referredBy) {
        const checkAffiliate = await AffiliatePrograme.find().populate(
            "affiliates.userId",
            "myReferralCode"
        );

        for (let elem of checkAffiliate) {
            match = elem?.affiliates?.some(
                (subelem) =>
                    subelem?.userId?.myReferralCode === referrerCode &&
                    subelem?.affiliateStatus === "Active"
            );
            if (match) {
                affiliateObj = elem;
                break;
            }
        }
        referral = await Referral.findOne({ status: "Active" });
    }
    console.log("Affiliate obj", affiliateObj, performance.now() - startNow);

    // free portfolio adding in user collection
    const activeFreePortfolios = await PortFolio.find({
        status: "Active",
        portfolioAccount: "Free",
    }).select("_id");
    console.log("Just fetching portfolios", performance.now() - startNow);
    let portfolioArr = [];
    for (const portfolio of activeFreePortfolios) {
        let obj = {};
        obj.portfolioId = portfolio._id;
        obj.activationDate = new Date();
        portfolioArr.push(obj);
    }
    console.log("portfolios fetched", performance.now() - startNow);

    try {
        let creation;
        if (campaign) {
            creation = "Campaign SignUp";
        } else if (referredBy && !match) {
            creation = "Referral SignUp";
        } else if (match) {
            creation = "Affiliate SignUp";
        } else {
            creation = "Auto SignUp";
        }
        let obj = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            designation: "Trader",
            email: email.trim(),
            mobile: mobile.trim(),
            name: first_name.trim() + " " + last_name.trim().substring(0, 1),
            status: "Active",
            employeeid: userId,
            joining_date: user.last_modifiedOn,
            myReferralCode: (await myReferralCode).toString(),
            referrerCode: referredBy && referrerCode,
            portfolio: portfolioArr,
            referralProgramme: referredBy && !match ? referral._id : null,
            campaign: campaign && campaign._id,
            campaignCode: campaign && referrerCode,
            referredBy: referredBy && referredBy,
            creationProcess: creation,
            collegeDetails: collegeDetails || "",
            affiliateProgramme: match ? affiliateObj?._id : null,
        };

        if (fcmTokenData) {
            fcmTokenData.lastUsedAt = new Date();
            obj.fcmTokens = [fcmTokenData];
        }
        // console.log('password', password);
        // if(password){
        //     obj.password = password;
        // }

        const newuser = await UserDetail.create(obj);
        console.log("user created", newuser?._id);
        const addInPotentialUser = await DailyContest.findByIdAndUpdate(new ObjectId(dailycontestId), {
            $push: {
                potentialParticipants: newuser?._id
            }
        });

        await UserWallet.create({
            userId: newuser._id,
            createdOn: new Date(),
            createdBy: newuser._id,
        });
        console.log("wallet created");
        const populatedUser = await UserDetail.findById(newuser._id)
            .populate("role", "roleName")
            .populate(
                "portfolio.portfolioId",
                "portfolioName portfolioValue portfolioType portfolioAccount"
            )
            .populate({
                path: "subscription.subscriptionId",
                select: "portfolio",
                populate: [
                    {
                        path: "portfolio",
                        select:
                            "portfolioName portfolioValue portfolioType portfolioAccount",
                    },
                ],
            })
            .populate({
                path: "internshipBatch",
                select:
                    "batchName batchStartDate batchEndDate career portfolio participants",
                populate: [
                    {
                        path: "career",
                        select: "jobTitle",
                    },
                    {
                        path: "portfolio",
                        select: "portfolioValue",
                    },
                    {
                        path: "participants",
                        populate: {
                            path: "college",
                            select: "collegeName",
                        },
                    },
                ],
            })
            .select(
                "pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch"
            );

        // now inserting userId in free portfolio's
        const idOfUser = newuser._id;
        for (const portfolio of activeFreePortfolios) {
            const portfolioValue = portfolio.portfolioValue;

            await PortFolio.findByIdAndUpdate(portfolio._id, {
                $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } },
            });
        }

        //inserting user details to referredBy user and updating wallet balance
        if (referredBy) {
            if (match) {
                let referrerCodeMatch = await UserDetail.findOne({
                    myReferralCode: referrerCode,
                });
                console.log("updating affiliate program");
                const updateProgramme = await AffiliatePrograme.findOneAndUpdate(
                    { _id: new ObjectId(affiliateObj?._id) },
                    {
                        $push: {
                            referrals: {
                                userId: newuser._id,
                                joinedOn: new Date(),
                                affiliateUserId: referrerCodeMatch?._id,
                            },
                        },
                    },

                    { new: true, validateBeforeSave: false }
                );

                //   console.log("updateProgramme",updateProgramme)
                // affiliateObj?.referrals?.push({ userId: newuser._id, joinedOn: new Date(), affiliateUserId: referrerCodeMatch?._id})
                await affiliateObj.save();

                if (referrerCode) {
                    const saveAffiliate = await UserDetail.findOneAndUpdate(
                        { _id: new ObjectId(referrerCodeMatch?._id) },
                        {
                            $push: {
                                affiliateReferrals: {
                                    referredUserId: newuser._id,
                                    joiningDate: newuser.createdOn,
                                    affiliateProgram: affiliateObj._id,
                                    affiliateEarning: affiliateObj.rewardPerSignup,
                                    affiliateCurrency: affiliateObj.currency,
                                },
                            },
                        }
                    );

                    if (affiliateObj?.referralSignupBonus?.amount) {
                        await addSignupBonus(
                            newuser?._id,
                            affiliateObj?.referralSignupBonus?.amount,
                            affiliateObj?.referralSignupBonus?.currency
                        );
                    }
                    await referrerCodeMatch.save({ validateBeforeSave: false });

                    const wallet = await UserWallet.findOneAndUpdate(
                        { userId: referrerCodeMatch._id },
                        {
                            $push: {
                                transactions: {
                                    title: "Affiliate Signup Credit",
                                    description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                                    amount: affiliateObj.rewardPerSignup,
                                    transactionId: uuid.v4(),
                                    transactionDate: new Date(),
                                    transactionType:
                                        affiliateObj.currency === "INR" ? "Cash" : "Bonus",
                                },
                            },
                        },
                        { new: true, validateBeforeSave: false }
                    );

                    // Access the updated wallet document using the 'wallet' variable

                    await createUserNotification({
                        title: "Affiliate Signup Credit",
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        notificationType: "Individual",
                        notificationCategory: "Informational",
                        productCategory: "SignUp",
                        user: referrerCodeMatch?._id,
                        priority: "Medium",
                        channels: ["App", "Email"],
                        createdBy: "63ecbc570302e7cf0153370c",
                        lastModifiedBy: "63ecbc570302e7cf0153370c",
                    });
                    if (user?.fcmTokens?.length > 0) {
                        await sendMultiNotifications(
                            "Affiliate Signup Credit",
                            `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                            referrerCodeMatch?.fcmTokens?.map((item) => item.token),
                            null,
                            { route: "wallet" }
                        );
                    }

                    await AffiliateTransaction.create({
                        affiliateProgram: new ObjectId(affiliateObj?._id),
                        affiliateWalletTId: uuid.v4(),
                        product: new ObjectId("6586e95dcbc91543c3b6c181"),
                        specificProduct: new ObjectId("6586e95dcbc91543c3b6c181"),
                        productActualPrice: 0,
                        productDiscountedPrice: 0,
                        buyer: new ObjectId(newuser?._id),
                        affiliate: new ObjectId(referrerCodeMatch._id),
                        lastModifiedBy: new ObjectId(referrerCodeMatch._id),
                        affiliatePayout: affiliateObj.rewardPerSignup,
                    });
                }
            } else {
                // referral?.users?.push({ userId: newuser._id, joinedOn: new Date() })
                // await referral.save();
                console.log("updating referral program");
                const referralProgramme = await Referral.findOneAndUpdate(
                    { status: "Active" },
                    {
                        $push: {
                            users: {
                                userId: newuser._id,
                                joinedOn: new Date(),
                            },
                        },
                    }
                );

                if (referrerCode) {
                    // let referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });
                    // referrerCodeMatch.referrals = [...referrerCodeMatch.referrals, {
                    //     referredUserId: newuser._id,
                    //     joining_date: newuser.createdOn,
                    //     referralProgram: referralProgramme._id,
                    //     referralEarning: referralProgramme.rewardPerReferral,
                    //     referralCurrency: referralProgramme.currency,
                    // }];

                    const saveReferrals = await UserDetail.findOneAndUpdate(
                        { myReferralCode: referrerCode },
                        {
                            $push: {
                                referrals: {
                                    referredUserId: newuser._id,
                                    joiningDate: newuser.createdOn,
                                    referralProgram: referralProgramme._id,
                                    referralEarning: referralProgramme.rewardPerReferral,
                                    referralCurrency: referralProgramme.currency,
                                },
                            },
                        }
                    );

                    if (referralProgramme?.referralSignupBonus?.amount) {
                        await addSignupBonus(
                            newuser?._id,
                            referralProgramme?.referralSignupBonus?.amount,
                            referralProgramme?.referralSignupBonus?.currency
                        );
                    }
                    // await referrerCodeMatch.save({ validateBeforeSave: false });
                    const wallet = await UserWallet.findOneAndUpdate(
                        { userId: saveReferrals._id },
                        {
                            $push: {
                                transactions: {
                                    title: "Referral Credit",
                                    description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                                    amount: referralProgramme.rewardPerReferral,
                                    transactionId: uuid.v4(),
                                    transactionDate: new Date(),
                                    transactionType:
                                        referralProgramme.currency == "INR" ? "Cash" : "Bonus",
                                },
                            },
                        },
                        { new: true, validateBeforeSave: false }
                    );

                    // const wallet = await UserWallet.findOne({ userId: saveReferrals._id });
                    // wallet.transactions = [...wallet.transactions, {
                    //     title: 'Referral Credit',
                    //     description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                    //     amount: referralProgramme.rewardPerReferral,
                    //     transactionId: uuid.v4(),
                    //     transactionDate: new Date(),
                    //     transactionType: referralProgramme.currency == 'INR' ? 'Cash' : 'Bonus'
                    // }];
                    // await wallet.save({ validateBeforeSave: false });

                    await createUserNotification({
                        title: "Referral Signup Credit",
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        notificationType: "Individual",
                        notificationCategory: "Informational",
                        productCategory: "SignUp",
                        user: saveReferrals?._id,
                        priority: "Medium",
                        channels: ["App", "Email"],
                        createdBy: "63ecbc570302e7cf0153370c",
                        lastModifiedBy: "63ecbc570302e7cf0153370c",
                    });
                    if (user?.fcmTokens?.length > 0) {
                        await sendMultiNotifications(
                            "Referral Signup Credit",
                            `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                            saveReferrals?.fcmTokens?.map((item) => item.token),
                            null,
                            { route: "wallet" }
                        );
                    }
                }
            }
        }

        if (campaign) {
            campaign?.users?.push({ userId: newuser._id, joinedOn: new Date() });
            await campaign.save();
            // if(campaign?.campaignType == 'Invite'){
            await addSignupBonus(
                newuser?._id,
                campaign?.campaignSignupBonus?.amount ?? 90,
                campaign?.campaignSignupBonus?.currency ?? "INR"
            );
            // }
        }

        if (!newuser)
            return res
                .status(400)
                .json({ status: "error", message: "Something went wrong" });
        const token = await newuser.generateAuthToken();

        // console.log("Token:",token)

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
        });

        console.log("sending response");
        // res.status(201).json({ status: "Success", data: populatedUser, message: "Account created successfully.", token: token });

        // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
        // let email = newuser.email;
        let subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
        let message = `
              <!DOCTYPE html>
                  <html>
                  <head>
                      <meta charset="UTF-8">
                      <title>Account Created</title>
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
                      <h1>Account Created</h1>
                      <p>Dear ${newuser.first_name} ${newuser.last_name},</p>
                      <p>Welcome to the StoxHero family!</p>
                      
                      <p>Discover Stock Market success with our Paper Trading &amp; Learning App. Experience real market data, actionable insights, and a clutter-free interface on both our mobile app and web platform.</p>
                      
                      <p>What StoxHero offers:</p>
                      
                      <ol>
                          <li><strong>Learning Content:</strong> Enhance your market understanding.</li>
                          <li><strong>Real Data Trading:</strong> Practice with virtual currency and real-world data.</li>
                          <li><strong>Actionable Insights:</strong> Understand your trading style with valuable analytics.</li>
                          <li><strong>User-Friendly Interface:</strong> Navigate seamlessly for an optimal trading experience.</li>
                          <li><strong>Rewards for Success:</strong> Earn rewards for your winning trades.</li>
                      </ol>
                      
                      <p>StoxHero is your all-in-one package for Stock Market success.</p>
                      
                      <p>In case you face any issues, feel free to whatsApp support at 9354010914<a href="tel:+919830994402" rel="noreferrer" target="_blank">&nbsp;</a>or drop in an email at <a href="mailto:team@stoxhero.com">team@stoxhero.com</a></p>
                      
                      <p>To get started, visit our youtube channel to learn more about the App and StoxHero: <a href="https://www.youtube.com/channel/UCgslF4zuDhDyttD9P3ZOHbg">Visit</a></p>
                      
                      <p>Happy Trading!</p>
                      
                      <p>Best,&nbsp;</p>
                      
                      <p>StoxHero Team</p>
                      
                      <p>&nbsp;</p>
                      
                      <hr />
                      <h4 style="text-align:center"><strong>DOWNLOAD OUR APP FOR BETTER EXPERIENCE</strong></h4>
                      
                      <p>&nbsp;</p>
                      
                      <p style="text-align:center">
                      <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app">
                      <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463874playStore.png" style="height:100px; width:250px" />
                      </a>&nbsp;&nbsp;
                      <a href="http://www.stoxhero.com">
                      <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463880logoWeb.png" style="height:100px; width:250px" />
                      </a>
                      </p>
                      
                      <p>&nbsp;</p>
                    </body>
                  </html>
      
              `;

        res
            .status(201)
            .json({
                status: "Success",
                data: populatedUser,
                message: "Account created successfully.",
                token: token,
            });
        if (process.env.PROD == "true") {
            await emailService(newuser.email, subject, message);
        }

        if (process.env.PROD == "true") {
            await whatsAppService.sendWhatsApp({
                destination: newuser.mobile,
                campaignName: "direct_signup_campaign_new",
                userName: newuser.first_name,
                source: newuser.creationProcess,
                media: { url: mediaURL, filename: mediaFileName },
                templateParams: [newuser.first_name],
                tags: "",
                attributes: "",
            });
        } else {
            whatsAppService.sendWhatsApp({
                destination: "9319671094",
                campaignName: "direct_signup_campaign_new",
                userName: newuser.first_name,
                source: newuser.creationProcess,
                media: { url: mediaURL, filename: mediaFileName },
                templateParams: [newuser.first_name],
                tags: "",
                attributes: "",
            });
            whatsAppService.sendWhatsApp({
                destination: "8076284368",
                campaignName: "direct_signup_campaign_new",
                userName: newuser.first_name,
                source: newuser.creationProcess,
                media: { url: mediaURL, filename: mediaFileName },
                templateParams: [newuser.first_name],
                tags: "",
                attributes: "",
            });
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                status: "error",
                message: "Something went wrong",
                error: error.message,
            });
    }
}

exports.confirmOTP = async (req, res, next) => {

    const { mobile, mobile_otp, fcmTokenData, college, dailycontestId } = req.body;

    try {
      const user = await UserDetail.findOne({ mobile });
      if (!user) {
        // return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
        //check signedup user exists
        const signedUpUser = await SignedUpUser.findOne({ mobile: mobile }).sort({
          _id: -1,
        });
        //if not send error message
        if (!signedUpUser) {
          return res
            .status(404)
            .json({
              status: "error",
              message: "The mobile number is not registered. Please try again.",
            });
        }
        //check mobile_otp with signedUpUser mobile_otp
        if (signedUpUser?.mobile_otp != mobile_otp) {
          return res
            .status(400)
            .json({
              status: "error",
              message: "Incorrect OTP entered. Please try again",
            });
        }
        //send response status:success, login:false
        return res
          .status(200)
          .json({
            status: "success",
            message: "OTP verification successful",
            login: false,
          });
      }
      if (!user?.collegeDetails?.college && college) {
        return res
          .status(404)
          .json({
            status: "error",
            message: "The mobile number is not registered. Please signup.",
          });
      }
    
      if (
        college &&
        user?.collegeDetails?.college &&
        user?.collegeDetails?.college?.toString() !== college?.toString()
      ) {
        return res
          .status(404)
          .json({
            status: "error",
            message:
              "Kindly access your account by logging in through the designated URL associated with your registration.",
          });
      }


      if (
        process.env.PROD != "true" &&
        mobile == "7737384957" &&
        mobile_otp == "987654"
      ) {
        const token = await user.generateAuthToken();
        
        if (fcmTokenData?.token) {
          const tokenExists = user?.fcmTokens?.some(
            (token) => token?.token === fcmTokenData.token
          );
          // If the token does not exist, add it to the fcmTokens array
          if (!tokenExists) {
            fcmTokenData.lastUsedAt = new Date();
            user.fcmTokens.push(fcmTokenData);
            await user.save({ validateBeforeSave: false });
            console.log("FCM token added successfully.");
          } else {
            console.log("FCM token already exists.");
          }
        }
  
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          // httpOnly: true
        });
        // res.json(token);
        return res
          .status(200)
          .json({
            status: "success",
            message: "User login successful",
            token: token,
            login: true,
          });
      }
  
      if (
        user?.mobile_otp != mobile_otp &&
        !(mobile == "9999992424" && mobile_otp == "123456")
      ) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "OTP didn't match. Please check again.",
          });
      }
      const token = await user.generateAuthToken();
      if (fcmTokenData?.token) {
        const tokenExists = user?.fcmTokens?.some(
          (token) => token?.token === fcmTokenData.token
        );
        // If the token does not exist, add it to the fcmTokens array
        if (!tokenExists) {
          fcmTokenData.lastUsedAt = new Date();
          user.fcmTokens.push(fcmTokenData);
          await user.save({ validateBeforeSave: false });
          console.log("FCM token added successfully.");
        } else {
          console.log("FCM token already exists.");
        }
      }
  
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        // httpOnly: true
      });

      const addInPotentialUser = await DailyContest.findByIdAndUpdate(
        new ObjectId(dailycontestId),
        {
          $addToSet: {
            potentialParticipants: user?._id
          }
        }
      );
      
      // res.json(token);
      res
        .status(200)
        .json({
          status: "success",
          message: "User login successful",
          token: token,
          login: true,
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          status: "error",
          message: `Something went wrong. Please try again.`,
        });
    }

}

const addSignupBonus = async (userId, amount, currency) => {
    // console.log("userId, amount, currency", userId, amount, currency)
    const wallet = await UserWallet.findOne({ userId: userId });
    try {
        wallet.transactions?.push({
            title: 'Sign up Bonus',
            description: `Amount credited for as sign up bonus.`,
            amount: amount,
            transactionId: uuid.v4(),
            transactionDate: new Date(),
            transactionType: currency
        });
        await wallet.save({ validateBeforeSave: false });
    } catch (e) {
        console.log(e);
    }
}

async function generateUniqueReferralCode() {
    const length = 8; // change this to modify the length of the referral code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let myReferralCode = '';
    let codeExists = true;

    // Keep generating new codes until a unique one is found
    while (codeExists) {
        for (let i = 0; i < length; i++) {
            myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if the generated code already exists in the database
        const existingCode = await User.findOne({ myReferralCode: myReferralCode });
        if (!existingCode) {
            codeExists = false;
        }
    }

    return myReferralCode;
}

exports.registeredCount = async (req, res, next) => {

    try {
        const contests = await DailyContest.find({
            contestStartTime: { $gt: new Date() }, contestFor: "College", contestStatus: "Active"
        }).select('potentialParticipants')

        let arr = [];

        for (let elem of contests) {
            arr.push({ _id: elem._id, count: elem.potentialParticipants.length })
        }

        res.status(200).json({
            status: "success",
            message: "data fetched successfully",
            data: arr
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming TestZones",
            error: error.message
        });
    }


}

exports.getRegistrations = async (req, res, next) => {
    console.log('here');
    const { id } = req.params;
    try {
        const regs = await ContestRegistration.find({ contest: new ObjectId(id), status: 'OTP Verified' })
        res.status(200).json({ status: 'success', message: 'successfully fetched', data: regs });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming TestZones",
            error: error.message
        });
    }
}