const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createMarginX, getAllMarginXs, getCompletedMarginXs, 
    getOngoingMarginXs, getUpcomingMarginXs, editMarginX, getMarginXById} = require('../../controllers/marginxController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createMarginX).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllMarginXs);
router.get('/upcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), getUpcomingMarginXs );
router.get('/ongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), getOngoingMarginXs);
router.get('/completed', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCompletedMarginXs);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'),editMarginX).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMarginXById);

module.exports=router;