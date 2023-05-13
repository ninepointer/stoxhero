const GroupDiscussion = require("../../models/Careers/groupDiscussion");
const User = require("../../models/User/userDetailSchema")

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