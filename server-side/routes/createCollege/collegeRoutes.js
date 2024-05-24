const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router();
const {create, edit, getActive, getInactive, getDraft, getByRoute, getById, getAllCollege } = require('../../controllers/createCollege/createCollegeController');
const restrictTo = require('../../authentication/authorization');
// const {getUploads} = require("../../controllers/blog/uploadImage")
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});


// router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'),uploadMulter, resizePhoto, uploadToS3, createBlog)
// router.route('/').post(Authenticate, upload.fields([{ name: 'titleFiles', maxCount: 1 }, { name: 'files', maxCount: 100 }]), createBlog).get(getAllBlogs);
router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'), upload.single("logo"), create).get(Authenticate, restrictTo('Admin', 'Super Admin'), getAllCollege);
router.route('/active').get(Authenticate, restrictTo('Admin', 'Super Admin'), getActive);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'Super Admin'), getInactive);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'Super Admin'), getDraft);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'), upload.single("logo"), edit).get(getById);
router.route('/byroute/:route').get(getByRoute);

// router.route('/:id/:status').patch(Authenticate, restrictTo('Admin', 'Super Admin'), updateBlogStatus);


module.exports = router;