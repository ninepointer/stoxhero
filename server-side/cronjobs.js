



const moment = require('moment');
const Holiday = require('./models/TradingHolidays/tradingHolidays');
const nodeCron = require("node-cron");
const Setting = require("./models/settings/setting");
const { appLive, appOffline } = require('./controllers/appSetting');
const { saveLiveUsedMargin, saveMockUsedMargin, saveMockDailyContestUsedMargin, saveXtsMargin } = require("./controllers/marginRequired")
const { autoCutMainManually, autoCutMainManuallyMock } = require("./controllers/AutoTradeCut/mainManually");
const { tradableInstrument } = require("./controllers/TradableInstrument/tradableInstrument")
const { openPrice } = require("./marketData/setOpenPriceFlag");
const { updateUserWallet } = require('./controllers/internshipTradeController');
const { EarlySubscribedInstrument } = require("./marketData/earlySubscribeInstrument");
const { subscribeTokens } = require('./marketData/kiteTicker');
const { autoExpireTenXSubscription } = require("./controllers/tenXTradeController");
const { mail } = require("./controllers/dailyReportMail")
const { dailyContestTradeCut, dailyContestTimeStore } = require("./dailyContestTradeCut")
const { removeInstrumentFromWatchlist } = require("./controllers/instrument");

exports.cronjobs = async () => {
    if (process.env.PROD === "true") {
        const today = moment();
        const firstDayOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
        const holidays = await Holiday.find({ holidayDate: { $gte: new Date(firstDayOfMonth) } });
        const setting = await Setting.findOne({});
        const isHoliday = await holiday(holidays, setting?.weekStart, setting?.weekEnd);

        await appLiveOffline(isHoliday, setting);
        await otherJobs(isHoliday);
    }
}

async function appLiveOffline(isHoliday, setting) {

    const appStartTime = new Date(setting?.time?.appStartTime);
    const appEndTime = new Date(setting?.time?.appEndTime);

    const appStartHour = appStartTime.getHours();
    const appStartMinute = appStartTime.getMinutes();

    const appEndHour = appEndTime.getHours();
    const appEndMinute = appEndTime.getMinutes();

    if (!isHoliday) {
        const date = new Date();
        const weekDay = date.getDay();
        console.log('live ofline running');
        const onlineApp = nodeCron.schedule(`${appStartMinute} ${appStartHour} * * ${weekDay}`, () => {
            appLive();
        });

        const offlineApp = nodeCron.schedule(`${appEndMinute} ${appEndHour} * * ${weekDay}`, () => {
            appOffline();
        });
    }
}

async function otherJobs(isHoliday){
    if (!isHoliday) {
        const date = new Date();
        const weekDay = date.getDay();
        console.log('other jobs running');

        const autotrade = nodeCron.schedule(`50 9 * * *`, async () => {
            autoCutMainManually();
            autoCutMainManuallyMock();
        });

        // const saveMargin = nodeCron.schedule(`*/5 3-10 * * ${weekDay}`, () => {
        //     saveLiveUsedMargin();
        //     saveMockUsedMargin();
        //     saveMockDailyContestUsedMargin();
        //     saveXtsMargin();
        // });
        const setOpenPriceFlag = nodeCron.schedule(`46 3 * * *`, () => {
            openPrice();
            EarlySubscribedInstrument();
        });

        const subscribeTokensData = nodeCron.schedule(`48 3 * * *`, () => {
            subscribeTokens();
        });
    }

    const autoExpire = nodeCron.schedule(`0 30 10 * * *`, autoExpireTenXSubscription);
    const internshipPayout = nodeCron.schedule(`0 30 17 * * *`, updateUserWallet);
    const reportMail = nodeCron.schedule(`0 0 18 * * *`, mail);
    const dailyContest = nodeCron.schedule(`1 30 6 * * *`, dailyContestTradeCut);
    const dailyContest2oclock = nodeCron.schedule(`1 30 8 * * *`, dailyContestTradeCut);
    const dailyContesttimeStore = nodeCron.schedule(`49 3 * * *`, dailyContestTimeStore);
    const tradableInstrumentPopulate = nodeCron.schedule(`0 30 16 * * *`, tradableInstrument);
    const removeInstrumentFromWatch = nodeCron.schedule(`0 0 1 * * *`, removeInstrumentFromWatchlist);
}

const holiday = async (holidays, weekStart, weekEnd) => {
    let newDate = moment();
    
    while (isHoliday(newDate, holidays) || isWeekend(newDate, weekStart, weekEnd)) {
        return true;
    }

    return false;
};

const isHoliday = (date, holidays) => {
    return holidays.some(elem => {
        return moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'day') && 
        moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'month') && 
        moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'year')
    });
};

const isWeekend = (date, weekStart, weekEnd) => {
    return date.day() === weekStart || date.day() === weekEnd; // Sunday or Saturday
};
