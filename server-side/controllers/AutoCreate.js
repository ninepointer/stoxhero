const TestZone = require("../models/DailyContest/dailyContest");
const MarginX = require("../models/marginX/marginX");
const {ObjectId} = require('mongodb');
const moment = require('moment');
const Holiday = require('../models/TradingHolidays/tradingHolidays');


exports.autoCreate = async()=>{
    await autoTestZoneCreate();

}

const autoTestZoneCreate = async () => {
    const today = moment();
    const startOfDay = today.clone().startOf('day').add(2, 'day');
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

    const checkStartDate = await holiday(holidays, startOfDay, 'next');
    const checkLiveDate = await holiday(holidays, startOfDay.clone().subtract(1, 'day'), 'back');

    const startDate = checkStartDate.clone().add(9, 'hours').add(30, 'minutes');
    const endDate = checkStartDate.clone().add(15, 'hours').add(20, 'minutes');
    const liveDate = checkLiveDate.clone().add(9, 'hours').add(30, 'minutes');

    for(const elem of testzoneDetail){
        elem.contestStartTime = startDate;
        elem.contestEndTime = endDate;
        elem.contestLiveTime = liveDate;

        const slugCount = await TestZone.countDocuments({ slug: elem.slug });
        elem.slug = slugCount ? `${elem.slug}-${slugCount + 1}` : elem.slug;

        elem.description = elem.contestName;
        elem.contestType = "Mock";
        elem.currentLiveStatus = "Mock";
        elem.contestFor = "StoxHero";
        elem.maxPayout = 0;
        elem.payoutType = "Percentage";
        elem.rewardType = "Cash";
        elem.tdsRelief = true;
        elem.visibility = true;
        elem.contestStatus = "Active";
        elem.createdBy = new ObjectId("6458b9a5c9c87e7c6584b39b");
        elem.contestExpiry = "Day";
        elem.payoutPercentageType = "Daily";
        elem.isNifty = true;
        elem.isBankNifty = false;
        elem.isFinNifty = false;
        elem.visibleToInfluencerUser = true;
        elem.product = new ObjectId("6517d48d3aeb2bb27d650de5");
    }
    
    await TestZone.create(testzoneDetail);
};

const holiday = async (holidays, date, backOrForward) => {
    let newDate = moment(date);
    
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

    return holidays.some(elem => {
        return moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'day') && 
        moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'month') && 
        moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'year')
    });
};

const isWeekend = (date) => {
    return date.day() === 0 || date.day() === 6; // Sunday or Saturday
};
