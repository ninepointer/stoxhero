const TestZone = require("../models/DailyContest/dailyContest");
const MarginX = require("../models/marginX/marginX");
const {ObjectId} = require('mongodb');
const moment = require('moment');
const Holiday = require('../models/TradingHolidays/tradingHolidays');


exports.autoCreate = async(res)=>{
    const testzone = await autoTestZoneCreate();
    const marginx = await autoMarginxCreate();

    if(testzone || marginx){
        res.status(200).json({status: 'success', message: 'Created Successfully'})
    }

    if(!testzone && !marginx){
        res.status(200).json({status: 'error', message: 'Already exists'})
    }
}

const autoTestZoneCreate = async () => {
    const today = moment();
    const startOfDay = today.clone().startOf('day').add(1, 'day');
    const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    const holidays = await Holiday.find({holidayDate: {$gte: new Date(firstDayOfMonth)}});

    const checkStartDate = await holiday(holidays, startOfDay, 'next');
    const checkLiveDate = await holiday(holidays, startOfDay.clone().subtract(1, 'day'), 'back');

    const startDate = checkStartDate.clone().add(4, 'hours');
    const endDate = checkStartDate.clone().add(9, 'hours').add(50, 'minutes');
    const liveDate = checkLiveDate.clone().add(4, 'hours');
    const increaseTime = ['StoxHero Dream', 'StoxHero Blaze', 'StoxHero Target'];

    const dateObject = new Date(startDate);
    const dayName = dateObject.toLocaleDateString("en-US", { weekday: "long" });
    const testzoneDetail = [
        {
            "contestName": "NIFTY Heroes (Free)",
            "slug": "nifty-heroes-free",
            "entryFee": 0,
            "initialFee": 0,
            "payoutPercentage": 0.05,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 1000,
            "payoutCapPercentage": 0.25,
            'isNifty': true,
            'isBankNifty': false,
            'isFinNifty': false
        },
        {
            "contestName": "BANKNIFTY Heroes (Free)",
            "slug": "banknifty-heroes-free",
            "entryFee": 0,
            "initialFee": 0,
            "payoutPercentage": 0.05,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 1000,
            "payoutCapPercentage": 0.25,
            'isNifty': false,
            'isBankNifty': true,
            'isFinNifty': false
        },
        {
            "contestName": `${dayName} Mania`,
            "slug": `${dayName?.toLowerCase()}-mania`,
            "entryFee": 50,
            "initialFee": 100,
            "payoutPercentage": 0.5,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 800,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": `${dayName} Trident`,
            "slug": `${dayName?.toLowerCase()}-trident`,
            "entryFee": 100,
            "initialFee": 300,
            "payoutPercentage": 0.75,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 500,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": "StoxHero Thunder",
            "slug": "stoxhero-thunder",
            "entryFee": 200,
            "initialFee": 500,
            "payoutPercentage": 1,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 100,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": "StoxHero Star",
            "slug": "stoxhero-star",
            "entryFee": 300,
            "initialFee": 500,
            "payoutPercentage": 1.5,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": "StoxHero Target",
            "slug": "stoxhero-target",
            "entryFee": 400,
            "initialFee": 800,
            "payoutPercentage": 2,
            "featured": false,
            "portfolio": new ObjectId("64e1dc4f67b51a10f9dd1aff"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": "StoxHero Blaze",
            "slug": "stoxhero-blaze",
            "entryFee": 600,
            "initialFee": 1000,
            "payoutPercentage": 2,
            "featured": true,
            "portfolio": new ObjectId("65fb40297ccc4ca35f3096f5"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        },
        {
            "contestName": "StoxHero Dream",
            "slug": "stoxhero-dream",
            "entryFee": 1000,
            "initialFee": 1500,
            "payoutPercentage": 2,
            "featured": true,
            "portfolio": new ObjectId("64d90cc4e6eb301d7f34fdd2"),
            "maxParticipants": 10,
            "payoutCapPercentage": 250,
            'isNifty': true,
            'isBankNifty': true,
            'isFinNifty': true
        }
    ];

    const checkAlreadyExist = await TestZone.find({contestStartTime: {$gte: new Date(startDate), $lt: new Date(endDate)}});
    if(checkAlreadyExist.length > 0){
        return false;
    }

    for(const elem of testzoneDetail){
        
        elem.contestStartTime = startDate;
        elem.contestEndTime = endDate;
        elem.contestLiveTime = liveDate;

        if(increaseTime.includes(elem.contestName)){
            elem.contestStartTime = new Date(elem.contestStartTime).setHours(5, 0, 0, 0);
        }

        const slugCount = await TestZone.countDocuments({ contestName: elem.contestName });
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
        elem.lastModifiedBy = new ObjectId("6458b9a5c9c87e7c6584b39b");
        elem.createdOn = new Date();
        elem.contestExpiry = "Day";
        elem.payoutPercentageType = "Daily";
        elem.isNifty = elem.isNifty;
        elem.isBankNifty = elem.isBankNifty;
        elem.isFinNifty = elem.isFinNifty;
        elem.visibleToInfluencerUser = true;
        elem.product = new ObjectId("6517d48d3aeb2bb27d650de5");
    }
    
    await TestZone.create(testzoneDetail);
    return true;
};

const autoMarginxCreate = async () => {
    const today = moment();
    const startOfDay = today.clone().startOf('day').add(1, 'day');
    const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
    const holidays = await Holiday.find({holidayDate: {$gte: new Date(firstDayOfMonth)}});
    const marginxDetail = [
        {
            "marginXName": "MarginX - Beginner",
            "marginXTemplate": new ObjectId("64f4b0b4827e600fb13dbc53"),
            "maxParticipants": 700
        },
        {
            "marginXName": "MarginX - Intermediate",
            "marginXTemplate": new ObjectId("64f4b1cb307d9d4dc18ef484"),
            "maxParticipants": 500
        },
        {
            "marginXName": "MarginX - Advanced",
            "marginXTemplate": new ObjectId("64f4b1e0a2689faa5c63038b"),
            "maxParticipants": 200
        },
        {
            "marginXName": "MarginX - Professional",
            "marginXTemplate": new ObjectId("64f4b1fb827e600fb13dbcd3"),
            "maxParticipants": 200
        },
        {
            "marginXName": "MarginX - Elite",
            "marginXTemplate": new ObjectId("64f4b213084074068136a21d"),
            "maxParticipants": 200
        },
        {
            "marginXName": "MarginX - Gold",
            "marginXTemplate": new ObjectId("64f4b243f82c569d2d28dcaa"),
            "maxParticipants": 200
        }
    ];

    const checkStartDate = await holiday(holidays, startOfDay, 'next');
    const checkLiveDate = await holiday(holidays, startOfDay.clone().subtract(1, 'day'), 'back');

    const startDate = checkStartDate.clone().add(4, 'hours');
    const endDate = checkStartDate.clone().add(9, 'hours').add(50, 'minutes');
    const liveDate = checkLiveDate.clone().add(4, 'hours');
    const checkAlreadyExist = await MarginX.find({startTime: {$gte: new Date(startDate), $lt: new Date(endDate)}});
    if(checkAlreadyExist.length > 0){
        return false;
    }
    for (const elem of marginxDetail) {
        elem.startTime = startDate;
        elem.endTime = endDate;
        elem.liveTime = liveDate;

        elem.status = "Active";
        elem.rewardType = "Cash";
        elem.tdsRelief = true;
        elem.lastModifiedOn = new Date();
        elem.createdOn = new Date();
        elem.createdBy = new ObjectId("6458b9a5c9c87e7c6584b39b");
        elem.lastModifiedBy = new ObjectId("6458b9a5c9c87e7c6584b39b");
        elem.marginXExpiry = "Day";
        elem.isNifty = true;
        elem.isBankNifty = true;
        elem.isFinNifty = true;
        elem.product = new ObjectId("6517d40e3aeb2bb27d650de1");
    }

    await MarginX.create(marginxDetail);
    return true;
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