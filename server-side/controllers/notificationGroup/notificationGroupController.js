const NotificationGroup = require("../../models/notificationGroup/notificationGroup");
// PaperTrading, TenXTrading, ContestTrading, InternshipTrading, MarginXTrading, BattleTrading
const PaperTrading = require('../../models/mock-trade/paperTrade');
const TenXTrading = require('../../models/mock-trade/tenXTraderSchema');
const ContestTrading = require('../../models/Contest/ContestTrade');
const InternshipTrading = require('../../models/mock-trade/internshipTrade');
const MarginXTrading = require('../../models/marginX/marginXUserMock');
const BattleTrading = require('../../models/battle/battleTrade');
const User = require("../../models/User/userDetailSchema");
const moment = require('moment');

exports.createNotificationGroup = async(req,res) => {
    console.log("createNotificationGroup")
    const {criteria, notificationGroupName} = req.body;
    try{
        const users = await getUsersFromCriteria(criteria);
        const group = await NotificationGroup.create({
            users,
            notificationGroupName,
            criteria,
            createdBy:req.user._id,
            lastmodifiedBy:req.user._id,
            status:'Active'
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
        const updates = req.body;

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
            const lastDayOfMonth = currentDate.clone().endOf('month').format('YYYY-MM-DD');
            users = getActiveUsersSet(new Date(firstDayOfMonth), new Date());
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
        case 'Test':
            users = ['642c6434573edbfcb2ac45a5', '6453c1435509f00c92fd59b7'];    
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
                status:'COMPLETE',
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
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
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
    const pipeline = [
        {
            $match: {
                status:'COMPLETE',
                trade_time: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                $or: [
                    { entryFee: { $exists: false, $ne: null } },
                    { entryFee: { $gt: 0 } }
                ]
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
    
    const collections = [TenXTrading, ContestTrading, MarginXTrading, BattleTrading];
    const uniqueUsersSet = new Set();
    
    for (const collection of collections) {
        const traders = await collection.aggregate(pipeline);
        traders.forEach(trader => uniqueUsersSet.add(trader.trader.toString()));
    }
    
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