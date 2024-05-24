const express = require("express");
const Authenticate = require('../../authentication/authentication');
const chart = require('../../controllers/hourChart');
const router = express.Router();


router.route('/hour').post(chart.uploadMulter, chart.hourChart);



module.exports = router;