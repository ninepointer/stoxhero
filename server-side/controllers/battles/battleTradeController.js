const BattleMock = require("../../models/battle/battleTrade");
const { ObjectId } = require("mongodb");
const { client, getValue } = require('../../marketData/redisClient');
const Battle = require("../../models/battle/battle");
const {getIOValue} = require('../../marketData/socketio');

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
    // let date = new Date();
    // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // todayDate = todayDate + "T00:00:00.000Z";
    // const today = new Date(todayDate);
    // const skip = parseInt(req.query.skip) || 0;
    // const limit = parseInt(req.query.limit) || 5
    const count = await BattleMock.countDocuments({trader: new ObjectId(userId), battleId: new ObjectId(id) })
    
    try {
        const myTodaysTrade = await BattleMock.find({ trader: new ObjectId(userId), battleId: new ObjectId(id) }, { 'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time': 1, 'order_id': 1 })
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
                            _id: new ObjectId("64febd9511c0cd0de1d00d4d"),
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
                // console.log(portfolioValue, new ObjectId(id))
                if (isRedisConnected) {
                    await client.set(`${req.user._id.toString()}${id.toString()} openingBalanceAndMarginBattle`, JSON.stringify(portfolioValue[0]))
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
    let x = await BattleMock.aggregate(pipeline)

    res.status(201).json({ message: "data received", data: x, user: user[0] });
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
                        $substr: ["$battleData.startTime", 0, 10],
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
                    battleId: "$_id.battleId",
                    battleName: "$_id.battleName",
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
                battleId: "$_id.battleId",
                battleName: "$_id.battleName",
                BattleDate: "$_id.date",
                totalNpnl: 1,
                totalPayout: 1,
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
                totalPayout: {
                    $sum: "$totalPayout",
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
                totalPayout: 1,
                numberOfBattle: 1,
            },
        },
        {
            $sort: {
                BattleDate: 1
            }
        }
    ]

    let x = await BattleMock.aggregate(pipeline) 

    res.status(201).json({ message: "data received", data: x });
}