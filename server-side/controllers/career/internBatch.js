const { ObjectId } = require("mongodb");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");


exports.createBatch = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{batchName, batchStartDate, batchEndDate, 
        batchStatus, batchLimit, careerId } = req.body;

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
    splittingDate = batchStartDate.toString().split("T")[0]
    const batchID = month.toUpperCase() + splittingDate.toString().split("-")[2]+splittingDate.toString().split("-")[0]
    // console.log(month.toUpperCase());
    if(await Batch.findOne({batchName})) return res.status(400).json({message:'This batch already exists.'});

    const batch = await Batch.create({batchID, batchName, batchStartDate, batchEndDate,
        batchStatus, batchLimit, createdBy: req.user._id, lastModifiedBy: req.user._id, careerId});
    
    res.status(201).json({message: 'Batch successfully created.', data:batch});

}

exports.getBatch = async(req, res, next)=>{
    try{
        const batch = await Batch.find({status: "Active"});
        res.status(201).json({status: 'success', data: batch, results: batch.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getActiveBatch = async(req, res, next)=>{
    console.log("inside ActiveContest")
    try {
        const batch = await Batch.find({ batchEndDate: { $gte: new Date() }, status: 'Active' }); 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }      
};

exports.editBatch = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)

    const batch = await Batch.findOneAndUpdate({_id : id}, {
        $set:{
            batchName: req.body.batchName,
            batchStartDate: req.body.batchStartDate,
            batchEndDate: req.body.batchEndDate,
            batchStatus: req.body.batchStatus,
            batchLimit: req.body.batchLimit,
            careerId: req.body.careerId,
            lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    })

    res.status(200).json({message: 'Successfully edited batch.'});
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
      const batch = await Batch.findOne({ _id: id, status: "Active" });
      if (!batch) {
        return res.status(404).json({ message: "Batch not found or not active." });
      }
    //   const updatedUser = await User.findOneAndUpdate(
    //     { _id: userId },
    //     { $set: { isAlgoTrader: true } },
    //     { new: true }
    //   );
      const updatedBatch = await Batch.findOneAndUpdate(
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

exports.deleteBatch = async(req, res, next) => {
    const id = req.params.id;

    const result = await Batch.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
}