const express = require("express");
const router = express.Router();
require("../../db/conn");
const Setting = require("../../models/settings/setting");
const Authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');
const {ObjectId} = require('mongodb');
const Contest = require('../../models/DailyContest/dailyContest');
const Wallet = require('../../models/UserWallet/userWalletSchema');
const Notification = require('../../models/notifications/notification');
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema");
const TenXTrade = require("../../models/mock-trade/tenXTraderSchema");
const InternshipTrade = require("../../models/mock-trade/internshipTrade");
const VirtualTrade = require("../../models/mock-trade/paperTrade");
const ContestTrade = require("../../models/DailyContest/dailyContestMockUser");
const MarginXTrade = require("../../models/marginX/marginXUserMock");
const User = require("../../models/User/userDetailSchema");
const ContestRegistration = require("../../models/DailyContest/contestRegistration");
const moment = require('moment');


router.get("/leaderboardSetting", Authentication, async (req, res)=>{
    let leaderboardTime = await Setting.find().select('leaderBoardTimming')
    return res.status(200).send(leaderboardTime);
})

router.get("/readsetting", Authentication, (req, res)=>{
    Setting.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/readsetting/:id", Authentication, (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Setting.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.patch("/applive/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        const{isAppLive, infinityLive} = req.body;
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            isAppLive, infinityLive, modifiedBy: req.user._id, modifiedOn: new Date()
        }, {new:true})
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/mobileappversion", async(req,res) => {
    try{
        const setting = await Setting.find({}).select('-__v -_id -name -user');
        const mobileAppVersion = setting[0]?.mobileAppVersion;
        console.log(setting[0]);
        res.status(200).json({status:'success', data:mobileAppVersion});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'success', message:'Something went wrong', error:e?.message});

    }

})
router.patch("/mobileappversion", async(req,res) => {
    try{
        const setting = await Setting.find({});
        const {mobileAppVersion} = req.body;
        if(!mobileAppVersion){
            res.status(400).json({status:'error', message:"No version in payload"});
        }
        setting[0].mobileAppVersion = mobileAppVersion;
        await setting[0].save({validateBeforeSave:false})
        res.status(200).json({status:'success', message:'App version updated'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'success', message:'Something went wrong', error:e?.message});

    }

})

router.patch("/settings/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                leaderBoardTimming: req.body.leaderBoardTimming,
                // AppStartTime: req.body.AppStartTime,
                // AppEndTime: req.body.AppEndTime,
                infinityPrice: req.body.infinityPrice,
                maxWithdrawal:req.body.maxWithdrawal,
                maxWithdrawalHigh:req.body.maxWithdrawalHigh,
                walletBalanceUpperLimit:req.body.walletBalanceUpperLimit,
                minWithdrawal:req.body.minWithdrawal,
                gstPercentage:req.body.gstPercentage,
                tdsPercentage:req.body.tdsPercentage,
                mobileAppVersion:req.body.mobileAppVersion,
                maxBonusRedemptionPercentage:req.body.maxBonusRedemptionPercentage,
                bonusToUnitCashRatio:req.body.bonusToUnitCashRatio,
                "contest.upiId": req.body.upiId,
                "contest.email": req.body.email,
                "contest.mobile": req.body.mobile,
                "time.appStartTime": req.body.appStartTime,
                "time.timerStartTimeInStart": req.body.timerStartTimeInStart,
                "time.appEndTime": req.body.appEndTime,
                "time.timerStartTimeInEnd": req.body.timerStartTimeInEnd,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleLTP/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.ltp": req.body.ltp,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleLiveOrder/:id", restrictTo('Admin', 'SuperAdmin'), Authentication, async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.liveOrder": req.body.liveOrder,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleComplete/:id", restrictTo('Admin', 'SuperAdmin'), Authentication, async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.complete": req.body.complete,
            }
        }, {new: true})
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully", data: setting});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/deletetxns", async (req, res)=>{
    try{
        // const contest = await Contest.findOne({_id: new ObjectId('6509843318489d6d850f9f1e')});
        const contest = await Contest.findOne({_id: new ObjectId('6533ae99986e42d4944f14d2')});
        // console.log(contest)
        let participants = contest?.participants;
        // console.log(participants);
        let totalPayout = 0;
    
        for (let elem of participants){
            const userWallet = await Wallet.findOne({userId: elem?.userId});
            const txns = userWallet.transactions;
            // console.log(userWallet);
            const contestTxns = txns?.filter((item) => { return item?.title == 'Contest Credit' && new Date(item?.transactionDate)>= new Date('2023-10-25') && item?.description == 'Amount credited for contest Campus Financial Faceoff (Day 1)'});
            // const sumPayouts = contestTxns?.reduce()
            if(contestTxns.length > 1){
                console.log('red', elem?.userId, elem?.payout);
            }
            if(contestTxns.length == 1){
                console.log('green', elem?.userId ,elem?.payout);
            }
            if(contestTxns.length > 2){
                console.log('extreme', elem?.userId, contestTxns?.length);
            }

            if (contestTxns.length > 0) {
                // Calculate the sum of amount in contestTxns
                const userAmount = contestTxns?.reduce((sum, txn) => sum + (txn.amount || 0), 0);
                // console.log(`Amount for user ${elem?.userId}: ${userAmount}`);

                totalPayout += userAmount; // Update the totalPayout with this user's amount
            }
            // if(contestTxns.length == 1){
            //     console.log('Here\'s the amount', contestTxns[0]?._id, contestTxns[0]?.amount, contestTxns[0]?.amount*0.7);
            //     const updatedAmount = contestTxns[0]?.amount * 0.7;
            //     await Wallet.updateOne(
            //         { userId: elem?.userId, "transactions._id": contestTxns[0]?._id},
            //         { $set: { "transactions.$.amount": updatedAmount } }
            //     )
            // }
            if(contestTxns.length == 2){
                //delete the duplicate transaction from userWallet and save
                if (contestTxns.length == 2) {
                    // To determine which one to delete, you could delete based on criteria such as creation time or ID
                    // Here I'm assuming you want to delete the second transaction as the duplicate
                    const duplicateTxn = contestTxns[1];
    
                    // Use the pull method to remove the transaction from the user's wallet
                    // await Wallet.updateOne(
                    //     { userId: elem?.userId }, 
                    //     { $pull: { transactions: { _id: duplicateTxn._id } } }
                    // );
                }    
            }
            // console.log(`For user${elem?.userId}`, contestTxns?.length);    
        }
        console.log(`Total Payout: ${totalPayout}`);
        console.log('finished')
        res.status(200).send("Duplicate transactions deleted");
    }catch(error) {
    console.error("Error deleting duplicate transactions:", error);
    res.status(500).send("Internal Server Error");
}
})
router.get("/deletenotifs", async (req, res)=>{
    try{
        const contest = await Contest.findOne({_id: new ObjectId('652c0d87d565747ad90bfd1b')});
        // const contest = await Contest.findOne({_id: new ObjectId('65150e3ff3ef0c1ed1a36a0c')});
        let participants = contest.participants;
        // let totalPayout = 0;
    
        for (let elem of participants){
            // const userWallet = await Wallet.findOne({userId: elem?.userId});
            const notifications = await Notification.find({user:elem?.userId});
            // const txns = userWallet.transactions;
            const not = notifications?.filter((item) => { return item?.title == 'Contest Reward Credited' && new Date(item?.notificationTime)>= new Date('2023-10-20T09:49:00.485+00:00')});
            // const sumPayouts = contestTxns.reduce()
            // console.log(not.length, 'for', elem?.userId);
            if(not?.length == 2){
                if(not[0]?.description == not[1]?.description){
                    const duplicateNot = not[1];
                    console.log('Deleting notification for', elem?.userId);
                    await Notification.findByIdAndDelete(duplicateNot?._id);
                }
            }
            // if(not.length > 1){
            //     console.log('red', elem?.userId);
            // }
            // if (contestTxns.length > 0) {
            //     // Calculate the sum of amount in contestTxns
            //     const userAmount = contestTxns.reduce((sum, txn) => sum + (txn.amount || 0), 0);
            //     // console.log(`Amount for user ${elem?.userId}: ${userAmount}`);

            //     totalPayout += userAmount; // Update the totalPayout with this user's amount
            // }
            // if(contestTxns.length == 2){
            //     //delete the duplicate transaction from userWallet and save
            //     if (contestTxns.length == 2) {
            //         // To determine which one to delete, you could delete based on criteria such as creation time or ID
            //         // Here I'm assuming you want to delete the second transaction as the duplicate
            //         const duplicateTxn = contestTxns[1];
    
            //         // Use the pull method to remove the transaction from the user's wallet
            //         await Wallet.updateOne(
            //             { userId: elem?.userId }, 
            //             { $pull: { transactions: { _id: duplicateTxn._id } } }
            //         );
            //     }    
            // }
            // console.log(`For user${elem?.userId}`, contestTxns?.length);    
        }
        // console.log(`Total Payout: ${totalPayout}`);
        console.log('finished')
        res.status(200).send("Duplicate transactions deleted");
    }catch(error) {
    console.error("Error deleting duplicate transactions:", error);
    res.status(500).send("Internal Server Error");
}
})    

exports.cancelPendingOrders = async(req,res,next) => {
    const today = new Date().setHours(0,0,0,0);
    try{
        const updates = await PendingOrder.updateMany(
            {
                status:'Pending', createdOn:{$gte: new Date(today)}
            },{
                    $set: {
                        status: "Cancelled"
                    }
            }
        )
    }catch(e){
        console.log(e);
    }
}

router.get('/uniqueactivated', async(req,res) => {
        const contest1 = await Contest.findById('652c0af86365ad15659986ed').select('participants potentialParticipants');
        const contest2 = await Contest.findById('652c0cd8921a308fe75aafe5').select('participants potentialParticipants');
        const contest3 = await Contest.findById('652c0d87d565747ad90bfd1b').select('participants potentialParticipants');

        const participants1= contest1?.participants;
        const potentialParticipants1= contest1?.potentialParticipants;
        const participants2= contest2?.participants;
        const potentialParticipants2= contest2?.potentialParticipants;
        const participants3= contest3?.participants;
        const potentialParticipants3= contest3?.potentialParticipants;
        const combined = [...participants1, ...participants2, ...participants3, ...potentialParticipants1, ...potentialParticipants2, ...potentialParticipants3];
        const uniqueList = [...new Set(combined)];

        console.log(uniqueList?.length);
        const collections = [TenXTrade, MarginXTrade, VirtualTrade, InternshipTrade, ContestTrade];
        let activatedUsers = [];
        const cutoffDate = new Date('2023-10-18');

        let activatedUsersSet = new Set();  // Use a set for efficient lookups
        let tradersBeforeCutoffSet = new Set();  // Track traders with trades before cutoff
    
        for (let Model of collections) {
            const postCutoffTraders = await Model.find({ 
                trader: { $in: uniqueList },
                trade_time: { $gte: cutoffDate, $lte: new Date('2023-10-20')}
            }).distinct('trader');
    
            for (let traderId of postCutoffTraders) {
                const countBeforeCutoff = await Model.countDocuments({
                    trader: traderId,
                    trade_time: { $lt: cutoffDate }
                });
                const existsInContest = await ContestTrade.findOne({
                    trader:traderId,
                    trade_time: { $gte: cutoffDate, $lte:new Date('2023-10-20')}
                }) 
    
                if (countBeforeCutoff > 0 || !existsInContest) {
                    tradersBeforeCutoffSet.add(traderId.toString());  // Add trader to exclusion set
                } else {
                    activatedUsersSet.add(traderId.toString());  // Potentially activated user
                }
            }
        }
    
        // Remove traders from the activated set if they're in the exclusion set
        for (let traderId of tradersBeforeCutoffSet) {
            activatedUsersSet.delete(traderId);
        }
    
        const newActivatedUsers =  Array.from(new Set(activatedUsersSet));
        console.log(newActivatedUsers?.length);
        let detailedArray = [];

        const users = await User.find({ _id: { $in: newActivatedUsers } }, 
                                    'first_name last_name mobile email campaignCode joining_date creationProcess');

        for (let user of users) {
            const contestRegistration = await ContestRegistration.findOne({ mobileNo: user.mobile }, 'collegeName campaignCode');

            let detailedObject = {
                Name: user?.first_name +' '+user?.last_name, 
                Mobile: user?.mobile,
                Email: user?.email,
                'Joining Date': moment(user?.joining_date).add(330, 'minutes').format('DD-MM-YY hh:mm:ss a'),
                'Creation Process': user?.creationProcess,
                'User Campaign Code': user?.campaignCode,
                College: contestRegistration ? contestRegistration?.collegeName : null,
                'Registration Campaign Code': contestRegistration ? contestRegistration?.campaignCode : null
            };

            detailedArray.push(detailedObject);
        }
        res.json(detailedArray);
    }
)


module.exports = router;

