// const express = require("express");
// const Authenticate = require('../../authentication/authentication');
// const router = express.Router({mergeParams: true});
// const battleController = require('../../controllers/battleController');
// const restrictTo = require('../../authentication/authorization');

// router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.createBattle);
// router.route('/:id/rules').get(battleController.getRules).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.createRule);
// router.route('/:id/rules/:ruleId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editRules);
// router.route('/:id/rewards').get(battleController.getRewards).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.addReward);
// router.route('/:id/rewards/:rewardId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editReward);
// // router.get('/contest/dailycontestusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getDailyContestUsers);
// router.get('/battleusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getUsers);
// router.patch('/feededuct', Authenticate, battleController.deductSubscriptionAmount);
// router.put('/purchaseintent/:id', Authenticate, battleController.purchaseIntent);

// // router.delete('/contest/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.deleteContest);
// // router.put('/contest/:id/participate', Authenticate, contestController.participateUsers);
// // router.put('/contest/:id/varifycodeandparticipate', Authenticate, contestController.verifyCollageCode);

// router.put('/:id/register',Authenticate, battleController.registerUserToBattle);
// router.put('/:id/share', Authenticate, battleController.copyAndShare);

// // // router.put('/contest/:id/allow/:userId', contestController.addAllowedUser);
// // // router.put('/contest/:id/remove/:userId', contestController.removeAllowedUser);

// // // Routes for getting contests 
// // router.get('/contests', Authenticate, restrictTo('Admin', 'SuperAdmin'), contestController.getAllContests);
// router.get('/upcoming', Authenticate, battleController.getUpcomingBattles);
// router.get('/onlyupcoming', Authenticate, battleController.getOnlyUpcomingBattles);

// router.get('/today', Authenticate, battleController.todaysBattle);
// router.get('/ongoing', Authenticate, battleController.ongoingBattle);

// router.get('/adminupcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getAdminUpcomingBattles);
// router.get('/adminongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.ongoingBattlesAdmin);
// // router.get('/:id/rules', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getBattleRules);
// // router.get('/contests/completed', Authenticate, contestController.getCompletedContests);

// // router.get('/contests/collegeupcoming', Authenticate, contestController.getUpcomingCollegeContests);
// // router.get('/contests/collegecompleted', Authenticate, contestController.getCompletedCollegeContests);

// router.get('/completedadmin', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getCommpletedBattlesAdmin);
// router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.getDraftBattles);
// router.get('/:id', Authenticate, battleController.getBattle);
// router.put('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), battleController.editBattle);


// module.exports=router;

const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createBattle, getAllBattles, getCompletedBattles, todaysBattle, getCancelledBattles,
    getOngoingBattles, getUpcomingBattles, editBattle, getBattleById, getDraftBattles, 
    participateUsers, copyAndShare, purchaseIntent, deductBattleAmount, findBattleByName,
    getUserLiveBattles, getUserUpcomingBattles, getUserCompletedBattles, getBattleAllUsers,getBattleByIdUser} = require('../../controllers/battles/battleController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createBattle).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllBattles);
router.get('/upcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), getUpcomingBattles );
router.get('/today', Authenticate, todaysBattle);
// router.get('/findbyname', Authenticate, findBattleByName);
router.get('/ongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), getOngoingBattles);
router.get('/completed', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCompletedBattles);
router.get('/cancelled', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCancelledBattles);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftBattles);
// router.route('/share/:id').put(Authenticate, copyAndShare);  
router.get('/userlive', Authenticate, getUserLiveBattles);
router.get('/userupcoming', Authenticate, getUserUpcomingBattles);
// router.get('/usercompleted', Authenticate, getUserCompletedBattles);  
// router.put('/purchaseintent/:id', Authenticate, purchaseIntent);
// router.put('participate/:id', Authenticate, participateUsers);
// router.patch('/feededuct', Authenticate, deductBattleAmount);    
// router.get('/live', Authenticate, getOngoingBattles);
// router.get('/allbattleusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), getBattleAllUsers);
router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'),editBattle).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'),getBattleById);

// router.get('/:id/user', Authenticate, getBattleByIdUser);


module.exports=router;