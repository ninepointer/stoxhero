import moment from 'moment';


export function dailyPnlCompany(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['DATE','WEEKDAY', 'GROSS P&L', 'TRANSACTION COST', 'NET P&L', '# OF TRADES']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek - 1];
  
        return [elem?._id?.date,
        // moment.utc(new Date(elem?._id?.date)).utcOffset('+00:00').format('dddd'),
          weekday,
        elem?.gpnl,
        elem?.brokerage,
        elem?.npnl,
        elem?.noOfTrade]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function traderWisePnl(data, holiday, userData) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['TRADER NAME','GROSS P&L', 'TRANSACTION COST', 'NET P&L', '# OF TRADES', 'TRADING DAYS', '# OF REFERRAL', 'PAYOUT', 'ATTENDANCE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [elem?.name,
        elem?.gpnl,
        elem?.brokerage,
        elem?.npnl,
        elem?.noOfTrade,
        elem?.tradingDays,
        elem?.referralCount,
        elem?.payout,
        elem?.attendancePercentage
    
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function activeTrader(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['NAME','EMAIL', 'MOBILE', 'TRADING DAYS']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {  
        return [
        elem?.name,
        elem?.email,
        elem?.mobile,
        elem?.tradingDays
        ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function inactiveTrader(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['NAME','EMAIL', 'MOBILE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {  
        return [
        elem?.name,
        elem?.email,
        elem?.mobile,
        ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function collegeWiseInfo(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['COLLEGE NAME','TOTAL USER', 'ACTIVE USER', 'INACTIVE USER']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {  
        return [
        elem?.collegeName,
        elem?.totalUser,
        elem?.activeUser,
        elem?.inactiveUser
        ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function collegeWiseActiveUser(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['NAME','EMAIL', 'MOBILE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {  
        return [
        elem?.first_name+" "+elem?.last_name,
        elem?.email,
        elem?.mobile,
        ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function collegeWiseInactiveUser(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['NAME','EMAIL', 'MOBILE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {  
        return [
        elem?.first_name+" "+elem?.last_name,
        elem?.email,
        elem?.mobile,
        elem?.tradingDays
        ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

function calculateWorkingDays(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);

    // Increase the endDate by one day
    end.add(1, 'day');

    // Check if the start date is after the end date
    if (start.isAfter(end)) {
        return 0;
    }

    let workingDays = 0;
    let currentDate = start;

    // Iterate over each day between the start and end dates
    while (currentDate.isSameOrBefore(end)) {
        // Check if the current day is a weekday (Monday to Friday)
        if (currentDate.isoWeekday() <= 5) {
            workingDays++;
        }

        // Move to the next day
        currentDate = currentDate.add(1, 'day');
    }

    return workingDays;
}

// collegeWiseUserInfo inactiveUserInfo activeUserInfo