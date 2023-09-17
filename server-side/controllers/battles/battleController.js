const mongoose = require('mongoose');
const Battle = require('../../models/battle/battle'); // Modify path to your actual model's location
const Transaction = require('../../models/Transactions/Transaction');
const Wallet = require("../../models/UserWallet/userWalletSchema");
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const uuid = require("uuid");
const emailService = require("../../utils/emailService")
const moment = require('moment')

// Controller for creating a Battle
exports.createBattle = async (req, res) => {
    try {
        const {
            battleName, battleStartTime, battleEndTime, battleLiveTime, battleTemplate,
            status, isNifty, isBankNifty, isFinNifty
        } = req.body;

        if (battleStartTime > battleEndTime) {
            return res.status(400).json({
                status: 'error',
                message: "Start time can't be greater than end time",
            });
        }
        if (battleStartTime < battleLiveTime) {
            return res.status(400).json({
                status: 'error',
                message: "Live time can't be greater than start time",
            });
        }
        if (battleEndTime < battleLiveTime) {
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
            battleLiveTime: battleLiveTimeDate,
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
        status: 'Active',
        battleStatus: "Live"
    })
    try {
        const ongoingBattles = await Battle.find({
            battleStartTime: { $lte: now },
            battleEndTime: { $gt: now },
            status: 'Active',
            battleStatus: "Live"
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
            results: ongoingBattles.length,
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
            status: 'Active',
            battleStatus: "Live"
        }).
            populate('battleTemplate', 'BattleTemplateName portfolioValue entryFee gstPercentage platformCommissionPercentage minParticipants winnerPercentage rankingPayout').
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
        // battleStartTime: { $gt: now },
        status: 'Active',
        battleStatus: "Upcoming"
    })
    try {
        const upcomingBattles = await Battle.find({
            // battleStartTime: { $gt: now },
            status: 'Active',
            battleStatus: "Upcoming"
        }).sort({ battleStartTime: -1, entryFee: -1 })
            .skip(skip).limit(limit)
            .populate('battleTemplate', 'battleTemplateName entryFee portfolioValue gstPercentage platformCommissionPercentage minParticipants battleType battleTemplateType rankingPayout winnerPercentage')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
            .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')

        res.status(200).json({
            status: 'success',
            data: upcomingBattles,
            results: upcomingBattles.length,
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
            // battleStartTime: { $gt: now },
            battleLiveTime: { $lt: now },
            status: 'Active',
            battleStatus: "Upcoming"
        }).sort({ battleStartTime: -1, entryFee: -1 })
            .populate('battleTemplate', 'BattleTemplateName portfolioValue entryFee gstPercentage platformCommissionPercentage minParticipants winnerPercentage rankingPayout').
            sort({ battleStartTime: -1, entryFee: -1 });
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

exports.getUserCompletedBattles = async (req, res) => {
    const userId = req.user._id;
    try {


        const completed = await Battle.aggregate([
            {
                $match:
                {
                    status: "COMPLETE",
                    trader: new ObjectId(
                        userId
                    ),
                },
            },
            {
                $group:
                {
                    _id: {
                        battleId: "$battleId",
                    },
                    amount: {
                        $sum: {
                            $multiply: ["$amount", -1],
                        },
                    },
                    brokerage: {
                        $sum: {
                            $toDouble: "$brokerage",
                        },
                    },
                },
            },
            {
                $project:
                {
                    battleId: "$_id.battleId",
                    _id: 0,
                    npnl: {
                        $subtract: ["$amount", "$brokerage"],
                    },
                },
            },
            {
                $lookup: {
                    from: "battles",
                    localField: "battleId",
                    foreignField: "_id",
                    as: "battle",
                },
            },
            {
                $lookup:
                {
                    from: "battle-templates",
                    localField: "battle.battleTemplate",
                    foreignField: "_id",
                    as: "templates",
                },
            },
            {
                $project:
                {
                    battleId: "$battleId",
                    npnl: "$npnl",
                    portfolioValue: {
                        $arrayElemAt: [
                            "$templates.portfolioValue",
                            0,
                        ],
                    },
                    entryFee: {
                        $arrayElemAt: [
                            "$templates.entryFee",
                            0,
                        ],
                    },
                    battleStartTime: {
                        $arrayElemAt: ["$battle.battleStartTime", 0],
                    },
                    battleEndTime: {
                        $arrayElemAt: ["$battle.battleEndTime", 0],
                    },
                    battleName: {
                        $arrayElemAt: ["$battle.battleName", 0],
                    },
                    isNifty: {
                        $arrayElemAt: ["$battle.isNifty", 0],
                    },
                    isBankNifty: {
                        $arrayElemAt: ["$battle.isBankNifty", 0],
                    },
                    isFinNifty: {
                        $arrayElemAt: ["$battle.isFinNifty", 0],
                    },
                    battleType: {
                        $arrayElemAt: ["$battle.battleTemplate.battleType", 0],
                    },
                    minParticipants: {
                        $arrayElemAt: ["$battle.battleTemplate.minParticipants", 0],
                    },
                },
            },
            {
                $sort:
                {
                    battleStartTime: 1,
                },
            },
        ])

        for (let elem of completed) {
            let xFactor = (elem.portfolioValue / elem.entryFee);
            elem.return = elem.entryFee + elem.npnl / xFactor;
            elem.return = elem.return > 0 ? elem.return : 0;
        }

        res.status(200).json({
            status: 'success',
            data: completed
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching completed Battles",
            error: error.message
        });
    }
};

exports.purchaseIntent = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const result = await Battle.findByIdAndUpdate(
            id,
            { $push: { purchaseIntent: { userId: userId, date: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
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
            results: draftBattles.length,
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
            results: completedBattles.length,
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
            results: cancelledBattles.length,
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

const BUFFER_TIME_SECONDS = 30;
BATCH_SIZE = 50;
exports.processBattles = async () => {
    try {
        const now = new Date();
        const bufferTime = new Date(now.getTime() + BUFFER_TIME_SECONDS * 1000);

        let skipCount = 0;
        let continueProcessing = true;

        while (continueProcessing) {
            const battles = await Battle.find({
                battleStartTime: { $lte: bufferTime },
                status: 'Active',
                battleStatus:{$ne:'Cancelled'}
            }).populate('battleTemplate', 'entryFee battleTemplateName').skip(skipCount).limit(BATCH_SIZE);

            if (battles.length === 0) {
                continueProcessing = false;
                break;
            }

            for (let battle of battles) {
                if (battle.participants.length < battle.minParticipants) {
                    battle.status = 'Cancelled';
                    battle.battleStatus = 'Canecelled'
                    // await battle.save();

                    // Refund the participants.
                    for (let participant of battle.participants) {
                        // Your refund logic here.
                        await refundParticipant(participant?.userId, battleName, battle?.battleTemplate?.entryFee);
                        participant.payoutStatus = 'Completed'
                        participant.payout = battle?.battleTemplate?.entryFee
                    }
                    await battle.save({validateBeforeSave:false});
                }else{
                    battle.status='Active';
                    battle.battleStatus = 'Live';
                    await battle.save({validateBeforeSave:false});

                }
            }
            skipCount += BATCH_SIZE;
        }
    } catch (error) {
        console.error("Error processing battles:", error);
    }
}

const refundParticipant = async (userId, battleName, refundAmount) => {
    //TODO: Add an entry in the transactions collection and store the id in wallet
    const userWallet = await Wallet.findById(userId);
    userWallet.transactions.push({
        title: `Battle Refund`,
        description: `Refund for cancelled battle ${battleName}`,
        amount: refundAmount,
        transactionId: uuid.v4(),
        transactionType: 'Cash',
        type: 'Credit'
    });
    const transacation = await Transaction.create({
        transactionCategory: 'Credit',
        transactionBy: '63ecbc570302e7cf0153370c',
        transactionAmount: refundAmount,
        transactionFor: 'Refund',
        transactionStatus: 'Complete',
        transactionMode: 'Wallet',
        currency: 'INR',
        transactionType: 'Cash',
        wallet: userWallet._id
    });
    await userWallet.save();
}

exports.deductBattleAmount = async (req, res, next) => {

    try {
        const { battleId } = req.body
        const userId = req.user._id;

        const battle = await Battle.findOne({ _id: new ObjectId(battleId) }).populate('battleTemplate', 'entryFee');
        const wallet = await Wallet.findOne({ userId: userId });
        const user = await User.findOne({ _id: userId });

        const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
            return transaction.transactionType === "Cash";
        });

        const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
            return total + transaction?.amount;
        }, 0);

        if (totalCashAmount < battle?.battleTemplate?.entryFee) {
            return res.status(404).json({ status: "error", message: "You do not have enough balance to join this battle. Please add money to your wallet." });
        }

        for (let i = 0; i < battle?.participants?.length; i++) {
            if (battle?.participants[i]?.userId?.toString() === userId?.toString()) {
                return res.status(404).json({ status: "error", message: "You have already participated in this battle" });
            }
        }

        wallet.transactions = [...wallet.transactions, {
            title: 'Battle Fee',
            description: `Amount deducted for ${battle?.battleName} Battle fee`,
            transactionDate: new Date(),
            amount: (-battle?.battleTemplate?.entryFee),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
        }];
        wallet.save();

        const transacation = await Transaction.create({
            transactionCategory: 'Credit',
            transactionBy: new ObjectId(userId),
            transactionAmount: battle?.battleTemplate?.entryFee,
            transactionFor: 'Battle',
            transactionStatus: 'Complete',
            transactionMode: 'Wallet',
            currency: 'INR',
            transactionType: 'Cash',
            wallet: wallet._id
        });

        const result = await Battle.findOne({ _id: new ObjectId(battleId) });

        if (!result || !wallet) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        let obj = {
            userId: userId,
            boughtAt: new Date(),
        }
        result.participants.push(obj);
        // Save the updated document
        await result.save();

        let recipients = [user.email, 'team@stoxhero.com'];
        let recipientString = recipients.join(",");
        let subject = "Battle Fee - StoxHero";
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
                <h1>Battle Fee</h1>
                <p>Hello ${user.first_name},</p>
                <p>Thanks for participating in Battle! Please find your transaction details below.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>Battle Name: <span class="password">${battle?.battleName}</span></p>
                <p>Entry Fee: <span class="password">₹${battle?.battleTemplate?.entryFee}/-</span></p>
                <p>Start Time: <span class="password">${moment(battle?.battleStartTime).utcOffset('+05:30').format('YYYY-MM-DD HH:mm a')}</span></p>
                <p>End Time: <span class="password">${moment(battle?.battleEndTime).utcOffset('+05:30').format('YYYY-MM-DD HH:mm a')}</span></p>
                </div>
            </body>
            </html>

        `
        if (process.env.PROD === "true") {
            emailService(recipientString, subject, message);
            console.log("Subscription Email Sent")
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

exports.getPrizeDetails = async (req, res, next) => {
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
                reward: reward,
                rewardPercentage: rankPayout.rewardPercentage
                
            };
        });

        // Calculate the reward for the remaining winners
        const remainingWinners = totalWinners - rankingReward.length;
        const rewardForRemainingWinners = remainingWinners > 0 ? (prizePool - totalRewardDistributed) / remainingWinners : 0;
        const remainingWinnersPercentge = rewardForRemainingWinners * 100/prizePool;

        if(remainingWinners > 0) {
            rankingReward.push({
                rank: `${rankingReward.length + 1}-${totalWinners}`,
                reward: rewardForRemainingWinners,
                rewardPercentage: remainingWinnersPercentge
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

exports.findBattleByName = async(req,res) => {
    try{
        console.log('here');
        const {name, date} = req.query;
        console.log(name, date);
        const result = await Battle.findOne({battleName: name, battleStartTime:{$gte: new Date(date)}}).
            select('-purchaseIntent -__v -sharedBy -potentialParticipants -__v -createdBy -lastModifiedBy -createdOn -lastModifiedOn').
            populate('battleTemplate', 'entryFee portfolioValue');
        console.log('result', result);
        if(!result){
            res.status(404).json({
                status: "error",
                message: "No battle found",
            });
        }
        res.status(200).json({data:result, status:'success'});
    }catch(e){
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message
        });
    }
}