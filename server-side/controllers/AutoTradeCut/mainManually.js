const {tenx, paperTrade, infinityTrade, internship, infinityTradeLive, contestTradeLive, dailyContestMock, internshipTradeMod, dailyContestMockMod} = require("./collectingTradeManually");
const {creditAmountToWallet} = require("../../controllers/dailyContestController");
const DailyContestMock = require("../../models/DailyContest/dailyContestMockCompany");
const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const Contest = require('../../models/DailyContest/dailyContest'); // Assuming your model is exported as Contest from the mentioned path
// const InfinityLiveTradeCompany = require("../../models/TradeDetails/liveTradeSchema");
const dailyContestLiveCompany = require("../../models/DailyContest/dailyContestLiveCompany")

const autoCutMainManually = async() => {
    await infinityTradeLive();
    await contestTradeLive();
}

const autoCutMainManuallyMock = async() => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const data = await dailyContestLiveCompany.aggregate([
        {
            $match: {
                trade_time: {
                    $gte: new Date("2023-08-28"),
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

    if(data.length === 0){
        await tenx();
        await paperTrade();
        // await internship();
        await internshipTradeMod();
        await infinityTrade();
        // await dailyContestMock();
        await dailyContestMockMod();
        return;
    }

    await autoCutMainManuallyMock();
}

const changeStatus = async() => {
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
        console.log("in if change status..")
        await changeContestStatus();
        await creditAmount();
        return;
    }

    await changeStatus();
}

const creditAmount = async() => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let todayEndDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` + "T23:00:00.000Z";
    const todayEnd =  new Date(todayEndDate);


    const data = await Contest.find({ payoutStatus: null, contestStatus: "Completed", contestEndTime: {$gte: today} });
    // const contest = await Contest.find({ contestEndTime: {$gte: today, $lte: todayEnd} });

    // console.log("contest", contest.length, data.length);

    // if(data.length === contest.length){
        if(data.length > 0){
        console.log("in if wallet..")
        await creditAmountToWallet();
        return;
        
    }

    await creditAmount();
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


module.exports = {autoCutMainManually, autoCutMainManuallyMock, creditAmount, changeStatus}