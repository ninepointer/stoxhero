const {client, getValue} = require('../../marketData/redisClient');
const InfinityTraderCompany = require("../../models/TradeDetails/liveTradeSchema");
const AlgoBox = require("../../models/AlgoBox/tradingAlgoSchema");

exports.overallLivePnlRedis = async (pnlData)=>{
    // console.log("in overallLivePnlRedis", pnlData)
    const isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    if(isRedisConnected && await client.exists(`overallLivePnlCompany`)){
        let pnl = await client.get(`overallLivePnlCompany`)
        pnl = JSON.parse(pnl);
        // console.log("in if", pnl)

        // if instrument is same then just updating value
        console.log(pnl, pnlData)
        const matchingElement = pnl.find((element) => (element.instrumentToken === pnlData.instrumentToken && element.product === pnlData.Product ));
        // if instrument is same then just updating value
        if (matchingElement) {
          // Update the values of the matching element with the values of the first document
          matchingElement.amount += (pnlData.amount * -1);
          matchingElement.brokerage += Number(pnlData.brokerage);
          matchingElement.lastaverageprice = pnlData.average_price;
          matchingElement.lots += Number(pnlData.Quantity);

        } else {
          // Create a new element if instrument is not matching
          pnl.push({
            symbol: pnlData.symbol,
            product: pnlData.Product,
            instrumentToken: pnlData.instrumentToken,
            exchangeInstrumentToken: pnlData.exchangeInstrumentToken,
            amount: (pnlData.amount * -1),
            brokerage: Number(pnlData.brokerage),
            lots: Number(pnlData.Quantity),
            lastaverageprice: pnlData.average_price,
          });
        }

            // console.log("overall redis pnl", pnl)
        let settingRedis = await client.set(`overallLivePnlCompany`, JSON.stringify(pnl))

        return settingRedis;
    } else {
        let pnlDetails = await InfinityTraderCompany.aggregate([
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
        console.log("pnlDetails in else", pnlDetails)
        let settingRedis = await client.set(`overallLivePnlCompany`, JSON.stringify(pnlDetails))

        return settingRedis;
    }
}

exports.overallLivePnlTraderWiseRedis = async (pnlData) => {
    const isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    let algoBox;
    let name;


    if (isRedisConnected && await client.exists(`traderWiseLivePnlCompany`)) {

        if (await client.exists(`tradingAlgo`)) {
            let algo = await client.get(`tradingAlgo`);
            algo = JSON.parse(algo);
            // console.log("algo", algo, pnlData)
            algoBox = algo.filter((elem) => {
                return elem._id.toString() == pnlData.algoBox.toString()
            })
        } else{
            const algo = await AlgoBox.find();
            await client.set(`tradingAlgo`, JSON.stringify(algo));
            algoBox = algo.filter((elem) => {
                return elem._id.toString() == pnlData.algoBox.toString()
            })
        }

        if (await client.exists(`${pnlData.trader.toString()}authenticatedUser`)) {
            let user = await client.get(`${pnlData.trader.toString()}authenticatedUser`)
            user = JSON.parse(user);
            name = user.first_name + " " + user.last_name;
        }

        let pnl = await client.get(`traderWiseLivePnlCompany`)
        pnl = JSON.parse(pnl);
        // console.log(pnl, pnlData)
        const matchingElement = pnl.find((element) => (element?._id?.traderId.toString() == pnlData.trader.toString() && element?._id?.symbol === pnlData.instrumentToken));
        if (matchingElement) {
            // Update the values of the matching element with the values of the first document
            matchingElement.amount += (pnlData.amount * -1);
            matchingElement.brokerage += Number(pnlData.brokerage);
            matchingElement.lots += Number(pnlData.Quantity);
            matchingElement.trades += 1;
            matchingElement.lotUsed += Math.abs(Number(pnlData.Quantity));
  
          } else {
            // Create a new element if instrument is not matching
            pnl.push({
              symbol: pnlData.instrumentToken,
              exchangeInstrumentToken: pnlData.exchangeInstrumentToken,
              amount : (pnlData.amount * -1),
              brokerage : Number(pnlData.brokerage),
              lots : Number(pnlData.Quantity),
              trades : 1,
              lotUsed : Math.abs(Number(pnlData.Quantity)),
              traderId : pnlData.trader,
              traderName: name,
              algoId: pnlData.algoBoxId,
              algoName: algoBox[0].algoName
            });
          }

        // console.log("trader redis pnl", pnl)
        let settingRedis = await client.set(`traderWiseLivePnlCompany`, JSON.stringify(pnl))

        return settingRedis;
    } else {

        let pnlDetails = await InfinityTraderCompany.aggregate([
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
                        "algoId": {
                            $arrayElemAt: ["$algoBox._id", 0]
                        },
                        "algoName": {
                            $arrayElemAt: ["$algoBox.algoName", 0]
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
            { $sort: { _id: -1 } },
        ])
        console.log("pnlDetails in else trader", pnlDetails)
        let settingRedis = await client.set(`traderWiseLivePnlCompany`, JSON.stringify(pnlDetails))

        return settingRedis;
    }
}

exports.letestTradeLive = async (pnlData) => {
    const isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    let name;


    if (isRedisConnected && await client.exists(`lastTradeLive`)) {

        if (await client.exists(`${pnlData.trader.toString()}authenticatedUser`)) {
            let user = await client.get(`${pnlData.trader.toString()}authenticatedUser`)
            user = JSON.parse(user);
            name = user.first_name + " " + user.last_name;
        }

        // console.log(trade, tradeData)
        let lastTrade = {
            Quantity: Number(pnlData.Quantity),
            buyOrSell: pnlData.buyOrSell,
            status: pnlData.status,
            trade_time: pnlData.trade_time,
            createdBy: name,
            symbol: pnlData.symbol
        }

        // console.log("trader redis pnl", pnl)
        let settingRedis = await client.set(`lastTradeLive`, JSON.stringify(lastTrade))

        return settingRedis;
    } else {

        let trade = await InfinityTraderCompany.aggregate([
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
        ])
        let settingRedis = await client.set(`lastTradeLive`, JSON.stringify(trade[0]))

        return settingRedis;
    }
}


