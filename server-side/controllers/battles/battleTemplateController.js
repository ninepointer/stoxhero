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
            data: result,
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
        const templates = await BattleTemplate.find({}).sort({_id:-1});
        
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

exports.getBattleTemplateById = async (req, res) => {
    const id = req.params.id
    try {
        const template = await BattleTemplate.findOne({_id : id});
        
        res.status(200).json({
            status: 'success',
            data: template
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
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await BattleTemplate.countDocuments({ status : 'Active'})
    try {
        const activeTemplates = await BattleTemplate.find({ status: 'Active' }).sort({_id:-1}).skip(skip).limit(limit);
        
        res.status(200).json({
            status: 'success',
            data: activeTemplates,
            results: activeTemplates.length , 
            count: count
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
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await BattleTemplate.countDocuments({ status : 'Inactive'})
    try {
        const inactiveTemplates = await BattleTemplate.find({ status: 'Inactive' }).sort({_id:-1}).skip(skip).limit(limit);
        
        res.status(200).json({
            status: 'success',
            data: inactiveTemplates,
            results: inactiveTemplates.length , 
            count: count
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

exports.getDraftBattleTemplates = async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const count = await BattleTemplate.countDocuments({ status : 'Draft'})
    try {
        const draftTemplates = await BattleTemplate.find({ status: 'Draft' }).sort({_id:-1}).skip(skip).limit(limit);
        
        res.status(200).json({
            status: 'success',
            data: draftTemplates,
            results: draftTemplates.length , 
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching draft templates",
            error: error.message
        });
    }
};
