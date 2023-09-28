const emailService = require("../../utils/emailService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userDetailSchema");
// const userPersonalDetail = require("../../models/User/userDetailSchema");
// const signedUpUser = require("../../models/User/signedUpUser");
const {sendSMS, sendOTP} = require('../../utils/smsService');
const Referral = require("../../models/campaigns/referralProgram");
const Lead = require("../../models/leads/leads");
const MarginAllocation = require("../../models/marginAllocation/marginAllocationSchema")
const PortFolio = require("../../models/userPortfolio/UserPortfolio")
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const Campaign = require("../../models/campaigns/campaignSchema")
const uuid = require('uuid');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.post("/signup", async (req, res) => {
    const { first_name, last_name, email, mobile } = req.body;

    if (!first_name || !last_name || !email || !mobile) {
        return res.status(400).json({ status: 'error', message: "Please fill all fields to proceed." })
    }
    const isExistingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    if (isExistingUser) {
        return res.status(400).json({
            message: "Your account already exists. Please login with mobile or email",
            status: 'error'
        });
    }
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
            await signedupuser.save({ validateBeforeSave: false })
        }
        else {
            await SignedUpUser.create({
                first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(),
                mobile: mobile.trim(), mobile_otp: mobile_otp
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
    const {
        first_name,
        last_name,
        email,
        mobile,
        mobile_otp,
        referrerCode,
        password
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

    if(await User.findOne({mobile:user?.mobile})){
        return res.status(400).json({
            status: 'error',
            message: "Account already exists with this mobile number."
        })
    }


    let referredBy;
    let campaign;
    if (referrerCode) {
        const referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });
        const campaignCodeMatch = await Campaign.findOne({ campaignCode: referrerCode })
        
        if (!referrerCodeMatch && !campaignCodeMatch) {
            return res.status(404).json({ status: 'error', message: "No such referrer code exists. Please enter a valid referrer code" });
        }

        user.status = 'OTP Verified'
        user.last_modifiedOn = new Date()
        await user.save({validateBeforeSave: false});
        if (referrerCodeMatch) { referredBy = referrerCodeMatch?._id; }
        if (campaignCodeMatch) { campaign = campaignCodeMatch }
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

    let referral;
    if (referredBy) {
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
        let obj = {
            first_name: first_name.trim(), last_name: last_name.trim(), designation: 'Trader', email: email.trim(),
            mobile: mobile.trim(),
            name: first_name.trim() + ' ' + last_name.trim().substring(0, 1),
            password: password,
            status: 'Active',
            employeeid: userId, creationProcess: 'Auto SignUp',
            joining_date: user.last_modifiedOn,
            myReferralCode: (await myReferralCode).toString(),
            referrerCode: referredBy && referrerCode,
            portfolio: portfolioArr,
            referralProgramme: referredBy && referral._id,
            campaign: campaign && campaign._id,
            campaignCode: campaign && referrerCode,
            referredBy: referredBy && referredBy
        }

        const newuser = await User.create(obj);
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

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
        });    
        res.status(201).json({ status: "Success", data: populatedUser, message: "Welcome! Your account is created, please login with your credentials.", token });
        
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
            }
        }

        if (campaign) {
            campaign?.users?.push({ userId: newuser._id, joinedOn: new Date() })
            await campaign.save();
            // const campaignData = await Campaign.findOneAndUpdate({ _id: campaign._id }, {
            //     $set: {
            //         users: campaign?.users
            //     }
            // })
        }

        // let lead = await Lead.findOne({ $or: [{ email: newuser.email }, { mobile: newuser.mobile }] });
        // if (lead) {
        //     lead.status = 'Joined'
        //     lead.referralCode = newuser.referrerCode
        //     lead.joinedOn = new Date();
        //     await lead.save({ validateBeforeSave: false });
        // }

        await UserWallet.create(
            {
                userId: newuser._id,
                createdOn: new Date(),
                createdBy: newuser._id
        })


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
                    <p>Welcome to StoxHero - Your Gateway to the Exciting World of Options Trading and Earning! </p>
                    <p> StoxHero is a specialized Intraday Options Trading Platform focusing on indices such as NIFTY, BANKNIFTY & FINNIFTY.</p>
                    <p>Congratulations on joining our ever-growing community of traders and learners. We are thrilled to have you onboard and can't wait to embark on this exciting journey together. At StoxHero, we offer a range of programs designed to help you learn and excel in trading while providing you with opportunities to earn real profits from virtual currency. Let's dive into the fantastic programs that await you:</p>
                    <p>1. Virtual Trading:
                    Start your trading experience with a risk-free environment! In Virtual Trading, you get INR 10L worth of virtual currency to practice your trading skills, test strategies, and build your profit and loss (P&L) under real market scenarios without any investment. It's the perfect platform to refine your trading strategies and gain confidence before entering the real market.</p>
                    <p>2. Ten X:
                    Participate in our Ten X program and explore various trading opportunities. Trade with virtual currency and, after completing 20 trading days, you become eligible for a remarkable 10% profit share or profit CAP amount from the net profit you make in the program. You'll not only learn trading but also earn real money while doing so - a win-win situation!</p>
                    <p>3. Contests:
                    Challenge yourself in daily contests where you compete with other users based on your P&L. You'll receive virtual currency to trade with, and your profit share from the net P&L you achieve in each contest will add to your earnings. With different contests running, you have the flexibility to choose and participate as per your preference.</p>
                    <p>4. College Contest:
                    Attention college students! Our College Contest is tailored just for you. Engage in daily intraday trading contests, and apart from receiving profit share from your net P&L, the top 3 performers will receive an appreciation certificate highlighting their outstanding performance.</p>
                    <p>To help you get started and make the most of our programs, we've prepared comprehensive tutorial videos for each of them:</p>
                    <p><a href='https://youtu.be/6wW8k-8zTXY'>Virtual Trading Tutorial</a></br>
                    <a href='https://www.youtube.com/watch?v=a3_bmjv5tXQ'>Ten X Tutorial</a></br>
                    <a href='https://www.youtube.com/watch?v=aqh95E7DbXo'>Contests Tutorial</a></br>
                    <a href='https://www.youtube.com/watch?v=aqh95E7DbXo'>College Contest Tutorial</a></p>
                    <p>For any queries or assistance, our dedicated team is always here to support you. Feel free to connect with us on different platforms:
                    </p>
                    <p><a href='https://t.me/stoxhero_official'>Telegram</a></br>
                    <a href='https://www.facebook.com/profile.php?id=100091564856087'>Facebook</a></br>
                    <a href='https://instagram.com/stoxhero_official?igshid=MzRlODBiNWFlZA=='>Instagram</a></br>
                    <a href='https://www.youtube.com/@stoxhero_official/videos'>YouTube</a></p>
                    <p>StoxHero is open to everyone who aspires to learn options intraday trading in a risk-free environment and analyze their performance to enhance their strategies. Moreover, with the chance to earn real profits through our programs, StoxHero provides an excellent platform for everyone to learn and earn. Be your own boss, take charge, and unlock the potential within you!</p>
                    <p>We are excited to inform you that our system goes online every day at 09:20 AM, and all trades get automatically squared off at 3:20 PM. This ensures that your trading process remains smooth and consistent.</p>
                    <p>We hope you enjoy your trading journey with StoxHero. Should you have any questions or require assistance at any stage, don't hesitate to reach out to us.</p>
                    <p>Happy Trading and Learning!</p>
                    <p>Best regards,</br>
                    Team StoxHero</p>
                    <a href="https://www.stoxhero.com/" class="login-button">Start your journey now</a>
                    </div>
                </body>
                </html>

            `
        if(process.env.PROD == 'true'){
            emailService(newuser.email, subject, message);
        }
    }
    catch (error) {
        console.log(error);
    }
})

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