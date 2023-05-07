const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription, editTanx, getActiveTenXSubs} = require("../../controllers/tenXSubscriptionController");
const authentication = require("../../authentication/authentication")

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, createTenXSubscription);
router.route('/active').get(authentication, getActiveTenXSubs);
router.route('/:id').patch(authentication, editTanx);

module.exports = router;