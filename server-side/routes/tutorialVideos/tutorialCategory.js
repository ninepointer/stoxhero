const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createTutorialCategory, getTutorialCategories, getTutorialCategory, editTutorialCategory, deleteTutorialCategory} = require('../../controllers/tutorialVideos/tutorialCategory');


router.route('/').post(Authenticate, createTutorialCategory).get(getTutorialCategories);
router.route('/:id').patch(Authenticate, editTutorialCategory).get(getTutorialCategory);
router.route('/delete/:id').patch(deleteTutorialCategory)


module.exports = router;
