const Leaderboard = require('../../models/LeaderboardParams/leaderboardSchema');
const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');

exports.createLeaderboard = async (req, res) => {
    try {
        let {
            status, frequency, usersPerTable,
            quarterStartDate, quarterEndDate, marginMoneyInterest
        } = req.body;

        const leaderboard = await Leaderboard.create({
            status, frequency, usersPerTable,
            quarterStartDate, quarterEndDate, marginMoneyInterest
        });

        res.status(201).json({
            status: "success",
            message: "Leaderboard created successfully",
            data: leaderboard,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.editLeaderboard = async (req, res) => {
    try {
        const { id } = req.params; // ID of the leaderboard to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid ID" });
        }
        const result = await Leaderboard.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res
                .status(404)
                .json({ status: "error", message: "Leaderboard not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Leaderboard updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error in updating Leaderboard",
            error: error.message,
        });
    }
};

exports.getRewards = async (req, res) => {
    try {
        const { id } = req.params;
        const leaderboard = await Leaderboard.findById(id);
        if (!leaderboard) {
            return res
                .status(404)
                .json({ status: "error", message: "Leaderboard not found" });
        }
        res.status(200).json({
            status: "success",
            message: "rewards fetched",
            data: leaderboard.rewards,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message,
        });
    }
};

exports.addReward = async (req, res, next) => {
    const { id } = req.params;
    const { rankStart, rankEnd, reward, rewardValue, rewardType } = req.body;
    if (rankStart > rankEnd) {
        return res.status(400).json({
            status: "error",
            message: "Start Rank should be less than equal to end Rank",
        });
    }
    try {
        const leaderboard = await Leaderboard.findById(id);
        if (!leaderboard) {
            return res
                .status(404)
                .json({ status: "error", message: "Leaderboard not found" });
        }
        for (let reward of leaderboard.rewards) {
            if (leaderboard.rewards.length > 0) {
                if (
                    (rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
                    (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)
                ) {
                    return res.status(400).json({
                        status: "error",
                        message: "Ranks overlap with existing rewards",
                    });
                }
            }
        }
        leaderboard.rewards.push({ rankStart, rankEnd, reward, rewardValue, rewardType });

        const data = await leaderboard.save({ validateBeforeSave: false, new: true });
        res.status(201).json({ status: "success", message: "Reward added" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message,
        });
    }
};

exports.editReward = async (req, res) => {
    const { rewardId, id } = req.params;
    const { rankStart, rankEnd, reward, rewardValue, rewardType } = req.body;

    if (rankStart > rankEnd) {
        return res.status(400).json({
            status: "error",
            message: "rankStart must be less than rankEnd",
        });
    }

    try {
        const leaderboard = await Leaderboard.findById(id);

        if (!leaderboard) {
            return res
                .status(404)
                .json({ status: "error", message: "Leaderboard not found" });
        }

        const rewardIndex = leaderboard.rewards.findIndex(
            (r) => r._id.toString() === rewardId
        );

        if (rewardIndex === -1) {
            return res
                .status(404)
                .json({ status: "error", message: "Reward not found" });
        }

        // Check for overlap with other rewards, excluding the one being edited
        for (const [index, reward] of leaderboard.rewards.entries()) {
            if (index === rewardIndex) continue; // Skip the current reward being edited
            if (
                (rankStart >= reward.rankStart && rankStart <= reward.rankEnd) ||
                (rankEnd >= reward.rankStart && rankEnd <= reward.rankEnd)
            ) {
                console.log(rankEnd,rankStart, reward.rankEnd, reward.rankStart)
                return res.status(400).json({
                    status: "error",
                    message: "Ranks overlap with existing rewards",
                });
            }
        }

        leaderboard.rewards[rewardIndex] = { rankStart, rankEnd, reward, rewardValue, rewardType };

        await leaderboard.save();

        res
            .status(200)
            .json({ status: "success", message: "Reward updated successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: e.message,
        });
    }
};

exports.deleteReward = async (req, res) => {
    try {
        const { rewardId } = req.params;
        const leaderboard = await Leaderboard.findOneAndUpdate(
            {
                _id: new ObjectId(req.params.id),
            },
            {
                $pull: {
                    rewards: { _id: rewardId }, // Remove instructor with matching id
                },
            },
            { new: true, select: "rewards" }
        );
        if (!leaderboard) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
        res.status(200).json({ data: leaderboard, status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.active = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find({status: 'Active'});
        if (!leaderboard) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
        res.status(200).json({ data: leaderboard, status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.inActive = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find({status: 'Inactive'});
        if (!leaderboard) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
        res.status(200).json({ data: leaderboard, status: "success" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};