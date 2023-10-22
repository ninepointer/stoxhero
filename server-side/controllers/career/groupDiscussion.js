const GroupDiscussion = require("../../models/Careers/groupDiscussion");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const whatsAppService = require("../../utils/whatsAppService")
const mediaURL = "https://dmt-trade.s3.amazonaws.com/carousels/WhastAp%20Msg%20Photo/photos/1697228055934Welcome%20to%20the%20world%20of%20Virtual%20Trading%20but%20real%20earning%21.png";
const mediaFileName = 'StoxHero'
const mailSender = require('../../utils/emailService');
const moment = require('moment')
const Portfolio =require('../../models/userPortfolio/UserPortfolio');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const Campaign = require("../../models/campaigns/campaignSchema");
const CareerSchema = require("../../models/Careers/careerSchema");
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const {createUserNotification} = require('../notification/notificationController');


exports.createGroupDiscussion = async(req, res, next)=>{
    // console.log(req.body) // batchID
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

    // console.log("id is ,", id)

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
    // console.log("id is,", id);
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
    user = await User.findOne({mobile: career.mobileNo}).select('_id');
    if(user){
      const existinggds = await GroupDiscussion.find({'participants.user': user._id});
      // console.log('existing gds', existinggds);
      const batchesArr = await Promise.all(existinggds.map((elem)=>{
        return Batch.findById(elem.batch).select('_id career batchStartDate batchEndDate') 
      }));
      const careersArr = await Promise.all(batchesArr.map((elem)=>{
        return CareerSchema.findById(elem.career).select('_id listingType')
      }));
    
      if (existinggds.length >0 && 
        checkForListingMatch(careersArr, careerListing.listingType) && 
        checkForTimingMatch(batchesArr, currentBatch.batchStartDate, currentBatch.batchEndDate )){
        return res.status(400).json({status:'error', message: 'User is already in another overlapping Group Discussion'});
      }
    }

    const {campaignCode, mobileNo, email,first_name, last_name} = career;
    const  campaign = await Campaign.findOne({campaignCode: campaignCode});
    gd.participants = [...gd.participants, {user: user._id, attended: false, status: 'Shortlisted', college: collegeId}]
    // console.log(gd.participants);
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
  // console.log('marking');
  const userId = req.params.userId;
  const gdId = req.params.gdId;
  const{attended} = req.body;
  // console.log(attended);
  try {
    const gd = await GroupDiscussion.findById(gdId);
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
    const career = await CareerSchema.findById(currentbatch.career).select('_id jobTitle listingType');
    let user = await User.findById(userId);
    if(gd.participants.filter((item)=>item.user==userId)[0].attended == false){
      return res.status(203).json({status:'error', message: 'Can\'t select participant without attendance'});
    }
    const existingUserBatches = await Batch.find({'participants.user': userId}).populate('career', 'listingType');
    const filteredExistingUserBatches = existingUserBatches.filter((elem)=>elem.career.listingType == career.listingType);
    const careersArr = await Promise.all(filteredExistingUserBatches.map((elem)=>{
      return CareerSchema.findById(elem.career).select('_id listingType')
    }));

    if(existingUserBatches.length >0 && 
      checkForListingMatch(careersArr, career.listingType) && 
      checkForTimingMatch(filteredExistingUserBatches, currentbatch.batchStartDate, currentbatch.batchEndDate)){
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

    await user.save({validateBeforeSave: false});

    const portfolio = await Portfolio.findById(batch.portfolio);
    portfolio.users = [...portfolio.users, {userId: user._id, linkedOn: new Date(), portfolioValue: 1000000}]
    await portfolio.save({validateBeforeSave: false});
    const jobTitle = await Batch.findById(gd.batch).populate('career', 'jobTitle listingType').select('jobTitle listingType');
 
    //Candidate gets selection email
    const message = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Internship Details - StoxHero</title>
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
        <p>Congratulations ${user.first_name},</p>
        <p>Your have been selected for the ${jobTitle.career.listingType == 'Job' ? 'Internship' : ''} role of ${jobTitle.career.jobTitle} with StoxHero.</p>
        
        <h1>Internship Details</h1>
        
        <p>Batch Name: ${batch.batchName}</p>
        <p>Batch Starts On: ${moment.utc(batch?.batchStartDate).utcOffset('+05:30').format("DD-MMM-YY")}</p>
        <p>Batch Ends On: ${moment.utc(batch?.batchEndDate).utcOffset('+05:30').format("DD-MMM-YY")}</p>

        <h1>Orientation Details</h1>
        <p>Orientation Date: ${moment.utc(batch?.orientationDate).utcOffset('+05:30').format("DD-MMM-YY")}</p>
        <p>Orientation Time: ${moment.utc(batch?.orientationDate).utcOffset('+05:30').format("HH:mm a")}</p>
        <p>Orientation Meet Link: ${batch.orientationMeetingLink}</p>

        <p>Please Login with your mobile number and start your journey with StoxHero</p>
        <p>If you did not apply for the position, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Team StoxHero</p>
        </div>
    </body>
    </html>
`
    if(process.env.PROD == 'true'){
    await mailSender(user.email, 'Congratulations! You\'re selected for the internship.', message);
    }

    await createUserNotification({
      title:'Selected for Internship',
      description:`Your profile is selected for Internship - Batch Name : ${batch.batchName}, batch starts : ${moment.utc(batch?.batchStartDate).utcOffset('+05:30').format("DD-MMM hh:mm a")}.`,
      notificationType:'Individual',
      notificationCategory:'Informational',
      productCategory:'Internship',
      user: user?._id,
      priority:'High',
      channels:['App', 'Email'],
      createdBy:'63ecbc570302e7cf0153370c',
      lastModifiedBy:'63ecbc570302e7cf0153370c'  
    });
   
    if(process.env.PROD == 'true'){
      whatsAppService.sendWhatsApp({
          destination : user?.mobile, 
          campaignName : 'intern_batch_start_campaign', 
          userName : user.first_name, 
          source : user.creationProcess, 
          media : {url : mediaURL, filename : mediaFileName}, 
          templateParams : 
            [ 
              user.first_name, 
              career.jobTitle, 
              batch.batchName, 
              moment.utc(batch?.batchStartDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
              moment.utc(batch?.batchEndDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
              moment.utc(batch?.orientationDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
              gd.meetLink
            ], 
            tags : '', 
            attributes : ''
          });
    }
    else {
      // whatsAppService.sendWhatsApp({
      //   destination : '8076284368', 
      //   campaignName : 'internship_start_campaign', 
      //   userName : user.first_name, 
      //   source : user.creationProcess, 
      //   media : {url : mediaURL, filename : mediaFileName}, 
      //   templateParams : 
      //     [ 
      //       user.first_name, 
      //       career.jobTitle, 
      //       batch.batchName, 
      //       moment.utc(batch?.batchStartDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
      //       moment.utc(batch?.batchEndDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
      //       moment.utc(gd.gdStartDate).utcOffset('+05:30').format("DD-MMM hh:mm a"), 
      //       gd.meetLink
      //     ], 
      //     tags : '', 
      //     attributes : ''
      //   });
      whatsAppService.sendWhatsApp({
        destination : '9319671094', 
        campaignName : 'intern_batch_start_campaign', 
        userName : user.first_name, 
        source : user.creationProcess, 
        media : {url : mediaURL, filename : mediaFileName}, 
        templateParams : 
          [ 
            user.first_name, 
            career.jobTitle, 
            batch.batchName, 
            moment.utc(batch?.batchStartDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
            moment.utc(batch?.batchEndDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
            moment.utc(batch?.orientationDate).utcOffset('+05:30').format("DD-MMM hh:mm a"),
            gd.meetLink
          ], 
          tags : '', 
          attributes : ''
        });
    }
    //send success response
    res.status(200).json({status: 'success', message: user.first_name + ' selected for batch & WhatsApp & email sent to him @ ' + user.mobile + ' & ' + user.email});

  } catch (e) {
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }
}

exports.getGdsByCareer = async(req, res, next) => {

  const {careerId} = req.params;
  // console.log(careerId);
  try{
    const batches = await Batch.find({career: careerId});
    if(batches.length == 0){
      return res.status(200).json({status: 'success', message:'No batches found with this career'});
    }
  
    const batchIds = batches.map((batch)=>batch._id);
    // console.log('batchIds', batchIds);
  
    const gds = await GroupDiscussion.find({batch: {$in:batchIds} });
    // console.log('gds', gds);
    if(gds.length == 0){
      return res.status(200).json({status: 'success', message:'No gds found with this career'});
    }

    // console.log(gds)
    res.status(200).json({status:'success', data: gds, results:gds.count});

  }catch(e){
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});

  }

}

exports.removeUserFromGD = async(req, res, next)=>{
  const{gdId, userId} = req.params;
try {
    const gd = await GroupDiscussion.findById(gdId).populate('batch', 'career');
    gd.participants = gd.participants.filter((item)=>item.user != userId);
    const user = await User.findById(userId).select('_id email');
    const careerApplicant = await CareerApplication.findOne({mobileNo: user.mobile, career:gd.batch.career});
    
    // Checking careerApplicant
    if (!careerApplicant) {
        console.log('No career application found for this email.');
    } else {
     
        careerApplicant.applicationStatus = 'Applied';
        
        
        try {
            await careerApplicant.save({ validateBeforeSave: false});
        } catch (err) {
            console.log('Error saving careerApplicant:', err);
        }
    }
    
    await gd.save({validateBeforeSave: false});
  
    res.status(204).json({status:'success', message:'Removed from GD'});
} catch(e) {
    console.log(e);
    res.status(500).json({status: 'error', message:'Something went wrong.'})
}


}