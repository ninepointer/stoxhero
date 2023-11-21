const ContestRegistration  =require('../../models/DailyContest/contestRegistration');
const otpGenerator = require('otp-generator');
const whatsAppService = require("../../utils/whatsAppService")
const mediaURL = "https://dmt-trade.s3.amazonaws.com/carousels/WhastAp%20Msg%20Photo/photos/1697228055934Welcome%20to%20the%20world%20of%20Virtual%20Trading%20but%20real%20earning%21.png";
const mediaFileName = 'StoxHero'
const moment = require('moment');
const {sendSMS, sendOTP} = require('../../utils/smsService');
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



exports.generateOTP = async(req, res, next)=>{
    console.log(req.body)   
  
    const{ firstName, lastName, email, mobile, dob, gender, college, collegeName, course, passingoutyear, source, contest, campaignCode, referrerCode, linkedInProfileLink
    } = req.body
    
    if(!contest){
        return res.status(400).json({
            message: "This College TestZone doesn't exist!",
            status: 'error'
          });
    }
    const dailyContest = await DailyContest.findById(contest).select('contestEndTime');
    if(dailyContest?.contestEndTime<new Date()){
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
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    try {
        if(await ContestRegistration.findOne({mobileNo: mobile, status:'OTP Verified', contest:contest})){
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
        gender:gender,
        college:college,
        collegeName: collegeName,
        course: course,
        passingoutyear: passingoutyear,
        linkedInProfileLink: linkedInProfileLink,
        source: source.trim(),
        contest: contest,
        campaignCode: campaignCode?.trim(),
        mobile_otp: mobile_otp,
        status: 'OTP Verification Pending',
        referrerCode:referrerCode
        });
        // console.log(data)
        if(process.env.PROD == 'true')sendOTP(mobile.toString(), mobile_otp);
       if(process.env.PROD!=='true')sendOTP("9319671094", mobile_otp);
        res.status(201).json({message: "OTP Sent on your mobile number!"}); 
    }catch(error){
      console.log(error)
    }
  }


exports.confirmOTP = async(req, res, next)=>{


const{ firstName, lastName, email, mobile, gender, college, course, passingoutyear, campaignCode, mobile_otp, contest, referrerCode
} = req.body
console.log(req.body)
const correctOTP = await ContestRegistration.findOne({$and : [{mobileNo: mobile}], mobile_otp: mobile_otp}).select('status');
// console.log(correctOTP)
if(!correctOTP){
    return res.status(400).json({message:'Please enter the correct OTP'})
}

// if(referrerCode && !await User.findOne({myReferralCode:referrerCode})){
//     return res.status(404).json({status:'error', message:'The referral code doesn\'t exist. Please check again'});
// }

// if(campaignCode && !await Campaign.findOne({campaignCode})){
//     return res.status(404).json({status:'error', message:'The campaign code doesn\'t exist. Please check again'});
// }

correctOTP.status = 'OTP Verified'
await correctOTP.save({validateBeforeSave:false});
res.status(201).json({info:"Application Submitted Successfully."})
const existingUser = await User.findOne({mobile: mobile})



let campaign;
    if(campaignCode){
    campaign = await Campaign.findOne({campaignCode:campaignCode})
    }

if(!existingUser){
    const myReferralCode = generateUniqueReferralCode();
    let userId = email.split('@')[0]
    let userIds = await User.find({employeeid:userId})
    if(userIds.length > 0)
    {
        userId = userId?.toString()+(userIds?.length+1).toString()
    }

    const activeFreePortfolios = await PortFolio.find({status: "Active", portfolioAccount: "Free"});
    let portfolioArr = [];
    for (const portfolio of activeFreePortfolios) {
        let obj = {};
        obj.portfolioId = portfolio._id;
        obj.activationDate = new Date();
        portfolioArr.push(obj);
    }
    let referralUser;
    if(referrerCode){referralUser = await User.findOne({myReferralCode:referrerCode}).select('_id referrals employeeid email')};
    try{
        let obj = {
            first_name : firstName.trim(), 
            last_name : lastName.trim(), 
            designation: 'Trader', 
            email : email, 
            mobile : mobile,
            gender: gender,
            college:college,
            passingoutyear:passingoutyear,
            degree:course,
            name: firstName.trim() + ' ' + lastName.trim().substring(0,1), 
            password: 'sh' + lastName.trim() + '@123' + mobile.trim().slice(1,3), 
            status: 'Active', 
            employeeid: userId, 
            creationProcess: 'College Contest SignUp',
            joining_date:new Date(),
            myReferralCode:(await myReferralCode).toString(), 
            portfolio: portfolioArr,
            campaign: campaign && campaign._id,
            campaignCode: campaign && campaignCode,
            referrerCode:referralUser && referrerCode,
            referredBy: referralUser && referralUser?._id
        }

            const newuser = await User.create(obj);
            await UserWallet.create(
                {
                    userId: newuser._id,
                    createdOn: new Date(),
                    createdBy:newuser._id
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
            
            if(campaign){
                campaign?.users?.push({userId:newuser._id,joinedOn: new Date()})
                const campaignData = await Campaign.findOneAndUpdate({_id: campaign._id}, {
                    $set:{ 
                        users: campaign?.users
                    }
                })
                if(campaign?.campaignSignupBonus?.amount){
                    await addSignupBonus(newuser?._id, campaign?.campaignSignupBonus?.amount, campaign?.campaignSignupBonus?.currency);
                }
            }


            const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage potentialParticipants portfolio').populate('portfolio','portfolioValue');
            // let dailyContest = await DailyContest.findOne({_id: new ObjectId(contest)}).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage').populate('portfolio','portfolioValue')
            // const dcontest = dailyContest;
            dailyContest.potentialParticipants.push(newuser._id);
            await dailyContest.save({validateBeforeSave:false});
            if(referrerCode){
                const referralProgram = await ReferralProgram.findOne({status:'Active'})
                referralUser?.referrals?.push({
                    referredUserId:newuser._id,
                    referralCurrency: referralProgram?.currency,
                    referralEarning: referralProgram?.rewardPerReferral,
                    referralProgram: referralProgram?._id
                });
                const referralUserWallet = await UserWallet.findOne({userId: referralUser?._id});
                if(referralProgram?.referralSignupBonus?.amount && !campaign?.campaignSignupBonus?.amount){
                    await addSignupBonus(newuser?._id, referral?.referralSignupBonus?.amount, referral?.referralSignupBonus?.currency);
                }
                referralUserWallet?.transactions?.push({
                    title:'Referral Credit',
                    description:`Amount credited for referral of ${newuser?.first_name} ${newuser?.last_name}`,
                    transactionDate: new Date(),
                    amount: referralProgram?.rewardPerReferral,
                    transactionId: uuid.v4(),
                    transactionType:'Cash'
                });
                referralProgram?.users?.push({
                    userId: newuser?._id,
                    joinedOn: new Date()
                });
                if(referralProgram) await referralProgram?.save({validateBeforeSave:false});
                if(referralUser) await referralUser.save({validateBeforeSave:false});
                if(referralUserWallet) await referralUserWallet.save({validateBeforeSave:false});
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
                        <p>Welcome to StoxHero - Your Gateway to the Exciting World of Options Trading and Earning! </p>
                        <p>StoxHero is a specialized Intraday Options Trading Platform focusing on indices such as NIFTY, BANKNIFTY & FINNIFTY.</p>
                        <p>Congratulations on joining our ever-growing community of traders and learners. We are thrilled to have you onboard and can't wait to embark on this exciting journey together. At StoxHero, we offer a range of programs designed to help you learn and excel in trading while providing you with opportunities to earn real profits from virtual currency. Let's dive into the fantastic programs that await you:</p>
                        <p>1. F&O Trading:
                        Start your trading experience with a risk-free environment! In Virtual Trading, you get INR 10L worth of virtual currency to practice your trading skills, test strategies, and build your profit and loss (P&L) under real market scenarios without any investment. It's the perfect platform to refine your trading strategies and gain confidence before entering the real market.</p>
                        <p>2. TenX:
                        Participate in our Ten X program and explore various trading opportunities. Trade with virtual currency and, after completing 20 trading days, you become eligible for a remarkable 10% profit share or profit CAP amount from the net profit you make in the program. You'll not only learn trading but also earn real money while doing so - a win-win situation!</p>
                        <p>3. TestZones:
                        Challenge yourself in daily TestZones where you compete with other users based on your P&L. You'll receive virtual currency to trade with, and your profit share from the net P&L you achieve in each TestZone will add to your earnings. With different TestZones running, you have the flexibility to choose and participate as per your preference.</p>
                        <p>4. College TestZones:
                        Attention college students! Our College TestZone is tailored just for you. Engage in daily intraday trading TestZones, and apart from receiving profit share from your net P&L, the top 3 performers will receive an appreciation certificate highlighting their outstanding performance.</p>
                        <p>To help you get started and make the most of our programs, we've prepared comprehensive tutorial videos for each of them:</p>
                        <p><a href='https://youtu.be/6wW8k-8zTXY'>Virtual Trading Tutorial</a></br>
                        <a href='https://www.youtube.com/watch?v=a3_bmjv5tXQ'>Ten X Tutorial</a></br>
                        <a href='https://www.youtube.com/watch?v=aqh95E7DbXo'>TestZones Tutorial</a></br>
                        <a href='https://www.youtube.com/watch?v=aqh95E7DbXo'>College TestZones Tutorial</a></p>
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
                        <p>Your Credentials</p>
                        <p>User ID: <span class="userid">${newuser?.email}</span></p>
                        <p>Password: <span class="password">sh${newuser.last_name?.trim()}@123${newuser?.mobile?.slice(1,3)}</span></p>
                        <p>Please use these credentials to log in</p>
                        <a href="https://www.stoxhero.com/" class="login-button">Start your journey now</a>
                        <p>Best regards,</br>
                        Team StoxHero</p>
                        </div>
                    </body>
                    </html>

                `
                if(process.env.PROD=='true'){
                    emailService(newuser?.email,subject,message);
                }

                if(process.env.PROD == 'true'){
                    // whatsAppService.sendWhatsApp({destination : newuser?.mobile, campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser?.first_name, contest?.contestName, contest?.contestName, moment.utc(contest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), moment.utc(contest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), (contest?.portfolio?.portfolioValue)?.toString(), (contest?.payoutPercentage)?.toString(), (contest?.entryFee)?.toString()], tags : '', attributes : ''});
                  }
                  else {
                      // whatsAppService.sendWhatsApp({destination : '9319671094', campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser.first_name, contest?.contestName, contest?.contestName, contest?.contestStartTime, contest?.contestEndTime, contest?.portfolio?.portfolioValue, contest?.payoutPercentage, contest?.entryFee], tags : '', attributes : ''});
                    //   whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'college_contest_signup_campaign', userName : newuser.first_name, source : newuser.creationProcess, media : {url : mediaURL, filename : mediaFileName}, templateParams : [newuser?.first_name, contest?.contestName, contest?.contestName, moment.utc(contest?.contestStartTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), moment.utc(contest?.contestEndTime).utcOffset('+05:30').format("DD-MMM hh:mm a"), (contest?.portfolio?.portfolioValue)?.toString(), (contest?.payoutPercentage)?.toString(), (contest?.entryFee)?.toString()], tags : '', attributes : ''});
                  }

    }catch(error){
        console.log(error)
    }
}else{
    if(campaign){
        campaign?.users?.push({userId:existingUser._id,joinedOn: new Date()});
        await campaign.save({validateBeforeSave:false});
      }
        const dailyContest = await DailyContest.findById(contest).select('potentialParticipants');
        // const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartDate contestEndDate payoutPercentage potentialParticipants portfolio').populate('portfolio','portfolioValue');
        dailyContest.potentialParticipants.push(existingUser._id);
        await dailyContest.save({validateBeforeSave:false});
    }
    const dailyContest = await DailyContest.findById(contest).select('_id contestName entryFee contestStartTime contestEndTime payoutPercentage potentialParticipants portfolio').populate('portfolio','portfolioValue');
    if(process.env.PROD == 'true'){
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
    const wallet = await UserWallet.findOne({userId:userId});
    try{
        wallet.transactions?.push({
            title: 'Sign up Bonus',
            description: `Amount credited for as sign up bonus.`,
            amount: amount,
            transactionId: uuid.v4(),
            transactionDate: new Date(),
            transactionType: currency
        });
        await wallet.save({validateBeforeSave:false});
    }catch(e){
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
            contestStartTime: { $gt: new Date() }, contestFor: "College", contestStatus:"Active"
        }).select('potentialParticipants')

        let arr = [];

        for(let elem of contests){
            arr.push({_id: elem._id, count: elem.potentialParticipants.length})
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