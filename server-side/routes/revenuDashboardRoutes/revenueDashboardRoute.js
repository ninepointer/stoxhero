const express = require("express");
const router = express.Router({mergeParams: true});
const {getTestZoneRevenue} = require('../../controllers/revenueController/revenuDashboardController');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/gettestzonerevenue').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getTestZoneRevenue);


module.exports = router;