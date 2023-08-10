const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const contestController = require('../../controllers/contestScoreboard');

router.get('/scoreboard', Authenticate, contestController.getContestScoreboard);
router.get('/collegescoreboard', Authenticate, contestController.getCollegeContestScoreboard);

module.exports=router;