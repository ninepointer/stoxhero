const express = require("express");
const Authenticate = require("../../authentication/authentication");
// const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();

router.get(
    "/mycourses",
    Authenticate,
    courseController.getMyCourses
);

router.get(
    "/:id",
    Authenticate,
    courseController.getCourseByIdUser
);


module.exports = router;
