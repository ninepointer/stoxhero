const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const UserDetail = require("../../models/User/userDetailSchema");
const DeactivateUser = require("../../models/User/deactivateUser");
const { ObjectId } = require("mongodb");
const { client, getValue } = require("../../marketData/redisClient");
const sendMail = require("../../utils/emailService");
const mongoose = require("mongoose");


exports.deactivateUser = async (req, res) => {
    try {
      const { deactivatedUser, mobile, email, isMail, reason } = req.body;
  
      const user = await DeactivateUser.findOne({
        deactivatedUser: new ObjectId(deactivatedUser),
      });
  
      if (user) {
        return res.status(500).json({
          status: "error",
          message: "user is already deactivated.",
        });
      }
  
      const contest = await DeactivateUser.create({
        deactivatedUser,
        mobile,
        email,
        reason,
        createdBy: req.user._id,
        lastModifiedBy: req.user._id,
      });
  
      const updateUser = await UserDetail.findByIdAndUpdate(
        new ObjectId(deactivatedUser),
        { status: "Inactive" }
      );
  
      await client.del(`${deactivatedUser.toString()}authenticatedUser`);
      if (isMail) {
        if (process.env.PROD == "true") {
          sendMail(
            email,
            "Account Deactivated - StoxHero",
        
          );
  
          sendMail(
            "team@stoxhero.com",
            "Account Deactivated - StoxHero",
          
          );
        }
      }
  
      // console.log(contest)
      res.status(201).json({
        status: "success",
        message: "user deactivated successfully",
        data: contest,
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