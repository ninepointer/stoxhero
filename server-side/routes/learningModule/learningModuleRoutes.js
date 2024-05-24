const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router();
const {uploadMulter, uploadToS3, resizePhoto, createLearningModule, getLearningModules} = require('../../controllers/learningModule/learningModule');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'Super Admin'),uploadMulter, resizePhoto, uploadToS3, createLearningModule).get(getLearningModules);
// router.route('/published').get(Authenticate, getPublishedBlogs);
// router.route('/draft').get(Authenticate, getDraftBlogs);
// router.route('/unpublished').get(Authenticate, getUnpublishedBlogs);
// router.route('/:id').patch(Authenticate, restrictTo('Admin', 'Super Admin'),uploadMulter, resizePhoto, uploadToS3, editBlog).get(Authenticate, restrictTo('Admin', 'Super Admin'), getBlog);
// router.route('/:id/:status').patch(Authenticate, restrictTo('Admin', 'Super Admin'), updateBlogStatus);



module.exports = router;