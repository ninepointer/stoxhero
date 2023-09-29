const BattleMock = require("../../models/battle/battleTrade");
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../../marketData/redisClient');
const Battle = require("../../models/battle/battle");
const {getIOValue} = require('../../marketData/socketio');
const User = require("../../models/User/userDetailSchema");
const Instrument = require("../../models/Instruments/instrumentSchema")
const getKiteCred = require('../../marketData/getKiteCred');
const axios = require("axios")
const Wallet = require("../../models/UserWallet/userWalletSchema")
const Transaction = require('../../models/Transactions/Transaction');
const uuid = require("uuid");
const sendMail = require('../../utils/emailService');
const {createUserNotification} = require('../../controllers/notification/notificationController');
const mongoose = require('mongoose');
const Setting = require("../../models/settings/setting")


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
        // console.log(`${req.user._id.toString()}${id.toString()} overallpnlBattle`)
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${id.toString()} overallpnlBattle`)) {
            let pnl = await client.get(`${req.user._id.toString()}${id.toString()} overallpnlBattle`)
            pnl = JSON.parse(pnl);
            // console.log("pnl redis", pnl)

            res.status(201).json({ message: "pnl received", data: pnl });

        } else {

            let pnlDetails = await BattleMock.aggregate([
                {
                    $match: {
                        trade_time: {
                            $gte: today
                        },
                        status: "COMPLETE",
                        trader: new ObjectId(userId),
                        battleId: new ObjectId(id)
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
                await client.set(`${req.user._id.toString()}${id.toString()} overallpnlBattle`, JSON.stringify(pnlDetails))
                await client.expire(`${req.user._id.toString()}${id.toString()} overallpnlBattle`, secondsRemaining);
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
                    battleId: new ObjectId(id)
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
                battleId: new ObjectId(id)
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
    const count = await BattleMock.countDocuments({ trade_time_utc: { $gte: today }, trader: new ObjectId(userId), battleId: new ObjectId(id) })
    
    try {
        const myTodaysTrade = await BattleMock.find({ trade_time_utc: { $gte: today }, trader: new ObjectId(userId), battleId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
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
    console.log(id, userId)
    
    try {
        const count = await BattleMock.countDocuments({trader: new ObjectId(userId), battleId: new ObjectId(id) })

        const myTodaysTrade = await BattleMock.find({ trader: new ObjectId(userId), battleId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
            .sort({ _id: -1 })

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

            const battle = await Battle.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "battle-templates",
                        localField: "battleTemplate",
                        foreignField: "_id",
                        as: "templates",
                    },
                },
                {
                    $lookup: {
                        from: "battle-mock-users",
                        localField: "_id",
                        foreignField: "battleId",
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
                            battle: "$_id",
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
                        battle: "$_id.battle",
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

            if (battle.length > 0) {
                if (isRedisConnected) {
                    await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginBattle`, JSON.stringify(battle[0]))
                    await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginBattle`, secondsRemaining);
                }
                res.status(200).json({ status: 'success', data: battle[0] });
            } else {
                const portfolioValue = await Battle.aggregate([
                    {
                        $match: {
                            _id: new ObjectId(id),
                        },
                    },
                    {
                        $lookup: {
                            from: "battle-templates",
                            localField: "battleTemplate",
                            foreignField: "_id",
                            as: "templates",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                battle: "$_id",
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
                            battle: "$_id.battle",
                            totalFund: "$_id.totalFund",
                        },
                    },
                ])
                // console.log(portfolioValue, new ObjectId(id), req.user._id)
                if (isRedisConnected) {
                    let data = JSON.stringify(portfolioValue[0]);
                    await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginBattle`, data)
                    await client.expire(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginBattle`, secondsRemaining);
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

        const data = await BattleMock.aggregate([
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
                    battleId: "$battleId",
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
                  localField: "_id.battleId",
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
                battleId: "$_id.battleId",
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
                            battleId: new ObjectId(
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
                                battleId: "$battleId",
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
                            from: "battles",
                            localField: "_id.battleId",
                            foreignField: "_id",
                            as: "battle",
                        },
                    },
                    {
                        $lookup: {
                            from: "battle-templates",
                            localField:
                                "battle.battleTemplate",
                            foreignField: "_id",
                            as: "templates",
                        },
                    },
                    {
                        $project: {
                            battleId: "$_id.battleId",
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

    const data = await BattleMock.aggregate(pipeline);
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

exports.BattlePnlTWise = async (req, res, next) => {

    let { id } = req.params

    let pipeline1 = [
        {
            $match: {
                status: "COMPLETE",
                battleId: new ObjectId(
                    id
                ),
            },
        },
        {
            $group: {
                _id: {
                    trader: "$trader",
                    battleId: "$battleId",
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
                from: "battles",
                localField: "_id.battleId",
                foreignField: "_id",
                as: "battle",
            },
        },
        {
            $lookup: {
                from: "battle-templates",
                localField: "battle.battleTemplate",
                foreignField: "_id",
                as: "templates",
            },
        },
        {
            $project: {
                battleId: "$_id.battleId",
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

    let user = await BattleMock.aggregate(pipeline1)
    // let x = await BattleMockCompany.aggregate(pipeline)

    res.status(201).json({ message: "data received", user: user[0] });
}

exports.BattlePnlTWiseTraderSide = async (req, res, next) => {

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
                battleId: new ObjectId(id)
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
            _id: new ObjectId(id),
          },
        },
        {
          $unwind: {
            path: "$participants",
          },
        },
        {
          $project: {
            trader: "$participants.userId",
            payout: "$participants.reward",
            rank: "$participants.rank",
            _id: 0,
          },
        },
      ]

    let payout = await Battle.aggregate(pipeline1)
    let x = await BattleMock.aggregate(pipeline)

    for( let elem of x){
        for(let subelem of payout){
            if(elem.userId.toString() === subelem.trader.toString()){
                elem.payout = subelem.payout;
                elem.rank = subelem.rank;
            }
        }
    }

    res.status(201).json({ message: "data received", data: x });
}

exports.BattlePayoutChart = async (req, res, next) => {

    let pipeline = [
        {
            $match: {
                status: "COMPLETE",
            },
        },
        {
            $lookup: {
                from: "battles",
                localField: "battleId",
                foreignField: "_id",
                as: "battleData",
            },
        },
        {
            $lookup: {
                from: "battle-templates",
                localField: "battleData.battleTemplate",
                foreignField: "_id",
                as: "templateData",
            },
        },
        {
            $unwind: {
                path: "$battleData",
            },
        },
        {
            $match: {
                "battleData.status": "Completed",
                "battleData.battleStatus": "Completed",
                "battleData.payoutStatus": "Completed",
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
                    battleId: "$battleId",
                    battleName: "$battleData.battleName",
                    date: {
                        $substr: [
                            "$battleData.battleStartTime",
                            0,
                            10,
                        ],
                    },
                    entryFee: "$templateData.entryFee",
                    portfolioValue:
                        "$templateData.portfolioValue",
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
            },
        },
        {
            $group: {
                _id: {
                    battleId: "$_id.battleId",
                    battleName: "$_id.battleName",
                    date: "$_id.date",
                },
                totalNpnl: {
                    $sum: "$npnl",
                },
            },
        },
        {
            $project: {
                battleId: "$_id.battleId",
                battleName: "$_id.battleName",
                BattleDate: "$_id.date",
                totalNpnl: 1,
                _id: 0,
            },
        },
        {
            $sort: {
                BattleDate: -1,
            },
        },
        {
            $group: {
                _id: {
                    BattleDate: "$BattleDate",
                },
                totalNpnl: {
                    $sum: "$totalNpnl",
                },
                numberOfBattle: {
                    $sum: 1,
                },
            },
        },
        {
            $project: {
                _id: 0,
                BattleDate: "$_id.BattleDate",
                totalNpnl: 1,
                numberOfBattle: 1,
            },
        },
        {
            $sort: {
                BattleDate: 1,
            },
        },
    ]

    let pipeline1 = [
        {
            $match: {
                status: "Completed",
                battleStatus: "Completed",
                payoutStatus: "Completed",
            },
        },
        {
            $unwind: {
                path: "$participants",
            },
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$battleStartTime",
                        },
                    },
                },
                payout: {
                    $sum: "$participants.reward",
                },
            },
        },
        {
            $project: {
                date: "$_id.date",
                _id: 0,
                payout: "$payout",
            },
        },
    ]



    let x = await BattleMock.aggregate(pipeline);
    let payout = await Battle.aggregate(pipeline1); 

    for(let elem of x){
        for(let subelem of payout){
            // console.log(elem.BattleDate , subelem.date)
            if(elem.BattleDate === subelem.date){
                // console.log("in if")
                elem.totalPayout = subelem.payout;
            }
        }
    }

    // console.log(x, payout)

    res.status(201).json({ message: "data received", data: x });
}

exports.sendLeaderboardDataBattle = async () => {
    try {
        const activeBattle = await Battle.find({ status: "Active" });

        if (activeBattle.length) {
            // console.log("activeBattle", activeBattle.length)
            contestQueue.push(...activeBattle);

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
    // if (currentTime >= startTime && currentTime <= endTime) {

        // If the queue is empty, reset the processing flag and return
        if (contestQueue.length === 0) {
            // console.log("2nd if");
            isProcessingQueue = false;
            return;
        }

        // Process contests and emit the data
        // console.log("contestQueue", contestQueue.length)
        for (const battle of contestQueue) {
            // console.log(battle)
            if ((battle.status === "Active" )&& (battle.battleStartTime <= new Date())) {
                // console.log("battle", battle.battleName)
                const leaderBoard = await battleLeaderBoard(battle._id?.toString());
                // console.log(leaderBoard, battle._id?.toString());
                io.to(`${battle._id?.toString()}`).emit(`battle-leaderboardData${battle._id?.toString()}`, leaderBoard);
            }
        }

    // }
}

const battleLeaderBoard = async (id) => {
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

        let addUrl;
        let livePrices = {};
        let dummyTesting = false;
        if (dummyTesting) {
            let filteredTicks = getFilteredTicks();
            if (filteredTicks.length > 0) {
                for (tick of filteredTicks) {
                    livePrices[tick.instrument_token] = tick.last_price;
                }
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
            const ltpBaseUrl = `https://api.kite.trade/quote/ltp?${addUrl}`;
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


        ranks = await BattleMock.aggregate([
            // Match documents for the given contestId
            {
                $match: {
                    battleId: new ObjectId(id),
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

        for (doc of ranks) {
            doc.rpnl = doc.lots * livePrices[doc.userId.instrumentToken];
            doc.npnl = doc.totalAmount + doc.rpnl - doc.brokerage;
        }

        const result = await aggregateRanks(ranks, id);

        // console.log("rsult", result, id)
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
        const formattedLeaderboard = await formatData(leaderBoard)
        // console.log(formattedLeaderboard)

        return formattedLeaderboard;
    } catch (e) {
        console.log("redis error", e);
    }

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

async function aggregateRanks(ranks, id) {
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

let isProcessingQueue = false;
const contestQueue = [];
exports.sendMyRankDataBattle = async () => {
    const io = getIOValue();
    try{
        const activeBattle = await Battle.find({status: "Active"});


        if(activeBattle.length){
            emitLeaderboardData();
            interval = setInterval(emitLeaderboardData, 5000);    
        }
    } catch(err){
        console.log(err);
    }

}

const emitLeaderboardData = async () => {
    const io = getIOValue();
    const currentTime = new Date();
    // Define the start and end time for processing (9 am to 3:18 pm)
    const startTime = new Date(currentTime);
    startTime.setHours(3, 0, 0, 0);
    const endTime = new Date(currentTime);
    endTime.setHours(9, 48, 0, 0);

    // if (currentTime >= startTime && currentTime <= endTime) {
        const battle = await Battle.find({status: "Active", battleStartTime: {$lte: new Date()}});

        // console.log("battle", battle)
        for(let i = 0; i < battle?.length; i++){
            const room = io.sockets.adapter.rooms.get(battle[i]?._id?.toString());
            const socketIds = Array.from(room ?? []);
            for(let j = 0; j < socketIds?.length; j++){
                let userId = await client.get(socketIds[j]);
                // console.log("userId", userId)
                let data = await client.get(`battleData:${userId}${battle[i]?._id?.toString()}`);
                data = JSON.parse(data);
                if(data){
                    let {id, employeeId} = data;
                    const myRank = await getRedisMyRank(battle[i]?._id?.toString(), employeeId);
                    // console.log(myRank)
                    io.to(`${battle[i]?._id?.toString()}${userId?.toString()}`).emit(`battle-myrank${userId}${battle[i]?._id.toString()}`, myRank);
                    // await client.del(`leaderboard:${battle[i]?._id?.toString()}`)
                    // io // Emit the leaderboard data to the client
                }

            }

        }
//    }
};

const getRedisMyRank = async (id, employeeId) => {

    // console.log(id, employeeId, await client.exists(`leaderboard:${id}`))
    try {
        if (await client.exists(`leaderboard:${id}`)) {

            const leaderBoardRank = await client.ZREVRANK(`leaderboard:${id}`, JSON.stringify({ name: employeeId }));
            // console.log("leaderBoardRank", leaderBoardRank, id, employeeId)
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


exports.creditAmountToWalletBattle = async () => {
    console.log("in wallet")
    try {
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);
        const setting = await Setting.find();
        const battle = await Battle.find({ status: "Completed", payoutStatus: "Not Started", battleEndTime: {$gte: today} });

        // console.log(battle.length, battle)
        for (let j = 0; j < battle.length; j++) {

            const userBattleWise = await BattleMock.aggregate([
                {
                    $match: {
                        status: "COMPLETE",
                        trade_time_utc: {
                            $gte: today,
                        },
                        battleId: new ObjectId(
                            battle[j]._id
                        ),
                    },
                },
                {
                    $group: {
                        _id: {
                            userId: "$trader",
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
                    $project: {
                        userId: "$_id.userId",
                        _id: 0,
                        npnl: {
                            $subtract: ["$amount", "$brokerage"],
                        },
                    },
                },
                {
                    $sort:
                    {
                        npnl: -1,
                    },
                },
            ])

            const rewardData = await getPrizeDetails(battle[j]._id);

            console.log("rewardData", rewardData)

            for(let i = 0; i < userBattleWise.length; i++){
                const session = await mongoose.startSession();
                try{
                    session.startTransaction();
                    const preDefinedReward = rewardData.reward;
                    const wallet = await Wallet.findOne({ userId: new ObjectId(userBattleWise[i].userId) });

                    if(preDefinedReward[preDefinedReward.length-1].rank >= i+1){
                        for(const elem of preDefinedReward){

                            elem.reward = (elem.reward) - (elem.reward)*setting[0]?.tdsPercentage/100;

                            if(elem.rank === i+1){
                                console.log("user in top", userBattleWise[i].userId, battle[j].battleName, elem.reward, elem.rank)
                                wallet.transactions = [...wallet.transactions, {
                                    title: 'Battle Credit',
                                    description: `Amount credited for battle ${battle[j].battleName}`,
                                    transactionDate: new Date(),
                                    amount: elem.reward?.toFixed(2),
                                    transactionId: uuid.v4(),
                                    transactionType: 'Cash'
                                }];
                                await wallet.save({session});
        
                                const transacation = await Transaction.create({
                                    transactionCategory: 'Debit',
                                    transactionBy: '63ecbc570302e7cf0153370c',
                                    transactionAmount: elem.reward?.toFixed(2),
                                    transactionFor: 'Battle',
                                    transactionStatus: 'Complete',
                                    transactionMode: 'Wallet',
                                    currency: 'INR',
                                    transactionType: 'Cash',
                                    wallet: wallet._id
                                });
        
                                for(let subelem of battle[j]?.participants){
                                    if(subelem.userId.toString() === userBattleWise[i].userId.toString()){
                                        subelem.reward = elem.reward?.toFixed(2);
                                        subelem.rank = elem.rank;
                                    }
                                }
        
                                await battle[j].save({session});

                                const user = await User.findOne({_id: new ObjectId(userBattleWise[i].userId)}).select('first_name last_name email');

                                if (process.env.PROD == 'true') {
                                    sendMail(user?.email, 'Battle Reward Credited - StoxHero', `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>Amount Credited</title>
                                        <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            font-size: 16px;
                                            line-height: 1.5;
                                            margin: 0;
                                            padding: 0;
                                        }
                            
                                        .container {
                                            max-width: 600px;
                                            margin: 0 auto;
                                            padding: 20px;
                                            border: 1px solid #ccc;
                                        }
                            
                                        h1 {
                                            font-size: 24px;
                                            margin-bottom: 20px;
                                        }
                            
                                        p {
                                            margin: 0 0 20px;
                                        }
                            
                                        .userid {
                                            display: inline-block;
                                            background-color: #f5f5f5;
                                            padding: 10px;
                                            font-size: 15px;
                                            font-weight: bold;
                                            border-radius: 5px;
                                            margin-right: 10px;
                                        }
                            
                                        .password {
                                            display: inline-block;
                                            background-color: #f5f5f5;
                                            padding: 10px;
                                            font-size: 15px;
                                            font-weight: bold;
                                            border-radius: 5px;
                                            margin-right: 10px;
                                        }
                            
                                        .login-button {
                                            display: inline-block;
                                            background-color: #007bff;
                                            color: #fff;
                                            padding: 10px 20px;
                                            font-size: 18px;
                                            font-weight: bold;
                                            text-decoration: none;
                                            border-radius: 5px;
                                        }
                            
                                        .login-button:hover {
                                            background-color: #0069d9;
                                        }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                        <h1>Amount Credited</h1>
                                        <p>Hello ${user.first_name},</p>
                                        <p>Amount of ${elem.reward?.toFixed(2)}INR has been credited in your StoxHero wallet as reward for ${battle[j].battleName}</p>
                                        <p>You can now purchase Tenx and participate in various activities on StoxHero.</p>
                                        
                                        <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                                        <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                                        <br/><br/>
                                        <p>Thanks,</p>
                                        <p>StoxHero Team</p>
                            
                                        </div>
                                    </body>
                                    </html>
                                    `);
                                }
                                await createUserNotification({
                                    title:'Battle Payout Credited',
                                    description:`₹${elem.reward?.toFixed(2)} credited to your wallet for your battle reward`,
                                    notificationType:'Individual',
                                    notificationCategory:'Informational',
                                    productCategory:'Battle',
                                    user: user?._id,
                                    priority:'Low',
                                    channels:['App', 'Email'],
                                    createdBy:'63ecbc570302e7cf0153370c',
                                    lastModifiedBy:'63ecbc570302e7cf0153370c'  
                                  }, session);
                            }
                        }
                    } else{
                        const remainingInitialRank = rewardData.remainWinnerStart;
                        const finalRank = rewardData.totalWinner;
                        const remainingRewardWithoutTDS = rewardData.remainingReward

                        const remainingReward = remainingRewardWithoutTDS - remainingRewardWithoutTDS*setting[0]?.tdsPercentage/100;

                        for(let k = remainingInitialRank; k <= finalRank; k++){
                            if(k === i+1){

                                console.log("users", userBattleWise[i].userId, battle[j].battleName, remainingReward)
                                wallet.transactions = [...wallet.transactions, {
                                    title: 'Battle Credit',
                                    description: `Amount credited for battle ${battle[j].battleName}`,
                                    transactionDate: new Date(),
                                    amount: remainingReward?.toFixed(2),
                                    transactionId: uuid.v4(),
                                    transactionType: 'Cash'
                                }];
                                await wallet.save({session});

                                const transacation = await Transaction.create({
                                    transactionCategory: 'Debit',
                                    transactionBy: '63ecbc570302e7cf0153370c',
                                    transactionAmount: remainingReward?.toFixed(2),
                                    transactionFor: 'Battle',
                                    transactionStatus: 'Complete',
                                    transactionMode: 'Wallet',
                                    currency: 'INR',
                                    transactionType: 'Cash',
                                    wallet: wallet._id
                                });
        
                                for(let subelem of battle[j]?.participants){
                                    if(subelem.userId.toString() === userBattleWise[i].userId.toString()){
                                        subelem.reward = remainingReward?.toFixed(2);
                                        subelem.rank = k;
                                    }
                                }
        
                                await battle[j].save({session});

                                const user = await User.findOne({_id: new ObjectId(userBattleWise[i].userId)}).select('first_name last_name email')

                                if (process.env.PROD == 'true') {
                                    sendMail(user?.email, 'Battle Reward Credited - StoxHero', `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>Amount Credited</title>
                                        <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            font-size: 16px;
                                            line-height: 1.5;
                                            margin: 0;
                                            padding: 0;
                                        }
                            
                                        .container {
                                            max-width: 600px;
                                            margin: 0 auto;
                                            padding: 20px;
                                            border: 1px solid #ccc;
                                        }
                            
                                        h1 {
                                            font-size: 24px;
                                            margin-bottom: 20px;
                                        }
                            
                                        p {
                                            margin: 0 0 20px;
                                        }
                            
                                        .userid {
                                            display: inline-block;
                                            background-color: #f5f5f5;
                                            padding: 10px;
                                            font-size: 15px;
                                            font-weight: bold;
                                            border-radius: 5px;
                                            margin-right: 10px;
                                        }
                            
                                        .password {
                                            display: inline-block;
                                            background-color: #f5f5f5;
                                            padding: 10px;
                                            font-size: 15px;
                                            font-weight: bold;
                                            border-radius: 5px;
                                            margin-right: 10px;
                                        }
                            
                                        .login-button {
                                            display: inline-block;
                                            background-color: #007bff;
                                            color: #fff;
                                            padding: 10px 20px;
                                            font-size: 18px;
                                            font-weight: bold;
                                            text-decoration: none;
                                            border-radius: 5px;
                                        }
                            
                                        .login-button:hover {
                                            background-color: #0069d9;
                                        }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                        <h1>Amount Credited</h1>
                                        <p>Hello ${user.first_name},</p>
                                        <p>Amount of ${remainingReward?.toFixed(2)}INR has been credited in your StoxHero wallet as reward for ${battle[j].battleName}.</p>
                                        <p>You can now purchase Tenx and participate in various activity on StoxHero.</p>
                                        
                                        <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
                                        <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
                                        <br/><br/>
                                        <p>Thanks,</p>
                                        <p>StoxHero Team</p>
                            
                                        </div>
                                    </body>
                                    </html>
                                    `);
                                }
                                await createUserNotification({
                                    title:'Battle Payout Credited',
                                    description:`₹${remainingReward?.toFixed(2)} credited to your wallet for your battle reward`,
                                    notificationType:'Individual',
                                    notificationCategory:'Informational',
                                    productCategory:'Battle',
                                    user: user?._id,
                                    priority:'Low',
                                    channels:['App', 'Email'],
                                    createdBy:'63ecbc570302e7cf0153370c',
                                    lastModifiedBy:'63ecbc570302e7cf0153370c'  
                                  }, session);
                            }

                            if (i + 1 > finalRank) {
                                for (let subelem of battle[j]?.participants) {
                                console.log("updating feilds")
                                if (subelem.userId.toString() === userBattleWise[i].userId.toString()) {
                                    subelem.reward = 0;
                                    subelem.rank = i+1;
                                }
                                }
                    
                                await battle[j].save();
                            }
                        }
                }
                await session.commitTransaction();
                }catch(e){
                    console.log(e);
                    await session.abortTransaction();
                }finally{
                  await session.endSession();
                }
                
            }

            battle[j].payoutStatus = 'Completed'
            battle[j].status = "Completed";
            await battle[j].save();
        }

    } catch (error) {
        console.log(error);
    }
};

const getPrizeDetails = async (battleId) => {
    try {
        // 1. Get the corresponding battleTemplate for a given battle
        const battle = await Battle.findById(battleId).populate('battleTemplate');
        if (!battle || !battle.battleTemplate) {
            return res.status(404).json({status:'error', message: "Battle or its template not found." });
        }

        const template = battle.battleTemplate;

        // Calculate the Expected Collection
        const expectedCollection = template.entryFee * template.minParticipants;
        let collection = expectedCollection;
        let battleParticipants = template?.minParticipants;
        if(battle?.participants?.length > template?.minParticipants){
            battleParticipants = battle?.participants?.length;
            collection = template?.entryFee * battleParticipants;
        }

        // Calculate the Prize Pool
        let prizePool = collection - (collection * template.gstPercentage / 100)
        prizePool = prizePool - (prizePool * template.platformCommissionPercentage / 100);

        console.log(prizePool);

        // Calculate the total number of winners
        const totalWinners = Math.round(template.winnerPercentage * battleParticipants / 100);

        // Determine the reward distribution for each rank mentioned in the rankingPayout
        let totalRewardDistributed = 0;
        const rankingReward = template.rankingPayout.map((rankPayout) => {
            const reward = prizePool * rankPayout.rewardPercentage / 100;
            totalRewardDistributed += reward;
            return {
                rank: rankPayout.rank,
                reward: reward,
                rewardPercentage: rankPayout.rewardPercentage
                
            };
        });

        // Calculate the reward for the remaining winners
        const remainingWinners = totalWinners - rankingReward.length;
        const rewardForRemainingWinners = remainingWinners > 0 ? (prizePool - totalRewardDistributed) / remainingWinners : 0;
        // const remainingWinnersPercentge = rewardForRemainingWinners * 100/prizePool;

        // if(remainingWinners > 0) {
        //     rankingReward.push({
        //         rank: `${rankingReward.length + 1}-${totalWinners}`,
        //         reward: rewardForRemainingWinners,
        //         rewardPercentage: remainingWinnersPercentge
        //     });
        // }

        // let data = {
        //     prizePool: prizePool,
        //     prizeDistribution: rankingReward
        // };

        return {reward: rankingReward, totalWinner: totalWinners, remainWinnerStart: rankingReward.length + 1, remainingReward: rewardForRemainingWinners};

    } catch(err) {
        console.log(err)
        return;
    }
};







exports.overallBattleTraderPnl = async (req, res, next) => {
    // console.log("Inside overall virtual pnl")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    // console.log(today)
    let pnlDetails = await BattleMock.aggregate([
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
    let pnlDetails = await BattleMock.aggregate([
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

exports.overallBattlePnlYesterday = async (req, res, next) => {
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

        pnlDetailsData = await BattleMock.aggregate([
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
    let pnlDetails = await BattleMock.aggregate([
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

exports.overallBattleCompanySidePnlThisMonth = async (req, res, next) => {
    // const { ydate } = req.params;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    yesterdayDate = yesterdayDate + "T00:00:00.000Z";
    // console.log("Yesterday Date:",yesterdayDate)
    // const today = new Date(todayDate);
    let monthStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    monthStartDate = monthStartDate + "T00:00:00.000Z";
    console.log("Month Start Date:",new Date(monthStartDate), new Date(yesterdayDate))

    const pipeline = [
        {
            $match:
            {
                trade_time: {
                    $gte: new Date(monthStartDate),
                    // $lte: new Date(yesterdayDate)
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

    let x = await BattleMock.aggregate(pipeline)
    console.log("MTD",x)
    res.status(201).json({ message: "data received", data: x ? x : [] });
}

exports.overallBattleCompanySidePnlLifetime = async (req, res, next) => {
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

    let x = await BattleMock.aggregate(pipeline)
    // console.log("Lifetime",x)
    res.status(201).json({ message: "data received", data: x ? x : [] });
}