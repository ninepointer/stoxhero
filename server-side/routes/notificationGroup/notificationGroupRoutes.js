const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createNotificationGroup, refreshNotificationGroup, getNotificationGroup, getNotificationGroups} = require('../../controllers/notificationGroup/notificationGroupController');
const restrictTo = require('../../authentication/authorization');

router.route('/')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getNotificationGroups)
    .post(Authenticate, restrictTo('Admin', 'Super Admin'), createNotificationGroup)
router.route('/refresh').patch(Authenticate, restrictTo('Admin', 'Super Admin'), refreshNotificationGroup);
router.route('/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), getNotificationGroup);

module.exports = router;