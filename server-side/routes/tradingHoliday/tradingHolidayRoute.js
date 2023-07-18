const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createTradingHoliday, getTradingHolidays, getTradingHolidayById, 
        editTradingHoliday, deleteTradingHoliday, getUpcomingTradingHolidays, 
        getPastTradingHolidays, getTradingHolidayBetweenDates, getTodaysTradingHolidays} = require('../../controllers/tradingHolidays/tradingHolidaysController');


router.route('/').post(Authenticate, createTradingHoliday).get(getTradingHolidays);
router.route('/today').get(getTodaysTradingHolidays);
router.route('/upcoming').get(getUpcomingTradingHolidays);
router.route('/past').get(getPastTradingHolidays);
router.route('/:id').patch(Authenticate, editTradingHoliday).get(getTradingHolidayById);
router.route('/delete/:id').patch(deleteTradingHoliday)
router.route('/dates/:startDate/:endDate').get(getTradingHolidayBetweenDates)


module.exports = router;
