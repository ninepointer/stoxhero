const GroupDiscussion = require("../../models/Careers/groupDiscussion");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const mailSender = require('../../utils/emailService');
const Portfolio =require('../../models/userPortfolio/UserPortfolio');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const Campaign = require("../../models/campaigns/campaignSchema");
const CareerSchema = require("../../models/Careers/careerSchema");

exports.createGroupDiscussion = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{gdTitle, gdTopic, gdStartDate, 
        gdEndDate, meetLink, batch } = req.body;

    if(await GroupDiscussion.findOne({gdStartDate : gdStartDate, batch: batch})) return res.status(400).json({message:'This group discussion already exists.'});

    const gd = await GroupDiscussion.create({gdTitle: gdTitle.trim(), gdTopic:gdTopic.trim(), gdStartDate, gdEndDate, meetLink: meetLink.trim(), 
        createdBy: req.user._id, lastModifiedBy: req.user._id, batch});
    
    res.status(201).json({message: 'GroupDiscussion successfully created.', data:gd});

}

exports.getGroupDiscussions = async(req, res, next)=>{
    try{
        const gd = await GroupDiscussion.find({status: "Active"});
        res.status(201).json({status: 'success', data: gd, results: gd.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getGroupDiscussion = async(req, res, next)=>{
  const id = req.params.id;
  try{
      const gd = await GroupDiscussion.find({_id: id}).populate('participants.user', 'first_name last_name mobile email').populate('participants.college', 'collegeName');
      res.status(200).json({status: 'success', data: gd});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getBatchGroupDiscussion = async(req, res, next)=>{
  const id = req.params.id;
  try{
      const gd = await GroupDiscussion.find({batch: id});
      res.status(201).json({status: 'success', data: gd, count:gd.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.editGroupDiscussion = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)

    const gd = await GroupDiscussion.findOneAndUpdate({_id : id}, {
        $set:{
            gdTitle: req.body.gdTitle,
            gdTopic: req.body.gdTopic,
            gdStartDate: req.body.gdStartDate,
            gdEndDate: req.body.gdEndDate,
            meetLink: req.body.meetLink,
            status: req.body.status,
            career: req.body.careerId,
            batch: req.body.batchId,
            lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    }, {new: true})

    res.status(200).json({message: 'Successfully edited group discussion.', data: gd});
}

exports.approveUser = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.body.userId;
    console.log("id is,", id);
    try {
      const user = await User.findById(new ObjectId(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const batch = await GroupDiscussion.findOne({ _id: id, status: "Active" });
      if (!batch) {
        return res.status(404).json({ message: "GroupDiscussion not found or not active." });
      }

      const updatedGroupDiscussion = await GroupDiscussion.findOneAndUpdate(
        { _id: id },
        { $push: { participants: userId } },
        { new: true }
      );
      res.status(200).json({ message: "User approved." });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: "error", message: "Something went wrong." });
    }
};

exports.deleteGroupDiscussion = async(req, res, next) => {
  const id = req.params.id;

  const result = await GroupDiscussion.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
  return res.status(404).json({ message: "GroupDiscussion not found" });
  }

  res.status(200).json({ message: "GroupDiscussion deleted successfully" });
}

exports.addUserToGd = async(req, res, next) => {
  const userId = req.params.userId;
  const gdId = req.params.gdId;
  const {collegeId} = req.body;
  try{
    let user;
    const gd = await GroupDiscussion.findById(gdId);
    const currentBatch = await Batch.findById(gd.batch).select('_id career batchStartDate, batchEndDate');
    const careerListing = await CareerSchema.findById(currentBatch.career);
    const career = await CareerApplication.findById(userId).select('email _id applicationStatus campaignCode mobileNo first_name last_name');
    user = await User.findOne({email: career.email}).select('_id');
    if(user){
      const existinggds = await GroupDiscussion.find({'participants.user': user._id});
      const batchesArr = existinggds.map(async(elem)=>{
        return await Batch.findById(elem.batch).select('_id career batchStartDate batchEndDate') 
      });
      const careersArr = batchesArr.map(async(elem)=>{
        return await CareerSchema.findById(elem.career).select('_id listingType')
      });
      if (existinggds.length >0 && 
        checkForListingMatch(careersArr, careerListing.listingType) && 
        checkForTimingMatch(batchesArr, currentBatch.batchStartDate, currentBatch.batchEndDate )){
        return res.status(400).json({status:'error', message: 'User is already in another overlapping Group Discussion'});
      }
    }
    console.log('existing gds');
    console.log('user is', user);
    console.log('college is', collegeId);
    const {campaignCode, mobileNo, email,first_name, last_name} = career;
    const  campaign = await Campaign.findOne({campaignCode: campaignCode});
    if(!user){
      //create the user
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
      const userId = email.split('@')[0]
      const userIds = await User.find({employeeid:userId})
      console.log("User Ids: ",userIds)
        if(userIds.length > 0){
            userId = userId.toString()+(userIds.length+1).toString()
        }
    
      const activeFreePortfolios = await Portfolio.find({status: "Active", portfolioAccount: "Free"});
      let portfolioArr = [];
      for (const portfolio of activeFreePortfolios) {
          let obj = {};
          obj.portfolioId = portfolio._id;
          obj.activationDate = new Date();
          portfolioArr.push(obj);
      }
    
      try{
        let obj = {
            first_name : first_name.trim(), 
            last_name : last_name.trim(), 
            designation: 'Trader', 
            email : email.trim(), 
            mobile : mobileNo.trim(),
            name: first_name.trim() + ' ' + last_name.trim().substring(0,1), 
            password: 'sh' + last_name.trim() + '@123' + mobileNo.trim().slice(1,3), 
            status: 'Active', 
            employeeid: userId, 
            creationProcess: 'Career SignUp',
            joining_date:new Date(),
            myReferralCode:(await myReferralCode).toString(), 
            portfolio: portfolioArr,
            campaign: campaign && campaign._id,
            campaignCode: campaign && campaignCode,
        }
    
            const newuser = await User.create(obj);
            if(newuser){
              user = newuser;
            }
            const idOfUser = newuser._id;
    
            for (const portfolio of activeFreePortfolios) {
              const portfolioValue = portfolio.portfolioValue;
              
              await Portfolio.findByIdAndUpdate(
                  portfolio._id,
                  { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
                  );
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
    
            await UserWallet.create(
              {
                  userId: newuser._id,
                  createdOn: new Date(),
                  createdBy:newuser._id
            })
    
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
                        <p>Password: <span class="password">sh${newuser.last_name.trim()}@123${newuser.mobile.slice(1,3)}</span></p>
                        <p>Please use these credentials to log in to our website:</p>
                        <a href="https://www.stoxhero.com/" class="login-button">Log In</a>
                        </div>
                    </body>
                    </html>
    
                `
                // mailSender(newuser.email,subject,message);
      }catch(e){
        console.log(e);
      }
    }
    gd.participants = [...gd.participants, {user: user._id, attended: false, status: 'Shortlisted', college: collegeId}]
    console.log(gd.participants);
    await gd.save({validateBeforeSave: false});
    career.applicationStatus = 'Shortlisted';
    await career.save({validateBeforeSave: false});
    res.status(200).json({status:'success', message: 'User added to gd'});
  }catch(e){
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }

}
const checkForListingMatch = (arr, type) => {
  for(elem of arr){
    if(elem.listingType == type){
      return true
    }
  }
  return false;
}
const checkForTimingMatch = (arr, startTime, endTime) => {
  for(elem of arr){
    if(elem.batchStartDate < endTime && elem.batchEndDate > startTime){
      return true
    }
  }
  return false;
}

exports.markAttendance = async(req,res, next) => {
  console.log('marking');
  const userId = req.params.userId;
  const gdId = req.params.gdId;
  const{attended} = req.body;
  console.log(attended);
  try {
    const gd = await GroupDiscussion.findById(gdId);
    // const career = await CareerApplication.findById(userId).select('email _id applicationStatus');
    // console.log('career', career)
    // const user = await User.findOne({_id: userId}).select('_id');
    // let participants = gd.participants.filter((item)=>item.user != userId)
    // gd.participants = [...participants, {user:user._id, attended, status: 'Shortlisted'}]
    for (participant of gd.participants){
      if (participant.user == userId){
        participant.attended = attended
      }
    }
    await gd.save({validateBeforeSave: false});
    res.status(200).json({status:'success', message: 'Attendance marked'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }
}

exports.selectCandidate = async (req, res, next) => {
  const userId = req.params.userId;
  const gdId = req.params.gdId;
  const{collegeId} = req.body;

  try {
    const gd = await GroupDiscussion.findById(gdId);
    const currentbatch = await Batch.findById(gd.batch).select('_id career batchStartDate batchEndDate');
    const career = await CareerSchema.findById(currentbatch.career).select('_id listingType');
    const user = await User.findById(userId);
    if(gd.participants.filter((item)=>item.user==userId)[0].attended == false){
      return res.status(203).json({status:'error', message: 'Can\'t select participant without attendance'});
    }
    const existingUserBatches = await Batch.find({'participants.user': userId});
    const careersArr = existingUserBatches.map(async(elem)=>{
      return await CareerSchema.findById(elem.career).select('_id listingType')
    });

    if(existingUserBatches.length >0 && 
      checkForListingMatch(careersArr, career.listingType) && 
      checkForTimingMatch(existingUserBatches, currentbatch.batchStartDate, currentbatch.batchEndDate)){
      return res.status(203).json({status:'error', message: 'User is already in an internship batch'});
    }
    let participants = gd.participants.map((item)=>{
      if(item.user == userId){
        return{
          user: userId,
          status: 'Selected',
          attended: item.attended,
          college: item.college
        }
      }else{
        if(item.status != 'Selected'){
          return{
            user: item.user,
            status: 'Rejected',
            attended: item.attended,
            college: item.college
          }
        }else{
          return{
            user: item.user,
            status: 'Selected',
            attended: item.attended,
            college: item.college
          }
        }
      }
    });

    gd.participants = [...participants];
    await gd.save({validateBeforeSave: false});    
    
    
    //Add user to batch
    const batch = await Batch.findById(gd.batch);
    
    batch.participants = [...batch.participants, {user: userId, college: collegeId, joiningDate: new Date()}];
    
    await batch.save({validateBeforeSave: false});
    
    //Add batch info to the user's document
    
    user.internshipBatch = [...user.internshipBatch, gd.batch];
    
    //Give user the intern portfolio
    // user.portfolio = [...user.portfolio, {portfolioId: batch.portfolio, activationDate: new Date()}]
    await user.save({validateBeforeSave: false});
    const portfolio = await Portfolio.findById(batch.portfolio);
    portfolio.users = [...portfolio.users, {userId: user._id, linkedOn: new Date(), portfolioValue: 1000000}]
    await portfolio.save({validateBeforeSave: false});
    const jobTitle = await Batch.findById(gd.batch).populate('career', 'jobTitle').select('jobTitle');
    //Candidate gets selection email
    const message = `<!DOCTYPE html>
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
        <p>Congratulations ${user.first_name},</p>
        <p>Your are selected for ${jobTitle.jobTitle}</p>
        <p>Please Login with your credentials and start your journey with StoxHero </p>
        <p>If you did not apply for the position, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Team StoxHero</p>
        </div>
    </body>
    </html>
`
    // await mailSender(user.email, 'Congratulations! You\'re selected for the internship.', message);

    //send success response
    res.status(200).json({status: 'success', message: 'User selected for batch'});

  } catch (e) {
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }
}

exports.getGdsByCareer = async(req, res, next) => {

  const {careerId} = req.params;
  console.log(careerId);
  try{
    const batches = await Batch.find({career: careerId});
    if(batches.length == 0){
      return res.status(200).json({status: 'success', message:'No batches found with this career'});
    }
  
    const batchIds = batches.map((batch)=>batch._id);
    console.log('batchIds', batchIds);
  
    const gds = await GroupDiscussion.find({batch: {$in:batchIds} });
    console.log('gds', gds);
    if(gds.length == 0){
      return res.status(200).json({status: 'success', message:'No gds found with this career'});
    }

    console.log(gds)
    res.status(200).json({status:'success', data: gds, results:gds.count});

  }catch(e){
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});

  }

}

exports.removeUserFromGD = async(req, res, next)=>{
  const{gdId, userId} = req.params;
  try{
    const gd = await GroupDiscussion.findById(gdId);
    gd.participants = gd.participants.filter((item)=>item.user != userId);
    const user = await User.findById(userId).select('_id email');
    const careerApplicant = await CareerApplication.findOne({email: user.email});
    careerApplicant.applicationStatus = 'Applied';
    await careerApplicant.save({validateBeforeSave:false});
    await gd.save({validateBeforeSave: false});
  
    res.status(204).json({status:'success', message:'Removed from GD'});
  }catch(e){
    console.log(e);
    res.status(500).json({status: 'error', message:'Something went wrong.'})
  }

}