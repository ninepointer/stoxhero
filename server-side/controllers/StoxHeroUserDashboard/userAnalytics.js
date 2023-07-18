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
          uniqueUsers: { $addToSet: "$_id.trader" },
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
      data: Object.values(dateWiseDAUs),
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
          uniqueUsers: { $addToSet: "$_id.trader" },
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
      data: Object.values(monthWiseMAUs),
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
          uniqueUsers: { $addToSet: "$_id.trader" },
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
      data: Object.values(weekWiseWAUs),
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
          _id: "$_id.date",
          totalActiveUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];
    
    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);
    
    // Calculate the total unique active users across all products
    const uniqueActiveUsers = [
      ...tenXTraders,
      ...virtualTraders,
      ...contestTraders,
      ...internshipTraders,
    ].reduce((result, { _id, totalActiveUsers }) => {
      if (_id !== "1970-01-01") { // Exclude the date "1970-01-01"
        result.push({ date: _id, activeUsers: totalActiveUsers });
      }
      return result;
    }, []); 

    const response = {
      status: "success",
      message: "Daily Active Users on platform fetched successfully",
      data: uniqueActiveUsers,
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

// exports.getMonthlyActiveUsersOnPlatform = async (req, res) => {
//   try {
//     const pipeline = [
//       {
//         $group: {
//           _id: {
//             month: { $substr: ["$trade_time", 0, 7] },
//             trader: "$trader",
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id.month",
//           activeUsers: { $sum: 1 }, // Calculate the total number of unique active users
//         },
//       },
//       {
//         $sort: {
//           _id: 1,
//         },
//       },
//     ];
    
//     const tenXTraders = await TenXTrading.aggregate(pipeline);
//     const virtualTraders = await PaperTrading.aggregate(pipeline);
//     const contestTraders = await ContestTrading.aggregate(pipeline);
    
//     const monthlyActiveUsers = [
//       ...tenXTraders,
//       ...virtualTraders,
//       ...contestTraders,
//     ].reduce((result, { month, activeUsers }) => {
//       const existingMonth = result.find(item => item.month === month);
//       if (existingMonth) {
//         existingMonth.activeUsers += activeUsers;
//       } else {
//         result.push({ month, activeUsers });
//       }
//       return result;
//     }, []);
    
//     const response = {
//       status: "success",
//       message: "Monthly Active Users on Platform fetched successfully",
//       data: monthlyActiveUsers.map(({ month, activeUsers }) => ({ month, activeUsers })),
//     };
    
//     console.log(response);
    

//   res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

exports.getMonthlyActiveUsersOnPlatform = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: { date: "$trade_time" } },
            month: { $month: { date: "$trade_time" } },
            trader: "$trader",
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          uniqueTraders: { $addToSet: "$_id.trader" },
        },
      },
      {
        $match: {
          "_id.year": { $ne: 1970 }, // Exclude year 1970
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ];

    const tenXTraders = await TenXTrading.aggregate(pipeline);
    const virtualTraders = await PaperTrading.aggregate(pipeline);
    const contestTraders = await ContestTrading.aggregate(pipeline);
    const internshipTraders = await InternshipTrading.aggregate(pipeline);

    let monthlyActiveUsers = [];
    for (let elem of tenXTraders) {
      let arr = [];
      arr = arr.concat(elem?.uniqueTraders);
      for (let subelem of virtualTraders) {
        if (elem._id?.year === subelem._id?.year && elem._id?.month === subelem._id?.month) {
          arr = arr.concat(subelem?.uniqueTraders);
        }
      }

      for (let subelem of contestTraders) {
        if (elem._id?.year === subelem._id?.year && elem._id?.month === subelem._id?.month) {
          arr = arr.concat(subelem?.uniqueTraders);
        }
      }

      for (let subelem of internshipTraders) {
        if (elem._id?.year === subelem._id?.year && elem._id?.month === subelem._id?.month) {
          arr = arr.concat(subelem?.uniqueTraders);
        }
      }

      // console.log(arr.length)

      // const uniqueArray = [...new Set(arr)];
      const uniqueArray = arr.filter((value, index, self) => {
        console.log(self)
        return index === self.findIndex(obj => obj.toString() === value.toString());
      });

      // console.log(uniqueArray.length)
      const { year, month } = elem?._id;
      const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;
      monthlyActiveUsers.push({ month: formattedMonth, activeUsers: uniqueArray.length });
    }

    // console.log(monthlyActiveUsers)
    // Sort the array in increasing order of year and month
    monthlyActiveUsers.sort((a, b) => {
      return a.month.localeCompare(b.month);
    });

    const response = {
      status: "success",
      message: "Monthly Active Users on Platform fetched successfully",
      data: monthlyActiveUsers,
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




    // Combine the results from all collections
    // console.log(monthlyActiveUsers)
    // const combinedResults = [...tenXTraders, ...virtualTraders, ...contestTraders, ...internshipTraders];

    // // Calculate the total unique active users per month
    // const monthlyActiveUsers = combinedResults.reduce((result, { _id, totalActiveUsers }) => {
    //   const { year, month } = _id;
    //   const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;

    //   const existingMonth = result.find(entry => entry.month === formattedMonth);
    //   if (existingMonth) {
    //     existingMonth.activeUsers += totalActiveUsers;
    //   } else {
    //     result.push({ month: formattedMonth, activeUsers: totalActiveUsers });
    //   }

    //   return result;
    // }, []);






  
  
  
  

