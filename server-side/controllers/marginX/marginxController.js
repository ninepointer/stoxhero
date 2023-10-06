const mongoose = require('mongoose');
const MarginX = require('../../models/marginX/marginX'); 
const Wallet  = require('../../models/UserWallet/userWalletSchema');
const MarginXMockUser = require('../../models/marginX/marginXUserMock');
const { ObjectId } = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const MarginXUserMock = require("../../models/marginX/marginXUserMock");
const {createUserNotification} = require('../notification/notificationController');
const Setting = require("../../models/settings/setting")
const uuid = require("uuid");
const emailService = require("../../utils/emailService");
const Product = require('../../models/Product/product');
const {saveSuccessfulCouponUse} = require('../coupon/couponController');
const Coupon = require('../../models/coupon/coupon');

exports.createMarginX = async (req, res) => {
    try {
        const { 
            marginXName, startTime, endTime, marginXTemplate, maxParticipants,
            status, payoutStatus, marginXExpiry, isNifty, isBankNifty, isFinNifty, liveTime 
        } = req.body;

        const getMarginX = await MarginX.findOne({ marginXName: marginXName, startTime:startTime});
        if(startTime>endTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Start time can't be greater than end time",
            });
        }
        if(startTime<liveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Live time can't be greater than start time",
            });
        }
        if(endTime<liveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Live time can't be greater than end time",
            });
        }
        const startTimeDate = new Date(startTime);

        // Set the seconds to "00"
        startTimeDate.setSeconds(0);

        // Check if startTime is valid
        if (isNaN(startTimeDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Invalid start time format",
            });
        }

        if (getMarginX) {
            return res.status(400).json({
                status: 'error',
                message: "MarginX already exists with this name.",
            });
        }

        const marginX = await MarginX.create({
            marginXName, startTime: startTimeDate, endTime, marginXTemplate, maxParticipants, 
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
        const allMarginXs = await MarginX.find({})
        .sort({entryFee:-1})
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess');;
        
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
        }).sort({startTime: -1, entryFee:-1})
        .populate('participants.userId', 'first_name last_name email mobile creationProcess' )
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
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
        .sort({startTime: -1, entryFee:-1})
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
        }).sort({startTime: -1, entryFee:-1})
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
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
            liveTime:{$lt:now},
            status : 'Active'
        }).sort({startTime: -1, entryFee:-1})
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
            endTime: { $gte: today }
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
        }).sort({startTime: -1, entryFee:-1})
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
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

// Controller to fetch only Cancelled MarginXs
exports.getCancelledMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const completedMarginXs = await MarginX.find({ 
            status: 'Cancelled',
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess');
        
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


        const completed = await MarginXUserMock.aggregate([
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
                        marginxId: "$marginxId",
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
                    marginxId: "$_id.marginxId",
                    _id: 0,
                    npnl: {
                        $subtract: ["$amount", "$brokerage"],
                    },
                },
            },
            {
                $lookup: {
                    from: "marginxes",
                    localField: "marginxId",
                    foreignField: "_id",
                    as: "marginx",
                },
            },
            {
                $lookup:
                {
                    from: "marginx-templates",
                    localField: "marginx.marginXTemplate",
                    foreignField: "_id",
                    as: "templates",
                },
            },
            {
                $project:
                {
                    marginxId: "$marginxId",
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
                    startTime: {
                        $arrayElemAt: ["$marginx.startTime", 0],
                    },
                    endTime: {
                        $arrayElemAt: ["$marginx.endTime", 0],
                    },
                    marginxName: {
                        $arrayElemAt: ["$marginx.marginXName", 0],
                    },
                    isNifty: {
                        $arrayElemAt: ["$marginx.isNifty", 0],
                      },
                        isBankNifty: {
                        $arrayElemAt: ["$marginx.isBankNifty", 0],
                      },
                        isFinNifty: {
                        $arrayElemAt: ["$marginx.isFinNifty", 0],
                      },
                        marginxExpiry: {
                        $arrayElemAt: ["$marginx.marginXExpiry", 0],
                      },
                      maxParticipants: {
                        $arrayElemAt: ["$marginx.maxParticipants", 0],
                      },
                },
            },
            {
                $sort:
                {
                    startTime: 1,
                },
            },
        ])

        for(let elem of completed){
            let xFactor = (elem.portfolioValue/elem.entryFee);
            elem.return = elem.entryFee + elem.npnl/xFactor;
            elem.return = elem.return > 0 ? elem.return : 0;
        }

        // const completedMarginXs = await MarginX.find({ 
        //     status: 'Completed',
        //     "participants.userId": new ObjectId(userId),
        // }).sort({startTime: -1, entryFee:-1})
        // .populate('marginXTemplate', 'templateName portfolioValue entryFee');
        
        res.status(200).json({
            status: 'success',
            data: completed
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
        const marginX = await MarginX.findById(id)
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess');

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


exports.getMarginXByIdUser = async (req, res) => {
    try {
        const { id } = req.params; // Extracting id from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid MarginX ID" });
        }

        // Fetching the MarginX based on the id and populating the participants.userId field
        const marginX = await MarginX.findById(id)
        .populate('marginXTemplate', 'templateName portfolioValue entryFee')
        .select('marginXName marginXTemplate')

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
        }).populate('marginXTemplate', 'templateName portfolioValue entryFee')
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess');
        
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
        const setting = await Setting.find();

        const marginxs = await MarginX.find({ status: "Completed", payoutStatus: null, endTime: {$gte: today} }).populate('marginXTemplate', 'portfolioValue entryFee');

        // console.log(contest.length, contest)
        for (let j = 0; j < marginxs.length; j++) {
            // if (contest[j].contestEndTime < new Date()) {
            let leverage = marginxs[j]?.marginXTemplate?.portfolioValue/marginxs[j]?.marginXTemplate.entryFee;
            let entryFee = marginxs[j]?.marginXTemplate?.entryFee;
            for (let i = 0; i < marginxs[j]?.participants?.length; i++) {
                let userId = marginxs[j]?.participants[i]?.userId;
                let fee = marginxs[j]?.participants[i]?.fee;
                let id = marginxs[j]._id;
                let pnlDetails = await MarginXMockUser.aggregate([
                    {
                        $match: {
                            trade_time: {
                                $gte: today
                            },
                            status: "COMPLETE",
                            trader: new ObjectId(userId),
                            marginxId: new ObjectId(id)
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

                // console.log(pnlDetails);
                let payoutAmount = entryFee;
                if(pnlDetails?.length != 0 && pnlDetails[0]?.npnl){
                    payoutAmount = (pnlDetails[0]?.npnl/leverage) + entryFee;
                    console.log("in if ", payoutAmount)
                }
                if(payoutAmount >=0){
                    let payoutAmountAdjusted = payoutAmount;
                    if(payoutAmount>fee){
                        payoutAmountAdjusted = payoutAmount - (payoutAmount-fee)*setting[0]?.tdsPercentage/100;
                    }

                    const wallet = await Wallet.findOne({ userId: userId });
                    console.log("second if", userId, pnlDetails[0], payoutAmount);

                    wallet.transactions = [...wallet.transactions, {
                        title: 'Marginx Credit',
                        description: `Amount credited for Marginx ${marginxs[j].marginXName}`,
                        transactionDate: new Date(),
                        amount: payoutAmountAdjusted?.toFixed(2),
                        transactionId: uuid.v4(),
                        transactionType: 'Cash'
                    }];
                    await wallet.save();
                    const user = await User.findById(userId).select('email first_name last_name');
                    if (process.env.PROD == 'true') {
                        emailService(user?.email, 'MarginX Payout Credited - StoxHero', `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>Amount Credited</title>
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
                            <h1>Amount Credited</h1>
                            <p>Hello ${user.first_name},</p>
                            <p>Amount of ₹${payoutAmountAdjusted?.toFixed(2)} has been credited in your wallet for ${marginxs[j].marginXName}.</p>
                            <p>You can now purchase Tenx and participate in various activities on stoxhero.</p>
                            
                            <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                            <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                            <br/><br/>
                            <p>Thanks,</p>
                            <p>StoxHero Team</p>
                  
                            </div>
                        </body>
                        </html>
                        `);
                    }
                    await createUserNotification({
                        title:'MarginX Payout Credited',
                        description:`₹${payoutAmountAdjusted?.toFixed(2)} credited for your MarginX return`,
                        notificationType:'Individual',
                        notificationCategory:'Informational',
                        productCategory:'MarginX',
                        user: user?._id,
                        priority:'Medium',
                        channels:['App', 'Email'],
                        createdBy:'63ecbc570302e7cf0153370c',
                        lastModifiedBy:'63ecbc570302e7cf0153370c'  
                      });
                    marginxs[j].participants[i].payout = payoutAmountAdjusted?.toFixed(2);
                    marginxs[j].participants[i].tdsAmount = payoutAmount>fee?((payoutAmount- fee)*setting[0]?.tdsPercentage/100).toFixed(2):0;
                    await marginxs[j].save();
                }
            }
            marginxs[j].payoutStatus = 'Completed'
            marginxs[j].status = "Completed";
            await marginxs[j].save();
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
            return res.status(400).json({ status: "error", message: "Invalid marginx ID or user ID" });
        }

        const result = await MarginX.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    sharedBy: {
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
            return res.status(404).json({ status: "error", message: "MarginX not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User shared marginx",
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
            status: "Active",
            // entryFee: 0,
            $or: [
                { startTime: { $gte: new Date(marginx.startTime), $lte: new Date(marginx.endTime) } },
                { endTime: { $gte: new Date(marginx.startTime), $lte: new Date(marginx.endTime) } },
                {
                    $and: [
                        { startTime: { $lte: new Date(marginx.startTime) } },
                        { endTime: { $gte: new Date(marginx.endTime) } }
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
        const result = await MarginX.findOne({ _id: new ObjectId(id) });

        let obj = {
            userId: userId,
            boughtAt: new Date(),
            fee:marginx?.marginXTemplate?.entryFee,
            actualPrice:marginx?.marginXTemplate?.entryFee
        }

        result.participants.push(obj);

        // console.log(result)
        // Save the updated document
        await result.save();

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

exports.deductMarginXAmount = async (req, res, next) => {
    const userId = req.user._id;
    const { entryFee, marginXName, marginXId, coupon } = req.body;

    const result = await exports.handleDeductMarginXAmount(userId, entryFee, marginXName, marginXId, coupon);
    res.status(result.statusCode).json(result.data);
}

exports.handleDeductMarginXAmount = async (userId, entryFee, marginXName, marginXId ,coupon) =>{
    try {
        const marginx = await MarginX.findOne({ _id: marginXId }).populate('marginXTemplate', 'entryFee');
        const wallet = await Wallet.findOne({ userId: userId });
        const user = await User.findOne({ _id: userId });
        let discountAmount = 0;
        let cashbackAmount = 0;
        const setting = await Setting.find({});
        if(coupon){
            const couponDoc = await Coupon.findOne({code:coupon});
            if(couponDoc?.rewardType == 'Discount'){
                if(couponDoc?.discountType == 'FLAT'){
                    //Calculate amount and match
                    discountAmount = couponDoc?.discount;
                }else{
                    discountAmount = Math.min(couponDoc?.discount/100*marginx?.marginXTemplate?.entryFee, couponDoc?.maxDiscount);
                    
                }
            }else{
                if(couponDoc?.discountType == 'Flat'){
                    //Calculate amount and match
                    cashbackAmount = couponDoc?.discount;
                }else{
                    cashbackAmount = Math.min(couponDoc?.discount/100*marginx?.marginXTemplate?.entryFee, couponDoc?.maxDiscount);
                    
                }
                wallet?.transactions?.push({
                    title: 'StoxHero CashBack',
                    description: `Cashback of ${cashbackAmount?.toFixed(2)} - code ${coupon} used`,
                    transactionDate: new Date(),
                    amount:cashbackAmount?.toFixed(2),
                    transactionId: uuid.v4(),
                    transactionType: 'Bonus'
                });
            }
        }
        const totalAmount = ((marginx?.marginXTemplate?.entryFee - discountAmount)*(1+setting[0]?.gstPercentage/100)).toFixed(2);
        console.log('entry fee', entryFee, totalAmount);
        if(totalAmount != entryFee){
            return {
                statusCode:400,
                data:{
                status: "error",
                message:"Incorrect amount",
                }
            }
        }

        const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
            return transaction.transactionType === "Cash";
        });

        const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
            return total + transaction?.amount;
        }, 0);

        if (totalCashAmount < entryFee) {
            return {
                statusCode:400,
                data:{
                status: "error",
                message:"You do not have enough balance to join this marginx. Please add money to your wallet.",
                }
            };
        }

        for (let i = 0; i < marginx?.participants?.length; i++) {
            if (marginx?.participants[i]?.userId?.toString() === userId?.toString()) {
                return {
                    statusCode:400,
                    data:{
                    status: "error",
                    message:"You have already participated in this marginx",
                    }
                };
            }
        }

        if (marginx?.maxParticipants <= marginx?.participants?.length) {
            if (!marginx.potentialParticipants.includes(userId)) {
                marginx.potentialParticipants.push(userId);
                marginx.save();
            }
            return {
                statusCode:400,
                data:{
                status: "error",
                message: "The marginx is already full. We sincerely appreciate your enthusiasm. Please join another marginx",
                }
            };

        }

        const result = await MarginX.findOne({ _id: new ObjectId(marginXId) });

        let obj = {
            userId: userId,
            boughtAt: new Date(),
            fee:entryFee,
            actualPrice:marginx?.marginXTemplate?.entryFee
        }

        result.participants.push(obj);

        // console.log(result)
        // Save the updated document
        await result.save();


        wallet.transactions = [...wallet.transactions, {
            title: 'MarginX Fee',
            description: `Amount deducted for ${marginx?.marginXName} MarginX fee`,
            transactionDate: new Date(),
            amount: (-entryFee),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
        }];
        await wallet.save();

        if (!result || !wallet) {
            return {
                statusCode:404,
                data:{
                status: "error",
                message: "Not found"
                }
            };
        }

        let recipients = [user.email,'team@stoxhero.com'];
        let recipientString = recipients.join(",");
        let subject = "MarginX Fee - StoxHero";
        let message = 
        `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>MarginX Fee Deducted</title>
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
                <h1>MarginX Fee</h1>
                <p>Hello ${user.first_name},</p>
                <p>Thanks for participating in marginX trading! Please find your transaction details below.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${user.last_name}</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>MarginX Name: <span class="password">${marginx?.marginXName}</span></p>
                <p>MarginX Fee: <span class="password">₹${entryFee}/-</span></p>
                </div>
            </body>
            </html>

        `
        if(process.env.PROD === "true"){
            emailService(recipientString,subject,message);
            console.log("Subscription Email Sent")
        }
        if(coupon && cashbackAmount>0){
            await createUserNotification({
                title:'StoxHero Cashback',
                description:`₹${cashbackAmount?.toFixed(2)} added as bonus - ${coupon} code used.`,
                notificationType:'Individual',
                notificationCategory:'Informational',
                productCategory:'MarginX',
                user: user?._id,
                priority:'Medium',
                channels:['App', 'Email'],
                createdBy:'63ecbc570302e7cf0153370c',
                lastModifiedBy:'63ecbc570302e7cf0153370c'  
              });
        }
        await createUserNotification({
            title:'MarginX Fee Deducted',
            description:`₹${marginx?.marginXTemplate?.entryFee} deducted for ${marginx?.marginXName} MarginX Fee`,
            notificationType:'Individual',
            notificationCategory:'Informational',
            productCategory:'MarginX',
            user: user?._id,
            priority:'Medium',
            channels:['App', 'Email'],
            createdBy:'63ecbc570302e7cf0153370c',
            lastModifiedBy:'63ecbc570302e7cf0153370c'  
          });
          if(coupon){
            const product = await Product.findOne({productName:'MarginX'}).select('_id');
            await saveSuccessfulCouponUse(userId, coupon, product?._id);
          }
          return {
            statusCode:200,
            data:{
                status: "success",
                message: "Paid successfully",
                data: result
            }
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode:500,
            data:{
            status: "error",
            message: "Something went wrong",
            error: error.message
            }
        };
    }
}




exports.findMarginXByName = async(req,res) => {
    try{
        console.log('here');
        const {name, date} = req.query;
        console.log(name, date);
        const result = await MarginX.findOne({marginXName: name, startTime:{$gte: new Date(date)}}).
            select('-purchaseIntent -__v -sharedBy -potentialParticipants -__v -createdBy -lastModifiedBy -createdOn -lastModifiedOn').
            populate('marginXTemplate', 'entryFee portfolioValue');
        console.log('result', result);
        if(!result){
            res.status(404).json({
                status: "error",
                message: "No marginxs found",
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

exports.getMarginXAllUsers = async (req, res) => {
    try {
        const pipeline = 
        [
            {
              $lookup: {
                from: "marginxes",
                localField: "marginxId",
                foreignField: "_id",
                as: "marginx",
              },
            },
            {
              $addFields: {
                marginxdetails: {
                  $arrayElemAt: ["$marginx", 0],
                },
              },
            },
            {
              $facet: {
                totalmarginx: [
                  {
                    $group: {
                      _id: {
                        date: {
                          $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        date: "$_id.date",
                      },
                      traders: {
                        $sum: 1,
                      },
                      uniqueUsers: {
                        $addToSet: "$_id.trader",
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: "$_id.date",
                      traders: 1,
                    },
                  },
                  {
                    $sort: {
                      "_id.date": 1,
                    },
                  },
                ],
              },
            },
          ]

        const marginxTraders = await MarginXMockUser.aggregate(pipeline);
        
        try{
        
        const marginxusers = []

        // console.log("Contest Traders:",contestTraders)
        marginxTraders[0].totalmarginx.forEach(entry => {
            const { date, traders } = entry;

            marginxusers.push(
                {
                    date:date, 
                    total: traders
                }
                )
            
                marginxusers.sort((a,b)=>{
                    if(a.date >= b.date) return 1
                    if(a.date < b.date) return -1 
                })
            
        });
        // Create a date-wise mapping of DAUs for different products
        
        const response = {
            status: "success",
            message: "MarginX Users fetched successfully",
            data: marginxusers
        };

        res.status(200).json(response);
    }catch(err){
        console.log(err);
    }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};