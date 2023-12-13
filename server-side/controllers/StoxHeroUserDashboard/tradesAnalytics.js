const mongoose = require('mongoose');
const ContestTrading = require('../../models/DailyContest/dailyContestMockUser'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../../models/User/userDetailSchema");
const TenXTrading = require("../../models/mock-trade/tenXTraderSchema");
const PaperTrading = require("../../models/mock-trade/paperTrade");
const InternshipTrading = require("../../models/mock-trade/internshipTrade")
const MarginXTrading = require("../../models/marginX/marginXUserMock");
const BattleTrading = require("../../models/battle/battleTrade");
const { ObjectId } = require('mongodb');


exports.getTradeInformation = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          status : 'COMPLETE'
        },
      },
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
          },
        },
      },
      {
        $group: {
          _id: { date: "$_id.date" },
          trades: { $sum: 1 },
          turnover: { $sum: {$abs : "$amount"} },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    // Create a date-wise mapping of DAUs for different products
    const dateWiseTradeInformation = {};

    // console.log(virtualTraders)
    const response = {
      status: "success",
      message: "Contest Scoreboard fetched successfully",
      // data: Object.values(dateWiseDAUs).splice(Object.values(dateWiseDAUs).length <= 90 ? 0 : Object.values(dateWiseDAUs).length - 90,Object.values(dateWiseDAUs).length),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Controller for getting monthly active users
// Controller for getting monthly active users
exports.getMonthlyActiveUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            month: { $substr: ["$trade_time", 0, 7] },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: { month: "$_id.month" },
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    // Create a month-wise mapping of MAUs for different products
    const monthWiseMAUs = {};

    virtualTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].virtualTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });

    tenXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].tenXTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });

    contestTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].contest = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });

    internshipTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].internshipTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });
    marginXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].marginXTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });
    battleTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const month = _id.month;
      if (month !== "1970-01") {
        if (!monthWiseMAUs[month]) {
          monthWiseMAUs[month] = {
            month,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battleTrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].battleTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });

    console.log('monthwisemaus', monthWiseMAUs);

    // Calculate the month-wise total MAUs and unique users
    Object.keys(monthWiseMAUs).forEach(month => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, battleTrading, uniqueUsers } = monthWiseMAUs[month];
      monthWiseMAUs[month].total = virtualTrading + tenXTrading + contest + internshipTrading + marginXTrading + battleTrading;
      monthWiseMAUs[month].uniqueUsers = [...new Set(uniqueUsers)];
    });

    const response = {
      status: "success",
      message: "Monthly Active Users fetched successfully",
      data: Object.values(monthWiseMAUs).splice(Object.values(monthWiseMAUs).length <= 12 ? 0 : Object.values(monthWiseMAUs).length - 12,Object.values(monthWiseMAUs).length),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Controller for getting weekly active users
exports.getWeeklyActiveUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            week: { $week: "$trade_time" },
            year: { $year: "$trade_time" },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: { week: "$_id.week", year: "$_id.year" },
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
        },
      },
      {
        $match: {
          "_id.year": { $ne: 1970 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.week": 1,
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    // Create a week-wise mapping of WAUs for different products
    const weekWiseWAUs = {};

    virtualTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].virtualTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });

    tenXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].tenXTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });

    contestTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].contest = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });

    internshipTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].internshipTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });
    marginXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].marginXTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });
    battleTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const week = `${_id.year}-${_id.week}`;
      if (!weekWiseWAUs[week]) {
        weekWiseWAUs[week] = {
          week,
          virtualTrading: 0,
          tenXTrading: 0,
          contest: 0,
          internshipTrading: 0,
          marginXTrading:0,
          battleTrading:0,
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].battleTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });

    // Calculate the week-wise total WAUs and unique users
    Object.keys(weekWiseWAUs).forEach(week => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, battleTrading, uniqueUsers } = weekWiseWAUs[week];
      weekWiseWAUs[week].total = virtualTrading + tenXTrading + contest + internshipTrading + marginXTrading + battleTrading;
      weekWiseWAUs[week].uniqueUsers = [...new Set(uniqueUsers)];
    });

    const response = {
      status: "success",
      message: "Weekly Active Users fetched successfully",
      data: Object.values(weekWiseWAUs).splice(Object.values(weekWiseWAUs).length <= 52 ? 0 : Object.values(weekWiseWAUs).length - 52,Object.values(weekWiseWAUs).length),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getDailyActiveUsersOnPlatform = async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          trade_time: 1,
          trader: 1,
        },
      },
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: {
            date: "$_id.date",
          },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
        },
      },
      {
        $match: {
          "_id.date": { $ne: "1970-01-01" }, // Exclude year 1970
        },
      },
      {
        $project: {
          _id:0,
          date: "$_id.date",
          uniqueUsers: 1,
        },
      },
      {
        $sort: {
          "date": 1,
        },
      },
    ];

    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);


    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders];

    let dateToTradersMap = new Map();

    allTraders.forEach(({date, uniqueUsers}) => {
        if(dateToTradersMap.has(date)) {
            let existingTradersSet = dateToTradersMap.get(date);
            uniqueUsers.forEach(trader => existingTradersSet.add(trader));
        } else {
            dateToTradersMap.set(date, new Set(uniqueUsers));
        }
    });

    let result = Array.from(dateToTradersMap, ([date, traders]) => ({date, uniqueUsers: Array.from(traders), uniqueUsersCount: traders.size}));

    result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    const response = {
      status: "success",
      message: "Daily Active Users on platform fetched successfully",
      data: result.splice(result.length <= 90 ? 0 : result.length-90,result.length),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getMonthlyActiveUsersOnPlatform = async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          trade_time: 1,
          trader: 1,
        },
      },
      {
        $group: {
          _id: {
            month: { $substr: ["$trade_time", 0, 7] },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} }, // Calculate the total number of unique active users
        },
      },
      {
        $match: {
          "_id": { $ne: "1970-01" }, // Exclude year 1970
        },
      },
      {
        $project: {
          _id:0,
          month: "$_id",
          uniqueUsers: 1,
        },
      },
      {
        $sort: {
          "month": 1,
        },
      },
    ];
    
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

    let monthToTradersMap = new Map();

    allTraders.forEach(({month, uniqueUsers}) => {
        if(monthToTradersMap.has(month)) {
            let existingTradersSet = monthToTradersMap.get(month);
            uniqueUsers.forEach(trader => existingTradersSet.add(trader));
        } else {
            monthToTradersMap.set(month, new Set(uniqueUsers));
        }
    });

    let result = Array.from(monthToTradersMap, ([month, traders]) => ({month, uniqueUsers: Array.from(traders), uniqueUsersCount: traders.size}));

    result.sort((a, b) => (a.month > b.month ? 1 : b.month > a.month ? -1 : 0));
    
    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: result.splice(result.length <= 12 ? 0 : result.length-12,result.length),
    };
    

  res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getWeeklyActiveUsersOnPlatform = async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          trade_time: 1,
          trader: 1,
        },
      },
      {
        $group: {
          _id: {
            week: { 
              $dateToString: { format: "%G-%V", date: "$trade_time" }
            },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: "$_id.week",
          uniqueUsers: { $addToSet: { $toString : "$_id.trader" } }, // Calculate the total number of unique active users
        },
      },
      {
        $match: {
          "_id": { $ne: "1970-01" }, // Exclude year 1970
        },
      },
      {
        $project: {
          _id:0,
          week: "$_id",
          uniqueUsers: 1,
        },
      },
      {
        $sort: {
          "week": 1,
        },
      },
    ];
    
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

    let weekToTradersMap = new Map();

    allTraders.forEach(({week, uniqueUsers}) => {
        if(weekToTradersMap.has(week)) {
            let existingTradersSet = weekToTradersMap.get(week);
            uniqueUsers.forEach(trader => existingTradersSet.add(trader));
        } else {
            weekToTradersMap.set(week, new Set(uniqueUsers));
        }
    });

    let result = Array.from(weekToTradersMap, ([week, traders]) => ({week, uniqueUsers: Array.from(traders), uniqueUsersCount: traders.size}));

    result.sort((a, b) => (a.week > b.week ? 1 : b.week > a.week ? -1 : 0));
    
    const response = {
      status: "success",
      message: "Weekly Active Users on Platform fetched successfully",
      data: result.splice(result.length <= 52 ? 0 : result.length-52,result.length),
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// exports.getRollingActiveUsersOnPlatform = async (req, res) => {
//   try {
//     const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate()-30)); // Get date 30 days ago
//     const pipeline = [
//       {
//         $match: {
//           "trade_time": { $gte: thirtyDaysAgo }, // Include only documents from the last 30 days
//         },
//       },
//       {
//         $group: {
//           _id: "$trader", // Group by trader
//           lastActiveDate: { $max: "$trade_time" }, // Get the last active date for each trader
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           trader: "$_id",
//           lastActiveDate: 1,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           uniqueUsers: { $addToSet: {$toString : "$trader"} }, // Get the unique active traders
//         },
//       },
//     ];
    
//     const tenXTraders = await TenXTrading.aggregate(pipeline);
//     const virtualTraders = await PaperTrading.aggregate(pipeline);
//     const contestTraders = await ContestTrading.aggregate(pipeline);
//     const internshipTraders = await InternshipTrading.aggregate(pipeline);
    
//     let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders];

//     let uniqueToTradersMap = new Map();

//     allTraders.forEach(({month, uniqueUsers}) => {
//         if(uniqueToTradersMap.has(month)) {
//             let existingTradersSet = uniqueToTradersMap.get(month);
//             uniqueUsers.forEach(trader => existingTradersSet.add(trader));
//         } else {
//           uniqueToTradersMap.set(month, new Set(uniqueUsers));
//         }
//     });

//     let result = Array.from(uniqueToTradersMap, ([month, traders]) => ({month, uniqueUsers: Array.from(traders), uniqueUsersCount: traders.size}));

//     // result.sort((a, b) => (a.month > b.month ? 1 : b.month > a.month ? -1 : 0));

//     const response = {
//       status: "success",
//       message: "Rolling 30-day Active Users on Platform fetched successfully",
//       data: result,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

exports.getRollingActiveUsersOnPlatform = async (req, res) => {
  try {
    const yesterday = new Date(new Date());
    yesterday.setDate(yesterday.getDate()-1);
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate()-30)); // Get date 30 days ago
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);
    const startOfToday = new Date(new Date().setHours(0,0,0,0)); // Get start of today
    startOfToday.setUTCHours(0, 0, 0, 0);
    const startOfYesterday = new Date(new Date().setDate(new Date().getDate()-1)); // Get start of yesterday
    startOfYesterday.setUTCHours(0, 0, 0, 0);
    const endOfYesterday = new Date(startOfToday - 1); // Get end of yesterday
    // endOfYesterday.setUTCHours(0, 0, 0, 0);
    // console.log("Days:",thirtyDaysAgo,startOfToday,startOfYesterday,endOfYesterday)
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate()-7));
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgoBasedOnYesterday = new Date(yesterday.setDate(yesterday.getDate()-7));
    sevenDaysAgoBasedOnYesterday.setUTCHours(0, 0, 0, 0);
    const thirtyDaysAgoBasedOnYesterday = new Date(yesterday.setDate(yesterday.getDate()-30));
    thirtyDaysAgoBasedOnYesterday.setUTCHours(0, 0, 0, 0);


    const pipeline = [
      {
        $match: {
          "trade_time": { $gte: thirtyDaysAgo }, // Include only documents from the last 30 days
        },
      },
      {
        $project: {
          trader: 1,
          trade_time: 1,
          isActiveToday: { $gte: ["$trade_time", startOfToday] }, // Check if trader is active today
          wasActiveYesterday: { $and: [{ $gte: ["$trade_time", startOfYesterday] }, { $lte: ["$trade_time", endOfYesterday] }] }, // Check if trader was active yesterday
          isActivePast7DaysBasedOnToday: { $gte: ["$trade_time", sevenDaysAgo] },
          isActivePast30DaysBasedOnToday: { $gte: ["$trade_time", thirtyDaysAgo] },
          isActivePast7DaysBasedOnYesterday: { $gte: ["$trade_time", sevenDaysAgoBasedOnYesterday] },
          isActivePast30DaysBasedOnYesterday: { $gte: ["$trade_time", thirtyDaysAgoBasedOnYesterday] },
        },
      },
      {
        $group: {
          _id: "$trader", // Group by trader
          lastActiveDate: { $max: "$trade_time" }, // Get the last active date for each trader
          isActiveToday: { $max: "$isActiveToday" }, // Check if trader is active today
          wasActiveYesterday: { $max: "$wasActiveYesterday" }, // Check if trader was active yesterday
          isActivePast7DaysBasedOnToday: { $max: "$isActivePast7DaysBasedOnToday" },
          isActivePast30DaysBasedOnToday: { $max: "$isActivePast30DaysBasedOnToday" },
          isActivePast7DaysBasedOnYesterday: { $max: "$isActivePast7DaysBasedOnYesterday" },
          isActivePast30DaysBasedOnYesterday: { $max: "$isActivePast30DaysBasedOnYesterday" },
        },
      },
      {
        $project: {
          _id: 0,
          trader: "$_id",
          lastActiveDate: 1,
          isActiveToday: 1,
          wasActiveYesterday: 1,
          isActivePast7DaysBasedOnToday: 1,
          isActivePast30DaysBasedOnToday: 1,
          isActivePast7DaysBasedOnYesterday: 1,
          isActivePast30DaysBasedOnYesterday: 1,
        },
      },
      {
        $group: {
          _id: null,
          uniqueUsers: { $addToSet: {$toString : "$trader"} }, // Get the unique active traders
          uniqueUsersToday: { $addToSet: { $cond: [ "$isActiveToday", {$toString : "$trader"}, "$$REMOVE" ] } }, // Get the unique active traders today
          uniqueUsersYesterday: { $addToSet: { $cond: [ "$wasActiveYesterday", {$toString : "$trader"}, "$$REMOVE" ] } }, // Get the unique active traders yesterday
          uniqueUsersPast7DaysBasedOnToday: { $addToSet: { $cond: [ "$isActivePast7DaysBasedOnToday", {$toString : "$trader"}, "$$REMOVE" ] } },
          uniqueUsersPast30DaysBasedOnToday: { $addToSet: { $cond: [ "$isActivePast30DaysBasedOnToday", {$toString : "$trader"}, "$$REMOVE" ] } },
          uniqueUsersPast7DaysBasedOnYesterday: { $addToSet: { $cond: [ "$isActivePast7DaysBasedOnYesterday", {$toString : "$trader"}, "$$REMOVE" ] } },
          uniqueUsersPast30DaysBasedOnYesterday: { $addToSet: { $cond: [ "$isActivePast30DaysBasedOnYesterday", {$toString : "$trader"}, "$$REMOVE" ] } },
        },
      },
    ];
    
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

    let uniqueUsersSet = new Set();
    let uniqueUsersTodaySet = new Set();
    let uniqueUsersYesterdaySet = new Set();
    let uniqueUsersPast7DaysBasedOnTodaySet = new Set();
    let uniqueUsersPast30DaysBasedOnTodaySet = new Set();
    let uniqueUsersPast7DaysBasedOnYesterdaySet = new Set();
    let uniqueUsersPast30DaysBasedOnYesterdaySet = new Set();

    allTraders.forEach(({uniqueUsers, uniqueUsersToday, uniqueUsersYesterday,uniqueUsersPast7DaysBasedOnToday, uniqueUsersPast30DaysBasedOnToday, uniqueUsersPast7DaysBasedOnYesterday, uniqueUsersPast30DaysBasedOnYesterday}) => {
      uniqueUsers.forEach(trader => uniqueUsersSet.add(trader));
      uniqueUsersToday.forEach(trader => uniqueUsersTodaySet.add(trader));
      uniqueUsersYesterday.forEach(trader => uniqueUsersYesterdaySet.add(trader));
      uniqueUsersPast7DaysBasedOnToday.forEach(trader => uniqueUsersPast7DaysBasedOnTodaySet.add(trader));
      uniqueUsersPast30DaysBasedOnToday.forEach(trader => uniqueUsersPast30DaysBasedOnTodaySet.add(trader));
      uniqueUsersPast7DaysBasedOnYesterday.forEach(trader => uniqueUsersPast7DaysBasedOnYesterdaySet.add(trader));
      uniqueUsersPast30DaysBasedOnYesterday.forEach(trader => uniqueUsersPast30DaysBasedOnYesterdaySet.add(trader));
    });

    const response = {
      status: "success",
      message: "Rolling 30-day Active Users, Today's Active Users and Yesterday's Active Users on Platform fetched successfully",
      data: {
        // uniqueUsersLast30Days: Array.from(uniqueUsersSet),
        // uniqueUsersCountLast30Days: uniqueUsersSet.size,
        // uniqueUsersToday: Array.from(uniqueUsersTodaySet),
        uniqueUsersCountToday: uniqueUsersTodaySet.size,
        // uniqueUsersYesterday: Array.from(uniqueUsersYesterdaySet),
        uniqueUsersCountYesterday: uniqueUsersYesterdaySet.size,
        uniqueUsersPast7DaysBasedOnToday: uniqueUsersPast7DaysBasedOnTodaySet.size,
        uniqueUsersPast30DaysBasedOnToday: uniqueUsersPast30DaysBasedOnTodaySet.size,
        uniqueUsersPast7DaysBasedOnYesterday: uniqueUsersPast7DaysBasedOnYesterdaySet.size,
        uniqueUsersPast30DaysBasedOnYesterday: uniqueUsersPast30DaysBasedOnYesterdaySet.size,

      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};









  
  
  
  

