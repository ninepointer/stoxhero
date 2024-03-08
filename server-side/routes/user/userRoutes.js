const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getFinowledgeUser,
  getUsers,
  changePassword,
  editUser,
  deactivateUser,
  getdeactivateUser,
  getFilteredUsers,
  understoodGst,
  checkUserExist,
  getUsersSearch,
  addInfluencer,
  removeInfluencer,
  addInfluencerChannelsInfo,
  editInfluencer,
} = require("../../controllers/userController");

const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};
// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

const setCurrentUser = async (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router
  .route("/")
  .patch(Authenticate, restrictTo("Admin", "SuperAdmin"), editUser);
router
  .route("/deactivate")
  .post(Authenticate, restrictTo("Admin", "SuperAdmin"), deactivateUser)
  .get(Authenticate, restrictTo("Admin", "SuperAdmin"), getdeactivateUser);
router
  .route("/finowledge")
  .get(Authenticate, restrictTo("Admin", "SuperAdmin"), getFinowledgeUser);

router
  .route("/searchuser")
  .get(Authenticate, restrictTo("Admin", "SuperAdmin"), getUsers);
router
  .route("/influencer/:id")
  .delete(Authenticate, restrictTo("Admin", "SuperAdmin"), removeInfluencer)
  .post(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    upload.fields([
      { name: "bannerImageWeb", maxCount: 1 },
      { name: "bannerImageMobile", maxCount: 1 },
    ]),
    addInfluencer
  )
  .patch(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    upload.fields([
      { name: "bannerImageWeb", maxCount: 1 },
      { name: "bannerImageMobile", maxCount: 1 },
    ]),
    editInfluencer
  );
router
  .route("/influencer/:id/channels")
  .patch(
    Authenticate,
    restrictTo("Admin", "SuperAdmin"),
    addInfluencerChannelsInfo
  );
router
  .route("/searchuserinfluencer")
  .get(Authenticate, restrictTo("Admin", "SuperAdmin"), getUsersSearch);
router
  .route("/filteredusers")
  .get(Authenticate, restrictTo("Admin", "SuperAdmin"), getFilteredUsers);
router.route("/understood").post(Authenticate, understoodGst);
router
  .route("/changepassword/me")
  .patch(Authenticate, setCurrentUser, changePassword);
router
  .route("/changepassword/:id")
  .patch(Authenticate, restrictTo("Admin", "SuperAdmin"), changePassword);
router.route("/exist/:mobile").get(checkUserExist);

module.exports = router;
