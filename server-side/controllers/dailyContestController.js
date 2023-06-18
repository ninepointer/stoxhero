const mongoose = require('mongoose');
const Contest = require('../models/Contest'); // Assuming your model is exported as Contest from the mentioned path

// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const contest = new Contest(req.body);
        const result = await contest.save();
        res.status(201).json({
            message: "Contest created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in creating contest",
            error: error.message
        });
    }
};

// Controller for editing a contest
exports.editContest = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contest ID" });
        }

        const result = await Contest.findByIdAndUpdate(id, updates, { new: true }); // new: true returns the updated document

        if (!result) {
            return res.status(404).json({ message: "Contest not found" });
        }

        res.status(200).json({
            message: "Contest updated successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in updating contest",
            error: error.message
        });
    }
};

// Controller for deleting a contest
exports.deleteContest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contest ID" });
        }

        const result = await Contest.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Contest not found" });
        }

        res.status(200).json({
            message: "Contest deleted successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in deleting contest",
            error: error.message
        });
    }
};
