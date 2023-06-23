const express = require("express");
const router = express.Router({mergeParams: true});
const {createInstrumentPNLData} = require('../../controllers/insturmentPNL/instrumentPNL');

router.route('/:startDate/:endDate').get(createInstrumentPNLData);

module.exports = router;
