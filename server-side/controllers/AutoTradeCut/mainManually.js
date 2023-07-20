const {tenx, paperTrade, infinityTrade, internship, infinityTradeLive, dailyContestMock} = require("./collectingTradeManually");
const {creditAmountToWallet} = require("../../controllers/dailyContestController");
const DailyContestMock = require("../../models/DailyContest/dailyContestMockCompany");


const autoCutMainManually = async() => {

    await infinityTradeLive();
}

const autoCutMainManuallyMock = async() => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const data = await InfinityLiveTradeCompany.aggregate([
        {
            $match: {
                trade_time: {
                    $gte: today
                },
                status: "COMPLETE",
            },
        },
        {
            $group: {
                _id: {
                    userId: "$trader",
                    // subscriptionId: "$subscriptionId",
                    exchange: "$exchange",
                    symbol: "$symbol",
                    instrumentToken: "$instrumentToken",
                    exchangeInstrumentToken: "$exchangeInstrumentToken",
                    variety: "$variety",
                    validity: "$validity",
                    order_type: "$order_type",
                    Product: "$Product",
                    algoBoxId: "$algoBox"
                },
                runningLots: {
                    $sum: "$Quantity",
                },
                takeTradeQuantity: {
                    $sum: {
                        $multiply: ["$Quantity", -1],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                userId: "$_id.userId",
                // subscriptionId: "$_id.subscriptionId",
                exchange: "$_id.exchange",
                symbol: "$_id.symbol",
                instrumentToken: "$_id.instrumentToken",
                exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
                variety: "$_id.variety",
                validity: "$_id.validity",
                order_type: "$_id.order_type",
                Product: "$_id.Product",
                runningLots: "$runningLots",
                takeTradeQuantity: "$takeTradeQuantity",
                algoBoxId: "$_id.algoBoxId"
            },
        },
        {
            $match: {
                runningLots: {
                    $ne: 0
                },
            }
        }
    ]);

    if(data.length === 0){
        await tenx();
        await paperTrade();
        await internship();
        await infinityTrade();
        await dailyContestMock();
        return;
    }

    await autoCutMainManuallyMock();
}

const creditAmount = async() => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const data = await DailyContestMock.aggregate(
        [
            {
                $match:
                {
                    trade_time: {
                        $gte: today
                    },
                    status: "COMPLETE",
                    // appOrderId: null
                },
            },
            {
                $group:
                {
                    _id: {
                        userId: "$trader",
                        // subscriptionId: "$subscriptionId",
                        exchange: "$exchange",
                        symbol: "$symbol",
                        instrumentToken: "$instrumentToken",
                        exchangeInstrumentToken: "$exchangeInstrumentToken",
                        variety: "$variety",
                        validity: "$validity",
                        order_type: "$order_type",
                        Product: "$Product",
                        algoBoxId: "$algoBox",
                        contestId: "$contestId"
                    },
                    runningLots: {
                        $sum: "$Quantity",
                    },
                    takeTradeQuantity: {
                        $sum: {
                            $multiply: ["$Quantity", -1],
                        },
                    },
                },
            },
            {
                $project:
                {
                    _id: 0,
                    userId: "$_id.userId",
                    // subscriptionId: "$_id.subscriptionId",
                    exchange: "$_id.exchange",
                    symbol: "$_id.symbol",
                    instrumentToken: "$_id.instrumentToken",
                    exchangeInstrumentToken: "$_id.exchangeInstrumentToken",
                    variety: "$_id.variety",
                    validity: "$_id.validity",
                    order_type: "$_id.order_type",
                    Product: "$_id.Product",
                    runningLots: "$runningLots",
                    takeTradeQuantity: "$takeTradeQuantity",
                    algoBoxId: "$_id.algoBoxId",
                    contestId: "$_id.contestId"
                },
            },
            {
                $match: {
                    runningLots: {
                        $ne: 0
                    },
                }
            }

        ]
    );

    if(data.length === 0){
        await creditAmountToWallet();
        return;
    }

    await autoCutMainManuallyMock();
}

module.exports = {autoCutMainManually, autoCutMainManuallyMock, creditAmount}