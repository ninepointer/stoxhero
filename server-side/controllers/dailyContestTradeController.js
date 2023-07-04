const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("../models/DailyContest/dailyContestMockCompany");
// const InfinityTradeCompanyLive = require('../models/TradeDetails/liveTradeSchema')
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../marketData/redisClient');
const DailyContest = require("../models/DailyContest/dailyContest");
// const InfinityTraderLive = require("../models/TradeDetails/infinityLiveUser")




exports.overallPnlTrader = async (req, res, next) => {
    let isRedisConnected = getValue();
    const userId = req.user._id;
    const { id } = req.params;
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
        console.log(req.user._id.toString(), id.toString())
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`)) {
            let pnl = await client.get(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`)
            pnl = JSON.parse(pnl);
            console.log("pnl redis", pnl)

            res.status(201).json({ message: "pnl received", data: pnl });

        } else {

            let pnlDetails = await DailyContestMockUser.aggregate([
                {
                    $match: {
                        trade_time: {
                            $gte: today
                        },
                        status: "COMPLETE",
                        trader: new ObjectId(userId),
                        contestId: new ObjectId(id)
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
            // //console.log("pnlDetails in else", pnlDetails)

            if (isRedisConnected) {
                await client.set(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`, JSON.stringify(pnlDetails))
                await client.expire(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`, secondsRemaining);
            }

            // //console.log("pnlDetails", pnlDetails)
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

    //console.log(traderId)

    try {

        // if (isRedisConnected && await client.exists(`${req.user._id.toString()} overallpnlDailyContest`)) {
        //   let pnl = await client.get(`${req.user._id.toString()} overallpnlDailyContest`)
        //   pnl = JSON.parse(pnl);
        //console.log("pnl redis", pnl)

        //   res.status(201).json({ message: "pnl received", data: pnl });

        // } else {

        let pnlDetails = await InfinityTrader.aggregate([
            {
                $match: {
                    trade_time: {
                        $gte: today
                    },
                    status: "COMPLETE",
                    trader: new ObjectId(traderId),
                    contestId: new ObjectId(id)
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
        // //console.log("pnlDetails in else", pnlDetails)

        // if (isRedisConnected) {
        //   await client.set(`${req.user._id.toString()} overallpnlDailyContest`, JSON.stringify(pnlDetails))
        //   await client.expire(`${req.user._id.toString()} overallpnlDailyContest`, secondsRemaining);
        // }

        // //console.log("pnlDetails", pnlDetails)
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
    // //console.log(userId, today)
    let pnlDetails = await InfinityTraderCompany.aggregate([
        {
            $match: {
                trade_time: {
                    $gte: today
                },
                status: "COMPLETE",
                trader: new ObjectId(userId),
                contestId: new ObjectId(id)
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

exports.myTodaysTrade = async (req, res, next) => {

    const { id } = req.params;
    const userId = req.user._id;
    console.log(id, userId);
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    // const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await DailyContestMockUser.countDocuments({ trader: new ObjectId(userId), contestId: new ObjectId(id) })
    // //console.log("Under my today orders",userId, today)
    try {
        const myTodaysTrade = await DailyContestMockUser.find({ trader: new ObjectId(userId), contestId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
            .sort({ _id: -1 })
            // .skip(skip)
            // .limit(limit);
        // //console.log(myTodaysTrade)
        res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

// exports.getMyPnlAndCreditData = async (req, res, next) => {
//     let date = new Date();
//     let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
//     // todayDate = "2023-05-19" + "T00:00:00.000Z";
//     todayDate = todayDate + "T00:00:00.000Z";
//     const today = new Date(todayDate);
//     const {id} = req.params;
//     let myPnlAndCreditData = await DailyContestMockUser.aggregate([
//         {
//             $lookup: {
//                 from: "user-personal-details",
//                 localField: "trader",
//                 foreignField: "_id",
//                 as: "result",
//             },
//         },
//         {
//             $match: {
//                 status: "COMPLETE",
//                 trader: new ObjectId(req.user._id),
//                 trade_time: {
//                     $lt: today
//                 },
//                 contestId: new ObjectId(id)
//             }
//         },
//         {
//             $group: {
//                 _id: {

//                     funds: {
//                         $arrayElemAt: ["$result.fund", 0],
//                     },
//                 },
//                 gpnl: {
//                     $sum: {
//                         $multiply: ["$amount", -1],
//                     },
//                 },
//                 brokerage: {
//                     $sum: {
//                         $toDouble: "$brokerage",
//                     },
//                 },
//             },
//         },
//         {
//             $addFields:
//             {
//                 npnl: {
//                     $subtract: ["$gpnl", "$brokerage"],
//                 },
//                 availableMargin: {
//                     $add: ["$_id.funds", { $subtract: ["$gpnl", "$brokerage"] }]
//                 }
//             },
//         },
//         {
//             $project:
//             {
//                 _id: 0,
//                 totalFund: "$_id.funds",
//                 gpnl: "$gpnl",
//                 brokerage: "$brokerage",
//                 npnl: "$npnl",
//                 openingBalance: "$availableMargin"
//             },
//         },
//         {
//             $sort: { npnl: 1 }
//         }
//     ])

//     if (myPnlAndCreditData.length > 0) {
//         res.status(201).json({ message: "data received", data: myPnlAndCreditData[0] });
//     } else {
//         const data = await User.findById(req.user._id).select('fund');
//         const respData = { "totalFund": data.fund };
//         //res.status(201).json({message: "data received", data: fundDetail[0]});
//         res.status(201).json({ message: "data received", data: respData });
//     }


// }

exports.getMyPnlAndCreditData = async (req, res, next) => {
    let { id } = req.params;
    // console.log("Batch:",batch)
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

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`)) {
          let marginDetail = await client.get(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`)
          marginDetail = JSON.parse(marginDetail);
    
          res.status(201).json({ message: "pnl received", data: marginDetail });
    
        } else {
    
            const subscription = await DailyContest.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "user-portfolios",
                        localField: "portfolio",
                        foreignField: "_id",
                        as: "portfolioData",
                    },
                },
                {
                    $lookup: {
                        from: "dailycontest-mock-users",
                        localField: "_id",
                        foreignField: "contestId",
                        as: "trades",
                    },
                },
                {
                    $unwind:
                    {
                        path: "$trades",
                        includeArrayIndex: "string",
                    },
                },
                {
                    $match: {
                        "trades.trade_time": { $lt: today },
                        "trades.status": "COMPLETE",
                        "trades.trader": new ObjectId(req.user._id)
                    },
                },
                {
                    $group:
    
                    {
                        _id: {
                            batch: "$_id",
                            totalFund: {
                                $arrayElemAt: [
                                    "$portfolioData.portfolioValue",
                                    0,
                                ],
                            },
                        },
                        totalAmount: {
                            $sum: {
                                $multiply: ["$trades.amount", -1],
                            }
                        },
                        totalBrokerage: {
                            $sum: "$trades.brokerage",
                        },
                    },
                },
                {
                    $project:
    
                    {
                        _id: 0,
                        batch: "$_id.batch",
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
                                { $subtract: ["$totalAmount", "$totalBrokerage"] }
                            ]
                        }
                    },
                },
            ])
    
          if (subscription.length > 0) {
            if (isRedisConnected) {
              await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`, JSON.stringify(subscription[0]))
              await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`, secondsRemaining);
            }
            res.status(200).json({ status: 'success', data: subscription[0] });
          } else {
            const portfolioValue = await DailyContest.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "user-portfolios",
                        localField: "portfolio",
                        foreignField: "_id",
                        as: "portfolioData",
                    },
                },
                {
                    $group: {
                        _id: {
                            contestId: "$_id",
                            totalFund: {
                                $arrayElemAt: [
                                    "$portfolioData.portfolioValue",
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        batch: "$_id.contestId",
                        totalFund: "$_id.totalFund",
                    },
                },
            ])
            if (isRedisConnected) {
              await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`, JSON.stringify(portfolioValue[0]))
              await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginDailyContest`, secondsRemaining);
            }
            res.status(200).json({ status: 'success', data: portfolioValue[0] });
          }
    
        }
    
      } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'success', message: 'something went wrong.' })
      }
}