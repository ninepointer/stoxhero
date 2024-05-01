const MarginX = require("../../models/marginX/marginX");
const {ObjectId} = require('mongodb');


exports.completed = async (req, res) => {
    const userId = req.user._id;
    try {
        const complete = await MarginX.aggregate([
            {
                $match: {
                    status: "Completed",
                    payoutStatus: "Completed",
                },
            },
            {
                $unwind: {
                    path: "$participants",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "participants.userId": new ObjectId(
                        userId
                    ),
                    "participants.trades": {
                        $gt: 0,
                    },
                },
            },
            {
                $lookup: {
                    from: "marginx-templates",
                    localField: "marginXTemplate",
                    foreignField: "_id",
                    as: "templates",
                },
            },
            {
                $project: {
                    marginxId: '$_id',
                    isPaid: 1,
                    marginxName: "$marginXName",
                    marginXName: 1,
                    startTime: 1,
                    endTime: 1,
                    isBankNifty: 1,
                    isNifty: 1,
                    isFinNifty: 1,
                    maxParticipants: 1,
                    liveTime: 1,
                    marginXExpiry: 1,
                    rank: '$participants.rank',
                    npnl: '$participants.npnl',
                    gpnl: '$participants.gpnl',
                    return: '$participants.payout',
                    tds: '$participants.tds',
                    entryFee: {
                        $arrayElemAt: ["$templates.entryFee", 0],
                    },
                    portfolioValue: {
                        $arrayElemAt: [
                            "$templates.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    startTime: -1
                }
            }
        ])

        res.status(200).json({
            status: "success",
            data: complete,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error fetching ongoing MarginXs",
            error: error.message,
        });
    }
};

exports.upcoming = async (req, res) => {
    const userId = req.user._id;
    try {
        const complete = await MarginX.aggregate([
            {
                $match: {
                    startTime: { $gt: new Date() },
                    liveTime: { $lt: new Date() },
                    status: "Active",
                },
            },
            {
                $lookup: {
                    from: "marginx-templates",
                    localField: "marginXTemplate",
                    foreignField: "_id",
                    as: "templates",
                },
            },
            {
                $addFields: {
                    isPaid: {
                        $in: [new ObjectId(userId), "$participants.userId"],
                    },
                },
            },
            {
                $project: {
                    marginxId: '$_id',
                    isPaid: 1,
                    marginxName: "$marginXName",
                    marginXName: 1,
                    startTime: 1,
                    endTime: 1,
                    isBankNifty: 1,
                    isNifty: 1,
                    isFinNifty: 1,
                    maxParticipants: 1,
                    liveTime: 1,
                    marginXExpiry: 1,
                    participants: {
                        $size: '$participants'
                    },
                    entryFee: {
                        $arrayElemAt: ["$templates.entryFee", 0],
                    },
                    portfolioValue: {
                        $arrayElemAt: [
                            "$templates.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    entryFee: 1
                }
            }
        ])

        res.status(200).json({
            status: "success",
            data: complete,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error fetching ongoing MarginXs",
            error: error.message,
        });
    }
};

exports.live = async (req, res) => {
    const userId = req.user._id;
    try {
        const complete = await MarginX.aggregate([
            {
                $match: {
                    startTime: { $lte: new Date() },
                    endTime: { $gt: new Date() },
                    status: "Active",
                },
            },
            {
                $lookup: {
                    from: "marginx-templates",
                    localField: "marginXTemplate",
                    foreignField: "_id",
                    as: "templates",
                },
            },
            {
                $addFields: {
                    isPaid: {
                        $in: [new ObjectId(userId), "$participants.userId"],
                    },
                },
            },
            {
                $project: {
                    marginxId: '$_id',
                    isPaid: 1,
                    marginXName: "$marginXName",
                    startTime: 1,
                    endTime: 1,
                    isBankNifty: 1,
                    isNifty: 1,
                    isFinNifty: 1,
                    maxParticipants: 1,
                    liveTime: 1,
                    marginXExpiry: 1,
                    participants: {
                        $size: '$participants'
                    },
                    entryFee: {
                        $arrayElemAt: ["$templates.entryFee", 0],
                    },
                    portfolioValue: {
                        $arrayElemAt: [
                            "$templates.portfolioValue",
                            0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    entryFee: 1
                }
            }
        ])

        res.status(200).json({
            status: "success",
            data: complete,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error fetching ongoing MarginXs",
            error: error.message,
        });
    }
};