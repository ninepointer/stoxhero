const express = require("express");
const router = express.Router();
require("../../db/conn");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const signupController = require('../../controllers/user/signupController');

router.post("/schoolsignup", signupController.schoolSignUp);

router.post("/fetchschools", signupController.fetchSchools);

router.post("/signupintent", signupController.signupIntent);

router.post("/signup", signupController.signup);

router.post("/createusermobile", signupController.createUserMobile );

router.patch("/verifyotp", signupController.verifyOTP);

router.patch("/createuserbyworkshop", signupController.createUserByWorkshop);

router.patch("/createuserbycourse", signupController.createUserByCourse);

router.patch("/resendotp", signupController.resendOTP);

router.get("/signedupusers", Authenticate, restrictTo("Admin", "SuperAdmin"), signupController.signedUpUser);

router.put("/updatesignedupuser/:id", Authenticate, signupController.updateSignedUpUser);

module.exports = router;
