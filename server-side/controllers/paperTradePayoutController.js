const PaperTradeLeaderboard = require("../models/mock-trade/paperTradeLeaderboard");
const PaperTradePayout = require("../models/mock-trade/paperTradePayout");
const mongoose = require('mongoose');
const TradingHoliday = require('../models/TradingHolidays/tradingHolidays');
const User = require("../models/User/userDetailSchema");
const LeaderboardParams = require('../models/LeaderboardParams/leaderboardSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const Setting = require('../models/settings/setting');
const emailService = require("../utils/emailService");
const { createUserNotification } = require("./notification/notificationController");
const uuid = require("uuid");
const moment = require('moment');

const addRewardToWallet = async (rewardAmount, pnlObj, setting, frequency, startDate, endDate, workingDays) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const payoutAmountWithoutTDS = Number(rewardAmount);
    const tdsAmount = payoutAmountWithoutTDS * setting[0]?.tdsPercentage / 100;
    let payoutAmount = payoutAmountWithoutTDS - tdsAmount;
    const current = moment();
    const startToday = current.clone().startOf('day');
    const endToday = current.clone().endOf('day');
    console.log("payout amount", payoutAmount);
    const wallet = await Wallet.findOne({ userId: pnlObj?.trader });
    const transactionDescription = `Amount credited for Virtual Trading ${frequency} Reward`;
    const user = await User.findById(pnlObj?.trader).select(
      "first_name last_name email"
    ).session(session);

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

    await wallet.save({ session });

    if (process.env.PROD == "true") {
      try {
        if (!existingTransaction) {
          console.log(user?.email, "sent");
          await email(user, payoutAmount);
        }
      } catch (e) {
        console.log("error sending mail");
      }
    }
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
      const { pnlAfterCost, npnl, netPnl, grossPnl, brokerage, trades, portfolioValue, moneyCost, daysOfInterest, trader
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
        frequency,
        pnlAfterCost,
        workingDays,
        frequencyStart: startDate,
        frequencyEnd: endDate
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

  const today = moment();
  const startOfDay = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
  const endOfDay = today.endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

  const helper = await payoutHelper(startOfDay, endOfDay, leaderboardParams, setting[0]);
  const data = helper?.data;
  const workingDays = helper?.workingDays;

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index + 1; // Assuming you have a 'rank' field in your user object
    for (const rewarddata of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewarddata;
      if (rewardType === 'Cash' && userRank >= rankStart && userRank <= rankEnd && user?.pnlAfterCost > 0) {
        console.log('daily', reward)
        await addRewardToWallet(reward, user, setting, 'Daily', startOfDay, endOfDay, workingDays);
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
  const helper = await payoutHelper(startOfMonth, endOfMonth, leaderboardParams, setting[0]);
  const data = helper?.data;
  const workingDays = helper?.workingDays;

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index + 1; // Assuming you have a 'rank' field in your user object
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;
      if ((rewardType === 'Cash') && (userRank >= rankStart) && (userRank <= rankEnd) && (user?.pnlAfterCost > 0) && (user?.attendancePer >= leaderboardParams?.tradingDaysAttendance)) {
        console.log('month', reward)
        await addRewardToWallet(reward, user, setting, 'Monthly', startOfMonth, endOfMonth, workingDays);
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

  const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Weekly' })
  const helper = await payoutHelper(startOfWeek, endOfWeek, leaderboardParams, setting[0]);
  const data = helper?.data;
  const workingDays = helper?.workingDays;

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index + 1;
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;

      if ((rewardType === 'Cash') && (userRank >= rankStart) && (userRank <= rankEnd) && (user?.pnlAfterCost > 0) && (user?.attendancePer >= leaderboardParams?.tradingDaysAttendance)) {
        console.log('week', reward)
        await addRewardToWallet(reward, user, setting, 'Weekly', startOfWeek, endOfWeek, workingDays);
        break;
      }
    }
  }
};

exports.quarterPayout = async () => {
  const setting = await Setting.find();
  const leaderboardParams = await LeaderboardParams.findOne({ status: 'Active', frequency: 'Quarter' })
  const helper = await payoutHelper(leaderboardParams?.quarterStartDate, leaderboardParams?.quarterEndDate, leaderboardParams, setting[0]);
  const data = helper?.data;
  const workingDays = helper?.workingDays;

  const rewards = leaderboardParams?.rewards;
  for (const [index, user] of data.entries()) {
    const userRank = index + 1; // Assuming you have a 'rank' field in your user object
    for (const rewardobj of rewards) {
      const { rankStart, rankEnd, rewardType, reward } = rewardobj;
      if ((rewardType === 'Cash') && (userRank >= rankStart) && (userRank <= rankEnd) && (user?.pnlAfterCost > 0) && (user?.attendancePer >= leaderboardParams?.tradingDaysAttendance)) {
        await addRewardToWallet(reward, user, setting, 'Quarter', leaderboardParams?.quarterStartDate, leaderboardParams?.quarterEndDate, workingDays);
        // Assuming each user qualifies for only one reward, if not, you might need additional logic here
        break; // Break the loop once the reward for this user is processed
      }
    }
  }
};

const payoutHelper = async (startDate, endDate, leaderboardParams, setting) => {

  const holidays = await TradingHoliday.find({
    holidayDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    $expr: {
      $and: [
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 1] }, // 1 represents Sunday
        { $ne: [{ $dayOfWeek: "$holidayDate" }, 7] }  // 7 represents Saturday
      ]
    }
  });
  const workingDays = await getWorkingTradingDays(startDate, endDate, holidays, setting?.weekStart, setting?.weekEnd);
  const pipeline = [
    {
      $match: {
        createdOn: {
          $gt: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
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
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdOn",
            },
          },
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
                    new Date(endDate),
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
            { $ceil: '$daysOfInterest' }
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
        tradingDays: {
          $size: '$tradingDays'
        },
        attendancePer: {
          $multiply: [
            {
              $divide: [
                {
                  $size: '$tradingDays'
                }, workingDays
              ]
            }, 100
          ]
        }
      },
    },
    {
      $addFields: {
        workingDays: workingDays,
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
  return {data, workingDays};
}

const savePayout = async (data, session) => {
  try {
    const { npnl, gpnl, brokerage, trades, portfolioValue, moneyCost, rewardAmount,
      rewardCurrency, tds, daysOfInterest, trader, frequency, pnlAfterCost, workingDays, frequencyStart, frequencyEnd } = data;

    const saveInfo = await PaperTradePayout.create([{
      npnl, gpnl, brokerage, trades, portfolioValue, moneyCost, rewardAmount,
      rewardCurrency, tds, daysOfInterest, trader, frequency, pnlAfterCost, date: new Date(), workingDays, frequencyStart, frequencyEnd
    }], { session: session });
  } catch (err) {
    console.log(err);
  }
}

const email = async (user, payoutAmount) => {
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

const getWorkingTradingDays = async (startDate, endDate, holidays, weekStart, weekEnd) => {
  let newDate = moment(startDate);
  let dayCount = 0;

  while (newDate <= moment(endDate)) {
    if (!isHoliday(newDate, holidays) && !isWeekend(newDate, weekStart, weekEnd)) {
      dayCount++;
    }
    newDate.add(1, 'day'); // Increment the date
  }

  return dayCount;
};

const isHoliday = (date, holidays) => {
  return holidays.some(elem => {
    return moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'day') &&
      moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'month') &&
      moment(elem.holidayDate).add(5, 'hours').add(30, 'minutes').isSame(date, 'year')
  });
};

const isWeekend = (date, weekStart, weekEnd) => {
  const newDate = date.clone()
  // .add(5, 'hours').add(30, 'minutes');
  return newDate.day() === weekStart || newDate.day() === weekEnd; // Sunday or Saturday
};