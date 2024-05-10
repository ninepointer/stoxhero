const PaperTradeLeaderboard = require("../models/mock-trade/paperTradeLeaderboard");
const User = require("../models/User/userDetailSchema");
const LeaderboardParams = require('../models/LeaderboardParams/leaderboardSchema');
const Wallet = require('../models/UserWallet/userWalletSchema');
const Setting = require('../models/settings/setting');
const emailService = require("../utils/emailService");
const { createUserNotification } = require("./notification/notificationController");
const uuid = require("uuid");
const moment = require('moment');

const addRewardToWallet = async (rewardAmount, pnlObj, setting) => {
  const payoutAmountWithoutTDS = Number(rewardAmount);
  let payoutAmount = payoutAmountWithoutTDS;
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
  await wallet.save();
  const user = await User.findById(pnlObj?.trader).select(
    "first_name last_name email"
  );

  payoutAmountWithoutTDS - pnlObj?.fee > 0
    ? (
      ((payoutAmountWithoutTDS - pnlObj?.fee) * setting[0]?.tdsPercentage) /
      100
    ).toFixed(2)
    : 0;

    //todo-vijay
  // if (process.env.PROD == "true") {
  try {
    if (!existingTransaction) {
      console.log(user?.email, "sent");
      await emailService(
        user?.email,
        "TestZone Payout Credited - StoxHero",
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
            <p>You can now purchase TenX and participate in different TestZones on StoxHero.</p>
            
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
    });
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
  for (const elem of leaderBoardData) {
    for (let obj of rewards) {
      for (let i = obj?.rankStart - 1; i <= obj?.rankEnd - 1; i++) {
        if (obj?.rewardType === 'Cash') {
          await addRewardToWallet(obj?.reward, elem, setting);
        }
      }
    }
  }
};

exports.monthPayout = async () => {
  const setting = await Setting.find();
  const leaderboardParams = await LeaderboardParams.findOne({ frequency: 'Monthly', status: 'Active' });
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  const leaderBoardData = await PaperTradeLeaderboard.find({ createdOn: { $gte: today } })
    .sort({ npnl: -1, gpnl: -1 });

  const rewards = leaderboardParams?.rewards;
  for (const elem of leaderBoardData) {
    for (let obj of rewards) {
      for (let i = obj?.rankStart - 1; i <= obj?.rankEnd - 1; i++) {
        if (obj?.rewardType === 'Cash') {
          await addRewardToWallet(obj?.reward, elem, setting);
        }
      }
    }
  }
};