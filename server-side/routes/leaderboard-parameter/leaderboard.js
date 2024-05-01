const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const leaderboardController = require('../../controllers/leaderboard-parameter/leaderboard');
const restrictTo = require('../../authentication/authorization');


router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.createLeaderboard);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.editLeaderboard);
// Routes for getting contests 
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.active);
router.get('/inactive', Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.inActive);

router.route('/:id/rewards').get(leaderboardController.getRewards).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.addReward);
router.route('/:id/rewards/:rewardId').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), leaderboardController.editReward);
router.delete("/:id/rewards/:rewardId", Authenticate, restrictTo("Admin", "SuperAdmin"), leaderboardController.deleteReward);


module.exports=router;