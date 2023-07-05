const express = require("express");
const router = express.Router({mergeParams: true});
const {infinityMargin, saveLiveUsedMargin, saveMockUsedMargin,
    saveMockDailyContestUsedMargin, DailyContestMargin, saveXtsMargin} = require('../../controllers/marginRequired');
const Authenticate = require('../../authentication/authentication');



router.route('/infinity').get( infinityMargin)
router.route('/saveLive').get( saveLiveUsedMargin)
router.route('/saveMock').get( saveMockUsedMargin)

router.route('/dailycontest').get( DailyContestMargin)
router.route('/dailycontestsaveLive').get( saveXtsMargin)
router.route('/dailycontestSaveMock').get( saveMockDailyContestUsedMargin)


module.exports = router;