const mongoose = require('mongoose');
const ContestMaster = require('../../models/DailyContest/dailyContestMaster'); // Assuming your model is exported as ContestMaster from the mentioned path
const User = require("../../models/User/userDetailSchema");
const { ObjectId } = require('mongodb');
const Contest = require("../../models/DailyContest/dailyContest")


// Controller for creating a contest
exports.createContest = async (req, res) => {
    try {
        const { contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status, inviteCode } = req.body;

        const getContestMaster = await ContestMaster.findOne({ contestMasterMobile: contestMasterMobile });

        if (getContestMaster) {
            return res.status(500).json({
                status: 'error',
                message: "ContestMaster is already exist with this name.",
            });
        }

        const contest = await ContestMaster.create({
            contestMaster ,contestMasterMobile ,stoxheroPOC ,college ,status, inviteCode,
            createdBy: req.user._id, lastModifiedBy: req.user._id,
        });

        // console.log(contest)
        res.status(201).json({
            status: 'success',
            message: "ContestMaster created successfully",
            data: contest
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

// Controller for editing a contest
exports.editContest = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest to edit
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid contest ID" });
        }

        const result = await ContestMaster.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestMaster not found" });
        }

        res.status(200).json({
            status: 'success',
            message: "ContestMaster updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
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
            return res.status(400).json({ status: "error", message: "Invalid contest ID" });
        }

        const result = await ContestMaster.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ status: "error", message: "ContestMaster not found" });
        }

        res.status(200).json({
            status: "success",
            message: "ContestMaster deleted successfully",
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
// Controller for getting all contests
exports.getAllContestMaster = async (req, res) => {
    try {
        const contests = await ContestMaster.find().populate('contestMaster', 'first_name last_name')
        .populate('college', 'collegeName')
        console.log(contests)
        res.status(200).json({
            status: "success",
            message: "Contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getContestMaster = async (req, res) => {
    const {id} = req.params;
    try {
        const contests = await ContestMaster.findOne({_id: id})

        res.status(200).json({
            status: "success",
            message: "Contests fetched successfully",
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for getting users
exports.contestMasterBySearch = async (req, res) => {
    const searchString = req.query.search;
    try {

        const data = await ContestMaster.aggregate([
            {
              $lookup: {
                from: "user-personal-details",
                localField: "contestMaster",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
              },
            },
            {
              $match: {
                $and: [
                  {
                    $or: [
                      {
                        "user.first_name": {
                          $regex: searchString,
                          $options: "i",
                        },
                      },
                      {
                        "user.last_name": {
                          $regex: searchString,
                          $options: "i",
                        },
                      },
                      {
                        "user.mobile": {
                          $regex: searchString,
                          $options: "i",
                        },
                      },
                    ],
                  },
                  {
                    status: "Active",
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "colleges",
                localField: "college",
                foreignField: "_id",
                as: "college",
              },
            },
            {
              $unwind: {
                path: "$college",
              },
            },
            {
              $project: {
                collegeId: "$college._id",
                collegeName: "$college.collegeName",
                first_name: "$user.first_name",
                last_name: "$user.last_name",
                mobile: "$user.mobile",
                email: "$user.email",
                userId: "$user._id",
                inviteCode: "$inviteCode",
              },
            },
          ])
        res.status(200).json({
            status: "success",
            message: "Getting User successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Controller for adding a user to allowedUsers
exports.addContestMaster = async (req, res) => {
    try {
        const { id, contestMasterId } = req.params; // ID of the contest and the user to add
        const {inviteCode, collegeId} = req.body;
        console.log(inviteCode, collegeId, id, contestMasterId)
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(contestMasterId)) {
            return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
        }

        const result = await Contest.findByIdAndUpdate(
          id,
          {
            $push: {
              contestMaster: { contestMasterId: contestMasterId, addedOn: new Date() },
              collegeCode: inviteCode,
              college: collegeId
            }
          },
          { new: true } // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Contest not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User added to allowedUsers successfully",
            data: result
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.removeContestMaster = async (req, res) => {
  try {
      const { id, contestMasterId } = req.params; // ID of the contest and the user to remove

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(contestMasterId)) {
          return res.status(400).json({ status: "success", message: "Invalid contest ID or user ID" });
      }

      const contest = await Contest.findOne({ _id: id });
      let participants = contest?.contestMaster?.filter((item) => (item.contestMasterId).toString() != contestMasterId.toString());
      contest.contestMaster = [...participants];
      // console.log(contest.allowedUsers, userId)
      await contest.save({ validateBeforeSave: false });

      res.status(200).json({
          status: "success",
          message: "User removed from allowedUsers successfully",
          data: contest
      });
  } catch (error) {
      res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error: error.message
      });
  }
};

exports.getContestMasterIds = async (req, res) => {
  try {
    const ids = await ContestMaster.find().select("contestMaster")

    res.status(200).json({
      status: "success",
      message: "ids fetched successfully",
      data: ids
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message
    });
  }
};