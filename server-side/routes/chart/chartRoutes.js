const express = require("express");
const chartController = require("../../controllers/chartController");
const Authenticate = require("../../authentication/authentication");
const restrictTo = require("../../authentication/authorization");
const router = express.Router();

router
  .route("/historical")
  .get(Authenticate, chartController.getHistoricalData);

module.exports = router;
