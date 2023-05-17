const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createBatch, getBatch, getActiveBatch, editBatch, approveUser, deleteBatch} = require('../../controllers/career/internBatch');


router.route('/').post(Authenticate, createBatch).get(getBatch);
router.route('/active').get(getActiveBatch);
router.route('/:id').patch(Authenticate, editBatch).delete(deleteBatch)
router.route('/:id/approve').patch(Authenticate, approveUser)


module.exports = router;
