const express = require("express");
const router = express.Router({mergeParams: true});
const {traderMarginHistoryLive, compnayMarginHistoryLive, traderMarginTodayLive, companyMarginTodayLive,
    traderMarginHistoryMock, compnayMarginHistoryMock, traderMarginTodayMock, companyMarginTodayMock } = require('../../controllers/marginRequired');

const Authenticate = require('../../authentication/authentication');


router.route('/mock/companymargintoday').get(Authenticate, companyMarginTodayMock);
router.route('/mock/companymarginhistory').get(Authenticate, compnayMarginHistoryMock);
router.route('/mock/tradermargintoday').get(Authenticate, traderMarginTodayMock)
router.route('/mock/tradermarginhistory').get(Authenticate, traderMarginHistoryMock);
router.route('/live/companymargintoday').get(Authenticate, companyMarginTodayLive);
router.route('/live/companymarginhistory').get(Authenticate, compnayMarginHistoryLive)
router.route('/live/tradermargintoday').get(Authenticate, traderMarginTodayLive);
router.route('/live/tradermarginhistory').get(Authenticate, traderMarginHistoryLive)

module.exports = router;