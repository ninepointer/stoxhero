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

        const attendanceLimit = elem.attendancePercentage;
        const referralLimit = elem.referralCount;
        const payoutPercentage = elem.payoutPercentage;
        const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
        const reliefReferralLimit = referralLimit - referralLimit * 10 / 100

        // const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem?.dayOfWeek-1];
        const referral = userData?.filter((subelem) => {
          return subelem?._id?.toString() == elem?.userId?.toString();
        })

        const batchEndDate = moment(elem.batchEndDate);
        const currentDate = moment();
        const endDate = batchEndDate.isBefore(currentDate) ? batchEndDate.format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD");
        const attendance = (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday));
        let refCount = referral[0]?.referrals?.length;
        elem.isPayout = false;
        const profitCap = 15000;

        if (attendance >= attendanceLimit && refCount >= referralLimit && elem?.npnl > 0) {
          console.log("payout 1sr");
          elem.isPayout = true;
        }

        if (!(attendance >= attendanceLimit && refCount >= referralLimit) && (attendance >= attendanceLimit || refCount >= referralLimit) && elem?.npnl > 0) {
          if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
            elem.isPayout = true;
            console.log("payout relief");
          }
          if (refCount < referralLimit && refCount >= reliefReferralLimit) {
            elem.isPayout = true;
            console.log("payout relief");
          }
        }

  
        return [elem?.name,
        elem?.gpnl,
        elem?.brokerage,
        elem?.npnl,
        elem?.noOfTrade,
        elem?.tradingDays,
        referral[0]?.referrals?.length,
        elem.isPayout ? Math.min((elem?.npnl * payoutPercentage / 100).toFixed(0), profitCap) : 0,
        (elem?.tradingDays * 100 / (calculateWorkingDays(elem.batchStartDate, endDate) - holiday)).toFixed(0)
    
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