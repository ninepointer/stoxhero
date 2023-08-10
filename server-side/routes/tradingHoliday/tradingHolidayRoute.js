const express = require("express");
// const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createTradingHoliday, getTradingHolidays, getTradingHolidayById, 
        editTradingHoliday, deleteTradingHoliday, getUpcomingTradingHolidays, 
        getPastTradingHolidays, getTradingHolidayBetweenDates, getTodaysTradingHolidays, nextTradingDay} = require('../../controllers/tradingHolidays/tradingHolidaysController');

const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');


router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createTradingHoliday).get(Authenticate, getTradingHolidays);
router.route('/today').get(Authenticate, getTodaysTradingHolidays);
router.route('/nextTradingDay').get(Authenticate, nextTradingDay);
router.route('/upcoming').get(Authenticate, getUpcomingTradingHolidays);
router.route('/past').get(Authenticate, getPastTradingHolidays);
router.route('/:id').patch(Authenticate, editTradingHoliday).get(getTradingHolidayById);
router.route('/delete/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), deleteTradingHoliday)
router.route('/dates/:startDate/:endDate').get(Authenticate, getTradingHolidayBetweenDates)


module.exports = router;
