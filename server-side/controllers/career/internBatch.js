const { ObjectId } = require("mongodb");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const moment = require('moment');
const GroupDiscussion = require('../../models/Careers/groupDiscussion');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const Portfolio = require('../../models/userPortfolio/UserPortfolio');
const InternshipOrders = require('../../models/mock-trade/internshipTrade')


exports.createBatch = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{batchName, batchStartDate, batchEndDate, 
        batchStatus, career, portfolio, payoutPercentage, attendancePercentage, refferalCount } = req.body;

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
    splittingDate = batchStartDate.toString().split("T")[0]
    const batchID = month.toUpperCase() + splittingDate.toString().split("-")[2]+splittingDate.toString().split("-")[0]
    // console.log(month.toUpperCase());
    if(await Batch.findOne({batchName})) return res.status(400).json({message:'This batch already exists.'});

    const batch = await Batch.create({batchID, batchName:batchName.trim(), batchStartDate, batchEndDate,
        batchStatus, createdBy: req.user._id, lastModifiedBy: req.user._id, career, portfolio, payoutPercentage, attendancePercentage, referralCount});
    
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
    console.log("Batch Data:",req.body)

    const batch = await Batch.findOneAndUpdate({_id : id}, {
        $set:{
            batchName: req.body.batchName,
            batchStartDate: req.body.batchStartDate,
            batchEndDate: req.body.batchEndDate,
            batchStatus: req.body.batchStatus,
            career: req.body.career,
            portfolio: req.body.portfolio,
            payoutPercentage: req.body.payoutPercentage,
            attendancePercentage: req.body.attendancePercentage,
            referralCount: req.body.referralCount,
            lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    })
    const updatedBatch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log()
    res.status(200).json({data:updatedBatch ,message: 'Successfully edited batch.'});
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
        const batch = await Batch.findOne({_id: batchId}).select('participants portfolio');
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
        const user = await User.findById(userId).select('email internshipBatch');
        console.log('batchId', batchId, batch?.portfolio);
        const portfolio = await Portfolio.findOne({_id: batch?.portfolio});
        console.log(portfolio);
        portfolio.users = portfolio.users.filter((user)=>user?.userId != userId);
        await portfolio.save({validateBeforeSave: false});
        console.log(user.internshipBatch.filter((item)=>item!=batchId));
        user.internshipBatch = user.internshipBatch.filter((item)=>item!=batchId);
        console.log(user.internshipBatch);
        const careerApplicant = await CareerApplication.findOne({email: user.email});
        careerApplicant.applicationStatus = 'Shortlisted';
        await user.save({validateBeforeSave: false});
        await careerApplicant.save({validateBeforeSave: false});

        res.status(200).json({status: 'success', message:'Participant removed from batch'});

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'error', message:'Something went wrong'})
    }
}

exports.getAllInternshipOrders = async(req, res, next)=>{
    console.log("Inside Internship all orders API")
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await InternshipOrders.countDocuments()
    try{
        const allinternshiporders = await InternshipOrders.find()
        .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
        console.log("All Internship Orders",allinternshiporders)
        res.status(201).json({status: 'success', data: allinternshiporders, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getTodaysInternshipOrders = async (req, res, next) => {
  
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await InternshipOrders.countDocuments({trade_time: {$gte:today}})
    console.log("Under today orders", today)
    try {
      const todaysinternshiporders = await InternshipOrders.find({trade_time: {$gte:today}}, {'trader':1,'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
        .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
      console.log(todaysinternshiporders)
      res.status(200).json({status: 'success', data: todaysinternshiporders, count:count});
    } catch (e) {
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong'});
    }
  }

  exports.getCurrentBatch = async(req,res,next) =>{
    console.log('current');
    const userId = req.user._id;
    const userBatches = await User.findById(userId)
    .populate({
        path: 'internshipBatch',
        model: 'intern-batch',
        select:'career batchName batchStartDate batchEndDate attendancePercentage payoutPercentage referralCount',
        populate: {
            path: 'career',
            model: 'career',
            select:'listingType jobTitle'
        },
        // populate: {
        //     path: 'portfolio',
        //     model: 'user-portfolio',
        //     select:'portfolioValue'
        // }
    })
    .populate({
        path: 'internshipBatch',
        model: 'intern-batch',
        select:'career batchName batchStartDate batchEndDate attendancePercentage payoutPercentage referralCount portfolio',
        populate: {
            path: 'portfolio',
            model: 'user-portfolio',
            select:'portfolioValue'
        },
        // populate: {
        //     path: 'portfolio',
        //     model: 'user-portfolio',
        //     select:'portfolioValue'
        // }
    }).select('internshipBatch');
    let internships = userBatches?.internshipBatch?.filter((item)=>item?.career?.listingType === 'Job');
    if(new Date()>=internships[internships.length-1]?.batchStartDate && new Date()<=internships[internships.length-1]?.batchEndDate){
        return res.json({status: 'success', data: internships[internships.length-1]});    
    }
    console.log("Internship Details:",internships, new Date(), internships[internships.length-1]?.batchStartDate, internships[internships.length-1]?.batchEndDate)
    console.log("Condition:",new Date()<=internships[internships.length-1]?.batchStartDate && new Date()>=internships[internships.length-1]?.batchEndDate );
    return res.json({status: 'success', data: {}, message:'No active internships'});
  }

  exports.getWorkshops = async(req,res,next) =>{
    console.log('current');
    const userId = req.user._id;
    const userBatches = await User.findById(userId)
    .populate({
        path: 'internshipBatch',
        model: 'intern-batch',
        select:'career batchStartDate batchEndDate',
        populate: {
            path: 'career',
            model: 'career',
            select:'listingType jobTitle'
        }
    }).select('internshipBatch');
    let workshops = userBatches.internshipBatch.filter((item)=>item?.career?.listingType == 'Workshop');
    res.json({status: 'success', data: workshops});
  }

  exports.getCurrentWorkshop = async(req,res,next) =>{
    console.log('current');
    const userId = req.user._id;
    const userBatches = await User.findById(userId)
    .populate({
        path: 'internshipBatch',
        model: 'intern-batch',
        select:'career batchStartDate batchEndDate',
        populate: {
            path: 'career',
            model: 'career',
            select:'listingType jobTitle'
        }
    }).select('internshipBatch');
    let internships = userBatches.internshipBatch.filter((item)=>item?.career?.listingType == 'Workshop');
    // console.log("userBatches", userBatches);
    if(new Date().toISOString().substring(0,10) <= internships[internships.length-1]?.batchEndDate.toISOString().substring(0,10)){
        return res.json({status: 'success', data: {}, message:'No active workshops'});    
    }
    res.json({status: 'success', data: internships[internships.length-1]});
  }
  
  