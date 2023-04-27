const PaperTrade = require("../models/mock-trade/paperTrade");

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