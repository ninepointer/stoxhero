const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createNotificationGroup, refreshNotificationGroup, getNotificationGroup, 
    getNotificationGroups, editNotificationGroup, getActiveNotificationGroups, getInactiveNotificationGroups, 
    getDraftNotificationGroups, getActiveNotificationGroupsWithoutUsers} = require('../../controllers/notificationGroup/notificationGroupController');
const restrictTo = require('../../authentication/authorization');

router.route('/')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getNotificationGroups)
    .post(Authenticate, restrictTo('Admin', 'Super Admin'), createNotificationGroup)
router.route('/active')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getActiveNotificationGroups)
router.route('/activegroups')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getActiveNotificationGroupsWithoutUsers)
router.route('/inactive')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getInactiveNotificationGroups)
router.route('/draft')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getDraftNotificationGroups)
router.route('/refresh/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), refreshNotificationGroup);
router.route('/:id')
    .get(Authenticate, restrictTo('Admin', 'Super Admin'), getNotificationGroup)
    .patch(Authenticate, restrictTo('Admin', 'Super Admin'), editNotificationGroup)

module.exports = router;