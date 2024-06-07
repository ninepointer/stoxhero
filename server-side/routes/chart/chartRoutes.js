const express = require("express");
const chartController = require("../../controllers/chartController");
const Authenticate = require("../../authentication/authentication");
const pnlChart = require("../../controllers/hourChart");
const restrictTo = require("../../authentication/authorization");
const {
  parseDataTemp,
  addRawDataFromCSV,
} = require("../../controllers/historyDataHelper");
const router = express.Router();

router.route("/historical").get(chartController.getHistoricalData);
router.route("/historicaladv").get(chartController.getHistoricalDataAdv);
router.route("/allsymbols").get(chartController.getAllSymbols);
router
  .route("/historicaludf")
  .get(Authenticate, chartController.getHistoricalDataUDF);

router
  .route("/uploadcsv")
  .post(Authenticate, pnlChart.uploadMulter, pnlChart.uploadCSV);
router.route("/hourly").get(Authenticate, pnlChart.hourChart);
router.route("/isexist").get(Authenticate, pnlChart.isThirdPartyDataExist);
router.route("/uploadeddata").get(Authenticate, pnlChart.getUploadedData);
router.route("/parsetemp").get(parseDataTemp);
router.route("/addnewraw").get(addRawDataFromCSV);
router.route("/del").delete(pnlChart.deleteThirdParty);
router.route("/avghour").get(Authenticate, pnlChart.avgHourChart);

module.exports = router;
