const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const ObjectId = require('mongoose').Types.ObjectId;

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
        userId: 1,
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