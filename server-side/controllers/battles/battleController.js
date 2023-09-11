const mongoose = require('mongoose');
const Battle = require('../../models/battle/battle'); // Modify path to your actual model's location
const Transaction = require('../../models/Transactions/Transaction');

// Controller for creating a Battle
exports.createBattle = async (req, res) => {
    try {
        const { 
            battleName, battleStartTime, battleEndTime, battleLiveTime, battleTemplate,
            status, isNifty, isBankNifty, isFinNifty
        } = req.body;

        if(battleStartTime > battleEndTime){
            return res.status(400).json({
                status: 'error',
                message: "Start time can't be greater than end time",
            });
        }
        if(battleStartTime < battleLiveTime){
            return res.status(400).json({
                status: 'error',
                message: "Live time can't be greater than start time",
            });
        }
        if(battleEndTime < battleLiveTime){
            return res.status(400).json({
                status: 'error',
                message: "Live time can't be greater than end time",
            });
        }

        const battleStartTimeDate = new Date(battleStartTime);
        battleStartTimeDate.setSeconds(0);

        if (isNaN(battleStartTimeDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid Start time format",
            });
        }

        const battleEndTimeDate = new Date(battleEndTime);
        battleEndTimeDate.setSeconds(0);

        if (isNaN(battleEndTimeDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid End time format",
            });
        }

        const battleLiveTimeDate = new Date(battleLiveTime);
        battleLiveTimeDate.setSeconds(0);

        if (isNaN(battleLiveTimeDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid Live time format",
            });
        }

        // const existingBattle = await Battle.findOne({ battleName: battleName, battleStartTime: battleStartTimeDate });
        // if (existingBattle) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: "Battle already exists with this name and start time.",
        //     });
        // }

        const battle = await Battle.create({
            battleName, 
            battleStartTime: battleStartTimeDate, 
            battleEndTime: battleEndTimeDate, 
            battleLiveTime : battleLiveTimeDate, 
            battleTemplate,
            status, 
            isNifty,
            isBankNifty,
            isFinNifty, 
            createdBy: req.user._id, 
            lastModifiedBy: req.user._id
        });

        const populatedBattle = await Battle.findById(battle._id).populate('battleTemplate');

        res.status(201).json({
            status: 'success',
            message: "Battle created successfully",
            data: populatedBattle
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for editing a Battle
exports.editBattle = async (req, res) => {
    try {
        const { id } = req.params; // ID of the battle to edit
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
        console.error('error', error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating Battle",
            error: error.message
        });
    }
};

// Fetch all Battles
exports.getAllBattles = async (req, res) => {
    try {
        const battles = await Battle.find({})
            .sort({ battleStartTime: -1 })
            .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
            .populate('potentialParticipants', 'first_name last_name email mobile creationProcess');

        res.status(200).json({
            status: 'success',
            data: battles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching all Battles",
            error: error.message
        });
    }
};

// Fetch Ongoing Battles
exports.getOngoingBattles = async (req, res) => {
    const now = new Date();
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Battle.countDocuments({ 
        battleStartTime: { $lte: now }, 
        battleEndTime: { $gt: now },
        status: 'Active'
    })
    try {
        const ongoingBattles = await Battle.find({ 
            battleStartTime: { $lte: now }, 
            battleEndTime: { $gt: now },
            status: 'Active'
        })
        .sort({ battleStartTime: -1 })
        .skip(skip).limit(limit)
        .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')

        res.status(200).json({
            status: 'success',
            data: ongoingBattles,
            results: ongoingBattles.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching ongoing Battles",
            error: error.message
        });
    }
};

exports.getUserLiveBattles = async (req, res) => {
    const now = new Date();
    try {
        const ongoingBattles = await Battle.find({
            battleStartTime: { $lte: now },
            battleEndTime: { $gt: now },
            status: 'Active'
        }).
        populate('battleTemplate', 'BattleTemplateName portfolioValue entryFee').
        sort({ battleStartTime: -1, entryFee: -1 });

        res.status(200).json({
            status: 'success',
            data: ongoingBattles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching ongoing Battles",
            error: error.message
        });
    }
};

// Fetches upcoming Battles
exports.getUpcomingBattles = async (req, res) => {
    const now = new Date();
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Battle.countDocuments({ 
        battleStartTime: { $gt: now }, 
        status: 'Active'
    })
    try {
        const upcomingBattles = await Battle.find({
            battleStartTime: { $gt: now },
            status: 'Active'
        }).sort({ battleStartTime: -1, entryFee: -1 })
          .skip(skip).limit(limit)
          .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')

        res.status(200).json({
            status: 'success',
            data: upcomingBattles,
            results: upcomingBattles.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching upcoming Battles",
            error: error.message
        });
    }
};

// Fetches upcoming Battles for a user which are not yet live
exports.getUserUpcomingBattles = async (req, res) => {
    const now = new Date();
    try {
        const upcomingBattles = await Battle.find({
            battleStartTime: { $gt: now },
            battleLiveTime: { $lt: now },
            status: 'Active'
        }).sort({ battleStartTime: -1, entryFee: -1 })
          .populate('battleTemplate', 'battleTemplateName portfolioValue entryFee');

        res.status(200).json({
            status: 'success',
            data: upcomingBattles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching upcoming Battles for the user",
            error: error.message
        });
    }
};

// Fetches Battles for today
exports.todaysBattle = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const today = new Date(todayDate + "T00:00:00.000Z");
    try {
        const battles = await Battle.find({
            battleEndTime: { $gte: today }
        }).populate('battleTemplate', 'battleTemplateName _id portfolioValue entryFee')
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .sort({ battleStartTime: 1 });

        res.status(200).json({
            status: "success",
            message: "Today's battles fetched successfully",
            data: battles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error in fetching today's battles",
            error: error.message
        });
    }
};

// Fetches completed Battles
exports.getDraftBattles = async (req, res) => {
    const now = new Date();
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Battle.countDocuments({ 
        status: 'Draft'
    })
    try {
        const draftBattles = await Battle.find({
            status: 'Draft'
        }).sort({ startTime: -1, entryFee: -1 })
          .skip(skip).limit(limit)
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
          .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')

        res.status(200).json({
            status: 'success',
            data: draftBattles,
            results: draftBattles.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching completed Battles",
            error: error.message
        });
    }
};

exports.getCompletedBattles = async (req, res) => {
    const now = new Date();
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Battle.countDocuments({ 
        status: 'Completed'
    })
    try {
        const completedBattles = await Battle.find({
            status: 'Completed'
        }).sort({ startTime: -1, entryFee: -1 })
          .skip(skip).limit(limit)
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
          .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')

        res.status(200).json({
            status: 'success',
            data: completedBattles,
            results: completedBattles.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching completed Battles",
            error: error.message
        });
    }
};

exports.getCancelledBattles = async (req, res) => {
    const now = new Date();
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Battle.countDocuments({ 
        status: 'Cancelled'
    })
    try {
        const cancelledBattles = await Battle.find({
            status: 'Cancelled'
        }).sort({ startTime: -1, entryFee: -1 })
          .skip(skip).limit(limit)
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
          .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')

        res.status(200).json({
            status: 'success',
            data: cancelledBattles,
            results: cancelledBattles.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching cancelled Battles",
            error: error.message
        });
    }
};

exports.getBattleById = async (req, res) => {
    try {
        const { id } = req.params; // Extracting id from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid Battle ID" });
        }

        // Fetching the Battle based on the id and populating the necessary fields
        const battle = await Battle.findById(id)
        .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue getPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess');

        if (!battle) {
            return res.status(404).json({ status: "error", message: "Battle not found" });
        }

        res.status(200).json({
            status: 'success',
            data: battle
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching Battle by ID",
            error: error.message
        });
    }
};

const BUFFER_TIME_SECONDS=30;
BATCH_SIZE=50;
exports.processBattles = async () => {
    try {
        const now = new Date();
        const bufferTime = new Date(now.getTime() + BUFFER_TIME_SECONDS * 1000);

        let skipCount = 0;
        let continueProcessing = true;

        while (continueProcessing) {
            const battles = await Battle.find({
                battleStartTime: { $lte: bufferTime },
                status: 'active'
            }).populate('battleTemplate', 'entryFee battleTemplateName').skip(skipCount).limit(BATCH_SIZE);

            if (battles.length === 0) {
                continueProcessing = false;
                break;
            }

            for (let battle of battles) {
                if (battle.participants.length < battle.minParticipants) {
                    battle.status = 'Cancelled';
                    // await battle.save();

                    // Refund the participants.
                    for (let participant of battle.participants) {
                        // Your refund logic here.
                        await refundParticipant(participant?.userId, battleName, battle?.battleTemplate?.entryFee);
                        participant.payoutStatus='Completed'
                        participant.payout =battle?.battleTemplate?.entryFee
                    }
                    await battle.save();
                }
            }
            skipCount += BATCH_SIZE;
        }
    } catch (error) {
        console.error("Error processing battles:", error);
    }
}

const refundParticipant = async(userId, battleName, refundAmount)=>{
    //TODO: Add an entry in the transactions collection and store the id in wallet
    const userWallet = await Wallet.findById(userId);
    userWallet.transactions.push({
        title:`Battle Refund`,
        description:`Refund for cancelled battle ${battleName}`,
        amount:refundAmount,
        transactionId:uuid.v4(),
        transactionType:'Cash',
        type:'Credit'
    });
    const transacation = await Transaction.create({
        transactionCategory:'Credit',
        transactionBy: '63ecbc570302e7cf0153370c',
        transactionAmount:refundAmount,
        transactionFor:'Refund',
        transactionStatus:'Complete',
        transactionMode:'Wallet',
        currency:'INR',
        transactionType:'Cash',
        wallet:userWallet._id
    });
    await userWallet.save();
}

const getPrizeDetails = async (req, res, next) => {
    const battleId = req.params.id;
    try {
        // 1. Get the corresponding battleTemplate for a given battle
        const battle = await Battle.findById(battleId).populate('battleTemplate');
        if (!battle || !battle.battleTemplate) {
            return res.status(404).json({status:'error', message: "Battle or its template not found." });
        }

        const template = battle.battleTemplate;

        // Calculate the Expected Collection
        const expectedCollection = template.entryFee * template.minParticipants;
        let collection = expectedCollection;
        let battleParticipants = template?.minParticipants;
        if(battle?.participants?.length > template?.minParticipants){
            battleParticipants = battle?.participants?.length;
            collection = template?.entryFee * battleParticipants;
        }

        // Calculate the Prize Pool
        const prizePool = collection - (collection * template.gstPercentage / 100);

        // Calculate the total number of winners
        const totalWinners = Math.round(template.winnerPercentage * battleParticipants / 100);

        // Determine the reward distribution for each rank mentioned in the rankingPayout
        let totalRewardDistributed = 0;
        const rankingReward = template.rankingPayout.map((rankPayout) => {
            const reward = prizePool * rankPayout.rewardPercentage / 100;
            totalRewardDistributed += reward;
            return {
                rank: rankPayout.rank.toString(),
                reward: reward
            };
        });

        // Calculate the reward for the remaining winners
        const remainingWinners = totalWinners - rankingReward.length;
        const rewardForRemainingWinners = remainingWinners > 0 ? (prizePool - totalRewardDistributed) / remainingWinners : 0;

        if(remainingWinners > 0) {
            rankingReward.push({
                rank: `${rankingReward.length + 1}-${totalWinners}`,
                reward: rewardForRemainingWinners
            });
        }

        let data = {
            prizePool: prizePool,
            prizeDistribution: rankingReward
        };
        res.status(200).json({
            status:'success',
            message:'Rewards fetched',
            data:data
        });

    } catch(err) {
        return res.status(500).json({status:'error', message: "Something went wrong.", error:err.message });
    }
};


