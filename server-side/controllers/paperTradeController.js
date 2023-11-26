const PaperTrade = require("../models/mock-trade/paperTrade");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const {client, getValue} = require('../marketData/redisClient');
const { ObjectId } = require("mongodb");
const InfinityTrade = require('../models/mock-trade/infinityTrader');
const InfinityTradeCompany = require('../models/mock-trade/infinityTradeCompany');
const PendingOrder = require("../models/PendingOrder/pendingOrderSchema");


exports.overallPnl = async (req, res, next) => {
    let isRedisConnected = getValue();
    const userId = req.user._id;
    // "646497d2a09e4677cb550906"
    // 
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    tempTodayDate = tempTodayDate + "T23:59:59.999Z";
    const tempDate = new Date(tempTodayDate);
    const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);


    try{

      if(isRedisConnected && await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)){
        let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
        pnl = JSON.parse(pnl);
        // console.log("pnl redis", pnl)
        
        res.status(201).json({message: "pnl received", data: pnl});

      } else{

        let pnlDetails = await PaperTrade.aggregate([
          {
              $match: {
                  trade_time:{
                      $gte: today
                  },
                  status: "COMPLETE",
                  trader: new ObjectId(userId)
              },
          },
          {
            $sort: {
              trade_time: 1,
            },
          },
          {
            $group: {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                // exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange",
                validity: "$validity",
                variety: "$variety",
              },
              amount: {
                $sum: {$multiply : ["$amount",-1]},
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
              margin: {
                $last: "$margin",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])

        const limitMargin = await PendingOrder.aggregate([
          {
            $match: {
              createdBy: new ObjectId(
                userId
              ),
              type: "Limit",
              status: "Pending",
              createdOn: {
                $gte: today,
              },
              product_type: new ObjectId("65449ee06932ba3a403a681a")
            },
          },
          {
            $sort: {
              createdOn: 1,
            },
          },
          {
            $group:
            {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchangeInstrumentToken: "$exchangeInstrumentToken",
                exchange: "$exchange",
                validity: "$validity",
                variety: "$variety",
                // order_type: "$order_type"
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
              margin: {
                $last: "$margin",
              },
            }
          }
        ])
  
        const arr = [];
        for(let elem of limitMargin){
          arr.push({
            _id: {
              symbol: elem._id.symbol,
              product: elem._id.product,
              instrumentToken: elem._id.instrumentToken,
              exchangeInstrumentToken: elem._id.exchangeInstrumentToken,
              exchange: elem._id.exchange,
              validity: elem._id.validity,
              variety: elem._id.variety,
              isLimit: true
            },
            // amount: (tenxDoc.amount * -1),
            // brokerage: Number(tenxDoc.brokerage),
            lots: Number(elem.lots),
            // lastaverageprice: tenxDoc.average_price,
            margin: elem.margin
          });
        }
  
        const newPnl = pnlDetails.concat(arr);

        if(isRedisConnected){
          await client.set(`${req.user._id.toString()}: overallpnlPaperTrade`, JSON.stringify(newPnl))
          await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
        }
        res.status(201).json({message: "pnl received", data: newPnl});
      }

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }


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
  const count = await PaperTrade.countDocuments({trader: userId, trade_time: {$gte:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await PaperTrade.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.myHistoryTrade = async (req, res, next) => {
  
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await PaperTrade.countDocuments({trader: userId, trade_time: {$lt:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await PaperTrade.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.marginDetail = async (req, res, next) => {
  let isRedisConnected = getValue();

  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  tempTodayDate = tempTodayDate + "T23:59:59.999Z";
  const tempDate = new Date(tempTodayDate);
  const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);


  try {

    if (isRedisConnected && await client.exists(`${req.user._id.toString()} openingBalanceAndMarginPaper`)) {
      let marginDetail = await client.get(`${req.user._id.toString()} openingBalanceAndMarginPaper`)
      marginDetail = JSON.parse(marginDetail);

      res.status(201).json({ message: "pnl received", data: marginDetail });

    } else {

      const portfoliosFund = await Portfolio.aggregate([
        {
          $match:
            {
              status: "Active",
              portfolioType: "Virtual Trading",
            },
        },
        {
          $lookup:
            {
              from: "paper-trades",
              localField: "_id",
              foreignField: "portfolioId",
              as: "trades",
            },
        },
        {
          $unwind:
            {
              path: "$trades",
            },
        },
        {
          $match:
            {
              "trades.trade_time": {
                $lt: today,
              },
              "trades.status": "COMPLETE",
              "trades.trader": new ObjectId(
                req.user._id
              ),
            },
        },
        {
          $group: {
            _id: {
              portfolioId: "$_id",
              portfolioName: "$portfolioName",
              totalFund: "$portfolioValue",
            },
            totalAmount: {
              $sum: {
                $multiply: ["$trades.amount", -1],
              },
            },
            totalBrokerage: {
              $sum: "$trades.brokerage",
            },
          },
        },
        {
          $project: {
            _id: 0,
            portfolioId: "$_id.portfolioId",
            portfolioName: "$_id.portfolioName",
            totalFund: "$_id.totalFund",
            npnl: {
              $subtract: [
                "$totalAmount",
                "$totalBrokerage",
              ],
            },
            openingBalance: {
              $sum: [
                "$_id.totalFund",
                {
                  $subtract: [
                    "$totalAmount",
                    "$totalBrokerage",
                  ],
                },
              ],
            },
          },
        },
      ])

      if (portfoliosFund.length > 0) {
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()} openingBalanceAndMarginPaper`, JSON.stringify(portfoliosFund[0]))
          await client.expire(`${req.user._id.toString()} openingBalanceAndMarginPaper`, secondsRemaining);
        }
        res.status(200).json({ status: 'success', data: portfoliosFund[0] });
      } else {
        const portfoliosFund = await Portfolio.aggregate([
          {
            $match:
              {
                status: "Active",
                portfolioType: "Virtual Trading",
              },
          },
          {
            $group: {
              _id: {
                portfolioId: "$_id",
                portfolioName: "$portfolioName",
                totalFund: "$portfolioValue",
              },
            },
          },
          {
            $project: {
              _id: 0,
              portfolioId: "$_id.portfolioId",
              portfolioName: "$_id.portfolioName",
              totalFund: "$_id.totalFund",
            },
          },
        ])
        if (isRedisConnected) {
          await client.set(`${req.user._id.toString()} openingBalanceAndMarginPaper`, JSON.stringify(portfoliosFund[0]))
          await client.expire(`${req.user._id.toString()} openingBalanceAndMarginPaper`, secondsRemaining);
        }
        res.status(200).json({ status: 'success', data: portfoliosFund[0] });
      }

    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'success', message: 'something went wrong.' })
  }




}

exports.findOpenLots = async (req,res,next) =>{
  // console.log(new Date('2023-05-26'));
  const pipeline = [
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          trade_time: {
            $gt: new Date("2023-05-26"),
          },
          status:'COMPLETE'
        },
    },
    
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {trader: "$trader", symbol: "$symbol"},
          lots: {
            $sum: "$Quantity",
          },
        },
    },
  ];
  const lots = await InfinityTradeCompany.aggregate(pipeline);
  // console.log('open',lots, lots.length);
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
          "exchangeInstrumentToken": "$exchangeInstrumentToken",
          "traderEmail": {
            $arrayElemAt: ["$user.email", 0]
          },
          "traderMobile": {
            $arrayElemAt: ["$user.mobile", 0]
          }
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

  let x = await PaperTrade.aggregate(pipeline)
  res.status(201).json({ message: "data received", data: x });
}

exports.overallVirtualTraderPnl = async (req, res, next) => {
  // console.log("Inside overall virtual pnl")
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);    
  // console.log(today)
  let pnlDetails = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: today
          // $gte: new Date("2023-05-26T00:00:00.000+00:00")
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

exports.liveTotalTradersCount = async (req, res, next) => {
let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);    
  let pnlDetails = await PaperTrade.aggregate([
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

exports.overallVirtualPnlYesterday = async (req, res, next) => {
  let date;
  let i = 1;
  let maxDaysBack = 30;  // define a maximum limit to avoid infinite loop
  let pnlDetailsData;

  while (!pnlDetailsData && i <= maxDaysBack) {
    let day = new Date();
    day.setDate(day.getDate() - i);
    let startTime = new Date(day.setHours(0, 0, 0, 0));
    let endTime = new Date(day.setHours(23, 59, 59, 999));
    date = startTime;
    
    pnlDetailsData = await PaperTrade.aggregate([
      {
        $match: {
          trade_time: {
            $gte: startTime,
            $lte: endTime
          },
          status: "COMPLETE",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: { $multiply: ["$amount", -1] },
          },
          turnover: {
            $sum: { $toInt: { $abs: "$amount" } },
          },
          brokerage: {
            $sum: { $toDouble: "$brokerage" },
          },
          lots: {
            $sum: { $toInt: "$Quantity" },
          },
          totallots: {
            $sum: { $toInt: { $abs: "$Quantity" } },
          },
          trades: {
            $count: {}
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    if (!pnlDetailsData || pnlDetailsData.length === 0) {
      pnlDetailsData = null;  // reset the value to ensure the while loop continues
      i++;  // increment the day counter
    }
  }

  res.status(201).json({
    message: "pnl received", 
    data: pnlDetailsData, 
    results: pnlDetailsData ? pnlDetailsData.length : 0, 
    date: date
  });
}

exports.liveTotalTradersCountYesterday = async (req, res, next) => {
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
  let pnlDetails = await PaperTrade.aggregate([
    {
      $match: {
        trade_time: {
          $gte: startTime, $lte: endTime
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

exports.getDailyVirtualUsers = async (req, res) => {
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

    const virtualTraders = await PaperTrade.aggregate(pipeline);

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
            uniqueUsers: [],
          };
        }
        dateWiseDAUs[date].virtualTrading = traders;
        dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
      }
    });

    // Calculate the date-wise total DAUs and unique users
    Object.keys(dateWiseDAUs).forEach(date => {
      const { virtualTrading, uniqueUsers } = dateWiseDAUs[date];
      dateWiseDAUs[date].total = virtualTrading
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
