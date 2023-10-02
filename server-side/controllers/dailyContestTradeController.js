const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("../models/DailyContest/dailyContestMockCompany");
// const InfinityTradeCompanyLive = require('../models/TradeDetails/liveTradeSchema')
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../marketData/redisClient');
const DailyContest = require("../models/DailyContest/dailyContest");
// const InfinityTraderLive = require("../models/TradeDetails/infinityLiveUser")
const User = require("../models/User/userDetailSchema")
const Instrument = require("../models/Instruments/instrumentSchema")
const getKiteCred = require('../marketData/getKiteCred');
const axios = require("axios")
const { getIOValue } = require('../marketData/socketio');

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
        // console.log(req.user._id.toString(), id.toString())
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`)) {
            let pnl = await client.get(`${req.user._id.toString()}${id.toString()} overallpnlDailyContest`)
            pnl = JSON.parse(pnl);
            // console.log("pnl redis", pnl)

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
    // console.log(id, userId);
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

exports.myPnlAndPayout = async (req, res, next) => {
    let userId = req.user._id;

    try {

        const data = await DailyContestMockUser.aggregate([
            {
                $match: {
                    trader: new ObjectId(
                        userId
                    ),
                    status: "COMPLETE",
                },
            },
            {
                $group: {
                    _id: {
                        userId: "$trader",
                        contestId: "$contestId",
                    },
                    amount: {
                        $sum: {
                            $multiply: ["$amount", -1],
                        },
                    },
                    brokerage: {
                        $sum: "$brokerage",
                    },
                },
            },
            {
                $lookup: {
                    from: "daily-contests",
                    localField: "_id.contestId",
                    foreignField: "_id",
                    as: "contestData",
                },
            },
            {
                $unwind: {
                    path: "$contestData",
                },
            },
            {
                $unwind: {
                    path: "$contestData.participants",
                },
            },
            {
                $match:
                {
                    "contestData.participants.userId":
                        new ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "user-portfolios",
                    localField: "contestData.portfolio",
                    foreignField: "_id",
                    as: "portfolioData",
                },
            },
            {
                $unwind: {
                    path: "$portfolioData",
                },
            },
            {
                $project: {
                    _id: 0,
                    contestId: "$_id.contestId",
                    rank: "$contestData.participants.rank",
                    npnl: {
                        $subtract: ["$amount", "$brokerage"],
                    },
                    portfolioValue:
                        "$portfolioData.portfolioValue",
                    payoutAmount: {
                        $multiply: [
                            "$contestData.payoutPercentage",
                            {
                                $divide: [
                                    {
                                        $subtract: [
                                            "$amount",
                                            "$brokerage",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },
        ])

        res.status(200).json({ status: 'success', data: data })

    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'error', message: 'something went wrong.', error: e })
    }
}

exports.overallDailyContestTraderPnl = async (req, res, next) => {
    // console.log("Inside overall virtual pnl")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    // console.log(today)
    let pnlDetails = await DailyContestMockCompany.aggregate([
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
                    $sum: { $multiply: ["$amount", -1] },
                },
                turnover: {
                    $sum: {
                        $toInt: { $abs: "$amount" },
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
                        $toInt: { $abs: "$Quantity" },
                    },
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
    ])
    res.status(201).json({ message: "pnl received", data: pnlDetails });
}

exports.liveTotalTradersCount = async (req, res, next) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    let pnlDetails = await DailyContestMockCompany.aggregate([
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

exports.overallDailyContestPnlYesterday = async (req, res, next) => {
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
        pnlDetailsData = await DailyContestMockCompany.aggregate([
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

        // const contest = await DailyContest.find({contestEndTime: {$gte: startTime, $lte: endTime}})
        if (!pnlDetailsData || pnlDetailsData.length === 0) {
            pnlDetailsData = [];  // reset the value to ensure the while loop continues

            i++;  // increment the day counter
        }
    }
    res.status(201).json({
        message: "pnl received",
        data: pnlDetailsData,
        results: pnlDetailsData ? pnlDetailsData.length : 0,
        date: date,
        flag:1
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
    let pnlDetails = await DailyContestMockCompany.aggregate([
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

exports.traderWiseMockCompanySide = async (req, res, next) => {
    const { id } = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const pipeline = [
        {
            $match:
            {
                // trade_time: {
                //     $gte: today
                // },
                status: "COMPLETE",
                contestId: new ObjectId(id)
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

    let x = await DailyContestMockCompany.aggregate(pipeline)
    // console.log(id, x)
    res.status(201).json({ message: "data received", data: x });
}

exports.overallDailyContestCompanySidePnlThisMonth = async (req, res, next) => {
    // const { ydate } = req.params;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    yesterdayDate = yesterdayDate + "T00:00:00.000Z";
    // console.log("Yesterday Date:",yesterdayDate)
    // const today = new Date(todayDate);
    let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    monthStartDate = monthStartDate + "T00:00:00.000Z";
    // console.log("Month Start Date:",monthStartDate)

    const pipeline = [
        {
            $match:
            {
                trade_time: {
                    $gte: new Date(monthStartDate),
                    // $lte: yesterdayDate
                },
                status: "COMPLETE",
            }
        },
        {
            $group:
            {
                _id: null,
                gpnl: {
                    $sum: { $multiply: ["$amount", -1] }
                },
                turnover: {
                    $sum: { $abs: ["$amount"] }
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

    let x = await DailyContestMockCompany.aggregate(pipeline)
    // console.log("MTD",x)
    res.status(201).json({ message: "data received", data: x });
}

exports.overallDailyContestCompanySidePnlLifetime = async (req, res, next) => {
    // const { ydate } = req.params;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    yesterdayDate = yesterdayDate + "T23:59:59.000Z";
    // const today = new Date(todayDate);
    let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    // monthStartDate = monthStartDate + "T23:59:59.000Z";
    // console.log("Yesterday Date:",yesterdayDate)

    const pipeline = [
        {
            $match:
            {
                trade_time: {
                    $lte: new Date(yesterdayDate),
                    // $lte: yesterdayDate
                },
                status: "COMPLETE",
            }
        },
        {
            $group:
            {
                _id: null,
                gpnl: {
                    $sum: { $multiply: ["$amount", -1] }
                },
                turnover: {
                    $sum: { $abs: ["$amount"] }
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

    let x = await DailyContestMockCompany.aggregate(pipeline)
    // console.log("Lifetime",x)
    res.status(201).json({ message: "data received", data: x });
}

exports.traderWiseMockTraderSide = async (req, res, next) => {
    const { id } = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const pipeline = [
        {
            $match:
            {
                // trade_time: {
                //     $gte: today
                // },
                status: "COMPLETE",
                contestId: new ObjectId(id)
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

    let x = await DailyContestMockUser.aggregate(pipeline)
    // console.log(id, x)
    res.status(201).json({ message: "data received", data: x });
}

exports.DailyContestPnlTWise = async (req, res, next) => {

    let { id } = req.params
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
                status: "COMPLETE",
                contestId: new ObjectId(id)
            }
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
            $sort: {
                npnl: -1,
            },
        },
    ]

    let pipeline1 = [
        {
            $match:
            {
                status: "COMPLETE",
                contestId: new ObjectId(id)
            },
        },
        {
            $lookup:
            {
                from: "daily-contests",
                localField: "contestId",
                foreignField: "_id",
                as: "contestData",
            },
        },
        {
            $unwind:
            {
                path: "$contestData",
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    payoutPer:
                        "$contestData.payoutPercentage",
                },
                gpnl: {
                    $sum: {
                        $multiply: ["$amount", -1],
                    },
                },
                brokerage: {
                    $sum: "$brokerage",
                },
            },
        },
        {
            $project:
            {
                _id: 0,
                npnl: {
                    $subtract: ["$gpnl", "$brokerage"],
                },
                payout: {
                    $divide: [
                        {
                            $multiply: [
                                {
                                    $subtract: [
                                        "$gpnl",
                                        "$brokerage",
                                    ],
                                },
                                "$_id.payoutPer",
                            ],
                        },
                        100,
                    ],
                },
            },
        },
        {
            $match:
            {
                payout: {
                    $gt: 0,
                },
            },
        },
        {
            $group:
            {
                _id: {},
                totalPayout: {
                    $sum: "$payout",
                },
            },
        },
        {
            $project:
            {
                _id: 0,
            },
        },
    ]

    let user = await DailyContestMockUser.aggregate(pipeline1)
    let x = await DailyContestMockCompany.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x, user: user[0] });
}

exports.DailyContestPnlTWiseTraderSide = async (req, res, next) => {

    let { id } = req.params
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
                status: "COMPLETE",
                contestId: new ObjectId(id)
            }
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
            $sort: {
                npnl: -1,
            },
        },
    ]

    let pipeline1 = [
        {
            $match:
            {
                status: "COMPLETE",
                contestId: new ObjectId(id)
            },
        },
        {
            $lookup:
            {
                from: "daily-contests",
                localField: "contestId",
                foreignField: "_id",
                as: "contestData",
            },
        },
        {
            $unwind:
            {
                path: "$contestData",
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    payoutPer:
                        "$contestData.payoutPercentage",
                },
                gpnl: {
                    $sum: {
                        $multiply: ["$amount", -1],
                    },
                },
                brokerage: {
                    $sum: "$brokerage",
                },
            },
        },
        {
            $project:
            {
                _id: 0,
                npnl: {
                    $subtract: ["$gpnl", "$brokerage"],
                },
                payout: {
                    $divide: [
                        {
                            $multiply: [
                                {
                                    $subtract: [
                                        "$gpnl",
                                        "$brokerage",
                                    ],
                                },
                                "$_id.payoutPer",
                            ],
                        },
                        100,
                    ],
                },
            },
        },
        {
            $match:
            {
                payout: {
                    $gt: 0,
                },
            },
        },
        {
            $group:
            {
                _id: {},
                totalPayout: {
                    $sum: "$payout",
                },
            },
        },
        {
            $project:
            {
                _id: 0,
            },
        },
    ]

    let user = await DailyContestMockUser.aggregate(pipeline1)
    let x = await DailyContestMockUser.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x, user: user[0] });
}

exports.DailyContestPayoutChart = async (req, res, next) => {

    // let { id } = req.params
    let pipeline = [
        {
            $match: {
                status: "COMPLETE",
            },
        },
        {
            $lookup: {
                from: "daily-contests",
                localField: "contestId",
                foreignField: "_id",
                as: "contestData",
            },
        },
        {
            $unwind: {
                path: "$contestData",
            },
        },
        {
            $match: {
                "contestData.contestStatus": "Completed",
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    contestId: "$contestId",
                    contestName: "$contestData.contestName",
                    date: {
                        $substr: [
                            "$contestData.contestStartTime",
                            0,
                            10,
                        ],
                    },
                    payoutPer:
                        "$contestData.payoutPercentage",
                },
                gpnl: {
                    $sum: {
                        $multiply: ["$amount", -1],
                    },
                },
                brokerage: {
                    $sum: "$brokerage",
                },
            },
        },
        {
            $project: {
                _id: 1,
                npnl: {
                    $subtract: ["$gpnl", "$brokerage"],
                },
                positiveNpnl: {
                    $max: [
                        0,
                        {
                            $subtract: ["$gpnl", "$brokerage"],
                        },
                    ],
                },
                payoutPer: "$_id.payoutPer",
            },
        },
        {
            $group: {
                _id: {
                    contestId: "$_id.contestId",
                    contestName: "$_id.contestName",
                    date: "$_id.date",
                    payoutPer: "$payoutPer",
                },
                totalNpnl: {
                    $sum: "$npnl",
                },
                totalPositiveNpnl: {
                    $sum: "$positiveNpnl",
                },
            },
        },
        {
            $project: {
                contestId: "$_id.contestId",
                contestName: "$_id.contestName",
                contestDate: "$_id.date",
                totalNpnl: 1,
                totalPayout: {
                    $multiply: [
                        "$totalPositiveNpnl",
                        {
                            $divide: ["$_id.payoutPer", 100],
                        },
                    ],
                },
                _id: 0,
            },
        },
        {
            $sort: {
                contestDate: -1,
            },
        },
        {
            $group:
            {
                _id: {
                    contestDate: "$contestDate",
                },
                totalNpnl: {
                    $sum: "$totalNpnl",
                },
                totalPayout: {
                    $sum: "$totalPayout",
                },
                numberOfContests: {
                    $sum: 1,
                },
            },
        },
        {
            $project:
            {
                _id: 0,
                contestDate: "$_id.contestDate",
                totalNpnl: 1,
                totalPayout: 1,
                numberOfContests: 1,
            },
        },
        {
            $sort:
            {
                contestDate: 1
            }
        }
    ]

    let x = await DailyContestMockUser.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x });
}

exports.getRedisLeaderBoard = async (req, res, next) => {
    const { id } = req.params;
    // const appSetting = await AppSetting.find();


    try {
        if (!await client.exists(`${id.toString()}employeeid`)) {
            let allUsers = await User.find({ status: "Active" });

            let obj = {};
            for (let i = 0; i < allUsers.length; i++) {
                let data = {
                    employeeid: allUsers[i].employeeid,
                    name: allUsers[i].first_name + " " + allUsers[i].last_name,
                    photo: allUsers[i]?.profilePhoto?.url,
                };

                obj[allUsers[i]._id.toString()] = data;
            }

            try {
                let temp = await client.set(`${id.toString()}employeeid`, JSON.stringify(obj));

            } catch (err) {
                console.log(err)
            }
        }

        if (await client.exists(`leaderboard:${id}`)) {
            // console.log("in if con")
            const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard:${id}`, "0", "19", 'WITHSCORES'])
            const formattedLeaderboard = await formatData(leaderBoard)
            // console.log("app setting", appSetting[0].leaderBoardTimming)
            // console.log('cached', formattedLeaderboard);
            // return res.status(200).json({
            //     status: 'success',
            //     results: formattedLeaderboard.length,
            //     data: formattedLeaderboard
            // });
            return formattedLeaderboard;
        }
        else {
            //get ltp for the contest instruments
            // const contestInstruments = await Contest.findById(id).select('instruments');
            let addUrl;
            let livePrices = {};
            let dummyTesting = false;
            if (dummyTesting) {
                let filteredTicks = getFilteredTicks();
                // console.log('filtered ticks received', filteredTicks);
                if (filteredTicks.length > 0) {
                    for (tick of filteredTicks) {
                        livePrices[tick.instrument_token] = tick.last_price;
                    }
                    // console.log(livePrices);
                }
            } else {
                const contestInstruments = await Instrument.find({ status: "Active" }).select('instrumentToken exchange symbol');
                const data = await getKiteCred.getAccess();
                contestInstruments.forEach((elem, index) => {
                    if (index === 0) {
                        addUrl = ('i=' + elem.exchange + ':' + elem.symbol);
                    } else {
                        addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);
                    }
                });
                // console.log(addUrl);
                const ltpBaseUrl = `https://api.kite.trade/quote?${addUrl}`;
                let auth = 'token' + data.getApiKey + ':' + data.getAccessToken;

                let authOptions = {
                    headers: {
                        'X-Kite-Version': '3',
                        Authorization: auth,
                    },
                };

                const response = await axios.get(ltpBaseUrl, authOptions);
                for (let instrument in response.data.data) {
                    livePrices[response.data.data[instrument].instrument_token] = response.data.data[instrument].last_price;
                }
            }

            let ranks;

            if (await client.exists(`${id.toString()} allranks`)) {
                ranks = await client.get(`${id.toString()} allranks`);
                ranks = JSON.parse(ranks);
                // console.log('ranks in redis',ranks);
            } else {

                ranks = await DailyContestMockUser.aggregate([
                    // Match documents for the given contestId
                    {
                        $match: {
                            contestId: new ObjectId(id),
                            status: "COMPLETE",
                        }
                    },
                    // Group by userId and sum the amount
                    {
                        $group: {
                            _id: {
                                trader: "$trader",
                                // employeeid: "$employeeid",
                                instrumentToken: "$instrumentToken",
                                exchangeInstrumentToken: "$exchangeInstrumentToken",
                                symbol: "$symbol",
                                product: "$Product",
                            },
                            totalAmount: { $sum: { $multiply: ["$amount", -1] } },
                            investedAmount: {
                                $sum: {
                                    $cond: {
                                        if: { $gte: ["$amount", 0] },
                                        then: "$amount",
                                        else: 0
                                    }
                                }
                            },
                            brokerage: {
                                $sum: {
                                    $toDouble: "$brokerage",
                                },
                            },
                            lots: {
                                $sum: { $toInt: "$Quantity" }
                            }
                        }
                    },
                    // Sort by totalAmount in descending order

                    // Project the result to include only userId and totalAmount
                    {
                        $project: {
                            _id: 0,
                            userId: "$_id",
                            totalAmount: 1,
                            investedAmount: 1,
                            brokerage: 1,
                            lots: 1
                        }
                    },
                    {
                        $addFields: {
                            rpnl: {
                                $multiply: ["$lots",]
                            }
                        }
                    },
                ]);
                // console.log("ranks from db", ranks)
                await client.set(`${id.toString()} allranks`, JSON.stringify(ranks))

            }

            // console.log(livePrices);

            for (doc of ranks) {
                // console.log('doc is', doc);
                doc.rpnl = doc.lots * livePrices[doc.userId.instrumentToken];
                doc.npnl = doc.totalAmount + doc.rpnl - doc.brokerage;
                // console.log('npnl is', doc?.npnl);
            }


            async function aggregateRanks(ranks) {
                const result = {};
                for (const curr of ranks) {
                    const { userId, npnl, investedAmount } = curr;
                    const traderId = userId.trader;
                    let employeeidObj = await client.get(`${(id).toString()}employeeid`);

                    employeeidObj = JSON.parse(employeeidObj);
                    // console.log("employeeid", employeeidObj)
                    if (!result[traderId]) {
                        result[traderId] = {
                            traderId,
                            name: employeeidObj[traderId.toString()]?.employeeid,
                            npnl: 0,
                            userName: employeeidObj[traderId.toString()]?.name,
                            photo: employeeidObj[traderId.toString()]?.photo,
                            investedAmount: 0,

                        };
                    }
                    result[traderId].npnl += npnl;
                    result[traderId].investedAmount += investedAmount
                    // console.log("result", result)
                }
                return Object.entries(result).map(([key, value]) => value);
            }

            const result = await aggregateRanks(ranks);

            // console.log("rsult", result)
            for (rank of result) {
                // console.log(rank);
                // console.log(`leaderboard${id}`);
                await client.set(`${rank.name} investedAmount`, JSON.stringify(rank));
                await client.ZADD(`leaderboard:${id}`, {
                    score: rank.npnl,
                    value: JSON.stringify({ name: rank.name })
                });
            }

            // await pipeline.exec();
            // console.log("app setting", appSetting[0].leaderBoardTimming)
            await client.expire(`leaderboard:${id}`, 10);

            const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard:${id}`, "0", "5", 'WITHSCORES'])
            const formattedLeaderboard = await formatData(leaderBoard)

            // console.log("formattedLeaderboard", leaderBoard, formattedLeaderboard)
            // return res.status(200).json({
            //     status: 'success',
            //     results: formattedLeaderboard.length,
            //     data: formattedLeaderboard
            // });

            return formattedLeaderboard;


        }
    } catch (e) {
        console.log("redis error", e);
    }

    async function formatData(arr) {
        const formattedLeaderboard = [];

        for (let i = 0; i < arr.length; i += 2) {
            // Parse the JSON string to an object
            const obj = JSON.parse(arr[i]);
            // Add the npnl property to the object
            let data = await client.get(`${obj.name} investedAmount`)
            data = JSON.parse(data);
            obj.npnl = Number(arr[i + 1]);
            // obj.investedAmount = Number(investedAmount);
            obj.userName = data.userName;
            obj.photo = data.photo;
            // Add the object to the formattedLeaderboard array
            formattedLeaderboard.push(obj);
        }

        return formattedLeaderboard;
    }

}

const dailyContestLeaderBoard = async (id) => {

    // console.log("dailyContestLeaderBoard")

    try {
        // console.log("temp check8...................")
        if (!await client.exists(`${id.toString()}employeeid`)) {
            let allUsers = await User.find({ status: "Active" });
            // console.log("in employee if")
            let obj = {};
            for (let i = 0; i < allUsers.length; i++) {
                // console.log("temp check4...................")
                let data = {
                    employeeid: allUsers[i].employeeid,
                    name: allUsers[i].first_name + " " + allUsers[i].last_name,
                    photo: allUsers[i]?.profilePhoto?.url,
                };

                obj[allUsers[i]._id.toString()] = data;
                // console.log("temp check1...................")
            }

            // console.log("temp check2...................")
            try {
                // console.log("temp check3...................")
                let temp = await client.set(`${id.toString()}employeeid`, JSON.stringify(obj));
                // console.log("temp check...................", temp)

            } catch (err) {
                console.log(err)
            }
        }

        let addUrl;
        let livePrices = {};
        let dummyTesting = false;

        //console.log("temp check5...................")
        // if (dummyTesting) {
        //     console.log("temp check6...................")
        //     let filteredTicks = getFilteredTicks();
        //     if (filteredTicks.length > 0) {
        //         for (tick of filteredTicks) {
        //             livePrices[tick.instrument_token] = tick.last_price;
        //         }
        //     }
        //     console.log("temp check7...................")
        // } else {

        console.log("in main else")
        const contestInstruments = await Instrument.find({ status: "Active" }).select('instrumentToken exchange symbol');
        const data = await getKiteCred.getAccess();
        contestInstruments.forEach((elem, index) => {
            if (index === 0) {
                addUrl = ('i=' + elem.exchange + ':' + elem.symbol);
            } else {
                addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);
            }
        });
        const ltpBaseUrl = `https://api.kite.trade/quote?${addUrl}`;
        let auth = 'token' + data.getApiKey + ':' + data.getAccessToken;

        let authOptions = {
            headers: {
                'X-Kite-Version': '3',
                Authorization: auth,
            },
        };

        const response = await axios.get(ltpBaseUrl, authOptions);
        for (let instrument in response.data.data) {
            livePrices[response.data.data[instrument].instrument_token] = response.data.data[instrument].last_price;
        }
        //}

        let ranks;


        ranks = await DailyContestMockUser.aggregate([
            // Match documents for the given contestId
            {
                $match: {
                    contestId: new ObjectId(id),
                    status: "COMPLETE",
                }
            },
            // Group by userId and sum the amount
            {
                $group: {
                    _id: {
                        trader: "$trader",
                        // employeeid: "$employeeid",
                        instrumentToken: "$instrumentToken",
                        exchangeInstrumentToken: "$exchangeInstrumentToken",
                        symbol: "$symbol",
                        product: "$Product",
                    },
                    totalAmount: { $sum: { $multiply: ["$amount", -1] } },
                    investedAmount: {
                        $sum: {
                            $cond: {
                                if: { $gte: ["$amount", 0] },
                                then: "$amount",
                                else: 0
                            }
                        }
                    },
                    brokerage: {
                        $sum: {
                            $toDouble: "$brokerage",
                        },
                    },
                    lots: {
                        $sum: { $toInt: "$Quantity" }
                    }
                }
            },
            // Sort by totalAmount in descending order

            // Project the result to include only userId and totalAmount
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    totalAmount: 1,
                    investedAmount: 1,
                    brokerage: 1,
                    lots: 1
                }
            },
            {
                $addFields: {
                    rpnl: {
                        $multiply: ["$lots",]
                    }
                }
            },
        ]);


        // console.log("ranks, ", ranks)

        for (doc of ranks) {
            doc.rpnl = doc.lots * livePrices[doc.userId.instrumentToken];
            doc.npnl = doc.totalAmount + doc.rpnl - doc.brokerage;
        }


        async function aggregateRanks(ranks) {
            const result = {};
            for (const curr of ranks) {
                const { userId, npnl, investedAmount } = curr;
                const traderId = userId.trader;
                let employeeidObj = await client.get(`${(id).toString()}employeeid`);

                employeeidObj = JSON.parse(employeeidObj);
                // console.log("employeeid", employeeidObj)
                if (!result[traderId]) {
                    result[traderId] = {
                        traderId,
                        name: employeeidObj[traderId.toString()]?.employeeid,
                        npnl: 0,
                        userName: employeeidObj[traderId.toString()]?.name,
                        photo: employeeidObj[traderId.toString()]?.photo,
                        investedAmount: 0,

                    };
                }
                result[traderId].npnl += npnl;
                result[traderId].investedAmount += investedAmount
                // console.log("result", result)
            }
            return Object.entries(result).map(([key, value]) => value);
        }

        const result = await aggregateRanks(ranks);

        // console.log("rsult", result.length, id)
        for (let rank of result) {

            // if(id.toString() === "64b7770016c0eb3bec96a77b"){


            try {
                // if (await client.exists(`leaderboard:${id}`)) {
                await client.set(`${rank.name} investedAmount`, JSON.stringify(rank));
                await client.ZADD(`leaderboard:${id}`, {
                    score: rank.npnl,
                    value: JSON.stringify({ name: rank.name })
                });
                // }

            } catch (err) {
                // console.log(err);
            }
            // }

        }


        // await client.del(`leaderboard:${id}`)
        const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard:${id}`, "0", "19", 'WITHSCORES'])
        // console.log(leaderBoard, id)
        const formattedLeaderboard = await formatData(leaderBoard)

        return formattedLeaderboard;
    } catch (e) {
        console.log("redis error", e);
    }

    async function formatData(arr) {
        const formattedLeaderboard = [];

        for (let i = 0; i < arr.length; i += 2) {
            // Parse the JSON string to an object
            const obj = JSON.parse(arr[i]);
            // Add the npnl property to the object
            let data = await client.get(`${obj.name} investedAmount`)
            data = JSON.parse(data);
            obj.npnl = Number(arr[i + 1]);
            // obj.investedAmount = Number(investedAmount);
            obj.userName = data.userName;
            obj.photo = data.photo;
            // Add the object to the formattedLeaderboard array
            formattedLeaderboard.push(obj);
        }

        return formattedLeaderboard;
    }

}

const getRedisMyRank = async (id, employeeId) => {

    // console.log(id, employeeId, await client.exists(`leaderboard:${id}`))
    try {
        if (await client.exists(`leaderboard:${id}`)) {

            const leaderBoardRank = await client.ZREVRANK(`leaderboard:${id}`, JSON.stringify({ name: employeeId }));
            // console.log("leaderBoardRank", leaderBoardRank)
            // await client.del(`leaderboard:${id}`)
            if (leaderBoardRank == null) return null
            return leaderBoardRank + 1
        } else {
            console.log("loading rank")
        }

    } catch (err) {
        console.log(err);
    }

}

exports.getRedisMyRankHTTP = async (req, res) => {

    const { id } = req.params;
    const employeeId = req.user.employeeid;
    // console.log(id, employeeId, await client.exists(`leaderboard:${id}`))
    try {
        if (await client.exists(`leaderboard:${id}`)) {

            const leaderBoardRank = await client.ZREVRANK(`leaderboard:${id}`, JSON.stringify({ name: employeeId }));
            // console.log("leaderBoardRank", leaderBoardRank)

            if (leaderBoardRank == null) return null

            res.status(200).json({
                message: "success",
                data: leaderBoardRank + 1
            })
            // return leaderBoardRank + 1
        } else {
            console.log("loading rank")
            res.status(200).json({
                message: "error",
                data: "Loading rank"
            })
        }

    } catch (err) {
        console.log(err);
    }

}

let isProcessingQueue = false;
const contestQueue = [];

exports.sendLeaderboardData = async () => {
    try {
        const activeContest = await DailyContest.find({ contestStatus: "Active" });

        if (activeContest.length) {
            contestQueue.push(...activeContest);

            if (!isProcessingQueue) {
                // Start processing the queue and set the recurring interval
                isProcessingQueue = true;
                setInterval(processContestQueue, 5000);
            }
        }
    } catch (err) {
        console.log(err);
    }
};

async function processContestQueue() {
    const io = getIOValue();
    // Get the current time
    const currentTime = new Date();
    // Define the start and end time for processing (9 am to 3:18 pm)
    const startTime = new Date(currentTime);
    startTime.setHours(3, 0, 0, 0);

    const endTime = new Date(currentTime);
    endTime.setHours(9, 48, 0, 0);

    if (currentTime >= startTime && currentTime <= endTime) {
        console.log("1st if", contestQueue.length);

        // If the queue is empty, reset the processing flag and return
        if (contestQueue.length === 0) {
            // console.log("2nd if");
            isProcessingQueue = false;
            return;
        }

        // Process contests and emit the data
        for (const contest of contestQueue) {
            if (contest.contestStatus === "Active" && contest.contestStartTime <= new Date()) {
                console.log("in 2nd if", contest.contestStartTime, new Date(), contest.contestStatus)
                const leaderBoard = await dailyContestLeaderBoard(contest._id?.toString());
                console.log(leaderBoard, contest._id?.toString());
                io.to(`${contest._id?.toString()}`).emit(`contest-leaderboardData${contest._id?.toString()}`, leaderBoard);
            }
        }

    }
}



exports.sendMyRankData = async () => {
    const io = getIOValue();
    try {
        const activeContest = await DailyContest.find({ contestStatus: "Active" });


        if (activeContest.length) {
            const emitLeaderboardData = async () => {
                const currentTime = new Date();
                // Define the start and end time for processing (9 am to 3:18 pm)
                const startTime = new Date(currentTime);
                startTime.setHours(3, 0, 0, 0);
                const endTime = new Date(currentTime);
                endTime.setHours(9, 48, 0, 0);

                if (currentTime >= startTime && currentTime <= endTime) {
                    const contest = await DailyContest.find({ contestStatus: "Active", contestStartTime: { $lte: new Date() } });

                    for (let i = 0; i < contest?.length; i++) {
                        const room = io.sockets.adapter.rooms.get(contest[i]?._id?.toString());
                        const socketIds = Array.from(room ?? []);
                        for (let j = 0; j < socketIds?.length; j++) {
                            let userId = await client.get(socketIds[j]);
                            // console.log("userId", userId)
                            let data = await client.get(`dailyContestData:${userId}${contest[i]?._id?.toString()}`);
                            data = JSON.parse(data);
                            // console.log("data", data);
                            if (data) {
                                let { id, employeeId } = data;
                                const myRank = await getRedisMyRank(contest[i]?._id?.toString(), employeeId);
                                io.to(`${contest[i]?._id?.toString()}${userId?.toString()}`).emit(`contest-myrank${userId}${contest[i]?._id?.toString()}`, myRank);
                                // await client.del(`leaderboard:${contest[i]?._id?.toString()}`)
                                // io // Emit the leaderboard data to the client
                            }
                        }
                    }
                }
            };
            emitLeaderboardData();
            interval = setInterval(emitLeaderboardData, 5000);
        }
    } catch (err) {
        console.log(err);
    }

}

exports.emitServerTime = async () => {
    const io = getIOValue();
    const interval = setInterval(() => {
        io.emit('serverTime', new Date());
    }, 1000); // Emit every second (adjust as needed)
}