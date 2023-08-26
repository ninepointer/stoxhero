const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const contestController = require('../../controllers/dailyContestController');
const restrictTo = require('../../authentication/authorization');

router.post('/contest', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.createContest);
router.get('/contest/dailycontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestUsers);
router.get('/contest/dailyallcontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestAllUsers);
router.get('/contestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getUsers);
router.patch('/feededuct', Authenticate, contestController.deductSubscriptionAmount);
router.get('/contest/:id', Authenticate, contestController.getContest);

router.put('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.editContest);
router.put('/purchaseintent/:id', Authenticate, contestController.purchaseIntent);

router.delete('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.deleteContest);
router.put('/contest/:id/participate', Authenticate, contestController.participateUsers);
router.put('/contest/:id/varifycodeandparticipate', Authenticate, contestController.verifyCollageCode);

router.put('/contest/:id/register',Authenticate, contestController.registerUserToContest);
router.put('/contest/:id/share',Authenticate, contestController.copyAndShare);

// router.put('/contest/:id/allow/:userId', contestController.addAllowedUser);
// router.put('/contest/:id/remove/:userId', contestController.removeAllowedUser);

// Routes for getting contests 
router.get('/contests', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAllContests);
router.get('/contests/upcoming', Authenticate, contestController.getUpcomingContests);
router.get('/contests/userlive', Authenticate, contestController.getUserLiveContests);
router.get('/contests/userupcoming', Authenticate, contestController.getUserUpcomingContests);
router.get('/contests/onlyupcoming', Authenticate, contestController.getOnlyUpcomingContests);

router.get('/contests/today', Authenticate, contestController.todaysContest);
router.get('/contests/ongoing', Authenticate, contestController.ongoingContest);

router.get('/contests/adminupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAdminUpcomingContests);
router.get('/contests/adminongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.ongoingContestAdmin);
router.get('/contests/completed', Authenticate, contestController.getCompletedContests);

router.get('/contests/collegeupcoming', Authenticate, contestController.getUpcomingCollegeContests);
router.get('/contests/collegecompleted', Authenticate, contestController.getCompletedCollegeContests);

router.get('/contests/completedadmin', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getCommpletedContestsAdmin);
router.get('/contests/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDraftContests);



module.exports=router;