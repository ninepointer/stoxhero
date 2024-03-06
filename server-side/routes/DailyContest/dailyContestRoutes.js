const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const contestController = require('../../controllers/dailyContestController');
const registrationController = require('../../controllers/dailyContest/dailyContestRegistrationController');
const regularContestRegistrationController = require('../../controllers/dailyContest/regularContestRegistrationController');
const restrictTo = require('../../authentication/authorization');
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};
// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// Multer configuration for handling file upload
const uploadVid = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // contentType: "video/mp4", // Automatically set the content type
    acl: "public-read", // Set access control for uploaded files
    key: function (req, file, cb) {
      cb(null, "courses/videos" + Date.now() + "-" + file.originalname); // Set key (file path) in S3
    },
  }),
});

const uploadVideo = multer({ storage: multer.memoryStorage() });

const upload = multer({ storage: storage, fileFilter: fileFilter });








router.post('/contest', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.fields([
    { name: "image", maxCount: 1 },
  ]), contestController.createContest);
router.get('/userfeatured', Authenticate, contestController.getUserFeaturedContests);
router.get('/livecontest', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAllLiveContests);
router.get('/paidcontestuserdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.paidContestUserData);
router.get('/freecontestuserdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.freeContestUserData);
router.get('/dailyfreecontestdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyFreeContestData);
router.get('/dailypaidcontestdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyPaidContestData);
router.get('/dailyfreecollegecontestdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyFreeCollegeContestData);
router.get('/dailypaidcollegecontestdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyPaidCollegeContestData);
router.get('/downloadcontestdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.downloadDailyContestData);
router.get('/downloadfreecontestuserdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.downloadFreeContestUserData);
router.get('/downloadpaidcontestuserdata', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.downloadPaidContestUserData);
router.get('/download/:id', Authenticate, contestController.downloadParticipationCertificate);
router.get('/contestleaderboard/:id', Authenticate, contestController.getContestLeaderboardById);
router.get('/contest/dailycontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestUsers);
router.get('/contest/dailyallcontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestAllUsers);
router.get('/contestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getUsers);
router.patch('/feededuct', Authenticate, contestController.deductSubscriptionAmount);
router.get('/weeklytopperformer', Authenticate, contestController.getTopContestWeeklyPortfolio);
router.get('/lastpaidcontestchampions', Authenticate, contestController.getLastPaidContestChampions);
router.get('/weeklytopperformerfulllist', Authenticate, contestController.getTopContestWeeklyPortfolioFullList);
router.get('/contestprofile/:id', Authenticate, contestController.getUserContestProfile);
router.get('/contest/:id', Authenticate, contestController.getContest);
router.get('/usercontestdata/:id', Authenticate, contestController.userContestDetail);
router.get("/:id/faq", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.getFAQ);
router.get("/:id/eventformat", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.getEventFormat);

router.put('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.fields([
    { name: "image", maxCount: 1 },
  ]), contestController.editContest);
router.patch('/switchUser/:contestId', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.switchUser);
router.patch("/:id/faq", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.addFaq);

router.patch("/:id/eventformat", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.addEventFormat);
router.put('/purchaseintent/:id', Authenticate, contestController.purchaseIntent);

router.delete('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.deleteContest);
router.put('/contest/:id/participate', Authenticate, contestController.participateUsers);
router.put('/contest/:id/varifycodeandparticipate', Authenticate, contestController.verifyCollageCode);

router.put('/contest/:id/register',Authenticate, contestController.registerUserToContest);
router.put('/contest/:id/share',Authenticate, contestController.copyAndShare);

// router.put('/contest/:id/allow/:userId', contestController.addAllowedUser);
// router.put('/contest/:id/remove/:userId', contestController.removeAllowedUser);

// Routes for getting contests 
router.get('/contests', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAllContests);
router.route('/:id/rewards').get(contestController.getRewards).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.addReward);
router.route('/:id/rewards/:rewardId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.editReward);
router.patch("/:id/faq/:faqId", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.editFaq);
router.patch("/:id/eventformat/:eventId", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.editEventFormat);
router.get('/contests/upcoming', Authenticate, contestController.getUpcomingContests);
router.get('/contests/userlive', Authenticate, contestController.getUserLiveContests);
router.get('/collegecontests/userupcoming', Authenticate, contestController.getCollegeUserUpcomingContests);
router.get('/collegecontests/userlive', Authenticate, contestController.getCollegeUserLiveContests);
router.get('/contests/userupcoming', Authenticate, contestController.getUserUpcomingContests);
router.get('/collegecontest/getregistrations/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCollegeContestRegistrations);

router.get('/contests/onlyupcoming', Authenticate, contestController.getOnlyUpcomingContests);

router.get('/contests/today', Authenticate, contestController.todaysContest);
router.get('/contests/ongoing', Authenticate, contestController.ongoingContest);

router.get('/contests/adminupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAdminUpcomingContests);
router.get('/contests/featuredupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getFeaturedUpcomingContests);
router.get('/contests/featuredongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getFeaturedOngoingContests);
router.get('/contests/collegeupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCollegeUpcomingContests);
router.get('/contests/collegeongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCollegeOngoingContests);
router.get('/contests/adminongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.ongoingContestAdmin);
router.get('/contests/completed', Authenticate, contestController.getCompletedContests);
router.get('/contests/usercompleted', Authenticate, contestController.getUserCompletedContests);
router.get('/contests/usercollegecompleted', Authenticate, contestController.getUserCollegeCompletedContests);

router.get('/contests/collegeupcoming', Authenticate, contestController.getUpcomingCollegeContests);
router.get('/contests/collegecompleted', Authenticate, contestController.getCompletedCollegeContests);

router.get('/contests/completedadminLive', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCommpletedContestsAdminLive);
router.get('/contests/completedadmin', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCommpletedContestsAdmin);
router.get('/findbyname', contestController.findContestByName);
router.get('/featured/findbyname', contestController.findFeaturedContestByName);
router.post('/generateotp', registrationController.generateOTP);
router.patch('/featured/createuser', regularContestRegistrationController.createUser);
router.post('/confirmotp', registrationController.confirmOTP);
router.post('/featured/confirmotp', regularContestRegistrationController.confirmOTP);
router.get('/featured/getregistrations/:id', regularContestRegistrationController.getRegistrations);
router.get('/registrationcount', Authenticate, registrationController.registeredCount);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDraftContests);


router.delete("/:id/faq/:faqId", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.deleteFAQ);
router.delete("/:id/eventformat/:eventId", Authenticate, restrictTo("Admin", "SuperAdmin"), contestController.deleteEventFormat);


module.exports=router;