const express = require("express");
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const router = express.Router({mergeParams: true});
const {createGroupDiscussion, getBatchGroupDiscussion, getGroupDiscussion, getGroupDiscussions, editGroupDiscussion, approveUser, deleteGroupDiscussion, addUserToGd, selectCandidate, getGdsByCareer, removeUserFromGD, markAttendance} = require('../../controllers/career/groupDiscussion');


router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), createGroupDiscussion).get(Authenticate, restrictTo('Admin', 'Super Admin'), getGroupDiscussions);
router.route('/batch/:id').get(Authenticate, restrictTo('Admin', 'Super Admin'), getBatchGroupDiscussion);
router.route('/career/:careerId').get(Authenticate, restrictTo('Admin', 'Super Admin'), getGdsByCareer);
router.route('/add/:gdId/:userId').patch(Authenticate, restrictTo('Admin', 'Super Admin'), addUserToGd);
router.route('/remove/:gdId/:userId').patch(Authenticate, restrictTo('Admin', 'Super Admin'), removeUserFromGD);
router.route('/mark/:gdId/:userId').patch(Authenticate, restrictTo('Admin', 'Super Admin'), markAttendance);
router.route('/select/:gdId/:userId').patch(Authenticate, restrictTo('Admin', 'Super Admin'), selectCandidate);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), editGroupDiscussion)
                    .delete(Authenticate, restrictTo('Admin', 'Super Admin'), deleteGroupDiscussion).get(Authenticate, restrictTo('Admin', 'Super Admin'), getGroupDiscussion)
router.route('/:id/approve').patch(Authenticate, restrictTo('Admin', 'Super Admin'), approveUser)


module.exports = router;
