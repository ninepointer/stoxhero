const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const authController = require("../../controllers/authController");
const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const userController = require("../../controllers/user/userController");
const { BlobServiceClient } = require("@azure/storage-blob");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("profilePhoto");
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB maximum file size
  },
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "aadhaarCardFrontImage", maxCount: 1 },
  { name: "aadhaarCardBackImage", maxCount: 1 },
  { name: "panCardFrontImage", maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
  { name: "addressProofDocument", maxCount: 1 },
  { name: "incomeProofDocument", maxCount: 1 },
]);

const checkFileError = async (req, res, next) => {
  const files = req.files;
  for (let key in files) {
    // console.log("file size", files[key][0].size);
    if (files[key][0].size > 2 * 1024 * 1024) {
      // 2MB size check
      return res.status(400).json({
        status: "error",
        message: "File size limit is 2MB. Upload a smaller file.",
      });
    }
  }
  next();
};
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const resizePhoto = async (req, res, next) => {
  // console.log('resize func');
  // console.log("Uploaded Files: ",req.files)
  if (!req.files) {
    // no file uploaded, skip to next middleware
    next();
    return;
  }

  const {
    profilePhoto,
    aadhaarCardFrontImage,
    aadhaarCardBackImage,
    panCardFrontImage,
    passportPhoto,
    addressProofDocument,
    incomeProofDocument,
  } = req.files;

  if (profilePhoto && profilePhoto[0].buffer) {
    const resizedProfilePhoto = await sharp(profilePhoto[0].buffer)
      .resize({ width: 500, height: 500 })
      .toBuffer();
    req.files.profilePhotoBuffer = resizedProfilePhoto;
  }

  if (aadhaarCardFrontImage && aadhaarCardFrontImage[0].buffer) {
    const resizedAadhaarCardFrontImage = await sharp(
      aadhaarCardFrontImage[0].buffer
    )
      // .resize({ width: 1024, height: 720 })
      .toBuffer();
    req.files.aadhaarCardFrontImageBuffer = resizedAadhaarCardFrontImage;
  }
  if (aadhaarCardBackImage && aadhaarCardBackImage[0].buffer) {
    const resizedAadhaarCardBackImage = await sharp(
      aadhaarCardBackImage[0].buffer
    )
      // .resize({ width: 1024, height: 720 })
      .toBuffer();
    req.files.aadhaarCardBackImageBuffer = resizedAadhaarCardBackImage;
  }

  if (panCardFrontImage && panCardFrontImage[0].buffer) {
    const resizedPanCardFrontImage = await sharp(panCardFrontImage[0].buffer)
      // .resize({ width: 1024, height: 720 })
      .toBuffer();
    req.files.panCardFrontImageBuffer = resizedPanCardFrontImage;
  }
  if (passportPhoto && passportPhoto[0].buffer) {
    const resizedPassportPhoto = await sharp(passportPhoto[0].buffer)
      .resize({ width: 1024, height: 720 })
      .toBuffer();
    req.files.passportPhotoBuffer = resizedPassportPhoto;
  }
  if (addressProofDocument && addressProofDocument[0].buffer) {
    const resizedAddressProofDocument = await sharp(
      addressProofDocument[0].buffer
    )
      // .resize({ width: 1024, height: 720 })
      .toBuffer();
    req.files.addressProofDocumentBuffer = resizedAddressProofDocument;
  }
  if (incomeProofDocument && incomeProofDocument[0].buffer) {
    const resizedIncomeProofDocument = await sharp(
      incomeProofDocument[0].buffer
    )
      // .resize({ width: 1000, height: 500 })
      .toBuffer();
    req.files.incomeProofDocumentBuffer = resizedIncomeProofDocument;
  }
  next();
};

const uploadToS3 = async (req, res, next) => {
  if (!req.files) {
    // no file uploaded, skip to next middleware
    next();
    return;
  }

  try {
    if (req.files.profilePhoto) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?._id}`;
      const key = `users/${userName}/photos/display/${
        Date.now() + req.files.profilePhoto[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.profilePhotoBuffer,
        ContentType: req.files.profilePhoto.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.profilePhotoUrl = s3Data.Location;
    }

    if (req.files.aadhaarCardFrontImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      if (user.KYCStatus == "Approved") {
        return res.status(400).json({
          status: "error",
          message: "KYC is completed. Can't change documents after approval.",
        });
      }
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/aadharFront/${
        Date.now() + req.files.aadhaarCardFrontImage[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.aadhaarCardFrontImageBuffer,
        ContentType: req.files.aadhaarCardFrontImage.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.aadhaarCardFrontImageUrl = s3Data.Location;
    }

    if (req.files.aadhaarCardBackImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      if (user.KYCStatus == "Approved") {
        return res.status(400).json({
          status: "error",
          message: "KYC is completed. Can't change documents after approval.",
        });
      }
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/aadharBack/${
        Date.now() + req.files.aadhaarCardBackImage[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.aadhaarCardBackImageBuffer,
        ContentType: req.files.aadhaarCardBackImage.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.aadhaarCardBackImageUrl = s3Data.Location;
    }
    if (req.files.panCardFrontImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      if (user.KYCStatus == "Approved") {
        return res.status(400).json({
          status: "error",
          message: "KYC is completed. Can't change documents after approval.",
        });
      }
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/panFront/${
        Date.now() + req.files.panCardFrontImage[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.panCardFrontImageBuffer,
        ContentType: req.files.panCardFrontImage.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.panCardFrontImageUrl = s3Data.Location;
    }
    if (req.files.passportPhoto) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/passport/${
        Date.now() + req.files.passportPhoto[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.passportPhotoBuffer,
        ContentType: req.files.passportPhoto.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.passportPhotoUrl = s3Data.Location;
    }
    if (req.files.addressProofDocument) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/addressProof/${
        Date.now() + req.files.addressProofDocument[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.addressProofDocumentBuffer,
        ContentType: req.files.addressProofDocument.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.addressProofDocumentUrl = s3Data.Location;
    }
    if (req.files.incomeProofDocument) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName =
        `${user?.first_name}` +
        `${user?.last_name}` +
        `${user?.name}` +
        `${user?._id}`;
      const key = `users/${userName}/photos/incomeProof/${
        Date.now() + req.files.incomeProofDocument[0].originalname
      }`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: req.files.incomeProofDocumentBuffer,
        ContentType: req.files.incomeProofDocument.mimetype,
        ACL: "public-read",
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      req.incomeProofDocumentUrl = s3Data.Location;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading to S3" });
  }
};

const uploadToAzure = async (req, res, next) => {
  if (!req.files) {
    console.log("here");
    // no file uploaded, skip to next middleware
    next();
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME
    );

    const uploadFile = async (fileBuffer, fileName, contentType) => {
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: contentType },
      });
      return blockBlobClient.url;
    };

    const user = await UserDetail.findById(req.params.id);
    const userName = `${user?.first_name}${user?.last_name}${user?._id}`;

    if (req.files.profilePhoto) {
      const key = `users/${userName}/photos/display/${Date.now()}${
        req.files.profilePhoto[0].originalname
      }`;
      req.profilePhotoUrl = await uploadFile(
        req.files.profilePhoto[0].buffer,
        key,
        req.files.profilePhoto[0].mimetype
      );
    }

    const checkKYCStatus = () => {
      if (user.KYCStatus == "Approved") {
        res.status(400).json({
          status: "error",
          message: "KYC is completed. Can't change documents after approval.",
        });
        return true;
      }
      return false;
    };

    if (req.files.aadhaarCardFrontImage) {
      if (checkKYCStatus()) return;
      const key = `users/${userName}/photos/aadharFront/${Date.now()}${
        req.files.aadhaarCardFrontImage[0].originalname
      }`;
      req.aadhaarCardFrontImageUrl = await uploadFile(
        req.files.aadhaarCardFrontImage[0].buffer,
        key,
        req.files.aadhaarCardFrontImage[0].mimetype
      );
    }

    if (req.files.aadhaarCardBackImage) {
      if (checkKYCStatus()) return;
      const key = `users/${userName}/photos/aadharBack/${Date.now()}${
        req.files.aadhaarCardBackImage[0].originalname
      }`;
      req.aadhaarCardBackImageUrl = await uploadFile(
        req.files.aadhaarCardBackImage[0].buffer,
        key,
        req.files.aadhaarCardBackImage[0].mimetype
      );
    }

    if (req.files.panCardFrontImage) {
      if (checkKYCStatus()) return;
      const key = `users/${userName}/photos/panFront/${Date.now()}${
        req.files.panCardFrontImage[0].originalname
      }`;
      req.panCardFrontImageUrl = await uploadFile(
        req.files.panCardFrontImage[0].buffer,
        key,
        req.files.panCardFrontImage[0].mimetype
      );
    }

    if (req.files.passportPhoto) {
      const key = `users/${userName}/photos/passport/${Date.now()}${
        req.files.passportPhoto[0].originalname
      }`;
      req.passportPhotoUrl = await uploadFile(
        req.files.passportPhoto[0].buffer,
        key,
        req.files.passportPhoto[0].mimetype
      );
    }

    if (req.files.addressProofDocument) {
      const key = `users/${userName}/photos/addressProof/${Date.now()}${
        req.files.addressProofDocument[0].originalname
      }`;
      req.addressProofDocumentUrl = await uploadFile(
        req.files.addressProofDocument[0].buffer,
        key,
        req.files.addressProofDocument[0].mimetype
      );
    }

    if (req.files.incomeProofDocument) {
      const key = `users/${userName}/photos/incomeProof/${Date.now()}${
        req.files.incomeProofDocument[0].originalname
      }`;
      req.incomeProofDocumentUrl = await uploadFile(
        req.files.incomeProofDocument[0].buffer,
        key,
        req.files.incomeProofDocument[0].mimetype
      );
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading to Azure" });
  }
};

const currentUser = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

router.patch("/resetpassword", userController.resetPassword);

router.patch("/schoolresetpassword", userController.schoolResetPassword);

router.patch("/studentresetpin", userController.studentResetPin);

router.patch("/generateOTP", userController.generateOTP);

router.patch("/schoolgenerateotp", userController.schoolGenerateOTP);

router.get(
  "/readuserdetails",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.readUserDetails
);

router.get(
  "/getAdmins/",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.getAdmins
);

router.patch(
  "/userdetail/me",
  authController.protect,
  currentUser,
  uploadMultiple,
  checkFileError,
  resizePhoto,
  uploadToAzure,
  userController.editProfile
);

router.patch(
  "/student/image",
  authController.protect,
  currentUser,
  uploadMultiple,
  checkFileError,
  resizePhoto,
  uploadToS3,
  userController.studentImageEdit
);

router.patch(
  "/student/me",
  authController.protect,
  currentUser,
  uploadMultiple,
  checkFileError,
  resizePhoto,
  uploadToS3,
  userController.studentProfileEdit
);

router.get("/myreferrals/:id", Authenticate, userController.myReferrals);

router.get("/earnings", Authenticate, userController.earnings);

router.get(
  "/newusertoday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newUserToday
);

router.get(
  "/newuseryesterday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newUserYesterday
);

router.get(
  "/newuserthismonth",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newUserThisMonth
);

router.get(
  "/allusers",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.allUsers
);

router.get(
  "/allusersNameAndId",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.allUsersNameAndId
);

router.get(
  "/newuserreferralstoday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newuserreferralstoday
);

router.get(
  "/newuserreferralsyesterday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newuserreferralsyesterday
);

router.get(
  "/newuserreferralsthismonth",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newuserreferralsthismonth
);

router.get(
  "/allreferralsusers",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.allreferralsusers
);

router.get(
  "/newusercampaigntoday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newusercampaigntoday
);

router.get(
  "/newusercampaignyesterday",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newusercampaignyesterday
);

router.get(
  "/newusercampaignthismonth",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.newusercampaignthismonth
);

router.get(
  "/allcampaignusers",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.allcampaignusers
);

router.get(
  "/normalusers",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.normalusers
);

router.get(
  "/influencer",
  Authenticate,
  restrictTo("Admin", "SuperAdmin"),
  userController.influencer
);

module.exports = router;
