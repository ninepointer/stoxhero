const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const InternBatch = require("../models/Careers/internBatch");
const MarginX = require("../models/marginX/marginX")
const DailyContest = require("../models/DailyContest/dailyContest");
const PaperTrading = require("../models/mock-trade/paperTrade")
const TenXTrading = require("../models/mock-trade/tenXTraderSchema")
const InternshipTrading = require("../models/mock-trade/internshipTrade")
const MarginXTrading = require("../models/marginX/marginXUserMock");
const ContestTrading = require("../models/DailyContest/dailyContestMockUser")
const BattleTrading = require("../models/battle/battleTrade")
const Wallet = require("../models/UserWallet/userWalletSchema")
const UserDetail = require("../models/User/userDetailSchema")
const emailService = require("../utils/emailService")
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const whatsAppService = require("../utils/whatsAppService")


exports.mail = async () => {
    try{
        let date = new Date();

        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`    
        console.log("runninig", todayDate)
    
        const tenx = await Subscription.aggregate([
            {
                $unwind: {
                    path: "$users",
                },
            },
            {
                $match: {
                    "users.status": "Expired",
                    "users.expiredOn": {
                        $gte: new Date(todayDate),
                    },
                    "users.expiredBy": "System",
                },
            },
            {
                $lookup: {
                    from: "tenx-trade-users",
                    localField: "users.userId",
                    foreignField: "trader",
                    as: "trade",
                },
            },
            {
                $unwind: {
                    path: "$trade",
                },
            },
            {
                $match: {
                    "trade.status": "COMPLETE",
                    $expr: {
                        $and: [
                            {
                                $lte: [
                                    "$users.subscribedOn",
                                    "$trade.trade_time_utc",
                                ],
                            },
                            {
                                $gte: [
                                    "$users.expiredOn",
                                    "$trade.trade_time_utc",
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        startDate: "$users.subscribedOn",
                        endDate: "$users.expiredOn",
                        payout: "$users.payout",
                        userId: "$trade.trader",
                        cap: "$profitCap",
                        expiredBy: "$users.expiredBy",
                        isRenew: "$users.isRenew",
                        validity: "$validity",
                    },
                    amount: {
                        $sum: {
                            $multiply: ["$trade.amount", -1],
                        },
                    },
                    brokerage: {
                        $sum: {
                            $toDouble: "$trade.brokerage",
                        },
                    },
                    trades: {
                        $count: {},
                    },
                    tradingDays: {
                        $addToSet: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$trade.trade_time_utc",
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "_id.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                  expiredBy: "$_id.expiredBy",
                  isRenew: "$_id.isRenew",
                  startDate: {
                    $dateToString: {
                      format: "%Y-%m-%d %H:%M:%S",
                      date: "$_id.startDate",
                    },
                  },
                  endDate: {
                    $dateToString: {
                      format: "%Y-%m-%d %H:%M:%S",
                      date: "$_id.endDate",
                    },
                  },
                  userId: "$_id.userId",
                  grossPnl: "$amount",
                  brokerage: "$brokerage",
                  _id: 0,
                  npnl: {
                    $subtract: ["$amount", "$brokerage"],
                  },
                  tradingDays: {
                    $size: "$tradingDays",
                  },
                  trades: 1,
                  payout: "$_id.payout",
                  name: {
                    $concat: [
                      {
                        $arrayElemAt: ["$user.first_name", 0],
                      },
                      " ",
                      {
                        $arrayElemAt: ["$user.last_name", 0],
                      },
                    ],
                  },
                },
              },
              {
                $match: {
                  payout: {
                    $gt: 0,
                  },
                },
              },
            {
                $sort: {
                    payout: -1,
                    tradingDays: -1,
                    npnl: -1,
                },
            },
        ])
    
        const internship = await InternBatch.aggregate([
            {
                $match: {
                    batchEndDate: { $gte: new Date(todayDate), }
                },
            },
            {
                $unwind: {
                    path: "$participants",
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "participants.user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    name: {
                        $concat: [
                            {
                                $arrayElemAt: ["$user.first_name", 0],
                            },
                            " ",
                            {
                                $arrayElemAt: ["$user.last_name", 0],
                            },
                        ],
                    },
                    gpnl: "$participants.gpnl",
                    npnl: "$participants.npnl",
                    noOfTrade: "$participants.noOfTrade",
                    referralCount: "$participants.referral",
                    attendancePercentage:
                        "$participants.attendance",
                    payout: "$participants.payout",
                    tradingDays: "$participants.tradingdays",
                    brokerage: {
                        $abs: {
                            $subtract: [
                                "$participants.npnl",
                                "$participants.gpnl",
                            ],
                        },
                    },
                    userId: "$participants.user",
                    _id: 0,
                },
            },
            {
                $match: {
                    payout: {
                        $gt: 0,
                    },
                },
            },
            {
                $sort: {
                    payout: -1,
                    npnl: -1, // Add more fields if needed
                },
            },
    
        ])
    
        const marginx = await MarginX.aggregate([
            {
                $match: {
                    startTime: {
                        $gte: new Date(todayDate),
                    },
                },
            },
            {
                $unwind: {
                    path: "$participants",
                },
            },
            {
                $lookup: {
                    from: "marginx-mock-users",
                    localField: "_id",
                    foreignField: "marginxId",
                    as: "trade",
                },
            },
            {
                $unwind: {
                    path: "$trade",
                },
            },
            {
                $match: {
                    "trade.status": "COMPLETE",
                },
            },
            {
                $group: {
                    _id: {
                        payout: "$participants.payout",
                        userId: "$trade.trader",
                    },
                    amount: {
                        $sum: {
                            $multiply: ["$trade.amount", -1],
                        },
                    },
                    brokerage: {
                        $sum: {
                            $toDouble: "$trade.brokerage",
                        },
                    },
                    trades: {
                        $count: {},
                    },
                    tradingDays: {
                        $addToSet: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$trade.trade_time_utc",
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "_id.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    userId: "$_id.userId",
                    grossPnl: "$amount",
                    brokerage: "$brokerage",
                    _id: 0,
                    npnl: {
                        $subtract: ["$amount", "$brokerage"],
                    },
                    tradingDays: {
                        $size: "$tradingDays",
                    },
                    trades: 1,
                    payout: "$_id.payout",
                    name: {
                        $concat: [
                            {
                                $arrayElemAt: ["$user.first_name", 0],
                            },
                            " ",
                            {
                                $arrayElemAt: ["$user.last_name", 0],
                            },
                        ],
                    },
                },
            },
            {
                $sort: {
                    payout: -1,
                    npnl: -1,
                },
            },
        ])
    
        const dailycontest = await DailyContest.aggregate([
            {
                $match: {
                    contestStartTime: {
                        $gte: new Date(todayDate),
                    },
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
                        payout: "$participants.payout",
                        userId: "$participants.userId",
                        gpnl: "$participants.gpnl",
                        npnl: "$participants.npnl",
                        trades: "$participants.trades",
                        brokerage: "$participants.brokerage",
                    },
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "_id.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    userId: "$_id.userId",
                    npnl: "$_id.npnl",
                    gpnl: "$_id.gpnl",
                    brokerage: "$_id.brokerage",
                    trades: "$_id.trades",
                    _id: 0,
                    payout: "$_id.payout",
                    name: {
                        $concat: [
                            {
                                $arrayElemAt: ["$user.first_name", 0],
                            },
                            " ",
                            {
                                $arrayElemAt: ["$user.last_name", 0],
                            },
                        ],
                    },
                },
            },
            {
                $match: {
                    payout: {
                        $gt: 0,
                    },
                },
            },
            {
                $sort: {
                    payout: -1,
                    npnl: -1,
                },
            },
        ])

        const tenxAttachment = await createTenxFile(tenx); 
        const internAttachment = await createInternshipFile(internship); 
        const contestAttachment = await createContestFile(dailycontest); 
        const marginxAttachment = await createMarginxFile(marginx); 
    
        const revenue = await getOverallRevenue();
        const dau = await getDailyActiveUsers(todayDate);
        const signup = await signupusersdata();
        // console.log(revenue, dau, signup);

        await emailService('team@stoxhero.com', `Daily report(${todayDate}) - StoxHero`, `
        <!DOCTYPE html>
        <html>
        
        <head>
        <meta charset="UTF-8">
        <title>Daily Report (${todayDate})</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
        }
        
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        p {
            margin: 0 0 20px;
        }
        
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 15px;
        }
        
        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        
        th {
            font-size: small;
        }
        
        .module {
            border: 1px solid #dddddd;
            text-align: center;
        }
        </style>
        </head>
        
        <body>
        <div class="container">
        <h1>Daily Report (${todayDate})</h1>
        
        <!-- revenue -->
        
        <table>
            <tr class="module">Revenue Details</tr>
            <tr>
                <th></th>
                <th>Tenx</th>
                <th>MarginX</th>
                <th>Contest</th>
            </tr>
            <tr>
                <td>Today</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueToday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueToday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueToday.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Yesterday</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueYesterday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueYesterday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueYesterday.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Week</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueThisWeek.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Week</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueLastWeek.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Month</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueThisMonth.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Month</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueLastMonth.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Year</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueThisYear.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Year</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.revenueLastYear.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.totalRevenue.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.totalRevenue.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`Contest Fee`]?.totalRevenue.toFixed(2))}</td>
            </tr>
        </table>
        
        <!-- user detail -->
        
        <table>
            <tr class="module">User Details</tr>
            <tr>
                <td>New Signup</td>
                <td>${signup}</td>
            </tr>
            <tr>
                <td>DAU's</td>
                <td>${dau}</td>
            </tr>
        </table>
        
        </div>
        </body>
        
        </html>        
        `, [tenxAttachment, internAttachment, contestAttachment, marginxAttachment]);

        // whatsAppService.sendWhatsApp({destination : "7976671752", campaignName : 'wallet_credited_campaign', userName : "Vijay Verma", source : "Admin", media: {url: 'tenx_payout.csv', filename: 'tenx_payout.csv'}, templateParams : ["vv", "234","334", "556"], tags : '', attributes : ''});


        fs.unlinkSync('tenx_payout.csv');
        fs.unlinkSync('intern_payout.csv');
        fs.unlinkSync('dailyContest_payout.csv');
        fs.unlinkSync('marginx_payout.csv');
    } catch(err){
        console.log(err)
    }

}

const getOverallRevenue = async () => {
    try {
        // Get start of today, yesterday, this week, last week, this month, last month, this year, last year
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startOfToday.setUTCHours(-5, -29, -59, -999);
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        startOfYesterday.setUTCHours(-5, -29, -59, -999);
        const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        startOfThisWeek.setUTCHours(-5, -29, -59, -999);
        const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
        startOfLastWeek.setUTCHours(-5, -29, -59, -999);
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfThisMonth.setUTCHours(-5, -29, -59, -999);
        const startOfLastMonth = now.getMonth() === 0 ? new Date(now.getFullYear() - 1, 11, 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startOfLastMonth.setUTCHours(-5, -29, -59, -999);
        const startOfThisYear = new Date(now.getFullYear(), 0, 1);
        startOfThisYear.setUTCHours(-5, -29, -59, -999);
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        startOfLastYear.setUTCHours(-5, -29, -59, -999);


        const pipeline = [
            {
                $unwind: "$transactions",
            },
            {
                $match: {
                    $or: [
                        {
                            "transactions.title": "Contest Fee",
                        },
                        {
                            "transactions.title": "MarginX Fee",
                        },
                        {
                            "transactions.title":
                                "Bought TenX Trading Subscription",
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: "$transactions.title",
                    totalRevenue: {
                        $sum: "$transactions.amount",
                    },
                    revenueToday: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfToday] }, "$transactions.amount", 0] } },
                    revenueYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfYesterday] }, { $lt: ["$transactions.transactionDate", startOfToday] }] }, "$transactions.amount", 0] } },
                    revenueThisWeek: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisWeek] }, "$transactions.amount", 0] } },
                    revenueLastWeek: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastWeek] }, { $lt: ["$transactions.transactionDate", startOfThisWeek] }] }, "$transactions.amount", 0] } },
                    revenueThisMonth: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisMonth] }, "$transactions.amount", 0] } },
                    revenueLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastMonth] }, { $lt: ["$transactions.transactionDate", startOfThisMonth] }] }, "$transactions.amount", 0] } },
                    revenueThisYear: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", startOfThisYear] }, "$transactions.amount", 0] } },
                    revenueLastYear: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", startOfLastYear] }, { $lt: ["$transactions.transactionDate", startOfThisYear] }] }, "$transactions.amount", 0] } }
                },
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    totalRevenue: 1,
                    revenueToday: 1,
                    revenueYesterday: 1,
                    revenueThisWeek: 1,
                    revenueLastWeek: 1,
                    revenueThisMonth: 1,
                    revenueLastMonth: 1,
                    revenueThisYear: 1,
                    revenueLastYear: 1
                },
            },
        ];

        const revenueDetails = await Wallet.aggregate(pipeline);

        const data = {};
        revenueDetails.forEach((item) => {
            const { title, ...revenue } = item;
            data[title] = (revenue);
        });



        return data;
    } catch (error) {
        console.log(error);
    }
};

const getDailyActiveUsers = async (todayDate) => {
    try {
        const pipeline = [
            {
                $match: {
                    trade_time: {$gte: new Date(todayDate)}
                },
            },
            {
                $group: {
                    _id: {
                        date: {
                            $substr: ["$trade_time", 0, 10],
                        },
                        trader: "$trader",
                    },
                },
            },
            {
                $group: {
                    _id: { date: "$_id.date" },
                    traders: { $sum: 1 },
                    uniqueUsers: { $addToSet: { $toString: "$_id.trader" } },
                },
            },
            {
                $sort: {
                    "_id.date": 1,
                },
            },
        ];

        const virtualTraders = await PaperTrading.aggregate(pipeline);
        const tenXTraders = await TenXTrading.aggregate(pipeline);
        const contestTraders = await ContestTrading.aggregate(pipeline);
        const internshipTraders = await InternshipTrading.aggregate(pipeline);
        const marginXTraders = await MarginXTrading.aggregate(pipeline);
        const battleTraders = await BattleTrading.aggregate(pipeline);

        // Create a date-wise mapping of DAUs for different products
        const dateWiseDAUs = {};

        virtualTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].virtualTrading = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        tenXTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].tenXTrading = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        contestTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].contest = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        internshipTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].internshipTrading = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        marginXTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].marginXTrading = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        battleTraders.forEach(entry => {
            const { _id, traders, uniqueUsers } = entry;
            const date = _id.date;
            if (date !== "1970-01-01") {
                if (!dateWiseDAUs[date]) {
                    dateWiseDAUs[date] = {
                        date,
                        virtualTrading: 0,
                        tenXTrading: 0,
                        contest: 0,
                        internshipTrading: 0,
                        marginXTrading: 0,
                        battleTrading: 0,
                        total: 0,
                        uniqueUsers: [],
                    };
                }
                dateWiseDAUs[date].battleTrading = traders;
                dateWiseDAUs[date].uniqueUsers.push(...uniqueUsers);
            }
        });

        // Calculate the date-wise total DAUs and unique users
        Object.keys(dateWiseDAUs).forEach(date => {
            const { virtualTrading, tenXTrading, contest, internshipTrading, marginXTrading, battleTrading, uniqueUsers } = dateWiseDAUs[date];
            dateWiseDAUs[date].total = virtualTrading + tenXTrading + contest + internshipTrading + marginXTrading + battleTrading;
            dateWiseDAUs[date].uniqueUsers = [...new Set(uniqueUsers)];
        });

        const arr = Object.values(dateWiseDAUs).splice(Object.values(dateWiseDAUs).length <= 90 ? 0 : Object.values(dateWiseDAUs).length - 90, Object.values(dateWiseDAUs).length);
        return arr[0]?.uniqueUsers?.length;
    } catch (error) {
        console.log(error);
    }
};

const signupusersdata = async () => {
    // console.log("Inside overall virtual pnl")
    let now = new Date();
    now.setUTCHours(0, 0, 0, 0); // set the time to start of day in UTC


    const pipeline = [
        {
            $match: {
                joining_date: {
                    $gte: now,
                    // $lt: now
                }
            }
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                count: 1,
            }
        },
        {
            $unwind: "$count"
        },
    ]

    const signupusers = await UserDetail.aggregate(pipeline)
    return signupusers[0]?.count;
}

const createTenxFile = async (data) => {
    const tenxHeader = ["Trader Name", "Gross P&L", "TXN. Cost", "Net P&L", "# Of Trades", "Trading Days", "Plan Start", "Plan End", "Payout"]
    const csvData = data.map(item => {
        return [
            item.name, item.grossPnl, item.brokerage, item.npnl, item.trades, item.tradingDays, item.startDate, item.endDate, item.payout, 
        ].join(',');
    }).join('\n');
    
    await writeFile('tenx_payout.csv', tenxHeader.join(',') + '\n' + csvData, 'utf8');

    // Send email with attachment
    const attachment = {
        filename: 'tenx_payout.csv',
        path: 'tenx_payout.csv'
    };

    return attachment;
}

const createInternshipFile = async (data) => {
    const internHeader = ["Trader Name", "Gross P&L", "TXN. Cost", "Net P&L", "# Of Trades", "Trading Days", "Referral Count", "Attendance %", "Payout"]
    const csvData = data.map(item => {
        return [
            item.name, item.gpnl, item.brokerage, item.npnl, item.noOfTrade, item.tradingDays, item.referralCount, item.attendancePercentage, item.payout, 
        ].join(',');
    }).join('\n');
    
    await writeFile('intern_payout.csv', internHeader.join(',') + '\n' + csvData, 'utf8');

    // Send email with attachment
    const attachment = {
        filename: 'intern_payout.csv',
        path: 'intern_payout.csv'
    };

    return attachment;
}

const createContestFile = async (data) => {
    const contestHeader = ["Trader Name", "Gross P&L", "TXN. Cost", "Net P&L", "# Of Trades", "Payout"]
    const csvData = data.map(item => {
        return [
            item.name, item.gpnl, item.brokerage, item.npnl, item.trades, item.payout, 
        ].join(',');
    }).join('\n');
    
    await writeFile('dailyContest_payout.csv', contestHeader.join(',') + '\n' + csvData, 'utf8');

    // Send email with attachment
    const attachment = {
        filename: 'dailyContest_payout.csv',
        path: 'dailyContest_payout.csv'
    };

    return attachment;
}

const createMarginxFile = async (data) => {
    const marginxHeader = ["Trader Name", "Gross P&L", "TXN. Cost", "Net P&L", "# Of Trades", "Payout"]
    const csvData = data.map(item => {
        return [
            item.name, item.grossPnl, item.brokerage, item.npnl, item.trades, item.payout, 
        ].join(',');
    }).join('\n');
    
    await writeFile('marginx_payout.csv', marginxHeader.join(',') + '\n' + csvData, 'utf8');

    // Send email with attachment
    const attachment = {
        filename: 'marginx_payout.csv',
        path: 'marginx_payout.csv'
    };

    return attachment;
}





/*
500 of 19500 and margin: 1 lakh

1. adding more like +300
2. release some margin like -300
3. square off all like -500
4. squareoff and add more like -700


trade db me save kr diya margin: 100000

1st find out case, case konsa h ? by running lots and new quantity

case 1. next trade me wo add krne aaya to i findout last trade on that symbol and got margin, margin is 100000
and new magin for 300 lot is 50,000 then i add and total margin is 1,50,000 and saved it

case 2. similar i findout last symbol or margin that is 100000 and not i calculated quantity percentage if squaring off
like 300 * 100/500 = 60% quantity i am squaring off so that release 60% margin
100000*60/100 = 60,000 margin released, remaininig margin is 100000-60000 = 40,000
save new margin of 40,000

case 3. if square off all quantity then release all 100% margin should release
and margin is 0 now

case 4. in this square off 500 quantity and add 200 quantity more also calculate margin accroding 
new quantity
*/
