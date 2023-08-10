const express = require("express");
const router = express.Router();
const {createCampaign, editCampaign, getCampaigns, getCampaign, getCampaignsByStatus} = require('../../controllers/campaignController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');



router.route('/create').post(Authenticate, restrictTo('Admin', 'Super Admin'), createCampaign)
router.route('/').get(Authenticate, getCampaigns);
router.route('/:id').get(Authenticate, getCampaign).patch(Authenticate, restrictTo('Admin', 'Super Admin'), editCampaign)
router.route('/status/:status').get(Authenticate, getCampaignsByStatus);
module.exports = router;