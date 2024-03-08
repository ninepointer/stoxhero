const express = require("express");
const Authenticate = require("../../authentication/authentication");
// const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();


router.get("/", Authenticate, courseController.getCourseBySlugUser);

router.get(
    "/courses",
    Authenticate,
    courseController.getUserCourses
);

router.get(
    "/mycourses",
    Authenticate,
    courseController.myCourses
);

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

router.get(
    "/:id/checkpaid",
    Authenticate,
    courseController.checkPaidCourses
);

router.get(
    "/:slug/slug",
    // Authenticate,
    courseController.getCourseBySlug
);

router.put(
    "/:id/purchaseintent",
    // Authenticate,
    courseController.purchaseIntent
);

router
  .route("/rating/:id")
  .get(courseController.getCourseRating)
  .post(Authenticate, courseController.addUserRating);

module.exports = router;
