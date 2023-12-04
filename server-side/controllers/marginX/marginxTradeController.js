const MarginxMockUser = require("../../models/marginX/marginXUserMock");
const MarginxMockCompany = require("../../models/marginX/marginXCompanyMock");
// const InfinityTradeCompanyLive = require('../models/TradeDetails/liveTradeSchema')
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../../marketData/redisClient');
const MarginX = require("../../models/marginX/marginX");
// const InfinityTraderLive = require("../models/TradeDetails/infinityLiveUser")
const User = require("../../models/User/userDetailSchema")
const Instrument = require("../../models/Instruments/instrumentSchema")
const getKiteCred = require('../../marketData/getKiteCred');
const axios = require("axios")
const {getIOValue} = require('../../marketData/socketio');
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema");

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
        // console.log(`${req.user._id.toString()}${id.toString()} overallpnlMarginX`)
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} overallpnlMarginX`)) {
            let pnl = await client.get(`${req.user._id.toString()}${id.toString()} overallpnlMarginX`)
            pnl = JSON.parse(pnl);
            // console.log("pnl redis", pnl)

            res.status(201).json({ message: "pnl received", data: pnl });

        } else {

            let pnlDetails = await MarginxMockUser.aggregate([
                {
                    $match: {
                        trade_time: {
                            $gte: today
                        },
                        status: "COMPLETE",
                        trader: new ObjectId(userId),
                        marginxId: new ObjectId(id)
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
                            exchange: "$exchange",
                            validity: "$validity",
                            variety: "$variety",
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
                        product_type: new ObjectId("6517d40e3aeb2bb27d650de1")
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
            for (let elem of limitMargin) {
                arr.push({
                    _id: {
                        symbol: elem._id.symbol,
                        product: elem._id.product,
                        instrumentToken: elem._id.instrumentToken,
                        exchangeInstrumentToken: elem._id.exchangeInstrumentToken,
                        exchange: elem._id.exchange,
                        // validity: elem._id.validity,
                        // variety: elem._id.variety,
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
      
            if (isRedisConnected) {
                await client.set(`${req.user._id.toString()}${id.toString()} overallpnlMarginX`, JSON.stringify(newPnl))
                await client.expire(`${req.user._id.toString()}${id.toString()} overallpnlMarginX`, secondsRemaining);
            }

            // //console.log("pnlDetails", pnlDetails)
            res.status(201).json({ message: "pnl received", data: newPnl });
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
                    marginxId: new ObjectId(id)
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
                marginxId: new ObjectId(id)
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
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5
    const count = await MarginxMockUser.countDocuments({ trade_time_utc: { $gte: today }, trader: new ObjectId(userId), marginxId: new ObjectId(id) })
    
    try {
        const myTodaysTrade = await MarginxMockUser.find({ trade_time_utc: { $gte: today }, trader: new ObjectId(userId), marginxId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ status: 'success', data: myTodaysTrade, count: count });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.myAllOrder = async (req, res, next) => {

    const { id } = req.params;
    const userId = req.user._id;
    // let date = new Date();
    // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // todayDate = todayDate + "T00:00:00.000Z";
    // const today = new Date(todayDate);
    // const skip = parseInt(req.query.skip) || 0;
    // const limit = parseInt(req.query.limit) || 5
    const count = await MarginxMockUser.countDocuments({trader: new ObjectId(userId), marginxId: new ObjectId(id) })
    
    try {
        const myTodaysTrade = await MarginxMockUser.find({ trader: new ObjectId(userId), marginxId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
            .sort({ _id: -1 })
            // .skip(skip)
            // .limit(limit);

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

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} openingBalanceAndMargin`)) {
            let marginDetail = await client.get(`${req.user._id.toString()}${id.toString()} openingBalanceAndMargin`)
            marginDetail = JSON.parse(marginDetail);

            res.status(201).json({ message: "pnl received", data: marginDetail });

        } else {

            const marginx = await MarginX.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "marginx-templates",
                        localField: "marginXTemplate",
                        foreignField: "_id",
                        as: "templates",
                    },
                },
                {
                    $lookup: {
                        from: "marginx-mock-users",
                        localField: "_id",
                        foreignField: "marginxId",
                        as: "trades",
                    },
                },
                {
                    $unwind: {
                        path: "$trades",
                        includeArrayIndex: "string",
                    },
                },
                {
                    $match: {
                        "trades.trade_time_utc": { $lt: today },
                        "trades.status": "COMPLETE",
                        "trades.trader": new ObjectId(
                            req.user._id
                        ),
                    },
                },
                {
                    $group: {
                        _id: {
                            marginx: "$_id",
                            totalFund: {
                                $arrayElemAt: [
                                    "$templates.portfolioValue",
                                    0,
                                ],
                            },
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
                        marginx: "$_id.marginx",
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

            if (marginx.length > 0) {
                if (isRedisConnected) {
                    await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginMarginx`, JSON.stringify(marginx[0]))
                    await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginMarginx`, secondsRemaining);
                }
                res.status(200).json({ status: 'success', data: marginx[0] });
            } else {
                const portfolioValue = await MarginX.aggregate([
                    {
                        $match: {
                            _id: new ObjectId(id),
                        },
                    },
                    {
                        $lookup: {
                            from: "marginx-templates",
                            localField: "marginXTemplate",
                            foreignField: "_id",
                            as: "templates",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                marginx: "$_id",
                                totalFund: {
                                    $arrayElemAt: [
                                        "$templates.portfolioValue",
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            marginx: "$_id.marginx",
                            totalFund: "$_id.totalFund",
                        },
                    },
                ])
                if (isRedisConnected) {
                    await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginMarginx`, JSON.stringify(portfolioValue[0]))
                    await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginMarginx`, secondsRemaining);
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

        const data = await MarginxMockUser.aggregate([
            {
              $match:
                {
                  trader: new ObjectId(userId)
                },
            },
            {
              $group:
                {
                  _id: {
                    userId: "$trader",
                    marginxId: "$marginxId",
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
              $lookup:
                {
                  from: "daily-contests",
                  localField: "_id.marginxId",
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
              $lookup:
                {
                  from: "user-portfolios",
                  localField: "contestData.portfolio",
                  foreignField: "_id",
                  as: "portfolioData",
                },
            },
            {
              $unwind:
                {
                  path: "$portfolioData",
                },
            },
            {
              $project: {
                _id: 0,
                marginxId: "$_id.marginxId",
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

exports.overallMarginXTraderPnl = async (req, res, next) => {
    // console.log("Inside overall virtual pnl")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    // console.log(today)
    let pnlDetails = await MarginxMockCompany.aggregate([
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
    let pnlDetails = await MarginxMockCompany.aggregate([
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

exports.overallMarginXPnlYesterday = async (req, res, next) => {
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

        pnlDetailsData = await MarginxMockCompany.aggregate([
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

        // const contest = await MarginX.find({contestEndTime: {$gte: startTime, $lte: endTime}})

        if (!pnlDetailsData || pnlDetailsData.length === 0) {
            pnlDetailsData = null;  // reset the value to ensure the while loop continues
            
            i++;  // increment the day counter
        }
    }

    console.log("pnlDetailsData", pnlDetailsData)

    res.status(201).json({
        message: "pnl received",
        data: pnlDetailsData ? pnlDetailsData : [],
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
    let pnlDetails = await MarginxMockCompany.aggregate([
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
                marginxId: new ObjectId(id)
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

    let x = await MarginxMockCompany.aggregate(pipeline)
    // console.log(id, x)
    res.status(201).json({ message: "data received", data: x });
}

exports.overallMarginXCompanySidePnlThisMonth = async (req, res, next) => {
    // const { ydate } = req.params;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
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
                    $lte: yesterdayDate
                },
                status: "COMPLETE",
            }
        },
        {
            $group:
            {
                _id:null,
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

    let x = await MarginxMockCompany.aggregate(pipeline)
    console.log("MTD",x)
    res.status(201).json({ message: "data received", data: x ? x : [] });
}

exports.overallMarginXCompanySidePnlLifetime = async (req, res, next) => {
    // const { ydate } = req.params;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    yesterdayDate = yesterdayDate + "T23:59:59.000Z";
    // const today = new Date(todayDate);
    // let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
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
                _id:null,
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

    let x = await MarginxMockCompany.aggregate(pipeline)
    // console.log("Lifetime",x)
    res.status(201).json({ message: "data received", data: x ? x : [] });
}

exports.traderWiseMockTraderSide = async (req, res, next) => {
    const { id } = req.params;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const pipeline = [
        {
            $facet:

            {
                "pnl": [
                    {
                        $match: {
                            status: "COMPLETE",
                            marginxId: new ObjectId(
                                id
                            ),
                        },
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
                        $group: {
                            _id: {
                                traderId: "$trader",
                                traderName: {
                                    $arrayElemAt: ["$user.name", 0],
                                },
                                symbol: "$instrumentToken",
                                exchangeInstrumentToken:
                                    "$exchangeInstrumentToken",
                                traderEmail: {
                                    $arrayElemAt: [
                                        "$user.email",
                                        0,
                                    ],
                                },
                                traderMobile: {
                                    $arrayElemAt: [
                                        "$user.mobile",
                                        0,
                                    ],
                                },
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
                ],
                "cumm_return": [
                    {
                        $match: {
                            status: "COMPLETE",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                trader: "$trader",
                                marginxId: "$marginxId",
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
                        },
                    },
                    {
                        $lookup: {
                            from: "marginxes",
                            localField: "_id.marginxId",
                            foreignField: "_id",
                            as: "marginx",
                        },
                    },
                    {
                        $lookup: {
                            from: "marginx-templates",
                            localField:
                                "marginx.marginXTemplate",
                            foreignField: "_id",
                            as: "templates",
                        },
                    },
                    {
                        $project: {
                            marginxId: "$_id.marginxId",
                            _id: 0,
                            trader: "$_id.trader",
                            npnl: {
                                $subtract: [
                                    "$amount",
                                    "$brokerage",
                                ],
                            },
                            portfolioValue: {
                                $arrayElemAt: [
                                    "$templates.portfolioValue",
                                    0,
                                ],
                            },
                            entryFee: {
                                $arrayElemAt: [
                                    "$templates.entryFee",
                                    0,
                                ],
                            },
                            return: {
                                $divide: [
                                    {
                                        $subtract: [
                                            "$amount",
                                            "$brokerage",
                                        ],
                                    },
                                    {
                                        $divide: [
                                            {
                                                $arrayElemAt: [
                                                    "$templates.portfolioValue",
                                                    0,
                                                ],
                                            },
                                            {
                                                $arrayElemAt: [
                                                    "$templates.entryFee",
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                trader: "$trader",
                            },
                            cumm_return: {
                                $sum: "$return",
                            },
                        },
                    },
                    {
                        $project: {
                            trader: "$_id.trader",
                            cumm_return: "$cumm_return",
                            _id: 0,
                        },
                    },
                ],
            },
        },
    ]

    const data = await MarginxMockUser.aggregate(pipeline);
    // console.log(data)
    const traderWise = data[0].pnl;
    const cumm_return = data[0].cumm_return;

    if(traderWise.length > 0){
        for(let elem of traderWise){
            for(let subelem of cumm_return){
                if(elem._id.traderId.toString() === subelem.trader.toString()){
                    elem.cumm_return = subelem.cumm_return;
                }
            }
        }
    }

    res.status(201).json({ message: "data received", data: traderWise });
}

exports.MarginXPnlTWise = async (req, res, next) => {

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
                marginxId: new ObjectId(id)
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
            $match: {
                status: "COMPLETE",
                marginxId: new ObjectId(
                    id
                ),
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    marginxId: "$marginxId",
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
            },
        },
        {
            $lookup: {
                from: "marginxes",
                localField: "_id.marginxId",
                foreignField: "_id",
                as: "marginx",
            },
        },
        {
            $lookup: {
                from: "marginx-templates",
                localField: "marginx.marginXTemplate",
                foreignField: "_id",
                as: "templates",
            },
        },
        {
            $project: {
                marginxId: "$_id.marginxId",
                _id: 0,
                trader: "$_id.trader",
                npnl: {
                    $subtract: ["$amount", "$brokerage"],
                },
                portfolioValue: {
                    $arrayElemAt: [
                        "$templates.portfolioValue",
                        0,
                    ],
                },
                entryFee: {
                    $arrayElemAt: ["$templates.entryFee", 0],
                },
                return: {
                    $divide: [
                        {
                            $subtract: ["$amount", "$brokerage"],
                        },
                        {
                            $divide: [
                                {
                                    $arrayElemAt: [
                                        "$templates.portfolioValue",
                                        0,
                                    ],
                                },
                                {
                                    $arrayElemAt: [
                                        "$templates.entryFee",
                                        0,
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        },
        {
            $group: {
                _id: {
                    // trader: "$trader",
                },
                cumm_return: {
                    $sum: "$return",
                },
            },
        },
        {
            $project: {
                trader: "$_id.trader",
                total_return: "$cumm_return",
                _id: 0,
            },
        },
    ]

    let user = await MarginxMockUser.aggregate(pipeline1)
    let x = await MarginxMockCompany.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x, user: user[0] });
}

exports.MarginxPnlTWiseTraderSide = async (req, res, next) => {

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
                marginxId: new ObjectId(id)
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
          $match: {
            status: "COMPLETE",
            marginxId: new ObjectId(
              id
            ),
          },
        },
        {
          $group: {
            _id: {
              trader: "$trader",
              marginxId: "$marginxId",
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
          },
        },
        {
          $lookup: {
            from: "marginxes",
            localField: "_id.marginxId",
            foreignField: "_id",
            as: "marginx",
          },
        },
        {
          $lookup: {
            from: "marginx-templates",
            localField: "marginx.marginXTemplate",
            foreignField: "_id",
            as: "templates",
          },
        },
        {
          $project: {
            marginxId: "$_id.marginxId",
            _id: 0,
            trader: "$_id.trader",
            npnl: {
              $subtract: ["$amount", "$brokerage"],
            },
            portfolioValue: {
              $arrayElemAt: [
                "$templates.portfolioValue",
                0,
              ],
            },
            entryFee: {
              $arrayElemAt: ["$templates.entryFee", 0],
            },
            return: {
              $divide: [
                {
                  $subtract: ["$amount", "$brokerage"],
                },
                {
                  $divide: [
                    {
                      $arrayElemAt: [
                        "$templates.portfolioValue",
                        0,
                      ],
                    },
                    {
                      $arrayElemAt: [
                        "$templates.entryFee",
                        0,
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              // trader: "$trader",
            },
            cumm_return: {
              $sum: "$return",
            },
          },
        },
        {
          $project: {
            trader: "$_id.trader",
            total_return: "$cumm_return",
            _id: 0,
          },
        },
      ]

    let user = await MarginxMockUser.aggregate(pipeline1)
    let x = await MarginxMockUser.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x, user: user[0] });
}

exports.MarginXPayoutChart = async (req, res, next) => {

    let pipeline = [
        {
            $match: {
                status: "COMPLETE",
            },
        },
        {
            $lookup: {
                from: "marginxes",
                localField: "marginxId",
                foreignField: "_id",
                as: "marginXData",
            },
        },
        {
            $lookup: {
                from: "marginx-templates",
                localField: "marginXData.marginXTemplate",
                foreignField: "_id",
                as: "templateData",
            },
        },
        {
            $unwind: {
                path: "$marginXData",
            },
        },
        {
            $unwind: {
                path: "$templateData",
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    marginXId: "$marginxId",
                    marginXName: "$marginXData.marginXName",
                    date: {
                        $substr: ["$marginXData.startTime", 0, 10],
                    },
                    entryFee: "$templateData.entryFee",
                    portfolioValue: "$templateData.portfolioValue"
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
                payout: {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $add: [
                                        "$_id.entryFee",
                                        {
                                            $divide: ["$npnl", {
                                                $divide: ["$_id.portfolioValue", "$_id.entryFee"]
                                            }]
                                        }
                                    ]
                                },
                                0
                            ]
                        },
                        {
                            $add: [
                                "$_id.entryFee",
                                {
                                    $divide: ["$npnl", {
                                        $divide: ["$_id.portfolioValue", "$_id.entryFee"]
                                    }]
                                }
                            ]
                        },
                        0
                    ]
                }
                
            },
        },
        {
            $group: {
                _id: {
                    marginXId: "$_id.marginXId",
                    marginXName: "$_id.marginXName",
                    date: "$_id.date",
                },
                totalNpnl: {
                    $sum: "$npnl",
                },
                totalPayout: {
                    $sum: "$payout",
                },
            },
        },
        {
            $project: {
                marginXId: "$_id.marginxId",
                marginXName: "$_id.marginXName",
                marginXDate: "$_id.date",
                totalNpnl: 1,
                totalPayout: 1,
                _id: 0,
            },
        },
        {
            $sort: {
                marginXDate: -1,
            },
        },
        {
            $group: {
                _id: {
                    marginXDate: "$marginXDate",
                },
                totalNpnl: {
                    $sum: "$totalNpnl",
                },
                totalPayout: {
                    $sum: "$totalPayout",
                },
                numberOfMarginX: {
                    $sum: 1,
                },
            },
        },
        {
            $project: {
                _id: 0,
                marginXDate: "$_id.marginXDate",
                totalNpnl: 1,
                totalPayout: 1,
                numberOfMarginX: 1,
            },
        },
        {
            $sort: {
                marginXDate: 1
            }
        }
    ]

    let x = await MarginxMockUser.aggregate(pipeline) 

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

                ranks = await MarginxMockUser.aggregate([
                    // Match documents for the given marginxId
                    {
                        $match: {
                            marginxId: new ObjectId(id),
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
