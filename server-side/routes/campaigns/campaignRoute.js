const express = require("express");
const router = express.Router();
const {createCampaign, editCampaign, getCampaigns, getCampaign} = require('../../controllers/campaignController');
const Authenticate = require('../../authentication/authentication');



router.route('/create').post(Authenticate, createCampaign)
router.route('/').get(getCampaigns);
router.route('/:id').get(getCampaign).patch(Authenticate, editCampaign)
module.exports = router;