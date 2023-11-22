const { tenx, paperTrade, infinityTrade, internship, infinityTradeLive, contestTradeLive,
    dailyContestMock, internshipTradeMod, dailyContestMockMod, marginXMockMod, battleTradeMod } = require("./collectingTradeManually");
const { creditAmountToWallet } = require("../../controllers/dailyContestController");
const marginxController = require("../../controllers/marginX/marginxController");
const DailyContestMock = require("../../models/DailyContest/dailyContestMockCompany");
const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const Contest = require('../../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
// const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const dailyContestLiveCompany = require("../../models/DailyContest/dailyContestLiveCompany")
const MarginXMock = require("../../models/marginX/marginXCompanyMock");
const MarginXMockUser = require("../../models/marginX/marginXUserMock");
const MarginX = require("../../models/marginX/marginX");
const BattleTrade = require("../../models/battle/battleTrade");
const Battle = require("../../models/battle/battle");
const { creditAmountToWalletBattle } = require("../../controllers/battles/battleTradeController");
const {client} = require("../../marketData/redisClient");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema");
const DailyContestMockUser = require("../../models/DailyContest/dailyContestMockUser");

const autoCutMainManually = async () => {
    console.log("cronjob running")
    const updates = await PendingOrder.updateMany(
        {
            status:'Pending'
        },{
            $set: {
                status: "Cancelled"
            }
        }
    )

    console.log("cronjob running updates", updates)
    await client.del(`stoploss-stopprofit`);
    await infinityTradeLive();
    console.log("cronjob running end middle")
    await contestTradeLive();
    console.log("cronjob running end")
}

const autoCutMainManuallyMock = async () => {
    console.log("cronjob running 2nd")
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const data = await dailyContestLiveCompany.aggregate([
        {
            $match: {
                trade_time: {
                    $gte: new Date(today),
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
                    exchangeInstrumentToken:
                        "$exchangeInstrumentToken",
                    variety: "$variety",
                    validity: "$validity",
                    order_type: "$order_type",
                    Product: "$Product",
                    algoBoxId: "$algoBox",
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
            $match: {
                runningLots: {
                    $ne: 0,
                },
            },
        },
    ]);

    console.log(data)

    if (data.length === 0) {
        await tenx();
        await paperTrade();
        await internshipTradeMod();
        await infinityTrade();
        await dailyContestMockMod();
        await marginXMockMod();
        await battleTradeMod();
        await changeStatus();
        await changeMarginXStatus();
        await changeBattleStatus();
        return;
    }

    await autoCutMainManuallyMock();
}

// contest status change and payout process
const changeStatus = async () => {
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
                    runningLots: "$runningLots",
                    takeTradeQuantity: "$takeTradeQuantity",
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

    const dataUser = await DailyContestMockUser.aggregate(
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
                    runningLots: "$runningLots",
                    takeTradeQuantity: "$takeTradeQuantity",
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

    if (data.length === 0 && dataUser.length === 0) {
        console.log("in if change status..")
        await changeContestStatus();
        await creditAmount();
        return;
    }

    // await changeStatus();
}

const changeContestStatus = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            todayDate = todayDate + "T00:00:00.000Z";
            let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
            const today = new Date(todayDate);
            const todayEnd = new Date(todayEndDate);


            const contest = await Contest.find({ contestStatus: "Active", contestEndTime: { $gte: today, $lte: todayEnd } });

            for (let j = 0; j < contest.length; j++) {
                console.log(contest[j].contestEndTime, new Date())
                contest[j].contestStatus = "Completed";
                await contest[j].save();
            }

            resolve();

        } catch (error) {
            reject(error); // Reject the promise if an error occurs
        }

    });
}

const creditAmount = async () => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
    const todayEnd = new Date(todayEndDate);


    const data = await Contest.find({ payoutStatus: null, contestStatus: "Completed", contestEndTime: { $gte: today } });
    // const contest = await Contest.find({ contestEndTime: {$gte: today, $lte: todayEnd} });

    // console.log("contest", contest.length, data.length);

    // if(data.length === contest.length){
    if (data.length > 0) {
        console.log("in if wallet..")
        await creditAmountToWallet();
        return;

    }

    await creditAmount();
}
// end of contest


// marginx status change and payout process
const changeMarginXStatus = async () => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);
    
    const data = await MarginXMock.aggregate(
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
                        marginxId: "$marginxId"
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
                    marginxId: "$_id.marginxId"
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

    const dataUser = await MarginXMockUser.aggregate(
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
                        marginxId: "$marginxId"
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
                    marginxId: "$_id.marginxId"
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

    if (data.length === 0 && dataUser.length === 0) {
        console.log("in if change status..")
        await changeMarginXDocStatus();
        await creditAmountMarginX();
        return;
    }

    // await changeMarginXStatus();
}

const creditAmountMarginX = async () => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
    const todayEnd = new Date(todayEndDate);


    const data = await MarginX.find({ payoutStatus: null, status: "Completed", endTime: { $gte: today } });
    // const contest = await Contest.find({ contestEndTime: {$gte: today, $lte: todayEnd} });

    // console.log("contest", contest.length, data.length);

    // if(data.length === contest.length){
    if (data.length > 0) {
        console.log("in if wallet..")
        await marginxController.creditAmountToWallet();
        return;

    }

    await creditAmountMarginX();
}

const changeMarginXDocStatus = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            todayDate = todayDate + "T00:00:00.000Z";
            let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
            const today = new Date(todayDate);
            const todayEnd = new Date(todayEndDate);


            const marginx = await MarginX.find({ status: "Active", endTime: { $gte: today, $lte: todayEnd } });

            for (let j = 0; j < marginx.length; j++) {
                marginx[j].status = "Completed";
                await marginx[j].save();
            }

            resolve();

        } catch (error) {
            reject(error); // Reject the promise if an error occurs
        }

    });
}
// end of marginx

// battle status change and payout process
const changeBattleStatus = async () => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const data = await BattleTrade.aggregate(
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
                        battleId: "$battleId"
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
                    battleId: "$_id.battleId"
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

    console.log("changeBattleStatus", data.length)

    if (data.length === 0) {
        console.log("in if change status..")
        await changeBattleDocStatus();
        //TODO:Add credit function
        await creditBattleAmount();
        return;
    }

    
}

const changeBattleDocStatus = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            todayDate = todayDate + "T00:00:00.000Z";
            let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
            const today = new Date(todayDate);
            const todayEnd = new Date(todayEndDate);


            const battles = await Battle.find({ status: "Active", battleEndTime: { $gte: today, $lte: todayEnd } });

            for (let j = 0; j < battles.length; j++) {
                battles[j].status = "Completed";
                battles[j].battleStatus = 'Completed'
                await battles[j].save();
            }

            resolve();

        } catch (error) {
            reject(error); // Reject the promise if an error occurs
        }

    });
}

const creditBattleAmount = async () => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
    const todayEnd = new Date(todayEndDate);


    const data = await Battle.find({ payoutStatus: "Not Started", status: "Completed", battleEndTime: { $gte: today } });
    if (data.length > 0) {
        console.log("in if wallet..")
        await creditAmountToWalletBattle();
        return;
    }

    await creditAmount();
}
// end of battle



module.exports = { autoCutMainManually, autoCutMainManuallyMock, creditAmount, changeStatus, changeMarginXStatus, changeBattleStatus }