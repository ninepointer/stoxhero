const express = require("express");
const router = express.Router({mergeParams: true});
const {getTestZoneRevenue, getOverallRevenue, downloadTestZoneRevenueData, downloadMarginXRevenueData} = require('../../controllers/revenueController/revenuDashboardController');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/gettestzonerevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTestZoneRevenue);
router.route('/overallrevenue').get(getOverallRevenue);
router.route('/downloadtestzonerevenuedata').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadTestZoneRevenueData);
router.route('/downloadmarginxrevenuedata').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), downloadMarginXRevenueData);


module.exports = router;