const express = require("express");
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');
const {sendSingleNotification, sendMultiNotifications} = require('../../controllers/pushNotification/pushNotificationController');
const router = express.Router();

router.route('/single').get(Authenticate, sendSingleNotification);
router.route('/multiple').get(Authenticate, sendMultiNotifications);



module.exports = router;