const { ObjectId } = require("mongodb");
const Batch = require("../../models/Careers/internBatch");
const User = require("../../models/User/userDetailSchema");
const moment = require('moment');
const GroupDiscussion = require('../../models/Careers/groupDiscussion');
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const Portfolio = require('../../models/userPortfolio/UserPortfolio');
const InternshipOrders = require('../../models/mock-trade/internshipTrade');
const TradingHoliday = require('../../models/TradingHolidays/tradingHolidays');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const path = require('path');
const Holiday = require("../../models/TradingHolidays/tradingHolidays");
const InternTrades = require("../../models/mock-trade/internshipTrade");

exports.createBatch = async(req, res, next)=>{
    // console.log(req.body) // batchID
    const{batchName, batchStartDate, batchEndDate, rewardType, tdsRelief,
        batchStatus, career, portfolio, payoutPercentage, payoutCap,
        attendancePercentage, referralCount, orientationDate, orientationMeetingLink } = req.body;

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
    splittingDate = batchStartDate.toString().split("T")[0]
    const batchID = month.toUpperCase() + splittingDate.toString().split("-")[2]+splittingDate.toString().split("-")[0]
    // console.log(month.toUpperCase());
    if(await Batch.findOne({batchName})) return res.status(400).json({message:'This batch already exists.'});

    const batch = await Batch.create({batchID, batchName:batchName.trim(), batchStartDate, batchEndDate,
        batchStatus, createdBy: req.user._id, lastModifiedBy: req.user._id, career, portfolio, rewardType, tdsRelief, 
        payoutPercentage, payoutCap, attendancePercentage, referralCount, orientationDate, orientationMeetingLink});
    
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
    // console.log("inside ActiveBatches")
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
    // console.log("inside CompletedBatches")
    try {
        const batch = await Batch.find({ batchEndDate: { $lt: new Date() }, batchStatus: 'Completed' })
                                .populate('career','jobTitle')
                                .populate('portfolio','portfolioName portfolioValue');; 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        // console.log(batch)
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }      
};

exports.getInactiveBatches = async(req, res, next)=>{
    // console.log("inside InactiveBatches")
    try {
        const batch = await Batch.find({ batchStatus: 'Inactive' })
                                .populate('career','jobTitle')
                                .populate('portfolio','portfolioName portfolioValue');; 
        res.status(201).json({status: 'success', data: batch, results: batch.length}); 
        // console.log(batch)
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }      
};

exports.editBatch = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    // console.log("Batch Data:",req.body)

    const batch = await Batch.findOneAndUpdate({_id : id}, {
        $set:{
            batchName: req.body.batchName,
            batchStartDate: req.body.batchStartDate,
            batchEndDate: req.body.batchEndDate,
            batchStatus: req.body.batchStatus,
            career: req.body.career,
            portfolio: req.body.portfolio,
            payoutPercentage: req.body.payoutPercentage,
            payoutCap: req.body.payoutCap,
            rewardType: req.body.rewardType,
            tdsRelief: req.body.tdsRelief,
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
    // console.log("id is,", id);
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
        // console.log('batchId', batchId, batch?.portfolio);
        const portfolio = await Portfolio.findOne({_id: batch?.portfolio});
        // console.log(portfolio);
        portfolio.users = portfolio.users.filter((user)=>user?.userId != userId);
        await portfolio.save({validateBeforeSave: false});
        // console.log(user.internshipBatch.filter((item)=>item!=batchId));
        user.internshipBatch = user.internshipBatch.filter((item)=>item!=batchId);
        // console.log(user.internshipBatch);
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
    // console.log("Inside Internship all orders API")
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await InternshipOrders.countDocuments()
    try{
        const allinternshiporders = await InternshipOrders.find()
        .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
        // console.log("All Internship Orders",allinternshiporders)
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
    // console.log("Under today orders", today)
    try {
      const todaysinternshiporders = await InternshipOrders.find({trade_time: {$gte:today}}, {'trader':1,'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
        .populate('trader','employeeid first_name last_name')
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
      // console.log(todaysinternshiporders)
      res.status(200).json({status: 'success', data: todaysinternshiporders, count:count});
    } catch (e) {
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong'});
    }
  }

  exports.collegewiseuser = async (req, res, next) => {
  
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    // console.log("Under today orders", today)
    try {
      const collegeuser = await Batch.aggregate([
        {
          $unwind: "$participants",
        },
        {
          $lookup: {
            from: "intern-trades",
            localField: "participants.user",
            foreignField: "trader",
            as: "tradeData",
          },
        },
        {
          $group: {
            _id: {
              college: "$participants.college",
              hasTradeData: { $cond: { if: { $gt: [{ $size: "$tradeData" }, 0] }, then: true, else: false } },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.college",
            hasTradeDataCounts: {
              $push: {
                hasTradeData: "$_id.hasTradeData",
                count: "$count",
              },
            },
          },
        },
        {
          $lookup: {
            from: "colleges",
            localField: "_id",
            foreignField: "_id",
            as: "college",
          },
        },
        {
          $project: {
            _id: 0,
            college: "$_id",
            collegeName: {
              $arrayElemAt: ["$college.collegeName", 0],
            },
            activeUser: {
              $sum: {
                $map: {
                  input: "$hasTradeDataCounts",
                  as: "entry",
                  in: {
                    $cond: [{ $eq: ["$$entry.hasTradeData", true] }, "$$entry.count", 0],
                  },
                },
              },
            },
            inactiveUser: {
              $sum: {
                $map: {
                  input: "$hasTradeDataCounts",
                  as: "entry",
                  in: {
                    $cond: [{ $eq: ["$$entry.hasTradeData", false] }, "$$entry.count", 0],
                  },
                },
              },
            },
            totalUser: {
              $add: [{
                $sum: {
                  $map: {
                    input: "$hasTradeDataCounts",
                    as: "entry",
                    in: {
                      $cond: [{ $eq: ["$$entry.hasTradeData", true] }, "$$entry.count", 0],
                    },
                  },
                },
              }, {
                $sum: {
                  $map: {
                    input: "$hasTradeDataCounts",
                    as: "entry",
                    in: {
                      $cond: [{ $eq: ["$$entry.hasTradeData", false] }, "$$entry.count", 0],
                    },
                  },
                },
              }],
            },
          },
        },        
        {
          $sort: { totalUser: -1 },
        },
      ])

      res.status(200).json({status: 'success', data: collegeuser});
    } catch (e) {
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong'});
    }
  }

  exports.collegewiseuserPerticularBatch = async (req, res, next) => {
    const {id} = req.params;
    try {
      const collegeuser = await Batch.aggregate([
        {
          $match: {
            _id: new ObjectId(id)
          },
        },
        {
          $unwind: "$participants",
        },
        {
          $lookup: {
            from: "intern-trades",
            localField: "participants.user",
            foreignField: "trader",
            as: "tradeData",
          },
        },
        {
          $group: {
            _id: {
              college: "$participants.college",
              hasTradeData: { $cond: { if: { $gt: [{ $size: "$tradeData" }, 0] }, then: true, else: false } },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.college",
            hasTradeDataCounts: {
              $push: {
                hasTradeData: "$_id.hasTradeData",
                count: "$count",
              },
            },
          },
        },
        {
          $lookup: {
            from: "colleges",
            localField: "_id",
            foreignField: "_id",
            as: "college",
          },
        },
        {
          $project: {
            _id: 0,
            college: "$_id",
            collegeName: {
              $arrayElemAt: ["$college.collegeName", 0],
            },
            activeUser: {
              $sum: {
                $map: {
                  input: "$hasTradeDataCounts",
                  as: "entry",
                  in: {
                    $cond: [{ $eq: ["$$entry.hasTradeData", true] }, "$$entry.count", 0],
                  },
                },
              },
            },
            inactiveUser: {
              $sum: {
                $map: {
                  input: "$hasTradeDataCounts",
                  as: "entry",
                  in: {
                    $cond: [{ $eq: ["$$entry.hasTradeData", false] }, "$$entry.count", 0],
                  },
                },
              },
            },
            totalUser: {
              $add: [{
                $sum: {
                  $map: {
                    input: "$hasTradeDataCounts",
                    as: "entry",
                    in: {
                      $cond: [{ $eq: ["$$entry.hasTradeData", true] }, "$$entry.count", 0],
                    },
                  },
                },
              }, {
                $sum: {
                  $map: {
                    input: "$hasTradeDataCounts",
                    as: "entry",
                    in: {
                      $cond: [{ $eq: ["$$entry.hasTradeData", false] }, "$$entry.count", 0],
                    },
                  },
                },
              }],
            },
          },
        },        
        {
          $sort: { totalUser: -1 },
        },
      ])

      res.status(200).json({status: 'success', data: collegeuser});
    } catch (e) {
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong'});
    }
  }

  exports.getCurrentBatch = async(req,res,next) =>{
    // console.log('current');
   
    const userId = req.user._id;
    const userBatches = await User.findById(userId)
    .populate({
        path: 'internshipBatch',
        model: 'intern-batch',
        select:'career batchName batchStartDate batchEndDate attendancePercentage payoutPercentage referralCount payoutCap',
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
        select:'career batchName batchStartDate batchEndDate attendancePercentage payoutPercentage payoutCap referralCount portfolio',
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
      const intern = JSON.parse(JSON.stringify(internships[internships.length-1]));
      const endDate = new Date();

      const holiday = await Holiday.find({
        holidayDate: {
          $gte: intern.batchStartDate,
          $lte: endDate
        },
        $expr: {
          $and: [
            { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
            { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
          ]
        }
      });
      const workingDays = calculateWorkingDays(intern.batchStartDate, endDate);
      const tradingdays = await tradingDays(userId, intern._id);
      const attendance = ((tradingdays * 100) / (workingDays - holiday.length)).toFixed(2);
      const userReferrals = await User.find({referredBy: new ObjectId(userId)}).select('myReferralCode referrerCode joining_date');
      let refCount = 0;

      if(userReferrals?.length>0){
        for (let subelem of userReferrals) {
          const joiningDate = moment(subelem?.joining_date);
          if (joiningDate.isSameOrAfter(moment(moment(intern?.batchStartDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(moment(moment(intern?.batchEndDate).format("YYYY-MM-DD")))) {
            refCount += 1;
          }
        }
      } else{
        refCount = 0;
      }
      intern.myReferrals = refCount;
      intern.myAttendance = attendance;
      intern.tradingdays = tradingdays;
      intern.workingDays = workingDays;
      
      return res.json({status: 'success', data: intern});    
    }
    // console.log("Internship Details:",internships, new Date(), internships[internships.length-1]?.batchStartDate, internships[internships.length-1]?.batchEndDate)
    // console.log("Condition:",new Date()>=internships[internships.length-1]?.batchStartDate && new Date()<=internships[internships.length-1]?.batchEndDate);
    return res.json({status: 'success', data: {}, message:'No active internships'});
  }

  const tradingDays = async (userId, batchId) => {
    const pipeline =
      [
        {
          $match: {
            batch: new ObjectId(batchId),
            trader: new ObjectId(userId),
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              date: {
                $substr: ["$trade_time", 0, 10],
              },
            },
            count: {
              $count: {},
            },
          },
        },
      ]
  
    let x = await InternTrades.aggregate(pipeline);
  
    return x.length;
  }

  function calculateWorkingDays(startDate, endDate) {
    // Convert the input strings to Date objects
    const start = new Date(startDate);
    let end = new Date(endDate);
    end = end.toISOString().split('T')[0];
    end = new Date(end)
    end.setDate(end.getDate() + 1);
  
    // Check if the start date is after the end date
    if (start > end) {
      return 0;
    }
  
    let workingDays = 0;
    let currentDate = new Date(start);
  
    // Iterate over each day between the start and end dates
    while (currentDate <= end) {
      // Check if the current day is a weekday (Monday to Friday)
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        workingDays++;
      }
  
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return workingDays;
  }
  

  exports.getWorkshops = async(req,res,next) =>{
    // console.log('current');
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
    // console.log('current');
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
    // if(new Date().toISOString().substring(0,10) <= internships[internships.length-1]?.batchEndDate.toISOString().substring(0,10)){
    //     return res.json({status: 'success', data: {}, message:'No active workshops'});    
    // }
    // res.json({status: 'success', data: internships[internships.length-1]});
    if(new Date()>=internships[internships.length-1]?.batchStartDate && new Date()<=internships[internships.length-1]?.batchEndDate){
        return res.json({status: 'success', data: internships[internships.length-1]});    
    }
    // console.log("Internship Details:",internships, new Date(), internships[internships.length-1]?.batchStartDate, internships[internships.length-1]?.batchEndDate)
    // console.log("Condition:",new Date()<=internships[internships.length-1]?.batchStartDate && new Date()>=internships[internships.length-1]?.batchEndDate );
    return res.json({status: 'success', data: {}, message:'No active internships'});
  }

  exports.batchWiseActiveAndInactiveUser = async(req,res,next) =>{
   
    const {id} = req.params;
   
    const activeUserPipe = [
      {
        $match:
          {
            _id: new ObjectId(id),
          },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "intern-trades",
          localField: "participants.user",
          foreignField: "trader",
          as: "tradeData",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $match: {
          $expr: {
            $gt: [
              {
                $size: "$tradeData",
              },
              0,
            ],
          },
        },
      },
      {
        $unwind:
          {
            path: "$tradeData",
          },
      },
      {
        $match: {
          "tradeData.batch": new ObjectId(id),
          "tradeData.status": "COMPLETE"
        },
      },
      {
        $group:
          {
            _id: {
              userId: "$participants.user",
              first_name: {
                $arrayElemAt: [
                  "$userData.first_name",
                  0,
                ],
              },
              last_name: {
                $arrayElemAt: [
                  "$userData.last_name",
                  0,
                ],
              },
              mobile: {
                $arrayElemAt: ["$userData.mobile", 0],
              },
              email: {
                $arrayElemAt: ["$userData.email", 0],
              },
            },
            tradingDays: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$tradeData.trade_time",
                },
              },
            },
          },
      },
      {
        $project:
          {
            _id: 0,
            name: {
              $concat: [
                "$_id.first_name",
                " ",
                "$_id.last_name",
              ],
            },
            email: "$_id.email",
            mobile: "$_id.mobile",
            tradingDays: {
              $size: "$tradingDays",
            },
            userId: "$_id.userId",
          },
      },
      {
        $sort: {
          tradingDays: -1
        }
      }
    ]

    const inactiveUserPipe =   [
      {
        $match:
    
          {
            _id: new ObjectId(id),
          },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "intern-trades",
          localField: "participants.user",
          foreignField: "trader",
          as: "tradeData",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $size: "$tradeData",
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$participants.user",
            first_name: {
              $arrayElemAt: [
                "$userData.first_name",
                0,
              ],
            },
            last_name: {
              $arrayElemAt: [
                "$userData.last_name",
                0,
              ],
            },
            mobile: {
              $arrayElemAt: ["$userData.mobile", 0],
            },
            email: {
              $arrayElemAt: ["$userData.email", 0],
            },
          },
        },
      },
      {
        $project:
          {
            _id: 0,
            name: {
              $concat: [
                "$_id.first_name",
                " ",
                "$_id.last_name",
              ],
            },
            email: "$_id.email",
            mobile: "$_id.mobile",
            userId: "$_id.userId",
          },
      },
    ]

    const active = await Batch.aggregate(activeUserPipe)
    const inactive = await Batch.aggregate(inactiveUserPipe)
  
    return res.json({status: 'success', active: active, inactive: inactive});
  }

  exports.batchAndCollegeWiseUser = async(req,res,next) =>{
   
    const {id, college} = req.params;

    // console.log(id, college)
   
    const userPipe = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $lookup: {
          from: "intern-trades",
          localField: "participants.user",
          foreignField: "trader",
          as: "tradeData",
        },
      },
      {
        $match:
          {
            "participants.college": new ObjectId(
              college
            ),
          },
      },
      {
        $lookup:
          {
            from: "user-personal-details",
            localField: "participants.user",
            foreignField: "_id",
            as: "userData",
          },
      },
      {
        $project:
          {
            first_name: {
              $arrayElemAt: [
                "$userData.first_name",
                0,
              ],
            },
            last_name: {
              $arrayElemAt: [
                "$userData.last_name",
                0,
              ],
            },
            mobile: {
              $arrayElemAt: ["$userData.mobile", 0],
            },
            email: {
              $arrayElemAt: ["$userData.email", 0],
            },
            _id: 0,
            tradeData: {
              $size: "$tradeData"
            }
          },
      },
    ]

    const userData = await Batch.aggregate(userPipe)

    const activeUsers = [];
    const inactiveUsers = [];

    for (const doc of userData) {
      if (doc.tradeData > 0) {
        activeUsers.push(doc);
      } else {
        inactiveUsers.push(doc);
      }
    }
  
    return res.json({status: 'success', active: activeUsers, inactive: inactiveUsers});
  }

exports.getEligibleInternshipBatch = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'internshipBatch',
        select: 'batchName career batchStartDate batchEndDate attendancePercentage',
        populate: {
          path: 'career',
          select: 'listingType'
        }
      });
    if (!user?.internshipBatch || user?.internshipBatch.length == 0) {
      return res.status(200).json({ data: {}, result: 0, message: 'No eligible batches' });
    }

    const batches = user?.internshipBatch;
    const internshipBatches = batches.filter(batch =>
      batch.career.listingType === 'Job' &&
      batch.batchEndDate <= new Date()
    );

    const eligibleBatches = []; // To hold eligible batches

    for (let batch of internshipBatches) {
      const attendanceDocs = await InternshipOrders.aggregate([
        {
          $match: {
            status: "COMPLETE",
            batch: new ObjectId(batch._id),
            trader: new ObjectId(req.user._id)
          },
        },
        {
          $group: {
            _id: 0,
            tradingDays: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$trade_time",
                },
              },
            },
          }
        },
        {
          $project: {
            _id: 0,
            tradingDays: {
              $size: "$tradingDays",
            },
          },
        },
      ]);

      if (attendanceDocs.length == 0) continue; // Go to the next iteration

      const totalMarketDays = await countTradingDays(batch?.batchStartDate, batch?.batchEndDate);
      if ((attendanceDocs[0].tradingDays / totalMarketDays) * 100 > batch?.attendancePercentage - 5) {
        eligibleBatches.push({
          id: batch._id,
          name: batch.batchName,
          startDate: batch?.batchStartDate,
          endDate: batch?.batchEndDate
        });
      }
    }

    if (eligibleBatches.length == 0) {
      return res.status(200).json({ data: internshipBatches, result: 0, message: 'No eligible batches' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Eligible for certificate',
      batches: eligibleBatches
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong.' });
  }
}


exports.downloadCertificate = async (req,res, next) => {
  try {
    // Load the existing PDF into pdf-lib
    const batchId = req.params.id;
    const batch = await Batch.findById(batchId).select('batchStartDate batchEndDate');
    const userId = req.user._id;
    const user = await User.findById(userId).select('first_name last_name');
    const name = `${user.first_name} ${user.last_name}`;
    console.log('this', batch?.batchStartDate);
    const start = moment(batch?.batchStartDate).format('Do MMM YY').toString();
    const end = moment(batch?.batchEndDate).format('Do MMM YY').toString();
    console.log('start and end', start, end, batch?.batchStartDate, batch?.batchEndDate);
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, '/template2.pdf'));
    // console.log(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    //Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Define the coordinates and styling for the text you want to add
    // Note: You'll have to adjust the coordinates based on where you want to place the text in your PDF
    firstPage.drawText(name, {
        x: 300,
        y: 355,
        size: 16
    });
    firstPage.drawText(start, {
        x: 440,
        y: 340,
        size: 14
    });
    firstPage.drawText(end, {
        x: 610,
        y: 340,
        size: 14,
    });
    // console.log(firstPage);
    // Serialize the modified PDF back to bytes
    const pdfBytes = await pdfDoc.save();
    // console.log('file', pdfBytes);
    const filePath = path.join(__dirname, '/certificateout.pdf');
    fs.writeFileSync(filePath, pdfBytes);
    res.download(path.join(__dirname, '/certificateout.pdf'));
    // Send the PDF as a response
    // res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
    // res.setHeader('Content-Type', 'application/pdf');
    // res.send(pdfBytes);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error generating certificate: ' + err.message);
}
}




async function countTradingDays(startDate, endDate) {
  let start = moment(startDate);
  let end = moment(endDate);

  let count = 0;

  // Fetch all holidays from DB
  const holidays = await TradingHoliday.find({
      holidayDate: { $gte: start.toDate(), $lte: end.toDate() },
      isDeleted: false,
  });
  // console.log('holidays', holidays.length);

  // Convert all holiday dates to string format for easy comparison
  const holidayDates = holidays.map(h => moment(h.holidayDate).format('YYYY-MM-DD'));

  for (let m = moment(start); m.isBefore(end); m.add(1, 'days')) {
      if (m.isoWeekday() <= 5 && !holidayDates.includes(m.format('YYYY-MM-DD'))) { // Monday to Friday are considered trading days
          count++;
      }
  }

  return count;
}




  // [
  //   {
  //     $match: {
  //       _id: ObjectId("646f5295035caf88a30dd5da"),
  //     },
  //   },
  //   {
  //     $unwind: "$participants",
  //   },
  //   {
  //     $lookup: {
  //       from: "intern-trades",
  //       localField: "participants.user",
  //       foreignField: "trader",
  //       as: "tradeData",
  //     },
  //   },
  //   {
  //     $match:
  //       {
  //         "participants.college": ObjectId(
  //           "64708c99ae1d4cffe2779742"
  //         ),
  //       },
  //   },
  //   {
  //     $lookup:
  //       {
  //         from: "user-personal-details",
  //         localField: "participants.user",
  //         foreignField: "_id",
  //         as: "userData",
  //       },
  //   },
  //   {
  //     $project:
  //       {
  //         first_name: {
  //           $arrayElemAt: [
  //             "$userData.first_name",
  //             0,
  //           ],
  //         },
  //         last_name: {
  //           $arrayElemAt: [
  //             "$userData.last_name",
  //             0,
  //           ],
  //         },
  //         mobile: {
  //           $arrayElemAt: ["$userData.mobile", 0],
  //         },
  //         email: {
  //           $arrayElemAt: ["$userData.email", 0],
  //         },
  //         _id: 0,
  //         tradeData: {
  //           $size: "tradeData"
  //         }
  //       },
  //   },
  // ]

  // 64708c99ae1d4cffe2779742
  // 64709adde5ef90f4210d64d5
  