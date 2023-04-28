const express = require("express");
const router = express.Router();

const { getTraderOverview } = require('../../controllers/analyticsController');

router.route('/overview').get(getTraderOverview);



module.exports = router;