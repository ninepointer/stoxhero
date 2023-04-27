const express = require("express");
const router = express.Router({mergeParams: true});
const {overallPnl} = require('../../controllers/paperTradeController');
const Authenticate = require('../../authentication/authentication');


router.route('/pnl').get(Authenticate, overallPnl)
// patch(Authenticate, editContest);
// router.route('/mycontests').get(Authenticate, myContests);
// router.route('/lots').get(autoTradeContest);
// router.route('/active').get(getActiveContests)
// router.route('/history').get(Authenticate, contestHistory)
// router.route('/:id').get(getContest).post(Authenticate, joinContest).patch(Authenticate, editContest)
// router.route('/:id/exit').delete(Authenticate, exitContest)
// router.use('/:id/trades', contestTradeRoutes);
// router.use('/:id/updateStatus', updateStatus);
// router.use('/:id/syncTime', getTimeForSync);

module.exports = router;
