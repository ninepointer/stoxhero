const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const jwt = require("jsonwebtoken")
const authentication = require("../../authentication/authentication");
const {sendSMS, sendOTP} = require('../../utils/smsService');
const otpGenerator = require('otp-generator');
const moment = require('moment');

router.post("/login", async (req, res) => {
    const { userId, pass } = req.body;

    // console.log(req.body)

    if (!userId || !pass) {
        return res.status(422).json({ status: 'error', message: "Please provide login credentials" });
    }

    const deactivatedUser = await UserDetail.findOne({ email: userId, status: "Inactive" })

    if(deactivatedUser){
        return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
    }

    const userLogin = await UserDetail.findOne({ email: userId, status: "Active" }).select('_id role password');

    if (!userLogin || !(await userLogin.correctPassword(pass, userLogin.password))) {
        return res.status(422).json({ error: "invalid details" })
    } else {

        if (!userLogin) {
            return res.status(422).json({ status: 'error', message: "Invalid credentials" });
        } else {
            if(userLogin?.role?.toString()=='644903ac236de3fd7cfd755c'){
                return res.status(400).json({status:'error', message:'Invalid request'});
            }
            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
            });
            res.status(201).json({ status: 'success', message: "user logged in succesfully", token: token });
        }
    }
})

router.post('/phonelogin', async (req,res, next)=>{
    const {mobile} = req.body;
    try{
        const deactivatedUser = await UserDetail.findOne({ mobile: mobile, status: "Inactive" })

        if(deactivatedUser){
            return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
        }
    
        const user = await UserDetail.findOne({mobile});
    
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'})
        }
        if (user?.lastOtpTime && moment().subtract(29, 'seconds').isBefore(user?.lastOtpTime)) {
            return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
          }
    
        let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    
        user.mobile_otp = mobile_otp;
        user.lastOtpTime = new Date();
        await user.save({validateBeforeSave: false});
    
        // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
        if(process.env.PROD=='true') sendOTP(mobile.toString(), mobile_otp);
        console.log(process.env.PROD, mobile_otp, 'sending');
        if(process.env.PROD!=='true'){
            console.log('sending kamal ji')
            sendOTP("9319671094", mobile_otp)
        }
    
        res.status(200).json({status: 'Success', message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`});
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});
    }

});

router.post('/verifyphonelogin', async(req,res,next)=>{
    const {mobile, mobile_otp} = req.body;

    try {
        const user = await UserDetail.findOne({mobile});
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
        }
        if(process.env.PROD!='true' && mobile == '7737384957' && mobile_otp== '987654'){
          const token = await user.generateAuthToken();

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            // httpOnly: true
        });
        // res.json(token);
        return res.status(200).json({status: 'success', message : "User login successful", token: token});
        }


        // console.log(user);

        if(user.mobile_otp != mobile_otp){
            return res.status(400).json({status: 'error', message: 'OTP didn\'t match. Please check again.'});
        }

        const token = await user.generateAuthToken();

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            // httpOnly: true
        });
        // res.json(token);
        res.status(200).json({status: 'success', message : "User login successful", token: token});


    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});
    }

});

router.post("/resendmobileotp", async(req, res)=>{
    const{mobile} = req.body;
    try{
        const user = await UserDetail.findOne({mobile});
        if(!user){
            return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
        }

        if (user?.lastOtpTime && moment().subtract(29, 'seconds').isBefore(user?.lastOtpTime)) {
            return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
        }

        let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        
        user.mobile_otp = mobile_otp;
        user.lastOtpTime=new Date();
        await user.save({validateBeforeSave: false});
    
        // sendSMS([mobile.toString()], `Your OTP is ${mobile_otp}`);
        if(process.env.PROD == 'true')sendOTP(mobile.toString(), mobile_otp);
        if(process.env.PROD !== 'true')sendOTP("9319671094", mobile_otp);
        res.status(200).json({status: 'success', message : "Otp sent. Check again."});
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: `Something went wrong. Please try again.`});

    }
});

router.get("/loginDetail", authentication, async (req, res)=>{
    const id = req.user._id;
    
    
    const user = await UserDetail.findOne({_id: id, status: "Active"})
    .populate('role', 'roleName')
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

    res.json(user);
})

router.get("/logout", authentication, (req, res)=>{
    res.clearCookie("jwtoken", { path: "/" });
    res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
})


module.exports = router;