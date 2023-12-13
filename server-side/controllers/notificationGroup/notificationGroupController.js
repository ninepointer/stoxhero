const NotificationGroup = require("../../models/notificationGroup/notificationGroup");
// PaperTrading, TenXTrading, ContestTrading, InternshipTrading, MarginXTrading, BattleTrading
const PaperTrading = require('../../models/mock-trade/paperTrade');
const TenXTrading = require('../../models/mock-trade/tenXTraderSchema');
const ContestTrading = require('../../models/DailyContest/dailyContestMockUser');
const InternshipTrading = require('../../models/mock-trade/internshipTrade');
const MarginXTrading = require('../../models/marginX/marginXUserMock');
const BattleTrading = require('../../models/battle/battleTrade');
const User = require("../../models/User/userDetailSchema");
const moment = require('moment');
const mongoose = require('mongoose');
const TenX = require("../../models/TenXSubscription/TenXSubscriptionSchema");
const MarginX = require("../../models/marginX/marginX");
const Contest = require("../../models/DailyContest/dailyContest");
const Battle = require("../../models/battle/battle");

exports.createNotificationGroup = async(req,res) => {
    console.log("createNotificationGroup")
    const {criteria, notificationGroupName, status} = req.body;
    try{
        const users = await getUsersFromCriteria(criteria);
        const group = await NotificationGroup.create({
            users,
            notificationGroupName,
            criteria,
            createdBy:req.user._id,
            lastmodifiedBy:req.user._id,
            status:status??'Active'
        });
        res.status(201).json({status:'success', message:'Notification group created'})
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong'});
    }

}

exports.editNotificationGroup = async(req,res) => {
    try {
        const { id } = req.params; // ID of the marginX to edit
        let updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid notification group ID" });
        }

        // Your additional checks and logic go here if necessary
        const existing = await NotificationGroup.findById(id).select('criteria');
        if(updates?.criteria && updates?.criteria != existing.criteria){
            updates.users = await getUsersFromCriteria(updates?.criteria);
        }
        const result = await NotificationGroup.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Notification Group not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Notification group updated successfully",
        });
    } catch (error) {
        console.log('error' ,error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating notification group",
            error: error.message
        });
    }
}

async function getUsersFromCriteria(criteria){
    let users = [];

    switch(criteria){
        case 'Lifetime Active Users':
            users = getActiveUsersSet(new Date('2022-08-01'), new Date());
            break;
        case 'Monthly Active Users':
            const currentDate = moment();
            const firstDayOfMonth = currentDate.clone().startOf('month').format('YYYY-MM-DD');
            console.log(new Date(firstDayOfMonth), new Date());
            const lastDayOfMonth = currentDate.clone().endOf('month').format('YYYY-MM-DD');
            users = getActiveUsersSet(new Date(firstDayOfMonth), new Date(lastDayOfMonth));
            break;
        case 'Lifetime Paid Users':
            users = await getPaidUsersSet(new Date('2022-08-01'), new Date());
            break;
        case 'Inactive Users':
            users = getInactiveUsersSet(new Date('2022-08-01'), new Date());
            break;
        case 'Month Inactive Users':
            users = getMonthInactiveUsers();
            break;
        case 'Inactive Users Today':
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            users = getInactiveUsersSet(yesterday, new Date());
            break;
        case 'TenX Lifetime Users':
            users = await getTenXLifetimeUsers();
            break;    
        case 'TenX Active Users':
            users = await getTenXActiveUsers();
            break;    
        case 'TenX Inactive Users':
            users = await getTenXInactiveUsers();
            break;    
        case 'TenX Expired Today Payout':
            users = await getTenXExpiredWithPayout();
            break;    
        case 'TenX Expired Today Without Payout':
            users = await getTenXExpiredWithoutPayout();
            break;    
        case 'TestZone Lifetime Active Users':
            users = await getTestZoneLifeTimeUsers();
            break;    
        case 'TestZone Monthly Active Users':
            users = await getTestZoneMonthlyActiveUsers();
            break;    
        case 'TestZone Paid Users':
            users = await getTestZonePaidUsers();
            break;    
        case 'TestZone Free Users':
            users = await getTestZoneFreeUsers();
            break;    
        case 'Joined Users(7 days)':
            users = await getUsersin7days();
            break;    
        case 'Joined Users(7 days) Active':
            users = await getActiveUsersin7days();
            break;    
        case 'Joined Users(7 days) Inactive':
            users = await getInactiveUsersin7days();
            break;    
        case 'Test':
            users = ['642c6434573edbfcb2ac45a5', '6453c1435509f00c92fd59b7', '63971eec2ca5ce5b52f900b7', '63987c34223c3fc074683f37'];
            break;    
        default:
            console.log('no such criteria');
            break;
    }
    return users;
}

async function getActiveUsersSet(startDate, endDate){
    const pipeline = [
        {
            $match: {
                // status:'COMPLETE',
                trade_time: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: '$trader',
            }
        },
        {
            $project: {
                _id: 0, 
                trader: '$_id'
            }
        }
    ];
    
    const collections = [PaperTrading, TenXTrading, ContestTrading, InternshipTrading, MarginXTrading, BattleTrading];
    const uniqueUsersSet = new Set();
    
    for (const collection of collections) {
        const traders = await collection.aggregate(pipeline);
        console.log('collection', collection, traders.length)
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
        console.log('unique users set', uniqueUsersSet.size)
    }
    
    return Array.from(uniqueUsersSet);
}
      

async function getInactiveUsersSet(startDate, endDate){
    const activeUsers = await getActiveUsersSet(startDate, endDate);
    const allUserDocs = await User.find().select("_id");
    const allUsers = allUserDocs.map(item=>item._id.toString());
    console.log('activeUsers',activeUsers)
    //find the difference between the arrays and store it in inactiveUsers
    let inactiveUsers = allUsers.filter(user => !activeUsers.includes(user));
    return inactiveUsers;
}

async function getPaidUsersSet(startDate, endDate){
    const tenXPipeline = [
        {
          $unwind:
            {
              path: "$users",
            },
        },
        {
            $match: {
              "users.subscribedOn":{
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
        {
          $group:
            {
              _id: "$users.userId",
            },
        },
      ];
    
    const marginXPipeline =  [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
            $match: {
              "participants.boughtAt":{
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ]; 
    
      const contestPipeline =  [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
            $match: {
              "entryFee":{$gt:0},  
              "participants.participatedOn":{
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ];
      const battlePipeline = [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
            $match: {
              "participants.boughtAt":{
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ];      
    const uniqueUsersSet = new Set();
    const tenXPaidUsers = await TenX.aggregate(tenXPipeline);
    tenXPaidUsers.forEach(trader=> uniqueUsersSet.add(trader?._id?.toString()));
    console.log('tenx paid', tenXPaidUsers.length, uniqueUsersSet.size);
    const marginXPaidUsers = await MarginX.aggregate(marginXPipeline);
    marginXPaidUsers.forEach(trader=> uniqueUsersSet.add(trader?._id?.toString()));
    console.log('marginx paid', marginXPaidUsers.length, uniqueUsersSet.size);
    const contestPaidUsers = await Contest.aggregate(contestPipeline);
    contestPaidUsers.forEach(trader=> uniqueUsersSet.add(trader?._id?.toString()));
    console.log('contest paid', contestPaidUsers.length, uniqueUsersSet.size);
    const battlePaidUsers = await Battle.aggregate(battlePipeline);
    battlePaidUsers.forEach(trader=> uniqueUsersSet.add(trader?._id.toString()));
    console.log('tenx paid', battlePaidUsers.length, uniqueUsersSet.size);
    
    return Array.from(uniqueUsersSet);
}

async function getMonthInactiveUsers(){
    const monthActiveUsers = await getActiveUsersDuringTheMonth();
    const lastMonthActiveUsers = await getActiveUsersBeforeTheMonth();  
    
    //get the users who were active last month but aren't active in this month
    const inactiveUsersThisMonth = lastMonthActiveUsers.filter(user => !monthActiveUsers.includes(user));
    return inactiveUsersThisMonth;

}

let getActiveUsersDuringTheMonth = async() => {
    let startDate, endDate;
  
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');

  
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    
    const pipeline = [
        {
            $match: {
                trade_time: {
                    $gte: new Date(formattedStartDate),
                    $lte: new Date(formattedEndDate)
                },
                status:'COMPLETE'
            }
        },
        {
            $group: {
                _id: '$trader',
            }
        },
        {
            $project: {
                _id: 0, 
                trader: '$_id'
            }
        }
    ];
  
    const collections = [PaperTrading, TenXTrading, ContestTrading, InternshipTrading, MarginXTrading, BattleTrading];
    const uniqueUsersSet = new Set();
  
    // Iterate over each collection and add unique traders to the set
    for (const collection of collections) {
        const traders = await collection.aggregate(pipeline);
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
    }
  
    return Array.from(uniqueUsersSet);
  }
  let getActiveUsersBeforeTheMonth = async() => {
    let date;
    date = moment().startOf('month');
    const lastDayOfPreviousMonth = date.subtract(1, 'day').format('YYYY-MM-DD');
  
    // Calculate the date 30 days before the last day of the previous month
    const date180DaysBefore = date.subtract(30, 'days').format('YYYY-MM-DD');
    
    const pipeline = [
        {
            $match: {
                trade_time: {
                    $gte: new Date(date180DaysBefore),
                    $lte: new Date(lastDayOfPreviousMonth)
                }
            }
        },
        {
            $group: {
                _id: '$trader',
            }
        },
        {
            $project: {
                _id: 0, 
                trader: '$_id'
            }
        }
    ];
  
    const collections = [PaperTrading, TenXTrading, ContestTrading, InternshipTrading, MarginXTrading, BattleTrading];
    const uniqueUsersSet = new Set();
  
    for (const collection of collections) {
        const traders = await collection.aggregate(pipeline);
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
    }
  
    return Array.from(uniqueUsersSet);
  }
let getTenXLifetimeUsers = async () => {
    const pipeline = [
        {
          $unwind:
            {
              path: "$users",
            },
        },
        {
          $group:
            {
              _id: "$users.userId",
            },
        },
      ];
    const tenXUsers = await TenX.aggregate(pipeline);
    const uniqueUsersSet = new Set();
    tenXUsers.forEach(trader => uniqueUsersSet.add(trader._id.toString()));
    return Array.from(uniqueUsersSet); 
}

let getTenXActiveUsers = async () => {
    const pipeline = [
        {
          $unwind:
            {
              path: "$users",
            },
        },
        {
            $match:
                {
                    "users.status":"Live"
                }
        },
        {
          $group:
            {
              _id: "$users.userId",
            },
        },
      ];
    const tenXUsers = await TenX.aggregate(pipeline);
    const uniqueUsersSet = new Set();
    tenXUsers.forEach(trader => uniqueUsersSet.add(trader._id.toString()));
    return Array.from(uniqueUsersSet); 
}

let getTenXInactiveUsers = async () => {
    const tenXLifeTime = await getTenXLifetimeUsers();
    const tenXActive = await getTenXActiveUsers();
    const tenXInactive = tenXLifeTime.filter(user=>!tenXActive.includes(user));
    return tenXInactive; 
}

let getTenXExpiredWithPayout = async () =>{
    const yesterday = moment().subtract(1,'day').startOf('day').format('YYYY-MM-DD');
    let payoutUsersPipeline = [
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $match: {
            "users.status": "Expired",
            "users.expiredOn":{$gte: yesterday},
            "users.payout": {
              $gt: 0,
            },
          },
        },
        {
          $group: {
            _id: "$users.userId",
          },
        },
      ];
    const payoutUsers = await TenX.aggregate(payoutUsersPipeline);
    const uniqueUsersSet = new Set();
    payoutUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
    return Array.from(uniqueUsersSet); 
}

let getTenXAllExpired = async () => {
    const yesterday = moment().subtract(1,'day').startOf('day');
    let allUsersPipeline = [
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $match: {
            "users.status": "Expired",
            "users.expiredOn":{$gte: yesterday}
          },
        },
        {
          $group: {
            _id: "$users.userId",
          },
        },
      ];
      const allUsers = await TenX.aggregate(allUsersPipeline);
      const uniqueUsersSet = new Set();
      allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
      return Array.from(uniqueUsersSet);   
}

let getTenXExpiredWithoutPayout = async() => {
    const allExpired = await getTenXAllExpired();
    const payoutExpired = await getTenXExpiredWithPayout();
    const withoutPayout = allExpired.filter(user=>!payoutExpired.includes(user));
    return withoutPayout;
}

let getTestZoneLifeTimeUsers = async () => {
    let pipeline = [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ]
      const allUsers = await Contest.aggregate(pipeline);
      const uniqueUsersSet = new Set();
      allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
      return Array.from(uniqueUsersSet);   
}

let getTestZonePaidUsers = async () => {
    let pipeline = [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
          $match:
            {
              entryFee: {
                $gt: 0,
              },
            },
        },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ];
      const allUsers = await Contest.aggregate(pipeline);
      const uniqueUsersSet = new Set();
      allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
      return Array.from(uniqueUsersSet);
}
let getTestZoneFreeUsers = async() =>{
    const allUsers = await getTestZoneLifeTimeUsers();
    const paidUsers = await getTestZonePaidUsers();
    const freeUsers = allUsers.filter(user=>!paidUsers.includes(user));
    return freeUsers;
}

let getTestZoneMonthlyActiveUsers = async () => {
    let pipeline = [
        {
          $unwind:
            {
              path: "$participants",
            },
        },
        {
            $match:
              {
                "participants.participatedOn":{
                    $gte:new Date(moment().startOf('month').format('YYYY-MM-DD')),
                    $lte:new Date(moment().endOf('month').format('YYYY-MM-DD')),
                }
              }

        },
        {
          $group:
            {
              _id: "$participants.userId",
            },
        },
      ];
      const allUsers = await Contest.aggregate(pipeline);
      const uniqueUsersSet = new Set();
      allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
      return Array.from(uniqueUsersSet);
}

let getUsersin7days = async () => {
    let pipeline = [
        {
          $match:
            {
              joining_date: {
                $gte: new Date(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD')),
              }
            },
        },
        {
            $group:
              {
                _id: "$_id",
              },
          },
      ];
    const allUsers = await User.aggregate(pipeline);
    const uniqueUsersSet = new Set();
    allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
    return Array.from(uniqueUsersSet);  
}

let getActiveUsersin7days = async () =>{
    let pipeline = [
        {
          $match:
            {
              joining_date: {
                $gte: new Date(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD')),
              },
              "activationDetails.activationDate": {
                $ne: null,
              },
            },
        },
        {
            $group:
              {
                _id: "$_id",
              },
          },
      ];
    const allUsers = await User.aggregate(pipeline);
    const uniqueUsersSet = new Set();
    allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
    return Array.from(uniqueUsersSet);   
}

let getInactiveUsersin7days = async () => {
    let pipeline = [
        {
          $match:
            {
              joining_date: {
                $gte: new Date(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD')),
              },
              "activationDetails.activationDate": {
                $eq: null,
              },
            },
        },
        {
            $group:
              {
                _id: "$_id",
              },
          },
      ];
    const allUsers = await User.aggregate(pipeline);
    const uniqueUsersSet = new Set();
    allUsers.forEach(trader=>uniqueUsersSet.add(trader?._id?.toString()));
    return Array.from(uniqueUsersSet); 
}


exports.refreshNotificationGroup = async (req,res) => {
    const {id} = req.params;
    try{
        const group = await NotificationGroup.findById(id);
        const users = await getUsersFromCriteria(group?.criteria);
        group.users = users;
        group.lastUpdatedOn = new Date();
        group.lastmodifiedBy = req.user._id
        await group.save({validateBeforeSave:false});
        res.status(200).json({status:'success', message:'Group refreshed'});
    }catch(e){
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message})
        console.log(e)
    }
}

exports.getNotificationGroups = async(req,res) => {
    const groups = await NotificationGroup.find({status:'Active'});
    res.status(200).json({status:'success',message:'Notification Groups fetched successfully'});
}
exports.getActiveNotificationGroups = async(req,res) => {
    try{
        const groups = await NotificationGroup.find({status:'Active'})
        res.status(200).json({status:'success',message:'Notification Groups fetched successfully', data:groups});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    }
}
exports.getActiveNotificationGroupsWithoutUsers = async(req,res) => {
    try{
        const groups = await NotificationGroup.find({status:'Active'}).select("-users");
        res.status(200).json({status:'success',message:'Notification Groups fetched successfully', data:groups});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    }
}
exports.getInactiveNotificationGroups = async(req,res) => {
    try{
        const groups = await NotificationGroup.find({status:'Inactive'})
        res.status(200).json({status:'success',message:'Notification Groups fetched successfully', data:groups});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    }
}
exports.getDraftNotificationGroups = async(req,res) => {
    try{
        const groups = await NotificationGroup.find({status:'Draft'})
        res.status(200).json({status:'success',message:'Notification Groups fetched successfully', data:groups});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    }
}


exports.getNotificationGroup = async(req,res) => {
    const {id} = req.params;
    try{
        const group = await NotificationGroup.findById(id).populate('users', 'first_name last_name mobile joining_date activationDetails.activationDate campaignCode')
        res.status(200).json({status:'success',message:'Notification Groups fetched successfully', data:group});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong', error:e.message});
    }
}