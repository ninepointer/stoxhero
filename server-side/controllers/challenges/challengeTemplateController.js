const ChallengeTemplate = require('../../models/challenges/challengeTemplates');  // You'll need to specify the path to your model
const mongoose = require('mongoose');

// Controller for creating a ChallengeTemplate
exports.createChallengeTemplate = async (req, res) => {
    try {
        const { challengeName, stockIndex, startTime, endTime, challengeType, status, challengeParameters } = req.body;
        
        if(startTime>endTime){
            return res.status(500).json({
                status: 'error',
                message: "Validation error: Start Time can\'t be greater than end time",
            });
        }
        const getChallenge = await ChallengeTemplate.findOne({ challengeName: challengeName, startTime: startTime });


        if (getChallenge) {
            return res.status(500).json({
                status: 'error',
                message: "Challenge template already exists with this name.",
            });
        }

        const challenge = await ChallengeTemplate.create({
            challengeName, stockIndex, startTime, endTime, challengeType, status, challengeParameters, 
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "Challenge template created successfully",
            data: challenge
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

// Controller for editing a ChallengeTemplate
exports.editChallengeTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid challenge Template ID" });
        }
        if(updates?.startTime && updates?.endTime && updates?.startTime> updates?.endTime){
            return res.status(500).json({
                status: 'error',
                message: "Validation error: Start Time can\'t be greater than end time",
            });
        }

        const result = await ChallengeTemplate.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "Challenge template not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "Challenge template updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error in updating challenge template",
            error: error.message
        });
    }
};

// Controller to fetch all ChallengeTemplates
exports.getAllChallengeTemplates = async (req, res) => {
    try {
        const challenges = await ChallengeTemplate.find({});
        
        res.status(200).json({
            status: 'success',
            data: challenges
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching all challenge templates",
            error: error.message
        });
    }
};

// Controller to fetch only "Active" ChallengeTemplates
exports.getActiveChallengeTemplates = async (req, res) => {
    try {
        const activeChallenges = await ChallengeTemplate.find({ status: 'Active' });
        
        res.status(200).json({
            status: 'success',
            data: activeChallenges
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching active challenge templates",
            error: error.message
        });
    }
};

// Controller to fetch only "Inactive" ChallengeTemplates
exports.getInactiveChallengeTemplates = async (req, res) => {
    try {
        const inactiveChallenges = await ChallengeTemplate.find({ status: 'Inactive' });
        
        res.status(200).json({
            status: 'success',
            data: inactiveChallenges
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Error fetching inactive challenge templates",
            error: error.message
        });
    }
};

