const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createMarginX, getAllMarginXs, getCompletedMarginXs, todaysMarinX,
    getOngoingMarginXs, getUpcomingMarginXs, editMarginX, getMarginXById, getDraftMarginXs, 
    participateUsers, copyAndShare, purchaseIntent} = require('../../controllers/marginX/marginxController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createMarginX).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllMarginXs);
router.get('/upcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), getUpcomingMarginXs );
router.get('/today', Authenticate, todaysMarinX);

router.get('/ongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), getOngoingMarginXs);
router.get('/completed', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCompletedMarginXs);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftMarginXs);
router.route('/share/:id').put(Authenticate, copyAndShare);    
router.put('/purchaseintent/:id', Authenticate, purchaseIntent);
router.put('participate/:id', Authenticate, participateUsers);    
router.get('/live', Authenticate, getOngoingMarginXs);
router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'),editMarginX).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getMarginXById);


module.exports=router;