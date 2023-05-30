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

router.post("/signup", async (req, res)=>{
    console.log("Inside SignUp Routes")
    const {first_name, last_name, email, mobile } = req.body;
    console.log(req.body)
    console.log(!first_name || !last_name || !email || !mobile)
    if( !first_name || !last_name || !email || !mobile){
        return res.status(400).json({status:'error', message : "Please fill all fields to proceed."})
    }
    const isExistingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    if(isExistingUser)
    {
        return res.status(406).json({message : "Your account is already exist. Please login with mobile or email", 
        status: 'error'});

    }
    const signedupuser = await SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    console.log(signedupuser)
    // let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    try{
    if(signedupuser)
    {
        signedupuser.first_name = first_name;
        signedupuser.last_name = last_name;
        signedupuser.mobile = mobile;
        signedupuser.email = email;
        signedupuser.mobile_otp = mobile_otp;
        await signedupuser.save({validateBeforeSave:false})
    }
    else{
        //removed emailotp
        await SignedUpUser.create({first_name:first_name.trim(), last_name:last_name.trim(), email:email.trim(), 
            mobile:mobile.trim(), mobile_otp: mobile_otp});
    }

    res.status(201).json({message : "OTP has been sent. Check your messages. OTP expires in 30 minutes.", 
        status: 'success'});
             
                sendOTP(mobile.toString(), mobile_otp);

            }catch(err){console.log(err);res.status(500).json({message:'Something went wrong',status:"error"})}
})

router.patch("/verifyotp", async (req, res)=>{
        const {
        first_name,
        last_name,
        email,
        mobile,
        mobile_otp,
        referrerCode,
        } = req.body


    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {   
        return res.status(404).json({
            status:'error',
            message: "User with this email doesn't exist"
        })
    }
    //removed email otp check
    if(user.mobile_otp != mobile_otp)
    {   
        return res.status(400).json({
            status: 'error',
            message: "OTPs don't match, please try again!"
        })
    }
 

        //------
        let referredBy;
        let campaign;
        if(referrerCode){
            const referrerCodeMatch = await User.findOne({myReferralCode: referrerCode});
            const campaignCodeMatch = await Campaign.findOne({campaignCode:referrerCode})
            console.log(!referrerCodeMatch,!campaignCodeMatch, !referrerCodeMatch || !campaignCodeMatch)

            if(!referrerCodeMatch && !campaignCodeMatch){
                return res.status(404).json({status: 'error', message : "No such referrer code. Please enter a valid referrer code"});
            }

            user.status = 'OTP Verified'
            user.last_modifiedOn = new Date()
            await user.save();
            if(referrerCodeMatch){referredBy = referrerCodeMatch._id;}
            if(campaignCodeMatch){campaign = campaignCodeMatch}
        }
            user.status = 'OTP Verified'
            user.last_modifiedOn = new Date()
            await user.save();
        //--------
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

        
        const myReferralCode = generateUniqueReferralCode();
        const count = await User.countDocuments();
        const userId = email.split('@')[0]
        const userIds = await User.find({employeeid:userId})
        console.log("User Ids: ",userIds)
        if(userIds.length > 0)
        {
            userId = userId.toString()+(userIds.length+1).toString()
        }
        
        let referral;
        if(referredBy){
            referral = await Referral.findOne({status: "Active"});
        }

        // free portfolio adding in user collection
        const activeFreePortfolios = await PortFolio.find({status: "Active", portfolioAccount: "Free"});
        let portfolioArr = [];
        for (const portfolio of activeFreePortfolios) {
            let obj = {};
            obj.portfolioId = portfolio._id;
            obj.activationDate = new Date();
            portfolioArr.push(obj);
        }

        try{
        let obj = {
            first_name: first_name.trim(), last_name:last_name.trim(), designation: 'Trader', email:email.trim(), 
            mobile:mobile.trim(),
            name: first_name.trim() + ' ' + last_name.trim().substring(0,1), 
            password: 'sh' + last_name.trim() + '@123' + mobile.trim().slice(1,3), 
            status: 'Active', 
            employeeid: userId, creationProcess: 'Auto SignUp',
            joining_date:user.last_modifiedOn,
            myReferralCode:(await myReferralCode).toString(), 
            referrerCode: referredBy && referrerCode,
            portfolio: portfolioArr,
            referralProgramme: referredBy && referral._id,
            campaign: campaign && campaign._id,
            campaignCode: campaign && referrerCode,
            referredBy: referredBy && referredBy
        }

        const newuser = await User.create(obj);
        const token = await newuser.generateAuthToken();

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            // httpOnly: true
        });
        
        console.log("token", token);
        res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
        const idOfUser = newuser._id;
        
        for (const portfolio of activeFreePortfolios) {
            const portfolioValue = portfolio.portfolioValue;
            
            await PortFolio.findByIdAndUpdate(
                portfolio._id,
                { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
                );
            }
            
        if(referredBy){
            console.log("Inside User update in referral: ",referredBy)
            referral?.users?.push({userId : newuser._id, joinedOn: new Date()})
            console.log(referral?.users)
            const referralProgramme = await Referral.findOneAndUpdate({status: "Active"}, {
                $set:{ 
                    users: referral?.users
                }
            })        
            
            if(referrerCode){
                let referrerCodeMatch = await User.findOne({myReferralCode: referrerCode});
                referrerCodeMatch.referrals= [...referrerCodeMatch.referrals, {
                    referredUserId: newuser._id,
                    joining_date: newuser.createdOn,
                    referralProgram: referralProgramme._id,
                    referralEarning: referralProgramme.rewardPerReferral,
                    referralCurrency: referralProgramme.currency,
                }];
                await referrerCodeMatch.save({validateBeforeSave: false});
                const wallet = await UserWallet.findOne({userId: referrerCodeMatch._id});
                wallet.transactions = [...wallet.transactions, {
                    title: 'Referral Credit',
                    description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                    amount: referralProgramme.rewardPerReferral,
                    transactionId: uuid.v4(),
                    transactionDate: new Date(),
                    transactionType: referralProgramme.currency == 'INR'?'Cash':'Bonus' 
                }];
                await wallet.save({validateBeforeSave:false});
            }
        }
        
        console.log("Campaign: ",campaign)
        if(campaign){
            console.log("Inside setting user to campaign")
            campaign?.users?.push({userId:newuser._id,joinedOn: new Date()})
            const campaignData = await Campaign.findOneAndUpdate({_id: campaign._id}, {
                $set:{ 
                    users: campaign?.users
                }
            })
            console.log(campaignData)
        }

        let lead = await Lead.findOne({ $or: [{ email: newuser.email }, { mobile: newuser.mobile }] });
        if(lead){
        lead.status = 'Joined'
        lead.referralCode = newuser.referrerCode
        lead.joinedOn = new Date();
        await lead.save({validateBeforeSave:false});
        }
        
        await UserWallet.create(
            {
                userId: newuser._id,
                createdOn: new Date(),
                createdBy:newuser._id
        })
        

        if(!newuser) return res.status(400).json({status: 'error', message: 'Something went wrong'});

        // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
            // let email = newuser.email;
            let subject = "Account Created - StoxHero";
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
                    <p>Hello ${newuser.first_name},</p>
                    <p>Your login details are:</p>
                    <p>User ID: <span class="userid">${newuser.email}</span></p>
                    <p>Password: <span class="password">sh${last_name.trim()}@123${mobile.slice(1,3)}</span></p>
                    <p>Please use these credentials to log in to our website:</p>
                    <a href="https://www.stoxhero.com/" class="login-button">Log In</a>
                    </div>
                </body>
                </html>

            `
            emailService(newuser.email,subject,message);
        }
        catch(error){
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
        sendOTP(mobile.toString(), mobile_otp);    
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

router.get("/signedupusers", (req, res)=>{
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

router.put("/updatesignedupuser/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);

    try{
        const {id} = req.params
        //console.log(id)

        const signedupuser = await SignedUpUser.findOne({_id: id})
        //console.log("user", user)
        signedupuser.status = req.body.Status,

        await signedupuser.save();
        res.status(201).json({message : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

module.exports = router;