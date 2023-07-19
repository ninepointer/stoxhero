const express = require("express");
const router = express.Router({mergeParams: true});
const {myTenXPortfolio, myVirtualFreePortfolio, getPortfolioPnl, myPortfolios, 
        getTenXPortolios, createPortfolio, getPortfolios, getPortfolio, editPortfolio,
        editPortfolioWithName,getContestPortolios,getTradingPortolios,getInactivePortolios, 
        getUserPortfolio, getDailyContestPortolios, getPortfolioRemainingAmount, getInternshipPortolios} = require('../../controllers/portfolioController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createPortfolio).get(getPortfolios).patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editPortfolioWithName)
router.route('/contest').get(Authenticate, getContestPortolios)
router.route('/tenx').get(Authenticate, getTenXPortolios)
router.route('/pnl').get(Authenticate, getPortfolioPnl)
router.route('/user').get(Authenticate, getUserPortfolio)
router.route('/my').get(Authenticate, myPortfolios)
router.route('/trading').get(Authenticate, getTradingPortolios)
router.route('/inactive').get(Authenticate, getInactivePortolios)
router.route('/myTenx').get(Authenticate, myTenXPortfolio)
router.route('/internship').get(Authenticate, getInternshipPortolios)
router.route('/dailycontestportfolio').get(Authenticate, getDailyContestPortolios)
router.route('/myPortfolio').get(Authenticate, myVirtualFreePortfolio)
router.route('/:id').get(Authenticate, getPortfolio).patch(Authenticate, editPortfolio)
router.route('/:portfolioId/:contestId/remainAmount').get(Authenticate, getPortfolioRemainingAmount); 

module.exports = router;