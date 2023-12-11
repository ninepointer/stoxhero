const express = require("express");
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');
const {sendSingleNotification, sendMultiNotifications, sendGroupNotifications, uploadMulter, uploadToS3} = require('../../controllers/pushNotification/pushNotificationController');
const router = express.Router();

router.route('/single').post(Authenticate, sendSingleNotification);
router.route('/multiple').post(Authenticate, sendMultiNotifications);
router.route('/group/:id').post(Authenticate, uploadMulter, uploadToS3, sendGroupNotifications);



module.exports = router;