const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createTradingHoliday, getTradingHolidays, getTradingHolidayById, 
        editTradingHoliday, deleteTradingHoliday, getUpcomingTradingHolidays, getPastTradingHolidays} = require('../../controllers/tradingHolidays/tradingHolidaysController');


router.route('/').post(Authenticate, createTradingHoliday).get(getTradingHolidays);
router.route('/upcoming').get(getUpcomingTradingHolidays);
router.route('/past').get(getPastTradingHolidays);
router.route('/:id').patch(Authenticate, editTradingHoliday).get(getTradingHolidayById);
router.route('/delete/:id').patch(deleteTradingHoliday)


module.exports = router;
