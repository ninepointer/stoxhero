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
            createdBy: { $arrayElemAt: ["$user.employeeid", 0] },
            "buyOrSell": 1,
            "Quantity": 1,
            "symbol": 1,
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




