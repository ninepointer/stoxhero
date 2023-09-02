const mongoose = require('mongoose');
const MarginX = require('../../models/marginX/marginX'); // Assuming your model is exported as Contest from the mentioned path
const { ObjectId } = require('mongodb');
const uuid = require("uuid");
const emailService = require("../../utils/emailService");

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
            endTime: { $gt: now } 
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess' )
        .populate('marginXTemplate', 'templateName portfolioValue')

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
            startTime: { $gt: now }
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess')
        .populate('marginXTemplate', 'templateName portfolioValue')
        
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

// Controller to fetch only Completed MarginXs
exports.getCompletedMarginXs = async (req, res) => {
    const now = new Date();
    try {
        const completedMarginXs = await MarginX.find({ 
            endTime: { $lte: now }
        }).populate('participants.userId', 'first_name last_name email mobile creationProcess');
        
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