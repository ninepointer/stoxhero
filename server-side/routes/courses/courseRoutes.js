const express = require("express");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();
const user = require('./userCourseRoutes');
const influencer = require('./influencerCourseRoutes');

const multer = require("multer");

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.use('/influencer', influencer);
router.use('/user', user);

router
  .route("/")
  .post(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    upload.fields([
      { name: "courseImage", maxCount: 1 },
      { name: "salesVideo", maxCount: 1 },
    ]),
    courseController.createCourse
  )
  .get(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    courseController.getAllCourses
  );

router.route("/info").post(
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "salesVideo", maxCount: 1 },
  ]),
  courseController.createCourseInfo
);

router
  .route("/pricing/:id")
  .patch(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    courseController.setPricing
  );

router.patch(
  "/:id",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "salesVideo", maxCount: 1 },
  ]),
  courseController.editCourse
);

router.patch(
  "/:id/instructor",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  upload.fields([
    { name: "instructorImage", maxCount: 1 },
  ]),
  courseController.addInstructor
);

router.patch(
  "/:id/faq",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.addFaq
);

router.patch(
  "/:id/content",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.addContent
);

router.patch(
  "/:id/benefit",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.addBenefits
);

router.patch(
  "/:id/subtopic/:contentId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.addSubTopic
);

router.patch(
  "/:id/instructor/:instructorId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  upload.fields([
    { name: "instructorImage", maxCount: 1 },
  ]),
  courseController.editInstructor
);

router.patch(
  "/:id/faq/:faqId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.editFaq
);

router.patch(
  "/:id/content/:contentId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.editContent
);

router.patch(
  "/:id/benefit/:benefitId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.editBenefits
);

router.patch(
  "/:id/subtopic/:contentId/:subtopicId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.editSubTopic
);

router.get(
  "/adminpublished",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getAdminPublished
);

router.get(
  "/admindraft",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getAdminDraft
);

router.get(
  "/adminpendingapproval",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getAdminPendingApproval
);

router.get(
  "/adminunpublished",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getAdminUnpublished
);

router.get(
  "/adminawaitingapproval",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getAdminAwaitingApproval
);



router.get(
  "/:id",
  Authenticate,
  // restrictTo("Admin", "SuperAdmin"), todo-vijay
  courseController.getCourseById
);

router.get(
  "/:id/publish",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.coursePublish
);

router.get(
  "/:id/unpublish",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.courseUnpublish
);

router.get(
  "/:id/creatorapproval",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.creatorApproval
);

router.get(
  "/:id/adminapproval",
  Authenticate,
  // restrictTo("Admin", "SuperAdmin"),
  courseController.sendAdminApproval
);

router.get(
  "/:id/instructor",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getCourseInstructor
);

router.get(
  "/:id/faq",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getCourseFAQ
);

router.get(
  "/:id/content",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getCourseContent
);

router.get(
  "/:id/benefit",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.getCourseBenefit
);


router.delete(
  "/:id/instructor/:instructorId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.deleteInstructor
);

router.delete(
  "/:id/faq/:faqId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.deleteFAQ
);

router.delete(
  "/:id/content/:contentId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.deleteContent
);

router.delete(
  "/:id/benefit/:benefitId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.deleteBenefits
);

router.delete(
  "/:id/subtopic/:contentId/:subtopicId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  courseController.deleteSubtopic
);

module.exports = router;
