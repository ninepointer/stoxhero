const express = require("express");
const router = express.Router({mergeParams: true});
const {infinityMargin, saveLiveUsedMargin, saveMockUsedMargin} = require('../../controllers/marginRequired');
const Authenticate = require('../../authentication/authentication');



router.route('/infinity').get( infinityMargin)
router.route('/saveLive').get( saveLiveUsedMargin)
router.route('/saveMock').get( saveMockUsedMargin)


module.exports = router;