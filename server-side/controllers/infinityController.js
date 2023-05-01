const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTraderCompany = require("../models/mock-trade/infinityTradeCompany");

exports.overallPnlTrader = async (req, res, next) => {
    
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    console.log(userId, today)
    let pnlDetails = await InfinityTrader.aggregate([
        {
            $match: {
                trade_time:{
                    $gte: today
                },
                status: "COMPLETE",
                trader: userId
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
    res.status(201).json({message: "pnl received", data: pnlDetails});
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
  const count = await InfinityTrader.countDocuments({trader: userId, trade_time: {$gte:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InfinityTrader.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
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
  const limit = parseInt(req.query.limit) || 5
  const count = await InfinityTrader.countDocuments({trader: userId, trade_time: {$lt:today}})
  console.log("Under history orders",skip, limit)
  try {
    const myHistoryTrade = await InfinityTrader.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
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

exports.getPnlAndCreditData = async (req, res, next) => {
  
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
      status : "COMPLETE" 
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
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
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
      $sort : {npnl : 1}
    }
  ])

  res.status(201).json({message: "data received", data: pnlAndCreditData});
}

exports.getMyPnlAndCreditData = async (req, res, next) => {
  
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
      status : "COMPLETE",
      trader: req.user._id
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
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
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
      $sort : {npnl : 1}
    }
  ])

  res.status(201).json({message: "data received", data: myPnlAndCreditData[0]});
}