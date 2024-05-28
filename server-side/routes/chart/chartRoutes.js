const express = require("express");
const chartController = require("../../controllers/chartController");
const Authenticate = require("../../authentication/authentication");
const pnlChart = require('../../controllers/hourChart');
const restrictTo = require("../../authentication/authorization");
const router = express.Router();

router.route("/historical").get(chartController.getHistoricalData);
router.route("/historicaladv").get(chartController.getHistoricalDataAdv);
router.route("/allsymbols").get(chartController.getAllSymbols);
router
  .route("/historicaludf")
  .get(Authenticate, chartController.getHistoricalDataUDF);

router.route('/uploadcsv').post(Authenticate, pnlChart.uploadMulter, pnlChart.uploadCSV);
router.route('/hourly').get(Authenticate, pnlChart.hourChart);

module.exports = router;
