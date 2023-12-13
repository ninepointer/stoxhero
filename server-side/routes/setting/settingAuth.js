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

router.get("/usersetting", Authentication, async (req, res)=>{

    const setting = await Setting.find().select('isAppLive minWithdrawal maxWithdrawal maxWithdrawalHigh walletBalanceUpperLimit gstPercentage tdsPercentage contest time minWalletBalance maxBonusRedemptionPercentage bonusToUnitCashRatio')
    return res.status(200).json({status: "success", data: setting});
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
                minWalletBalance:req.body.minWalletBalance,
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
            const contestTxns = txns?.filter((item) => { return item?.title == 'TestZone Credit' && new Date(item?.transactionDate)>= new Date('2023-10-25') && item?.description == 'Amount credited for contest Campus Financial Faceoff (Day 1)'});
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

exports.cancelPendingOrders = async() => {
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

        const participants1= contest1?.participants?.map(item=>item?.userId);
        const potentialParticipants1= contest1?.potentialParticipants;
        const participants2= contest2?.participants?.map(item=>item?.userId);
        const potentialParticipants2= contest2?.potentialParticipants;
        const participants3= contest3?.participants?.map(item=>item?.userId);
        const potentialParticipants3= contest3?.potentialParticipants;
        const combined = [...participants1, ...participants2, ...participants3, ...potentialParticipants1, ...potentialParticipants2, ...potentialParticipants3];
        const uniqueList = [...new Set(combined)];

        console.log(uniqueList?.length);
        const collections = [TenXTrade, MarginXTrade, VirtualTrade, InternshipTrade, ContestTrade];
        let activatedUsers = [];
        const cutoffDate = new Date('2023-10-18');

        let activatedUsersSet = new Set();  // Use a set for efficient lookups
        let tradersBeforeCutoffSet = new Set();  // Track traders with trades before cutoff
        let totalSet = new Set();
        console.log('scanning models');
        for (let Model of collections) {
            console.log('model', Model);
            const postCutoffTraders = await Model.find({ 
                trader: { $in: uniqueList },
                trade_time: { $gte: cutoffDate, $lte: new Date('2023-10-20')}
            }).select('trader trade_time').sort({trade_time:1});
            for (let trade of postCutoffTraders) {
                const countBeforeCutoff = await Model.findOne({
                    trader: trade?.trader,
                    trade_time: { $lt: new Date('2023-10-21')}
                }).select('trade_time trader');
                totalSet.add({
                    trader: trade?.trader,
                    first_trade:countBeforeCutoff?.trade_time
                });
                for (let obj of totalSet) {
                    if (obj?.trader?.toString() === countBeforeCutoff?.trader?.toString() && countBeforeCutoff?.trade_time < obj?.trade_time) {
                        obj.trade_time = countBeforeCutoff?.trade_time;
                    }
                }
                //     const existsInContest = await ContestTrade.findOne({
            //         trader:traderId,
            //         trade_time: { $gte: cutoffDate, $lte:new Date('2023-10-20')}
            //     }) 
    
            //     if (countBeforeCutoff > 0 || !existsInContest) {
            //         tradersBeforeCutoffSet.add(traderId.toString());  // Add trader to exclusion set
            //     } else {
            //         activatedUsersSet.add(traderId.toString());  // Potentially activated user
            //     }
            }
        }
    
        // Remove traders from the activated set if they're in the exclusion set
        // for (let traderId of tradersBeforeCutoffSet) {
        //     activatedUsersSet.delete(traderId);
        // }
        console.log('data population now');
        const newActivatedUsers =  Array.from(new Set(activatedUsersSet));
        const allUsers =  Array.from(new Set(totalSet));
        console.log(allUsers[0]);
        const allUserIds = allUsers.map(item=>item?.trader);
        // console.log(newActivatedUsers?.length);
        let detailedArray = [];

        const users = await User.find({ _id: { $in: allUserIds } }, 
                                    'first_name last_name mobile email campaignCode joining_date creationProcess');

        for (let user of users) {
            const contestRegistration = await ContestRegistration.findOne({ mobileNo: user.mobile }, 'collegeName campaignCode');
            const tradeDoc = allUsers.find((item)=> item?.trader?.toString() ==user?._id?.toString());
            let firstTrade = '';
            if(tradeDoc!=-1){
                firstTrade = tradeDoc?.first_trade;
                console.log('first trade', firstTrade)
            }else{
                console.log('not found', user?.userId);
            }
            let detailedObject = {
                Name: user?.first_name +' '+user?.last_name, 
                Mobile: user?.mobile,
                Email: user?.email,
                'First Trade': moment(firstTrade).add(330, 'minutes').format('DD-MM-YY hh:mm:ss a'),
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

router.get('/collegecontestusers', async(req,res) => {
    console.log('starting pipeline');
    const pipeline = [
        {
          $match: {
            _id: {
              $in: [
                new ObjectId("652c0d87d565747ad90bfd1b"),
                new ObjectId("652c0cd8921a308fe75aafe5"),
                new ObjectId("652c0af86365ad15659986ed"),
                // Add more ObjectId values as needed
              ],
            },
          },
        },
        {
          $project: {
            combinedIDs: {
              $setUnion: [
                {
                  $ifNull: [
                    "$potentialParticipants",
                    [],
                  ],
                },
                // Potential Participants (Array of IDs)
                {
                  $map: {
                    input: "$participants",
                    as: "p",
                    in: "$$p.userId",
                  },
                }, // Extract userId from participants
              ],
            },
          },
        },
        {
          $unwind: {
            path: "$combinedIDs",
          },
        },
        {
          $group: {
            _id: null,
            // Group all documents into one group
            uniqueCombinedIDs: {
              $addToSet: "$combinedIDs", // Collect all combinedIDs in an array
            },
          },
        },
        {
          $project: {
            _id: 0,
            // Exclude the default _id field
            uniqueCombinedIDs: 1, // Include the array of unique combinedIDs
          },
        },
        {
          $unwind: {
            path: "$uniqueCombinedIDs",
          },
        },
        {
          $lookup: {
            from: "user-personal-details",
            localField: "uniqueCombinedIDs",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
          },
        },
        {
          $project: {
            userId: "$user._id",
            first_name: "$user.first_name",
            last_name: "$user.last_name",
            mobile: "$user.mobile",
            email: "$user.email",
            joining_date: {
              $dateToString: {
                date: {
                  $add: [
                    {
                      $toDate: "$user.joining_date",
                    },
                    // Convert to date
                    19800000, // Add 5 hours and 30 minutes in milliseconds (5 * 60 * 60 * 1000 + 30 * 60 * 1000)
                  ],
                },
      
                format: "%Y-%m-%d", // Specify the desired date format
              },
            },
      
            signup_method: "$user.creationProcess",
            signupCampaignCode: {
              $ifNull: ["$campaignCode", ""],
            },
          },
        },
        {
          $lookup: {
            from: "contest-registrations",
            localField: "mobile",
            foreignField: "mobileNo",
            as: "contestRegistration",
          },
        },
        {
          $unwind: {
            path: "$contestRegistration",
          },
        },
        {
          $addFields: {
            registrationCampaignCode:
              "$contestRegistration.campaignCode",
          },
        },
        {
          $lookup: {
            from: "paper-trades",
            localField: "userId",
            foreignField: "trader",
            as: "paper-trades",
          },
        },
        {
          $lookup: {
            from: "intern-trades",
            localField: "userId",
            foreignField: "trader",
            as: "intern-trades",
          },
        },
        {
          $lookup: {
            from: "dailyContest-mock-users",
            localField: "userId",
            foreignField: "trader",
            as: "contest-trades",
          },
        },
        {
          $lookup: {
            from: "marginx-mock-users",
            localField: "userId",
            foreignField: "trader",
            as: "marginx-trades",
          },
        },
        {
          $lookup: {
            from: "tenx-trade-users",
            localField: "userId",
            foreignField: "trader",
            as: "tenx-trades",
          },
        },
        {
          $project: {
            userId: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            joining_date: 1,
            signup_method: 1,
            signupCampaignCode: 1,
            registrationCampaignCode: 1,
            allTrades: {
              $concatArrays: [
                "$paper-trades",
                "$intern-trades",
                "$tenx-trades",
                "$marginx-trades",
              ],
            },
          },
        },
        {
          $unwind: {
            path: "$allTrades",
          },
        },
        {
          $match: {
            "allTrades.status": "COMPLETE",
          },
        },
        {
          $project: {
            userId: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            joining_date: 1,
            signup_method: 1,
            signupCampaignCode: 1,
            registrationCampaignCode: 1,
            trade_time: {
              $substr: ["$allTrades.trade_time", 0, 10],
            },
          },
        },
      ];
    
      const data = await Contest.aggregate(pipeline);

console.log(data?.length);

// Correcting the sort logic
let newData = data.sort((a, b) => new Date(a.trade_time) - new Date(b.trade_time));

console.log(newData.length);

let finalData = [];

let uniqueUsers = new Set(); // To keep track of unique users

for (let item of newData) {
    if (!uniqueUsers.has(item.userId.toString())) {
        uniqueUsers.add(item.userId.toString());

        finalData.push({
            userId: item.userId,
            first_name: item.first_name,
            last_name: item.last_name,
            mobile: item.mobile,
            email: item.email,
            joining_date: item.joining_date,
            signup_method: item.signup_method,
            signupCampaignCode: item.signupCampaignCode,
            registrationCampaignCode: item.registrationCampaignCode,
            first_trade: item.trade_time
        });
    }
}

console.log(finalData.length);
res.json(finalData);

});

router.get("/checkextra", async (req, res)=>{
    const today = new Date().setHours(0,0,0,0);
    try{
        const contest = await Contest.findById('654240e691586db318590372');
        const participants = contest.participants;
        const participantIds = participants.map(item=>item.userId.toString());
        const pot = contest.potentialParticipants.map(item=>item?.toString());
        const potSet = new Set(pot);
        console.log(pot, participantIds);
        let arr = [];
        const difference = participantIds.filter(item => !potSet.has(item.toString()));
        console.log('only',difference);
    }catch(e){
        console.log(e);
    }
})



module.exports = router;

