const mongoose = require('mongoose');
const ContestTrading = require('../../models/DailyContest/dailyContestMockUser'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../../models/User/userDetailSchema");
const TenXTrading = require("../../models/mock-trade/tenXTraderSchema");
const PaperTrading = require("../../models/mock-trade/paperTrade");
const InternshipTrading = require("../../models/mock-trade/internshipTrade")
const MarginXTrading = require("../../models/marginX/marginXUserMock")
const BattleTrading = require("../../models/battle/battleTrade");
const Wallet = require("../../models/UserWallet/userWalletSchema")
const { ObjectId } = require('mongodb');
const Withdrawal = require('../../models/withdrawal/withdrawal');
const Battle = require('../../models/battle/battle')
const Contest = require('../../models/DailyContest/dailyContest')
const MarginX = require('../../models/marginX/marginX')
const TenX = require('../../models/TenXSubscription/TenXSubscriptionSchema')



// Controller for getting all contests
// exports.getDailyActiveUsers = async (req, res) => {
//     try {
//         const pipeline = [
//             {
//               $group: {
//                 _id: {
//                   date: {
//                     $substr: ["$trade_time", 0, 10],
//                   },
//                   trader: "$trader",
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: "$_id.date",
//                 traders: { $sum: 1 },
//               },
//             },
//             {
//               $sort: {
//                 "_id": -1,
//               },
//             },
//           ]
          

//         const virtualTraders = await PaperTrading.aggregate(pipeline);
//         const tenXTraders = await TenXTrading.aggregate(pipeline);
//         const contestTraders = await ContestTrading.aggregate(pipeline);

//         res.status(200).json({
//             status:"success",
//             message: "Contest Scoreboard fetched successfully",
//             data: [{virtualTraders, tenXTraders, contestTraders}]
//         });
//     } catch (error) {
//         res.status(500).json({
//             status:"error",
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };

// Controller for getting all contests
// Controller for getting all contests
// Controller for getting all contests
exports.getDailyActiveUsers = async (req, res) => {
  try {
    const pipeline = [
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
          _id: { date: "$_id.date" },
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
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
    const dateWiseDAUs = {};

    virtualTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].virtualTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    tenXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].tenXTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    contestTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].contest = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    internshipTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].internshipTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });
    marginXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].marginXTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });
    battleTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].battleTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, battleTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = virtualTrading + tenXTrading + contest + internshipTrading + marginXTrading + battleTrading;
      dateWiseDAUs[date].uniqueUsers = [...new Set(uniqueUsers)];
    });

    const response = {
      status: "success",
      message: "Contest Scoreboard fetched successfully",
      data: Object.values(dateWiseDAUs).splice(Object.values(dateWiseDAUs).length <= 90 ? 0 : Object.values(dateWiseDAUs).length - 90,Object.values(dateWiseDAUs).length),
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
        monthWiseMAUs[month].marginxTrading = traders;
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


    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

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
//uniqueUsers: Array.from(traders)
    let result = Array.from(monthToTradersMap, ([month, traders]) => ({month, uniqueUsersCount: traders.size}));

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

exports.getRollingActiveUsersOnPlatform = async (req, res) => {
  try {
    const yesterday = new Date(new Date());
    yesterday.setDate(yesterday.getDate()-1);
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate()-30)); // Get date 30 days ago
    thirtyDaysAgo.setUTCHours(-5, -29, -59, -999);
    const startOfToday = new Date(new Date().setHours(0,0,0,0)); // Get start of today
    startOfToday.setUTCHours(-5, -29, -59, -999);
    const startOfYesterday = new Date(new Date().setDate(new Date().getDate()-1)); // Get start of yesterday
    startOfYesterday.setUTCHours(-5, -29, -59, -999);
    const endOfYesterday = new Date(startOfToday - 1); // Get end of yesterday
    // endOfYesterday.setUTCHours(-5, -29, -59, -999);
    // console.log("Days:",thirtyDaysAgo,startOfToday,startOfYesterday,endOfYesterday)
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate()-7));
    sevenDaysAgo.setUTCHours(-5, -29, -59, -999);
    const sevenDaysAgoBasedOnYesterday = new Date(yesterday.setDate(yesterday.getDate()-7));
    sevenDaysAgoBasedOnYesterday.setUTCHours(-5, -29, -59, -999);
    const thirtyDaysAgoBasedOnYesterday = new Date(yesterday.setDate(yesterday.getDate()-30));
    thirtyDaysAgoBasedOnYesterday.setUTCHours(-5, -29, -59, -999);


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

exports.getDateWiseTradeInformation = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            date: {
              $substr: ["$trade_time", 0, 10],
            },
          },
          trades: {
            $sum: 1,
          },
          turnover: {
            $sum: {
              $abs: "$amount",
            },
          },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          trades: 1,
          turnover: 1,
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    let allTrades = [...virtualTraders, ...tenXTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

    let dateToTradeInfoMap = new Map();

    allTrades.forEach(({date, trades, turnover}) => {
        if(dateToTradeInfoMap.has(date)) {
            let existingInfo = dateToTradeInfoMap.get(date);
            existingInfo.trades += trades;
            existingInfo.turnover += turnover;
        } else {
            dateToTradeInfoMap.set(date, {trades, turnover});
        }
    });

    let result = Array.from(dateToTradeInfoMap, ([date, {trades, turnover}]) => ({date, trades, turnover}));

    result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    const response = {
      status: "success",
      message: "Trade information fetched successfully",
      data: result,
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

exports.getOverallTradeInformation = async (req, res) => {
  try {
    // Get start of today, yesterday, this week, last week, this month, last month, this year, last year
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startOfToday.setUTCHours(-5,-29,-59,-999);
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    startOfYesterday.setUTCHours(-5,-29,-59,-999);
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    startOfThisWeek.setUTCHours(-5,-29,-59,-999);
    const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
    startOfLastWeek.setUTCHours(-5,-29,-59,-999);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfThisMonth.setUTCHours(-5,-29,-59,-999);
    const startOfLastMonth = now.getMonth() === 0 ? new Date(now.getFullYear() - 1, 11, 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    startOfLastMonth.setUTCHours(-5,-29,-59,-999);
    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    startOfThisYear.setUTCHours(18, 30, 30, 0);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    startOfLastYear.setUTCHours(-5,-29,-59,-999);

    // console.log("Year Dates:",startOfThisYear,startOfLastYear)

    const pipeline = [
      {
        $match:{
          status : 'COMPLETE'
        }
      },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: { $cond: [{ $gte: ["$trade_time", new Date("2022-06-01")] }, 1, 0] } },
          totalTurnover: { $sum: { $cond: [{ $gte: ["$trade_time", new Date("2022-06-01")] }, { $abs: "$amount" }, 0] } },
          tradesToday: { $sum: { $cond: [{ $gte: ["$trade_time", startOfToday] }, 1, 0] } },
          turnoverToday: { $sum: { $cond: [{ $gte: ["$trade_time", startOfToday] }, { $abs: "$amount" }, 0] } },
          tradesYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfYesterday] }, { $lt: ["$trade_time", startOfToday] }] }, 1, 0] } },
          turnoverYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfYesterday] }, { $lt: ["$trade_time", startOfToday] }] }, { $abs: "$amount" }, 0] } },
          tradesThisWeek: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisWeek] }, 1, 0] } },
          turnoverThisWeek: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisWeek] }, { $abs: "$amount" }, 0] } },
          tradesLastWeek: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastWeek] }, { $lt: ["$trade_time", startOfThisWeek] }] }, 1, 0] } },
          turnoverLastWeek: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastWeek] }, { $lt: ["$trade_time", startOfThisWeek] }] }, { $abs: "$amount" }, 0] } },
          tradesThisMonth: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisMonth] }, 1, 0] } },
          turnoverThisMonth: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisMonth] }, { $abs: "$amount" }, 0] } },
          tradesLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastMonth] }, { $lt: ["$trade_time", startOfThisMonth] }] }, 1, 0] } },
          turnoverLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastMonth] }, { $lt: ["$trade_time", startOfThisMonth] }] }, { $abs: "$amount" }, 0] } },
          tradesThisYear: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisYear] }, 1, 0] } },
          turnoverThisYear: { $sum: { $cond: [{ $gte: ["$trade_time", startOfThisYear] }, { $abs: "$amount" }, 0] } },
          tradesLastYear: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastYear] }, { $lt: ["$trade_time", startOfThisYear] }] }, 1, 0] } },
          turnoverLastYear: { $sum: { $cond: [{ $and: [{ $gte: ["$trade_time", startOfLastYear] }, { $lt: ["$trade_time", startOfThisYear] }] }, { $abs: "$amount" }, 0] } }
        },
      },
      {
        $project: {
          _id: 0
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    let allTrades = [...virtualTraders, ...tenXTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];

    let tradeInformation = allTrades.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        acc[key] = (acc[key] || 0) + curr[key];
      });
      return acc;
    }, {});

    const response = {
      status: "success",
      message: "Overall trade information fetched successfully",
      data: tradeInformation,
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

// exports.getOverallRevenue = async (req, res) => {
//   try {
//     // Get start of today, yesterday, this week, last week, this month, last month, this year, last year
//     const now = new Date();
//     const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     startOfToday.setUTCHours(0, 0, 0, 0);
//     const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
//     startOfYesterday.setUTCHours(0, 0, 0, 0);
//     const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
//     startOfThisWeek.setUTCHours(0, 0, 0, 0);
//     const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
//     startOfLastWeek.setUTCHours(0, 0, 0, 0);
//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     startOfThisMonth.setUTCHours(0, 0, 0, 0);
//     const startOfLastMonth = now.getMonth() === 0 ? new Date(now.getFullYear() - 1, 11, 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     startOfLastMonth.setUTCHours(0, 0, 0, 0);
//     const startOfThisYear = new Date(now.getFullYear(), 0, 1);
//     startOfThisYear.setUTCHours(23, 59, 59, 999);
//     const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
//     startOfLastYear.setUTCHours(0, 0, 0, 0);

//     const pipeline = [
//       {
//         $unwind: "$transactions",
//       },
//       {
//         $match: {
//           "transactions.title": "Amount Credit",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: {
//             $sum: "$transactions.amount",
//           },
//           revenueToday: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfToday] }, "$transactions.amount", 0] } },
//           revenueYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfYesterday] }, { $lt: ["$transactions.transactionDate", startOfToday] }] }, "$transactions.amount", 0] } },
//           revenueThisWeek: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisWeek] }, "$transactions.amount", 0] } },
//           revenueLastWeek: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastWeek] }, { $lt: ["$transactions.transactionDate", startOfThisWeek] }] }, "$transactions.amount", 0] } },
//           revenueThisMonth: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisMonth] }, "$transactions.amount", 0] } },
//           revenueLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastMonth] }, { $lt: ["$transactions.transactionDate", startOfThisMonth] }] }, "$transactions.amount", 0] } },
//           revenueThisYear: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisYear] }, "$transactions.amount", 0] } },
//           revenueLastYear: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastYear] }, { $lt: ["$transactions.transactionDate", startOfThisYear] }] }, "$transactions.amount", 0] } }
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           title: "$_id.title",
//           totalRevenue: 1,
//           revenueToday: 1,
//           revenueYesterday: 1,
//           revenueThisWeek: 1,
//           revenueLastWeek: 1,
//           revenueThisMonth: 1,
//           revenueLastMonth: 1,
//           revenueThisYear: 1,
//           revenueLastYear: 1
//         },
//       },
//     ]
//     ;

//     const revenueDetails = await Wallet.aggregate(pipeline);
    
//     console.log("Revenue Details:", revenueDetails)

//     const response = {
//       status: "success",
//       message: "Overall Revenue information fetched successfully",
//       data: revenueDetails,
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

// Import necessary modules and dependencies

exports.getOverallRevenue = async (req, res) => {
  try {
    // Get start of today, yesterday, this week, last week, this month, last month, this year, last year
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startOfToday.setUTCHours(-5, -29, -59, -999);
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    startOfYesterday.setUTCHours(-5, -29, -59, -999);
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    startOfThisWeek.setUTCHours(-5, -29, -59, -999);
    const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
    startOfLastWeek.setUTCHours(-5, -29, -59, -999);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfThisMonth.setUTCHours(-5, -29, -59, -999);
    const startOfLastMonth = now.getMonth() === 0 ? new Date(now.getFullYear() - 1, 11, 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    startOfLastMonth.setUTCHours(-5, -29, -59, -999);
    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    startOfThisYear.setUTCHours(-5, -29, -59, -999);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    startOfLastYear.setUTCHours(-5, -29, -59, -999);

    // console.log("Date TToday & Yesterday:",startOfToday,startOfYesterday)

    const pipeline = [
      {
        $unwind: "$transactions",
      },
      {
        $group: {
          _id: "$transactions.title",
          totalRevenue: {
            $sum: "$transactions.amount",
          },
          revenueToday: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfToday] }, "$transactions.amount", 0] } },
          revenueYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfYesterday] }, { $lt: ["$transactions.transactionDate", startOfToday] }] }, "$transactions.amount", 0] } },
          revenueThisWeek: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisWeek] }, "$transactions.amount", 0] } },
          revenueLastWeek: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastWeek] }, { $lt: ["$transactions.transactionDate", startOfThisWeek] }] }, "$transactions.amount", 0] } },
          revenueThisMonth: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisMonth] }, "$transactions.amount", 0] } },
          revenueLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastMonth] }, { $lt: ["$transactions.transactionDate", startOfThisMonth] }] }, "$transactions.amount", 0] } },
          revenueThisYear: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisYear] }, "$transactions.amount", 0] } },
          revenueLastYear: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastYear] }, { $lt: ["$transactions.transactionDate", startOfThisYear] }] }, "$transactions.amount", 0] } }
        },
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          totalRevenue: 1,
          revenueToday: 1,
          revenueYesterday: 1,
          revenueThisWeek: 1,
          revenueLastWeek: 1,
          revenueThisMonth: 1,
          revenueLastMonth: 1,
          revenueThisYear: 1,
          revenueLastYear: 1
        },
      },
    ];

    const revenueDetails = await Wallet.aggregate(pipeline);

    const data = {};
    revenueDetails.forEach((item) => {
      const { title, ...revenue } = item;
      data[title] = revenue;
    });
    const getTotalAmountForDateRange = async (startDate, endDate) => {
      const pipeline = [
          {
              $match: {
                  withdrawalRequestDate: {
                      $gte: startDate,
                      ...(endDate && { $lt: endDate })
                  }
              }
          },
          {
              $group: {
                  _id: null,
                  totalAmount: { $sum: "$amount" }
              }
          }
      ];
  
      const results = await Withdrawal.aggregate(pipeline);
      return results[0] ? results[0].totalAmount : 0;
  };
  
  // Get total amounts for each timeframe
  const todaysTotal = await getTotalAmountForDateRange(startOfToday);
  const yesterdaysTotal = await getTotalAmountForDateRange(startOfYesterday, startOfToday);
  const thisWeeksTotal = await getTotalAmountForDateRange(startOfThisWeek);
  const lastWeeksTotal = await getTotalAmountForDateRange(startOfLastWeek, startOfThisWeek);
  const thisMonthsTotal = await getTotalAmountForDateRange(startOfThisMonth);
  const lastMonthsTotal = await getTotalAmountForDateRange(startOfLastMonth, startOfThisMonth);
  const thisYearsTotal = await getTotalAmountForDateRange(startOfThisYear);
  const lastYearsTotal = await getTotalAmountForDateRange(startOfLastYear, startOfThisYear);
  
    
    // console.log("Revenue Details:", data);

    const response = {
      status: "success",
      message: "Overall Revenue information fetched successfully",
      data: {...data, todaysWithdrawals:todaysTotal, yesterdaysWithdrawals:yesterdaysTotal, thisWeeksWithdrawals:thisWeeksTotal,
         lastWeeksWithdrawals:lastWeeksTotal, thisMonthsWithdrawals:thisMonthsTotal, lastMonthsWithdrawals:lastMonthsTotal, thisYearsWithdrawals:thisYearsTotal,
          lastYearsWithdrawals:lastYearsTotal },
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

exports.getMonthWiseCummActiveUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $match:{
          trade_time : {$gte : new Date('2023-05-01:00:00:00'), $lt: new Date('2023-09-01:00:00:00')}
        }
      },
      {
        $group: {
          _id: {
            // month: { $substr: ["$trade_time", 0, 7] },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: null,
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
        },
      },
    ];

    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);
    // console.log("Data:",virtualTraders.length,tenXTraders.length,contestTraders.length,internshipTraders.length,marginXTraders.length)
    // console.log("Virtual Data:",virtualTraders)

    // Create a month-wise mapping of MAUs for different products
    const monthWiseMAUs = {
      virtualTrading: 0,
      tenXTrading: 0,
      contest: 0,
      internshipTrading: 0,
      marginXTrading:0,
      battleTrading:0,
      total: 0,
      uniqueUsers: [],
    };

    virtualTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
        
        monthWiseMAUs.virtualTrading = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
        console.log("Traders:",traders)
        console.log("Monthweise MASUs at Virtual:",monthWiseMAUs)
    });
    tenXTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
      
        monthWiseMAUs.tenXTrading = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
      
    });

    contestTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
        
        monthWiseMAUs.contest = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
      
    });

    internshipTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
        
        monthWiseMAUs.internshipTrading = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
      
    });
    marginXTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
      
        monthWiseMAUs.marginXTrading = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
      
    });
    battleTraders.forEach(entry => {
      const { traders, uniqueUsers } = entry;
      
        monthWiseMAUs.battleTrading = traders;
        monthWiseMAUs.uniqueUsers.push(...uniqueUsers);
      
    });

    // Calculate the month-wise total MAUs and unique users
    // console.log("MonthwiseMAUs:",monthWiseMAUs)
    Object.keys(monthWiseMAUs).forEach(month => {
      console.log("Month:",month)
      // const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, uniqueUsers } = monthWiseMAUs[month];
      // console.log("Data:",virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, uniqueUsers)
      // console.log("Data:",virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, uniqueUsers)
      console.log("Month Wise MAUs:",monthWiseMAUs[month])
      monthWiseMAUs.uniqueUsers = ([...new Set(monthWiseMAUs['uniqueUsers'])]);
      monthWiseMAUs.total = monthWiseMAUs['uniqueUsers'].length
    });

    console.log("Unique Users at month:",monthWiseMAUs.uniqueUsers.length)

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

exports.getDateWiseAverageActiveUsers = async (req, res) => {
  try {
    const pipeline = [
      {
        $match:{
          trade_time : {$gte: new Date('2023-05-01:00:00:00'), $lt: new Date('2023-10-01:00:00:00')}
        }
      },
      {
        $group: {
          _id: {
            date: { $substr: ["$trade_time", 0, 10] },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: { date: "$_id.date" },
          traders: { $sum: 1 },
          uniqueUsers: { $addToSet: {$toString : "$_id.trader"} },
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

    // Create a month-wise mapping of MAUs for different products
    const dateWiseDAUs = {};

    virtualTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
            dateWiseDAUs[date] = {
            date,
            virtualTrading: 0,
            tenXTrading: 0,
            contest: 0,
            internshipTrading: 0,
            marginXTrading:0,
            battletrading:0,
            total: 0,
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].virtualTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    tenXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].tenXTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    contestTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].contest = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    internshipTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].internshipTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });
    marginXTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].marginXTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });
    battleTraders.forEach(entry => {
      const { _id, traders, uniqueUsers } = entry;
      const date = _id.date;
      if (date !== "1970-01-01") {
        if (!dateWiseDAUs[date]) {
          dateWiseDAUs[date] = {
            date,
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
        dateWiseDAUs[date].battleTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the month-wise total MAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].uniqueUsers = [...new Set(uniqueUsers)];
      dateWiseDAUs[date].total = dateWiseDAUs[date].uniqueUsers.length
    });
    console.log("DateWiseDAUs:",dateWiseDAUs)

    const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'];
    let data = []
    for(let elem in dateWiseDAUs){
      let obj = {}
      obj.date = elem
      obj.daus = dateWiseDAUs[elem].total
      data.push(obj)
    }

    const average_data = [];
    for (const month of months) {
      const average = calculateAverageForMonth(month, data);
      console.log(`Average for ${month}:`, average);
      average_data.push({month: month, data: Math.floor(average)})
    }

    const response = {
      status: "success",
      message: "Average Daily Active Users MonthWise fetched successfully",
      data: average_data,
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

function calculateAverageForMonth(month, data) {
  const monthData = data.filter(entry => entry.date.startsWith(month));
  let sum = 0;
  for (const entry of monthData) {
    sum += entry.daus;
  }
  return sum / monthData.length;
}


exports.getCummMonthlyActiveUsersOnPlatform = async (req, res) => {
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
    
    // console.log("result", result)

    let cumm_data = [];
    let arr = [];
    for(let elem of result){
      arr = [...arr, ...elem.uniqueUsers]
      cumm_data.push({month: elem.month, count: [...new Set(arr)].length})
    }

    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: cumm_data
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


exports.getSignUpAndCummSignup = async(req, res) =>{

  try{
    let date1 = new Date("2023-01-31T18:30:00");
    let date2 = new Date("2023-02-28T18:30:00");
  
    const currentDate = new Date();
    // Set the date to the last day of the current month
    currentDate.setMonth(currentDate.getMonth() + 1, 0);
    // Format the last date as a string (YYYY-MM-DD)
    const lastDateOfMonth = currentDate.toISOString().substr(0, 10) + "T18:30:00"
    let data = [];

    // date1.setDate(0);
    // date2.setDate(0); // Set date2 to the last day of the current month
  
    
    while (date2 <= new Date(lastDateOfMonth)) {
      let newDate = date1;
      const user = await User.aggregate([
        {
          $facet: {
            "monthSignups": [
              {
                $match: {
                  joining_date: {
                    $gte: date1,
                    $lte: date2,
                  },
                },
              },
              {
                $group: {
                  _id: null, // Since you want a count for the entire month, _id can be null
                  num: {
                    $sum: 1,
                  },
                },
              }
            ],
            "uptoMonthSignups": [
              {
                $match: {
                  joining_date: {
                    $lte: lastDateOfMonth,
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  num: {
                    $sum: 1,
                  },
                },
              }
            ],
            "totalSignups": [
              {
                $match: {
                  joining_date: {
                    $lte: new Date(),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  num: {
                    $sum: 1,
                  },
                },
              }
            ]
          }
        }
      ])
  
      data.push({date: newDate.toISOString().split("T"), data: user})
      // Increment the month by one
      // date2.setMonth(date2.getMonth() + 1);
      // date1.setMonth(date1.getMonth() + 1);

      date1.setMonth(date1.getMonth() + 2);
      date2.setMonth(date2.getMonth() + 2);
      console.log("first", date1, date1.getMonth())
      // Set date1 to the first day of the next month
      date1.setDate(0);
    
      // Set date2 to the last day of the month
      // if (date2.getDate() !== 1) {
        date2.setDate(0); // Set date2 to the last day of the current month
      // }
      // console.log("second", date1, date2)
      // date1.setMonth(date1.getMonth() + 1);
      // date2.setMonth(date2.getMonth() + 1);
      // console.log(date1, date2)
    }
  
    const response = {
      status: "success",
      message: "Data fetched successfully",
      data: data
    };
    
    res.status(200).json(response);
  
  } catch(err){
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
  
}

exports.getMarketingFunnelData = async (req, res) => {
  const monthNumber = parseInt(req.params.month)
  const yearNumber = parseInt(req.params.year)

  try {
    
    const thisMonthSignups = await User.aggregate(
      [
        {
          $addFields: {
            adjustedJoiningDate: {
              $add: [
                "$joining_date",
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ], // Adding 5 hours and 30 minutes in milliseconds
            },
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            creationProcess: '$user.creationProcess',
            referrerCode: '$user.referrerCode',
            month: {
              $month: "$adjustedJoiningDate",
            },
            year: {
              $year: "$adjustedJoiningDate",
            },
          },
        },
        {
          $match: {
            month: monthNumber,
            year: yearNumber,
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            creationProcess: '$user.creationProcess',
            referrerCode: '$user.referrerCode',
          },
        },
        
      ]
    );

    const thismonthpipeline = [
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          status: 1,
          month: {
            $month: "$trade_time",
          },
          year: {
            $year: "$trade_time",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $match: {
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
          },
        },
      },
      {
        $project: {
          _id: "$_id.trader",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id : '$user._id',
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
        }
      }
    ];

    const paidThisMonthUserTenX = [
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "users.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          month: {
            $month: "$users.subscribedOn",
          },
          year: {
            $year: "$users.subscribedOn",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $match: {
          "users.fee": {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $project: {
          userId: "$users.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$users.fee",
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: '$first_name',
            last_name: '$last_name',
            mobile: '$mobile',
            email: '$email',
            creationProcess: '$creationProcess',
            referrerCode: '$referrerCode',
          },
          totalRevenue: {
            $sum: "$fee",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: '$_id.first_name',
          last_name: '$_id.last_name',
          mobile: '$_id.mobile',
          email: '$_id.email',
          creationProcess: '$_id.creationProcess',
          referrerCode: '$_id.referrerCode',
          totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserContest = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$participants.participatedOn",
          },
          year: {
            $year: "$participants.participatedOn",
          },
          joining_month: {
            $month: {
              $add: [
                {
                  $arrayElemAt: [
                    "$user.joining_date",
                    0,
                  ],
                },
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ],
            },
          },
          joining_year: {
            $year: {
              $add: [
                {
                  $arrayElemAt: [
                    "$user.joining_date",
                    0,
                  ],
                },
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ],
            },
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: '$first_name',
            last_name: '$last_name',
            mobile: '$mobile',
            email: '$email',
            creationProcess: '$creationProcess',
            referrerCode: '$referrerCode',
          },
          totalRevenue: {
            $sum: "$fee",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: '$_id.first_name',
          last_name: '$_id.last_name',
          mobile: '$_id.mobile',
          email: '$_id.email',
          creationProcess: '$_id.creationProcess',
          referrerCode: '$_id.referrerCode',
          totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserBattle = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          battleTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$battle.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$participants.boughtAt",
          },
          year: {
            $year: "$participants.boughtAt",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: '$first_name',
            last_name: '$last_name',
            mobile: '$mobile',
            email: '$email',
            creationProcess: '$creationProcess',
            referrerCode: '$referrerCode',
          },
          totalRevenue: {
            $sum: "$fee",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: '$_id.first_name',
          last_name: '$_id.last_name',
          mobile: '$_id.mobile',
          email: '$_id.email',
          creationProcess: '$_id.creationProcess',
          referrerCode: '$_id.referrerCode',
          totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserMarginX = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          marginXTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginX",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$marginX.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$participants.boughtAt",
          },
          year: {
            $year: "$participants.boughtAt",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: '$first_name',
            last_name: '$last_name',
            mobile: '$mobile',
            email: '$email',
            creationProcess: '$creationProcess',
            referrerCode: '$referrerCode',
          },
          totalRevenue: {
            $sum: "$fee",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: '$_id.first_name',
          last_name: '$_id.last_name',
          mobile: '$_id.mobile',
          email: '$_id.email',
          creationProcess: '$_id.creationProcess',
          referrerCode: '$_id.referrerCode',
          totalRevenue: 1,
        },
      },
    ]

    const thisMonthtenXTraders = await TenXTrading.aggregate(thismonthpipeline);
    const thisMonthvirtualTraders = await PaperTrading.aggregate(thismonthpipeline);
    const thisMonthcontestTraders = await ContestTrading.aggregate(thismonthpipeline);
    const thisMonthinternshipTraders = await InternshipTrading.aggregate(thismonthpipeline);
    const thisMonthmarginXTraders = await MarginXTrading.aggregate(thismonthpipeline);
    const thisMonthbattleTraders = await BattleTrading.aggregate(thismonthpipeline);

    const paidThisMonthtenXTraders = await TenX.aggregate(paidThisMonthUserTenX);
    const paidThisMonthcontestTraders = await Contest.aggregate(paidThisMonthUserContest);
    const paidThisMonthmarginXTraders = await MarginX.aggregate(paidThisMonthUserMarginX);
    const paidThisMonthbattleTraders = await Battle.aggregate(paidThisMonthUserBattle);

    
    let thisMonthallTraders = [...thisMonthtenXTraders, ...thisMonthvirtualTraders, ...thisMonthcontestTraders, ...thisMonthinternshipTraders, ...thisMonthmarginXTraders, ...thisMonthbattleTraders];
    let paidThisMonthallTraders = [...paidThisMonthtenXTraders, ...paidThisMonthcontestTraders, ...paidThisMonthmarginXTraders, ...paidThisMonthbattleTraders];
    
    // Create a Set to remove duplicates
    const thisMonthuniqueTraders = Array.from(new Set(thisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const thisMonthuniqueTraders = new Set(thisMonthallTraders);
    const paidThisMonthuniqueTraders = Array.from(new Set(paidThisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const paidThisMonthuniqueTraders = new Set(paidThisMonthallTraders);
    
    // Convert the Set back to an array (if needed)
    const thisMonthuniqueTradersArray = [...thisMonthuniqueTraders];
    const processedData = thisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });
    const paidThisMonthuniqueTradersArray = [...paidThisMonthuniqueTraders];
    const paidProcessedData = paidThisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });
    const thisMonthtotalActiveTraders = thisMonthuniqueTradersArray.length;
    const paidThisMonthActiveTraders = paidThisMonthuniqueTradersArray.length;

    let marketingFunnel = [{ 
        thisMonthSignupsArray : thisMonthSignups,
        thisMonthSignups : thisMonthSignups.length, 
        thisMonthtotalActiveTradersArray: processedData,
        thisMonthtotalActiveTraders : thisMonthtotalActiveTraders, 
        paidThisMonthActiveTradersArray : paidProcessedData,
        paidThisMonthActiveTraders : paidThisMonthActiveTraders,
      }]
    
    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: marketingFunnel,
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

exports.getMonthlyActiveUsersMarketingFunnel = async (req, res) => {
  const monthNumber = parseInt(req.params.month)
  const yearNumber = parseInt(req.params.year)

  try {
    

    const thismonthpipeline = [
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          status: 1,
          month: {
            $month: "$trade_time",
          },
          year: {
            $year: "$trade_time",
          },
          joining_date: '$adjustedJoiningDate',
          joining_month: {
            $month: '$adjustedJoiningDate'
          },
          joining_year: {
            $year: '$adjustedJoiningDate'
          },
        },
      },
      {
        $match: {
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
            joining_date: "$joining_date",
          },
        },
      },
      {
        $project: {
          _id: "$_id.trader",
        },
      }
    ];

    const paidThisMonthUserTenX = [
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "users.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
          subscribedOn: {
            $add: [
                "$users.subscribedOn",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $addFields: {
          month: {
            $month: "$subscribedOn",
          },
          year: {
            $year: "$subscribedOn",
          },
          joining_month: {
            $month: '$adjustedJoiningDate'
          },
          joining_year: {
            $year: '$adjustedJoiningDate'
          },
        },
      },
      {
        $match: {
          "users.fee": {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $project: {
          userId: "$users.userId",
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
        },
      },
    ]

    const paidThisMonthUserContest = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          participatedOn: {
            $add: [
              {
                $arrayElemAt: [
                  "$participants.participatedOn",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$participatedOn",
          },
          year: {
            $year: "$participatedOn",
          },
          joining_month: {
            $month: {
              $add: [
                {
                  $arrayElemAt: [
                    "$user.joining_date",
                    0,
                  ],
                },
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ],
            },
          },
          joining_year: {
            $year: {
              $add: [
                {
                  $arrayElemAt: [
                    "$user.joining_date",
                    0,
                  ],
                },
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ],
            },
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
        },
      },
    ]

    const paidThisMonthUserBattle = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          battleTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$battle.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $addFields: {
          boughtAt: {
            $add: [
                  "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$boughtAt",
          },
          year: {
            $year: "$boughtAt",
          },
          joining_month: {
            $month: '$adjustedJoiningDate'
          },
          joining_year: {
            $year: '$adjustedJoiningDate'
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
        },
      },
    ]

    const paidThisMonthUserMarginX = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          marginXTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginX",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$marginX.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $addFields: {
          boughtAt: {
            $add: [
                  "$participants.boughtAt",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: '$user.first_name',
          last_name: '$user.last_name',
          mobile: '$user.mobile',
          email: '$user.email',
          creationProcess: '$user.creationProcess',
          referrerCode: '$user.referrerCode',
          fee: "$entryFee",
          month: {
            $month: "$boughtAt",
          },
          year: {
            $year: "$boughtAt",
          },
          joining_month: {
            $month: '$adjustedJoiningDate'
          },
          joining_year: {
            $year: '$adjustedJoiningDate'
          },
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
        },
      },
    ]

    const thisMonthtenXTraders = await TenXTrading.aggregate(thismonthpipeline);
    const thisMonthvirtualTraders = await PaperTrading.aggregate(thismonthpipeline);
    const thisMonthcontestTraders = await ContestTrading.aggregate(thismonthpipeline);
    const thisMonthinternshipTraders = await InternshipTrading.aggregate(thismonthpipeline);
    const thisMonthmarginXTraders = await MarginXTrading.aggregate(thismonthpipeline);
    const thisMonthbattleTraders = await BattleTrading.aggregate(thismonthpipeline);

    const paidThisMonthtenXTraders = await TenX.aggregate(paidThisMonthUserTenX);
    const paidThisMonthcontestTraders = await Contest.aggregate(paidThisMonthUserContest);
    const paidThisMonthmarginXTraders = await MarginX.aggregate(paidThisMonthUserMarginX);
    const paidThisMonthbattleTraders = await Battle.aggregate(paidThisMonthUserBattle);
    
    let thisMonthallTraders = [...thisMonthtenXTraders, ...thisMonthvirtualTraders, ...thisMonthcontestTraders, ...thisMonthinternshipTraders, ...thisMonthmarginXTraders, ...thisMonthbattleTraders];
    let paidThisMonthallTraders = [...paidThisMonthtenXTraders, ...paidThisMonthcontestTraders, ...paidThisMonthmarginXTraders, ...paidThisMonthbattleTraders];
    
    // Create a Set to remove duplicates
    const thisMonthuniqueTraders = Array.from(new Set(thisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const thisMonthuniqueTraders = new Set(thisMonthallTraders);
    const paidThisMonthuniqueTraders = Array.from(new Set(paidThisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const paidThisMonthuniqueTraders = new Set(paidThisMonthallTraders);
    
    // Convert the Set back to an array (if needed)
    const thisMonthuniqueTradersArray = [...thisMonthuniqueTraders];
    const processedData = thisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });

    const paidThisMonthuniqueTradersArray = [...paidThisMonthuniqueTraders];
    const paidProcessedData = paidThisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });

    const thisMonthtotalActiveTraders = thisMonthuniqueTradersArray.length;
    const paidThisMonthActiveTraders = paidThisMonthuniqueTradersArray.length;
    
    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      activeUserData: processedData,
      activeUserCount: thisMonthtotalActiveTraders,
      paidUserData: paidProcessedData,
      paidUserCount: paidThisMonthActiveTraders,
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

exports.getMarketingFunnelDataLifetime = async (req, res) => {

  try {
    const totalSignups = await User.countDocuments();
    
    const pipeline = [
      {
        $match: {
          status: 'COMPLETE',
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
          },
        },
      },
      {
        $project: {
          _id:'$_id.trader',
        },
      }
    ];

    const paidTotalUserTenX = [
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.fee": {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$users.userId",
          fee: "$users.fee",
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          // totalRevenue: 1,
        },
      },
    ]

    const paidTotalUserContest = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          fee: "$entryFee",
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          // totalRevenue: 1,
        },
      },
    ]

    const paidTotalUserBattle = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          battleTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$battle.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          fee: "$entryFee",
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          // totalRevenue: 1,
        },
      },
    ]

    const paidTotalUserMarginX = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
          marginXTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginX",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$marginX.entryFee", 0],
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          fee: "$entryFee",
        },
      },
      {
        $match: {
          fee: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          // totalRevenue: 1,
        },
      },
    ]

     
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);
    
    const paidTotaltenXTraders = await TenX.aggregate(paidTotalUserTenX);
    const paidTotalcontestTraders = await Contest.aggregate(paidTotalUserContest);
    const paidTotalmarginXTraders = await MarginX.aggregate(paidTotalUserMarginX);
    const paidTotalbattleTraders = await Battle.aggregate(paidTotalUserBattle);

    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];
    let paidTotalallTraders = [...paidTotaltenXTraders, ...paidTotalcontestTraders, ...paidTotalmarginXTraders, ...paidTotalbattleTraders];
    
    // Create a Set to remove duplicates
    const uniqueTraders = Array.from(new Set(allTraders.map(JSON.stringify))).map(JSON.parse);
    // const uniqueTraders = new Set(allTraders);
    const paidTotaluniqueTraders = Array.from(new Set(paidTotalallTraders.map(JSON.stringify))).map(JSON.parse);
    // const paidTotaluniqueTraders = new Set(paidTotalallTraders);

    // Convert the Set back to an array (if needed)
    const uniqueTradersArray = [...uniqueTraders];
    const paidTotaluniqueTradersArray = [...paidTotaluniqueTraders];
    const totalActiveTraders = uniqueTradersArray.length;
    const paidTotaltotalActiveTraders = paidTotaluniqueTradersArray.length;
    
    let marketingFunnel = [{
        totalSignups : totalSignups,  
        totalActiveTraders : totalActiveTraders, 
        paidTotaltotalActiveTraders : paidTotaltotalActiveTraders, 
      }]
    const response = {
      status: "success",
      message: "Lifetime Active Users on Platform fetched successfully",
      data: marketingFunnel,
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

// exports.getMarketingFunnelDataBackup = async (req, res) => {
//   const monthNumber = req.params.month
//   const yearNumber = req.params.year
//   console.log(monthNumber, yearNumber)
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   console.log("Month Start:",startOfMonth)
//   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
//   console.log("Month End:",endOfMonth)
//   const thisMonth = today.getMonth() + 1
//   console.log("This Month:",thisMonth)
//   const lastMonth = today.getMonth() 
//   console.log("Last Month:",lastMonth)
//   const last2lastMonth = today.getMonth()-1
//   console.log("Last2Last Month:",last2lastMonth)
//   const startOfLastMonth = new Date(today.getFullYear(), today.getMonth()-1, 1);
//   console.log("Last Month Start:",startOfLastMonth)
//   const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   console.log("Last Month End:",endOfLastMonth)
//   const thisYear = today.getFullYear()
//   console.log("This Year:",thisYear)
//   const lastYear = thisMonth === 1 ? thisYear-1 : thisMonth === 2 ? thisYear -1 : thisYear
//   console.log("Last Year:",lastYear)

//   try {
//     const totalSignups = await User.countDocuments();
//     console.log("Total Signups:",totalSignups)
//     const thisMonthSignups = await User.aggregate(
//       [
//         {
//           $project: {
//             _id: 1,
//             joining_date: 1,
//           },
//         },
//         {
//           $addFields: {
//             adjustedJoiningDate: {
//               $add: [
//                 "$joining_date",
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ], // Adding 5 hours and 30 minutes in milliseconds
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             month: {
//               $month: "$adjustedJoiningDate",
//             },
//             year: {
//               $year: "$adjustedJoiningDate",
//             },
//           },
//         },
//         {
//           $match: {
//             month: thisMonth,
//             year: thisYear,
//           },
//         },
//       ]
//     );
//     console.log("This Month Signups:",thisMonthSignups.length)

//     const lastMonthSignups = await User.aggregate(
//       [
//         {
//           $project: {
//             _id: 1,
//             joining_date: 1,
//           },
//         },
//         {
//           $addFields: {
//             adjustedJoiningDate: {
//               $add: [
//                 "$joining_date",
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ], // Adding 5 hours and 30 minutes in milliseconds
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             month: {
//               $month: "$adjustedJoiningDate",
//             },
//             year: {
//               $year: "$adjustedJoiningDate",
//             },
//           },
//         },
//         {
//           $match: {
//             month: lastMonth,
//             year: lastYear,
//           },
//         },
//       ]
//     );
//     console.log("Last Month Signups:",lastMonthSignups.length)

//     const last2lastMonthSignups = await User.aggregate(
//       [
//         {
//           $project: {
//             _id: 1,
//             joining_date: 1,
//           },
//         },
//         {
//           $addFields: {
//             adjustedJoiningDate: {
//               $add: [
//                 "$joining_date",
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ], // Adding 5 hours and 30 minutes in milliseconds
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             month: {
//               $month: "$adjustedJoiningDate",
//             },
//             year: {
//               $year: "$adjustedJoiningDate",
//             },
//           },
//         },
//         {
//           $match: {
//             month: last2lastMonth,
//             year: lastYear,
//           },
//         },
//       ]
//     );
//     console.log("Last Month Signups:",last2lastMonthSignups.length)

//     const pipeline = [
//       {
//         $project: {
//           _id: 1,
//           trader: 1,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             trader: "$trader",
//           },
//         },
//       },
//       {
//         $project: {
//           _id:'$_id.trader',
//         },
//       }
//     ];

//     const thismonthpipeline = [
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "trader",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           trader: 1,
//           status: 1,
//           month: {
//             $month: "$trade_time",
//           },
//           year: {
//             $year: "$trade_time",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           month: thisMonth,
//           year: thisYear,
//           joining_month: thisMonth,
//           joining_year: thisYear,
//           status: "COMPLETE",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             trader: "$trader",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: "$_id.trader",
//         },
//       },
//     ];

//     const lastmonthpipeline = [
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "trader",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           trader: 1,
//           status: 1,
//           month: {
//             $month: "$trade_time",
//           },
//           year: {
//             $year: "$trade_time",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           month: lastMonth,
//           year: lastYear,
//           joining_month: lastMonth,
//           joining_year: lastYear,
//           status: "COMPLETE",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             trader: "$trader",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: "$_id.trader",
//         },
//       },
//     ];

//     const last2lastmonthpipeline = [
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "trader",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           trader: 1,
//           status: 1,
//           month: {
//             $month: "$trade_time",
//           },
//           year: {
//             $year: "$trade_time",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           month: last2lastMonth,
//           year: lastYear,
//           joining_month: last2lastMonth,
//           joining_year: lastYear,
//           status: "COMPLETE",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             trader: "$trader",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: "$_id.trader",
//         },
//       },
//     ];

//     const paidTotalUserTenX = [
//       {
//         $project: {
//           _id: 0,
//           users: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$users",
//         },
//       },
//       {
//         $match: {
//           "users.fee": {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$users.userId",
//           fee: "$users.fee",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidTotalUserContest = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidTotalUserBattle = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           battleTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "battle-templates",
//           localField: "battleTemplate",
//           foreignField: "_id",
//           as: "battle",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$battle.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidTotalUserMarginX = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           marginXTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "marginx-templates",
//           localField: "marginXTemplate",
//           foreignField: "_id",
//           as: "marginX",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$marginX.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidThisMonthUserTenX = [
//       {
//         $project: {
//           _id: 0,
//           users: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$users",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "users.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $addFields: {
//           month: {
//             $month: "$users.subscribedOn",
//           },
//           year: {
//             $year: "$users.subscribedOn",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           "users.fee": {
//             $gt: 0,
//           },
//           month: thisMonth,
//           year: thisYear,
//           joining_month: thisMonth,
//           joining_year: thisYear,
//         },
//       },
//       {
//         $project: {
//           userId: "$users.userId",
//           fee: "$users.fee",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidThisMonthUserContest = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.participatedOn",
//           },
//           year: {
//             $year: "$participants.participatedOn",
//           },
//           joining_month: {
//             $month: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//           joining_year: {
//             $year: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: thisMonth,
//           year: thisYear,
//           joining_month: thisMonth,
//           joining_year: thisYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidThisMonthUserBattle = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           battleTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "battle-templates",
//           localField: "battleTemplate",
//           foreignField: "_id",
//           as: "battle",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$battle.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: thisMonth,
//           year: thisYear,
//           joining_month: thisMonth,
//           joining_year: thisYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidThisMonthUserMarginX = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           marginXTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "marginx-templates",
//           localField: "marginXTemplate",
//           foreignField: "_id",
//           as: "marginX",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$marginX.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: thisMonth,
//           year: thisYear,
//           joining_month: thisMonth,
//           joining_year: thisYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLastMonthUserTenX = [
//       {
//         $project: {
//           _id: 0,
//           users: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$users",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "users.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $addFields: {
//           month: {
//             $month: "$users.subscribedOn",
//           },
//           year: {
//             $year: "$users.subscribedOn",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           "users.fee": {
//             $gt: 0,
//           },
//           month: lastMonth,
//           year: lastYear,
//           joining_month: lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $project: {
//           userId: "$users.userId",
//           fee: "$users.fee",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLastMonthUserContest = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.participatedOn",
//           },
//           year: {
//             $year: "$participants.participatedOn",
//           },
//           joining_month: {
//             $month: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//           joining_year: {
//             $year: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: lastMonth,
//           year: lastYear,
//           joining_month: lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLastMonthUserBattle = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           battleTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "battle-templates",
//           localField: "battleTemplate",
//           foreignField: "_id",
//           as: "battle",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$battle.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: lastMonth,
//           year: lastYear,
//           joining_month: lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLastMonthUserMarginX = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           marginXTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "marginx-templates",
//           localField: "marginXTemplate",
//           foreignField: "_id",
//           as: "marginX",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$marginX.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: lastMonth,
//           year: lastYear,
//           joining_month: lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLast2LastMonthUserTenX = [
//       {
//         $project: {
//           _id: 0,
//           users: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$users",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "users.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $addFields: {
//           month: {
//             $month: "$users.subscribedOn",
//           },
//           year: {
//             $year: "$users.subscribedOn",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           "users.fee": {
//             $gt: 0,
//           },
//           month: last2lastMonth,
//           year: lastYear,
//           joining_month: last2lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $project: {
//           userId: "$users.userId",
//           fee: "$users.fee",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLast2LastMonthUserContest = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.participatedOn",
//           },
//           year: {
//             $year: "$participants.participatedOn",
//           },
//           joining_month: {
//             $month: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//           joining_year: {
//             $year: {
//               $add: [
//                 {
//                   $arrayElemAt: [
//                     "$user.joining_date",
//                     0,
//                   ],
//                 },
//                 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: last2lastMonth,
//           year: lastYear,
//           joining_month: last2lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLast2LastMonthUserBattle = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           battleTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "battle-templates",
//           localField: "battleTemplate",
//           foreignField: "_id",
//           as: "battle",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$battle.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: last2lastMonth,
//           year: lastYear,
//           joining_month: last2lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

//     const paidLast2LastMonthUserMarginX = [
//       {
//         $project: {
//           _id: 0,
//           participants: 1,
//           entryFee: 1,
//           marginXTemplate: 1,
//         },
//       },
//       {
//         $unwind: {
//           path: "$participants",
//         },
//       },
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "participants.userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $lookup: {
//           from: "marginx-templates",
//           localField: "marginXTemplate",
//           foreignField: "_id",
//           as: "marginX",
//         },
//       },
//       {
//         $addFields: {
//           entryFee: {
//             $arrayElemAt: ["$marginX.entryFee", 0],
//           },
//         },
//       },
//       {
//         $match: {
//           entryFee: {
//             $gt: 0,
//           },
//         },
//       },
//       {
//         $project: {
//           userId: "$participants.userId",
//           fee: "$entryFee",
//           month: {
//             $month: "$participants.boughtAt",
//           },
//           year: {
//             $year: "$participants.boughtAt",
//           },
//           joining_month: {
//             $month: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//           joining_year: {
//             $year: {
//               $arrayElemAt: ["$user.joining_date", 0],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           fee: {
//             $gt: 0,
//           },
//           month: last2lastMonth,
//           year: lastYear,
//           joining_month: last2lastMonth,
//           joining_year: lastYear,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//           },
//           totalRevenue: {
//             $sum: "$fee",
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id.userId",
//           totalRevenue: 1,
//         },
//       },
//     ]

    
//     const tenXTraders = await TenXTrading.aggregate(pipeline);
//     const virtualTraders = await PaperTrading.aggregate(pipeline);
//     const contestTraders = await ContestTrading.aggregate(pipeline);
//     const internshipTraders = await InternshipTrading.aggregate(pipeline);
//     const marginXTraders = await MarginXTrading.aggregate(pipeline);
//     const battleTraders = await BattleTrading.aggregate(pipeline);

//     const thisMonthtenXTraders = await TenXTrading.aggregate(thismonthpipeline);
//     const thisMonthvirtualTraders = await PaperTrading.aggregate(thismonthpipeline);
//     const thisMonthcontestTraders = await ContestTrading.aggregate(thismonthpipeline);
//     const thisMonthinternshipTraders = await InternshipTrading.aggregate(thismonthpipeline);
//     const thisMonthmarginXTraders = await MarginXTrading.aggregate(thismonthpipeline);
//     const thisMonthbattleTraders = await BattleTrading.aggregate(thismonthpipeline);

//     const lastMonthtenXTraders = await TenXTrading.aggregate(lastmonthpipeline);
//     const lastMonthvirtualTraders = await PaperTrading.aggregate(lastmonthpipeline);
//     const lastMonthcontestTraders = await ContestTrading.aggregate(lastmonthpipeline);
//     const lastMonthinternshipTraders = await InternshipTrading.aggregate(lastmonthpipeline);
//     const lastMonthmarginXTraders = await MarginXTrading.aggregate(lastmonthpipeline);
//     const lastMonthbattleTraders = await BattleTrading.aggregate(lastmonthpipeline);

//     const last2lastMonthtenXTraders = await TenXTrading.aggregate(last2lastmonthpipeline);
//     const last2lastMonthvirtualTraders = await PaperTrading.aggregate(last2lastmonthpipeline);
//     const last2lastMonthcontestTraders = await ContestTrading.aggregate(last2lastmonthpipeline);
//     const last2lastMonthinternshipTraders = await InternshipTrading.aggregate(last2lastmonthpipeline);
//     const last2lastMonthmarginXTraders = await MarginXTrading.aggregate(last2lastmonthpipeline);
//     const last2lastMonthbattleTraders = await BattleTrading.aggregate(last2lastmonthpipeline);

//     const paidTotaltenXTraders = await TenX.aggregate(paidTotalUserTenX);
//     const paidTotalcontestTraders = await Contest.aggregate(paidTotalUserContest);
//     const paidTotalmarginXTraders = await MarginX.aggregate(paidTotalUserMarginX);
//     const paidTotalbattleTraders = await Battle.aggregate(paidTotalUserBattle);

//     const paidThisMonthtenXTraders = await TenX.aggregate(paidThisMonthUserTenX);
//     const paidThisMonthcontestTraders = await Contest.aggregate(paidThisMonthUserContest);
//     const paidThisMonthmarginXTraders = await MarginX.aggregate(paidThisMonthUserMarginX);
//     const paidThisMonthbattleTraders = await Battle.aggregate(paidThisMonthUserBattle);

//     const paidLastMonthtenXTraders = await TenX.aggregate(paidLastMonthUserTenX);
//     const paidLastMonthcontestTraders = await Contest.aggregate(paidLastMonthUserContest);
//     const paidLastMonthmarginXTraders = await MarginX.aggregate(paidLastMonthUserMarginX);
//     const paidLastMonthbattleTraders = await Battle.aggregate(paidLastMonthUserBattle);

//     const paidLast2LastMonthtenXTraders = await TenX.aggregate(paidLast2LastMonthUserTenX);
//     const paidLast2LastMonthcontestTraders = await Contest.aggregate(paidLast2LastMonthUserContest);
//     const paidLast2LastMonthmarginXTraders = await MarginX.aggregate(paidLast2LastMonthUserMarginX);
//     const paidLast2LastMonthbattleTraders = await Battle.aggregate(paidLast2LastMonthUserBattle);
    
//     let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];
//     let thisMonthallTraders = [...thisMonthtenXTraders, ...thisMonthvirtualTraders, ...thisMonthcontestTraders, ...thisMonthinternshipTraders, ...thisMonthmarginXTraders, ...thisMonthbattleTraders];
//     let lastMonthallTraders = [...lastMonthtenXTraders, ...lastMonthvirtualTraders, ...lastMonthcontestTraders, ...lastMonthinternshipTraders, ...lastMonthmarginXTraders, ...lastMonthbattleTraders];
//     let last2lastMonthallTraders = [...last2lastMonthtenXTraders, ...last2lastMonthvirtualTraders, ...last2lastMonthcontestTraders, ...last2lastMonthinternshipTraders, ...last2lastMonthmarginXTraders, ...last2lastMonthbattleTraders];
//     let paidTotalallTraders = [...paidTotaltenXTraders, ...paidTotalcontestTraders, ...paidTotalmarginXTraders, ...paidTotalbattleTraders];
//     let paidThisMonthallTraders = [...paidThisMonthtenXTraders, ...paidThisMonthcontestTraders, ...paidThisMonthmarginXTraders, ...paidThisMonthbattleTraders];
//     let paidLastMonthallTraders = [...paidLastMonthtenXTraders, ...paidLastMonthcontestTraders, ...paidLastMonthmarginXTraders, ...paidLastMonthbattleTraders];
//     let paidLast2LastMonthallTraders = [...paidLast2LastMonthtenXTraders, ...paidLast2LastMonthcontestTraders, ...paidLast2LastMonthmarginXTraders, ...paidLast2LastMonthbattleTraders];

//     // Create a Set to remove duplicates
//     const uniqueTraders = new Set(allTraders);
//     const thisMonthuniqueTraders = new Set(thisMonthallTraders);
//     const lastMonthuniqueTraders = new Set(lastMonthallTraders);
//     const last2lastMonthuniqueTraders = new Set(last2lastMonthallTraders);
//     const paidTotaluniqueTraders = new Set(paidTotalallTraders);
//     const paidThisMonthuniqueTraders = new Set(paidThisMonthallTraders);
//     const paidLastMonthuniqueTraders = new Set(paidLastMonthallTraders);
//     const paidLast2LastMonthuniqueTraders = new Set(paidLast2LastMonthallTraders);

//     // Convert the Set back to an array (if needed)
//     const uniqueTradersArray = [...uniqueTraders];
//     const thisMonthuniqueTradersArray = [...thisMonthuniqueTraders];
//     const lastMonthuniqueTradersArray = [...lastMonthuniqueTraders];
//     const last2lastMonthuniqueTradersArray = [...last2lastMonthuniqueTraders];
//     const paidTotaluniqueTradersArray = [...paidTotaluniqueTraders];
//     const paidThisMonthuniqueTradersArray = [...paidThisMonthuniqueTraders];
//     const paidLastMonthuniqueTradersArray = [...paidLastMonthuniqueTraders];
//     const paidLast2LastMonthuniqueTradersArray = [...paidLast2LastMonthuniqueTraders];
//     const totalActiveTraders = uniqueTradersArray.length;
//     console.log("Total Active Traders:",totalActiveTraders)
//     const thisMonthtotalActiveTraders = thisMonthuniqueTradersArray.length;
//     console.log("This Month Total Active Traders:",thisMonthtotalActiveTraders)
//     const lastMonthtotalActiveTraders = lastMonthuniqueTradersArray.length;
//     console.log("Last Month Total Active Traders:",lastMonthtotalActiveTraders)
//     const last2lastMonthtotalActiveTraders = last2lastMonthuniqueTradersArray.length;
//     console.log("Last2Last Month Total Active Traders:",last2lastMonthtotalActiveTraders)
//     const paidTotaltotalActiveTraders = paidTotaluniqueTradersArray.length;
//     console.log("Paid Total Traders:",paidTotaltotalActiveTraders)
//     const paidThisMonthActiveTraders = paidThisMonthuniqueTradersArray.length;
//     console.log("Paid This Month Traders:",paidThisMonthActiveTraders)
//     const paidLastMonthActiveTraders = paidLastMonthuniqueTradersArray.length;
//     console.log("Paid Last Month Traders:",paidLastMonthActiveTraders)
//     const paidLast2LastMonthActiveTraders = paidLast2LastMonthuniqueTradersArray.length;
//     console.log("Paid Last2Last Month Traders:",paidLast2LastMonthActiveTraders)
//     let marketingFunnel = [{
//         totalSignups : totalSignups, 
//         thisMonthSignups : thisMonthSignups.length, 
//         lastMonthSignups : lastMonthSignups.length,
//         last2lastMonthSignups : last2lastMonthSignups.length,
//         totalActiveTraders : totalActiveTraders, 
//         thisMonthtotalActiveTraders : thisMonthtotalActiveTraders, 
//         lastMonthtotalActiveTraders : lastMonthtotalActiveTraders,
//         last2lastMonthtotalActiveTraders : last2lastMonthtotalActiveTraders,
//         paidTotaltotalActiveTraders : paidTotaltotalActiveTraders, 
//         paidThisMonthActiveTraders : paidThisMonthActiveTraders,
//         paidLastMonthActiveTraders : paidLastMonthActiveTraders,
//         paidLast2LastMonthActiveTraders : paidLast2LastMonthActiveTraders,
//       }]
//     const response = {
//       status: "success",
//       message: "Monthly Active Users on Platform fetched successfully",
//       data: marketingFunnel,
//     };
    

//   res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

exports.getMarketingFunnelDataOptimised = async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  console.log("Month Start:",startOfMonth)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  console.log("Month End:",endOfMonth)
  const thisMonth = today.getMonth() + 1
  console.log("This Month:",thisMonth)
  const lastMonth = today.getMonth() 
  console.log("Last Month:",lastMonth)
  const last2lastMonth = today.getMonth()-1
  console.log("Last2Last Month:",last2lastMonth)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth()-1, 1);
  console.log("Last Month Start:",startOfLastMonth)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  console.log("Last Month End:",endOfLastMonth)
  const thisYear = today.getFullYear()
  console.log("This Year:",thisYear)
  const lastYear = thisMonth === 1 ? thisYear-1 : thisMonth === 2 ? thisYear -1 : thisYear
  console.log("Last Year:",lastYear)

  try {
    const totalSignups = await User.countDocuments();
    console.log("Total Signups:",totalSignups)
    const thisMonthSignups = await User.aggregate(
      [
        {
          $project: {
            _id: 1,
            joining_date: 1,
          },
        },
        {
          $addFields: {
            adjustedJoiningDate: {
              $add: [
                "$joining_date",
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ], // Adding 5 hours and 30 minutes in milliseconds
            },
          },
        },
        {
          $project: {
            _id: 1,
            month: {
              $month: "$adjustedJoiningDate",
            },
            year: {
              $year: "$adjustedJoiningDate",
            },
          },
        },
        {
          $match: {
            month: thisMonth,
            year: thisYear,
          },
        },
      ]
    );
    console.log("This Month Signups:",thisMonthSignups.length)


    const pipeline = [
      {
        $project: {
          _id: 1,
          trader: 1,
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
          },
        },
      },
      {
        $project: {
          _id:'$_id.trader',
        },
      }
    ];

    const monthwiseActiveUsersPipeline = [
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          status: 1,
          month: {
            $month: "$trade_time",
          },
          year: {
            $year: "$trade_time",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $match: {
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
            month: "$month",
            year: "$year",
            joining_month: "$joining_month",
            joining_year: "$joining_year",
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ["$month", "$joining_month"],
              },
              {
                $eq: ["$year", "$joining_year"],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          uniqueUsers: {
            $addToSet: {
              $toString: "$_id.trader",
            },
          }, // Calculate the total number of unique active users
        },
      },
      {
        $project: {
          _id: 0,
          uniqueUsers: 1,
          month: "$_id.month",
          year: "$_id.year",
        },
      },
      {
        $sort: {
          year: -1,
          month: -1,
        },
      },
    ]

    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    const MWtenXTraders = await TenXTrading.aggregate(monthwiseActiveUsersPipeline);
    const MWvirtualTraders = await PaperTrading.aggregate(monthwiseActiveUsersPipeline);
    const MWcontestTraders = await ContestTrading.aggregate(monthwiseActiveUsersPipeline);
    const MWinternshipTraders = await InternshipTrading.aggregate(monthwiseActiveUsersPipeline);
    const MWmarginXTraders = await MarginXTrading.aggregate(monthwiseActiveUsersPipeline);
    const MWbattleTraders = await BattleTrading.aggregate(monthwiseActiveUsersPipeline);
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];
    let MUallTraders = [...MWtenXTraders, ...MWvirtualTraders, ...MWcontestTraders, ...MWinternshipTraders, ...MWmarginXTraders, ...MWbattleTraders];
    console.log("MU Traders:",MUallTraders)

    let monthToTradersMap = new Map();

    MUallTraders.forEach(({ month, year, trader }) => {
      if (!monthToTradersMap.has(year)) {
        monthToTradersMap.set(year, new Map());
      }
    
      const yearMap = monthToTradersMap.get(year);
    
      if (yearMap.has(month)) {
        let existingTradersSet = yearMap.get(month);
        existingTradersSet.add(trader);
      } else {
        yearMap.set(month, new Set([trader]));
      }
    });

    let result = [];

    monthToTradersMap.forEach((yearMap, year) => {
      yearMap.forEach((traders, month) => {
        console.log(month, year, traders)
        result.push({ month, year, uniqueUsersCount: traders.size });
      });
    });

    result.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year; // Sort by year first
      } else {
        return a.month - b.month; // If years are equal, sort by month
      }
    });
    

    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: result.splice(result.length <= 6 ? 0 : result.length-6,result.length),
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

exports.downloadThisMonthSignUp = async (req, res) => {
  const monthNumber = parseInt(req.params.month)
  const yearNumber = parseInt(req.params.year)

  try {
    
    const thisMonthSignups = await User.aggregate(
      [
        {
          $addFields: {
            adjustedJoiningDate: {
              $add: [
                "$joining_date",
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ], // Adding 5 hours and 30 minutes in milliseconds
            },
          },
        },
        {
          $lookup: {
            from: "campaigns",
            localField: "campaign",
            foreignField: "_id",
            as: "campaign-details",
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            creationProcess: "$creationProcess",
            joining_date: "$adjustedJoiningDate",
            referrerCode: {
              $ifNull: ["$referrerCode", ""],
            },
            campaign: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$campaign-details.campaignName",
                    0,
                  ],
                },
                "",
              ],
            },
            month: {
              $month: "$adjustedJoiningDate",
            },
            year: {
              $year: "$adjustedJoiningDate",
            },
          },
        },
        {
          $match: {
            month: monthNumber,
            year: yearNumber,
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            joining_date: {$substr : ['$joining_date',0,10]},
            creationProcess: 1,
            referrerCode: 1,
            campaign: 1,
          },
        },
      ]
    );
    
    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: thisMonthSignups,
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

exports.downloadThisMonthActive = async (req, res) => {
  const monthNumber = parseInt(req.params.month)
  const yearNumber = parseInt(req.params.year)

  try {

    const thismonthpipeline = [
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          status: 1,
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          creationProcess: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.creationProcess",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
          joining_date: {
            $arrayElemAt: ["$user.joining_date", 0],
          },
          month: {
            $month: "$trade_time",
          },
          year: {
            $year: "$trade_time",
          },
          joining_month: {
            $month: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
          joining_year: {
            $year: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
          },
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              "$joining_date",
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          month: monthNumber,
          year: yearNumber,
          joining_month: monthNumber,
          joining_year: yearNumber,
          status: "COMPLETE",
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          first_name: 1,
          last_name: 1,
          mobile: 1,
          email: 1,
          creationProcess: 1,
          joining_date: "$adjustedJoiningDate",
          referrerCode: 1,
          campaign: 1,
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
        },
      },
      {
        $project: {
          _id: "$_id.trader",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
        },
      },
    ];

    const thisMonthtenXTraders = await TenXTrading.aggregate(thismonthpipeline);
    const thisMonthvirtualTraders = await PaperTrading.aggregate(thismonthpipeline);
    const thisMonthcontestTraders = await ContestTrading.aggregate(thismonthpipeline);
    const thisMonthinternshipTraders = await InternshipTrading.aggregate(thismonthpipeline);
    const thisMonthmarginXTraders = await MarginXTrading.aggregate(thismonthpipeline);
    const thisMonthbattleTraders = await BattleTrading.aggregate(thismonthpipeline);

   
    let thisMonthallTraders = [...thisMonthtenXTraders, ...thisMonthvirtualTraders, ...thisMonthcontestTraders, ...thisMonthinternshipTraders, ...thisMonthmarginXTraders, ...thisMonthbattleTraders];
    
    // Create a Set to remove duplicates
    const thisMonthuniqueTraders = Array.from(new Set(thisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const thisMonthuniqueTraders = new Set(thisMonthallTraders);
   
    // Convert the Set back to an array (if needed)
    const thisMonthuniqueTradersArray = [...thisMonthuniqueTraders];
    const processedData = thisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });
    
    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: processedData,
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

exports.downloadThisMonthPaid = async (req, res) => {
  const monthNumber = parseInt(req.params.month)
  const yearNumber = parseInt(req.params.year)

  try {

    const paidThisMonthUserTenX = [
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.fee": {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$users.userId",
          fee: "$users.fee",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: {
              $arrayElemAt: ["$user.first_name", 0],
            },
            last_name: {
              $arrayElemAt: ["$user.last_name", 0],
            },
            mobile: {
              $arrayElemAt: ["$user.mobile", 0],
            },
            email: {
              $arrayElemAt: ["$user.email", 0],
            },
            creationProcess: {
              $arrayElemAt: [
                "$user.creationProcess",
                0,
              ],
            },
            joining_date: "$adjustedJoiningDate",
            joining_month: {
              $month: "$adjustedJoiningDate",
            },
            joining_year: {
              $year: "$adjustedJoiningDate",
            },
            referrerCode: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$user.referrerCode",
                    0,
                  ],
                },
                "",
              ],
            },
            campaign: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$campaign-details.campaignName",
                    0,
                  ],
                },
                "",
              ],
            },
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $match: {
          "_id.joining_month": monthNumber,
          "_id.joining_year": yearNumber,
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserContest = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          fee: "$entryFee",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          joining_month: {
            $month: "$adjustedJoiningDate",
          },
          joining_year: {
            $year: "$adjustedJoiningDate",
          },
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
        },
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            joining_month: monthNumber,
            joining_year: yearNumber,
          },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserBattle = [
      {
        $project: {
          _id: 0,
          participants: 1,
          battleTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$battle.entryFee", 0],
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          joining_month: {
            $month: "$adjustedJoiningDate",
          },
          joining_year: {
            $year: "$adjustedJoiningDate",
          },
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
          fee: "$entryFee",
        },
      },
      {
        $match: {
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthUserMarginX = [
      {
        $project: {
          _id: 0,
          participants: 1,
          marginXTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginX",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$marginX.entryFee", 0],
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          joining_month: {
            $month: "$adjustedJoiningDate",
          },
          joining_year: {
            $year: "$adjustedJoiningDate",
          },
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
          fee: "$entryFee",
        },
      },
      {
        $match: {
          joining_month: monthNumber,
          joining_year: yearNumber,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
        },
      },
    ]

    const paidThisMonthtenXTraders = await TenX.aggregate(paidThisMonthUserTenX);
    const paidThisMonthcontestTraders = await Contest.aggregate(paidThisMonthUserContest);
    const paidThisMonthmarginXTraders = await MarginX.aggregate(paidThisMonthUserMarginX);
    const paidThisMonthbattleTraders = await Battle.aggregate(paidThisMonthUserBattle);

    let paidThisMonthallTraders = [...paidThisMonthtenXTraders, ...paidThisMonthcontestTraders, ...paidThisMonthmarginXTraders, ...paidThisMonthbattleTraders];
    
    // Create a Set to remove duplicates
    const paidThisMonthuniqueTraders = Array.from(new Set(paidThisMonthallTraders.map(JSON.stringify))).map(JSON.parse);
    // const paidThisMonthuniqueTraders = new Set(paidThisMonthallTraders);
    
    const paidThisMonthuniqueTradersArray = [...paidThisMonthuniqueTraders];
    const paidProcessedData = paidThisMonthuniqueTradersArray.map(user => {
      // Loop through the keys (field names) in each user object
      const newUser = {};
      for (const key in user) {
        // Check if the value is an array with a single item
        if (user[key].length === 1) {
          // If it is, assign the single value to the new user object
          newUser[key] = user[key][0];
        } else {
          // If it's not an array with a single item, keep it as is
          newUser[key] = user[key];
        }
      }
      return newUser;
    });

    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: paidProcessedData,
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

exports.downloadLifetimeSignUp = async (req, res) => {

  try {
    const lifetimeSignup = await User.aggregate(
      [
        {
          $addFields: {
            adjustedJoiningDate: {
              $add: [
                "$joining_date",
                5 * 60 * 60 * 1000 + 30 * 60 * 1000,
              ], // Adding 5 hours and 30 minutes in milliseconds
            },
            campaign: {
              $ifNull: ["$campaign", ""],
            },
          },
        },
        {
          $lookup: {
            from: "campaigns",
            localField: "campaign",
            foreignField: "_id",
            as: "campaign-details",
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            adjustedJoiningDate: 1,
            creationProcess: 1,
            myReferralCode: 1,
            referrerCode: {
              $ifNull: ["$referrerCode", ""],
            },
            campaign: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$campaign-details.campaignName",
                    0,
                  ],
                },
                "",
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            mobile: 1,
            email: 1,
            joining_date: {
              $substr: ["$adjustedJoiningDate", 0, 10],
            },
            campaign: 1,
            creationProcess: 1,
            myReferralCode:1,
            referrerCode: 1,
          },
        },
      ]
    );

   
    const response = {
      status: "success",
      message: "Lifetime Signup Users on Platform fetched successfully",
      data: lifetimeSignup,
      count: lifetimeSignup.length,
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

exports.downloadLifetimeActive = async (req, res) => {

  try {
    
    const pipeline = [
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          status: "COMPLETE",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
    
          campaign: {
            $arrayElemAt: [
              "$campaign-details.campaignName",
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          trader: 1,
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            trader: "$trader",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: "$joining_date",
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
        },
      },
      {
        $project: {
          _id: "$_id.trader",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
        },
      },
      // {
      //   $match: {
      //     first_name: {
      //       $ne: null,
      //     },
      //   },
      // },
    ];

    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    const marginXTraders = await MarginXTrading.aggregate(pipeline);
    const battleTraders = await BattleTrading.aggregate(pipeline);

    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders, ...marginXTraders, ...battleTraders];
    
    // Create a Set to remove duplicates
    const uniqueTraders = Array.from(new Set(allTraders.map(JSON.stringify))).map(JSON.parse);
    // const uniqueTraders = new Set(allTraders);

    // Convert the Set back to an array (if needed)
    const uniqueTradersArray = [...uniqueTraders];
    
    const response = {
      status: "success",
      message: "Lifetime Active Users on Platform fetched successfully",
      data: uniqueTradersArray,
      count: uniqueTradersArray.length,
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

exports.downloadLifetimePaid = async (req, res) => {

  try {

    const paidTotalUserTenX = [
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $match: {
          "users.fee": {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$users.userId",
          fee: "$users.fee",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: {
              $arrayElemAt: ["$user.first_name", 0],
            },
            last_name: {
              $arrayElemAt: ["$user.last_name", 0],
            },
            mobile: {
              $arrayElemAt: ["$user.mobile", 0],
            },
            email: {
              $arrayElemAt: ["$user.email", 0],
            },
            creationProcess: {
              $arrayElemAt: [
                "$user.creationProcess",
                0,
              ],
            },
            joining_date: {$substr : ["$adjustedJoiningDate",0,10]},
            referrerCode: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$user.referrerCode",
                    0,
                  ],
                },
                "",
              ],
            },
            campaign: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$campaign-details.campaignName",
                    0,
                  ],
                },
                "",
              ],
            },
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
          // product: "TenX",
        },
      },
    ]

    const paidTotalUserContest = [
      {
        $project: {
          _id: 0,
          participants: 1,
          entryFee: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          fee: "$entryFee",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: {$substr : ["$joining_date",0,10]},
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
          // product: "Contest",
        },
      },
    ]

    const paidTotalUserBattle = [
      {
        $project: {
          _id: 0,
          participants: 1,
          battleTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "battle-templates",
          localField: "battleTemplate",
          foreignField: "_id",
          as: "battle",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$battle.entryFee", 0],
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
          fee: "$entryFee",
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: {$substr : ["$joining_date",0,10]},
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
          // product: "Battle",
        },
      },
    ]

    const paidTotalUserMarginX = [
      {
        $project: {
          _id: 0,
          participants: 1,
          marginXTemplate: 1,
        },
      },
      {
        $unwind: {
          path: "$participants",
        },
      },
      {
        $lookup: {
          from: "marginx-templates",
          localField: "marginXTemplate",
          foreignField: "_id",
          as: "marginX",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "user.campaign",
          foreignField: "_id",
          as: "campaign-details",
        },
      },
      {
        $addFields: {
          entryFee: {
            $arrayElemAt: ["$marginX.entryFee", 0],
          },
          adjustedJoiningDate: {
            $add: [
              {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
              5 * 60 * 60 * 1000 + 30 * 60 * 1000,
            ], // Adding 5 hours and 30 minutes in milliseconds
          },
        },
      },
      {
        $match: {
          entryFee: {
            $gt: 0,
          },
        },
      },
      {
        $project: {
          userId: "$participants.userId",
          first_name: {
            $arrayElemAt: ["$user.first_name", 0],
          },
          last_name: {
            $arrayElemAt: ["$user.last_name", 0],
          },
          mobile: {
            $arrayElemAt: ["$user.mobile", 0],
          },
          email: {
            $arrayElemAt: ["$user.email", 0],
          },
          creationProcess: {
            $arrayElemAt: [
              "$user.creationProcess",
              0,
            ],
          },
          joining_date: "$adjustedJoiningDate",
          referrerCode: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$user.referrerCode",
                  0,
                ],
              },
              "",
            ],
          },
          campaign: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$campaign-details.campaignName",
                  0,
                ],
              },
              "",
            ],
          },
          fee: "$entryFee",
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            first_name: "$first_name",
            last_name: "$last_name",
            mobile: "$mobile",
            email: "$email",
            creationProcess: "$creationProcess",
            joining_date: {$substr : ["$joining_date",0,10]},
            referrerCode: "$referrerCode",
            campaign: "$campaign",
          },
          // totalRevenue: {
          //   $sum: "$fee",
          // },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          first_name: "$_id.first_name",
          last_name: "$_id.last_name",
          mobile: "$_id.mobile",
          email: "$_id.email",
          creationProcess: "$_id.creationProcess",
          joining_date: {$substr : ["$_id.joining_date",0,10]},
          referrerCode: "$_id.referrerCode",
          campaign: "$_id.campaign",
          // totalRevenue: 1,
          // product: "MarginX",
        },
      },
    ]

    const paidTotaltenXTraders = await TenX.aggregate(paidTotalUserTenX);
    const paidTotalcontestTraders = await Contest.aggregate(paidTotalUserContest);
    const paidTotalmarginXTraders = await MarginX.aggregate(paidTotalUserMarginX);
    const paidTotalbattleTraders = await Battle.aggregate(paidTotalUserBattle);

    let paidTotalallTraders = [...paidTotaltenXTraders, ...paidTotalcontestTraders, ...paidTotalmarginXTraders, ...paidTotalbattleTraders];
    
    // Create a Set to remove duplicates
    const paidTotaluniqueTraders = Array.from(new Set(paidTotalallTraders.map(JSON.stringify))).map(JSON.parse);
    // const paidTotaluniqueTraders = new Set(paidTotalallTraders);

    // Convert the Set back to an array (if needed)
    const paidTotaluniqueTradersArray = [...paidTotaluniqueTraders];
    
    const response = {
      status: "success",
      message: "Lifetime Active Users on Platform fetched successfully",
      data: paidTotaluniqueTradersArray,
      count: paidTotaluniqueTradersArray.length,
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



