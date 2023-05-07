const express = require("express");
const router = express.Router({mergeParams: true});
const multer = require('multer');
const aws = require('aws-sdk');
const {createTenXSubscription, editFeature} = require("../../controllers/tenXSubscriptionController");
const authentication = require("../../authentication/authentication")

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, createTenXSubscription);
router.route('/:id').patch(authentication, editFeature);

module.exports = router;