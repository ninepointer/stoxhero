const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({ mergeParams: true });
const { createBattle, getAllBattles, getCompletedBattles, todaysBattle, getCancelledBattles,
    getOngoingBattles, getUpcomingBattles, editBattle, getBattleById, getDraftBattles,
    participateUsers, copyAndShare, purchaseIntent, deductBattleAmount, findBattleByName,
    getUserLiveBattles, getUserUpcomingBattles, getUserCompletedBattles, getPrizeDetails } = require('../../controllers/battles/battleController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createBattle).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllBattles);
router.get('/upcoming', Authenticate, restrictTo('Admin', 'SuperAdmin'), getUpcomingBattles);
router.get('/today', Authenticate, todaysBattle);
router.get('/findbyname', findBattleByName);
router.get('/ongoing', Authenticate, restrictTo('Admin', 'SuperAdmin'), getOngoingBattles);
router.get('/completed', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCompletedBattles);
router.get('/cancelled', Authenticate, restrictTo('Admin', 'SuperAdmin'), getCancelledBattles);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftBattles);
// router.route('/share/:id').put(Authenticate, copyAndShare);  
router.get('/userlive', Authenticate, getUserLiveBattles);
router.get('/userupcoming', Authenticate, getUserUpcomingBattles);
router.get('/usercompleted', Authenticate, getUserCompletedBattles);
router.patch('/feededuct', Authenticate, deductBattleAmount);

router.put('/purchaseintent/:id', Authenticate, purchaseIntent);
router.get('/prizedetail/:id', Authenticate, getPrizeDetails);

// router.put('participate/:id', Authenticate, participateUsers);
// router.get('/live', Authenticate, getOngoingBattles);
// router.get('/allbattleusers', Authenticate, restrictTo('Admin', 'SuperAdmin'), getBattleAllUsers);
router.route('/:id').put(Authenticate, restrictTo('Admin', 'SuperAdmin'), editBattle).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getBattleById);

// router.get('/:id/user', Authenticate, getBattleByIdUser);


module.exports = router;