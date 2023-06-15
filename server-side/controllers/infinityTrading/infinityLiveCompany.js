const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const ObjectId = require('mongoose').Types.ObjectId;
const InfinityLiveUser = require("../../models/TradeDetails/infinityLiveUser");

exports.overallLivePnlToday = async(req, res, next)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlLiveDetails = await InfinityLiveCompany.aggregate([
        {
        $lookup: {
            from: 'algo-tradings',
            localField: 'algoBox',
            foreignField: '_id',
            as: 'algo'
        }
        },
        {
            $match: {
            trade_time: {
            $gte: today
            },
            status: "COMPLETE",
            "algo.isDefault": true
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
            $project: {
                _id: 0,
                symbol: "$_id.symbol",
                product: "$_id.product",
                amount: 1,
                brokerage: 1,
                instrumentToken: "$_id.instrumentToken",
                exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
                npnl: {
                    $subtract: ["$amount", "$brokerage"]
                },
                lots: 1,
                lastaverageprice: 1
            },
        },
        {
            $sort: {
            _id: -1,
            },
        },
    ])
    res.status(201).json({message: 'Live Pnl fetched successfully.', data: pnlLiveDetails});
}

exports.getLetestLiveTradeCompany = async(req, res, next)=>{
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
      
      

    let letestLive = await InfinityLiveCompany.aggregate(pipeline)

    res.status(201).json({message: 'Letest Live Trade.', data: letestLive[0]});
}

exports.traderLiveComapny = async(req, res, next)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InfinityLiveCompany.aggregate([
    {
        $lookup: {
        from: 'algo-tradings',
        localField: 'algoBox',
        foreignField: '_id',
        as: 'algoBox'
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
        $match: {
        trade_time: {
            $gte: today
        },
        status: "COMPLETE",
        "algoBox.isDefault": true
        },
    },
    { $group: 
        { _id: 
            {
                "traderId": "$trader",
                "traderName": {
                    $arrayElemAt:[ "$user.name", 0]},
                          "symbol": "$instrumentToken",
          "exchangeInstrumentToken": "$exchangeInstrumentToken",
                "algoId": {
                    $arrayElemAt:["$algoBox._id", 0]},
                "algoName": {
                    $arrayElemAt:["$algoBox.algoName", 0]}
            },
            amount: {
                $sum: {$multiply : ["$amount", -1]}
            },
            brokerage: {
                $sum: {$toDouble : "$brokerage"}
            },
            lots: {
                $sum: {$toInt : "$Quantity"}
            },
            trades: {
                $count: {}
            },
            lotUsed: {
                $sum: {$abs : {$toInt : "$Quantity"}}
            }
        }
    },
    {
        $project: {
        _id: 0,
        traderId: "$_id.traderId", 
        traderName: "$_id.traderName", 
        symbol: "$_id.symbol", 
        exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
        algoId: "$_id.algoId", 
        algoName: "$_id.algoName",
        amount: 1,
        brokerage: 1,
        lots: 1,
        trades: 1,
        lotUsed: 1
        
        }
    },
    { $sort: {_id: -1}},    
    ])
    res.status(201).json({message: 'Live Trader Data Company.', data: pnlDetails});
}

exports.pnlTraderCompany = async(req, res, next)=>{
    const userId = req.params.id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    

    let pnlDetails = await InfinityLiveCompany.aggregate([
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
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
    ])

    res.status(201).json({message: 'Live Trader Pnl Company.', data: pnlDetails});


}

exports.overallPnlBatchWiseLive = async (req, res, next) => {
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

  let x = await InfinityLiveCompany.aggregate(pipeline)
  res.status(201).json({message: "data received", data: x});
}

exports.traderwiseBatchLive = async (req, res, next) => {
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

  let x = await InfinityLiveCompany.aggregate(pipeline)
  res.status(201).json({message: "data received", data: x});
}

exports.mockLiveTotalTradersCountLiveSide = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InfinityLiveCompany.aggregate([
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

exports.overallCompanySidePnlLive = async (req, res, next) => {
  let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);    
    let pnlDetails = await InfinityLiveCompany.aggregate([
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

exports.overallInfinityLiveCompanyPnlYesterday = async (req, res, next) => {
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
    let pnlDetails = await InfinityLiveCompany.aggregate([
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

exports.overallInfinityLiveCompanyPnlMTD = async (req, res, next) => {
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
    let pnlDetails = await InfinityLiveCompany.aggregate([
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

exports.traderPnlTWiseLive = async (req, res, next) => {

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

  let x = await InfinityLiveUser.aggregate(pipeline)
  let cumulative = await InfinityLiveUser.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.companyPnlReportLive = async (req, res, next) => {

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
    // console.log(date)
    let pipelineCommulative = [
      {
        $match: {
          trade_time: {
            // $gte: new Date(startDate),
            $lte: new Date(date),
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
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: new Date(date),
            },
          },
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          dayOfWeek: {
            $dayOfWeek: {
              $toDate: new Date(date),
            },
          },
        },
      },
      {
        $project: {
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
        $group: {
          _id: {},
          tradingDays: {
            $count: {},
          },
          greenDays: {
            $sum: {
              $cond: {
                if: {
                  $gt: ["$npnl", 0],
                },
                then: 1,
                else: 0,
              },
            },
          },
          redDays: {
            $sum: {
              $cond: {
                if: {
                  $lt: ["$npnl", 0],
                },
                then: 1,
                else: 0,
              },
            },
          },
          totalGpnl: {
            $sum: "$gpnl",
          },
          totalNpnl: {
            $sum: "$npnl",
          },
          totalBrokerage: {
            $sum: "$brokerage",
          },
          totalTrade: {
            $sum: "$noOfTrade",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]
    let cumulative = await InfinityLiveCompany.aggregate(pipelineCommulative)
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

  

  let x = await InfinityLiveCompany.aggregate(pipeline)

  res.status(201).json({ message: "data received", data: x, cumulative: result });
}

exports.companyDailyPnlTWiseLive = async (req, res, next) => {

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

  let x = await InfinityLiveCompany.aggregate(pipeline)
  let cumulative = await InfinityLiveCompany.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.companyDailyPnlTWiseSingleUserLive = async (req, res, next) => {

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

  let x = await InfinityLiveCompany.aggregate(pipeline)
  let cumulative = await InfinityLiveCompany.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.traderPnlTWiseSingleUserLive = async (req, res, next) => {

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

  let x = await InfinityLiveCompany.aggregate(pipeline)
  let cumulative = await InfinityLiveCompany.aggregate(pipelineCommulative)

  res.status(201).json({ message: "data received", data: x, cumulative: cumulative });
}

exports.traderMatrixPnlLive = async (req, res, next) => {

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

  let x = await InfinityLiveCompany.aggregate(pipeline)

  // res.status(201).json(x);

  res.status(201).json({ message: "data received", data: x });
}
