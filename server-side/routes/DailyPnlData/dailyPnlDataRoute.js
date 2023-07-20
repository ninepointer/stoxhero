const express = require("express");
const router = express.Router();
const dailyPnlDataController = require("../../controllers/dailyPnlDataController")
const traderDailyPnlDataController = require("../../controllers/traderwiseDailyPnlController")
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');

router.post("/dailypnlcalculation", Authenticate, restrictTo('Admin', 'SuperAdmin'), dailyPnlDataController.dailyPnlCalculation)

router.post("/traderdailypnlcalculation", Authenticate, restrictTo('Admin', 'SuperAdmin'), traderDailyPnlDataController.traderDailyPnlCalculation)

router.get("/dailypnldata/:selectDate", Authenticate, restrictTo('Admin', 'SuperAdmin'), dailyPnlDataController.getDailyPnlData)

router.get("/dailypnlmaxmindata/", Authenticate, restrictTo('Admin', 'SuperAdmin'), dailyPnlDataController.getDailyPnlMaxMinData)

router.get("/deleteduplicate/", Authenticate, restrictTo('Admin', 'SuperAdmin'), dailyPnlDataController.deleteDuplicateData)

router.get("/traderdailypnldata/:selectDate/:traderName", Authenticate, restrictTo('Admin', 'SuperAdmin'), traderDailyPnlDataController.getTraderDailyPnlData)

router.get("/getstoplossstopprofitpnl/", Authenticate, restrictTo('Admin', 'SuperAdmin'), traderDailyPnlDataController.getstoplossstopprofitpnl)

router.get("/getstoplosspnl/:stoploss", Authenticate, restrictTo('Admin', 'SuperAdmin'), traderDailyPnlDataController.getstoplosspnl)





module.exports = router;

