const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router();
const {uploadMulter, uploadToS3, resizePhoto, createBlog, editBlog, getBlog, getAllBlogs, getPublishedBlogs, getDraftBlogs, getUnpublishedBlogs, updateBlogStatus} = require('../../controllers/blog/blog');
const restrictTo = require('../../authentication/authorization');
const {getUploads} = require("../../controllers/blog/uploadImage")
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

console.log("upload", upload)

router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'),uploadMulter, resizePhoto, uploadToS3, createBlog).get(getAllBlogs);
router.route('/images').post(Authenticate, upload.fields([{ name: 'titleFiles', maxCount: 1 }, { name: 'files', maxCount: 100 }]), getUploads);
// router.route('/images').post(upload.single("titleFiles"), upload.array("files"), getUploads);
router.route('/published').get(Authenticate, getPublishedBlogs);
router.route('/draft').get(Authenticate, getDraftBlogs);
router.route('/unpublished').get(Authenticate, getUnpublishedBlogs);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'),uploadMulter, resizePhoto, uploadToS3, editBlog).get(Authenticate, restrictTo('Admin', 'Super Admin'), getBlog);
router.route('/:id/:status').patch(Authenticate, restrictTo('Admin', 'Super Admin'), updateBlogStatus);



module.exports = router;