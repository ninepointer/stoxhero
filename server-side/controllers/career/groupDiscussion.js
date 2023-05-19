const GroupDiscussion = require("../../models/Careers/groupDiscussion");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const mailSender = require('../../utils/emailService');
const Portfolio =require('../../models/userPortfolio/UserPortfolio');

exports.createGroupDiscussion = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{gdTitle, gdTopic, gdStartDate, 
        gdEndDate, meetLink, status, careerId, batchId } = req.body;

    if(await GroupDiscussion.findOne({gdTitle})) return res.status(400).json({message:'This group discussion already exists.'});

    const gd = await GroupDiscussion.create({gdTitle, gdTopic, gdStartDate, gdEndDate, meetLink, 
        status, createdBy: req.user._id, lastModifiedBy: req.user._id, careerId, batchId});
    
    res.status(201).json({message: 'GroupDiscussion successfully created.', data:gd});

}

exports.getGroupDiscussion = async(req, res, next)=>{
    try{
        const gd = await GroupDiscussion.find({status: "Active"});
        res.status(201).json({status: 'success', data: gd, results: gd.length});    
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
            careerId: req.body.careerId,
            batchId: req.body.batchId,
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
    const gd = await GroupDiscussion.findById(gdId);
    gd.participants = [...gd.participants, {user: userId, attended: false, status: 'Shortlisted', college: collegeId}]
    await gd.save({validateBeforeSave: false});

    res.status(200).json({status:'success', message: 'User added to gd'});
  }catch(e){
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }

}

exports.markAttendance = async(req,res, next) => {
  
  const userId = req.params.userId;
  const gdId = req.params.gdId;
  const{attended} = req.body;
  try {
    const gd = await GroupDiscussion.findById(gdId);
    let participants = gd.participants.filter((item)=>item.user != userId)
    gd.participants = [...participants, {user:userId, attended: req.body, status: 'Shortlisted'}]
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
    let participants = gd.participants.map((item)=>{
      if(item.user == userId){
        return{
          user: userId,
          status: 'Selected',
          attended: item.attended
        }
      }else{
        if(item.status != 'Selected'){
          return{
            user: item.user,
            status: 'Rejected',
            attended: item.attended
          }
        }else{
          return{
            user: item.user,
            status: 'Selected',
            attended: item.attended
          }
        }
      }
    });

    gd.participants = [...participants];
    await gd.save({validateBeforeSave: false});    
    
    
    //Add user to batch
    const batch = await Batch.findById(gd.batchId);
    
    batch.participants = [...batch.participants, {user: userId, college: collegeId, joiningDate: new Date()}];
    
    await batch.save({validateBeforeSave: false});
    
    //Add batch info to the user's document
    
    const user = await User.findById(userId);
    user.internshipBatch = gd.batchId;
    
    //Give user the intern portfolio
    // user.portfolio = [...user.portfolio, {portfolioId: batch.portfolio, activationDate: new Date()}]
    await user.save({validateBeforeSave: false});
    const portfolio = await Portfolio.findById(batch.portfolio);
    portfolio.users = [...portfolio.users, {userId: userId, linkedOn: new Date(), portfolioValue: 1000000}]
    await portfolio.save();
    const jobTitle = await Batch.findById(gd.batchId).populate('careerId', 'jobTitle').select('careerId');
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