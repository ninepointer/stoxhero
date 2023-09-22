const express = require("express");
const router = express.Router();
const {getCampaignsName, createCampaign, editCampaign, getCampaigns, getCampaign, getCampaignsByStatus} = require('../../controllers/campaignController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');



router.route('/create').post(Authenticate, restrictTo('Admin', 'Super Admin'), createCampaign)
router.route('/').get(Authenticate, getCampaigns);
router.route('/name').get(Authenticate, restrictTo('Admin', 'Super Admin'), getCampaignsName);

router.route('/:id').get(Authenticate, getCampaign).patch(Authenticate, restrictTo('Admin', 'Super Admin'), editCampaign)
router.route('/status/:status').get(Authenticate, getCampaignsByStatus);
module.exports = router;