const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createGroupDiscussion, getBatchGroupDiscussion, getGroupDiscussion, getGroupDiscussions, editGroupDiscussion, approveUser, deleteGroupDiscussion, addUserToGd, selectCandidate} = require('../../controllers/career/groupDiscussion');


router.route('/').post(Authenticate, createGroupDiscussion).get(getGroupDiscussions);
router.route('/batch/:id').get(Authenticate, getBatchGroupDiscussion);
router.route('/add/:gdId/:userId').patch(Authenticate, addUserToGd);
router.route('/select/:gdId/:userId').patch(Authenticate, selectCandidate);
router.route('/:id').patch(Authenticate, editGroupDiscussion)
                    .delete(deleteGroupDiscussion).get(getGroupDiscussion)
router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
