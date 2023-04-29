const PaperTrade = require("../models/mock-trade/paperTrade");
const Portfolio = require("../models/userPortfolio/UserPortfolio");

exports.overallPnl = async (req, res, next) => {
    
    const userId = req.user._id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    console.log(userId, today)
    let pnlDetails = await PaperTrade.aggregate([
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
  const count = await PaperTrade.countDocuments({trader: userId, trade_time: {$gte:today}})
  console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await PaperTrade.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myTodaysTrade)
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
  console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await PaperTrade.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.marginDetail = async (req, res, next) => {

  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(userId, today)

  try {
    const portfoliosFund = await Portfolio.aggregate([
      {
        $match: {
          status: "Active",
          "users.userId": req.user._id,
          portfolioType: "Trading"
        },
      },
      {
        $group: {
          _id: {
             $sum: "$portfolioValue"
          }
        }
      },
      {
        $project: {
          totalFund: "$_id",
          _id: 0
        }
      }
    ])
  
    let pnlDetails = await PaperTrade.aggregate([
        {
            $match: {
                trade_time:{
                    $lt: today
                },
                status: "COMPLETE",
                trader: req.user._id
            },
        },
        {
          $group: {
            _id: {
              trader: "$trader",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },

          },
        },

        {
          $project: {
            _id: 0,
            npnl: {
              $subtract: ["$amount", "$brokerage"]
             },
          }
        },
    ])
    res.status(200).json({status: 'success', data: {totalCredit: portfoliosFund[0], lifetimePnl: pnlDetails[0]}});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}
