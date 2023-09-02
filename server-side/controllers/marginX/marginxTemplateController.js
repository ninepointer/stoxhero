const { default: mongoose } = require('mongoose');
const MarginXTemplate = require('../../models/marginX/marginXTemplate');

exports.createMarginXTemplate = async (req, res) => {
    try {
        const { 
            templateName, portfolioValue, entryFee, status
        } = req.body;

        const getTemplate = await MarginXTemplate.findOne({ templateName: templateName });

        if (getTemplate) {
            return res.status(500).json({
                status: 'error',
                message: "Template is already exist with this name.",
            });
        }

        const template = await MarginXTemplate.create({
            templateName, portfolioValue, entryFee, status, 
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "MarginX Template created successfully",
            data: template
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

// Controller for editing a MarginXTemplate
exports.editMarginXTemplate = async (req, res) => {
    try {
        const { id } = req.params; // ID of the marginX template to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid template ID" });
        }
        const template = await MarginXTemplate.findById(id);

        // Your additional checks and logic go here if necessary

        const result = await MarginXTemplate.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Template not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "MarginX Template updated successfully",
        });
    } catch (error) {
        console.log('error' ,error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating template",
            error: error.message
        });
    }
};

// Controller to fetch all MarginXTemplates
exports.getAllMarginXTemplates = async (req, res) => {
    try {
        const templates = await MarginXTemplate.find({});
        
        res.status(200).json({
            status: 'success',
            data: templates
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching all templates",
            error: error.message
        });
    }
};

// Controller to fetch only "Active" MarginXTemplates
exports.getActiveMarginXTemplates = async (req, res) => {
    try {
        const activeTemplates = await MarginXTemplate.find({ status: 'Active' });
        
        res.status(200).json({
            status: 'success',
            data: activeTemplates
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching active templates",
            error: error.message
        });
    }
};
