const express = require("express");
const router = express.Router({mergeParams: true});
const multer = require('multer');
const aws = require('aws-sdk');
const {getDraftCareers, getRejectedCareers, getUploadsApplication, createCareer, 
      getCareers, editCareer, getCareer, getCareerApplicantions, findCareerByName, getCareerApplicationCount,
      generateOTP, confirmOTP, getSelectedCareerApplicantions, getRejectedApplications, 
      rejectApplication, fetchCareers, applyForCareer} = require("../../controllers/career/careerController");
const authentication = require("../../authentication/authentication");
const restrictTo = require('../../authentication/authorization')
const internBatchRoute = require("./internBatchRoute");
const groupDiscussion = require("./groupDiscussionRoute");

// createTenXSubscription

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: ""
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.route('/').get(getCareers);
router.route('/live').get(fetchCareers);
router.route('/draft').get(getDraftCareers);
router.route('/reject').get(getRejectedCareers);
router.route('/generateotp').post(generateOTP);
router.route('/confirmotp').post(confirmOTP);
router.route('/findbyname').get(findCareerByName);
router.route('/apply').post(authentication, applyForCareer);
router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, restrictTo('Admin', 'Super Admin'), createCareer);
router.route('/careerapplicationcount/:id').get(getCareerApplicationCount);
router.route('/reject/:id').patch(authentication, restrictTo('Admin', 'Super Admin'), rejectApplication);
router.route('/careerapplications/selected/:id').get(authentication, restrictTo('Admin', 'Super Admin'), getSelectedCareerApplicantions);
router.route('/careerapplications/rejected/:id').get(authentication, restrictTo('Admin', 'Super Admin'), getRejectedApplications);
router.route('/careerapplications/:id').get(authentication, restrictTo('Admin', 'Super Admin'), getCareerApplicantions);
router.route('/:id').get(getCareer).patch(authentication, editCareer);
router.use('/:id/batch', internBatchRoute);
router.use('/:id/groupDiscussion', groupDiscussion);

module.exports = router;