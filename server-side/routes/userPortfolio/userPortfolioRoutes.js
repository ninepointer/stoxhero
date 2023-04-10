const express = require("express");
const router = express.Router({mergeParams: true});
const {createPortfolio, getPortfolios, getPortfolio, editPortfolio, editPortfolioWithName} = require('../../controllers/portfolioController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPortfolio).get(getPortfolios).patch(Authenticate, editPortfolioWithName)
// router.route('/mycontests').get(Authenticate, myContests);
// router.route('/active').get(getActiveContests)
router.route('/:id').get(getPortfolio).patch(Authenticate, editPortfolio)
// router.use('/:id/trades', contestTradeRoutes);
module.exports = router;