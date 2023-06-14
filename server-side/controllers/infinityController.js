const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTraderCompany = require("../models/mock-trade/infinityTradeCompany");
const InfinityTradeCompanyLive = require('../models/TradeDetails/liveTradeSchema')
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../marketData/redisClient');
const User = require("../models/User/userDetailSchema");
const InfinityTraderLive = require("../models/TradeDetails/infinityLiveUser")


exports.overallPnlTrader = async (req, res, next) => {
  let isRedisConnected = getValue();
  const userId = req.user._id;
  // const userId = new ObjectId('642cedb5a7aa9b00ba1e4866');
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);


  try {

    if (isRedisConnected && await client.exists(`${req.user._id.toString()} overallpnl`)) {
      let pnl = await client.get(`${req.user._id.toString()} overallpnl`)
      pnl = JSON.parse(pnl);
      // console.log("pnl redis", pnl)

      res.status(201).json({ message: "pnl received", data: pnl });

    } else {

      let pnlDetails = await InfinityTrader.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            },
            status: "COMPLETE",
            trader: new ObjectId(userId)
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
              exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange"
            },
            amount: {
              $sum: { $multiply: ["$amount", -1] },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      // console.log("pnlDetails in else", pnlDetails)

      if (isRedisConnected) {
        await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnlDetails))
        await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);
      }

      // console.log("pnlDetails", pnlDetails)
      res.status(201).json({ message: "pnl received", data: pnlDetails });
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.overallPnlTraderWise = async (req, res, next) => {
  const traderId = req.params.trader
  let isRedisConnected = getValue();
  const userId = req.user._id;
  // const userId = new ObjectId('642cedb5a7aa9b00ba1e4866');
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);

  console.log(traderId)

  try {

    // if (isRedisConnected && await client.exists(`${req.user._id.toString()} overallpnl`)) {
    //   let pnl = await client.get(`${req.user._id.toString()} overallpnl`)
    //   pnl = JSON.parse(pnl);
    //   // console.log("pnl redis", pnl)

    //   res.status(201).json({ message: "pnl received", data: pnl });

    // } else {

      let pnlDetails = await InfinityTrader.aggregate([
        {
          $match: {
            trade_time: {
              $gte: today
            },
            status: "COMPLETE",
            trader: new ObjectId(traderId)
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange"
            },
            amount: {
              $sum: { $multiply: ["$amount", -1] },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      // console.log("pnlDetails in else", pnlDetails)

      // if (isRedisConnected) {
      //   await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnlDetails))
      //   await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);
      // }

      // console.log("pnlDetails", pnlDetails)
      res.status(201).json({ message: "pnl received", data: pnlDetails });
    // }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }
}

exports.overallPnlCompanySide = async (req, res, next) => {

  const userId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(userId, today)
  let pnlDetails = await InfinityTraderCompany.aggregate([
    {
      $match: {
        trade_time: {
          $gte: today
        },
        status: "COMPLETE",
        trader: new ObjectId(userId)
      },
    },
    {
      $group: {
        _id: {
          symbol: "$symbol",
          product: "$Product",
          instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
          exchange: "$exchange"
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        trades: {
          $count: {}
        },
        lastaverageprice: {
          $last: "$average_price",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ])
  res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.overallCompanySidePnl = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InfinityTraderCompany.aggregate([
      {
        $lookup: {
          from: 'algo-tradings',
          localField: 'algoBox',
          foreignField: '_id',
          as: 'result'
        }
      },
      {
        $match: {
          trade_time: {
            $gte: today
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE",
          "result.isDefault": true
        },
      },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            turnover: {
              $sum: {
                $toInt: { $abs : "$amount"},
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            totallots: {
              $sum: {
                $toInt: { $abs : "$Quantity"},
              },
            },
            trades: {
              $count:{}
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.mockLiveTotalTradersCount = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InfinityTraderCompany.aggregate([
      {
        $match: {
          trade_time: {
            $gte: today
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE"
        }
      },
      {
        $group: {
          _id: {
            trader: "$trader"
          },
          runninglots: {
            $sum: "$Quantity"
          }
        }
      },
      {
        $group: {
          _id: null,
          zeroLotsTraderCount: {
            $sum: {
              $cond: [{ $eq: ["$runninglots", 0] }, 1, 0]
            }
          },
          nonZeroLotsTraderCount: {
            $sum: {
              $cond: [{ $ne: ["$runninglots", 0] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          zeroLotsTraderCount: 1,
          nonZeroLotsTraderCount: 1
        }
      }
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.myTodaysTrade = async (req, res, next) => {

  // const id = req.params.id
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTrader.countDocuments({ trader: new ObjectId(userId), trade_time: { $gte: today } })
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InfinityTrader.find({ trader: new ObjectId(userId), trade_time: { $gte: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.myAllTodaysTrade = async (req, res, next) => {

  // const id = req.params.id
  const userId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log("Under my today orders", userId, today)
  try {
    const myTodaysTrade = await InfinityTrader.find({ trader: new ObjectId(userId), trade_time: { $gte: today } })
      .populate('trader', 'name')
      .select('symbol buyOrSell Product Quantity amount status average_price trade_time order_id brokerage trader')
      .sort({ _id: -1 })
    // console.log(myTodaysTrade)
    res.status(200).json({ status: 'success', data: myTodaysTrade });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.myHistoryTrade = async (req, res, next) => {

  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5
  const count = await InfinityTrader.countDocuments({ trader: userId, trade_time: { $lt: today } })
  // console.log("Under history orders", skip, limit)
  try {
    const myHistoryTrade = await InfinityTrader.find({ trader: new ObjectId(userId), trade_time: { $lt: today } }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res.status(200).json({ status: 'success', data: myHistoryTrade, count: count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

exports.getPnlAndCreditData = async (req, res, next) => {
  let date = new Date();
  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let firstDayOfMonthDate = `${(firstDayOfMonth.getFullYear())}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
  let lastDayOfMonthDate = `${(lastDayOfMonth.getFullYear())}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
  lastDayOfMonthDate = new Date(lastDayOfMonthDate);
  firstDayOfMonthDate = new Date(firstDayOfMonthDate);

  let pnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
        status: "COMPLETE",
      }
    },
    {
      $group: {
        _id: {
          trader: "$trader",
          employeeId: {
            $arrayElemAt: ["$result.employeeid", 0],
          },
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
      {
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        availableMargin: {
          $add: ["$_id.funds", { $subtract: ["$gpnl", "$brokerage"] }]
        }
      },
    },
    {
      $project:
      {
        _id: 0,
        // userId: "$_id.userId",
        employeeId: "$_id.employeeId",
        totalCredit: "$_id.funds",
        gpnl: "$gpnl",
        brokerage: "$brokerage",
        npnl: "$npnl",
        availableMargin: "$availableMargin"
      },
    },
    {
      $sort: { npnl: 1 }
    }
  ])

  res.status(201).json({ message: "data received", data: pnlAndCreditData });
}

exports.getMyPnlAndCreditData = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  // todayDate = "2023-05-19" + "T00:00:00.000Z";
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let myPnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
        status: "COMPLETE",
        trader: new ObjectId(req.user._id),
        trade_time: {
          $lt: today
        }
      }
    },
    {
      $group: {
        _id: {

          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
      {
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        availableMargin: {
          $add: ["$_id.funds", { $subtract: ["$gpnl", "$brokerage"] }]
        }
      },
    },
    {
      $project:
      {
        _id: 0,
        totalFund: "$_id.funds",
        gpnl: "$gpnl",
        brokerage: "$brokerage",
        npnl: "$npnl",
        openingBalance: "$availableMargin"
      },
    },
    {
      $sort: { npnl: 1 }
    }
  ])

  if (myPnlAndCreditData.length > 0) {
    res.status(201).json({ message: "data received", data: myPnlAndCreditData[0] });
  } else {
    const data = await User.findById(req.user._id).select('fund');
    const respData = { "totalFund": data.fund };
    //res.status(201).json({message: "data received", data: fundDetail[0]});
    res.status(201).json({ message: "data received", data: respData });
  }


}

exports.openingBalance = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(req.user._id)
  let myPnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
        status: "COMPLETE",
        trader: new ObjectId(req.user._id),
        trade_time: { $lt: today }
      }
    },
    {
      $group: {
        _id: {
          // trader: "$trader",
          // employeeId: {
          //   $arrayElemAt: ["$result.employeeid", 0],
          // },
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
      {
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        availableMargin: {
          $add: ["$_id.funds", { $subtract: ["$gpnl", "$brokerage"] }]
        }
      },
    },
    {
      $project:
      {
        _id: 0,
        // userId: "$_id.userId",
        // employeeId: "$_id.employeeId",
        totalCredit: "$_id.funds",
        gpnl: "$gpnl",
        brokerage: "$brokerage",
        npnl: "$npnl",
        availableMargin: "$availableMargin"
      },
    },
    {
      $sort: { npnl: 1 }
    }
  ])

  // console.log("myPnlAndCreditData", myPnlAndCreditData)

  res.status(201).json({ message: "data received", data: myPnlAndCreditData[0] });
}

exports.batchWisePnl = async (req, res, next) => {

  let batchwisepnl = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "zyx",
      },
    },
    {
      $project: {
        designation: {
          $arrayElemAt: ["$zyx.designation", 0],
        },
        dojWeekNumber: {
          $week: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        BatchYear: {
          $year: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        weekNumber: {
          $week: {
            $toDate: "$trade_time",
          },
        },
        Year: {
          $year: {
            $toDate: "$trade_time",
          },
        },
        doj: {
          $arrayElemAt: ["$zyx.joining_date", 0],
        },
        trader: "$createdBy",
        amount: "$amount",
        lots: "$Quantity",
        date: "$trade_time",
        status: "$status",
        userId: "$userId",
        email: {
          $arrayElemAt: ["$zyx.email", 0],
        },
      },
    },
    {
      $match: {
        status: "COMPLETE",
        designation: "Equity Trader",
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$dojWeekNumber",
          BatchYear: "$BatchYear",
          WeekNumber: "$weekNumber",
          Year: "$Year",
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        count: {
          $push: "$userId",
        },
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$_id.BatchWeek",
          BatchYear: "$_id.BatchYear",
          WeekNumber: "$_id.WeekNumber",
          Year: "$_id.Year",
          gpnl: "$gpnl",
        },
        noOfTraders: {
          $sum: {
            $size: {
              $setUnion: "$count",
            },
          },
        },
      },
    },
    {
      $sort: {
        "_id.Year": 1,
        "_id.WeekNumber": 1,
        "_id.BatchYear": 1,
        "_id.Batch": 1,
      },
    },
    {
      $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       */
      {
        Batch: {
          $add: [
            {
              $toInt: "$_id.BatchWeek",
            },
            {
              $toInt: "$_id.BatchYear",
            },
          ],
        },
      },
    },
  ])

  res.status(201).json({ message: "data received", data: batchwisepnl });
}

exports.companyDailyPnlTWise = async (req, res, next) => {

  let { startDate, endDate } = req.params
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let pipelineCommulative = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  let cumulative = await InfinityTraderCompany.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.companyDailyPnlTWiseSingleUser = async (req, res, next) => {

  let { startDate, endDate, userId } = req.params
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        trader: new ObjectId(userId)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let pipelineCommulative = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$lte: new Date(endDate) },
        status: "COMPLETE",
        trader: new ObjectId(userId)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  let cumulative = await InfinityTraderCompany.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.companyPnlReport = async (req, res, next) => {

  let { startDate, endDate } = req.params

  startDate = new Date(startDate + "T00:00:00.000Z");
  endDate = new Date(endDate + "T23:59:59.000Z");


  let pipeline = [
    {
      $match: {
        trade_time: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: "COMPLETE",
      },
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          date: {
            $substr: ["$trade_time", 0, 10],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        noOfTrade: {
          $count: {},
        },
      },
    },
    {
      $addFields: {
        date: "$_id.date",
        npnl: {
          $subtract: ["$gpnl", "$brokerage"],
        },
        dayOfWeek: {
          $dayOfWeek: {
            $toDate: "$_id.date",
          },
        },
      },
    },
    {
      $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: 0,
        gpnl: 1,
        brokerage: 1,
        npnl: 1,
        dayOfWeek: 1,
        noOfTrade: 1,
        date: 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]

  async function getCumulativeData(date){
    console.log(date)
    let pipelineCommulative = [
      {
        $match: {
          trade_time: {
            // $gte: new Date(startDate),
            $lte: (date),
          },
          status: "COMPLETE",
        },
        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
      },
      {
        $group: {
          _id: {
            // date: {
            //   $substr: ["$trade_time", 0, 10],
            // },
          },
          gpnl: {
            $sum: {
              $multiply: ["$amount", -1],
            },
          },
          brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          noOfTrade: {
            $count: {},
          },
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: date } },
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          dayOfWeek: {
            $dayOfWeek: {
              $toDate: date,
            },
          },
        },
      },
      {
        $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          _id: 0,
          gpnl: 1,
          brokerage: 1,
          npnl: 1,
          dayOfWeek: 1,
          noOfTrade: 1,
          date: 1,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]
    let cumulative = await InfinityTraderCompany.aggregate(pipelineCommulative)
    console.log(cumulative)
    return cumulative[0];
  }

  const result = [];
  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    // const currentPipeline = JSON.parse(JSON.stringify(pipelineTemplate)); // Deep copy the pipeline template
    // currentPipeline[0].$match.trade_time.$gte = currentDate;
    // currentPipeline[0].$match.trade_time.$lte = currentDate;
    
    // Execute the current pipeline and store the result
    const currentResult = await getCumulativeData(currentDate); // Replace this with your code to execute the aggregation pipeline
    
    result.push(currentResult);
  }

  

  let x = await InfinityTraderCompany.aggregate(pipeline)

  res.status(201).json({ message: "data received", data: x, cumulative: result });
}

exports.traderPnlTWise = async (req, res, next) => {

  let { startDate, endDate } = req.params
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let pipelineCommulative = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let x = await InfinityTrader.aggregate(pipeline)
  let cumulative = await InfinityTrader.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.traderPnlTWiseSingleUser = async (req, res, next) => {

  let { startDate, endDate, userId } = req.params
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE",
        trader: new ObjectId(userId)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let pipelineCommulative = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $match: {
        trade_time: {$lte: new Date(endDate) },
        status: "COMPLETE",
        trader: new ObjectId(userId)
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group: {
        _id: {
          userId: "$trader",
          name: {
            $concat: [
              { $arrayElemAt: ["$user.first_name", 0] },
              " ",
              { $arrayElemAt: ["$user.last_name", 0] },
            ],
          },
        },
        gpnl: { $sum: { $multiply: ["$amount", -1] } },
        brokerage: { $sum: { $toDouble: "$brokerage" } },
        trades: { $count: {} },
        tradingDays: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$trade_time" } } },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id.userId",
        name: "$_id.name",
        tradingDays: { $size: "$tradingDays" },
        gpnl: 1,
        brokerage: 1,
        npnl: { $subtract: ["$gpnl", "$brokerage"] },
        noOfTrade: "$trades"
      },
    },
    {
      $sort:
        { npnl: -1 }
    }
  ]

  let x = await InfinityTrader.aggregate(pipeline)
  let cumulative = await InfinityTrader.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.traderMatrixPnl = async (req, res, next) => {

  let { startDate, endDate } = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        trade_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group:
      {
        _id: { createdBy: "$user.name", trade_time: { $substr: ["$trade_time", 0, 10] } },

        gpnl: {
          $sum: { $multiply: ["$amount", -1] }
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" }
        },
        noOfTrade: {
          $count: {}
        },
      }
    },
    {
      $addFields:
      {
        npnl: { $subtract: ["$gpnl", "$brokerage"] }
      }
    },
    {
      $sort:
        { gpnl: -1 }
    }
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)

  // res.status(201).json(x);

  res.status(201).json({ message: "data received", data: x });
}

exports.traderwiseReport = async (req, res, next) => {

  let { startDate, endDate } = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


  let pipeline = [

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        trade_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: "COMPLETE"
      }
      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    {
      $group:
      {
        _id: { createdBy: "$user.name", trade_time: { $substr: ["$trade_time", 0, 10] } },

        gpnl: {
          $sum: { $multiply: ["$amount", -1] }
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" }
        },
        trades: {
          $count: {}
        },
      }
    },
    {
      $addFields:
      {
        npnl: { $subtract: ["$gpnl", "$brokerage"] }
      }
    },
    {
      $sort:
        { gpnl: -1 }
    }
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallPnlAllTrader = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const pipeline = [
    {
      $match: {
        trade_time: {
          $gte: today
        },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          symbol: "$symbol",
          product: "$Product",
          instrumentToken: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        lastaverageprice: {
          $last: "$average_price",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]

  let x = await InfinityTrader.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.treaderWiseMockTrader = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const pipeline = [
    {
      $match:
      {
        trade_time: {
          $gte: today
        },
        status: "COMPLETE"
      }
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
      $group:
      {
        _id:
        {
          "traderId": "$trader",
          "traderName": {
            $arrayElemAt: ["$user.name", 0]
          },
                    "symbol": "$instrumentToken",
          "exchangeInstrumentToken": "$exchangeInstrumentToken"
          // "algoId": {
          //   $arrayElemAt: ["$algoBox._id", 0]
          // },
          // "algoName": {
          //   $arrayElemAt: ["$algoBox.algoName", 0]
          // }
        },
        amount: {
          $sum: { $multiply: ["$amount", -1] }
        },
        brokerage: {
          $sum: { $toDouble: "$brokerage" }
        },
        lots: {
          $sum: { $toInt: "$Quantity" }
        },
        trades: {
          $count: {}
        },
        lotUsed: {
          $sum: { $abs: { $toInt: "$Quantity" } }
        }
      }
    },
    { $sort: { _id: -1 } },

  ]

  let x = await InfinityTrader.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.mockBatchToday = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const pipeline = [
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project: {
        trade_time: 1,
        status: 1,
        cohort: {
          $arrayElemAt: ["$userDetails.cohort", 0],
        },
      },
    },
    {
      $match: {
        trade_time: {
          $gte: today
        },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          cohort: "$cohort",
        },
        trades: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]

  let x = await InfinityTrader.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallPnlBatchWiseMock = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const batchName = req.params.batchname;

  const pipeline = [
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project:
      {
        symbol: 1,
        Product: 1,
        trade_time: 1,
        status: 1,
        instrumentToken: 1,
        exchangeInstrumentToken: 1,
        amount: 1,
        buyOrSell: 1,
        Quantity: 1,
        brokerage: 1,
        average_price: 1,
        cohort: {
          $arrayElemAt: [
            "$userDetails.cohort",
            0,
          ],
        },
      },
    },
    {
      $match: {
        trade_time: {
          $gte: today,
        },
        status: "COMPLETE",
        cohort: batchName,
      },
    },
    {
      $group: {
        _id: {
          symbol: "$symbol",
          product: "$Product",
          instrumentToken: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
        },
        amount: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        lastaverageprice: {
          $last: "$average_price",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.traderwiseBatchMock = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const batchName = req.params.batchname;

  const pipeline = [
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project: {
        userId: {
          $arrayElemAt: [
            "$userDetails._id",
            0,
          ],
        },
        createdBy: {
          $concat: [
            { $arrayElemAt: ["$userDetails.first_name", 0] },
            " ",
            { $arrayElemAt: ["$userDetails.last_name", 0] }
          ]
        },
        trade_time: 1,
        status: 1,
        traderName: 1,
        instrumentToken: 1,
        exchangeInstrumentToken: 1,
        amount: 1,
        Quantity: 1,
        brokerage: 1,
        cohort: {
          $arrayElemAt: ["$userDetails.cohort", 0],
        },
      },
    },
    {
      $match: {
        trade_time: {
          $gte: today,
        },
        status: "COMPLETE",
        cohort: batchName,
      },
    },
    {
      $group: {
        _id: {
          traderId: "$userId",
          traderName: "$createdBy",
          symbol: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken"
        },
        amount: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
        lots: {
          $sum: {
            $toInt: "$Quantity",
          },
        },
        trades: {
          $count: {},
        },
        lotUsed: {
          $sum: {
            $abs: {
              $toInt: "$Quantity",
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.getLetestMockTradeCompany = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let pipeline = [
    {
      $match: {
        trade_time: {
          $gte: today
        }
      }
    },
    {
      $lookup: {
        from: 'user-personal-details',
        localField: 'trader',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $project: {
        "_id": 0,
        "trade_time": 1,
        createdBy: {
          $concat: [
            { $arrayElemAt: ["$user.first_name", 0] },
            " ",
            { $arrayElemAt: ["$user.last_name", 0] }
          ]
        },
        "buyOrSell": 1,
        "Quantity": 1,
        "symbol": {
          $substr: ["$symbol", { $subtract: [{ $strLenCP: "$symbol" }, 7] }, 7]
        },
        "status": 1
      }
    },
    { $sort: { "trade_time": -1 } },
    { $limit: 1 }
  ];



  let letestLive = await InfinityTraderCompany.aggregate(pipeline)

  res.status(201).json({ message: 'Letest Live Trade.', data: letestLive[0] });
}

exports.getAllMockOrders = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTraderCompany.countDocuments({ trade_time: { $lt: today } })

  try{
    let x = await InfinityTraderCompany.aggregate([
      { $match: {trade_time: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.getAllMockOrdersForToday = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTraderCompany.countDocuments({ trade_time: { $gte: today } })

  try{
    let x = await InfinityTraderCompany.aggregate([
      { $match: {trade_time: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.getAllLiveOrders = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTradeCompanyLive.countDocuments({ trade_time: { $lt: today } })

  try{
    let x = await InfinityTradeCompanyLive.aggregate([
      { $match: {trade_time: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.getAllLiveOrdersForToday = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTradeCompanyLive.countDocuments({ trade_time: { $gte: today } })

  try{
    let x = await InfinityTradeCompanyLive.aggregate([
      { $match: {trade_time: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.getAllTradersLiveOrders = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTraderLive.countDocuments({ trade_time: { $lt: today } })

  try{
    let x = await InfinityTraderLive.aggregate([
      { $match: {trade_time: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }

}

exports.getAllTradersLiveOrdersForToday = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTraderLive.countDocuments({ trade_time: { $gte: today } })

  try{
    let x = await InfinityTraderLive.aggregate([
      { $match: {trade_time: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.getAllTradersMockOrders = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTrader.countDocuments({ trade_time: { $lt: today } })

  try{
    let x = await InfinityTrader.aggregate([
      { $match: {trade_time: { $lt: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }

}

exports.getAllTradersMockOrdersForToday = async (req, res)=>{
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTrader.countDocuments({ trade_time: { $gte: today } })

  try{
    let x = await InfinityTrader.aggregate([
      { $match: {trade_time: { $gte: today } } },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $project: {
          "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1,
          "trade_time": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1,
          "createdBy": {
            $concat: [{
              $arrayElemAt: ["$user.first_name", 0],
            }, " ", {
              $arrayElemAt: ["$user.last_name", 0],
            }]
          },
          // "trader": {
          //   $concat: [{
          //     $arrayElemAt: ["$result.first_name", 0],
          //   }, " ", {
          //     $arrayElemAt: ["$result.last_name", 0],
          //   }]
          // },
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
   
    res.status(200).json({ status: 'success', data: x, count: count });

  }catch(e){
    console.log(e);
  }
}

exports.overallInfinityMockCompanyPnlYesterday = async (req, res, next) => {
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  // console.log(yesterdayDate)
    let yesterdayStartTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayStartTime = yesterdayStartTime + "T00:00:00.000Z";
    let yesterdayEndTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
    const startTime = new Date(yesterdayStartTime); 
    const endTime = new Date(yesterdayEndTime); 
    // console.log("Query Timing: ", startTime, endTime)
    let pnlDetails = await InfinityTraderCompany.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime, $lte: endTime
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE",
        },
      },
        {
          $group: {
            _id: null,
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            turnover: {
              $sum: {
                $toInt: {$abs : "$amount"},
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            totalLots: {
              $sum: {
                $toInt: {$abs : "$Quantity"},
              },
            },
            trades: {
              $count:{}
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.overallInfinityMockCompanyPnlMTD = async (req, res, next) => {
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  // console.log(yesterdayDate)
    let monthStartTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(1).padStart(2, '0')}`
    monthStartTime = monthStartTime + "T00:00:00.000Z";
    let yesterdayEndTime = `${(yesterdayDate.getFullYear())}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`
    yesterdayEndTime = yesterdayEndTime + "T23:59:59.000Z";
    const startTime = new Date(monthStartTime); 
    const endTime = new Date(yesterdayEndTime); 
    // console.log("Query Timing: ", startTime, endTime)
    let pnlDetails = await InfinityTraderCompany.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime, $lte: endTime
            // $gte: new Date("2023-05-26T00:00:00.000+00:00")
          },
          status: "COMPLETE",
        },
      },
        {
          $group: {
            _id: null,
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            turnover: {
              $sum: {
                $toInt: {$abs : "$amount"},
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            totalLots: {
              $sum: {
                $toInt: {$abs : "$Quantity"},
              },
            },
            trades: {
              $count:{}
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      res.status(201).json({ message: "pnl received", data: pnlDetails });
}
exports.getUserReportMockDateWise = async(req, res)=>{
  const {id, startDate, endDate} = req.params;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  
  let pnlDetails = await InfinityTrader.aggregate([
      { $match: { trade_time: {$gte : new Date(startDate), $lte : new Date(`${endDate}T23:59:59`)}, trader: new ObjectId(id), status: "COMPLETE"} },
      
      { $group: { _id: {
                           "date": {$substr: [ "$trade_time", 0, 10 ]},
                              "buyOrSell": "$buyOrSell",
                              "trader" : "$createdBy"
                          },
                  amount: {
                      $sum: "$amount"
                  },
                  brokerage: {
                      $sum: {$toDouble : "$brokerage"}
                  },
                  lots: {
                      $sum: {$toInt : "$Quantity"}
                  },
                  noOfTrade: {
                      $count: {}
                      // average_price: "$average_price"
                  },
                  }},
           { $sort: {_id: -1}},
          ])
          
              // //console.log(pnlDetails)

      res.status(201).json(pnlDetails);

}

exports.getAllTraderReportDateWise = async(req, res)=>{
  //console.log("Inside Aggregate API - Date wise company pnl based on date entered")
  let {startDate,endDate} = req.params
  let date = new Date();
  const days = date.getDay();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  //console.log("Today "+todayDate)
  
  let pipeline = [ {$match: {
                      trade_time : {$gte : new Date(startDate), $lte : new Date(`${endDate}T23:59:59`)},
                      status : "COMPLETE" 
                  }
                      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                  },
                  { $group :
                          { _id: {
                              "date": {$substr: [ "$trade_time", 0, 10 ]},
                          },
                  gpnl: {
                      $sum: {$multiply : ["$amount",-1]}
                  },
                  brokerage: {
                      $sum: {$toDouble : "$brokerage"}
                  },
                  trades: {
                      $count: {}
                  },
                  }
              },
              { $addFields: 
                  {
                  npnl : { $subtract : ["$gpnl","$brokerage"]},
                  dayOfWeek : {$dayOfWeek : { $toDate : "$_id.date"}}
                  }
                  },
              { $sort :
                  { _id : 1 }
              }
              ]

  let x = await InfinityTrader.aggregate(pipeline)

      res.status(201).json(x);
      
}
