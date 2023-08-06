const mongoose = require('mongoose');
const Battle = require('../models/battles/battle');
const User = require("../models/User/userDetailSchema");
const Wallet = require("../models/UserWallet/userWalletSchema");
const { ObjectId } = require('mongodb');

exports.createBattle = async (req, res) => {
    try {
        console.log('req body',req.body)
        const { 
            battleStatus, battleEndTime, battleStartTime, battleLiveTime, description, college, collegeCode,
            battleType, battleFor, entryFee, portfolio, minParticipants, battleExpiry, 
            isNifty, isBankNifty, isFinNifty, rewardType
        } = req.body;

        const getBattle = await Battle.findOne({ battleName: req.body.battleName });
        if (getBattle) {
            return res.status(500).json({
                status: 'error',
                message: "Battle already exists with this name.",
            });
        }

        const battle = await Battle.create({
            battleStatus, battleEndTime, battleStartTime, battleLiveTime, description, portfolio, college, 
            battleType, battleFor, entryFee, createdBy: req.user._id, lastModifiedBy: req.user._id, 
            battleExpiry, isNifty, isBankNifty, isFinNifty, collegeCode, minParticipants, battleName: req.body.battleName, rewardType
        });

        res.status(201).json({
            status: 'success',
            message: "Battle created successfully",
            data: battle
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};


exports.editBattle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid battle ID" });
        }

        const result = await Battle.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Battle updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Error in updating battle",
            error: error.message
        });
    }
};


exports.getAllBattles = async (req, res) => {
    try {
        const battles = await Battle.find({}).sort({ battleStartTime: -1 });
        res.status(200).json({
            status: "success",
            message: "Battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getBattle = async (req, res) => {
    const { id } = req.params;
    try {
        const battle = await Battle.findOne({ _id: id })
            .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
            .populate('college', 'collegeName zone')
            .sort({ battleStartTime: -1 });
        res.status(200).json({
            status: "success",
            message: "Battle fetched successfully",
            data: battle
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getUpcomingBattles = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleEndTime: { $gt: new Date() }, battleFor: "StoxHero", battleStatus:"Active"
        }).sort({ battleStartTime: 1 });
        res.status(200).json({
            status: "success",
            message: "Upcoming battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming battles",
            error: error.message
        });
    }
};

exports.getOnlyUpcomingBattles = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStartTime: { $gt: new Date() }, battleFor: "StoxHero", battleStatus:"Active"
        }).sort({ battleStartTime: 1 });
        res.status(200).json({
            status: "success",
            message: "Only upcoming battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching only upcoming battles",
            error: error.message
        });
    }
};

exports.ongoingBattlesAdmin = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStartTime: { $lte: new Date() },
            battleEndTime: { $gte: new Date() },
        }).populate('portfolio', 'portfolioName _id portfolioValue')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
        .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
        .populate('battleSharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('college', 'collegeName zone')
        .sort({ battleStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "ongoing battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching ongoing battles",
            error: error.message
        });
    }
};

exports.getAdminUpcomingBattles = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStartTime: { $gt: new Date() },
        }).populate('portfolio', 'portfolioName _id portfolioValue')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
        .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
        .populate('battleSharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('college', 'collegeName zone')
        .sort({ battleStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "upcoming battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming battles",
            error: error.message
        });
    }
};

exports.getCommpletedBattlesAdmin = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStatus: 'Completed'
        }).populate('portfolio', 'portfolioName _id portfolioValue')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
        .populate('interestedUsers.userId', 'first_name last_name email mobile creationProcess')
        .populate('battleSharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('college', 'collegeName zone')
        .sort({ battleStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "completed battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching completed battles",
            error: error.message
        });
    }
};
exports.getDraftBattles = async (req, res) => {
    try {
        const battles = await Battle.find({ battleStatus: 'Draft' }).sort({ battleStartTime: -1 });

        res.status(200).json({
            status: "success",
            message: "Draft battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};



exports.createRule = async(req, res, next) => {
    const {id} = req.params;
    const {rule} = req.body;
    try{
        const battle = await Battle.findById(id);
        if(!battle){
            return res.status(404).json({status:'error', message:'Battle not found'});
        }
        battle.rules.push(rule);
        await battle.save({validateBeforeSave:false});
        res.status(201).json({status:'success', message:'Rule added'});
    }catch(e){
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}

exports.getRules = async(req, res, next) => {
    try {
        const {id} = req.params;
        const battle = await Battle.findById(id);
        if(!battle){
            return res.status(404).json({status:'error', message:'Battle not found'});
        }
        res.status(200).json({status:'success', message:'Rules fetched', data: battle.rules});
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}

exports.editRules = async(req, res, next) => {
    const {id, ruleId} = req.params;
    const {rule} = req.body;
    try{
        const battle = await Battle.findById(id);
        if(!battle){
            return res.status(404).json({status:'error', message:'Battle not found'});
        }
        if(battle.rules.length>0){
            for (item of battle.rules){
                if(item._id === ruleId){
                    item = {
                        ...rule,
                        _id: item?._id
                    }
                }
            }
            await battle.save({validateBeforeSave:false});
        }
        res.status(201).json({status:'success', message:'Rule Edited'});
    }catch(e){
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}

exports.addReward = async(req,res, next)=>{
    const {id} = req.params;
    const {rankStart, rankEnd, prize, prizeValue} = req.body;
    if(rankStart>rankEnd){
        return res.status(400).json({status:'error', message:'Start Rank should be less than equal to end Rank'});
    }
    try{
        const battle = await Battle.findById(id);
        if (!battle) {
            return res.status(404).json({status:'error', message:'Battle not found'});
          }
        for (let reward of battle.rewards) {
            if ((rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
                (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)) {
              return res.status(400).send('Ranks overlap with existing rewards');
            }
          }
          battle.rewards.push({ rankStart, rankEnd, prize, prizeValue});
          await battle.save({validateBeforeSave: false}); 
    }catch(e){
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }

}

exports.editReward = async (req, res) => {
    const{rewardId, id} = req.params;
    const { battleId, rankStart, rankEnd, prize, prizeValue } = req.body;
  
    if (rankStart >= rankEnd) {
      return res.status(400).json({status:'error', message:'rankStart must be less than rankEnd'});
    }
  
    try {
      const battle = await Battle.findById(battleId);
  
      if (!battle) {
        return res.status(404).json({status:'error', message:'Battle not found'});
      }
  
      const rewardIndex = battle.rewards.findIndex(r => r._id.toString() === rewardId);
  
      if (rewardIndex === -1) {
        return res.status(404).json({status:'error', message:'Reward not found'});
      }
  
      // Check for overlap with other rewards, excluding the one being edited
      for (const [index, reward] of battle.rewards.entries()) {
        if (index === rewardIndex) continue; // Skip the current reward being edited
        if ((rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
            (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)) {
          return res.status(400).json({status:'error', message:'Ranks overlap with existing rewards'});
        }
      }
  
      battle.rewards[rewardIndex] = { rankStart, rankEnd, prize, prizeValue };
      await battle.save();
  
      res.status(200).json({status:'success', message:'Reward updated successfully'});
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
  }
  
  exports.getUsers = async (req, res) => {
    const searchString = req.query.search;
    try {
        const data = await User.find({
            $and: [
                {
                    $or: [
                        { email: { $regex: searchString, $options: 'i' } },
                        { first_name: { $regex: searchString, $options: 'i' } },
                        { last_name: { $regex: searchString, $options: 'i' } },
                        { mobile: { $regex: searchString, $options: 'i' } },
                    ]
                },
                {
                    status: 'Active',
                },
            ]
        })
        res.status(200).json({
            status: "success",
            message: "Getting User successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.registerUserToBattle = async (req, res) => {
    try {
        const { id } = req.params; // ID of the battle and the user to register
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid battle or user" });
        }
        const result = await Battle.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    interestedUsers: {
                        $each: [
                            {
                                userId: userId,
                                registeredOn: new Date(),
                                status: 'Joined',
                            },
                        ],
                    },
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User registered to battle successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.purchaseIntent = async (req, res) => {
    try {
        const { id } = req.params; // ID of the battle 
        const userId = req.user._id;

        const result = await Battle.findByIdAndUpdate(
            id,
            { $push: { purchaseIntent: { userId: userId, date: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Intent Saved successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.copyAndShare = async (req, res) => {
    try {
        const { id } = req.params; // ID of the battle
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid battle or user ID" });
        }

        const result = await Battle.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    battleSharedBy: {
                        $each: [
                            {
                                userId: userId,
                                sharedAt: new Date(),
                            },
                        ],
                    },
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User share to battle successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.deductSubscriptionAmount = async (req, res, next) => {

    try {
        const { battleFee, battleName, battleId } = req.body
        const userId = req.user._id;

        const battle = await Battle.findOne({ _id: battleId });
        const wallet = await UserWallet.findOne({ userId: userId });
        const user = await User.findOne({ _id: userId });

        const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
            return transaction.transactionType === "Cash";
        });

        const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
            return total + transaction?.amount;
        }, 0);

        if (totalCashAmount < battle?.entryFee) {
            return res.status(404).json({ status: "error", message: "You do not have enough balance to join this battle. Please add money to your wallet." });
        }

        for (let i = 0; i < battle.participants?.length; i++) {
            if (battle.participants[i]?.userId?.toString() === userId?.toString()) {
                return res.status(404).json({ status: "error", message: "You have already participated in this battle." });
            }
        }

        // if (contest?.maxParticipants <= contest?.participants?.length) {
        //     if (!contest.potentialParticipants.includes(userId)) {
        //         contest.potentialParticipants.push(userId);
        //         contest.save();
        //     }
        //     return res.status(404).json({ status: "error", message: "The contest is already full. We sincerely appreciate your enthusiasm to participate in our contest. Please join in our future contest." });
        // }

        const result = await Battle.findByIdAndUpdate(
            battleId,
            { $push: { participants: { userId: userId, participatedOn: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );


        wallet.transactions = [...wallet.transactions, {
            title: 'Battle Fee',
            description: `Amount deducted for the battle fee of ${battle?.battleName}`,
            transactionDate: new Date(),
            amount: (-battle?.entryFee),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
        }];
        wallet.save();

        if (!result || !wallet) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        let recipients = [user.email,'team@stoxhero.com'];
        let recipientString = recipients.join(",");
        let subject = "Battle Fee Deducted - StoxHero";
        let message = 
        `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Battle Fee Deducted</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                p {
                    margin: 0 0 20px;
                }

                .userid {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .password {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .login-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                }

                .login-button:hover {
                    background-color: #0069d9;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>Battle Fee Deducted from wallet</h1>
                <p>Hello ${user.first_name},</p>
                <p>Thanks for participating in the battle ${battle?.battleName}! Please find your transaction details below.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>Battle Name: <span class="password">${battle?.battleName}</span></p>
                <p>Battle Fee: <span class="password">₹${battle?.entryFee}/-</span></p>
                </div>
            </body>
            </html>

        `
        if(process.env.PROD === "true"){
            emailService(recipientString,subject,message);
            console.log("Deduction Email Sent")
        }

        res.status(200).json({
            status: "success",
            message: "Paid successfully",
            data: result
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
}

exports.todaysBattle = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    try {
        const battles = await Battle.find({
            battleEndTime: { $gte: today }
        }).populate('portfolio', 'portfolioName _id portfolioValue')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .sort({ battleStartTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Today's battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming battles",
            error: error.message
        });
    }
};

exports.ongoingBattle = async (req, res) => {
    try {
        const battles = await Battle.find({
            battleStartTime: { $lte: new Date() },
            battleEndTime: { $gte: new Date() },
            battleFor: "StoxHero"
        },
        {
            potentialParticipants: 0,
            battleSharedBy: 0,
            purchaseIntent: 0
        }
        ).sort({ battleStartTime: 1 })
        res.status(200).json({
            status: "success",
            message: "ongoing battles fetched successfully",
            data: battles
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching ongoing battles",
            error: error.message
        });
    }
};