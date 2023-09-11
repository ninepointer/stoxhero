const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const battleController = require('../../controllers/battleController');
const restrictTo = require('../../authentication/authorization');

// router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.createBattle);
// router.route('/:id/rules').get(battleController.getRules).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.createRule);
// router.route('/:id/rules/:ruleId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editRules);
// router.route('/:id/rewards').get(battleController.getRewards).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.addReward);
// router.route('/:id/rewards/:rewardId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editReward);
// router.get('/contest/dailycontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestUsers);
router.get('/battleusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getUsers);
// router.patch('/feededuct', Authenticate, battleController.deductSubscriptionAmount);
// router.put('/purchaseintent/:id', Authenticate, battleController.purchaseIntent);

// router.delete('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.deleteContest);
// router.put('/contest/:id/participate', Authenticate, contestController.participateUsers);
// router.put('/contest/:id/varifycodeandparticipate', Authenticate, contestController.verifyCollageCode);

// router.put('/:id/register',Authenticate, battleController.registerUserToBattle);
// router.put('/:id/share', Authenticate, battleController.copyAndShare);

// // router.put('/contest/:id/allow/:userId', contestController.addAllowedUser);
// // router.put('/contest/:id/remove/:userId', contestController.removeAllowedUser);

// // Routes for getting contests 
// router.get('/contests', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAllContests);
// router.get('/upcoming', Authenticate, battleController.getUpcomingBattles);
// router.get('/onlyupcoming', Authenticate, battleController.getOnlyUpcomingBattles);

// router.get('/today', Authenticate, battleController.todaysBattle);
// router.get('/ongoing', Authenticate, battleController.ongoingBattle);

// router.get('/adminupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getAdminUpcomingBattles);
// router.get('/adminongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.ongoingBattlesAdmin);
// router.get('/:id/rules', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getBattleRules);
// router.get('/contests/completed', Authenticate, contestController.getCompletedContests);

// router.get('/contests/collegeupcoming', Authenticate, contestController.getUpcomingCollegeContests);
// router.get('/contests/collegecompleted', Authenticate, contestController.getCompletedCollegeContests);

// router.get('/completedadmin', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getCommpletedBattlesAdmin);
// router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getDraftBattles);
// router.get('/:id', Authenticate, battleController.getBattle);
// router.put('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editBattle);


module.exports=router;