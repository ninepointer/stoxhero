const express = require("express");
const router = express.Router();
const Authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');
const {ObjectId} = require('mongodb');
const pageViewController = require('../../controllers/pageView/pageViewController');

// router.post('/:page', Authentication, pageViewController.createPageView);
router.route('/:page/:pageLink').post(Authentication, pageViewController.createPageView);

module.exports = router;

