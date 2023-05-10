const express = require("express");
const router = express.Router({mergeParams: true});
const {portfolioForMobile, getPortfolioPnl, myPortfolios, getTenXPortolios, createPortfolio, getPortfolios, getPortfolio, editPortfolio,editPortfolioWithName,getContestPortolios,getTradingPortolios,getInactivePortolios, getUserPortfolio, getPortfolioRemainingAmount} = require('../../controllers/portfolioController');
const Authenticate = require('../../authentication/authentication');


router.route('/').post(Authenticate, createPortfolio).get(getPortfolios).patch(Authenticate, editPortfolioWithName)
router.route('/contest').get(getContestPortolios)
router.route('/tenx').get(getTenXPortolios)
router.route('/pnl').get(Authenticate, getPortfolioPnl)
router.route('/user').get(Authenticate, getUserPortfolio)
router.route('/my').get(Authenticate, myPortfolios)
router.route('/trading').get(getTradingPortolios)
router.route('/inactive').get(getInactivePortolios)
router.route('/myPortfolio').get(portfolioForMobile)

router.route('/:id').get(getPortfolio).patch(Authenticate, editPortfolio)
router.route('/:portfolioId/:contestId/remainAmount').get(Authenticate, getPortfolioRemainingAmount); 

// router.use('/:id/trades', contestTradeRoutes);
module.exports = router;