const mongoose = require('mongoose');
const ContestTrading = require('../../models/DailyContest/dailyContestMockUser'); // Assuming your model is exported as Contest from the mentioned path
const User = require("../../models/User/userDetailSchema");
const TenXTrading = require("../../models/mock-trade/tenXTraderSchema");
const PaperTrading = require("../../models/mock-trade/paperTrade");
const InternshipTrading = require("../../models/mock-trade/internshipTrade")
const { ObjectId } = require('mongodb');



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
            total: 0,
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].internshipTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = virtualTrading + tenXTrading + contest + internshipTrading;
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
            total: 0,
            uniqueUsers: [],
          };
        }
        monthWiseMAUs[month].internshipTrading = traders;
        monthWiseMAUs[month].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the month-wise total MAUs and unique users
    Object.keys(monthWiseMAUs).forEach(month => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, uniqueUsers } = monthWiseMAUs[month];
      monthWiseMAUs[month].total = virtualTrading + tenXTrading + contest + internshipTrading;
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
          total: 0,
          uniqueUsers: [],
        };
      }
      weekWiseWAUs[week].internshipTrading = traders;
      weekWiseWAUs[week].uniqueUsers.push(...uniqueUsers);
    });

    // Calculate the week-wise total WAUs and unique users
    Object.keys(weekWiseWAUs).forEach(week => {
      const { virtualTrading, tenXTrading, contest, internshipTrading, uniqueUsers } = weekWiseWAUs[week];
      weekWiseWAUs[week].total = virtualTrading + tenXTrading + contest + internshipTrading;
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


    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders];

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
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders];

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
    
    let allTraders = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders];

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






  
  
  
  

