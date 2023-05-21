const { ObjectId } = require("mongodb");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const moment = require('moment');
const GroupDiscussion = require('../../models/Careers/groupDiscussion');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");


exports.createBatch = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{batchName, batchStartDate, batchEndDate, 
        batchStatus, career, portfolio } = req.body;

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
    splittingDate = batchStartDate.toString().split("T")[0]
    const batchID = month.toUpperCase() + splittingDate.toString().split("-")[2]+splittingDate.toString().split("-")[0]
    // console.log(month.toUpperCase());
    if(await Batch.findOne({batchName})) return res.status(400).json({message:'This batch already exists.'});

    const batch = await Batch.create({batchID, batchName, batchStartDate, batchEndDate,
        batchStatus, createdBy: req.user._id, lastModifiedBy: req.user._id, career, portfolio});
    
    res.status(201).json({message: 'Batch successfully created.', data:batch});

}

exports.getBatches = async(req, res, next)=>{
    try{
        const batch = await Batch.find({status: "Active"})
        .populate('career','jobTitle')
        .populate('portfolio','portfolioName portfolioValue');
        res.status(201).json({status: 'success', data: batch, results: batch.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getBatch = async(req, res, next)=>{
    const id = req.params.id;
    try{
        const batch = await Batch.findOne({_id:id})
        .populate('career','jobTitle')
        .populate('portfolio','portfolioName portfolioValue');
        res.status(201).json({status: 'success', data: batch});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getActiveBatches = async(req, res, next)=>{
    console.log("inside ActiveBatches")
    try {
        const batch = await Batch.find({ batchEndDate: { $gte: new Date() }, batchStatus: 'Active' })
                                .populate('career','jobTitle')
                                .populate('portfolio','portfolioName portfolioValue');; 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }      
};

exports.getCompletedBatches = async(req, res, next)=>{
    console.log("inside CompletedBatches")
    try {
        const batch = await Batch.find({ batchEndDate: { $lt: new Date() }, batchStatus: 'Active' })
                                .populate('career','jobTitle')
                                .populate('portfolio','portfolioName portfolioValue');; 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        console.log(batch)
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }      
};

exports.getInactiveBatches = async(req, res, next)=>{
    console.log("inside InactiveBatches")
    try {
        const batch = await Batch.find({ batchStatus: 'Inactive' })
                                .populate('career','jobTitle')
                                .populate('portfolio','portfolioName portfolioValue');; 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        console.log(batch)
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
            career: req.body.career,
            portfolio: req.body.portfolio,
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

exports.getBatchParticipants = async(req,res,next) => {
    const {id} = req.params;
    
    try{
        const batch = await Batch.findOne({_id: id}).select('participants').
                        populate('participants.user', 'email mobile first_name last_name').
                        populate('participants.college', 'collegeName');
        res.status(200).json({status:'success', data: batch});
    }catch(e){
        console.log(e);
        return res.status(500).json({status:'error', message:'Something went wrong'})
    }
}

exports.removeParticipantFromBatch = async(req, res, next) => {
    const {batchId, userId} = req.params;
    try{
        const batch = await Batch.findOne({_id: batchId}).select('participants');
        if(batch.participants.length == 0){
            return res.status(404).json({status:'error', message: 'No participants in this batch.'});
        }
        let participants = batch.participants.filter((item)=>item.user!=userId);
        batch.participants = [...participants];
        await batch.save({validateBeforeSave: false});

        //Find all gds with the batch id
        const gds = await GroupDiscussion.find({batch: batchId});

        for(gd of gds){
            gd.participants = gd.participants.map((elem)=>{
                if(elem.user == userId){
                    return {
                        user: elem.user,
                        attended: elem.attended,
                        status:'Shortlisted',
                        college: elem.college,
                        _id: elem._id
                    }
                }else{
                    return {
                        user: elem.user,
                        attended: elem.attended,
                        status:elem.status,
                        college: elem.college,
                        _id: elem._id
                    }
                }
            });
            await gd.save({validateBeforeSave: false});
        }

        //Find the user in career application
        const user = await User.findById(userId).select('email');
        const careerApplicant = await CareerApplication.findOne({email: user.email});
        careerApplicant.applicationStatus = 'Applied';
        await careerApplicant.save({validateBeforeSave: false});

        res.status(200).json({status: 'success', message:'Participant removed from batch'});

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'error', message:'Something went wrong'})
    }
}