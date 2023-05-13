const express = require("express");
const router = express.Router({mergeParams: true});
const multer = require('multer');
const aws = require('aws-sdk');
const {getUploadsApplication, createCareer, getCareers, editCareer, getCareer, getCareerApplicantions, generateOTP, confirmOTP} = require("../../controllers/careerController");
const authentication = require("../../authentication/authentication")
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
router.route('/generateotp').post(generateOTP);
router.route('/confirmotp').post(confirmOTP);
router.route('/:id').get(getCareer);
router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, createCareer);
router.route('/:id').patch(authentication, editCareer);
router.route('/careerapplications/:id').get(getCareerApplicantions);


module.exports = router;