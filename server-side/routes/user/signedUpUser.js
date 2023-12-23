const emailService = require("../../utils/emailService")
const whatsAppService = require("../../utils/whatsAppService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
const path = require('path');
const mediaURL = "https://dmt-trade.s3.amazonaws.com/blogs/Vijay/photos/1702575002734logo.jpg";
// const mediaURL = require("../../../trading-app/src/assets/images/signup_whatsapp.png")
const mediaFileName = 'StoxHero'
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userDetailSchema");
// const userPersonalDetail = require("../../models/User/userDetailSchema");
// const signedUpUser = require("../../models/User/signedUpUser");
const {sendSMS, sendOTP} = require('../../utils/smsService');
const Referral = require("../../models/campaigns/referralProgram");
// const Lead = require("../../models/leads/leads");
// const MarginAllocation = require("../../models/marginAllocation/marginAllocationSchema")
const PortFolio = require("../../models/userPortfolio/UserPortfolio")
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const Campaign = require("../../models/campaigns/campaignSchema")
const uuid = require('uuid');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const AffiliatePrograme = require("../../models/affiliateProgram/affiliateProgram")
const {createUserNotification} = require('../../controllers/notification/notificationController');
const {sendMultiNotifications} = require("../../utils/fcmService");
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");

router.get("/send", async (req, res) => {
    // whatsAppService.sendWhatsApp({destination : '7976671752', campaignName : 'direct_signup_campaign_new', userName : "vijay", source : "vijay", media : {url : mediaURL, filename : mediaFileName}, templateParams : ["newuser.first_name"], tags : '', attributes : ''});
    let subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
    let message =
        `
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
                <p>Dear Vijay,</p>
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

        `
    // if(process.env.PROD == 'true'){
        await emailService("vvv201214@gmail.com", subject, message);
    // }

})

router.post("/signup", async (req, res) => {
    const { first_name, last_name, email, mobile, collegeDetails } = req.body;
    // console.log(req.body)
    if (!first_name || !last_name || !email || !mobile) {
        return res.status(400).json({ status: 'error', message: "Please fill all fields to proceed." })
    }
    const isExistingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    if(collegeDetails && isExistingUser?.collegeDetails?.college){
        return res.status(400).json({
            message: "Your account already exists. Please login with mobile or email",
            status: 'error'
        });
    } 
    else if(!collegeDetails && !isExistingUser?.collegeDetails?.college && isExistingUser){
        return res.status(400).json({
            message: "Your account already exists. Please login with mobile or email",
            status: 'error'
        });
    } else if(!collegeDetails && isExistingUser?.collegeDetails?.college){
        return res.status(400).json({
            message: "Your account already exists. Please login with mobile or email",
            status: 'error'
        });
    }
    // if (isExistingUser) {
    //     return res.status(400).json({
    //         message: "Your account already exists. Please login with mobile or email",
    //         status: 'error'
    //     });
    // }
    const signedupuser = await SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    if (signedupuser?.lastOtpTime && moment().subtract(29, 'seconds').isBefore(signedupuser?.lastOtpTime)) {
        return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
      }
    let mobile_otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // User sign up detail saving
    try {
        if (signedupuser) {
            signedupuser.first_name = first_name.trim();
            signedupuser.last_name = last_name.trim();
            signedupuser.mobile = mobile.trim();
            signedupuser.email = email.trim();
            signedupuser.mobile_otp = mobile_otp.trim();
            signedupuser.collegeDetails = collegeDetails
            await signedupuser.save({ validateBeforeSave: false })
        } else {
            await SignedUpUser.create({
                first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(),
                mobile: mobile.trim(), mobile_otp: mobile_otp, collegeDetails
            });
        }

        res.status(201).json({
            message: "OTP has been sent. Check your messages. OTP expires in 30 minutes.",
            status: 'success'
        });

        if(process.env.PROD == 'true'){
            sendOTP(mobile.toString(), mobile_otp);
        } else{
            sendOTP("9319671094", mobile_otp);
        }
        
    } catch (err) { console.log(err); res.status(500).json({ message: 'Something went wrong', status: "error" }) }
})

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

router.patch("/verifyotp", async (req, res) => {
    let {
        first_name,
        last_name,
        email,
        mobile,
        mobile_otp,
        referrerCode,
        fcmTokenData,
        collegeDetails
    } = req.body


    const user = await SignedUpUser.findOne({ mobile: mobile })
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: "User with this mobile number doesn't exist"
        })
    }
    //removed email otp check
    if (user.mobile_otp != mobile_otp) {
        return res.status(400).json({
            status: 'error',
            message: "OTPs don't match, please try again!"
        })
    }

    const checkUser = await User.findOne({mobile:user?.mobile});
    if(checkUser && !checkUser?.collegeDetails?.college && collegeDetails){
        checkUser.collegeDetails = collegeDetails;
        const newuser = await checkUser.save({validateBeforeSave: false, new: true});
        return res.status(201).json({ status: "Success", data: newuser, message: "Welcome! Your account is created, please login with your credentials."});
    }
    if(checkUser){
        return res.status(400).json({
            status: 'error',
            message: "Account already exists with this mobile number."
        })
    }


    let referredBy;
    let campaign;
    if (referrerCode) {
        const referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });
        const campaignCodeMatch = await Campaign.findOne({ campaignCode: referrerCode });
        
        if (!referrerCodeMatch && !campaignCodeMatch) {
            return res.status(404).json({ status: 'error', message: "No such referrer code exists. Please enter a valid referrer code" });
        }

        user.status = 'OTP Verified'
        user.last_modifiedOn = new Date()
        await user.save({validateBeforeSave: false});
        if (referrerCodeMatch) { referredBy = referrerCodeMatch?._id; }
        if (campaignCodeMatch) { campaign = campaignCodeMatch; referrerCode=referrerCode}
    }
    user.status = 'OTP Verified';
    user.last_modifiedOn = new Date();
    await user.save({validateBeforeSave: false});

    const myReferralCode = await generateUniqueReferralCode();
    // const count = await User.countDocuments();
    let userId = email.split('@')[0]
    let userIds = await User.find({ employeeid: userId })
   
    if (userIds.length > 0) {
        userId = userId.toString() + (userIds.length + 1).toString()
    }

    let match = false;
    let affiliateObj = {};
    let referral;
    if (referredBy) {
        const checkAffiliate = await AffiliatePrograme.find().
        populate('affiliates.userId', 'myReferralCode');

        for(let elem of checkAffiliate){
            match = elem?.affiliates?.some((subelem)=> subelem?.userId?.myReferralCode === referrerCode);
            if(match){
                affiliateObj = elem;
                break;
            }
        }
        referral = await Referral.findOne({ status: "Active" });
    }

    // free portfolio adding in user collection
    const activeFreePortfolios = await PortFolio.find({ status: "Active", portfolioAccount: "Free" });
    let portfolioArr = [];
    for (const portfolio of activeFreePortfolios) {
        let obj = {};
        obj.portfolioId = portfolio._id;
        obj.activationDate = new Date();
        portfolioArr.push(obj);
    }

    try {
        let creation;
        if(campaign){
            creation = "Campaign SignUp";
        } else if(referredBy && !match){
            creation = 'Referral SignUp';
        } else if(match){
            creation = "Affiliate SignUp";
        } else{
            creation = "Auto SignUp";
        }
        let obj = {
            first_name: first_name.trim(), last_name: last_name.trim(), designation: 'Trader', email: email.trim(),
            mobile: mobile.trim(),
            name: first_name.trim() + ' ' + last_name.trim().substring(0, 1),
            status: 'Active',
            employeeid: userId,
            joining_date: user.last_modifiedOn,
            myReferralCode: (await myReferralCode).toString(),
            referrerCode: referredBy && referrerCode,
            portfolio: portfolioArr,
            referralProgramme: (referredBy && !match) ? referral._id : null,
            campaign: campaign && campaign._id,
            campaignCode: campaign && referrerCode,
            referredBy: referredBy && referredBy,
            creationProcess: creation,
            collegeDetails: collegeDetails || "",
            affiliateProgramme: match ? affiliateObj?._id : null
        }

        if(fcmTokenData){
            fcmTokenData.lastUsedAt = new Date();
            obj.fcmTokens = [fcmTokenData];
        }
        // console.log('password', password);
        // if(password){
        //     obj.password = password;
        // }

        const newuser = await User.create(obj);
        await UserWallet.create(
            {
                userId: newuser._id,
                createdOn: new Date(),
                createdBy: newuser._id
        })
        const populatedUser = await User.findById(newuser._id).populate('role', 'roleName')
        .populate('portfolio.portfolioId','portfolioName portfolioValue portfolioType portfolioAccount')
        .populate({
            path : 'subscription.subscriptionId',
            select: 'portfolio',
            populate: [{
                path: 'portfolio',
                select: 'portfolioName portfolioValue portfolioType portfolioAccount'
            },
            ]
        })
        .populate({
            path: 'internshipBatch',
            select: 'batchName batchStartDate batchEndDate career portfolio participants',
            populate: [{
                path: 'career',
                select: 'jobTitle'
            },
            {
                path: 'portfolio',
                select: 'portfolioValue'
            },
            {
                path: 'participants',
                populate: {
                    path: 'college',
                    select: 'collegeName'
                }
            }
        ],
          })
        .select('pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch')
        const token = await newuser.generateAuthToken();

        // console.log("Token:",token)

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
        });    
       
        // console.log("res:",res)
        res.status(201).json({ status: "Success", data: populatedUser, message: "Welcome! Your account is created, please login with your credentials.", token: token });
        
        // now inserting userId in free portfolio's
        const idOfUser = newuser._id;
        for (const portfolio of activeFreePortfolios) {
            const portfolioValue = portfolio.portfolioValue;

            await PortFolio.findByIdAndUpdate(
                portfolio._id,
                { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
            );
        }

        //inserting user details to referredBy user and updating wallet balance
        if (referredBy) {
            if(match){
                let referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });

                affiliateObj?.referrals?.push({ userId: newuser._id, joinedOn: new Date(), affiliateUserId: referrerCodeMatch?._id})
                await affiliateObj.save();
    
                if (referrerCode) {
                    referrerCodeMatch.affiliateReferrals = [...referrerCodeMatch.affiliateReferrals, {
                        referredUserId: newuser._id,
                        joining_date: newuser.createdOn,
                        affiliateProgram: affiliateObj._id,
                        affiliateEarning: affiliateObj.rewardPerSignup,
                        affiliateCurrency: affiliateObj.currency,
                    }];
                    if(affiliateObj?.referralSignupBonus?.amount){
                        await addSignupBonus(newuser?._id, affiliateObj?.referralSignupBonus?.amount, affiliateObj?.referralSignupBonus?.currency);
                    }
                    await referrerCodeMatch.save({ validateBeforeSave: false });
                    const wallet = await UserWallet.findOne({ userId: referrerCodeMatch._id });
                    wallet.transactions = [...wallet.transactions, {
                        title: 'Affiliate Signup Credit',
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        amount: affiliateObj.rewardPerSignup,
                        transactionId: uuid.v4(),
                        transactionDate: new Date(),
                        transactionType: affiliateObj.currency == 'INR' ? 'Cash' : 'Bonus'
                    }];
                    await wallet.save({ validateBeforeSave: false });

                    await createUserNotification({
                        title: 'Affiliate Signup Credit',
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        notificationType: 'Individual',
                        notificationCategory: 'Informational',
                        productCategory: 'SignUp',
                        user: referrerCodeMatch?._id,
                        priority: 'Medium',
                        channels: ['App', 'Email'],
                        createdBy: '63ecbc570302e7cf0153370c',
                        lastModifiedBy: '63ecbc570302e7cf0153370c'
                      });
                      if (user?.fcmTokens?.length > 0) {
                        await sendMultiNotifications('Affiliate Signup Credit',
                          `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                          referrerCodeMatch?.fcmTokens?.map(item => item.token), null, { route: 'wallet' }
                        )
                      }
                     
                      await AffiliateTransaction.create({
                        affiliateProgram: new ObjectId(affiliateObj?._id),
                        affiliateWalletTId: uuid.v4(),
                        product: new ObjectId(product),
                        specificProduct: new ObjectId(specificProduct),
                        productActualPrice: affiliateObj?.referralSignupBonus?.amount,
                        productDiscountedPrice: affiliateObj?.referralSignupBonus?.amount,
                        buyer: new ObjectId(newuser?._id),
                        affiliate: new ObjectId(referrerCodeMatch._id),
                        lastModifiedBy: new ObjectId(referrerCodeMatch._id),
                        affiliatePayout: affiliateObj.rewardPerSignup
                      })
                }
            } else{
                referral?.users?.push({ userId: newuser._id, joinedOn: new Date() })
                await referral.save();
                
                const referralProgramme = await Referral.findOneAndUpdate({ status: "Active" }, {
                    $set: {
                        users: referral?.users
                    }
                })
    
                if (referrerCode) {
                    let referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });
                    referrerCodeMatch.referrals = [...referrerCodeMatch.referrals, {
                        referredUserId: newuser._id,
                        joining_date: newuser.createdOn,
                        referralProgram: referralProgramme._id,
                        referralEarning: referralProgramme.rewardPerReferral,
                        referralCurrency: referralProgramme.currency,
                    }];
                    if(referralProgramme?.referralSignupBonus?.amount){
                        await addSignupBonus(newuser?._id, referralProgramme?.referralSignupBonus?.amount, referralProgramme?.referralSignupBonus?.currency);
                    }
                    await referrerCodeMatch.save({ validateBeforeSave: false });
                    const wallet = await UserWallet.findOne({ userId: referrerCodeMatch._id });
                    wallet.transactions = [...wallet.transactions, {
                        title: 'Referral Credit',
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        amount: referralProgramme.rewardPerReferral,
                        transactionId: uuid.v4(),
                        transactionDate: new Date(),
                        transactionType: referralProgramme.currency == 'INR' ? 'Cash' : 'Bonus'
                    }];
                    await wallet.save({ validateBeforeSave: false });

                    await createUserNotification({
                        title: 'Referral Signup Credit',
                        description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                        notificationType: 'Individual',
                        notificationCategory: 'Informational',
                        productCategory: 'SignUp',
                        user: referrerCodeMatch?._id,
                        priority: 'Medium',
                        channels: ['App', 'Email'],
                        createdBy: '63ecbc570302e7cf0153370c',
                        lastModifiedBy: '63ecbc570302e7cf0153370c'
                      });
                      if (user?.fcmTokens?.length > 0) {
                        await sendMultiNotifications('Referral Signup Credit',
                          `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                          referrerCodeMatch?.fcmTokens?.map(item => item.token), null, { route: 'wallet' }
                        )
                      }
                }
            }
        }

        if (campaign) {
            campaign?.users?.push({ userId: newuser._id, joinedOn: new Date() })
            await campaign.save();
            // if(campaign?.campaignType == 'Invite'){
                await addSignupBonus(newuser?._id, campaign?.campaignSignupBonus?.amount ?? 90, campaign?.campaignSignupBonus?.currency ?? 'INR');
            // }
        }

        if (!newuser) return res.status(400).json({ status: 'error', message: 'Something went wrong' });

        // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
        // let email = newuser.email;
        let subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
        let message =
        `
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

        `
        if(process.env.PROD == 'true'){
            await emailService(newuser.email, subject, message);
        }

        if(process.env.PROD == 'true'){
            await whatsAppService.sendWhatsApp({destination : newuser.mobile, campaignName : 'direct_signup_campaign_new', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser.first_name], tags : '', attributes : ''});
        }
        else {
            whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'direct_signup_campaign_new', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser.first_name], tags : '', attributes : ''});
            whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'direct_signup_campaign_new', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser.first_name], tags : '', attributes : ''});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({status:'error', message:'Something wenr wrong', error: error.message})
    }
})

const addSignupBonus = async (userId, amount, currency) => {
    const wallet = await UserWallet.findOne({userId:userId});
    console.log("Wallet, Amount, Currency:",wallet, userId, amount, currency)
    try{
        wallet?.transactions?.push({
            title: 'Sign up Bonus',
            description: `Amount credited for sign up bonus.`,
            amount: amount,
            transactionId: uuid.v4(),
            transactionDate: new Date(),
            transactionType: currency
        });
        await wallet?.save({validateBeforeSave:false});
        console.log("Saved Wallet:",wallet)
    }catch(e){
        console.log(e);
    }
}

router.patch("/resendotp", async (req, res)=>{
    const {email, mobile, type} = req.body
    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {
        return res.status(404).json({
            status:'error',
            message: "User with this email doesnt exist"
        })
    }
    if (user?.lastOtpTime && moment().subtract(29, 'seconds').isBefore(user?.lastOtpTime)) {
        return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
      }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    let subject = "OTP from StoxHero";
    let message = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email OTP</title>
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

            .otp-code {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }

            .cta-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }

            .cta-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Email OTP</h1>
            <p>Hello ${user.first_name},</p>
            <p>Your OTP code is: <span class="otp-code">${email_otp}</span></p>
            <p>Please use this code to verify your email address and complete your registration.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;
    if(type == 'mobile'){
        user.mobile_otp = mobile_otp;
        // sendSMS([mobile.toString()],`Your otp for StoxHero signup is ${mobile_otp}`);
        if(process.env.PROD=='true')sendOTP(mobile.toString(), mobile_otp);
       if(process.env.PROD!=='true')sendOTP("9319671094", mobile_otp);    
    }
    else if(type == 'email'){
        user.email_otp = email_otp;
        emailService(email,subject,message);
    }    
    await user.save();
    res.status(200).json({
            status:'success',
            message: "OTP Resent. Please check again."
    });
});

router.get("/signedupusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    SignedUpUser.find()
    .sort({createdOn:-1})
    .exec((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.put("/updatesignedupuser/:id", Authenticate, async (req, res)=>{

    try{
        const {id} = req.params

        const signedupuser = await SignedUpUser.findOne({_id: id})

        signedupuser.status = req.body.Status,

        await signedupuser.save();
        res.status(201).json({message : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

module.exports = router;