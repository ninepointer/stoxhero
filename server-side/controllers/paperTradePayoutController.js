const PaperTradeLeaderboard = require("../models/mock-trade/paperTradeLeaderboard");
const PaperTradePayout = require("../models/mock-trade/paperTradePayout");
const mongoose = require('mongoose');
const User = require("../models/User/userDetailSchema");
const LeaderboardParams = require('../models/LeaderboardParams/leaderboardSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const Setting = require('../models/settings/setting');
const emailService = require("../utils/emailService");
const { createUserNotification } = require("./notification/notificationController");
const uuid = require("uuid");
const moment = require('moment');

const addRewardToWallet = async (rewardAmount, pnlObj, setting, frequency) => {
  const session = await mongoose.startSession();

  try{
    session.startTransaction();
    const payoutAmountWithoutTDS = Number(rewardAmount);
    const tdsAmount = payoutAmountWithoutTDS * setting[0]?.tdsPercentage/100;
    let payoutAmount = payoutAmountWithoutTDS - tdsAmount;
    const current = moment();
    const startToday = current.clone().startOf('day');
    const endToday = current.clone().endOf('day');
    console.log("payout amount", payoutAmount);
    const wallet = await Wallet.findOne({ userId: pnlObj?.trader });
    const transactionDescription = `Amount credited for Virtual Trading`;
  
    // Check if a transaction with this description already exists
    const existingTransaction = wallet?.transactions?.some(
      (transaction) => (
        transaction.description === transactionDescription &&
        new Date(startToday) < transaction?.transactionDate &&
        transaction?.transactionDate < new Date(endToday)
      )
    );
  
    if (wallet?.transactions?.length == 0 || !existingTransaction) {
      wallet.transactions.push({
        title: "Virtual Trade Credit",
        description: transactionDescription,
        transactionDate: new Date(),
        amount: payoutAmount?.toFixed(2),
        transactionId: uuid.v4(),
        transactionType: "Cash",
      });
    }
  
    await wallet.save({session});
    const user = await User.findById(pnlObj?.trader).select(
      "first_name last_name email"
    ).session(session);
  
      //todo-vijay
    // if (process.env.PROD == "true") {
    try {
      if (!existingTransaction) {
        console.log(user?.email, "sent");
        await email(user, payoutAmount);
      }
    } catch (e) {
      console.log("error sending mail");
    }
    // }
    if (!existingTransaction) {
      await createUserNotification({
        title: "Virtual Trade Reward Credited",
        description: `₹${payoutAmount?.toFixed(
          2
        )} credited to your wallet as your Virtual Trade reward`,
        notificationType: "Individual",
        notificationCategory: "Informational",
        productCategory: "Virtual",
        user: user?._id,
        priority: "Medium",
        channels: ["App", "Email"],
        createdBy: "63ecbc570302e7cf0153370c",
        lastModifiedBy: "63ecbc570302e7cf0153370c",
      }, session);
    }

    if (!existingTransaction) {
      const {npnl, netPnl, grossPnl, brokerage, trades, portfolioValue, moneyCost, daysOfInterest, trader
      } = pnlObj;
      await savePayout({
        npnl: npnl || netPnl,
        gpnl: grossPnl,
        brokerage,
        trades,
        portfolioValue,
        moneyCost,
        rewardAmount: payoutAmount,
        rewardCurrency: 'Cash',
        tds: tdsAmount,
        daysOfInterest: daysOfInterest || 1,
        trader,
        frequency
      }, session);
    }
  
    await session.commitTransaction();
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

exports.dailyPayout = async () => {
  const setting = await Setting.find();
  const leaderboardParams = await LeaderboardParams.findOne({ frequency: 'Daily', status: 'Active' });
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const leaderBoardData = await PaperTradeLeaderboard.find({ createdOn: { $gte: today } })
    .sort({ npnl: -1, gpnl: -1 });

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of leaderBoardData.entries()) {
    const userRank = index+1; // Assuming you have a 'rank' field in your user object
    for (const rewarddata of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewarddata;
      if (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd) {
        console.log('daily', reward)
        await addRewardToWallet(reward, user, setting, 'Daily');
        // Assuming each user qualifies for only one reward, if not, you might need additional logic here
        break; // Break the loop once the reward for this user is processed
      }
    }
  }

};

exports.monthPayout = async () => {
  const setting = await Setting.find();
  const leaderboardParams = await LeaderboardParams.findOne({ frequency: 'Monthly', status: 'Active' });

  const today = moment();
  const startOfMonth = today.clone().startOf('month').subtract(5, 'hours').subtract(30, 'minutes');
  const endOfMonth = today.endOf('month').subtract(5, 'hours').subtract(30, 'minutes');
  const data = await payoutHelper(startOfMonth, endOfMonth, leaderboardParams);

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index+1; // Assuming you have a 'rank' field in your user object
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;
      if (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd) {
        console.log('month', reward)
        await addRewardToWallet(reward, user, setting, 'Monthly');
        // Assuming each user qualifies for only one reward, if not, you might need additional logic here
        break; // Break the loop once the reward for this user is processed
      }
    }
  }
};

exports.weekPayout = async () => {
  const setting = await Setting.find();
  const today = moment();
  const startOfWeek = today.clone().startOf('week').subtract(5, 'hours').subtract(30, 'minutes');
  const endOfWeek = today.endOf('week').subtract(5, 'hours').subtract(30, 'minutes');

  const leaderboardParams = await LeaderboardParams.findOne({status: 'Active', frequency: 'Weekly'})
  const data = await payoutHelper(startOfWeek, endOfWeek, leaderboardParams);

  const rewards = leaderboardParams?.rewards;
  console.log('data', data?.length);
  for (const [index, user] of data.entries()) {
    const userRank = index+1; 
    console.log('userRank', userRank, user);
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;

      console.log('rewardobj', rewardobj);

      console.log('consition', (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd), rankStart, rankEnd, rewardType, reward)
      if (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd) {
        console.log('week', reward)
        await addRewardToWallet(reward, user, setting, 'Weekly');
        // Assuming each user qualifies for only one reward, if not, you might need additional logic here
        break; // Break the loop once the reward for this user is processed
      }
    }
  }
};

exports.quarterPayout = async () => {
  const setting = await Setting.find();
  const leaderboardParams = await LeaderboardParams.findOne({status: 'Active', frequency: 'Quarter'})
  const data = await payoutHelper(leaderboardParams?.quarterStartDate, leaderboardParams?.quarterEndDate, leaderboardParams);

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index+1; // Assuming you have a 'rank' field in your user object
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;
      if (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd) {
        console.log('quarter', reward)
        await addRewardToWallet(reward, user, setting, 'Quarter');
        // Assuming each user qualifies for only one reward, if not, you might need additional logic here
        break; // Break the loop once the reward for this user is processed
      }
    }
  }
};

const payoutHelper = async (startDate, endDate, leaderboardParams) => {

  const pipeline = [
    {
      $match: {
        createdOn: {
          $gt: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    // {
    //   $lookup: {
    //     from: "user-personal-details",
    //     localField: "trader",
    //     foreignField: "_id",
    //     as: "user",
    //   },
    // },
    {
      $group: {
        _id: {
          trader: "$trader",
          name: {
            $concat: [
              {
                $arrayElemAt: [
                  "$user.first_name",
                  0,
                ],
              },
              " ",
              {
                $arrayElemAt: [
                  "$user.last_name",
                  0,
                ],
              },
            ],
          },
          portfolioValue: "$portfolioValue",
          joining_date: {
            $arrayElemAt: ["$user.joining_date", 0],
          },
          employeeid: {
            $arrayElemAt: ["$user.employeeid", 0],
          },
        },
        margin: {
          $max: "$margin",
        },
        grossPnl: {
          $sum: "$grossPnl",
        },
        netPnl: {
          $sum: "$netPnl",
        },
        brokerage: {
          $sum: "$brokerage",
        },
        trades: {
          $sum: "$trades",
        },
      },
    },
    {
      $addFields: {
        daysOfInterest: {
          $cond: {
            if: {
              $gte: [
                new Date(startDate),
                "$_id.joining_date",
              ],
            },
            then: {
                $divide: [
                  {
                    $subtract: [
                      new Date(),
                      new Date(startDate),
                    ], // Replace "endDate" and "startDate" with your date fields
                  },
                  86400000, // milliseconds in a day
                ],
              },
            else: {
                $divide: [
                  {
                    $subtract: [
                      new Date(),
                      "$_id.joining_date",
                    ], // Replace "endDate" and "startDate" with your date fields
                  },
                  86400000, // milliseconds in a day
                ],
              },
          },
        },
      },
    },
    {
      $addFields: {
        interestCost: {
          $multiply: [
            {
              $divide: [
                leaderboardParams?.marginMoneyInterest,
                36600
              ]
            },
            "$_id.portfolioValue",
            {$ceil: '$daysOfInterest'}
          ]
        }
      }
    },
    {
      $project: {
        employeeid: '$_id.employeeid',
        daysOfInterest: 1,
        weekDays: 1,
        monthDays: 1,
        moneyCost: '$interestCost',
        pnlAfterCost: {
          $subtract: ['$netPnl', "$interestCost"]
        },
        name: "$_id.name",
        trader: "$_id.trader",
        _id: 0,
        margin: 1,
        portfolioValue: "$_id.portfolioValue",
        grossPnl: 1,
        npnl: '$netPnl',
        brokerage: 1,
        trades: 1,
        roi: {
          $divide: [
            {
              $multiply: ["$netPnl", 100],
            },
            "$margin",
          ],
        },
      },
    },
    {
      $sort: {
        pnlAfterCost: -1,
        netPnl: -1,
        grossPnl: -1,
      },
    }
  ];

  const data = await PaperTradeLeaderboard.aggregate(pipeline)
  return data;
}

const savePayout = async (data, session) => {
  try{
    const {npnl, gpnl, brokerage, trades, portfolioValue, moneyCost, rewardAmount, 
      rewardCurrency, tds, daysOfInterest, trader} = data;
  
    const saveInfo = await PaperTradePayout.create([{
      npnl, gpnl, brokerage, trades, portfolioValue, moneyCost, rewardAmount, 
      rewardCurrency, tds, daysOfInterest, trader
    }], {session: session});
  } catch(err){

  }
}

const email = async(user, payoutAmount) =>{
  await emailService(
    user?.email,
    "Virtual Payout Credited - StoxHero",
    `
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
        <p>Amount of ${payoutAmount?.toFixed(
      2
    )}INR has been credited in your wallet for ${'Virtual Trading'
    }.</p>
        
        <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
        <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
        <br/><br/>
        <p>Thanks,</p>
        <p>StoxHero Team</p>

        </div>
    </body>
    </html>
    `
  );
}