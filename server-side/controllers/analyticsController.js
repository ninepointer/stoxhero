const PaperTrade = require("../models/mock-trade/paperTrade");
const InfinityTrade = require("../models/mock-trade/infinityTrader");
const InternshipTrader = require("../models/mock-trade/internshipTrade");
const TraderDailyPnlData = require("../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const { ObjectId } = require("mongodb");
const TradingHoliday = require("../models/TradingHolidays/tradingHolidays");
const ThirdPartyTrades = require("../models/mock-trade/thirdPartyTrades");

exports.getPaperTradesOverview = async (req, res, next) => {
  let userId = req.params.id;
  let today = new Date();

  // Calculate the start of the current week (Sunday)
  let startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate the start of the current month
  const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate the start of the current year
  const pastYear = new Date(today.getFullYear(), 0, 1);

  // Calculate the start of the current quarter
  const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
  const startOfQuarter = new Date(today.getFullYear(), quarterStartMonth, 1);

  // Calculate the end of the current quarter
  const endOfQuarter = new Date(today.getFullYear(), quarterStartMonth + 3, 0);

  // Calculate yesterday's date
  let date = new Date();
  let getYesterdaydate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  getYesterdaydate = getYesterdaydate + "T00:00:00.000Z";
  const yesterday = new Date(getYesterdaydate);

  let paperTradesOverview = await PaperTrade.aggregate([
    {
      $match: {
        trader: new ObjectId(userId),
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: null,
        grossPNLDaily: {
          $sum: {
            $cond: [
              { $gte: ["$trade_time", yesterday] },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
        brokerageSumDaily: {
          $sum: {
            $cond: [{ $gte: ["$trade_time", yesterday] }, "$brokerage", 0],
          },
        },
        grossPNLWeekly: {
          $sum: {
            $cond: [
              { $gte: ["$trade_time", startOfWeek] },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
        brokerageSumWeekly: {
          $sum: {
            $cond: [{ $gte: ["$trade_time", startOfWeek] }, "$brokerage", 0],
          },
        },
        grossPNLMonthly: {
          $sum: {
            $cond: [
              { $gte: ["$trade_time", pastMonth] },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
        brokerageSumMonthly: {
          $sum: {
            $cond: [{ $gte: ["$trade_time", pastMonth] }, "$brokerage", 0],
          },
        },
        grossPNLQuarterly: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$trade_time", startOfQuarter] },
                  { $lte: ["$trade_time", endOfQuarter] },
                ],
              },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
        brokerageSumQuarterly: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$trade_time", startOfQuarter] },
                  { $lte: ["$trade_time", endOfQuarter] },
                ],
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLYearly: {
          $sum: {
            $cond: [
              { $gte: ["$trade_time", pastYear] },
              { $multiply: ["$amount", -1] },
              0,
            ],
          },
        },
        brokerageSumYearly: {
          $sum: {
            $cond: [{ $gte: ["$trade_time", pastYear] }, "$brokerage", 0],
          },
        },
        grossPNLLifetime: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerageSumLifetime: {
          $sum: "$brokerage",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        grossPNLDaily: 1,
        brokerageSumDaily: 1,
        netPNLDaily: {
          $subtract: ["$grossPNLDaily", "$brokerageSumDaily"],
        },
        grossPNLWeekly: 1,
        brokerageSumWeekly: 1,
        netPNLWeekly: {
          $subtract: ["$grossPNLWeekly", "$brokerageSumWeekly"],
        },
        grossPNLMonthly: 1,
        brokerageSumMonthly: 1,
        netPNLMonthly: {
          $subtract: ["$grossPNLMonthly", "$brokerageSumMonthly"],
        },
        grossPNLQuarterly: 1,
        brokerageSumQuarterly: 1,
        netPNLQuarterly: {
          $subtract: ["$grossPNLQuarterly", "$brokerageSumQuarterly"],
        },
        grossPNLYearly: 1,
        brokerageSumYearly: 1,
        netPNLYearly: {
          $subtract: ["$grossPNLYearly", "$brokerageSumYearly"],
        },
        grossPNLLifetime: 1,
        brokerageSumLifetime: 1,
        netPNLLifetime: {
          $subtract: ["$grossPNLLifetime", "$brokerageSumLifetime"],
        },
        count: 1,
      },
    },
  ]);

  res.status(200).json({ status: "success", data: paperTradesOverview });
};

exports.getPaperTradesDateWiseStats = async (req, res) => {
  let { id } = req.params;
  const { to, from } = req.query;
  const thirdParty = req.query.thirdParty ?? "false";
  if (req.query?.user && req.query.user != "undefined") {
    id = req.query?.user;
  }
  let usersArray = [id];
  if (id == "team") {
    usersArray = [
      "6666994093c01d363f79419e",
      "6666997a93c01d363f79419f",
      "6666c69193c01d363f7941a2",
      "6666c6cb93c01d363f7941a3",
    ];
  }

  let len = usersArray.length;

  let date = new Date();
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);
  const TradeModel = thirdParty == "true" ? ThirdPartyTrades : PaperTrade;

  let pnlDetails = await TradeModel.aggregate([
    {
      $match: {
        trade_time: { $gte: fromDate, $lte: toDate },
        trader: { $in: usersArray.map((id) => new ObjectId(id)) },
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 10] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: [
            "$gpnl",
            {
              $ifNull: ["$brokerage", 0],
            },
          ],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    {
      $addFields: {
        gpnl: { $divide: ["$gpnl", len] },
        brokerage: { $divide: ["$brokerage", len] },
        npnl: { $divide: ["$npnl", len] },
        lots: { $divide: ["$lots", len] },
        noOfTrade: { $divide: ["$noOfTrade", len] },
      },
    },
    { $sort: { date: 1 } },
  ]);

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getPaperTradesDateWiseWeekStats = async (req, res) => {
  let { id } = req.params;
  const { to, from } = req.query;
  const thirdParty = req.query.thirdParty ?? "false";
  if (req.query?.user && req.query.user != "undefined") {
    id = req.query?.user;
  }
  let usersArray = [id];
  if (id == "team") {
    usersArray = [
      "6666994093c01d363f79419e",
      "6666997a93c01d363f79419f",
      "6666c69193c01d363f7941a2",
      "6666c6cb93c01d363f7941a3",
    ];
  }
  const len = usersArray.length;
  const TradeModel = thirdParty == "true" ? ThirdPartyTrades : PaperTrade;
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // let dayCounts = {};
  // for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
  //   const day = d.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  //   dayCounts[day] = (dayCounts[day] || 0) + 1;
  // }

  let pnlDetails = await TradeModel.aggregate([
    {
      $match: {
        trade_time: { $gte: fromDate, $lte: toDate },
        trader: { $in: usersArray.map((id) => new ObjectId(id)) },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          dayOfWeek: { $dayOfWeek: "$trade_time" },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } },
        },
        totalGpnl: { $sum: { $multiply: ["$amount", -1] } },
        totalBrokerage: { $sum: "$brokerage" },
        totalNpnl: {
          $sum: {
            $subtract: [
              { $multiply: ["$amount", -1] },
              {
                $ifNull: ["$brokerage", 0],
              },
            ],
          },
        },
        totalTrades: { $sum: 1 },
        totalLots: { $sum: { $toInt: "$Quantity" } },
      },
    },
    {
      $group: {
        _id: "$_id.dayOfWeek",
        totalGpnl: { $sum: "$totalGpnl" },
        totalBrokerage: { $sum: "$totalBrokerage" },
        totalNpnl: { $sum: "$totalNpnl" },
        totalTrades: { $sum: "$totalTrades" },
        totalLots: { $sum: "$totalLots" },
        distinctDays: { $addToSet: "$_id.date" },
        profitDaysNpnl: {
          $sum: {
            $cond: [{ $gt: ["$totalNpnl", 0] }, "$totalNpnl", 0],
          },
        },
        lossDaysNpnl: {
          $sum: {
            $cond: [{ $lt: ["$totalNpnl", 0] }, "$totalNpnl", 0],
          },
        },
        profitDaysCount: {
          $sum: {
            $cond: [{ $gt: ["$totalNpnl", 0] }, 1, 0],
          },
        },
        lossDaysCount: {
          $sum: {
            $cond: [{ $lt: ["$totalNpnl", 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: { $arrayElemAt: [daysOfWeek, { $subtract: ["$_id", 1] }] },
        totalGpnl: 1,
        totalBrokerage: 1,
        totalNpnl: 1,
        profitDaysCount: 1,
        lossDaysCount: 1,
        totalTrades: 1,
        weekDayNo: "$_id",
        // noOfWeekDays: { $arrayElemAt: [dayCounts, { $subtract: ["$_id", 1] }] },
        avgGpnl: { $divide: ["$totalGpnl", { $size: "$distinctDays" }] },
        avgBrokerage: {
          $divide: ["$totalBrokerage", { $size: "$distinctDays" }],
        },
        avgNpnl: { $divide: ["$totalNpnl", { $size: "$distinctDays" }] },
        avgLots: { $divide: ["$totalLots", { $size: "$distinctDays" }] },
        averageProfit: {
          $cond: [
            { $gt: ["$profitDaysCount", 0] },
            { $divide: ["$profitDaysNpnl", "$profitDaysCount"] },
            0,
          ],
        },
        averageLoss: {
          $cond: [
            { $gt: ["$lossDaysCount", 0] },
            { $divide: ["$lossDaysNpnl", "$lossDaysCount"] },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        totalGpnl: { $divide: ["$totalGpnl", len] },
        totalBrokerage: { $divide: ["$totalBrokerage", len] },
        totalNpnl: { $divide: ["$totalNpnl", len] },
        totalTrades: { $divide: ["$totalTrades", len] },
        avgGpnl: { $divide: ["$avgGpnl", len] },
        avgBrokerage: { $divide: ["$avgBrokerage", len] },
        avgNpnl: { $divide: ["$avgNpnl", len] },
        avgLots: { $divide: ["$avgLots", len] },
        averageProfit: { $divide: ["$averageProfit", len] },
        averageLoss: { $divide: ["$averageLoss", len] },
      },
    },
    {
      $sort: { weekDayNo: 1 },
    },
  ]);

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getPaperTradesOverallStats = async (req, res) => {
  let { id } = req.params;
  const { to, from } = req.query;
  const thirdParty = req.query.thirdParty ?? "false";
  const TradeModel = thirdParty == "true" ? ThirdPartyTrades : PaperTrade;
  if (req.query?.user && req.query.user != "undefined") {
    id = req.query?.user;
  }
  let usersArray = [id];
  if (id == "team") {
    usersArray = [
      "6666994093c01d363f79419e",
      "6666997a93c01d363f79419f",
      "6666c69193c01d363f7941a2",
      "6666c6cb93c01d363f7941a3",
    ];
  }
  const len = usersArray.length;
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  const countWeekdays = (startDate, endDate) => {
    let count = 0;
    const curDate = new Date(startDate);
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip Sundays (0) and Saturdays (6)
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };
  // Calculate the total number of calendar days in the date range
  const totalCalendarDays =
    Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
  let holidayCount = 0;
  const holidays = await TradingHoliday.find({
    $and: [
      { holidayDate: { $gt: fromDate } },
      { holidayDate: { $lt: toDate } },
    ],
  }).select("holidayDate");
  for (let holiday of holidays) {
    if (
      new Date(holiday?.holidayDate) != 0 &&
      new Date(holiday?.holidayDate) != 6
    ) {
      holidayCount += 1;
    }
  }
  const totalWeekDays = countWeekdays(fromDate, toDate);
  const totalMarketDays = totalWeekDays - holidayCount;

  let pnlDetails = await TradeModel.aggregate([
    {
      $match: {
        trade_time: { $gte: fromDate, $lte: toDate },
        trader: { $in: usersArray.map((id) => new ObjectId(id)) },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } },
        },
        totalGpnl: { $sum: { $multiply: ["$amount", -1] } },
        totalBrokerage: { $sum: "$brokerage" },
        totalNpnl: {
          $sum: {
            $subtract: [
              { $multiply: ["$amount", -1] },
              {
                $ifNull: ["$brokerage", 0],
              },
            ],
          },
        },
        totalTrades: { $sum: 1 },
        totalLots: { $sum: { $toInt: "$Quantity" } },
      },
    },
    {
      $group: {
        _id: null,
        totalGpnl: { $sum: "$totalGpnl" },
        totalBrokerage: { $sum: "$totalBrokerage" },
        totalNpnl: { $sum: "$totalNpnl" },
        totalTrades: { $sum: "$totalTrades" },
        totalLots: { $sum: "$totalLots" },
        distinctDays: { $sum: 1 },
        profitDaysNpnl: {
          $sum: {
            $cond: [{ $gt: ["$totalNpnl", 0] }, "$totalNpnl", 0],
          },
        },
        lossDaysNpnl: {
          $sum: {
            $cond: [{ $lt: ["$totalNpnl", 0] }, "$totalNpnl", 0],
          },
        },
        profitDaysCount: {
          $sum: {
            $cond: [{ $gt: ["$totalNpnl", 0] }, 1, 0],
          },
        },
        lossDaysCount: {
          $sum: {
            $cond: [{ $lt: ["$totalNpnl", 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalGpnl: 1,
        totalBrokerage: 1,
        totalNpnl: 1,
        totalTrades: 1,
        totalLots: 1,
        totalTradingDays: "$distinctDays",
        totalCalendarDays: totalCalendarDays,
        avgGpnl: { $divide: ["$totalGpnl", "$distinctDays"] },
        avgBrokerage: { $divide: ["$totalBrokerage", "$distinctDays"] },
        avgNpnl: { $divide: ["$totalNpnl", "$distinctDays"] },
        averageProfit: {
          $cond: [
            { $gt: ["$profitDaysCount", 0] },
            { $divide: ["$profitDaysNpnl", "$profitDaysCount"] },
            0,
          ],
        },
        averageLoss: {
          $cond: [
            { $gt: ["$lossDaysCount", 0] },
            { $divide: ["$lossDaysNpnl", "$lossDaysCount"] },
            0,
          ],
        },
        noOfProfitDays: "$profitDaysCount",
        noOfLossDays: "$lossDaysCount",
      },
    },
    {
      $addFields: {
        totalGpnl: { $divide: ["$totalGpnl", len] },
        totalBrokerage: { $divide: ["$totalBrokerage", len] },
        totalNpnl: { $divide: ["$totalNpnl", len] },
        totalTrades: { $divide: ["$totalTrades", len] },
        totalLots: { $divide: ["$totalLots", len] },
        avgGpnl: { $divide: ["$avgGpnl", len] },
        avgBrokerage: { $divide: ["$avgBrokerage", len] },
        avgNpnl: { $divide: ["$avgNpnl", len] },
        averageProfit: { $divide: ["$averageProfit", len] },
        averageLoss: { $divide: ["$averageLoss", len] },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { ...pnlDetails[0], totalCalendarDays, totalMarketDays },
  });
};

exports.setCurrentUser = async (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.getPaperTradesDailyPnlData = async (req, res, next) => {
  const { id } = req.params;
  let today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  //console.log("Select Date in the API: "+selectDate,traderName)
  const pipeline = [
    {
      $match: {
        trade_time: { $gte: yesterday, $lte: today },
        trader: new ObjectId(id),
      },
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: {
              $convert: {
                input: "$timestamp",
                to: "date",
              },
            },
          },
        },
        calculatedGpnl: 1,
        noOfTrades: 1,
        traderName: 1,
      },
    },
    {
      $group: {
        _id: { date: "$date", traderName: "$traderName" },

        pnl: {
          $sum: "$calculatedGpnl",
        },
        trades: {
          $sum: "$noOfTrades",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  let x = await TraderDailyPnlData.aggregate(pipeline);

  res.status(200).json({ status: "success", data: x });
};

exports.getPaperTradesMonthlyPnlData = async (req, res, next) => {
  let { id } = req.params;
  const thirdParty = req.query.thirdParty ?? "false";
  const TradeModel = thirdParty == "true" ? ThirdPartyTrades : PaperTrade;
  if (req.query?.user && req.query.user != "undefined") {
    id = req.query?.user;
  }
  let usersArray = [id];
  if (id == "team") {
    usersArray = [
      "6666994093c01d363f79419e",
      "6666997a93c01d363f79419f",
      "6666c69193c01d363f7941a2",
      "6666c6cb93c01d363f7941a3",
    ];
  }
  const len = usersArray.length;
  const today = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(today.getFullYear() - 1);
  // console.log(pastYear,today);
  let pnlDetails = await TradeModel.aggregate([
    {
      $match: {
        trade_time: { $gte: pastYear, $lte: today },
        trader: { $in: usersArray.map((id) => new ObjectId(id)) },
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 7] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    {
      $addFields: {
        gpnl: { $divide: ["$gpnl", len] },
        brokerage: { $divide: ["$brokerage", len] },
        npnl: { $divide: ["$npnl", len] },
        lots: { $divide: ["$lots", len] },
        noOfTrade: { $divide: ["$noOfTrade", len] },
      },
    },
    { $sort: { date: 1 } },
  ]);

  // //console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getInfinityTradesOverview = async (req, res, next) => {
  let userId = req.params.id;
  let today = new Date();
  // const yesterday = new Date();
  // yesterday.setDate(today.getDate()-1);
  const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const pastYear = new Date(today.getFullYear(), 0, 1);

  let date = new Date();
  let getYesterdaydate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  getYesterdaydate = getYesterdaydate + "T00:00:00.000Z";
  const yesterday = new Date(getYesterdaydate);

  // console.log("in overview", yesterday, userId, pastMonth, pastYear)
  let infinityTradesOverview = await InfinityTrade.aggregate([
    {
      $match: {
        trader: new ObjectId(userId),
        // trade_time:{$lte: today},
        status: "COMPLETE",
        // Replace with the actual user ID
      },
    },
    {
      $group: {
        _id: null,
        grossPNLDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", yesterday], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          }, // Calculate gross PNL as sum of amount for today's date
        },
        brokerageSumDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", yesterday], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          }, // Calculate brokerage sum as sum of brokerage for today's date
        },
        grossPNLMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastMonth], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastMonth], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastYear], // Filter for past year's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastYear], // Filter for past year's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLLifetime: {
          $sum: {
            $multiply: ["$amount", -1],
          }, // Calculate gross PNL as sum of amount for all-time data
        },

        brokerageSumLifetime: {
          $sum: "$brokerage", // Calculate brokerage sum as sum of brokerage for all-time data
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        grossPNLDaily: 1,
        brokerageSumDaily: 1,
        netPNLDaily: {
          $subtract: ["$grossPNLDaily", "$brokerageSumDaily"], // Calculate net PNL as sum of gross PNL and brokerage sum for today's date data
        },
        grossPNLMonthly: 1,
        brokerageSumMonthly: 1,
        netPNLMonthly: {
          $subtract: ["$grossPNLMonthly", "$brokerageSumMonthly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past month data
        },
        grossPNLYearly: 1,
        brokerageSumYearly: 1,
        netPNLYearly: {
          $subtract: ["$grossPNLYearly", "$brokerageSumYearly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past year data
        },
        grossPNLLifetime: 1,
        brokerageSumLifetime: 1,
        netPNLLifetime: {
          $subtract: ["$grossPNLLifetime", "$brokerageSumLifetime"], // Calculate net PNL as sum of gross PNL and brokerage sum for lifetime data
        },
        count: 1,
      },
    },
  ]);
  // console.log(infinityTradesOverview);

  res.status(200).json({ status: "success", data: infinityTradesOverview });
};

exports.getTenXTradersOverview = async (req, res, next) => {
  let userId = req.params.id;
  let today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const pastYear = new Date(today.getFullYear(), 0, 1);

  let TenXTradersOverview = await TenXTrader.aggregate([
    {
      $match: {
        trader: new ObjectId(userId),
        // trade_time:{$lte: today},
        status: "COMPLETE",
        // Replace with the actual user ID
      },
    },
    {
      $group: {
        _id: null,
        grossPNLDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", yesterday], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          }, // Calculate gross PNL as sum of amount for today's date
        },
        brokerageSumDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", yesterday], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          }, // Calculate brokerage sum as sum of brokerage for today's date
        },
        grossPNLMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", pastMonth], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", pastMonth], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", pastYear], // Filter for past year's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time_utc", pastYear], // Filter for past year's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLLifetime: {
          $sum: {
            $multiply: ["$amount", -1],
          }, // Calculate gross PNL as sum of amount for all-time data
        },
        brokerageSumLifetime: {
          $sum: "$brokerage", // Calculate brokerage sum as sum of brokerage for all-time data
        },
      },
    },
    {
      $project: {
        _id: 0,
        grossPNLDaily: 1,
        brokerageSumDaily: 1,
        netPNLDaily: {
          $subtract: ["$grossPNLDaily", "$brokerageSumDaily"], // Calculate net PNL as sum of gross PNL and brokerage sum for today's date data
        },
        grossPNLMonthly: 1,
        brokerageSumMonthly: 1,
        netPNLMonthly: {
          $subtract: ["$grossPNLMonthly", "$brokerageSumMonthly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past month data
        },
        grossPNLYearly: 1,
        brokerageSumYearly: 1,
        netPNLYearly: {
          $subtract: ["$grossPNLYearly", "$brokerageSumYearly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past year data
        },
        grossPNLLifetime: 1,
        brokerageSumLifetime: 1,
        netPNLLifetime: {
          $subtract: ["$grossPNLLifetime", "$brokerageSumLifetime"], // Calculate net PNL as sum of gross PNL and brokerage sum for lifetime data
        },
      },
    },
  ]);
  // console.log(infinityTradesOverview);

  res.status(200).json({ status: "success", data: TenXTradersOverview });
};

exports.getInfinityTradesDateWiseStats = async (req, res) => {
  const { id } = req.params;
  const { to, from } = req.query;
  let date = new Date();
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  let pnlDetails = await InfinityTrade.aggregate([
    {
      $match: {
        trade_time: { $gte: fromDate, $lte: toDate },
        trader: new ObjectId(id),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 10] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getTenXTradersDateWiseStats = async (req, res) => {
  const { id } = req.params;
  const { to, from } = req.query;
  let date = new Date();
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  let pnlDetails = await TenXTrader.aggregate([
    {
      $match: {
        trade_time_utc: { $gte: fromDate, $lte: toDate },
        trader: new ObjectId(id),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time_utc", 0, 10] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time_utc", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
        count: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getInfinityTradesMonthlyPnlData = async (req, res, next) => {
  const { id } = req.params;
  const today = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(today.getFullYear() - 1);
  // console.log(pastYear,today);
  let pnlDetails = await InfinityTrade.aggregate([
    {
      $match: {
        trade_time: { $gte: pastYear, $lte: today },
        trader: new ObjectId(id),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 7] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // //console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getTenXTradersMonthlyPnlData = async (req, res, next) => {
  const { id } = req.params;
  const today = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(today.getFullYear() - 1);
  // console.log(pastYear,today);
  let pnlDetails = await TenXTrader.aggregate([
    {
      $match: {
        trade_time_utc: { $gte: pastYear, $lte: today },
        trader: new ObjectId(id),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time_utc", 0, 7] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time_utc", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // //console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};

exports.getInternshipTradersOverview = async (req, res, next) => {
  let userId = req.params.id;
  let batchId = req.params.batchId;
  let today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const pastYear = new Date(today.getFullYear(), 0, 1);

  let InternshipTradersOverview = await InternshipTrader.aggregate([
    {
      $match: {
        trader: new ObjectId(userId),
        // trade_time:{$lte: today},
        status: "COMPLETE",
        batch: new ObjectId(batchId),
        // Replace with the actual user ID
      },
    },
    {
      $group: {
        _id: null,
        grossPNLDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", yesterday], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          }, // Calculate gross PNL as sum of amount for today's date
        },
        brokerageSumDaily: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", yesterday], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          }, // Calculate brokerage sum as sum of brokerage for today's date
        },
        grossPNLMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastMonth], // Filter for past month's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumMonthly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastMonth], // Filter for past month's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastYear], // Filter for past year's data
              },
              {
                $multiply: ["$amount", -1],
              },
              0,
            ],
          },
        },
        brokerageSumYearly: {
          $sum: {
            $cond: [
              {
                $gte: ["$trade_time", pastYear], // Filter for past year's data
              },
              "$brokerage",
              0,
            ],
          },
        },
        grossPNLLifetime: {
          $sum: {
            $multiply: ["$amount", -1],
          }, // Calculate gross PNL as sum of amount for all-time data
        },
        brokerageSumLifetime: {
          $sum: "$brokerage", // Calculate brokerage sum as sum of brokerage for all-time data
        },
      },
    },
    {
      $project: {
        _id: 0,
        grossPNLDaily: 1,
        brokerageSumDaily: 1,
        netPNLDaily: {
          $subtract: ["$grossPNLDaily", "$brokerageSumDaily"], // Calculate net PNL as sum of gross PNL and brokerage sum for today's date data
        },
        grossPNLMonthly: 1,
        brokerageSumMonthly: 1,
        netPNLMonthly: {
          $subtract: ["$grossPNLMonthly", "$brokerageSumMonthly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past month data
        },
        grossPNLYearly: 1,
        brokerageSumYearly: 1,
        netPNLYearly: {
          $subtract: ["$grossPNLYearly", "$brokerageSumYearly"], // Calculate net PNL as sum of gross PNL and brokerage sum for past year data
        },
        grossPNLLifetime: 1,
        brokerageSumLifetime: 1,
        netPNLLifetime: {
          $subtract: ["$grossPNLLifetime", "$brokerageSumLifetime"], // Calculate net PNL as sum of gross PNL and brokerage sum for lifetime data
        },
      },
    },
  ]);
  // console.log(infinityTradesOverview);

  res.status(200).json({ status: "success", data: InternshipTradersOverview });
};

exports.getInternshipTradersDateWiseStats = async (req, res) => {
  const { id } = req.params;
  let batchId = req.params.batchId;
  const { to, from } = req.query;
  let date = new Date();
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  let pnlDetails = await InternshipTrader.aggregate([
    {
      $match: {
        trade_time: { $gte: fromDate, $lte: toDate },
        trader: new ObjectId(id),
        batch: new ObjectId(batchId),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 10] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
        count: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};
exports.getInternshipTradersMonthlyPnlData = async (req, res, next) => {
  const { id } = req.params;
  let batchId = req.params.batchId;
  const today = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(today.getFullYear() - 1);
  // console.log(pastYear,today);
  let pnlDetails = await InternshipTrader.aggregate([
    {
      $match: {
        trade_time: { $gte: pastYear, $lte: today },
        trader: new ObjectId(id),
        batch: new ObjectId(batchId),
        status: "COMPLETE",
      },
    },

    {
      $group: {
        _id: {
          date: { $substr: ["$trade_time", 0, 7] },
        },
        // buyOrSell: "$buyOrSell",
        // date: {$substr:["$trade_time", 0, 10]},
        gpnl: {
          $sum: { $multiply: ["$amount", -1] },
        },
        amount: {
          $sum: "$amount",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        lots: {
          $sum: { $toInt: "$Quantity" },
        },
        noOfTrade: {
          $count: {},
          // average_price: "$average_price"
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        gpnl: 1,
        brokerage: 1,
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        lots: 1,
        noOfTrade: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  // //console.log(pnlDetails)

  res.status(200).json({ status: "success", data: pnlDetails });
};
