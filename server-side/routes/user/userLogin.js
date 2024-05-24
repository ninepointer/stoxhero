const express = require("express");
const router = express.Router();
require("../../db/conn");
const { SchoolAuthenticate } = require("../../authentication/schoolAuthentication");
const authentication = require("../../authentication/authentication");
const loginController = require('../../controllers/user/loginController');


router.post("/login", loginController.login);

router.post("/studentpinlogin", loginController.studentPinLogin);

router.post("/schoollogin", loginController.schoolLogin);

router.post("/schooluserlogin", loginController.schoolUserLogin);

router.post("/resetpinotp", loginController.resetPinOtp);

router.post("/phonelogin", loginController.phoneLogin);

router.post("/phoneloginmobile", loginController.phoneLoginMobile);

router.post("/codesavetosignup", loginController.codeSaveToSignup);

router.post("/verifyphonelogin", loginController.verifyPhoneLogin);

router.post("/verifyphoneloginmobile", loginController.verifyPhoneLoginMobile);

router.post("/resendmobileotp", loginController.resendMobileOTP);

router.get("/loginDetail", authentication, loginController.loginDetail);

router.get("/schooldetails", SchoolAuthenticate, loginController.schoolDetails);

router.get("/logout", authentication,  loginController.logOut);

router.get("/schoollogout", SchoolAuthenticate,  loginController.schoolLogout);

router.post("/addfcmtoken", authentication, loginController.addFcmToken);

module.exports = router;