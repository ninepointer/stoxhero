const ContestRegistration  =require('../../models/DailyContest/contestRegistration');
const otpGenerator = require('otp-generator');
// const whatsAppService = require("../../utils/whatsAppService")
// const mediaURL = "https://dmt-trade.s3.amazonaws.com/blogs/Vijay/photos/1702575002734logo.jpg";
// const mediaFileName = 'StoxHero'
// const moment = require('moment');
const {sendSMS, sendOTP} = require('../../utils/smsService');
const User = require("../../models/User/userDetailSchema")
const PortFolio = require("../../models/userPortfolio/UserPortfolio")
const Campaign = require("../../models/campaigns/campaignSchema")
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const emailService = require("../../utils/emailService");
const DailyContest = require('../../models/DailyContest/dailyContest');
const ReferralProgram = require('../../models/campaigns/referralProgram');
const uuid = require('uuid');
// const dailyContest = require('../../models/DailyContest/dailyContestMockUser');
// const ObjectId = require('mongodb').ObjectId;
const AffiliatePrograme = require("../../models/affiliateProgram/affiliateProgram")
const Referral = require("../../models/campaigns/referralProgram");
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");
const {ObjectId} = require('mongodb')



exports.generateOTP = async (req, res, next) => {
    console.log(req.body)

    const { firstName, lastName, email, mobile, dob, gender, college, collegeName, course, passingoutyear, source, contest, campaignCode, referrerCode, linkedInProfileLink
    } = req.body

    if (!contest) {
        return res.status(400).json({
            message: "This College TestZone doesn't exist!",
            status: 'error'
        });
    }
    const dailyContest = await DailyContest.findById(contest).select('contestEndTime');
    if (dailyContest?.contestEndTime < new Date()) {
        return res.status(400).json({
            message: "This TestZone has already ended",
            status: 'error'
        });
    }

    const inactiveUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }], status: "Inactive" });
    if (inactiveUser) {
        return res.status(400).json({
            info: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
            status: 'error'
        });
    }
    let mobile_otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    try {
        if (await ContestRegistration.findOne({ mobileNo: mobile, status: 'OTP Verified', contest: contest })) {
            return res.status(400).json({
                message: "You have already registered for this TestZone.",
                status: 'error'
            });
        }
        const data = await ContestRegistration.create({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            mobileNo: mobile.trim(),
            dob: dob,
            gender: gender,
            college: college,
            collegeName: collegeName,
            course: course,
            passingoutyear: passingoutyear,
            linkedInProfileLink: linkedInProfileLink,
            source: source.trim(),
            contest: contest,
            campaignCode: campaignCode?.trim(),
            mobile_otp: mobile_otp,
            status: 'OTP Verification Pending',
            referrerCode: referrerCode
        });
        // console.log(data)
        if (process.env.PROD == 'true') sendOTP(mobile.toString(), mobile_otp);
        if (process.env.PROD !== 'true') sendOTP("9319671094", mobile_otp);
        res.status(201).json({ message: "OTP Sent on your mobile number!" });
    } catch (error) {
        console.log(error)
    }
}

exports.confirmOTP = async (req, res, next) => {


    const { firstName, lastName, email, mobile, gender, college, course, passingoutyear, campaignCode, mobile_otp, contest, referrerCode
    } = req.body
    // console.log(req.body)
    const correctOTP = await ContestRegistration.findOne({ $and: [{ mobileNo: mobile }], mobile_otp: mobile_otp }).select('status');
    // console.log(correctOTP)
    if (!correctOTP) {
        return res.status(400).json({ message: 'Please enter the correct OTP' })
    }

    // if(referrerCode && !await User.findOne({myReferralCode:referrerCode})){
    //     return res.status(404).json({status:'error', message:'The referral code doesn\'t exist. Please check again'});
    // }

    // if(campaignCode && !await Campaign.findOne({campaignCode})){
    //     return res.status(404).json({status:'error', message:'The campaign code doesn\'t exist. Please check again'});
    // }

    correctOTP.status = 'OTP Verified'
    await correctOTP.save({ validateBeforeSave: false });
    res.status(201).json({ info: "Application Submitted Successfully." })
    const existingUser = await User.findOne({ mobile: mobile })



    let campaign;
    if (campaignCode) {
        campaign = await Campaign.findOne({ campaignCode: campaignCode })
    }

    if (!existingUser) {
        const myReferralCode = generateUniqueReferralCode();
        let userId = email.split('@')[0]
        let userIds = await User.find({ employeeid: userId })
        if (userIds.length > 0) {
            userId = userId?.toString() + (userIds?.length + 1).toString()
        }

        const activeFreePortfolios = await PortFolio.find({ status: "Active", portfolioAccount: "Free" });
        let portfolioArr = [];
        for (const portfolio of activeFreePortfolios) {
            let obj = {};
            obj.portfolioId = portfolio._id;
            obj.activationDate = new Date();
            portfolioArr.push(obj);
        }
        let referralUser;
        let match = false;
        let affiliateObj = {};
        let referral;

        if (referrerCode) { referralUser = await User.findOne({ myReferralCode: referrerCode }).select('_id referrals employeeid email') };

        if (referralUser) {
            const checkAffiliate = await AffiliatePrograme.find().
                populate('affiliates.userId', 'myReferralCode');

            for (let elem of checkAffiliate) {
                match = elem?.affiliates?.some((subelem)=> (subelem?.userId?.myReferralCode === referrerCode && subelem?.affiliateStatus === "Active"));
                if (match) {
                    affiliateObj = elem;
                    break;
                }
            }
            referral = await Referral.findOne({ status: "Active" });
        }

        // console.log("match", match , "affiliateObj", affiliateObj)
        try {
            let obj = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                designation: 'Trader',
                email: email,
                mobile: mobile,
                gender: gender,
                college: college,
                passingoutyear: passingoutyear,
                degree: course,
                name: firstName.trim() + ' ' + lastName.trim().substring(0, 1),
                password: 'sh' + lastName.trim() + '@123' + mobile.trim().slice(1, 3),
                status: 'Active',
                employeeid: userId,
                creationProcess: 'College Contest SignUp',
                joining_date: new Date(),
                myReferralCode: (await myReferralCode).toString(),
                portfolio: portfolioArr,
                campaign: campaign && campaign._id,
                campaignCode: campaign && campaignCode,
                referrerCode: referralUser && referrerCode,
                referredBy: referralUser && referralUser?._id,
                referralProgramme: (referralUser && !match) ? referral._id : null,
                affiliateProgramme: match ? affiliateObj?._id : null

            }

            // console.log(obj)

            const newuser = await User.create(obj);
            await UserWallet.create(
                {
                    userId: newuser._id,
                    createdOn: new Date(),
                    createdBy: newuser._id
                });
            const token = await newuser.generateAuthToken();

            const idOfUser = newuser._id;

            for (const portfolio of activeFreePortfolios) {
                const portfolioValue = portfolio.portfolioValue;

                await PortFolio.findByIdAndUpdate(
                    portfolio._id,
                    { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
                );
            }

            if (campaign) {
                campaign?.users?.push({ userId: newuser._id, joinedOn: new Date() })
                const campaignData = await Campaign.findOneAndUpdate({ _id: campaign._id }, {
                    $set: {
                        users: campaign?.users
                    }
                })
                if (campaign?.campaignSignupBonus?.amount && !referrerCode) {
                    await addSignupBonus(newuser?._id, campaign?.campaignSignupBonus?.amount, campaign?.campaignSignupBonus?.currency);
                }
            }

            const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage potentialParticipants portfolio').populate('portfolio', 'portfolioValue');
            // let dailyContest = await DailyContest.findOne({_id: new ObjectId(contest)}).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage').populate('portfolio','portfolioValue')
            // const dcontest = dailyContest;
            dailyContest.potentialParticipants.push(newuser._id);
            await dailyContest.save({ validateBeforeSave: false });
            if (referrerCode) {
                if(match){
                    // const referralProgram = await ReferralProgram.findOne({ status: 'Active' })
                    // referralUser?.referrals?.push({
                    //     referredUserId: newuser._id,
                    //     joining_date: newuser.createdOn,
                    //     affiliateProgram: affiliateObj._id,
                    //     affiliateEarning: affiliateObj.rewardPerSignup,
                    //     affiliateCurrency: affiliateObj.currency,
                    // });

                    const saveAffiliate = await User.findOneAndUpdate(
                        { _id: new ObjectId(referralUser?._id) },
                        {
                            $push: {
                                affiliateReferrals: {
                                    referredUserId : newuser._id,
                                    joiningDate : newuser.createdOn,
                                    affiliateProgram : affiliateObj._id,
                                    affiliateEarning : affiliateObj.rewardPerSignup,
                                    affiliateCurrency : affiliateObj.currency
                              }
                            }
                          },
                      );
                    // const referralUserWallet = await UserWallet.findOne({ userId: referralUser?._id });
                    if(affiliateObj?.referralSignupBonus?.amount){
                        await addSignupBonus(newuser?._id, affiliateObj?.referralSignupBonus?.amount, affiliateObj?.referralSignupBonus?.currency);
                    }
                    // referralUserWallet?.transactions?.push({
                    //     title: 'Affiliate Signup Credit',
                    //     description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                    //     amount: affiliateObj.rewardPerSignup,
                    //     transactionId: uuid.v4(),
                    //     transactionDate: new Date(),
                    //     transactionType: affiliateObj.currency == 'INR' ? 'Cash' : 'Bonus'
                    // });

                    const wallet = await UserWallet.findOneAndUpdate(
                        { userId: referralUser?._id },
                        {
                            $push: {
                                transactions: {
                                    title: 'Affiliate Signup Credit',
                                    description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                                    amount: affiliateObj.rewardPerSignup,
                                    transactionId: uuid.v4(),
                                    transactionDate: new Date(),
                                    transactionType: affiliateObj.currency == 'INR' ? 'Cash' : 'Bonus'
                                }
                            }
                        },
                        { new: true, validateBeforeSave: false }
                    );

                    const updateProgramme = await AffiliatePrograme.findOneAndUpdate(
                        { _id: new ObjectId(affiliateObj?._id) },
                        {
                            $push: {
                                referrals: {
                                    userId: newuser._id,
                                    joinedOn: new Date(),
                                    affiliateUserId: referrerCodeMatch?._id
                                }
                            }
                        },

                        { new: true, validateBeforeSave: false }
                    );
                    // affiliateObj?.referrals?.push({ userId: newuser._id, joinedOn: new Date(), affiliateUserId: referrerCodeMatch?._id})

                    // await affiliateObj.save();
                    // if (referralProgram) await referralProgram?.save({ validateBeforeSave: false });
                    if (referralUser) await referralUser.save({ validateBeforeSave: false });
                    // if (referralUserWallet) await referralUserWallet.save({ validateBeforeSave: false });
    
                    await AffiliateTransaction.create({
                        affiliateProgram: new ObjectId(affiliateObj?._id),
                        affiliateWalletTId: uuid.v4(),
                        product: new ObjectId("6586e95dcbc91543c3b6c181"),
                        specificProduct: new ObjectId("6586e95dcbc91543c3b6c181"),
                        productActualPrice: 0,
                        productDiscountedPrice: 0,
                        buyer: new ObjectId(newuser?._id),
                        affiliate: new ObjectId(referralUser._id),
                        lastModifiedBy: new ObjectId(referralUser._id),
                        affiliatePayout: affiliateObj.rewardPerSignup
                    })
                } else{
                    const referralProgram = await ReferralProgram.findOneAndUpdate({ status: "Active" }, {
                        $push: {
                            users: {
                                userId: newuser._id, 
                                joinedOn: new Date()
                            }
                        }
                    })
                    // const referralProgram = await ReferralProgram.findOne({ status: 'Active' })
                    // referralUser?.referrals?.push({
                    //     referredUserId: newuser._id,
                    //     referralCurrency: referralProgram?.currency,
                    //     referralEarning: referralProgram?.rewardPerReferral,
                    //     referralProgram: referralProgram?._id
                    // });

                    const saveReferrals = await User.findOneAndUpdate(
                        { myReferralCode: referrerCode },
                        {
                            $push: {
                                referrals: {
                                    referredUserId: newuser._id,
                                    joiningDate: newuser.createdOn,
                                    referralProgram: referralProgram._id,
                                    referralEarning: referralProgram.rewardPerReferral,
                                    referralCurrency: referralProgram.currency,
                                }
                            }
                        },
                    );

                    const wallet = await UserWallet.findOneAndUpdate(
                        { userId: saveReferrals._id },
                        {
                            $push: {
                                transactions: {
                                    title: 'Referral Credit',
                                    description: `Amount credited for referral of ${newuser?.first_name} ${newuser?.last_name}`,
                                    transactionDate: new Date(),
                                    amount: referralProgram?.rewardPerReferral,
                                    transactionId: uuid.v4(),
                                    transactionType: 'Cash'
                                }
                            }
                        },
                        { new: true, validateBeforeSave: false }
                    );
                    // const referralUserWallet = await UserWallet.findOne({ userId: referralUser?._id });
                    if (referralProgram?.referralSignupBonus?.amount) {
                        await addSignupBonus(newuser?._id, referral?.referralSignupBonus?.amount, referral?.referralSignupBonus?.currency);
                    }
                    // referralUserWallet?.transactions?.push({
                    //     title: 'Referral Credit',
                    //     description: `Amount credited for referral of ${newuser?.first_name} ${newuser?.last_name}`,
                    //     transactionDate: new Date(),
                    //     amount: referralProgram?.rewardPerReferral,
                    //     transactionId: uuid.v4(),
                    //     transactionType: 'Cash'
                    // });
                    // referralProgram?.users?.push({
                    //     userId: newuser?._id,
                    //     joinedOn: new Date()
                    // });
                    // if (referralProgram) await referralProgram?.save({ validateBeforeSave: false });
                    if (referralUser) await referralUser.save({ validateBeforeSave: false });
                    // if (referralUserWallet) await referralUserWallet.save({ validateBeforeSave: false });
    
                }
            }

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
            if (process.env.PROD == 'true') {
                emailService(newuser?.email, subject, message);
            }

            if (process.env.PROD == 'true') {
                // whatsAppService.sendWhatsApp({destination : newuser?.mobile, campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser?.first_name, contest?.contestName, contest?.contestName, moment.utc(contest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), moment.utc(contest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), (contest?.portfolio?.portfolioValue)?.toString(), (contest?.payoutPercentage)?.toString(), (contest?.entryFee)?.toString()], tags : '', attributes : ''});
            }
            else {
                // whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser.first_name, contest?.contestName, contest?.contestName, contest?.contestStartTime, contest?.contestEndTime, contest?.portfolio?.portfolioValue, contest?.payoutPercentage, contest?.entryFee], tags : '', attributes : ''});
                //   whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser?.first_name, contest?.contestName, contest?.contestName, moment.utc(contest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), moment.utc(contest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), (contest?.portfolio?.portfolioValue)?.toString(), (contest?.payoutPercentage)?.toString(), (contest?.entryFee)?.toString()], tags : '', attributes : ''});
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        if (campaign) {
            campaign?.users?.push({ userId: existingUser._id, joinedOn: new Date() });
            await campaign.save({ validateBeforeSave: false });
        }
        const dailyContest = await DailyContest.findById(contest).select('potentialParticipants');
        // const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage potentialParticipants portfolio').populate('portfolio','portfolioValue');
        dailyContest.potentialParticipants.push(existingUser._id);
        await dailyContest.save({ validateBeforeSave: false });
    }
    const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartTime contestEndTime payoutPercentage potentialParticipants portfolio').populate('portfolio', 'portfolioValue');
    if (process.env.PROD == 'true') {
        // whatsAppService.sendWhatsApp(
        //     {
        //         destination : existingUser?.mobile, 
        //         campaignName : 'col_contest_signup_campaign', 
        //         userName : existingUser?.first_name, 
        //         source : existingUser?.creationProcess, 
        //         media : {url : mediaURL, filename : mediaFileName}, 
        //         templateParams : [
        //                 existingUser?.first_name, 
        //                 dailyContest?.contestName, 
        //                 dailyContest?.contestName, 
        //                 moment.utc(dailyContest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
        //                 moment.utc(dailyContest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
        //                 (dailyContest?.portfolio?.portfolioValue).toLocaleString('en-IN'), 
        //                 (dailyContest?.payoutPercentage).toLocaleString('en-IN'), 
        //                 (dailyContest?.entryFee).toLocaleString('en-IN')
        //             ], 
        //         tags : '', 
        //         attributes : ''
        //     });
    }
    else {
        // whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'college_contest_signup_campaign', userName : existingUser.first_name, source : existingUser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [existingUser.first_name, contest?.contestName, contest?.contestName, contest?.contestStartTime, contest?.contestEndTime, contest?.portfolio?.portfolioValue, contest?.payoutPercentage, contest?.entryFee], tags : '', attributes : ''});
        // whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'college_contest_signup_campaign', userName : existingUser.first_name, source : existingUser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [existingUser.first_name, contest?.contestName, contest?.contestName, contest?.contestStartTime, contest?.contestEndTime, contest?.portfolio?.portfolioValue, contest?.payoutPercentage, contest?.entryFee], tags : '', attributes : ''});
        // whatsAppService.sendWhatsApp(
        //     {
        //         destination : '8076284368', 
        //         campaignName : 'col_contest_signup_campaign', 
        //         userName : existingUser?.first_name, 
        //         source : existingUser?.creationProcess, 
        //         media : {url : mediaURL, filename : mediaFileName}, 
        //         templateParams : [
        //                 existingUser?.first_name, 
        //                 dailyContest?.contestName, 
        //                 dailyContest?.contestName, 
        //                 moment.utc(dailyContest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
        //                 moment.utc(dailyContest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
        //                 (dailyContest?.portfolio?.portfolioValue).toLocaleString('en-IN'), 
        //                 (dailyContest?.payoutPercentage).toLocaleString('en-IN'), 
        //                 (dailyContest?.entryFee).toLocaleString('en-IN')
        //             ], 
        //         tags : '', 
        //         attributes : ''
        //     });
    }

}

const addSignupBonus = async (userId, amount, currency) => {
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

/*
1. campaign
2. campaign and refrrl


3. reffrl
3.1 normal
3.2 affiiate --> 1st


1. career and testzone
2. affiliates adding me details save in personal db
3.

1. basic summery

*/