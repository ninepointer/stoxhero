const { default: mongoose } = require('mongoose');
const BattleTemplate = require('../../models/battle/battleTemplate');


exports.createBattleTemplate = async (req, res) => {
    try {
        const { 
            battleTemplateName, battleType, battleTemplateType, winnerPercentage,
            minParticipants, portfolioValue, platformCommissionPercentage, entryFee,
            gstPercentage, status
        } = req.body;

        const getTemplate = await BattleTemplate.findOne({ battleTemplateName });

        if (getTemplate) {
            return res.status(400).json({
                status: 'error',
                message: "Template already exists with this name.",
            });
        }

        const template = await BattleTemplate.create({
            battleTemplateName, battleType, battleTemplateType, winnerPercentage,
            minParticipants, portfolioValue, platformCommissionPercentage, entryFee,
            gstPercentage, status, 
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "Battle Template created successfully",
            data: template
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

exports.editBattleTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid template ID" });
        }

        const template = await BattleTemplate.findById(id);

        if (!template) {
            return res.status(404).json({ status: "error", message: "Template not found" });
        }

        const result = await BattleTemplate.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({
            status: 'success',
            message: "Battle Template updated successfully",
        });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating template",
            error: error.message
        });
    }
};

exports.getAllBattleTemplates = async (req, res) => {
    try {
        const templates = await BattleTemplate.find({});
        
        res.status(200).json({
            status: 'success',
            data: templates
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching all templates",
            error: error.message
        });
    }
};

exports.getActiveBattleTemplates = async (req, res) => {
    try {
        const activeTemplates = await BattleTemplate.find({ status: 'Active' });
        
        res.status(200).json({
            status: 'success',
            data: activeTemplates
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching active templates",
            error: error.message
        });
    }
};

exports.getInactiveBattleTemplates = async (req, res) => {
    try {
        const inactiveTemplates = await BattleTemplate.find({ status: 'Inactive' });
        
        res.status(200).json({
            status: 'success',
            data: inactiveTemplates
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching inactive templates",
            error: error.message
        });
    }
};
