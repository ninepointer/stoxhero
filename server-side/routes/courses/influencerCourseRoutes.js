const express = require("express");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const courseController = require("../../controllers/courses/courseController");
const router = express.Router();

router.get(
    "/awaitingapproval",
    Authenticate,
    courseController.getAwaitingApprovals
);

router.get(
    "/pendingadminapproval",
    Authenticate,
    courseController.getPendingApproval
);

router.get(
    "/published",
    Authenticate,
    courseController.getPublished
);

router.get(
    "/unpublished",
    Authenticate,
    courseController.getUnpublished
);

router.patch(
    "/:id/suggestchange",
    Authenticate,
    courseController.suggestChanges
);


module.exports = router;
