const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createChallengeTemplate, editChallengeTemplate, getActiveChallengeTemplates, getInactiveChallengeTemplates, getAllChallengeTemplates} = require('../../controllers/challenges/challengeTemplateController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createChallengeTemplate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllChallengeTemplates);
router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getActiveChallengeTemplates);
// router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftChallengeTemplates);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getInactiveChallengeTemplates);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editChallengeTemplate);

module.exports = router;