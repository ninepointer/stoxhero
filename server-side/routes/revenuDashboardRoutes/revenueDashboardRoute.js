const express = require("express");
const router = express.Router({mergeParams: true});
const {getTestZoneRevenue, getOverallRevenue} = require('../../controllers/revenueController/revenuDashboardController');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/gettestzonerevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTestZoneRevenue);
router.route('/overallrevenue').get(getOverallRevenue);


module.exports = router;