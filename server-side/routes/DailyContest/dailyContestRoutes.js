const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const contestController = require('../../controllers/dailyContestController');

router.post('/contest', Authenticate, contestController.createContest);
router.get('/contest/dailycontestusers', contestController.getDailyContestUsers);
router.get('/contestusers', contestController.getUsers);
router.patch('/feededuct', Authenticate, contestController.deductSubscriptionAmount);
router.get('/contest/:id', contestController.getContest);

router.put('/contest/:id', contestController.editContest);
router.put('/purchaseintent/:id', Authenticate, contestController.purchaseIntent);

router.delete('/contest/:id', contestController.deleteContest);
router.put('/contest/:id/participate', Authenticate, contestController.participateUsers);
router.put('/contest/:id/varifycodeandparticipate', Authenticate, contestController.verifyCollageCode);

router.put('/contest/:id/register',Authenticate, contestController.registerUserToContest);
router.put('/contest/:id/share',Authenticate, contestController.copyAndShare);

router.put('/contest/:id/allow/:userId', contestController.addAllowedUser);
router.put('/contest/:id/remove/:userId', contestController.removeAllowedUser);

// Routes for getting contests 
router.get('/contests', contestController.getAllContests);
router.get('/contests/upcoming', contestController.getUpcomingContests);
router.get('/contests/today', contestController.todaysContest);

router.get('/contests/adminupcoming', contestController.getAdminUpcomingContests);
router.get('/contests/completed', Authenticate, contestController.getCompletedContests);

router.get('/contests/collegeupcoming', contestController.getUpcomingCollegeContests);
router.get('/contests/collegecompleted', Authenticate, contestController.getCompletedCollegeContests);

router.get('/contests/completedadmin', Authenticate, contestController.getCommpletedContestsAdmin);
router.get('/contests/draft', contestController.getDraftContests);



module.exports=router;