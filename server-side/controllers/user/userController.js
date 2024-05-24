const otpGenerator = require("otp-generator");
const emailService = require("../../utils/emailService");
require("../../db/conn");
const Settings = require('../../models/settings/setting');
const UserDetail = require("../../models/User/userDetailSchema");
const Wallet = require("../../models/UserWallet/userWalletSchema");
const { ObjectId } = require("mongodb");
const { sendMultiNotifications } = require("../../utils/fcmService");
const {
  createUserNotification,
} = require("../../controllers/notification/notificationController");
const School = require("../../models/School/School");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { kycVarification } = require('./mails');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (
      allowedFields.includes(el) &&
      obj[el] !== null &&
      obj[el] !== undefined &&
      obj[el] !== ""
    ) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.resetPassword = async (req, res) => {
  const { email, resetPasswordOTP, confirm_password, password } = req.body;

  const deactivatedUser = await UserDetail.findOne({
    email: email,
    status: "Inactive",
  });

  if (deactivatedUser) {
    return res.status(422).json({
      status: "error",
      message:
        "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
      error: "deactivated",
    });
  }
  let resetuser = await UserDetail.findOne({ email: email });
  if (!resetuser) {
    return res.status(404).json({ error: "User doesn't exist" });
  }

  if (resetPasswordOTP != resetuser.resetPasswordOTP) {
    return res
      .status(401)
      .json({ message: "OTP doesn't match, please try again!" });
  }

  if (password != confirm_password) {
    return res
      .status(401)
      .json({ message: "Password & Confirm Password didn't match." });
  }

  resetuser.password = password;
  await resetuser.save({ validateBeforeSave: false });
  return res.status(200).json({ message: "Password Reset Done" });
}

exports.schoolResetPassword = async (req, res) => {
  const { email, resetPasswordOTP, confirm_password, password } = req.body;

  const deactivated = await School.findOne({
    email: email,
    status: "Inactive",
  });

  if (deactivated) {
    return res.status(422).json({
      status: "error",
      message:
        "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
      error: "deactivated",
    });
  }
  let reset = await School.findOne({ email: email });
  if (!reset) {
    return res.status(404).json({ error: "School doesn't exist" });
  }

  if (resetPasswordOTP != reset.resetPasswordOTP) {
    return res
      .status(401)
      .json({ message: "OTP doesn't match, please try again!" });
  }

  if (password != confirm_password) {
    return res
      .status(401)
      .json({ message: "Password & Confirm Password didn't match." });
  }

  reset.password = password;
  await reset.save({ validateBeforeSave: false });
  return res.status(200).json({ message: "Password Reset Done" });
}

exports.studentResetPin = async (req, res) => {
  const { mobile, resetPinOtp, confirm_pin, pin } = req.body;

  if (pin.length !== 6) {
    return res
      .status(422)
      .json({ status: "error", message: "Pin must be 6 digits long" });
  }

  if (!mobile || !resetPinOtp || !confirm_pin || !pin) {
    return res
      .status(422)
      .json({ status: "error", message: "Insufficient request data." });
  }

  const deactivated = await UserDetail.findOne({
    mobile: mobile,
    status: "Inactive",
  });

  if (deactivated) {
    return res.status(422).json({
      status: "error",
      message:
        "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
      error: "deactivated",
    });
  }
  let reset = await UserDetail.findOne({ mobile: mobile });
  if (!reset) {
    return res.status(404).json({ error: "User doesn't exist" });
  }

  if (resetPinOtp != reset?.schoolDetails?.resetPinOtp) {
    return res.status(401).json({
      status: "error",
      message: "OTP doesn't match, please try again!",
    });
  }

  if (pin != confirm_pin) {
    return res
      .status(401)
      .json({ status: "error", message: "Pin & Confirm Pin didn't match." });
  }

  reset.schoolDetails.pin = await bcrypt.hash(pin, 10);
  await reset.save({ validateBeforeSave: false });
  return res.status(200).json({ status: "success", message: "Pin Reset Done" });
}

exports.generateOTP = async (req, res) => {
  const { email } = req.body;

  const deactivatedUser = await UserDetail.findOne({
    email: email,
    status: "Inactive",
  });

  if (deactivatedUser) {
    return res.status(422).json({
      status: "error",
      message:
        "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
      error: "deactivated",
    });
  }

  const resetuser = await UserDetail.findOne({ email: email });
  if (!resetuser) {
    return res.status(404).json({
      message: "User with this email doesn't exist",
    });
  }
  let email_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  let subject = "Password Reset StoxHero";
  let message = `Your OTP for password reset is: ${email_otp}`;
  resetuser.resetPasswordOTP = email_otp;
  await resetuser.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "Password Reset OTP Resent",
  });
  emailService(email, subject, message);
}

exports.schoolGenerateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const deactivatedSchool = await School.findOne({
      email: email,
      status: "Inactive",
    });

    if (deactivatedSchool) {
      return res.status(422).json({
        status: "error",
        message:
          "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.",
        error: "deactivated",
      });
    }

    const reset = await School.findOne({ email: email });
    if (!reset) {
      return res.status(404).json({
        message: "User with this email doesn't exist",
      });
    }
    let email_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let subject = "Password Reset StoxHero";
    let message = `Your OTP for password reset is: ${email_otp}`;
    reset.resetPasswordOTP = email_otp;
    await reset.save({ validateBeforeSave: false });
    res.status(200).json({
      message: "Password Reset OTP Sent",
    });
    emailService(email, subject, message);
  } catch (err) {
    console.log(err);
  }
}

exports.readUserDetails = async (req, res) => {
  UserDetail.find({status: 'Active'})
  .populate("role", "roleName") // Populate the "role" field
  .sort({ joining_date: -1 })
  .select('role joining_date first_name last_name email mobile')
  .exec((err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
}

exports.getAdmins = async (req, res) => {
  UserDetail.find({ role: new ObjectId("6448f834446977851c23b3f5") })
  .then((data) => {
    return res.status(200).send(data);
  })
  .catch((err) => {
    return res.status(422).json({ error: "date not found" });
  });
}

exports.editProfile = async (req, res) => {
  try {

    if(req.body.isKycUpdate === 'true'){
      const setting = await Settings.findOne();
      const wallet = await Wallet.findOne({userId: new ObjectId(req?.user?._id)});
      let walletBalance = 0;
      for(let elem of wallet?.transactions){
        if(elem?.transactionType === 'Cash'){
          walletBalance += elem?.amount;
        }
      }

      if(walletBalance < setting?.minWalletBalance){
        return res.status(400).json({ status: 'error', message: `To proceed with KYC, your wallet balance needs to be greater than ₹${setting?.minWalletBalance || 0}.`});
      }
    }

    const user = await UserDetail.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "No such user found." });

    const filteredBody = filterObj(
      req.body,
      "name",
      "first_name",
      "last_name",
      "email",
      "mobile",
      "gender",
      "schoolDetails",
      "whatsApp_number",
      "dob",
      "address",
      "city",
      "state",
      "country",
      "last_occupation",
      "family_yearly_income",
      "employeed",
      "upiId",
      "googlePay_number",
      "payTM_number",
      "phonePe_number",
      "bankName",
      "nameAsPerBankAccount",
      "accountNumber",
      "ifscCode",
      "bankState",
      "aadhaarNumber",
      "degree",
      "panNumber",
      "passportNumber",
      "drivingLicenseNumber",
      "pincode",
      "KYCStatus"
    );
    if (filteredBody.KYCStatus == "Approved") {
      filteredBody.KYCStatus = "Rejected";
      filteredBody.rejectionReason = "API Abuse";
      filteredBody.KYCActionDate = new Date();
    }
    if (filteredBody.KYCStatus == "Pending Approval") {
      let aadhaarNumber, panNumber, dob;
      aadhaarNumber = filteredBody.aadhaarNumber;
      panNumber = filteredBody.panNumber;
      dob = filteredBody.dob;
      const users = await UserDetail.find({
        KYCStatus: "Approved",
        $or: [
          { aadhaarNumber: aadhaarNumber },
          { panNumber: panNumber },
          { dob: dob },
        ],
      });
      if (users.length > 1) {
        filteredBody.KYCStatus = "Rejected";
        filteredBody.rejectionReason =
          "Aadhaar or PAN number is already in use.";
      }
      filteredBody.KYCActionDate = new Date();
    }
    if (
      filteredBody.KYCStatus == "Pending Approval" &&
      process.env.PROD == "true"
    ) {
      await kycVarification(user?.first_name, user?.email);

      await createUserNotification({
        title: "KYC Verification Request Received",
        description: `Your KYC Verification request is received. It might take 3-5 business days to get processed.`,
        notificationType: "Individual",
        notificationCategory: "Informational",
        productCategory: "General",
        user: user?._id,
        priority: "Low",
        channels: ["App", "Email"],
        createdBy: "63ecbc570302e7cf0153370c",
        lastModifiedBy: "63ecbc570302e7cf0153370c",
      });
      if (user?.fcmTokens?.length > 0) {
        await sendMultiNotifications(
          "KYC Verification Request Received",
          `Ypur KYC Verification request is received. It may take 3-5 business days for the process to be completed.`,
          user?.fcmTokens?.map((item) => item.token),
          null,
          { route: "profile" }
        );
      }
    }
    filteredBody.lastModified = new Date();

    if (req.profilePhotoUrl) {
      if (!filteredBody.profilePhoto) {
        filteredBody.profilePhoto = {};
      }
      filteredBody.profilePhoto.url = req.profilePhotoUrl;
      filteredBody.profilePhoto.name = req.files.profilePhoto[0].originalname;
    }

    if (req.aadhaarCardFrontImageUrl) {
      if (!filteredBody.aadhaarCardFrontImage) {
        filteredBody.aadhaarCardFrontImage = {};
      }
      filteredBody.aadhaarCardFrontImage.url = req.aadhaarCardFrontImageUrl;
      filteredBody.aadhaarCardFrontImage.name =
        req.files.aadhaarCardFrontImage[0].originalname;
    }

    if (req.aadhaarCardBackImageUrl) {
      if (!filteredBody.aadhaarCardBackImage) {
        filteredBody.aadhaarCardBackImage = {};
      }
      filteredBody.aadhaarCardBackImage.url = req.aadhaarCardBackImageUrl;
      filteredBody.aadhaarCardBackImage.name =
        req.files.aadhaarCardBackImage[0].originalname;
    }

    if (req.panCardFrontImageUrl) {
      if (!filteredBody.panCardFrontImage) {
        filteredBody.panCardFrontImage = {};
      }
      filteredBody.panCardFrontImage.url = req.panCardFrontImageUrl;
      filteredBody.panCardFrontImage.name =
        req.files.panCardFrontImage[0].originalname;
    }

    if (req.passportPhotoUrl) {
      if (!filteredBody.passportPhoto) {
        filteredBody.passportPhoto = {};
      }
      filteredBody.passportPhoto.url = req.passportPhotoUrl;
      filteredBody.passportPhoto.name =
        req.files.passportPhoto[0].originalname;
    }

    if (req.addressProofDocumentUrl) {
      if (!filteredBody.addressProofDocument) {
        filteredBody.addressProofDocument = {};
      }
      filteredBody.addressProofDocument.url = req.addressProofDocumentUrl;
      filteredBody.addressProofDocument.name =
        req.files.addressProofDocument[0].originalname;
    }

    if (req.incomeProofDocumentUrl)
      filteredBody.incomeProofDocument = req.incomeProofDocumentUrl;
    for (key of Object.keys(filteredBody)) {
      if (filteredBody[key] == "undefined" || filteredBody[key] == "null") {
        filteredBody[key] = "";
      }
    }

    const userData = await UserDetail.findByIdAndUpdate(
      user._id,
      filteredBody,
      { new: true }
    );

    res.status(200).json({
      message: "Edit successful",
      status: "success",
      data: userData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong. Try again.",
    });
  }
}

exports.studentImageEdit = async (req, res) => {
  try {
    if (!req.profilePhotoUrl) {
      return res.status(404).json({ message: "Please upload a file" });
    }

    const user = await UserDetail.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "No such user found." });
    user.lastModified = new Date();

    if (req.profilePhotoUrl) {
      user.schoolDetails.profilePhoto = req.profilePhotoUrl;
    }

    const userData = await UserDetail.findByIdAndUpdate(user._id, user, {
      new: true,
    })
      .populate("role", "roleName")
      .populate("schoolDetails.city", "name")
      .populate("schoolDetails.grade", "grade")
      .select(
        "student_name full_name schoolDetails city isAffiliate collegeDetails pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch bankState"
      );

    res.status(200).json({
      message: "Edit successful",
      status: "success",
      data: userData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong. Try again.",
    });
  }
}

exports.studentProfileEdit = async (req, res) => {
  try {
    let {
      student_name,
      grade,
      city,
      school,
      dob,
      state,
      profilePhoto,
      section,
    } = req.body;

    if (
      !student_name ||
      !grade ||
      !city ||
      !school ||
      !dob ||
      !state ||
      !profilePhoto ||
      !section
    ) {
      return res.status(404).json({ message: "Please fill all the feilds." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(grade) ||
      !mongoose.Types.ObjectId.isValid(city) ||
      !mongoose.Types.ObjectId.isValid(school)
    ) {
      return res.status(404).json({ message: "Please fill valid objectId" });
    }

    profilePhoto =
      profilePhoto === "undefined" ||
      profilePhoto === "null" ||
      profilePhoto === "false" ||
      profilePhoto === ""
        ? null
        : profilePhoto;

    const user = await UserDetail.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "No such user found." });
    const schoolDetails = {
      grade,
      city,
      school,
      dob,
      parents_name: user?.schoolDetails?.parents_name,
      state,
      profilePhoto,
      section,
    };

    user.schoolDetails = schoolDetails;
    user.student_name = student_name;
    user.lastModified = new Date();

    if (req.profilePhotoUrl) {
      user.schoolDetails.profilePhoto = req.profilePhotoUrl;
    }

    const userData = await UserDetail.findByIdAndUpdate(user._id, user, {
      new: true,
    })
      .populate("role", "roleName")
      .populate("schoolDetails.city", "name")
      .populate("schoolDetails.grade", "grade")
      .populate("schoolDetails.school", "school_name")
      .select(
        "student_name full_name schoolDetails city isAffiliate collegeDetails pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch bankState"
      );

    res.status(200).json({
      message: "Edit successful",
      status: "success",
      data: userData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong. Try again.",
    });
  }
}

exports.myReferrals = async (req, res) => {
  const { id } = req.params;
  const referrals = UserDetail.find({ referredBy: id })
    .sort({ joining_date: -1 })
    .then((data) => {
      return res.status(200).json({ data: data, count: data.length });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.earnings = async (req, res) => {
  const id = req.user._id;
  try {
    const userReferrals = await UserDetail.findById(id).select("referrals");
    let earnings = 0;
    userReferrals.referrals.forEach((ref) => {
      earnings += ref.referralEarning;
    });

    res.status(200).json({
      status: "success",
      data: {
        joined: userReferrals.referrals.length,
        earnings: earnings,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }
}

exports.newUserToday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.find({
    joining_date: { $gte: today },
    creationProcess: { $ne: "School SignUp" },
  })
    .populate("referredBy", "first_name last_name")
    .populate("campaign", "campaignName campaignCode")
    .select(
      "joining_date referredBy campaign first_name last_name email mobile creationProcess myReferralCode"
    )
    .sort({ joining_date: -1 })
    .then((data) => {
      return res.status(200).json({ data: data, count: data.length });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newUserYesterday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: yesterday, $lte: today },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newUserThisMonth = async (req, res) => {
  let date = new Date();
  let monthStartDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(1).padStart(2, "0")}`;
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: monthStart },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.allUsers = async (req, res) => {
  const newuser = UserDetail.countDocuments()
  .then((data) => {
    return res.status(200).json({ count: data });
  })
  .catch((err) => {
    console.log("Error:", err);
    return res.status(422).json({ error: err });
  });
}

exports.allUsersNameAndId = async (req, res) => {
  const newuser = UserDetail.find()
  .select("_id first_name last_name")
  .then((data) => {
    return res.status(200).json({
      message: "user name and id retreived",
      data: data,
      count: data.length,
    });
  })
  .catch((err) => {
    console.log("Error:", err);
    return res.status(422).json({ error: err });
  });
}

exports.newuserreferralstoday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: today },
    referredBy: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newuserreferralsyesterday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: yesterday, $lte: today },
    referredBy: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newuserreferralsthismonth = async (req, res) => {
  let date = new Date();
  let monthStartDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(1).padStart(2, "0")}`;
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: monthStart },
    referredBy: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.allreferralsusers = async (req, res) => {
  const newuser = UserDetail.countDocuments({ referredBy: { $exists: true } })
  .then((data) => {
    return res.status(200).json({ count: data });
  })
  .catch((err) => {
    console.log("Error:", err);
    return res.status(422).json({ error: err });
  });
}

exports.newusercampaigntoday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: today },
    campaign: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newusercampaignyesterday = async (req, res) => {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  date.setDate(date.getDate() - 1);
  let yesterdayDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  yesterdayDate = yesterdayDate + "T00:00:00.000Z";
  const yesterday = new Date(yesterdayDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: yesterday, $lte: today },
    campaign: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.newusercampaignthismonth = async (req, res) => {
  let date = new Date();
  let monthStartDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(1).padStart(2, "0")}`;
  monthStartDate = monthStartDate + "T00:00:00.000Z";
  const monthStart = new Date(monthStartDate);
  const newuser = UserDetail.countDocuments({
    joining_date: { $gte: monthStart },
    campaign: { $exists: true },
  })
    .then((data) => {
      return res.status(200).json({ count: data });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
}

exports.allcampaignusers = async (req, res) => {
  const newuser = UserDetail.countDocuments({ campaign: { $exists: true } })
  .then((data) => {
    return res.status(200).json({ count: data });
  })
  .catch((err) => {
    console.log("Error:", err);
    return res.status(422).json({ error: err });
  });
}

exports.normalusers = async (req, res) => {
  const newuser = await UserDetail.find({ designation: "Trader" }).select(
    "first_name last_name employeeid _id email mobile"
  );
  return res.status(200).json({ data: newuser, count: newuser.length });
}

exports.influencer = async (req, res) => {
  const searchString = req.query.search;
  let query = {
    status: "Active",
    role: new ObjectId("65dc6817586cba2182f05561"),
  };

  if (searchString) {
    query.$and = [
      {
        $or: [
          { email: { $regex: searchString, $options: "i" } },
          { first_name: { $regex: searchString, $options: "i" } },
          { last_name: { $regex: searchString, $options: "i" } },
          { mobile: { $regex: searchString, $options: "i" } },
        ],
      },
    ];
  }

  try {
    const data = await UserDetail.find(query).select(
      "first_name last_name email mobile _id myReferralCode influencerDetails"
    );
    res.status(200).json({
      status: "success",
      message: "Getting User successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
}
