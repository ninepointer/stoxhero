const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {getUserNotications, getRecentUserNotifications} = require('../../controllers/notification/notificationController');
const restrictTo = require('../../authentication/authorization');

router.route('/me').get(Authenticate, getUserNotications);
router.route('/me/recent').get(Authenticate, getRecentUserNotifications);

module.exports = router;