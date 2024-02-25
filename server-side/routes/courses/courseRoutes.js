const express = require("express");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();

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

module.exports = router;
