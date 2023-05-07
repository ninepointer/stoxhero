const express = require("express");
const router = express.Router({mergeParams: true});
const {createTenXSubscription, editTanx, getActiveTenXSubs, 
    getTenXSubscription, editFeature, removeFeature} = require("../../controllers/tenXSubscriptionController");
const authentication = require("../../authentication/authentication")

// router.route('/userDetail').post(upload.array("files"), getUploadsApplication);
router.route('/create').post(authentication, createTenXSubscription);
router.route('/active').get(authentication, getActiveTenXSubs);
router.route('/:id').get(getTenXSubscription, editTanx).patch(authentication, editTanx);
router.route('/feature/:id').patch(authentication, editFeature);
router.route('/removefeature/:id').patch(authentication, removeFeature);

module.exports = router;