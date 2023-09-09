const mongoose = require('mongoose');
const Battle = require('../../models/battles/battle'); // Modify path to your actual model's location

// Controller for creating a Battle
exports.createBattle = async (req, res) => {
    try {
        const { 
            battleName, battleStartTime, battleEndTime, battleLiveTime, battleTemplate,
            battleStatus, payoutStatus
        } = req.body;

        if(battleStartTime > battleEndTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Start time can't be greater than end time",
            });
        }
        if(battleStartTime < battleLiveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Live time can't be greater than start time",
            });
        }
        if(battleEndTime < battleLiveTime){
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Live time can't be greater than end time",
            });
        }

        const battleStartTimeDate = new Date(battleStartTime);
        battleStartTimeDate.setSeconds(0);

        if (isNaN(battleStartTimeDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: "Validation error: Invalid start time format",
            });
        }

        const existingBattle = await Battle.findOne({ battleName: battleName, battleStartTime: battleStartTimeDate });
        if (existingBattle) {
            return res.status(400).json({
                status: 'error',
                message: "Battle already exists with this name and start time.",
            });
        }

        const battle = await Battle.create({
            battleName, 
            battleStartTime: battleStartTimeDate, 
            battleEndTime, 
            battleLiveTime, 
            battleTemplate,
            battleStatus, 
            payoutStatus, 
            createdBy: req.user._id, 
            lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "Battle created successfully",
            data: battle
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
    try {
        const ongoingBattles = await Battle.find({ 
            battleStartTime: { $lte: now }, 
            battleEndTime: { $gt: now },
            battleStatus: 'Active'
        })
        .sort({ battleStartTime: -1 })
        .populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
        .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
        .populate('battleTemplate', 'battleTemplateName')  // Modify 'templateName' based on the fields of your battle template

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

exports.getUserLiveBattles = async (req, res) => {
    const now = new Date();
    try {
        const ongoingBattles = await Battle.find({
            battleStartTime: { $lte: now },
            battleEndTime: { $gt: now },
            battleStatus: 'Active'
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
    try {
        const upcomingBattles = await Battle.find({
            battleStartTime: { $gt: now },
            battleStatus: 'Active'
        }).sort({ battleStartTime: -1, entryFee: -1 })
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
          .populate('battleTemplate', 'battleTemplateName portfolioValue entryFee');

        res.status(200).json({
            status: 'success',
            data: upcomingBattles
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
            battleStatus: 'Active'
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
exports.getCompletedBattles = async (req, res) => {
    const now = new Date();
    try {
        const completedBattles = await Battle.find({
            battleStatus: 'Completed'
        }).sort({ startTime: -1, entryFee: -1 })
          .populate('participants.userId', 'first_name last_name email mobile creationProcess')
          .populate('sharedBy.userId', 'first_name last_name email mobile creationProcess')
          .populate('potentialParticipants', 'first_name last_name email mobile creationProcess')
          .populate('battleTemplate', 'battleTemplateName portfolioValue entryFee');

        res.status(200).json({
            status: 'success',
            data: completedBattles
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

exports.getBattleById = async (req, res) => {
    try {
        const { id } = req.params; // Extracting id from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid Battle ID" });
        }

        // Fetching the Battle based on the id and populating the necessary fields
        const battle = await Battle.findById(id)
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
