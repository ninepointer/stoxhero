const mongoose = require('mongoose');
const MarginX = require('../../models/marginX/marginX'); 
const Wallet  = require('../../models/UserWallet/userWalletSchema');
const MarginXMockUser = require('../../models/marginX/marginXUserMock');
// const { ObjectId } = require('mongodb');
// const uuid = require("uuid");
// const emailService = require("../../utils/emailService");

exports.createMarginX = async (req, res) => {
    try {
        const { 
            marginXName, startTime, endTime, marginXTemplate, maxParticipants,
            status, payoutStatus, marginXExpiry, isNifty, isBankNifty, isFinNifty, liveTime 
        } = req.body;

        const getMarginX = await MarginX.findOne({ marginXName: marginXName });
        if(startTime>endTime){
            return res.status(400).json({
                status: 'error',
                message: "Validateion error: Start time can't be greater than end time",
            });
        }
        if(startTime<liveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validateion error: Live time can't be greater than start time",
            });
        }
        if(endTime<liveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validateion error: Live time can't be greater than end time",
            });
        }

        if (getMarginX) {
            return res.status(400).json({
                status: 'error',
                message: "MarginX already exists with this name.",
            });
        }

        const marginX = await MarginX.create({
            marginXName, startTime, endTime, marginXTemplate, maxParticipants, 
            status, payoutStatus, createdBy: req.user._id, lastModifiedBy: req.user._id,
            marginXExpiry, isNifty, isBankNifty, isFinNifty, liveTime
        });

        res.status(201).json({
            status: 'success',
            message: "MarginX created successfully",
            data: marginX
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

// Controller for editing a MarginX
exports.editMarginX = async (req, res) => {
    try {
        const { id } = req.params; // ID of the marginX to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid marginX ID" });
        }

        // Your additional checks and logic go here if necessary

        const result = await MarginX.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "MarginX not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "MarginX updated successfully",
        });
    } catch (error) {
        console.log('error' ,error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating MarginX",
            error: error.message
        });
    }
};

exports.getAllMarginXs = async (req, res) => {
    try {
        const marginx = await MarginX.find({}).sort({ startTime: -1 })

        res.status(200).json({
            status: "success",
            message: "MarginX fetched successfully",
            data: marginx
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};


// Controller to fetch all MarginXs
exports.getAllMarginXs = async (req, res) => {
    try {
        const allMarginXs = await MarginX.find({}).populate('participants.userId', 'first_name last_name email mobile creationProcess');
        
        res.status(200).json({
            status: 'success',
            data: allMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching all MarginXs",
            error: error.message
        });
    }
};

// Controller to fetch only Ongoing MarginXs
exports.getOngoingMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const ongoingMarginXs = await MarginX.find({ 
            startTime: { $lte: now }, 
            endTime: { $gt: now },
            status : 'Active' 
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess' )
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')

        res.status(200).json({
            status: 'success',
            data: ongoingMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching ongoing MarginXs",
            error: error.message
        });
    }
};

exports.getUserLiveMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const ongoingMarginXs = await MarginX.find({ 
            startTime: { $lte: now }, 
            endTime: { $gt: now },
            status : 'Active' 
        })
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')

        res.status(200).json({
            status: 'success',
            data: ongoingMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching ongoing MarginXs",
            error: error.message
        });
    }
};

// Controller to fetch only Upcoming MarginXs
exports.getUpcomingMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const upcomingMarginXs = await MarginX.find({ 
            startTime: { $gt: now },
            status : 'Active'
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')
        
        res.status(200).json({
            status: 'success',
            data: upcomingMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching upcoming MarginXs",
            error: error.message
        });
    }
};

exports.getUserUpcomingMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const upcomingMarginXs = await MarginX.find({ 
            startTime: { $gt: now },
            status : 'Active'
        })
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')
        
        res.status(200).json({
            status: 'success',
            data: upcomingMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching upcoming MarginXs",
            error: error.message
        });
    }
}

// Controller for getting todaysMarinX 
exports.todaysMarinX = async (req, res) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    try {
        const marginx = await MarginX.find({
            contestEndTime: { $gte: today }
        }).populate('marginXTemplate', 'templateName _id portfolioValue entryFee')
            .populate('participants.userId', 'first_name last_name email mobile creationProcess')
            .sort({ startTime: 1 })

        res.status(200).json({
            status: "success",
            message: "Today's marginx fetched successfully",
            data: marginx
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in fetching upcoming marginx",
        })
    }
};

// Controller to fetch only Completed MarginXs
exports.getCompletedMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const completedMarginXs = await MarginX.find({ 
            status: 'Completed',
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('marginXTemplate', 'templateName portfolioValue entryFee');
        
        res.status(200).json({
            status: 'success',
            data: completedMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching completed MarginXs",
            error: error.message
        });
    }
};

exports.getUserCompletedMarginXs = async (req, res) => {
    const userId = req.user._id;
    try {
        const completedMarginXs = await MarginX.find({ 
            status: 'Completed',
            "participants.userId": new ObjectId(userId),
        })
        .populate('marginXTemplate', 'templateName portfolioValue entryFee');
        
        res.status(200).json({
            status: 'success',
            data: completedMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching completed MarginXs",
            error: error.message
        });
    }
};

exports.getMarginXById = async (req, res) => {
    try {
        const { id } = req.params; // Extracting id from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid MarginX ID" });
        }

        // Fetching the MarginX based on the id and populating the participants.userId field
        const marginX = await MarginX.findById(id).populate('participants.userId', 'first_name last_name email mobile creationProcess');

        if (!marginX) {
            return res.status(404).json({ status: "error", message: "MarginX not found" });
        }

        res.status(200).json({
            status: 'success',
            data: marginX
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching MarginX by ID",
            error: error.message
        });
    }
};

exports.getDraftMarginXs = async (req,res,next) => {
    const now = new Date();
    try {
        const draftMarginXs = await MarginX.find({ 
            status:'Draft'
        });
        
        res.status(200).json({
            status: 'success',
            data: draftMarginXs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching draft MarginXs",
            error: error.message
        });
    }
}

exports.creditAmountToWallet = async () => {
    try {
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

        const marginxs = await MarginX.find({ status: "Completed", payoutStatus: null, endTime: {$gte: today} }).populate('marginXTemplate', 'portfolioValue entryFee');

        // console.log(contest.length, contest)
        for (let j = 0; j < marginxs.length; j++) {
            // if (contest[j].contestEndTime < new Date()) {
            let leverage = marginxs[j]?.marginXTemplate?.portfolioValue/marginxs[j]?.entryFee;
            let entryFee = marginxs[j]?.entryFee;
            for (let i = 0; i < marginxs[j]?.participants?.length; i++) {
                let userId = marginxs[j]?.participants[i]?.userId;
                let id = marginxs[j]._id;
                let pnlDetails = await MarginXMockUser.aggregate([
                    {
                        $match: {
                            trade_time: {
                                $gte: today
                            },
                            status: "COMPLETE",
                            trader: new ObjectId(userId),
                            marginx: new ObjectId(id)
                        },
                    },
                    {
                        $group: {
                            _id: {
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
                            npnl: {
                                $subtract: ["$amount", "$brokerage"],
                            },
                        },
                    },
                ])

                // console.log(pnlDetails[0]);
                const payoutAmount = pnlDetails[0]?.npnl/leverage + entryFee;
                if(payoutAmount >0){
                    const wallet = await Wallet.findOne({ userId: userId });
                    console.log(userId, pnlDetails[0]);

                    wallet.transactions = [...wallet.transactions, {
                        title: 'Marginx Credit',
                        description: `Amount credited for Marginx ${marginxs[j].name}`,
                        transactionDate: new Date(),
                        amount: payoutAmount?.toFixed(2),
                        transactionId: uuid.v4(),
                        transactionType: 'Cash'
                    }];
                    await wallet.save();

                    marginxs[j].participants[i].payout = payoutAmount?.toFixed(2);
                    await marginxs[j].save();
                }
            }
            marginxs[j].payoutStatus = 'Completed'
            marginxs[j].status = "Completed";
            await marginxs[j].save();
            // }
        }


    } catch (error) {
        console.log(error);
    }
};

exports.purchaseIntent = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const result = await MarginX.findByIdAndUpdate(
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

exports.copyAndShare = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest and the user to register
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID or user ID" });
        }

        const result = await MarginX.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    contestSharedBy: {
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
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User share to contest successfully",
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

exports.participateUsers = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const marginx = await MarginX.findOne({ _id: id });

        for (let i = 0; i < marginx.participants?.length; i++) {
            if (marginx.participants[i]?.userId?.toString() === userId?.toString()) {
                return res.status(404).json({ status: "error", message: "You have already participated in this marginx." });
            }
        }

        const getActiveMarginX = await MarginX.find({
            participants: {
                $elemMatch: {
                    userId: new ObjectId(userId)
                }
            },
            contestStatus: "Active",
            // entryFee: 0,
            $or: [
                { startTime: { $gte: new Date(marginx.startTime), $lte: new Date(marginx.endTime) } },
                { endTime: { $gte: new Date(marginx.startTime), $lte: new Date(marginx.endTime) } },
                {
                    $and: [
                        { contestStartTime: { $lte: new Date(marginx.startTime) } },
                        { contestEndTime: { $gte: new Date(marginx.endTime) } }
                    ]
                }
            ]
        })

        if (getActiveMarginX.length > 0) {
            if (!marginx.potentialParticipants.includes(userId)) {
                marginx.potentialParticipants.push(userId);
                await marginx.save();
            }
            return res.status(404).json({ status: "error", message: "You can only participate in another marginx once your current marginx ends!" });
        }

        if (marginx?.maxParticipants <= marginx?.participants?.length) {
            if (!marginx.potentialParticipants.includes(userId)) {
                marginx.potentialParticipants.push(userId);
                await marginx.save();
            }
            return res.status(404).json({ status: "error", message: "The marginx is already full. We sincerely appreciate your enthusiasm to participate in the marginX. Please join in the next marginX." });
        }
        res.status(200).json({
            status: "success",
            message: "Participate successfully",
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