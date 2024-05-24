const express = require("express");
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');
const {sendSingleNotification, sendMultiNotifications, sendGroupNotifications, uploadMulter, uploadToS3} = require('../../controllers/pushNotification/pushNotificationController');
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};
// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.route('/single').post(Authenticate, sendSingleNotification);
router.route('/multiple').post(Authenticate, sendMultiNotifications);
router.route('/group/:id').post(Authenticate, 
    upload.fields([{ name: "notificationImage", maxCount: 1 }, { name: "csvFile", maxCount: 1 }]),
    sendGroupNotifications);



module.exports = router;