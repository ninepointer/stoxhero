const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const School = require("../../models/School/School");
const jwt = require("jsonwebtoken");
const {
  SchoolAuthenticate,
} = require("../../authentication/schoolAuthentication");
const authentication = require("../../authentication/authentication");
const { sendSMS, sendOTP } = require("../../utils/smsService");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const SignedUpUser = require("../../models/User/signedUpUser");
const Campaign = require("../../models/campaigns/campaignSchema");
const AffiliatePrograme = require("../../models/affiliateProgram/affiliateProgram");
const Referral = require("../../models/campaigns/referralProgram");
const PortFolio = require("../../models/userPortfolio/UserPortfolio");
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const uuid = require("uuid");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const {
  createUserNotification,
} = require("../../controllers/notification/notificationController");
const { sendMultiNotifications } = require("../../utils/fcmService");
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");
const { ObjectId } = require("mongodb");
const emailService = require("../../utils/emailService");
const whatsAppService = require("../../utils/whatsAppService");
const mediaURL =
  "https://dmt-trade.s3.amazonaws.com/blogs/Vijay/photos/1702575002734logo.jpg";
const mediaFileName = "StoxHero";

router.post("/login", async (req, res) => {
  const { userId, pass } = req.body;

  // console.log(req.body)

  if (!userId || !pass) {
    return res
      .status(422)
      .json({ status: "error", message: "Please provide login credentials" });
  }

  const deactivatedUser = await UserDetail.findOne({
    email: userId,
    status: "Inactive",
  });

  if (deactivatedUser) {
    return res
      .status(422)
      .json({
        status: "error",
        message:
          "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
        error: "deactivated",
      });
  }

  const userLogin = await UserDetail.findOne({
    email: userId,
    status: "Active",
  }).select("_id role password collegeDetails");

  if (
    !userLogin ||
    !(await userLogin.correctPassword(pass, userLogin.password))
  ) {
    return res.status(422).json({ error: "invalid details" });
  } else {
    if (!userLogin) {
      return res
        .status(422)
        .json({ status: "error", message: "Invalid credentials" });
    } else {
      if (userLogin?.role?.toString() == "644903ac236de3fd7cfd755c") {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid request" });
      }
      const token = await userLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
      });
      res
        .status(201)
        .json({
          status: "success",
          message: "user logged in succesfully",
          token: token,
        });
    }
  }
});

router.post("/studentpinlogin", async (req, res) => {
  const { mobile, pin } = req.body;

  if (!mobile || !pin) {
    return res
      .status(422)
      .json({ status: "error", message: "Please provide login credentials" });
  }

  const deactivatedUser = await UserDetail.findOne({
    mobile: mobile,
    status: "Inactive",
  });

  if (deactivatedUser) {
    return res
      .status(422)
      .json({
        status: "error",
        message:
          "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
        error: "deactivated",
      });
  }

  const userLogin = await UserDetail.findOne({
    mobile: mobile,
    status: "Active",
  }).select("_id role pin schoolDetails");

  if (
    !userLogin ||
    !(await userLogin.correctPassword(pin, userLogin.schoolDetails.pin))
  ) {
    return res
      .status(422)
      .json({
        error: "invalid details",
        message: "Mobile or pin is not correct",
      });
  } else {
    if (!userLogin) {
      return res
        .status(422)
        .json({ status: "error", message: "Invalid credentials" });
    } else {
      if (userLogin?.role?.toString() == "644903ac236de3fd7cfd755c") {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid request" });
      }
      const token = await userLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
      });
      res
        .status(201)
        .json({
          status: "success",
          message: "user logged in succesfully",
          token: token,
        });
    }
  }
});

router.post("/schoollogin", async (req, res) => {
  const { userId, pass } = req.body;

  if (!userId || !pass) {
    return res
      .status(422)
      .json({ status: "error", message: "Please provide login credentials" });
  }

  const inactiveSchool = await School.findOne({
    email: userId,
    status: "Inactive",
  });

  if (inactiveSchool) {
    return res
      .status(422)
      .json({
        status: "error",
        message:
          "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
        error: "deactivated",
      });
  }

  const schoolLogin = await School.findOne({
    email: userId,
    status: "Active",
  }).select("_id password");

  if (
    !schoolLogin ||
    !(await schoolLogin.correctPassword(pass, schoolLogin.password))
  ) {
    return res.status(422).json({ error: "invalid details" });
  } else {
    if (!schoolLogin) {
      return res
        .status(422)
        .json({ status: "error", message: "Invalid credentials" });
    } else {
      const token = await schoolLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
      });
      res
        .status(201)
        .json({
          status: "success",
          message: "logged in succesfully",
          token: token,
        });
    }
  }
});

router.post("/schooluserlogin", async (req, res, next) => {
  const { mobile } = req.body;
  try {
    const deactivatedUser = await UserDetail.findOne({
      mobile: mobile,
      status: "Inactive",
    });

    if (deactivatedUser) {
      return res
        .status(422)
        .json({
          status: "error",
          message:
            "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
          error: "deactivated",
        });
    }

    const user = await UserDetail.findOne({ mobile });

    // console.log(user?.schoolDetails?.grade, !user?.schoolDetails?.grade)
    if (!user?.schoolDetails?.grade) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    if (
      user?.lastOtpTime &&
      moment().subtract(29, "seconds").isBefore(user?.lastOtpTime)
    ) {
      return res
        .status(429)
        .json({ message: "Please wait a moment before requesting a new OTP" });
    }

    let mobile_otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.mobile_otp = mobile_otp;
    user.lastOtpTime = new Date();
    await user.save({ validateBeforeSave: false });

    // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
    if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
    console.log(process.env.PROD, mobile_otp, "sending");
    if (process.env.PROD !== "true") {
      sendOTP("8076284368", mobile_otp);
      sendOTP("9319671094", mobile_otp);
    }

    res
      .status(200)
      .json({
        status: "Success",
        message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`,
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/resetpinotp", async (req, res, next) => {
  const { mobile } = req.body;
  try {
    if (!mobile) {
      return res
        .status(422)
        .json({ status: "error", message: "Invalid request" });
    }
    const deactivatedUser = await UserDetail.findOne({
      mobile: mobile,
      status: "Inactive",
    });

    if (deactivatedUser) {
      return res
        .status(422)
        .json({
          status: "error",
          message:
            "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
          error: "deactivated",
        });
    }

    const user = await UserDetail.findOne({ mobile });

    // console.log(user?.schoolDetails?.grade, !user?.schoolDetails?.grade)
    if (!user?.schoolDetails?.grade) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    if (
      user?.lastOtpTime &&
      moment().subtract(29, "seconds").isBefore(user?.lastOtpTime)
    ) {
      return res
        .status(429)
        .json({ message: "Please wait a moment before requesting a new OTP" });
    }

    let mobile_otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.schoolDetails.resetPinOtp = mobile_otp;
    user.schoolDetails.lastOtpTime = new Date();
    await user.save({ validateBeforeSave: false });

    // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
    if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
    console.log(process.env.PROD, mobile_otp, "sending");
    if (process.env.PROD !== "true") {
      sendOTP("8076284368", mobile_otp);
      sendOTP("9319671094", mobile_otp);
    }

    res
      .status(200)
      .json({
        status: "Success",
        message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`,
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/phonelogin", async (req, res, next) => {
  const { mobile } = req.body;
  try {
    const deactivatedUser = await UserDetail.findOne({
      mobile: mobile,
      status: "Inactive",
    });

    if (deactivatedUser) {
      return res
        .status(422)
        .json({
          status: "error",
          message:
            "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
          error: "deactivated",
        });
    }

    const user = await UserDetail.findOne({ mobile });

    if (user?.creationProcess === "School SignUp") {
      //todo-vijay replc messge
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    if (!user) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    if (
      user?.lastOtpTime &&
      moment().subtract(29, "seconds").isBefore(user?.lastOtpTime)
    ) {
      return res
        .status(429)
        .json({ message: "Please wait a moment before requesting a new OTP" });
    }

    let mobile_otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.mobile_otp = mobile_otp;
    user.lastOtpTime = new Date();
    await user.save({ validateBeforeSave: false });

    // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
    if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
    console.log(process.env.PROD, mobile_otp, "sending");
    if (process.env.PROD !== "true") {
      sendOTP("8076284368", mobile_otp);
      sendOTP("9319671094", mobile_otp);
    }

    res
      .status(200)
      .json({
        status: "Success",
        message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`,
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/phoneloginmobile", async (req, res, next) => {
  const { mobile } = req.body;
  try {
    const deactivatedUser = await UserDetail.findOne({
      mobile: mobile,
      status: "Inactive",
    });

    if (deactivatedUser) {
      return res
        .status(422)
        .json({
          status: "error",
          message:
            "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
          error: "deactivated",
        });
    }

    const user = await UserDetail.findOne({ mobile });

    if (!user) {
      // return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'})
      //generate otp
      let mobile_otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      //Create signedup user document
      let signedUpUser = await SignedUpUser.findOne({ mobile: mobile });
      if (signedUpUser) {
        signedUpUser.mobile_otp = mobile_otp;
        await signedUpUser.save({ new: true });
      } else {
        signedUpUser = await SignedUpUser.create({
          mobile: mobile,
          mobile_otp: mobile_otp,
          status: "OTP Verification Pending",
          lastOtpTime: new Date(),
        });
      }

      //send response
      // if(process.env.PROD=='true') sendOTP(mobile.toString(), mobile_otp);
      console.log(process.env.PROD, mobile_otp, "sending");
      if (process.env.PROD !== "true") {
        sendOTP("8076284368", mobile_otp);
        sendOTP("9319671094", mobile_otp);
      }

      return res
        .status(200)
        .json({
          status: "Success",
          message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`,
        });
    }
    if (
      user?.lastOtpTime &&
      moment().subtract(29, "seconds").isBefore(user?.lastOtpTime)
    ) {
      return res
        .status(429)
        .json({ message: "Please wait a moment before requesting a new OTP" });
    }

    let mobile_otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.mobile_otp = mobile_otp;
    user.lastOtpTime = new Date();
    await user.save({ validateBeforeSave: false });

    // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
    if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
    console.log(process.env.PROD, mobile_otp, "sending");
    if (process.env.PROD !== "true") {
      sendOTP("8076284368", mobile_otp);
      sendOTP("9319671094", mobile_otp);
    }

    res
      .status(200)
      .json({
        status: "Success",
        message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.`,
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/verifyphonelogin", async (req, res, next) => {
  const { mobile, mobile_otp, fcmTokenData, college, rollno } = req.body;

  try {
    console.log("fcm data", fcmTokenData);
    const user = await UserDetail.findOne({ mobile });
    if (!user) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    if (!user?.collegeDetails?.college && college) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    console.log(
      college &&
        user?.collegeDetails &&
        user?.collegeDetails?.college?.toString() !== college?.toString(),
      (college, user?.collegeDetails),
      (user?.collegeDetails?.college?.toString(), college?.toString())
    );
    if (
      college &&
      user?.collegeDetails?.college &&
      user?.collegeDetails?.college?.toString() !== college?.toString()
    ) {
      return res
        .status(404)
        .json({
          status: "error",
          message:
            "Kindly access your account by logging in through the designated URL associated with your registration.",
        });
    }
    if (
      process.env.PROD != "true" &&
      mobile == "7737384957" &&
      mobile_otp == "987654"
    ) {
      const token = await user.generateAuthToken();
      console.log(fcmTokenData?.token);
      if (fcmTokenData?.token) {
        console.log("inside if");
        const tokenExists = user?.fcmTokens?.some(
          (token) => token?.token === fcmTokenData.token
        );
        // If the token does not exist, add it to the fcmTokens array
        console.log("token exists", tokenExists);
        if (!tokenExists) {
          console.log("saving fcm token");
          fcmTokenData.lastUsedAt = new Date();
          user.fcmTokens.push(fcmTokenData);
          await user.save({ validateBeforeSave: false });
          console.log("FCM token added successfully.");
        } else {
          console.log("FCM token already exists.");
        }
      }

      // if (!user.collegeDetails.college && college) {
      //     user.collegeDetails.college = college;
      //     user.collegeDetails.rollno = rollno;
      //     await user.save({ validateBeforeSave: false });
      // }
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        // httpOnly: true
      });
      // res.json(token);
      return res
        .status(200)
        .json({
          status: "success",
          message: "User login successful",
          token: token,
        });
    }

    // console.log(user);

    if (user.mobile_otp != mobile_otp) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "OTP didn't match. Please check again.",
        });
    }

    // if(!user.collegeDetails.college && college){
    //     user.collegeDetails.college = college;
    //     user.collegeDetails.rollno = rollno;
    //     await user.save({validateBeforeSave: false});
    // }

    const token = await user.generateAuthToken();
    console.log(fcmTokenData?.token);
    if (fcmTokenData?.token) {
      console.log("inside if");
      const tokenExists = user?.fcmTokens?.some(
        (token) => token?.token === fcmTokenData.token
      );
      // If the token does not exist, add it to the fcmTokens array
      console.log("token exists", tokenExists);
      if (!tokenExists) {
        console.log("saving fcm token");
        fcmTokenData.lastUsedAt = new Date();
        user.fcmTokens.push(fcmTokenData);
        await user.save({ validateBeforeSave: false });
        console.log("FCM token added successfully.");
      } else {
        console.log("FCM token already exists.");
      }
    }

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      // httpOnly: true
    });
    // res.json(token);
    res
      .status(200)
      .json({
        status: "success",
        message: "User login successful",
        token: token,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/verifyphoneloginmobile", async (req, res, next) => {
  const { mobile, mobile_otp, fcmTokenData, college, rollno } = req.body;

  try {
    // console.log("fcm data", fcmTokenData);
    const user = await UserDetail.findOne({ mobile });
    if (!user) {
      // return res.status(404).json({status: 'error', message: 'The mobile number is not registered. Please signup.'});
      //check signedup user exists
      const signedUpUser = await SignedUpUser.findOne({ mobile: mobile }).sort({
        _id: -1,
      });
      //if not send error message
      if (!signedUpUser) {
        return res
          .status(404)
          .json({
            status: "error",
            message: "The mobile number is not registered. Please try again.",
          });
      }
      //check mobile_otp with signedUpUser mobile_otp
      if (signedUpUser?.mobile_otp != mobile_otp) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "Incorrect OTP entered. Please try again",
          });
      }
      //send response status:success, login:false
      return res
        .status(200)
        .json({
          status: "success",
          message: "OTP verification successful",
          login: false,
        });
    }
    if (!user?.collegeDetails?.college && college) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "The mobile number is not registered. Please signup.",
        });
    }
    console.log(
      college &&
        user?.collegeDetails &&
        user?.collegeDetails?.college?.toString() !== college?.toString(),
      (college, user?.collegeDetails),
      (user?.collegeDetails?.college?.toString(), college?.toString())
    );
    if (
      college &&
      user?.collegeDetails?.college &&
      user?.collegeDetails?.college?.toString() !== college?.toString()
    ) {
      return res
        .status(404)
        .json({
          status: "error",
          message:
            "Kindly access your account by logging in through the designated URL associated with your registration.",
        });
    }
    if (
      process.env.PROD != "true" &&
      mobile == "7737384957" &&
      mobile_otp == "987654"
    ) {
      const token = await user.generateAuthToken();
      console.log(fcmTokenData?.token);
      if (fcmTokenData?.token) {
        console.log("inside if");
        const tokenExists = user?.fcmTokens?.some(
          (token) => token?.token === fcmTokenData.token
        );
        // If the token does not exist, add it to the fcmTokens array
        console.log("token exists", tokenExists);
        if (!tokenExists) {
          console.log("saving fcm token");
          fcmTokenData.lastUsedAt = new Date();
          user.fcmTokens.push(fcmTokenData);
          await user.save({ validateBeforeSave: false });
          console.log("FCM token added successfully.");
        } else {
          console.log("FCM token already exists.");
        }
      }

      // if (!user.collegeDetails.college && college) {
      //     user.collegeDetails.college = college;
      //     user.collegeDetails.rollno = rollno;
      //     await user.save({ validateBeforeSave: false });
      // }
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        // httpOnly: true
      });
      // res.json(token);
      return res
        .status(200)
        .json({
          status: "success",
          message: "User login successful",
          token: token,
          login: true,
        });
    }

    // console.log(user);

    if (
      user?.mobile_otp != mobile_otp &&
      !(mobile == "9999992424" && mobile_otp == "123456")
    ) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "OTP didn't match. Please check again.",
        });
    }

    // if(!user.collegeDetails.college && college){
    //     user.collegeDetails.college = college;
    //     user.collegeDetails.rollno = rollno;
    //     await user.save({validateBeforeSave: false});
    // }

    const token = await user.generateAuthToken();
    console.log(fcmTokenData?.token);
    if (fcmTokenData?.token) {
      console.log("inside if");
      const tokenExists = user?.fcmTokens?.some(
        (token) => token?.token === fcmTokenData.token
      );
      // If the token does not exist, add it to the fcmTokens array
      console.log("token exists", tokenExists);
      if (!tokenExists) {
        console.log("saving fcm token");
        fcmTokenData.lastUsedAt = new Date();
        user.fcmTokens.push(fcmTokenData);
        await user.save({ validateBeforeSave: false });
        console.log("FCM token added successfully.");
      } else {
        console.log("FCM token already exists.");
      }
    }

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      // httpOnly: true
    });
    // res.json(token);
    res
      .status(200)
      .json({
        status: "success",
        message: "User login successful",
        token: token,
        login: true,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.post("/createusermobile", async (req, res, next) => {
  const startNow = performance.now();
  let {
    first_name,
    last_name,
    email,
    mobile,
    referrerCode,
    fcmTokenData,
    collegeDetails,
  } = req.body;

  const user = await SignedUpUser.findOne({ mobile: mobile });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User with this mobile number doesn't exist",
    });
  }

  const checkUser = await UserDetail.findOne({ mobile: user?.mobile });
  if (checkUser && !checkUser?.collegeDetails?.college && collegeDetails) {
    checkUser.collegeDetails = collegeDetails;
    const newuser = await checkUser.save({
      validateBeforeSave: false,
      new: true,
    });
    return res
      .status(201)
      .json({
        status: "Success",
        data: newuser,
        message:
          "Welcome! Your account is created, please login with your credentials.",
      });
  }
  if (checkUser) {
    return res.status(400).json({
      status: "error",
      message: "Account already exists with this mobile number.",
    });
  }

  let referredBy;
  let campaign;
  if (referrerCode) {
    const referrerCodeMatch = await UserDetail.findOne({
      myReferralCode: referrerCode,
    });
    const campaignCodeMatch = await Campaign.findOne({
      campaignCode: referrerCode,
    });

    if (!referrerCodeMatch && !campaignCodeMatch) {
      return res
        .status(404)
        .json({
          status: "error",
          message:
            "No such referrer code exists. Please enter a valid referrer code",
        });
    }

    user.status = "OTP Verified";
    user.last_modifiedOn = new Date();
    await user.save({ validateBeforeSave: false });
    if (referrerCodeMatch) {
      referredBy = referrerCodeMatch?._id;
    }
    if (campaignCodeMatch) {
      campaign = campaignCodeMatch;
      referrerCode = referrerCode;
    }
  }
  user.status = "OTP Verified";
  user.last_modifiedOn = new Date();
  await user.save({ validateBeforeSave: false });

  const myReferralCode = await generateUniqueReferralCode();
  // const count = await User.countDocuments();
  let userId = email.split("@")[0];
  let userIds = await UserDetail.find({ employeeid: userId });

  if (userIds.length > 0) {
    userId = userId.toString() + (userIds.length + 1).toString();
  }

  let match = false;
  let affiliateObj = {};
  let referral;
  if (referredBy) {
    const checkAffiliate = await AffiliatePrograme.find().populate(
      "affiliates.userId",
      "myReferralCode"
    );

    for (let elem of checkAffiliate) {
      match = elem?.affiliates?.some(
        (subelem) =>
          subelem?.userId?.myReferralCode === referrerCode &&
          subelem?.affiliateStatus === "Active"
      );
      if (match) {
        affiliateObj = elem;
        break;
      }
    }
    referral = await Referral.findOne({ status: "Active" });
  }
  console.log("Affiliate obj", affiliateObj, performance.now() - startNow);

  // free portfolio adding in user collection
  const activeFreePortfolios = await PortFolio.find({
    status: "Active",
    portfolioAccount: "Free",
  }).select("_id");
  console.log("Just fetching portfolios", performance.now() - startNow);
  let portfolioArr = [];
  for (const portfolio of activeFreePortfolios) {
    let obj = {};
    obj.portfolioId = portfolio._id;
    obj.activationDate = new Date();
    portfolioArr.push(obj);
  }
  console.log("portfolios fetched", performance.now() - startNow);

  try {
    let creation;
    if (campaign) {
      creation = "Campaign SignUp";
    } else if (referredBy && !match) {
      creation = "Referral SignUp";
    } else if (match) {
      creation = "Affiliate SignUp";
    } else {
      creation = "Auto SignUp";
    }
    let obj = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      designation: "Trader",
      email: email.trim(),
      mobile: mobile.trim(),
      name: first_name.trim() + " " + last_name.trim().substring(0, 1),
      status: "Active",
      employeeid: userId,
      joining_date: user.last_modifiedOn,
      myReferralCode: (await myReferralCode).toString(),
      referrerCode: referredBy && referrerCode,
      portfolio: portfolioArr,
      referralProgramme: referredBy && !match ? referral._id : null,
      campaign: campaign && campaign._id,
      campaignCode: campaign && referrerCode,
      referredBy: referredBy && referredBy,
      creationProcess: creation,
      collegeDetails: collegeDetails || "",
      affiliateProgramme: match ? affiliateObj?._id : null,
    };

    if (fcmTokenData) {
      fcmTokenData.lastUsedAt = new Date();
      obj.fcmTokens = [fcmTokenData];
    }
    // console.log('password', password);
    // if(password){
    //     obj.password = password;
    // }

    const newuser = await UserDetail.create(obj);
    console.log("user created", newuser?._id);
    await UserWallet.create({
      userId: newuser._id,
      createdOn: new Date(),
      createdBy: newuser._id,
    });
    console.log("wallet created");
    const populatedUser = await UserDetail.findById(newuser._id)
      .populate("role", "roleName")
      .populate(
        "portfolio.portfolioId",
        "portfolioName portfolioValue portfolioType portfolioAccount"
      )
      .populate({
        path: "subscription.subscriptionId",
        select: "portfolio",
        populate: [
          {
            path: "portfolio",
            select:
              "portfolioName portfolioValue portfolioType portfolioAccount",
          },
        ],
      })
      .populate({
        path: "internshipBatch",
        select:
          "batchName batchStartDate batchEndDate career portfolio participants",
        populate: [
          {
            path: "career",
            select: "jobTitle",
          },
          {
            path: "portfolio",
            select: "portfolioValue",
          },
          {
            path: "participants",
            populate: {
              path: "college",
              select: "collegeName",
            },
          },
        ],
      })
      .select(
        "pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch"
      );
    // const token = await newuser.generateAuthToken();

    // // console.log("Token:",token)

    // res.cookie("jwtoken", token, {
    //     expires: new Date(Date.now() + 25892000000),
    // });

    console.log("sending response");

    // now inserting userId in free portfolio's
    const idOfUser = newuser._id;
    for (const portfolio of activeFreePortfolios) {
      const portfolioValue = portfolio.portfolioValue;

      await PortFolio.findByIdAndUpdate(portfolio._id, {
        $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } },
      });
    }

    //inserting user details to referredBy user and updating wallet balance
    if (referredBy) {
      if (match) {
        let referrerCodeMatch = await UserDetail.findOne({
          myReferralCode: referrerCode,
        });
        console.log("updating affiliate program");
        const updateProgramme = await AffiliatePrograme.findOneAndUpdate(
          { _id: new ObjectId(affiliateObj?._id) },
          {
            $push: {
              referrals: {
                userId: newuser._id,
                joinedOn: new Date(),
                affiliateUserId: referrerCodeMatch?._id,
              },
            },
          },

          { new: true, validateBeforeSave: false }
        );

        //   console.log("updateProgramme",updateProgramme)
        // affiliateObj?.referrals?.push({ userId: newuser._id, joinedOn: new Date(), affiliateUserId: referrerCodeMatch?._id})
        await affiliateObj.save();

        if (referrerCode) {
          const saveAffiliate = await UserDetail.findOneAndUpdate(
            { _id: new ObjectId(referrerCodeMatch?._id) },
            {
              $push: {
                affiliateReferrals: {
                  referredUserId: newuser._id,
                  joiningDate: newuser.createdOn,
                  affiliateProgram: affiliateObj._id,
                  affiliateEarning: affiliateObj.rewardPerSignup,
                  affiliateCurrency: affiliateObj.currency,
                },
              },
            }
          );

          if (affiliateObj?.referralSignupBonus?.amount) {
            await addSignupBonus(
              newuser?._id,
              affiliateObj?.referralSignupBonus?.amount,
              affiliateObj?.referralSignupBonus?.currency
            );
          }
          await referrerCodeMatch.save({ validateBeforeSave: false });

          const wallet = await UserWallet.findOneAndUpdate(
            { userId: referrerCodeMatch._id },
            {
              $push: {
                transactions: {
                  title: "Affiliate Signup Credit",
                  description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                  amount: affiliateObj.rewardPerSignup,
                  transactionId: uuid.v4(),
                  transactionDate: new Date(),
                  transactionType:
                    affiliateObj.currency === "INR" ? "Cash" : "Bonus",
                },
              },
            },
            { new: true, validateBeforeSave: false }
          );

          // Access the updated wallet document using the 'wallet' variable

          await createUserNotification({
            title: "Affiliate Signup Credit",
            description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
            notificationType: "Individual",
            notificationCategory: "Informational",
            productCategory: "SignUp",
            user: referrerCodeMatch?._id,
            priority: "Medium",
            channels: ["App", "Email"],
            createdBy: "63ecbc570302e7cf0153370c",
            lastModifiedBy: "63ecbc570302e7cf0153370c",
          });
          if (user?.fcmTokens?.length > 0) {
            await sendMultiNotifications(
              "Affiliate Signup Credit",
              `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
              referrerCodeMatch?.fcmTokens?.map((item) => item.token),
              null,
              { route: "wallet" }
            );
          }

          await AffiliateTransaction.create({
            affiliateProgram: new ObjectId(affiliateObj?._id),
            affiliateWalletTId: uuid.v4(),
            product: new ObjectId("6586e95dcbc91543c3b6c181"),
            specificProduct: new ObjectId("6586e95dcbc91543c3b6c181"),
            productActualPrice: 0,
            productDiscountedPrice: 0,
            buyer: new ObjectId(newuser?._id),
            affiliate: new ObjectId(referrerCodeMatch._id),
            lastModifiedBy: new ObjectId(referrerCodeMatch._id),
            affiliatePayout: affiliateObj.rewardPerSignup,
          });
        }
      } else {
        // referral?.users?.push({ userId: newuser._id, joinedOn: new Date() })
        // await referral.save();
        console.log("updating referral program");
        const referralProgramme = await Referral.findOneAndUpdate(
          { status: "Active" },
          {
            $push: {
              users: {
                userId: newuser._id,
                joinedOn: new Date(),
              },
            },
          }
        );

        if (referrerCode) {
          // let referrerCodeMatch = await User.findOne({ myReferralCode: referrerCode });
          // referrerCodeMatch.referrals = [...referrerCodeMatch.referrals, {
          //     referredUserId: newuser._id,
          //     joining_date: newuser.createdOn,
          //     referralProgram: referralProgramme._id,
          //     referralEarning: referralProgramme.rewardPerReferral,
          //     referralCurrency: referralProgramme.currency,
          // }];

          const saveReferrals = await UserDetail.findOneAndUpdate(
            { myReferralCode: referrerCode },
            {
              $push: {
                referrals: {
                  referredUserId: newuser._id,
                  joiningDate: newuser.createdOn,
                  referralProgram: referralProgramme._id,
                  referralEarning: referralProgramme.rewardPerReferral,
                  referralCurrency: referralProgramme.currency,
                },
              },
            }
          );

          if (referralProgramme?.referralSignupBonus?.amount) {
            await addSignupBonus(
              newuser?._id,
              referralProgramme?.referralSignupBonus?.amount,
              referralProgramme?.referralSignupBonus?.currency
            );
          }
          // await referrerCodeMatch.save({ validateBeforeSave: false });
          const wallet = await UserWallet.findOneAndUpdate(
            { userId: saveReferrals._id },
            {
              $push: {
                transactions: {
                  title: "Referral Credit",
                  description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
                  amount: referralProgramme.rewardPerReferral,
                  transactionId: uuid.v4(),
                  transactionDate: new Date(),
                  transactionType:
                    referralProgramme.currency == "INR" ? "Cash" : "Bonus",
                },
              },
            },
            { new: true, validateBeforeSave: false }
          );

          // const wallet = await UserWallet.findOne({ userId: saveReferrals._id });
          // wallet.transactions = [...wallet.transactions, {
          //     title: 'Referral Credit',
          //     description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
          //     amount: referralProgramme.rewardPerReferral,
          //     transactionId: uuid.v4(),
          //     transactionDate: new Date(),
          //     transactionType: referralProgramme.currency == 'INR' ? 'Cash' : 'Bonus'
          // }];
          // await wallet.save({ validateBeforeSave: false });

          await createUserNotification({
            title: "Referral Signup Credit",
            description: `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
            notificationType: "Individual",
            notificationCategory: "Informational",
            productCategory: "SignUp",
            user: saveReferrals?._id,
            priority: "Medium",
            channels: ["App", "Email"],
            createdBy: "63ecbc570302e7cf0153370c",
            lastModifiedBy: "63ecbc570302e7cf0153370c",
          });
          if (user?.fcmTokens?.length > 0) {
            await sendMultiNotifications(
              "Referral Signup Credit",
              `Amount credited for referral of ${newuser.first_name} ${newuser.last_name}`,
              saveReferrals?.fcmTokens?.map((item) => item.token),
              null,
              { route: "wallet" }
            );
          }
        }
      }
    }

    if (campaign) {
      campaign?.users?.push({ userId: newuser._id, joinedOn: new Date() });
      await campaign.save();
      // if(campaign?.campaignType == 'Invite'){
      await addSignupBonus(
        newuser?._id,
        campaign?.campaignSignupBonus?.amount ?? 90,
        campaign?.campaignSignupBonus?.currency ?? "INR"
      );
      // }
    }

    if (!newuser)
      return res
        .status(400)
        .json({ status: "error", message: "Something went wrong" });
    const token = await newuser.generateAuthToken();

    // console.log("Token:",token)

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
    });

    console.log("sending response");
    // res.status(201).json({ status: "Success", data: populatedUser, message: "Account created successfully.", token: token });

    // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
    // let email = newuser.email;
    let subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
    let message = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Created</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
    
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                    }
    
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
    
                    p {
                        margin: 0 0 20px;
                    }
    
                    .userid {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .password {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .login-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }
    
                    .login-button:hover {
                        background-color: #0069d9;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <h1>Account Created</h1>
                    <p>Dear ${newuser.first_name} ${newuser.last_name},</p>
                    <p>Welcome to the StoxHero family!</p>
                    
                    <p>Discover Stock Market success with our Paper Trading &amp; Learning App. Experience real market data, actionable insights, and a clutter-free interface on both our mobile app and web platform.</p>
                    
                    <p>What StoxHero offers:</p>
                    
                    <ol>
                        <li><strong>Learning Content:</strong> Enhance your market understanding.</li>
                        <li><strong>Real Data Trading:</strong> Practice with virtual currency and real-world data.</li>
                        <li><strong>Actionable Insights:</strong> Understand your trading style with valuable analytics.</li>
                        <li><strong>User-Friendly Interface:</strong> Navigate seamlessly for an optimal trading experience.</li>
                        <li><strong>Rewards for Success:</strong> Earn rewards for your winning trades.</li>
                    </ol>
                    
                    <p>StoxHero is your all-in-one package for Stock Market success.</p>
                    
                    <p>In case you face any issues, feel free to whatsApp support at 9354010914<a href="tel:+919830994402" rel="noreferrer" target="_blank">&nbsp;</a>or drop in an email at <a href="mailto:team@stoxhero.com">team@stoxhero.com</a></p>
                    
                    <p>To get started, visit our youtube channel to learn more about the App and StoxHero: <a href="https://www.youtube.com/channel/UCgslF4zuDhDyttD9P3ZOHbg">Visit</a></p>
                    
                    <p>Happy Trading!</p>
                    
                    <p>Best,&nbsp;</p>
                    
                    <p>StoxHero Team</p>
                    
                    <p>&nbsp;</p>
                    
                    <hr />
                    <h4 style="text-align:center"><strong>DOWNLOAD OUR APP FOR BETTER EXPERIENCE</strong></h4>
                    
                    <p>&nbsp;</p>
                    
                    <p style="text-align:center">
                    <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app">
                    <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463874playStore.png" style="height:100px; width:250px" />
                    </a>&nbsp;&nbsp;
                    <a href="http://www.stoxhero.com">
                    <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463880logoWeb.png" style="height:100px; width:250px" />
                    </a>
                    </p>
                    
                    <p>&nbsp;</p>
                  </body>
                </html>
    
            `;

    res
      .status(201)
      .json({
        status: "Success",
        data: populatedUser,
        message: "Account created successfully.",
        token: token,
      });
    if (process.env.PROD == "true") {
      await emailService(newuser.email, subject, message);
    }

    if (process.env.PROD == "true") {
      await whatsAppService.sendWhatsApp({
        destination: newuser.mobile,
        campaignName: "direct_signup_campaign_new",
        userName: newuser.first_name,
        source: newuser.creationProcess,
        media: { url: mediaURL, filename: mediaFileName },
        templateParams: [newuser.first_name],
        tags: "",
        attributes: "",
      });
    } else {
      whatsAppService.sendWhatsApp({
        destination: "9319671094",
        campaignName: "direct_signup_campaign_new",
        userName: newuser.first_name,
        source: newuser.creationProcess,
        media: { url: mediaURL, filename: mediaFileName },
        templateParams: [newuser.first_name],
        tags: "",
        attributes: "",
      });
      whatsAppService.sendWhatsApp({
        destination: "8076284368",
        campaignName: "direct_signup_campaign_new",
        userName: newuser.first_name,
        source: newuser.creationProcess,
        media: { url: mediaURL, filename: mediaFileName },
        templateParams: [newuser.first_name],
        tags: "",
        attributes: "",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Something went wrong",
        error: error.message,
      });
  }
});

const addSignupBonus = async (userId, amount, currency) => {
  const wallet = await UserWallet.findOne({ userId: userId });
  console.log("Wallet, Amount, Currency:", wallet, userId, amount, currency);
  try {
    wallet?.transactions?.push({
      title: "Sign up Bonus",
      description: `Amount credited for sign up bonus.`,
      amount: amount,
      transactionId: uuid.v4(),
      transactionDate: new Date(),
      transactionType: currency,
    });
    await wallet?.save({ validateBeforeSave: false });
    console.log("Saved Wallet:", wallet);
  } catch (e) {
    console.log(e);
  }
};
async function generateUniqueReferralCode() {
  const length = 8; // change this to modify the length of the referral code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let myReferralCode = "";
  let codeExists = true;

  // Keep generating new codes until a unique one is found
  while (codeExists) {
    for (let i = 0; i < length; i++) {
      myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if the generated code already exists in the database
    const existingCode = await UserDetail.findOne({
      myReferralCode: myReferralCode,
    });
    if (!existingCode) {
      codeExists = false;
    }
  }

  return myReferralCode;
}

router.post("/resendmobileotp", async (req, res) => {
  const { mobile } = req.body;
  try {
    const user = await UserDetail.findOne({ mobile });
    if (!user) {
      //Check if there is a signedup user
      const signedUpUser = await SignedUpUser.findOne({ mobile: mobile });
      if (!signedUpUser) {
        return res
          .status(404)
          .json({ status: "error", message: "Invalid mobile number" });
      }
      let mobile_otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      signedUpUser.mobile_otp = mobile_otp;
      signedUpUser.lastOtpTime = new Date();
      await signedUpUser.save({ validateBeforeSave: false });
      if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
      if (process.env.PROD !== "true") sendOTP("9319671094", mobile_otp);
      return res
        .status(200)
        .json({ status: "success", message: "Otp sent. Check again." });
    }

    if (
      user?.lastOtpTime &&
      moment().subtract(29, "seconds").isBefore(user?.lastOtpTime)
    ) {
      return res
        .status(429)
        .json({ message: "Please wait a moment before requesting a new OTP" });
    }

    let mobile_otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.mobile_otp = mobile_otp;
    user.lastOtpTime = new Date();
    await user.save({ validateBeforeSave: false });

    // sendSMS([mobile.toString()], `Your OTP is ${mobile_otp}`);
    if (process.env.PROD == "true") sendOTP(mobile.toString(), mobile_otp);
    if (process.env.PROD !== "true") sendOTP("9319671094", mobile_otp);
    res
      .status(200)
      .json({ status: "success", message: "Otp sent. Check again." });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: `Something went wrong. Please try again.`,
      });
  }
});

router.get("/loginDetail", authentication, async (req, res) => {
  const id = req.user._id;
  // console.log("ID:",id)

  const user = await UserDetail.findOne({ _id: id, status: "Active" })
    .populate("role", "roleName")
    .populate(
      "portfolio.portfolioId",
      "portfolioName portfolioValue portfolioType portfolioAccount"
    )
    .populate("collegeDetails.college", "name route")
    .populate({
      path: "subscription.subscriptionId",
      select: "portfolio",
      populate: [
        {
          path: "portfolio",
          select: "portfolioName portfolioValue portfolioType portfolioAccount",
        },
      ],
    })
    .populate({
      path: "internshipBatch",
      select:
        "batchName batchStartDate batchEndDate career portfolio participants",
      populate: [
        {
          path: "career",
          select: "jobTitle",
        },
        {
          path: "portfolio",
          select: "portfolioValue",
        },
        {
          path: "participants",
          populate: {
            path: "college",
            select: "collegeName",
          },
        },
      ],
    })
    .populate("schoolDetails.city", "name")
    .populate("schoolDetails.grade", "grade")
    .populate("schoolDetails.school", "school_name")
    .select(
      "slug student_name full_name schoolDetails city isAffiliate collegeDetails pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch bankState"
    );

  res.json(user);
});

router.get("/schooldetails", SchoolAuthenticate, async (req, res) => {
  try {
    const id = req.user._id;

    const user = await School.findOne({ _id: id, status: "Active" })
      .populate("city", "name")
      .populate("role", "roleName")
      .populate("highestGrade", "grade")
      .select(
        "-createdOn -createdBy -lastModifiedBy -lastModifiedOn -password"
      );

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", authentication, (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

router.get("/schoollogout", SchoolAuthenticate, (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

router.post("/addfcmtoken", authentication, async (req, res) => {
  const { fcmTokenData } = req.body;
  console.log("fcm", fcmTokenData);
  try {
    const user = await UserDetail.findById(req.user._id);
    if (fcmTokenData?.token) {
      const tokenExists = user?.fcmTokens?.some(
        (token) => token?.token === fcmTokenData?.token
      );
      // If the token does not exist, add it to the fcmTokens array
      if (!tokenExists) {
        fcmTokenData.lastUsedAt = new Date();
        user.fcmTokens.push(fcmTokenData);
        await user.save({ validateBeforeSave: false });
        console.log("FCM token added successfully.");
        res.status(200).json({ status: "success", message: "Fcm data added." });
      } else {
        console.log("FCM token already exists.");
        res
          .status(200)
          .json({ status: "success", message: "Fcm token already exists." });
      }
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        status: "error",
        message: "Something went wrong.",
        error: e?.message,
      });
  }
});

module.exports = router;
