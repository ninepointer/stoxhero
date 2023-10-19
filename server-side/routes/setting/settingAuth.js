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
        const contest = await Contest.findOne({_id: new ObjectId('652e22d5c04ae6e4528c1f68')});
        // console.log(contest)
        let participants = contest?.participants;
        // console.log(participants);
        let totalPayout = 0;
    
        for (let elem of participants){
            const userWallet = await Wallet.findOne({userId: elem?.userId});
            const txns = userWallet.transactions;
            // console.log(userWallet);
            const contestTxns = txns?.filter((item) => { return item?.title == 'Contest Credit' && new Date(item?.transactionDate)>= new Date('2023-10-13') && item?.description == 'Amount credited for contest Midweek Market Madness'});
            // const sumPayouts = contestTxns?.reduce()
            if(contestTxns.length > 1){
                console.log('red', elem?.userId);
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
        const contest = await Contest.findOne({_id: new ObjectId('652c0af86365ad15659986ed')});
        // const contest = await Contest.findOne({_id: new ObjectId('65150e3ff3ef0c1ed1a36a0c')});
        let participants = contest.participants;
        // let totalPayout = 0;
    
        for (let elem of participants){
            // const userWallet = await Wallet.findOne({userId: elem?.userId});
            const notifications = await Notification.find({user:elem?.userId});
            // const txns = userWallet.transactions;
            const not = notifications?.filter((item) => { return item?.title == 'Contest Reward Credited' && new Date(item?.notificationTime)>= new Date('2023-10-18T09:49:00.485+00:00')});
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

module.exports = router;

