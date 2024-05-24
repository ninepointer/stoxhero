const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createMarginXTemplate, editMarginXTemplate, getAllMarginXTemplates, getActiveMarginXTemplates, getDraftMarginXTemplates, getInactiveMarginXTemplates} = require('../../controllers/marginX/marginxTemplateController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createMarginXTemplate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllMarginXTemplates);
router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getActiveMarginXTemplates);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftMarginXTemplates);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getInactiveMarginXTemplates);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editMarginXTemplate);

module.exports = router;