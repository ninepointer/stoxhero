const express = require("express");
const Authenticate = require("../../authentication/authentication");
// const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();

router.get("/mycourses", Authenticate, courseController.getMyCourses);

router.get(
  "/byslug",
  // Authenticate,
  courseController.getCoursesByUserSlug
);

router.patch(
  "/deductcoursefee",
  Authenticate,
  courseController.deductCourseFee
);

router.get("/:id", Authenticate, courseController.getCourseByIdUser);

router.get(
  "/:slug/slug",
  // Authenticate,
  courseController.getCourseBySlug
);
router
  .route("/rating/:id")
  .get(courseController.getCourseRating)
  .post(Authenticate, courseController.addUserRating);

module.exports = router;
