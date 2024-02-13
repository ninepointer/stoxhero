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
const moment = require('moment')

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
                <th>TestZone</th>
            </tr>
            <tr>
                <td>Today</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueToday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueToday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueToday.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Yesterday</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueYesterday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueYesterday.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueYesterday.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Week</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueThisWeek.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Week</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastWeek.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueLastWeek.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Month</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueThisMonth.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Month</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastMonth.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueLastMonth.toFixed(2))}</td>
            </tr>
            <tr>
                <td>This Year</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueThisYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueThisYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueThisYear.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Last Year</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.revenueLastYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.revenueLastYear.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.revenueLastYear.toFixed(2))}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td>₹${Math.abs(revenue[`Bought TenX Trading Subscription`]?.totalRevenue.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`MarginX Fee`]?.totalRevenue.toFixed(2))}</td>
                <td>₹${Math.abs(revenue[`TestZone Fee`]?.totalRevenue.toFixed(2))}</td>
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

exports.reportMail = async (req, res) => {
    try{
        let date = new Date();

        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`    
    
        const payout = await getOverallPayout(); 
        const revenue = await getOverallRevenue(); 
        const user = await newUserData(); 

        await emailService('team@stoxhero.com', `Report(${todayDate}) - StoxHero`, `
        <!DOCTYPE html>
        <html>
        
        <head>
        <meta charset="UTF-8">
        <title>Report (${todayDate})</title>
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
                
        <table>
            
            <tr>
                <th></th>
                <th>Revenue</th>
                <th>Payout</th>
                <th>Users</th>
            </tr>
            <tr>
                <td>Today</td>
                <td>₹${Math.abs(revenue?.revenueToday?.toFixed(2)) || 0}</td>
                <td>₹${Math.abs(payout?.payoutToday?.toFixed(2)) || 0}</td>
                <td>${Math.abs(user?.userToday.toFixed(2)) || 0}</td>
            </tr>
            <tr>
                <td>Yesterday</td>
                <td>₹${Math.abs(revenue?.revenueYesterday?.toFixed(2)) || 0}</td>
                <td>₹${Math.abs(payout?.payoutYesterday?.toFixed(2)) || 0}</td>
                <td>${Math.abs(user?.userYesterday.toFixed(2)) || 0}</td>
            </tr>
            <tr>
                <td>This Month</td>
                <td>₹${Math.abs(revenue?.revenueThisMonth?.toFixed(2)) || 0}</td>
                <td>₹${Math.abs(payout?.payoutThisMonth?.toFixed(2)) || 0}</td>
                <td>${Math.abs(user?.userThisMonth.toFixed(2)) || 0}</td>
            </tr>
            <tr>
                <td>Last Month</td>
                <td>₹${Math.abs(revenue?.revenueLastMonth?.toFixed(2)) || 0}</td>
                <td>₹${Math.abs(payout?.payoutLastMonth?.toFixed(2)) || 0}</td>
                <td>${Math.abs(user?.userLastMonth.toFixed(2)) || 0}</td>
            </tr>
            <tr>
                <td>Till Date</td>
                <td>₹${Math.abs(revenue?.totalRevenue?.toFixed(2)) || 0}</td>
                <td>₹${Math.abs(payout?.totalPayout?.toFixed(2)) || 0}</td>
                <td>${Math.abs(user?.totalUser.toFixed(2)) || 0}</td>
            </tr>
        </table>
        
        
        </div>
        </body>
        
        </html>        
        `);

        res.send("ok")
    } catch(err){
        console.log(err)
    }

}

const getOverallRevenue = async () => {
    try {

        const { todayStartDate, yesterdayStartDate, yesterdayEndDate,
            thisMonthStartDate, lastMonthStartDate, lastMonthEndDate} = getDates();

        const pipeline = [
            {
                $unwind: "$transactions",
            },
            {
                $match: {
                    $or: [
                        {
                            "transactions.title": "TestZone Fee",
                        },
                        {
                            "transactions.title": "MarginX Fee",
                        },
                        {
                            "transactions.title": "Battle Fee",
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
                    revenueToday: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date(todayStartDate)] }, "$transactions.amount", 0] } },
                    revenueYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", new Date(yesterdayStartDate)] }, { $lt: ["$transactions.transactionDate", new Date(yesterdayEndDate)] }] }, "$transactions.amount", 0] } },
                    revenueThisMonth: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date(thisMonthStartDate)] }, "$transactions.amount", 0] } },
                    revenueLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", new Date(lastMonthStartDate)] }, { $lt: ["$transactions.transactionDate", new Date(lastMonthEndDate)] }] }, "$transactions.amount", 0] } },
                    // revenueTillDate: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date("2000-01-01")] }, "$transactions.amount", 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    totalRevenue: 1,
                    revenueToday: 1,
                    revenueYesterday: 1,
                    revenueThisMonth: 1,
                    revenueLastMonth: 1,
                    revenueTillDate: 1
                },
            },
        ];

        const revenueDetails = await Wallet.aggregate(pipeline);

        const data = {
            totalRevenue: 0,
            revenueToday: 0,
            revenueYesterday: 0,
            revenueThisMonth: 0,
            revenueLastMonth: 0,
        };
        revenueDetails.forEach((item) => {
            data.totalRevenue += item.totalRevenue,
            data.revenueToday += item.revenueToday,
            data.revenueYesterday += item.revenueYesterday,
            data.revenueThisMonth += item.revenueThisMonth,
            data.revenueLastMonth += item.revenueLastMonth
        });

        return data;
    } catch (error) {
        console.log(error);
    }
};

const getOverallPayout = async () => {
    try {

        const { todayStartDate, yesterdayStartDate, yesterdayEndDate,
            thisMonthStartDate, lastMonthStartDate, lastMonthEndDate} = getDates();

        const pipeline = [
            {
                $unwind: "$transactions",
            },
            {
                $match: {
                    $or: [
                        {
                            "transactions.title": "TestZone Credit",
                        },
                        {
                            "transactions.title": "Marginx Credit",
                        },
                        {
                            "transactions.title": "TenX Trading Payout",
                        },
                        {
                            "transactions.title":
                                "Battle Credit",
                        },
                        {
                            "transactions.title":
                                "Internship Payout Credited",
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: "$transactions.title",
                    totalPayout: {
                        $sum: "$transactions.amount",
                    },
                    payoutToday: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date(todayStartDate)] }, "$transactions.amount", 0] } },
                    payoutYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", new Date(yesterdayStartDate)] }, { $lt: ["$transactions.transactionDate", new Date(yesterdayEndDate)] }] }, "$transactions.amount", 0] } },
                    payoutThisMonth: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date(thisMonthStartDate)] }, "$transactions.amount", 0] } },
                    payoutLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$transactions.transactionDate", new Date(lastMonthStartDate)] }, { $lt: ["$transactions.transactionDate", new Date(lastMonthEndDate)] }] }, "$transactions.amount", 0] } },
                    // payoutTillDate: { $sum: { $cond: [{ $gte: ["$transactions.transactionDate", new Date("2000-01-01")] }, "$transactions.amount", 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    totalPayout: 1,
                    payoutToday: 1,
                    payoutYesterday: 1,
                    payoutThisMonth: 1,
                    payoutLastMonth: 1,
                    payoutTillDate: 1
                },
            },
        ];

        const payoutDetails = await Wallet.aggregate(pipeline);

        const data = {
            totalPayout: 0,
            payoutToday: 0,
            payoutYesterday: 0,
            payoutThisMonth: 0,
            payoutLastMonth: 0,
        };
        payoutDetails.forEach((item) => {
            data.totalPayout += item.totalPayout,
            data.payoutToday += item.payoutToday,
            data.payoutYesterday += item.payoutYesterday,
            data.payoutThisMonth += item.payoutThisMonth,
            data.payoutLastMonth += item.payoutLastMonth
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

const newUserData = async () => {
    const { todayStartDate, yesterdayStartDate, yesterdayEndDate,
        thisMonthStartDate, lastMonthStartDate, lastMonthEndDate} = getDates();


    const pipeline = [
        {
            $group: {
                _id: null,
                totalUser: {
                    $sum: 1,
                },
                userToday: { $sum: { $cond: [{ $gte: ["$joining_date", new Date(todayStartDate)] }, 1, 0] } },
                userYesterday: { $sum: { $cond: [{ $and: [{ $gte: ["$joining_date", new Date(yesterdayStartDate)] }, { $lt: ["$joining_date", new Date(yesterdayEndDate)] }] }, 1, 0] } },
                userThisMonth: { $sum: { $cond: [{ $gte: ["$joining_date", new Date(thisMonthStartDate)] }, 1, 0] } },
                userLastMonth: { $sum: { $cond: [{ $and: [{ $gte: ["$joining_date", new Date(lastMonthStartDate)] }, { $lt: ["$joining_date", new Date(lastMonthEndDate)] }] }, 1, 0] } },
                // revenueTillDate: { $sum: { $cond: [{ $gte: ["$joining_date", new Date("2000-01-01")] }, 1, 0] } },
            },
        },
        {
            $project: {
                _id: 0,
                totalUser: 1,
                userToday: 1,
                userYesterday: 1,
                userThisMonth: 1,
                userLastMonth: 1
            }
        },
    ]

    const signupusers = await UserDetail.aggregate(pipeline);
    return signupusers?.[0];
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
    
    await writeFile('dailyTestZone_payout.csv', contestHeader.join(',') + '\n' + csvData, 'utf8');

    // Send email with attachment
    const attachment = {
        filename: 'dailyTestZone_payout.csv',
        path: 'dailyTestZone_payout.csv'
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

function getDates() {
    const today = moment();

    let todayStartDate = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    let todayEndDate = today.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

    let yesterdayStartDate = today.clone().subtract(1, 'day').startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
    let yesterdayEndDate = today.clone().subtract(1, 'day').endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

    const firstDayOfMonth = today.clone().startOf('month');
    let thisMonthStartDate = firstDayOfMonth.subtract(5, 'hours').subtract(30, 'minutes');
    let thisMonthEndDate = today.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

    const firstDayOfLastMonth = today.clone().subtract(1, 'month').startOf('month');
    const lastDayOfLastMonth = today.clone().subtract(1, 'month').endOf('month');
    let lastMonthStartDate = firstDayOfLastMonth.subtract(5, 'hours').subtract(30, 'minutes');
    let lastMonthEndDate = lastDayOfLastMonth.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

    console.log(new Date(lastMonthStartDate), new Date(lastMonthEndDate));

    return {
        today, todayStartDate, todayEndDate, yesterdayStartDate, yesterdayEndDate,
        thisMonthStartDate, thisMonthEndDate, lastMonthStartDate, lastMonthEndDate
    };
}