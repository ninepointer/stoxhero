const GroupDiscussion = require("../../models/Careers/groupDiscussion");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");

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
  try{
    const gd = await GroupDiscussion.findById(gdId);
    gd.participants = [...gd.participants, {user: userId, attended: false, status: 'Shortlisted'}]
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

    //TODOs:

    //Candidate gets selection email

    //Add user to batch
    const batch = await Batch.findById(gd.batchId);

    batch.participants = [...batch.participants, userId];

    await batch.save({validateBeforeSave: false});

    //Change the user role to intern


    //Give user the intern portfolio

    //send success response
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({status:'error', message: 'Something went wrong.'});
  }
}