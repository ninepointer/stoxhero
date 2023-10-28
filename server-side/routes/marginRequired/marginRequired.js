const express = require("express");
const router = express.Router({mergeParams: true});
const {traderMarginHistoryLive, compnayMarginHistoryLive, traderMarginTodayLive, companyMarginTodayLive,
    traderMarginHistoryMock, compnayMarginHistoryMock, traderMarginTodayMock, companyMarginTodayMock, marginRequiredForTrade } = require('../../controllers/marginRequired');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');

router.route('/').get(Authenticate, marginRequiredForTrade);
router.route('/mock/companymargintoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), companyMarginTodayMock);
router.route('/mock/companymarginhistory').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), compnayMarginHistoryMock);
router.route('/mock/tradermargintoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderMarginTodayMock)
router.route('/mock/tradermarginhistory').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderMarginHistoryMock);
router.route('/live/companymargintoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), companyMarginTodayLive);
router.route('/live/companymarginhistory').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), compnayMarginHistoryLive)
router.route('/live/tradermargintoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderMarginTodayLive);
router.route('/live/tradermarginhistory').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderMarginHistoryLive)

module.exports = router;