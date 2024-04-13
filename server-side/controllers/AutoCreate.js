const TestZone = require("../models/DailyContest/dailyContest");
const MarginX = require("../models/marginX/marginX");
const {ObjectId} = require('mongodb');
const moment = require('moment');
const Holiday = require('../models/TradingHolidays/tradingHolidays');

// "contestStartTime": {
//     "$date": "2024-04-15T04:00:00.000Z"
//   },
//   "contestEndTime": {
//     "$date": "2024-04-15T09:50:00.000Z"
//   },
//   "contestLiveTime": {
//     "$date": "2024-04-12T04:00:51.000Z"
//   },
exports.autoCreate = async()=>{
    const today = moment();
    const startOfDay = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    const holidays = await Holiday.find({holidayDate: {$gte: new Date(firstDayOfMonth)}});
    const testzoneDetail = [
        {
            "contestName": "NIFTY Heroes (Free)",
            "slug": "undefined-804",
            "entryFee": 0,
            "initialFee": 0,
            "payoutPercentage": 0.05,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 1000,
            "payoutCapPercentage": 0.25
        },
        {
            "contestName": "BANKNIFTY Heroes (Free)",
            "slug": "undefined-804",
            "entryFee": 0,
            "initialFee": 0,
            "payoutPercentage": 0.05,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 1000,
            "payoutCapPercentage": 0.25
        },
        {
            "contestName": "Monday Mania",
            "slug": "undefined-804",
            "entryFee": 50,
            "initialFee": 100,
            "payoutPercentage": 0.5,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 800,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "Monday Trident",
            "slug": "undefined-804",
            "entryFee": 100,
            "initialFee": 300,
            "payoutPercentage": 0.75,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 500,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "StoxHero Thunder",
            "slug": "undefined-804",
            "entryFee": 200,
            "initialFee": 500,
            "payoutPercentage": 1,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 100,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "StoxHero Star",
            "slug": "undefined-804",
            "entryFee": 300,
            "initialFee": 500,
            "payoutPercentage": 1.5,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "StoxHero Target",
            "slug": "undefined-804",
            "entryFee": 400,
            "initialFee": 800,
            "payoutPercentage": 2,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "StoxHero Blaze",
            "slug": "undefined-804",
            "entryFee": 600,
            "initialFee": 1000,
            "payoutPercentage": 2,
            "featured": true,
            "portfolio": new ObjectId("65fb40297ccc4ca35f3096f5"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250
        },
        {
            "contestName": "StoxHero Dream",
            "slug": "undefined-804",
            "entryFee": 1000,
            "initialFee": 1500,
            "payoutPercentage": 2,
            "featured": true,
            "portfolio": new ObjectId("64d90cc4e6eb301d7f34fdd2"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250
        }
    ];

    console.log('startOfDay', startOfDay);
    const checkStartDate = await holiday(holidays, startOfDay, 'next');
    console.log('startOfDay 2', startOfDay);
    const checkLiveDate = await holiday(holidays, startOfDay, 'back');

    console.log(checkStartDate
        , checkLiveDate
    );
    const startDate = checkStartDate.clone().add(9, 'hours').add(30, 'minutes');
    const endDate = checkStartDate.clone().add(15, 'hours').add(20, 'minutes');

    const liveDate = checkLiveDate.clone().add(9, 'hours').add(30, 'minutes');
    console.log(new Date(startDate), new Date(endDate), new Date(liveDate));
    // for(let elem of testzoneDetail){
    //     const slugCount = await Contest.countDocuments({ slug: elem.slug });
    // }
    // const marginxDetail = ['']

}

const holiday = async (holidays, date, backOrForward) => {
    let newDate = moment(date);

    // Loop until the date is not a holiday or a weekend
    while (isHoliday(newDate, holidays) || isWeekend(newDate)) {
        if (backOrForward === 'back') {
            newDate = newDate.subtract(1, 'days');
        } else {
            newDate = newDate.add(1, 'days');
        }
    }

    return newDate;
};

const isHoliday = (date, holidays) => {
    // console.log('isHoliday',
    // moment(elem.holidayDate).isSame(date, 'day') , 
    // moment(elem.holidayDate).isSame(date, 'month') , 
    // moment(elem.holidayDate).isSame(date, 'year'));
    console.log('holidays', holidays.length);

    return holidays.some(elem => moment(elem.holidayDate).isSame(date, 'day') && 
                                  moment(elem.holidayDate).isSame(date, 'month') && 
                                  moment(elem.holidayDate).isSame(date, 'year'));
};

const isWeekend = (date) => {
    console.log('weekend', date.day())
    return date.day() === 0 || date.day() === 6; // Sunday or Saturday
};
