const express = require("express");
const router = express.Router();
require("../../db/conn");
// const Admin = require("../models/adminSchema");
const RetreiveOrder = require("../../models/TradeDetails/retreiveOrder");
const LiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const MockCompany = require("../../models/mock-trade/mockTradeCompanySchema");
const MockUser = require("../../models/mock-trade/mockTradeUserSchema");
// const MockCompany = require("../../models/mock-trade/mockTradeCompanySchema");
const InfinityTraderCompany = require("../../models/mock-trade/infinityTradeCompany");
const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const PaperTrade = require("../../models/mock-trade/paperTrade");

const RetreiveTrade = require("../../models/TradeDetails/retireivingTrade")
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const dbBackup = require("../../Backup/mongoDbBackUp")
const newdbBackup = require("../../Backup/newBackup")
const TradableInstrument = require("../../controllers/TradableInstrument/tradableInstrument")
const cronjob = require("../../marketData/getinstrumenttickshistorydata")
const dailyPnlDataController = require("../../controllers/dailyPnlDataController")
const traderwiseDailyPnlController = require("../../controllers/traderwiseDailyPnlController")
const DailyPNLData = require("../../models/InstrumentHistoricalData/DailyPnlDataSchema")
const TraderDailyPnlData = require("../../models/InstrumentHistoricalData/TraderDailyPnlDataSchema");
const UserDetail = require("../../models/User/userDetailSchema");
const PortFolio = require("../../models/userPortfolio/UserPortfolio");
const ContestTrade = require("../../models/Contest/ContestTrade");
const ObjectId = require('mongodb').ObjectId;
const TradableInstrumentSchema = require("../../models/Instruments/tradableInstrumentsSchema")
const authentication = require("../../authentication/authentication");
const Instrument = require("../../models/Instruments/instrumentSchema");

// const Instrument = require('../')
const { takeAutoTrade } = require("../../controllers/contestTradeController");
const { deletePnlKey } = require("../../controllers/deletePnlKey");
const {client, getValue} = require("../../marketData/redisClient")
// const {overallPnlTrader} = require("../../controllers/infinityController");
const { marginDetail, tradingDays, autoExpireTenXSubscription } = require("../../controllers/tenXTradeController")
const { getMyPnlAndCreditData } = require("../../controllers/infinityController");
// const {tenx, paperTrade, infinityTrade} = require("../../controllers/AutoTradeCut/autoTradeCut");
const { infinityTradeLive } = require("../../controllers/AutoTradeCut/collectingTradeManually")
const { autoCutMainManually, autoCutMainManuallyMock, creditAmount, changeStatus, changeBattleStatus } = require("../../controllers/AutoTradeCut/mainManually");
const TenXTrade = require("../../models/mock-trade/tenXTraderSchema")
const InternTrade = require("../../models/mock-trade/internshipTrade")
const InfinityInstrument = require("../../models/Instruments/infinityInstrument");
const { getInstrument, tradableInstrument } = require("../../services/xts/xtsMarket");
const { ifServerCrashAfterOrder } = require("../../services/xts/xtsInteractive");
// const XTSTradableInstrument = require("../../controllers/TradableInstrument/tradableXTS")
const { placeOrder } = require("../../services/xts/xtsInteractive");
// const fetchToken = require("../../marketData/generateSingleToken");
// const fetchXTSData = require("../../services/xts/xtsHelper/fetchXTSToken");
// const {autoCutMainManually} = require("../../controllers/AutoTradeCut/mainManually")
const { saveLiveUsedMargin, saveMockUsedMargin } = require("../../controllers/marginRequired");
const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const InfinityLiveUser = require("../../models/TradeDetails/infinityLiveUser");
const { openPrice } = require("../../marketData/setOpenPriceFlag");
const Permission = require("../../models/User/permissionSchema");
const { EarlySubscribedInstrument } = require("../../marketData/earlySubscribeInstrument")
const { subscribeTokens } = require("../../marketData/kiteTicker");
const { updateUserWallet } = require("../../controllers/internshipTradeController")
const { saveMissedData, saveRetreiveData, saveDailyContestMissedData, saveNewRetreiveData } = require("../../utils/insertData");
// const {autoCutMainManually, autoCutMainManuallyMock} = require("../../controllers/AutoTradeCut/mainManually");
// const {creditAmountToWallet} = require("../../controllers/dailyContestController");
// const DailyContestMockCompany = require("../../models/DailyContest/dailyContestMockCompany");
const DailyContestMockUser = require("../../models/DailyContest/dailyContestMockUser");
const MarginDetailMockCompany = require("../../models/marginUsed/infinityMockCompanyMargin")
const MarginDetailLiveCompany = require("../../models/marginUsed/infinityLiveCompanyMargin")
const MarginDetailLiveUser = require("../../models/marginUsed/infinityLiveUserMargin")
const DailyContest = require("../../models/DailyContest/dailyContest")
const TenxSubscription = require("../../models/TenXSubscription/TenXSubscriptionSchema");
const InternBatch = require("../../models/Careers/internBatch")
const DailyLiveContest = require("../../models/DailyContest/dailyContestLiveCompany")
const { creditAmountToWallet } = require("../../controllers/marginX/marginxController");
const userWallet = require("../../models/UserWallet/userWalletSchema");
const { processBattles } = require("../../controllers/battles/battleController")
const Battle = require("../../models/battle/battle")
const MarginX = require("../../models/marginX/marginX");
const MarginXUser = require("../../models/marginX/marginXUserMock");

const BattleMock = require("../../models/battle/battleTrade");
const Holiday = require("../../models/TradingHolidays/tradingHolidays");
const Career = require("../../models/Careers/careerSchema");
const mongoose = require('mongoose');
const moment = require("moment")
const {mail} = require("../../controllers/dailyReportMail");
const CareerApplication = require("../../models/Careers/careerApplicationSchema");
const emailService = require("../../utils/emailService")
const {createUserNotification} = require('../../controllers/notification/notificationController');
const uuid = require('uuid');
const Notification = require("../../models/notifications/notification")
const Referrals = require("../../models/campaigns/referralProgram")
const {dailyContestTimeStore, dailyContestTradeCut} = require("../../dailyContestTradeCut")
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema");
const Affiliate = require("../../models/affiliateProgram/affiliateProgram")
const AffiliateTransaction = require("../../models/affiliateProgram/affiliateTransactions");
const totp = require("totp-generator");


router.get('/updatePortfolioId', async(req,res) =>{
  const trade = await PaperTrade.find({portfolioId: null})
  console.log(trade.length);
  for(let elem of trade){
    elem.portfolioId = new ObjectId("6433e2e5500dc2f2d20d686d");

    console.log(elem);
    await elem.save({validateBeforeSave: false});
  }
  res.send("ok")
})

router.get('/getotp', async(req,res) =>{
  const x = totp(process.env.KUSH_ACCOUNT_HASH_CODE)
  console.log(x)
  res.send("ok")
})

router.get('/transaction', async(req,res) =>{
  const transaction = await AffiliateTransaction.find({product: new ObjectId("6586e95dcbc91543c3b6c181")});
  for(let elem of transaction){
    elem.productActualPrice = 0;
    elem.productDiscountedPrice = 0;
    await elem.save({validateBeforeSave: false});
  }
  
  res.send("ok")
})

router.get('/negetivetds', async(req,res) =>{
  // const tenx = await TenxSubscription.find();

  // const promises = tenx.map(async (elem) => {
  //   for (let subelem of elem.users) {
  //     if (subelem.tdsAmount < 0) {
  //       subelem.tdsAmount = 0;
  //       console.log(subelem);
  //     }
  //   }

  //   await elem.save({validateBeforeSave: false});

  

  const tenx = await MarginX.find();

  const promises = tenx.map(async (elem) => {

    if(elem.startTime > new Date("2023-12-10")){
      for (let subelem of elem.participants) {
        // if (subelem.tdsAmount < 0) {
          // subelem.tdsAmount = 0;
          subelem.herocashPayout = subelem.tdsAmount
          console.log(subelem);
        // }
      }
  
      // await elem.save({validateBeforeSave: false});
  
    }
  });

  // Wait for all promises to resolve before continuing
  await Promise.all(promises);
})

router.get('/pendingorder', async (req, res) => {

  let stopLossData = await client.get('stoploss-stopprofit');
  stopLossData = JSON.parse(stopLossData);
  
  for(let elem in stopLossData){
    console.log(elem);
    let indicesToRemove = [];
    const symbolArr = stopLossData[elem];
    for(let i = 0; i < symbolArr.length; i++){
      if(symbolArr[i]?.sub_product_id?.toString() === "6433e2e5500dc2f2d20d686d"){
        indicesToRemove.push(i);
        // console.log(symbolArr[i])
      }
    }

    console.log(indicesToRemove);
    indicesToRemove.forEach(index => stopLossData[elem].splice(index, 1, {}));

  }
  await client.set('stoploss-stopprofit', JSON.stringify(stopLossData));

  const updates = await PendingOrder.updateMany(
    {
      status: 'Pending',
      // sub_product_id: new ObjectId(contestId)
    },
    {
    $set: {
      status: "Cancelled"
    }
  })
  // console.log(indicesToRemove);

  // if (stopLossData && stopLossData[`${instrumentToken}`]) {
  //     let symbolArray = stopLossData[`${instrumentToken}`];
  //     let indicesToRemove = [];
  //     for(let i = symbolArray.length-1; i >= 0; i--){
  //         if(symbolArray[i]?.createdBy?.toString() === userId.toString() && symbolArray[i]?.symbol === symbol){
  //             // remove this element
  //             indicesToRemove.push(i);
  //           //   const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArray[i]?._id)},{
  //           //     $set: {
  //           //       status: "Cancelled",
  //           //       execution_price: 0
  //           //     }
  //           // })
  //         }
  //     }

  //     // Remove elements after the loop
      // indicesToRemove.forEach(index => symbolArray.splice(index, 1, {}));
  // }
  res.send("ok")
})


router.get('/changeDateToUtc', async (req, res) => {

  const user = await UserDetail.find({ "activationDetails.activationStatus": "Active" }).select('_id subscription activationDetails paidDetails')
  let count = 0;
  let count2 = 0;

  for (let elem of user) {
    // console.log(elem._id)
    count += 1;
    let paidVariable = new Date(elem.paidDetails.paidDate);
    let activeVariable = new Date(elem.activationDetails.activationDate);

    // Subtract 5 hours and 30 minutes
    paidVariable.setHours(paidVariable.getHours() - 5);
    paidVariable.setMinutes(paidVariable.getMinutes() - 30);

    activeVariable.setHours(activeVariable.getHours() - 5);
    activeVariable.setMinutes(activeVariable.getMinutes() - 30);

    // console.log(paidVariable, activeVariable);

    if(elem.paidDetails.paidStatus==="Active"){
      elem.paidDetails.paidDate = paidVariable;
      count2 += 1
    }

    console.log(count, count2, elem._id.toString(), activeVariable, paidVariable)
    elem.activationDetails.activationDate = activeVariable;
    await elem.save({ validateBeforeSave: false });

  }


  res.send("ok")
})


router.get('/revertchangeDateToUtc', async (req, res) => {

  const user = await UserDetail.find({ "activationDetails.activationStatus": "Active", joining_date: {$gte : new Date("2023-12-18")} }).select('_id subscription activationDetails paidDetails')
  let count = 0;
  let count2 = 0;

  for (let elem of user) {
    // console.log(elem._id)
    count += 1;
    let paidVariable = new Date(elem.paidDetails.paidDate);
    let activeVariable = new Date(elem.activationDetails.activationDate);

    // Subtract 5 hours and 30 minutes
    paidVariable.setHours(paidVariable.getHours() + 5);
    paidVariable.setMinutes(paidVariable.getMinutes() + 30);

    activeVariable.setHours(activeVariable.getHours() + 5);
    activeVariable.setMinutes(activeVariable.getMinutes() + 30);

    // console.log(paidVariable, activeVariable);

    if(elem.paidDetails.paidStatus==="Active"){
      elem.paidDetails.paidDate = paidVariable;
      count2 += 1
    }

    console.log(count, count2, elem._id.toString(), activeVariable, paidVariable)
    elem.activationDetails.activationDate = activeVariable;
    await elem.save({ validateBeforeSave: false });

  }


  res.send("ok")
})

router.get('/updatepaidstatus', async(req,res) =>{
  const user = await UserDetail.find({"paidDetails.paidStatus": null, "paidDetails.paidDate": {$ne : null}});
  for(let elem of user){
    
    elem.paidDetails.paidStatus = "Active";
    console.log(elem);
    await elem.save({validateBeforeSave: false});
  }
})

router.get('/updatenewpaid', async(req,res) =>{
  const contest = await DailyContest.aggregate([
    {
      $match: {
        entryFee: {
          $gt: 0,
        },
      },
    },
    {
      $project: {
        allParticipants: "$participants",
        entryFee: 1,
      },
    },
    {
      $unwind: "$allParticipants",
    },
    {
      $project:

      {
        fee: "$entryFee",
        boughtAt:
          "$allParticipants.participatedOn",
        _id: 0,
        userId: "$allParticipants.userId",
        product: new ObjectId("6517d48d3aeb2bb27d650de5")
      },
    },

  ]);
  console.log(contest.length);
  const tenx = await TenxSubscription.aggregate([
    {
      $project: {
        allParticipants: "$users",
        discounted_price: 1
      },
    },
    {
      $unwind: "$allParticipants",
    },
    {
      $project: {
        fee: "$discounted_price",
        userId: "$allParticipants.userId",
        _id: 0,
        boughtAt: "$allParticipants.subscribedOn",
        product: new ObjectId("6517d3803aeb2bb27d650de0")
      }
    }
  ]);

  console.log(tenx.length);
  const marginx = await MarginX.aggregate([
    {
      $lookup: {
        from: "marginx-templates",
        localField: "marginXTemplate",
        foreignField: "_id",
        as: "template",
      },
    },
    {
      $project: {
        allParticipants: "$participants",
        fee: {
          $arrayElemAt: ["$template.entryFee", 0],
        },
      },
    },
    {
      $unwind:

      {
        path: "$allParticipants",
      },
    },
    {
      $project:
      {
        userId: "$allParticipants.userId",
        _id: 0,
        fee: 1,
        boughtAt: "$allParticipants.boughtAt",
        product: new ObjectId("6517d40e3aeb2bb27d650de1")
      },
    },
  ])

  console.log(marginx.length);
  const battle = await Battle.aggregate([
    {
      $lookup: {
        from: "battle-templates",
        localField: "battleTemplate",
        foreignField: "_id",
        as: "template",
      },
    },
    {
      $project: {
        allParticipants: "$participants",
        fee: {
          $arrayElemAt: ["$template.entryFee", 0],
        },
      },
    },
    {
      $unwind:
      {
        path: "$allParticipants",
      },
    },
    {
      $project:
      {
        userId: "$allParticipants.userId",
        _id: 0,
        fee: 1,
        boughtAt: "$allParticipants.boughtAt",
        product: new ObjectId("6517d4623aeb2bb27d650de2")
      },
    },
  ]);

  console.log(battle.length);

  let concatenatedArray = contest.concat(tenx, marginx, battle);

  let uniqueMap = new Map();

// Iterate through the array and update the map


concatenatedArray.forEach((element) => {
  const userId = (element.userId).toString();
  if (!uniqueMap.has(userId) || new Date(element.boughtAt) < new Date(uniqueMap.get(userId).boughtAt)) {
    console.log(element);
    uniqueMap.set(userId, element);
  }
});

// Convert the map values back to an array
let uniqueArray = Array.from(uniqueMap.values());

console.log(uniqueArray.length);

  // const paidUsers = [];
let count = 0;
  for(let elem of uniqueArray){
    const user = await UserDetail.findOneAndUpdate({_id: new ObjectId(elem.userId), "paidDetails.paidDate": {$eq: null}},
    {
      $set: {
        "paidDetails.paidProduct": elem.product,
        "paidDetails.paidDate": elem.boughtAt,
        "paidDetails.paidStatus": "Inactive",
        "paidDetails.paidProductPrice": elem.fee,
      }
    }
    );
    console.log(user?.name)
    if(user){
      console.log(count)
      count += 1;
    }
  }
console.log(count)
  res.send(count);
})

router.get('/updatecreationprocess', async(req,res) =>{
  const user = await UserDetail.find({creationProcess: "Auto SignUp"});
  for(let elem of user){
    if(elem.referredBy){
      elem.creationProcess = "Referral SignUp";
      console.log(elem.creationProcess, elem.first_name)
    }
    await elem.save({validationBeforeSave: false});
  }
})

router.get('/updateTenxPnl', async(req,res) =>{
  const tenx = await TenxSubscription.find();

  const promises = tenx.map(async (elem) => {
    for (let subelem of elem.users) {
      if (subelem.expiredOn) {
        const pnl = await pnlFunc(subelem.subscribedOn, subelem.expiredOn, subelem.userId, elem._id);
        // console.log(pnl[0]?.grossPnl, pnl[0]?.npnl, pnl)
        subelem.gpnl = pnl[0]?.grossPnl ? pnl[0]?.grossPnl : 0;
        console.log(subelem.gpnl)
        subelem.npnl = pnl[0]?.npnl ? pnl[0]?.npnl : 0;
        subelem.brokerage = pnl[0]?.brokerage ? pnl[0]?.brokerage : 0;
        subelem.tradingDays = pnl[0]?.tradingDays ? pnl[0]?.tradingDays : 0;
        subelem.trades = pnl[0]?.trades ? pnl[0]?.trades : 0;

        console.log(subelem.gpnl, subelem.npnl)

        console.log("subelem", subelem);
      }
    }

    await elem.save();
  });

  // Wait for all promises to resolve before continuing
  await Promise.all(promises);
})

const pnlFunc = async(startDate, endDate, userId, id)=>{
  const pnl = await TenXTrade.aggregate([
    {
      $match:
      {
        subscriptionId: new ObjectId(id),
        trader: new ObjectId(userId),
        trade_time_utc: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        status: "COMPLETE"
      },
    },
    {
      $group: {
        _id: {
          userId: "$trader",
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
        trades: {
          $count: {},
        },
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$trade_time_utc",
            },
          },
        },
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
      },
    },
  ])

  return pnl
}

router.get('/updateMarginxPnl', async(req,res) =>{
  const marginx = await MarginX.find()
  .populate('marginXTemplate', 'entryFee')

  const promises = marginx.map(async (elem) => {
    for (let subelem of elem.participants) {
      // if (subelem.expiredOn) {
        const pnl = await pnlFuncMarginx(subelem.userId, elem._id);
        // console.log(pnl[0]?.grossPnl, pnl[0]?.npnl, pnl)
        subelem.gpnl = pnl[0]?.gpnl ? pnl[0]?.gpnl : 0;
        // console.log(subelem.gpnl)
        subelem.npnl = pnl[0]?.npnl ? pnl[0]?.npnl : 0;
        subelem.brokerage = pnl[0]?.brokerage ? pnl[0]?.brokerage : 0;
        subelem.tradingDays = pnl[0]?.tradingDays ? pnl[0]?.tradingDays : 0;
        subelem.trades = pnl[0]?.trades ? pnl[0]?.trades : 0;
        if(!subelem.fee){
          subelem.fee = elem.marginXTemplate.entryFee;
          subelem.actualPrice = elem.marginXTemplate.entryFee;
        }

        console.log("subelem", subelem);
      // }
    }

    await elem.save({validateBeforeSave: false});
  });

  // Wait for all promises to resolve before continuing
  await Promise.all(promises);
})

const pnlFuncMarginx = async(userId, id)=>{
  const pnl = await MarginXUser.aggregate([
    {
      $match: {
        marginxId: new ObjectId(
          id
        ),
        trader: new ObjectId(
          userId
        ),
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          userId: "$trader",
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
        trades: {
          $count: {},
        },
        tradingDays: {
          $addToSet: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$trade_time_utc",
            },
          },
        },
      },
    },
    {
      $project: {
        userId: "$_id.userId",
        gpnl: "$amount",
        brokerage: "$brokerage",
        _id: 0,
        npnl: {
          $subtract: ["$amount", "$brokerage"],
        },
        tradingDays: {
          $size: "$tradingDays",
        },
        trades: 1,
      },
    },
  ])

  return pnl
}

router.get('/changeContestToTestzone', async(req,res) =>{
  // const notification = await Notification.find();

  // for(let elem of notification){
  //   console.log("notification")
  //   if(elem.productCategory === "Contest"){
  //     elem.productCategory = "TestZone";
  //   }
  //   if(elem.title.includes("Contest")){
  //     const newTitle = elem.title.replace("Contest", "TestZone")
  //     elem.title = newTitle
  //   }

  //   if(elem.description.includes("contest")){
  //     const newDes = elem.description.replace("contest", "testzone");
  //     elem.description = newDes;
  //   }
  //   const data = await elem.save();
  //   console.log(data)
  // }
  await dailyContestTimeStore()
  await dailyContestTradeCut();
})

router.get('/getProductInfoData', async(req,res) =>{
  // const arrr = ["", "65213309cc62c86984c48f95"]
  const users = await UserDetail.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          referredBy: new ObjectId(
            "655b519138e04eb74a3f493e"
          ),
          joining_date: {
            $gte: new Date("2023-11-21"),
          },
        },
    },
    {
      $lookup: {
        from: "paper-trades",
        localField: "_id",
        foreignField: "trader",
        as: "virtual",
      },
    },
    {
      $lookup:

        {
          from: "dailycontest-mock-users",
          localField: "_id",
          foreignField: "trader",
          as: "dailycontest",
        },
    },
    {
      $lookup:

        {
          from: "tenx-trade-users",
          localField: "_id",
          foreignField: "trader",
          as: "tenx",
        },
    },
    {
      $lookup:

        {
          from: "marginx-mock-users",
          localField: "_id",
          foreignField: "trader",
          as: "marginx",
        },
    },

    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          marginx: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$marginx",
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
          dailyContest: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$dailycontest",
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
          virtual: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$virtual",
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
          tenx: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$tenx",
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
          first_name: 1,
          last_name: 1,
          email: 1,
          mobile: 1,
          // dailycontest: 1,
        },
    },
  ])

  const contest = await DailyContest.find({contestStartTime: {$gte: new Date("2023-11-21")}})

  console.log(users.length, contest.length)
  for(let elem of users){
    if(elem.dailyContest){
      for(let subelem of contest){
        for(let sub_subelem of subelem.participants){
          console.log(sub_subelem.userId)
          if(sub_subelem.fee > 0 && sub_subelem.userId.toString() === elem._id.toString()){
            elem.paidContest = true;
            break;
          }
          // else{
          //   elem.freeContest = true;
          //   break;
          // }
        }
        if(elem.paidContest){
          break;
        }
      }
    }

  }
  

  res.send(users)


})

router.get('/getPnlInfoData', async(req,res) =>{
  // const arrr = ["", "65213309cc62c86984c48f95"]
  const users = await UserDetail.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          referredBy: new ObjectId(
            "655b519138e04eb74a3f493e"
          ),
          joining_date: {
            $gte: new Date("2023-11-21"),
          },
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          first_name: 1,
          last_name: 1,
          email: 1,
          mobile: 1,
          // dailycontest: 1,
        },
    },
  ])

  const contest = await DailyContest.find({contestStartTime: {$gte: new Date("2023-11-21")}})
  console.log(users.length, contest.length)
  for(let elem of users){
    for(let subelem of contest){
      for(let sub_subelem of subelem.participants){
        console.log(sub_subelem.userId)
        if(sub_subelem.userId.toString() === elem._id.toString()){
          elem[`${"contestPayout"}-${subelem.contestName}`] = sub_subelem.payout ? sub_subelem.payout : 0;
          elem[`${"contestNpnl"}-${subelem.contestName}`] = sub_subelem.npnl;
          elem[`${"contestFee"}-${subelem.contestName}`] = sub_subelem.fee;
          break;
        }
      }
    }
  }
  

  res.send(users)


})

router.get('/addsignup', async(req,res) =>{
  // const user = await UserDetail.findOne({myReferralCode: "RUL0AALQ"});
  const referral = await Referrals.findOne({_id: new ObjectId("654192220068c82a56e717c8")})
  .populate('users.userId', 'first_name last_name mobile');


  let arr = [];
  for(let elem of referral.users){
    const wallet = await userWallet.findOne({userId:elem.userId});
    const transactionDescription = `Amount credited for as sign up bonus.`;
    const existingTransaction = wallet?.transactions?.some(transaction => (transaction.description === transactionDescription))
    if(!existingTransaction){

      try {
        wallet?.transactions?.push({
          title: 'Sign up Bonus',
          description: `Amount credited for as sign up bonus.`,
          amount: 100,
          transactionId: uuid.v4(),
          transactionDate: new Date(),
          transactionType: "Cash"
        });
        await wallet?.save({ validateBeforeSave: false });
        console.log("Saved Wallet:", wallet)
      } catch (e) {
        console.log(e);
      }
      // console.log(elem.userId);
      // arr.push({name: elem.userId.first_name+" "+elem.userId.last_name, mobile: elem.userId.mobile})
    }
  }
  // return res.send(arr);
  // 654192220068c82a56e717c8
  // const userList = await UserDetail.find({referredBy: user._id});
// let check = 0
  // for(let elem of userList){
  //   const transactionDescription = `Amount credited for as sign up bonus.`;
  
  //   // Check if a transaction with this description already exists

    // const wallet = await userWallet.findOne({userId:elem._id});
    // const existingTransaction = wallet?.transactions?.some(transaction => (transaction.description === transactionDescription))

  //   // console.log("Wallet, Amount, Currency:",wallet, userId, amount, currency)
  //   if(!existingTransaction){
  //     check += 1
  //     console.log(check)

  //   }

  // }



})

router.get('/updatepayout', async(req,res) =>{
  // const arrr = ["", "65213309cc62c86984c48f95"]
  const contest = await DailyContest.findOne({_id: new ObjectId("655668097d89bf3d5dea859c")})

  let data = 0;
  for(let user of contest.participants){
    const wallet = await userWallet.findOne({ userId: new ObjectId(user.userId) });
    const transactionDescription = `Amount credited for contest ${contest.contestName}`;
    const userData = await UserDetail.findOne({_id: new ObjectId(user.userId)}).select('email first_name last_name')
    // Check if a transaction with this description already exists
    const existingTransaction = wallet?.transactions?.some(transaction => (transaction.description === transactionDescription && transaction.transactionDate >= new Date("2023-11-17")));

    // console.log(userId, pnlDetails[0]);
    //check if wallet.transactions doesn't have an object with the particular description, then push it to wallet.transactions
    if(user.payout && !existingTransaction){
      if(wallet?.transactions?.length == 0 || !existingTransaction){
        wallet.transactions.push({
            title: 'TestZone Credit',
            description: `Amount credited for TestZone ${contest.contestName}`,
            transactionDate: new Date(),
            amount: user.payout.toFixed(2),
            transactionId: uuid.v4(),
            transactionType: 'Cash'
        });

        await wallet.save();
      }

      console.log(user.payout, Number(user.payout))
      data += Number(user.payout)
      console.log(user.payout.toFixed(2), userData.first_name)
      try {
        if (!existingTransaction) {
          console.log(userData?.email, 'sent')
          await emailService(userData?.email, 'Contest Payout Credited - StoxHero', `
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
             <p>Hello ${userData.first_name},</p>
             <p>Amount of ${(user.payout)?.toFixed(2)}INR has been credited in your wallet for ${contest.contestName}.</p>
             <p>You can now purchase Tenx and participate in various activities on stoxhero.</p>
             
             <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
             <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
             <br/><br/>
             <p>Thanks,</p>
             <p>StoxHero Team</p>
   
             </div>
         </body>
         </html>
         `);
        }
      } catch (e) {
        console.log('error sending mail')
      }
      if (!existingTransaction) {
        await createUserNotification({
          title: 'Contest Reward Credited',
          description: `₹${(user.payout)?.toFixed(2)} credited to your wallet as your contest reward`,
          notificationType: 'Individual',
          notificationCategory: 'Informational',
          productCategory: 'Contest',
          user: user?._id,
          priority: 'Medium',
          channels: ['App', 'Email'],
          createdBy: '63ecbc570302e7cf0153370c',
          lastModifiedBy: '63ecbc570302e7cf0153370c'
        });
      }
    }

  }

  console.log("data", data)
})

router.get('/updateDailyContest', async(req,res) =>{
  const daily = await DailyContest.find();
  const userData = await DailyContestMockUser.aggregate([
    {
        $match: {
            trade_time: {
                $lte: new Date("2023-10-25")
            },
            status: "COMPLETE",
            // trader: new ObjectId(userId),
            // contestId: new ObjectId(id)
        },
    },
    {
        $group: {
            _id: {
              trader: "$trader",
              contestId: "$contestId"
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
            trades: {
              $count: {},
            }
        },
    },
    {
        $project:
        {
          npnl: {
              $subtract: ["$amount", "$brokerage"],
          },
          gpnl: "$amount",
          brokerage: "$brokerage",
          trades: 1,
          trader: "$_id.trader",
          contestId: "$_id.contestId",
          _id: 0
        },
    },
  ])

  for(let elem of daily){
    for(let subelem of userData){
      if(elem._id.toString() === subelem.contestId.toString()){
        for(let sub_subelem of elem.participants){
          if(sub_subelem.userId.toString() === subelem.trader.toString()){
            sub_subelem.npnl = subelem.npnl;
            sub_subelem.gpnl = subelem.gpnl;
            sub_subelem.trades = subelem.trades;
            sub_subelem.brokerage = subelem.brokerage;

            console.log(sub_subelem)
          }
        }
      }
    }

    await elem.save({validateBeforeSave: false});
  }
})

router.get('/tenxremove', async(req,res) =>{
  // const arrr = ["", "65213309cc62c86984c48f95"]

  const wallet = await userWallet.findOne({userId: new ObjectId("65213309cc62c86984c48f95")});

  wallet.transactions = [...wallet.transactions, {
    title: 'TestZone Credit',
    description: `Amount credited for TestZone Muhurat Trading - 12th Nov(6:15 PM)`,
    transactionDate: new Date(),
    amount: 700,
    transactionId: uuid.v4(),
    transactionType: 'Cash'
}];

await wallet.save()
  // const 
  // await DailyContest.updateMany({contestStatus: "Completed"})
    // const daily = await DailyContest.findOne({_id: new ObjectId()})
})




router.get('/tenxremove', async(req,res) =>{
await DailyContest.updateMany({contestStatus: "Completed"})
  // const daily = await DailyContest.findOne({_id: new ObjectId()})
})

router.get('/tenxremove', async(req,res) =>{
  const subscription = await TenxSubscription.aggregate([
    {
      $unwind: {
        path: "$users",
      },
    },
    {
      $match: {
        "users.expiredOn": {
          $gte: new Date("2023-11-06"),
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscriptionId: "$_id",
        docId: "$users._id",
        dateDifference: {
          $divide: [
            {
              $subtract: [
                "$users.expiredOn",
                "$users.subscribedOn",
              ],
            },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $match: {
        dateDifference: {
          $gte: 35,
        },
      },
    },
  ])

  console.log("subscription", subscription)

  const user = await UserDetail.aggregate([
    {
      $unwind: {
        path: "$subscription",
      },
    },
    {
      $match: {
        "subscription.expiredOn": {
          $gte: new Date("2023-11-06"),
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        docId: "$subscription._id",
        dateDifference: {
          $divide: [
            {
              $subtract: [
                "$subscription.expiredOn",
                "$subscription.subscribedOn",
              ],
            },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $match: {
        dateDifference: {
          $gte: 35,
        },
      },
    },
  ])

  console.log("user", user)

  for(let elem of subscription){
    const subs = await TenxSubscription.findOne({_id: elem.subscriptionId})
    for(let subelem of subs.users){
      if(subelem._id.toString() === elem.docId.toString()){
        console.log("subs", subelem)
        subelem.payout = "",
        subelem.expiredOn = "",
        // subelem.expiredBy = "",
        subelem.tdsAmount = "",
        subelem.status = "Live"

        await subs.save();
        break;
      }
    }
  }

  for(let elem of user){
    const users = await UserDetail.findOne({_id: elem.userId})
    for(let subelem of users.subscription){
      if(subelem._id.toString() === elem.docId.toString()){
        console.log("user", subelem)
        subelem.payout = "",
        subelem.expiredOn = "",
        // subelem.expiredBy = "",
        subelem.tdsAmount = "",
        subelem.status = "Live"

        await users.save();
        break;
      }
    }
  }
})

router.get('/careerapplication', async(req,res) =>{
  console.log("data")
    const c = await CareerApplication.aggregate([
      {
        $lookup: {
          from: "careers",
          localField: "career",
          foreignField: "_id",
          as: "career",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "mobileNo",
          foreignField: "mobile",
          as: "user",
        },
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            user: {
              $ne: [],
            },
          },
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            first_name: {
              $arrayElemAt: ["$user.first_name", 0],
            },
            last_name: {
              $arrayElemAt: ["$user.last_name", 0],
            },
            joining_date: {
              $arrayElemAt: ["$user.joining_date", 0],
            },
            email: {
              $arrayElemAt: ["$user.email", 0],
            },
            mobile: {
              $arrayElemAt: ["$user.mobile", 0],
            },
            signup_process: {
              $arrayElemAt: [
                "$user.creationProcess",
                0,
              ],
            },
            jobRole: {
              $arrayElemAt: ["$career.jobTitle", 0],
            },
            jobType: {
              $arrayElemAt: ["$career.jobType", 0],
            },
            _id: 0,
            campaignCode: 1,
          },
      },
    ]
    )

    console.log(c)

    res.send(c);
})

router.get('/internpayout', async(req,res) =>{

  let cutoffDate = new Date('2023-07-10');
  let total = 0, batch=0;
  const internships = await InternBatch.find({ batchStatus: "Active", batchEndDate: { $lte: new Date() }})
  .populate('career', 'listingType')
  .select('batchName participants batchStartDate batchEndDate attendancePercentage payoutPercentage referralCount')
//   const internships = await InternBatch.aggregate([
//   //   {
//   //     $match: {
//   //       // batchEndDate: {$gte: new Date("2023-09-17")}
//   //      _id:  new ObjectId("64d9dd2b3c87a3054fa7b4c9")
//   //     }
//   // },
//     {
//       $lookup:{
//         from: "careers",
//         localField: "career",
//         foreignField: "_id",
//         as: "careerData",
//       }
//     },
    
//     {
//         $match: {
//             batchStatus: "Active",
//             batchEndDate: { $lte: new Date() },
//             "careerData.listingType":"Job"
//         }
//     },

//     {
//         $project: {
//             _id: 0,
//             batchId: "$_id",
//             batchName:"$batchName",
//             users: "$participants",
//             startDate: "$batchStartDate",
//             endDate: "$batchEndDate",
//             attendancePercentage: "$attendancePercentage",
//             payoutPercentage: "$payoutPercentage",
//             referralCount: "$referralCount"
//         }
//     }
// ]);
console.log('internships', internships.length);

  for(let elem of internships){
    if(elem.career.listingType === 'Job'){

    const attendanceLimit = elem.attendancePercentage;
      const referralLimit = elem.referralCount;
      const payoutPercentage = elem.payoutPercentage;
      const reliefAttendanceLimit = attendanceLimit - attendanceLimit * 5 / 100
      const reliefReferralLimit = referralLimit - referralLimit * 10 / 100
      const workingDays = calculateWorkingDays(elem.batchStartDate, elem.batchEndDate);
      const users = elem.participants;
      const batchId = elem._id;

      const holiday = await Holiday.find({
        holidayDate: {
          $gte: elem.batchStartDate,
          $lte: elem.batchEndDate
        },
        $expr: {
          $ne: [{ $dayOfWeek: "$holidayDate" }, 1], // 1 represents Sunday
          $ne: [{ $dayOfWeek: "$holidayDate" }, 7], // 7 represents Saturday
        }
      });

      // console.log("holiday date" , elem.batchEndDate, elem.batchStartDate, holiday)

      const profitCap = 15000;

      const tradingDays = async (userId, batchId) => {
        const pipeline =
          [
            {
              $match: {
                batch: new ObjectId(batchId),
                trader: new ObjectId(userId),
                status: "COMPLETE",
              },
            },
            {
              $group: {
                _id: {
                  date: {
                    $substr: ["$trade_time", 0, 10],
                  },
                },
                count: {
                  $count: {},
                },
              },
            },
          ]

        let x = await InternTrade.aggregate(pipeline);

        return x.length;
      }

      const pnlFunc = async (userId, batchId) => {
        let pnlDetails = await InternTrade.aggregate([
          {
            $match: {
              status: "COMPLETE",
              trader: new ObjectId(userId),
              batch: new ObjectId(batchId)
            },
          },
          {
            $group: {
              _id: {
              },
              amount: {
                $sum: { $multiply: ["$amount", -1] },
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              trades: { $count: {} },
            },
          },
          {
            $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              npnl: {
                $subtract: ["$amount", "$brokerage"],
              },
              gpnl: "$amount",
              noOfTrade: "$trades"
            },
          },
        ])

        return {npnl: pnlDetails[0]?.npnl, gpnl: pnlDetails[0]?.gpnl, noOfTrade: pnlDetails[0]?.noOfTrade};
      }

      function calculateWorkingDays(startDate, endDate) {
        // Convert the input strings to Date objects
        const start = new Date(startDate);
        let end = new Date(endDate);
        end = end.toISOString().split('T')[0];
        end = new Date(end)
        end.setDate(end.getDate() + 1);

        // Check if the start date is after the end date
        if (start > end) {
          return 0;
        }

        let workingDays = 0;
        let currentDate = new Date(start);

        // Iterate over each day between the start and end dates
        while (currentDate <= end) {
          // Check if the current day is a weekday (Monday to Friday)
          if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
            workingDays++;
          }

          // Move to the next day
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
      }

      const referrals = async (user) => {
        // elem.batchStartDate, elem.batchEndDate
        let refCount = 0;
        if(elem?.batchEndDate>cutoffDate){
          for (let subelem of user?.referrals) {
            const joiningDate = moment(subelem?.referredUserId?.joining_date);
          
            // console.log("joiningDate", joiningDate)
            // console.log((moment(moment(elem.batchStartDate).format("YYYY-MM-DD"))), joiningDate, (moment(elem.batchEndDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 })))
            // console.log("joiningDate", moment(moment(elem.batchStartDate).format("YYYY-MM-DD")), joiningDate ,endDate, endDate1, moment(endDate).set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD HH:mm:ss"))
            if (joiningDate.isSameOrAfter(moment(moment(elem.batchStartDate).format("YYYY-MM-DD"))) && joiningDate.isSameOrBefore(moment(elem.batchEndDate).set({ hour: 18, minute:59, second: 59, millisecond: 0 }))) {
              // console.log("joiningDate if", batchEndDate, batchEndDate.format("YYYY-MM-DD"))
              refCount = refCount + 1;
              // console.log("joiningDate if")
            }
          }
        }else{
          refCount = user?.referrals?.length;
        }

        // console.log(refCount)
        return refCount;
        // user?.referrals?.length;
      }
      let totalCredit = 0;
      for (let i = 0; i < users.length; i++) {
        // console.log('users', users?.length);
        const session = await mongoose.startSession();
        try{
            session.startTransaction();
            const user = await UserDetail.findOne({ _id: new ObjectId(users[i].user), status: "Active" })
            .populate('referrals.referredUserId', 'joining_date').session(session);
            // console.log('user ye hai', users[i]?.user);
            let eligible = false;
            if(user){
              const tradingdays = await tradingDays(users[i].user, batchId);
              const attendance = (tradingdays * 100) / (workingDays - holiday.length);
              const referral = await referrals(user);
              const pnl = await pnlFunc(users[i].user, batchId);
              const payoutAmountWithoutTDS = Math.min(pnl.npnl * payoutPercentage / 100, profitCap)
              const creditAmount = payoutAmountWithoutTDS;
              // console.log('credit amount for user and others', users[i]?.user, creditAmount, npnl, referral, tradingdays, attendance);
              // const creditAmount = payoutAmountWithoutTDS - payoutAmountWithoutTDS*setting[0]?.tdsPercentage/100;
  
    
              // console.log( users[i].user, referral, creditAmount);
              if (creditAmount > 0) {
                if (attendance >= attendanceLimit && referral >= referralLimit && pnl.npnl > 0) {
                  eligible = true;      
                  // console.log("no relief", users[i].user, npnl, creditAmount, attendance, referral);
                }
                
                if (!(attendance >= attendanceLimit && referral >= referralLimit) && (attendance >= attendanceLimit || referral >= referralLimit) && pnl.npnl > 0) {
                  if (attendance < attendanceLimit && attendance >= reliefAttendanceLimit) {
                    eligible = true;
                    console.log("attendance relief");
                  }
                  if (referral < referralLimit && referral >= reliefReferralLimit) {
                    eligible = true;
                    console.log("referral relief", attendance, tradingdays, users[i].user, pnl.npnl);
                  }
                }
              }
              if(eligible){
                console.log('Eligible', users[i]?.user, creditAmount, tradingdays, attendance, referral, pnl.gpnl, pnl.npnl, pnl.noOfTrade);

                totalCredit+=creditAmount;
                
                users[i].payout = creditAmount.toFixed(2);
                users[i].tradingdays = tradingdays;
                users[i].attendance = attendance.toFixed(2);
                users[i].referral = referral;
                users[i].gpnl = pnl?.gpnl?.toFixed(2);
                users[i].npnl = pnl?.npnl?.toFixed(2);
                users[i].noOfTrade = pnl?.noOfTrade;

                // await users.save();

              } else{
                users[i].payout = 0;
                users[i].tradingdays = tradingdays;
                users[i].attendance = attendance;
                users[i].referral = referral;
                users[i].gpnl = pnl?.gpnl?.toFixed(2);
                users[i].npnl = pnl?.npnl?.toFixed(2);
                users[i].noOfTrade = pnl?.noOfTrade?.toFixed(2);

                // await users.save();
              }
              await session.commitTransaction();      
            }
          
        }catch(e){
          console.log(e);
          await session.abortTransaction();
        }finally{
          await session.endSession();
        }
      }

      elem.workingDays = workingDays;
      elem.batchStatus = 'Completed';

      await elem.save();

      // console.log('first');
      console.log('total credit for', elem?.batchName, totalCredit);
      if(totalCredit>0){
        batch++;
      }
      total+=totalCredit;
  
    }
  }
  console.log('finished', total, batch);
})


router.get("/updateproduct", async (req, res) => {
  try{
    const subs = await TenxSubscription.updateMany({}, {product: new ObjectId('6517d3803aeb2bb27d650de0')});
    const battles = await Battle.updateMany({}, {product: new ObjectId('6517d4623aeb2bb27d650de2')});
    const interns = await InternBatch.updateMany({}, {product: new ObjectId('6517d46e3aeb2bb27d650de3')});
    const contests = await DailyContest.updateMany({}, {product: new ObjectId('6517d48d3aeb2bb27d650de5')});
    const marginx = await MarginX.updateMany({}, {product: new ObjectId('6517d40e3aeb2bb27d650de1')});
  
    res.send('done')
  }catch(e){
    console.log(e);
    res.send('not done');
  }
})

router.get("/tenxSubsRemovePayout", async (req, res) => {

  const subs = await TenxSubscription.find();
  const user = await UserDetail.find();

  for (elem of subs) {
    for (subelem of elem.users) {
      if (subelem.payout < 0) {
        subelem.payout = 0;
      }
    }
    const data = await elem.save();
    console.log(data);
  }

  for (elem of user) {
    for (subelem of elem.subscription) {
      if (subelem.payout < 0) {
        subelem.payout = 0;
      }
    }

    const data = await elem.save({validationBeforeSave: false});
    console.log(data)
  }

  res.send("ok")
});

router.get("/updaterankandpayoutcontest", async (req, res) => {

  console.log("in wallet")
  try {

    const contest = await DailyContest.find({ contestStatus: "Completed", payoutStatus: "Completed" });

    console.log(contest.length, contest)
    for (let j = 0; j < contest.length; j++) {
      const userContest = await DailyContestMockUser.aggregate([
        {
          $match: {
            status: "COMPLETE",
            contestId: new ObjectId(
              contest[j]._id
            ),
          },
        },
        {
          $group: {
            _id: {
              userId: "$trader",
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
          $project: {
            userId: "$_id.userId",
            _id: 0,
            npnl: {
              $subtract: ["$amount", "$brokerage"],
            },
          },
        },
        {
          $sort:
          {
            npnl: -1,
          },
        },
      ])
      console.log("rewardData", userContest.length)
      for (let i = 0; i < userContest.length; i++) {
        for (let subelem of contest[j]?.participants) {
          if (subelem.userId.toString() === userContest[i].userId.toString()) {
            subelem.rank = i + 1;
            console.log("subelem.rank", subelem.rank)
          }
        }
        await contest[j].save();
      }
    }
    // await contest[j].save();
  } catch (error) {
    console.log(error);
  }
});

const getPrizeDetails = async (battleId) => {
  try {
    // 1. Get the corresponding battleTemplate for a given battle
    const battle = await Battle.findById(battleId).populate('battleTemplate');
    if (!battle || !battle.battleTemplate) {
      return res.status(404).json({ status: 'error', message: "Battle or its template not found." });
    }

    const template = battle.battleTemplate;

    // Calculate the Expected Collection
    const expectedCollection = template.entryFee * template.minParticipants;
    let collection = expectedCollection;
    let battleParticipants = template?.minParticipants;
    if (battle?.participants?.length > template?.minParticipants) {
      battleParticipants = battle?.participants?.length;
      collection = template?.entryFee * battleParticipants;
    }

    // Calculate the Prize Pool
    let prizePool = collection - (collection * template.gstPercentage / 100)
    prizePool = prizePool - (prizePool * template.platformCommissionPercentage / 100);

    console.log(prizePool);

    // Calculate the total number of winners
    const totalWinners = Math.round(template.winnerPercentage * battleParticipants / 100);

    // Determine the reward distribution for each rank mentioned in the rankingPayout
    let totalRewardDistributed = 0;
    const rankingReward = template.rankingPayout.map((rankPayout) => {
      const reward = prizePool * rankPayout.rewardPercentage / 100;
      totalRewardDistributed += reward;
      return {
        rank: rankPayout.rank,
        reward: reward,
        rewardPercentage: rankPayout.rewardPercentage

      };
    });

    // Calculate the reward for the remaining winners
    const remainingWinners = totalWinners - rankingReward.length;
    const rewardForRemainingWinners = remainingWinners > 0 ? (prizePool - totalRewardDistributed) / remainingWinners : 0;

    return { reward: rankingReward, totalWinner: totalWinners, remainWinnerStart: rankingReward.length + 1, remainingReward: rewardForRemainingWinners };

  } catch (err) {
    console.log(err)
    return;
  }
};

router.get("/updaterankandpayout", async (req, res) => {

  console.log("in wallet")
  try {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    const battle = await Battle.find({ status: "Completed", payoutStatus: "Completed" });

    // console.log(battle.length, battle)
    for (let j = 0; j < battle.length; j++) {

      const userBattleWise = await BattleMock.aggregate([
        {
          $match: {
            status: "COMPLETE",
            // trade_time_utc: {
            //     $gte: today,
            // },
            battleId: new ObjectId(
              battle[j]._id
            ),
          },
        },
        {
          $group: {
            _id: {
              userId: "$trader",
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
          $project: {
            userId: "$_id.userId",
            _id: 0,
            npnl: {
              $subtract: ["$amount", "$brokerage"],
            },
          },
        },
        {
          $sort:
          {
            npnl: -1,
          },
        },
      ])

      const rewardData = await getPrizeDetails(battle[j]._id);

      console.log("rewardData", rewardData)

      for (let i = 0; i < userBattleWise.length; i++) {
        const preDefinedReward = rewardData.reward;
        const wallet = await userWallet.findOne({ userId: new ObjectId(userBattleWise[i].userId) });

        if (preDefinedReward[preDefinedReward.length - 1].rank >= i + 1) {
          for (const elem of preDefinedReward) {

            if (elem.rank === i + 1) {
              console.log("user in top", userBattleWise[i].userId, battle[j].battleName, elem.reward, elem.rank)
            }

          }
        } else {
          const remainingInitialRank = rewardData.remainWinnerStart;
          const finalRank = rewardData.totalWinner;
          const remainingReward = rewardData.remainingReward

          for (let k = remainingInitialRank; k <= finalRank; k++) {
            if (k === i + 1) {
              for (let subelem of battle[j]?.participants) {
                if (subelem.userId.toString() === userBattleWise[i].userId.toString()) {
                  subelem.reward = remainingReward?.toFixed(2);
                  subelem.rank = k;
                }
              }
              await battle[j].save();
            }
            if (i + 1 > finalRank) {
              for (let subelem of battle[j]?.participants) {
                console.log("updating feilds")
                if (subelem.userId.toString() === userBattleWise[i].userId.toString()) {
                  subelem.reward = 0;
                  subelem.rank = i+1;
                }
              }
  
              await battle[j].save();
            }
          }

         
        }

      }

      battle[j].payoutStatus = 'Completed'
      battle[j].status = "Completed";
      await battle[j].save();
    }

  } catch (error) {
    console.log(error);
  }
  // res.send(data);
});

router.get("/ltv", async (req, res) => {
  const data = await userWallet.aggregate([
    {
      $unwind: {
        path: "$transactions",
      },
    },
    {
      $match: {
        "transactions.transactionDate": {
          $gt: new Date("2023-08-31T18:29:59.001Z"),
          $lte: new Date(
            "2023-09-30T18:29:59.001Z"
          ),
        },
      },
    },
    {
      $group: {
        _id: {
          userId: "$userId",
        },
        amount: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: [
                      "$transactions.title",
                      "Bought TenX Trading Subscription",
                    ],
                  },
                  {
                    $eq: [
                      "$transactions.title",
                      "MarginX Fee",
                    ],
                  },
                  {
                    $eq: [
                      "$transactions.title",
                      "TestZone Fee",
                    ],
                  },
                  {
                    $eq: [
                      "$transactions.title",
                      "Battle Fee",
                    ],
                  },
                ],
              },
              {
                $multiply: [
                  "$transactions.amount",
                  -1,
                ],
              },
              0,
            ],
          },
        },
      },
    },
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        amount: {
          $gt: 0,
        },
      },
    },
    {
      $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: 0,
        userId: "$_id.userId",
        amount: 1,
      },
    },
  ])
  res.send(data);
});

router.get("/processBattles", async (req, res) => {
  const data = await processBattles(req, res)
  res.send(data);
});

router.get("/tenxfeild", async (req, res) => {

  const data = await TenXTrade.updateMany(
    {},
    [
      {
        $set: {
          trade_time_utc: {
            $subtract: [
              "$trade_time",
              {
                $multiply: [60 * 60 * 1000, 5.5] // 5.5 hours for IST to UTC conversion
              }
            ]
          }
        }
      }
    ]
  );


  res.send(data);
});

router.get("/tenxSubs", async (req, res) => {

  const subs = await TenxSubscription.find();

  for (elem of subs) {
    for (subelem of elem.users) {
      if (subelem.expiredBy === "System" && subelem.expiredOn > new Date("2023-08-31")) {
        console.log(subelem);
      }
    }
  }
  // res.send(updateResult);
});

router.get("/addFeildInTenx", async (req, res) => {
  const updateResult = await TenxSubscription.updateMany(
    {}, // An empty filter matches all documents in the collection
    {
      $set: {
        // allowPurchase: false,
        // allowRenewal: false
        status: "Inactive"
      }
    }
  ); res.send(updateResult);
});

router.get("/collegeData", async (req, res) => {
  // {
  //   from: "colleges",
  //   localField: "_id",
  //   foreignField: "_id",
  //   as: "college"
  // }
  const x = await InternBatch.aggregate([
    {
      $unwind: "$participants",
    },
    {
      $lookup: {
        from: "intern-trades",
        localField: "participants.user",
        foreignField: "trader",
        as: "tradeData",
      },
    },
    {
      $group: {
        _id: {
          college: "$participants.college",
          hasTradeData: { $cond: { if: { $gt: [{ $size: "$tradeData" }, 0] }, then: true, else: false } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.college",
        hasTradeDataCounts: {
          $push: {
            hasTradeData: "$_id.hasTradeData",
            count: "$count",
          },
        },
      },
    },
    {
      $lookup: {
        from: "colleges",
        localField: "_id",
        foreignField: "_id",
        as: "college",
      },
    },
    {
      $project: {
        _id: 0,
        college: "$_id",
        collegeName: {
          $arrayElemAt: ["$college.collegeName", 0],
        },
        activeUser: {
          $sum: {
            $map: {
              input: "$hasTradeDataCounts",
              as: "entry",
              in: {
                $cond: [{ $eq: ["$$entry.hasTradeData", true] }, "$$entry.count", 0],
              },
            },
          },
        },
        inactiveUser: {
          $sum: {
            $map: {
              input: "$hasTradeDataCounts",
              as: "entry",
              in: {
                $cond: [{ $eq: ["$$entry.hasTradeData", false] }, "$$entry.count", 0],
              },
            },
          },
        },
      },
    },
    {
      $sort: { college: -1 },
    },
    {
      $skip: 0,
    },
    {
      $limit: 2,
    },
  ]
  )

  res.send(x)

});

router.get("/retreive", async (req, res) => {

  const x = await RetreiveOrder.aggregate([
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        status: "COMPLETE",
        order_timestamp: {
          $gte: new Date("2023-08-25"),
        },
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          transaction_type: "$transaction_type",
          instrument_token: "$instrument_token",
        },
        amount: {
          $sum: {
            $multiply: [
              "$average_price",
              "$quantity",
            ],
          },
        },
        quantity: {
          $sum: "$quantity",
        },
      },
    },
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        "_id.transaction_type": "Buy",
      },
    },
  ])

  res.send(x)

});

router.get("/livecontest", async (req, res) => {

  const x = await DailyLiveContest.aggregate([
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        status: "COMPLETE",
        trade_time: {
          $gte: new Date("2023-08-25"),
        },
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          buyOrSell: "$buyOrSell",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
        },
        amount: {
          $sum: "$amount",
        },
        quantity: {
          $sum: "$Quantity",
        },
      },
    },
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        "_id.buyOrSell": "BUY",
      },
    },
  ])

  res.send(x)

});


//{contestId: null, symbol: "NIFTY23AUG18700PE", trade_time: {$gte: new Date("2023-08-28")}}



router.get("/tenxUpdate", async (req, res) => {

  const x = await TenxSubscription.find();

  for (let elem of x) {
    if (elem.plan_name === "Beginner") {
      //  || elem.plan_name==="Intermediate" || elem.plan_name==="Pro"){
      for (subelem of elem.users) {
        if (!subelem.fee) {
          subelem.fee = 49
        }
      }
      await elem.save();
    }
  }

  res.send(x);
});

router.get("/tenxData", async (req, res) => {

  const x = await TenxSubscription.aggregate(
    [
      {
        $match:
        {
          _id: new ObjectId("645cc77c2f0bba5a7a3ff427"),
        },
      },
      {
        $unwind: {
          path: "$users",
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
        $match: {
          "users.status": "Expired",
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
                  "$trade.trade_time",
                ],
              },
              {
                $gte: [
                  "$users.expiredOn",
                  "$trade.trade_time",
                ],
              },
            ],
          },
        },
      },
      {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {
            startDate: "$users.subscribedOn",
            endDate: "$users.expiredOn",
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
                date: "$trade.trade_time",
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
        $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          startDate: "$_id.startDate",
          enddate: "$_id.endDate",
          userId: "$_id.userId",
          _id: 0,
          npnl: {
            $subtract: ["$amount", "$brokerage"],
          },
          tradingDays: {
            $size: "$tradingDays",
          },
          trades: 1,
          payout: {
            $divide: [
              {
                $multiply: [
                  {
                    $subtract: [
                      "$amount",
                      "$brokerage",
                    ],
                  },
                  10,
                ],
              },
              100,
            ],
          },
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
        },
      },
    ]
  )

  res.send(x);
});

router.get("/insrtOldPayout", async (req, res) => {

  const data = await DailyContestMockUser.aggregate([
    {
      $match: {
        trade_time: {
          $lt: new Date("2023-07-10"),
        },
      },
    },
    {
      $lookup: {
        from: "daily-contests",
        localField: "contestId",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $group: {
        _id: {
          trader: "$trader",
          contestId: "$contestId",
          payper: "$result.payoutPercentage",
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
      $project: {
        user: "$_id.trader",
        _id: 0,
        contest: "$_id.contestId",
        payout: {
          $divide: [
            {
              $multiply: [
                {
                  $subtract: [
                    "$amount",
                    "$brokerage",
                  ],
                },
                "$_id.payper",
              ],
            },
            100,
          ],
        },
        per: "$_id.payper",
        amount: 1,
      },
    },
    {
      $match: {
        amount: {
          $gt: 0,
        },
      },
    },
  ])

  for (let elem of data) {
    let contest = await DailyContest.findOne({ _id: elem.contest });

    for (let subelem of contest.participants) {
      if (elem.user.toString() === subelem.userId.toString()) {
        subelem.payout = elem.payout;
        console.log(contest.contestName, elem.payout)
        let c = await contest.save();
        // console.log(c)
      }
    }
  }

});

router.get("/del", async (req, res) => {
  const compnay = await MarginDetailLiveCompany.deleteMany({ trader: new ObjectId("6454bd032a2c3b3e4c07e057") })
  const user = await MarginDetailLiveUser.deleteMany({ trader: new ObjectId("6454bd032a2c3b3e4c07e057") })
  res.send({ data: compnay.length, dat: user.length });
});

router.get("/uniqueusers", async (req, res) => {
  let pipeline = [
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        trade_time: {
          $gte: new Date("2023-07-20"),
        },
      },
    },
    {
      $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$user",
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          trader: "$trader",
          first_name: "$user.first_name",
          last_name: "$user.last_name",
        },
      },
    },
  ]
  const x = await DailyContestMockUser.aggregate(pipeline)
  res.send(x);
});


router.get("/margin", async (req, res) => {
  let pipeline = [
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        date: {
          $gte: new Date("2023-07-11"),
        },
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          trader: "$trader",
        },
        margin_utilize: {
          $sum: "$margin_utilize",
        },
        margin_released: {
          $sum: "$margin_released",
        },
      },
    },

  ]
  const x = await MarginDetailMockCompany.aggregate(pipeline)
  res.send(x);
});

router.get("/afterContest", async (req, res) => {
  console.log("running after contest")
  await autoCutMainManually();
  await autoCutMainManuallyMock();
  // await changeBattleStatus();
  res.send("ok");
});

router.get("/updateLotSize", async (req, res) => {
  const update = await TradableInstrumentSchema.updateMany({ lot_size: 15 }, { lot_size: 25 });
  res.send(update);
});


router.get("/updateGuid", async (req, res) => {
  const ordersToUpdate = await RetreiveOrder.find({
    order_timestamp: {
      $gte: new Date("2023-05-19"),
      $lt: new Date("2023-05-31"),
    },
    // status: "COMPLETE",
  });

  console.log("ordersToUpdate", ordersToUpdate)
  for (let elem of ordersToUpdate) {

    const update = await RetreiveOrder.updateOne({ guid: elem.guid }, { $set: { guid: elem.guid.slice(0, -6) + generateRandomString(6) } })
    console.log("update", update)
  }

  res.send(ordersToUpdate);
});

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.get("/getMismatch", async (req, res) => {
  const data = await InfinityLiveUser.aggregate([
    {
      $match: {
        trade_time: {
          $gte: new Date("2023-06-19"),
          $lt: new Date("2023-06-20"),
        },
        status: "COMPLETE",
        symbol: "NIFTY2362218850CE",
      },
    },
    {
      $lookup: {
        from: "live-trade-companies",
        localField: "order_id",
        foreignField: "order_id",
        as: "companyMatch",
      },
    },
    {
      $project:
      {
        order_id: 1,
        Quantity: 1,
        _id: 0,
        companyOrderId: {
          $arrayElemAt: [
            "$companyMatch.order_id",
            0,
          ],
        },
        companyQuantity: {
          $arrayElemAt: [
            "$companyMatch.Quantity",
            0,
          ],
        },
      },
    }
  ]);
  res.send(data)
})

router.get("/insertInRetreive", async (req, res) => {
  // await saveRetreiveData("NIFTY23AUG17800PE", 1730051, 10300, 1815175.00, 10800, "Sell", "2023-05-31", "31");
  await saveNewRetreiveData("NIFTY23AUG18600PE", 3.25, 1700, "Buy", "2023-08-25", "25")
  res.send("ok")
})

router.get("/data", async (req, res) => {
  const data = await RetreiveOrder.aggregate([
    {
      $match: {
        order_timestamp: {
          $gte: new Date("2023-05-31"),
          $lt: new Date("2023-06-01"),
        },
        status: "COMPLETE"
      },
    },
    {
      $lookup: {
        from: "tradable-instruments",
        localField: "instrument_token",
        foreignField: "exchange_token",
        as: "instrumentData",
      },
    },
    {
      $unwind: {
        path: "$instrumentData",
      },
    },
    {
      $project: {
        order_id: 1,
        average_price: 1,
        exchange: 1,
        exchange_order_id: 1,
        exchange_timestamp: 1,
        exchange_update_timestamp: 1,
        guid: 1,
        exchangeInstrumentToken:
          "$instrument_token",
        order_timestamp: 1,
        order_type: 1,
        placed_by: 1,
        price: 1,
        product: 1,
        quantity: 1,
        status: 1,
        transaction_type: 1,
        validity: 1,
        instrumentToken:
          "$instrumentData.instrument_token",
        symbol: "$instrumentData.tradingsymbol",
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          symbol: "$symbol",
          transaction_type: "$transaction_type",
        },
        amount: {
          $sum: {
            $multiply: [
              "$quantity",
              "$average_price",
            ],
          },
        },
        lot: {
          $sum:
            "$quantity"

        },
      },
    },
    {
      $project:
      {
        symbol: "$_id.symbol",
        _id: 0,
        type: "$_id.transaction_type",
        amount: "$amount",
        lot: "$lot"
      },
    },
  ])
  res.send(data)
})


router.get("/saveMissedData", async (req, res) => {
  await saveMissedData();
  // await saveDailyContestMissedData();

  res.send("ok")
})

router.get('/updateaffiliate', async(req,res)=>{
  const affiliates = await Affiliate.find();
  let users = [];
  for(let affiliate of affiliates){
    let affiliateUsers = affiliate.affiliates;
    for(let item of affiliateUsers){
      users.push(item?.userId);
    }   
  }
  for(let user of users){
    const userDoc = await UserDetail.findById(user);
    userDoc.isAffiliate = true;
    userDoc.affiliateStatus = 'Active';
    console.log("Active")
    userDoc.save({validateBeforeSave: false});
  }
});

router.get("/walletUpdate", async (req, res) => {
  await updateUserWallet();
  res.send("ok")
})


router.get("/subscribeTradable", async (req, res) => {
  await EarlySubscribedInstrument();
  await subscribeTokens();
  res.send("ok")
})

router.get("/updateFeild", async (req, res) => {
  const update1 = await InfinityTraderCompany.updateMany({}, { order_type: "MARKET" })
  const update2 = await InfinityTrader.updateMany({}, { order_type: "MARKET" })
  const update3 = await InfinityLiveCompany.updateMany({}, { order_type: "MARKET" })
  const update4 = await InfinityLiveUser.updateMany({}, { order_type: "MARKET" })
  console.log(update1, update2, update3, update4);
})

router.get("/deleteTrades", async (req, res) => {
  // const del = await InfinityTraderCompany.deleteMany({trade_time: {$gte: new Date("2023-07-06")}, createdBy: new ObjectId("63ecbc570302e7cf0153370c")})
  // const del2 = await InfinityTrader.deleteMany({trade_time: {$gte: new Date("2023-07-06")}, createdBy: new ObjectId("63ecbc570302e7cf0153370c")})

  const del3 = await Instrument.deleteMany({ contractDate: new Date("2023-07-27") })
  const del4 = await InfinityInstrument.deleteMany({ contractDate: new Date("2023-07-27") })

  // const del3 = await InfinityLiveCompany.find({trade_time: {$gte: new Date("2023-07-06")}, createdBy: new ObjectId("63ecbc570302e7cf0153370c")})
  // const del4 = await InfinityLiveUser.find({trade_time: {$gte: new Date("2023-07-06")}, createdBy: new ObjectId("63ecbc570302e7cf0153370c")})
  console.log(del3.length, del4.length);// 
})

router.get("/instrument", async (req, res) => {
  let instrumentDetail = await InfinityTraderCompany.aggregate([
    {
      $match: {
        trade_time: {
          $gte: new Date("2023-06-15")
        },
        status: "COMPLETE",
      },
    },
    {
      $group: {
        _id: {
          symbol: "$symbol",
          instrumentToken: "$instrumentToken",
          exchangeInstrumentToken: "$exchangeInstrumentToken",
        },

      },
    },

  ])
  res.send(instrumentDetail)
})

router.get("/updateFeild", async (req, res) => {
  const update1 = await InfinityTraderCompany.updateMany({}, { order_type: "MARKET" })
  const update2 = await InfinityTrader.updateMany({}, { order_type: "MARKET" })
  const update3 = await InfinityLiveCompany.updateMany({}, { order_type: "MARKET" })
  const update4 = await InfinityLiveUser.updateMany({}, { order_type: "MARKET" })
  console.log(update1, update2, update3, update4);
})

router.get("/deleteTrades", async (req, res) => {
  const del = await InfinityTraderCompany.deleteMany({ createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: { $gte: new Date("2023-06-20") } })
  const del2 = await InfinityTrader.deleteMany({ createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: { $gte: new Date("2023-06-20") } })
  const del3 = await InfinityLiveCompany.deleteMany({ createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: { $gte: new Date("2023-06-20") } })
  const del4 = await InfinityLiveUser.deleteMany({ createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: { $gte: new Date("2023-06-20") } })

  console.log(del.length, del2.length);
})

router.get("/removeduplicate", async (req, res) => {
  const result = await Permission.aggregate([
    { $group: { _id: { userId: '$userId' }, uniqueIds: { $addToSet: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ])

  const duplicates = result.map(doc => doc.uniqueIds.slice(1));

  if (duplicates.length === 0) {
    console.log('No duplicates found.');
    client.close();
    return;
  }

  const flattenedDuplicates = [].concat.apply([], duplicates);

  const d = await Permission.deleteMany({ _id: { $in: flattenedDuplicates } })
})


router.get("/ifServerCrashAfterOrder", async (req, res) => {
  const c = await InfinityTraderCompany.aggregate([
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        trade_time: {
          $gte: new Date(
            "2023-06-09"
          )
        },
        status: "COMPLETE",
      },
    },
    {
      $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          symbol: "$symbol",
        },
      },
    },
    {
      $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        symbol: "$_id.symbol",
      },
    },
  ])

  res.send(c)
})

router.get("/getTrade", async (req, res) => {
  let orders = await RetreiveOrder.find({ exchange_timestamp: { $gte: new Date("2023-06-05"), $lt: new Date("2023-06-06") }, instrument_token: 45572 })
  let liveCompany = await InfinityLiveCompany.find({ trade_time: { $gte: new Date("2023-06-05"), $lt: new Date("2023-06-06") }, instrumentToken: 45572 });

  let openTrade = orders.filter((elem1) => !liveCompany.some((elem2) => elem1.order_id === elem2.order_id));
  res.send(openTrade)
});

router.get("/duplicate", async (req, res) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  date.setDate(date.getDate() + 7);

  let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const duplicates = await TradableInstrumentSchema.aggregate([
    {
      $match: {
        status: "Active", expiry: {
          $gte: todayDate, // expiry is greater than or equal to today's date
          $lt: fromLessThen// $gt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) // expiry is greater than today's date
        }
      }
    },
    { $group: { _id: '$tradingsymbol', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  console.log(duplicates);
});

router.get("/usedMargin", async (req, res) => {
  await saveLiveUsedMargin();
  await saveMockUsedMargin();
  res.send("ok")
});

router.get("/setOpenPrice", async (req, res) => {
  await openPrice();
});


router.get("/deleteWatchlist", async (req, res) => {
  await UserDetail.updateMany({}, { $unset: { "watchlistInstruments": "" } })
});

router.get("/updateLot", async (req, res) => {

  let x = await InfinityInstrument.updateMany({}, {
    $set: {
      maxLot: 900
    }
  })
  console.log(x)
  res.send("ok")
});

router.get("/insertInfinityTrader", async (req, res) => {
  const users = await UserDetail.find({ designation: "Equity Trader" }).select('watchlistInstruments');

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].watchlistInstruments.length; j++) {
      console.log(users[i].watchlistInstruments[j])
      const instrument = await Instrument.findOne({ _id: users[i].watchlistInstruments[j], status: "Active" });

      console.log(instrument)

      // Create a new document in InfinityInstrument excluding the _id field
      if (instrument) {
        const instrumentData = { ...instrument.toObject() };
        delete instrumentData._id;
        await InfinityInstrument.create(instrumentData);
      }
    }
  }
  res.send("ok")
});

router.get("/updateInstrument", async (req, res) => {
  const collections = [Instrument];

  for (let i = 0; i < collections.length; i++) {
    const data = await collections[i].find({ status: "Active" });

    for (let j = 0; j < data.length; j++) {
      const exchangeToken = await TradableInstrumentSchema.findOne({ tradingsymbol: data[j].symbol });

      // Update the document with the exchangeToken field
      console.log(exchangeToken)
      await collections[i].findByIdAndUpdate(data[j]._id, { exchangeInstrumentToken: exchangeToken.exchange_token, exchangeSegment: 2 });
    }
  }
  res.send("ok")
});

// router.get("/updateExchabgeToken", async (req, res) => {
//   const collections = [InfinityTrader, InfinityTraderCompany, PaperTrade, TenXTrade, InternTrade ];

//   for (let i = 0; i < collections.length; i++) {
//     const data = await collections[i].find({ trade_time: { $gte: new Date("2023-05-30T00:00:00.000Z") } });

//     for (let j = 0; j < data.length; j++) {
//       const exchangeToken = await TradableInstrumentSchema.findOne({ tradingsymbol: data[j].symbol });

//       console.log(exchangeToken)
//       // Update the document with the exchangeToken field
//       await collections[i].findByIdAndUpdate(data[j]._id, { exchangeInstrumentToken: exchangeToken.exchange_token });
//     }
//   }

// });


router.get("/updateExchabgeToken", async (req, res) => {
  const collections = [InternTrade];

  for (let i = 0; i < collections.length; i++) {
    const data = await collections[i].find({ trader: new ObjectId('64b3a21cdf09ae2a607fdd66'), trade_time: { $gte: new Date("2023-07-31T07:54:52.975+00:00"), $lte: new Date("2023-07-31T09:54:52.975+00:00") } });

    for (let j = 0; j < data.length; j++) {
      // const exchangeToken = await TradableInstrumentSchema.findOne({ tradingsymbol: data[j].symbol });

      // console.log(exchangeToken)
      // Update the document with the exchangeToken field
      let x = await collections[i].findByIdAndUpdate(data[j]._id, { createdOn: data[j].trade_time, trade_time: data[j].createdOn, __v: 0 });

      console.log(x)
    }
  }

});



router.get("/infinityAutoLive", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);InfinityTrader
  const data = await infinityTradeLive()
  res.send(data);
});

router.get("/orderData", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);InfinityTrader
  const data = await InfinityTrader.find({ trader: new ObjectId("63b45f0f906e240bb6ed792a"), trade_time: { $gte: new Date("2023-05-10T00:00:00.000Z"), $lte: new Date("2023-05-10T23:59:00.000Z") } })
  res.send(data);
});

router.get("/deleteMatching", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);InfinityTrader
  const del = await InfinityTraderCompany.aggregate([
    {
      $match:
      {
        trade_time: {
          $gte: new Date("2023-05-26")
        },
        status: "COMPLETE",
      },
    },
    {
      $group:
      {
        _id: {
          id: "$_id",
          orderId: "$order_id",
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
      $project:
      {
        _id: "$_id.id",
        userId: "$_id.userId",
        subscriptionId: "$_id.orderId",
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

  ])

  // const result = await del.aggregate(pipeline).toArray();

  const deleteResult = await InfinityTraderCompany.deleteMany({ _id: { $in: del.map(doc => doc._id) } });
  console.log(deleteResult)
});

router.get("/autotrade", async (req, res) => {
  // let arr = await tenx();
  // let arr1 = await paperTrade();
  // let arr2 = await infinityTrade();
  // console.log(arr, arr1, arr2);
  await autoCutMainManually();
  await autoCutMainManuallyMock();
  res.send("ok")
});


router.get("/placeOrder", async (req, res) => {
  let obj = {
    exchange: 'NFO',
    instrumentToken: 46292,
    Product: 'NRML',
    order_type: 'MARKET',
    buyOrSell: 'BUY',
    validity: 'DAY',
    disclosedQuantity: 0,
    Quantity: 50,
    // limitPrice: 15000,
    // stopPrice: 0,
  }
  const placeorder = await placeOrder(obj);
  // console.log(xtsMarketDataAPI)
  res.send(placeorder)

});

router.get("/getData", async (req, res) => {
  const xtsMarketDataAPI = await getInstrument();
  // console.log(xtsMarketDataAPI)
  res.send(xtsMarketDataAPI)

});

// router.get("/tokenData", async (req, res) => {
//   // const xtsMarketDataAPI = await getInstrument();
//   // console.log(xtsMarketDataAPI)

//   res.send(await fetchToken("NSE", "NIFTY 50"))

// });


router.get("/deletePnlKey", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);
  await deletePnlKey()
});

router.get("/autoExpireTenXSubscription", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);
  // await overallPnlTrader(req, res)

  await autoExpireTenXSubscription(req, res)
  // await getMyPnlAndCreditData(req, res);
});

router.post("/autotrade/:id", async (req, res) => {
  const id = req.params.id
  await takeAutoTrade(req.body, id)
});

router.get("/copyCollection", async (req, res) => {
  const mock = await MockCompany.find();

  for (const doc of mock) {
    doc._id = new ObjectId();
    await InfinityTraderCompany.insertMany([doc]);
  }
});

router.get("/updateRole", async (req, res) => {
  let users = await UserDetail.find();
  console.log(users);
  for (let user of users) {
    console.log(user.role)
    if (user.role === "admin") {
      console.log("in if admin");
      await UserDetail.findOneAndUpdate(
        { _id: user._id },
        { $set: { role: new ObjectId("6448f834446977851c23b3f5") } },
        { new: true }
      ).exec();
    } else if (user.role === "user") {
      console.log("in if user");
      await UserDetail.findOneAndUpdate(
        { _id: user._id },
        { $set: { role: new ObjectId("644902f1236de3fd7cfd73a7") } },
        { new: true }
      ).exec();
    }
  }
});

// router.get("/updateInstrumentStatus", async (req, res)=>{
//   let instrument = await Instrument.updateMany(
//     { contractDate: { $lte: "20-04-2023" } },
//     { $set: { status: "Inactive" } }
//   )
// })

router.get("/updateInstrumentStatus", async (req, res) => {
  let date = new Date();
  let expiryDate = "2024-01-02T20:00:00.000+00:00"
  expiryDate = new Date(expiryDate);

  let instrument = await Instrument.updateMany(
    { contractDate: { $lte: expiryDate }, status: "Active" },
    { $set: { status: "Inactive" } }
  )

  // let infinityInstrument = await InfinityInstrument.updateMany(
  //   { contractDate: { $lte: expiryDate }, status: "Active" },
  //   { $set: { status: "Inactive" } }
  // )


  // const userIns = await UserDetail.find()
  //   .populate('watchlistInstruments', 'status')
  //   .select('watchlistInstruments allInstruments')
  // for (let elem of userIns) {
  //   if (elem.watchlistInstruments)
  //     elem.watchlistInstruments = elem.watchlistInstruments.filter(instrument => instrument.status !== 'Inactive');

  //     elem.allInstruments = elem.allInstruments ? elem.allInstruments.filter(instrument => instrument.status !== 'Inactive') : [];

  //     if(elem.watchlistInstruments.length > 0)
  //   console.log(elem.watchlistInstruments, elem.allInstruments)
  //   // for(let subelem of elem.watchlistInstruments){
  //   //   if(subelem.status === "Active"){

  //   //   }
  //   // }
  //   await elem.save((err, updatedUser) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }

  //     // console.log('User watchlist updated:', updatedUser);
  //   });
  // }

  await UserDetail.updateMany({}, { $unset: { watchlistInstruments: "", allInstruments: "" } });

  res.send({ message: "updated", data: instrument })
})

router.get("/updatePortfolio", async (req, res) => {
  let users = await UserDetail.find();

  for (let user of users) {
    const activeFreePortfolios = await PortFolio.find({ status: "Active", portfolioAccount: "Free" });

    let portfolioArr = [];
    for (const portfolio of activeFreePortfolios) {
      let obj = {};
      obj.portfolioId = portfolio._id;
      obj.paidDate = new Date();
      portfolioArr.push(obj);
    }

    const idOfUser = user._id; // Replace with the actual user ID

    await UserDetail.findByIdAndUpdate(
      idOfUser,
      { $set: { portfolio: portfolioArr } }
    );

    for (const portfolio of activeFreePortfolios) {
      const portfolioValue = portfolio.portfolioValue;

      await PortFolio.findByIdAndUpdate(
        portfolio._id,
        { $push: { users: { userId: idOfUser, portfolioValue: portfolioValue } } }
      );
    }

  }

})

router.get("/pnldetails", async (req, res) => {
  let pnlDetails = await ContestTrade.aggregate([
    {
      $match: {
        // trade_time: {
        //   $regex: today,
        // },
        status: "COMPLETE",
        trader: new ObjectId("64340f477818ebba306d49ad"),
        contestId: new ObjectId("643fa4d8063b227a7685ff00"),
        // portfolioId: new ObjectId(portfolioId)
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
  ]);

  res.send(pnlDetails)

})

router.get("/removefeild", async (req, res) => {
  await UserDetail.updateMany({}, { $unset: { watchlistInstruments: "" } });
})
async function generateUniqueReferralCode() {
  const length = 8; // change this to modify the length of the referral code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let myReferralCode = '';
  let codeExists = true;

  // Keep generating new codes until a unique one is found
  while (codeExists) {
    for (let i = 0; i < length; i++) {
      myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if the generated code already exists in the database
    const existingCode = await UserDetail.findOne({ myReferralCode: myReferralCode });
    if (!existingCode) {
      codeExists = false;
    }
  }

  return myReferralCode;
}

router.get("/referralCode", async (req, res) => {
  const users = await UserDetail.find();

  // for (let i = 0; i < users.length; i++) {
  //   if (!users[i].myReferralCode) {
  //     const code = await generateUniqueReferralCode();
  //     const result = await UserDetail.updateOne(
  //       { _id: users[i]._id },
  //       { $set: { myReferralCode: code } },
  //       { upsert: true }
  //     );
  //     console.log(result);
  //   }
  // }

  for (let i = 0; i < users.length; i++) {
    if (!users[i].isAlgoTrader) {
      // const code = await generateUniqueReferralCode();
      const result = await UserDetail.updateOne(
        { _id: users[i]._id },
        { $set: { isAlgoTrader: true } },
        { upsert: true }
      );
      console.log(result);
    }
  }

  res.send('Referral codes generated and inserted');
});

// router.get("/tradableInstrument", authentication, async (req, res, next)=>{
//   // await TradableInstrumentSchema.updateMany({expiry: {$lte: "2023-05-04"}}, {$set: {status: "Inactive"}});
//   await tradableInstrument(req,res,next);
// })

router.get("/Tradable", authentication, async (req, res, next) => {
  await TradableInstrument.tradableInstrument(req, res, next);
  // await TradableInstrument.tradableNSEInstrument(req, res, next);

})
// router.get("/updateInstrumentStatus", async (req, res) => {
//   let date = new Date();
//   let expiryDate = "2023-10-28T00:00:00.000+00:00"
//   expiryDate = new Date(expiryDate);

//   // let instrument = await Instrument.find({status: "Active"})
//   // res.send(instrument)
//   let instrument = await Instrument.updateMany(
//     { contractDate: { $lte: expiryDate }, status: "Active" },
//     { $set: { status: "Inactive" } }
//   )

//   let infinityInstrument = await InfinityInstrument.updateMany(
//     { contractDate: { $lte: expiryDate }, status: "Active" },
//     { $set: { status: "Inactive" } }
//   )

//   // await UserDetail.updateMany({}, { $unset: { watchlistInstruments: "" } });
//   res.send({ message: "updated", data: instrument, data1: infinityInstrument })
// })
router.get("/updateName", async (req, res) => {
  let data = await UserDetail.updateMany(
    {},
    [
      {
        $set: {
          first_name: { $arrayElemAt: [{ $split: ["$name", " "] }, 0] },
          last_name: { $arrayElemAt: [{ $split: ["$name", " "] }, 1] }
        }
      }
    ]
  )
  console.log(data)
})

router.get("/dailyPnl", async (req, res) => {
  let matchingDate = "2023-03-31"
  // const dailyPnl = await DailyPNLData.find({timestamp: {$regex:matchingDate}})
  // const traderDailyPnl = await TraderDailyPnlData.find({timestamp: {$regex:matchingDate}})

  // if(dailyPnl.length === 0){
  await dailyPnlDataController.dailyPnlCalculation(matchingDate);
  // }

  // if(traderDailyPnl.length === 0){
  await traderwiseDailyPnlController.traderDailyPnlCalculation(matchingDate);
  // }

})


router.get("/cronjob", async (req, res) => {
  // for(let i = 0; i < 4; i++){
  //   let date = `2023-07-1${i}`
  await cronjob();
  // }

})

router.get("/mail", async (req, res) => {
  await mail();
})

router.get("/dbbackup", async (req, res) => {
  const sourceUri = process.env.STAGINGDB
  const targetUri = process.env.DEVDATABASE

  await dbBackup.backupDatabase(sourceUri, targetUri, res);

})

// router.get("/dbCopyAndDelete", async (req, res)=>{

//   // const sourceUri = 

//   // const sourceUri = 
//   const targetUri = 
//   await newdbBackup.deleteDb(targetUri);
//   // await newdbBackup.copy(sourceUri, targetUri);

// })

router.get("/missedOrderId", async (req, res) => {

  // console.log("in missed order id")
  const missedOrderId = await RetreiveOrder.aggregate([
    {
      $match: {
        order_timestamp: { $gte: new Date("2023-06-19"), $lt: new Date("2023-06-20") },
        // quantity: realQuantity,
        // tradingsymbol: realSymbol,
        status: "COMPLETE",
        orderUniqueIdentifier: { $ne: "" }
        // tradingsymbol: "NIFTY2321618200PE"
        // $or: [
        //     {tradingsymbol: "NIFTY2321618200PE"},
        //     {tradingsymbol: "NIFTY2321617950CE"}
        // ]

      }
    },
    {
      $lookup: {
        from: "live-trade-companies",
        localField: "order_id",
        foreignField: "order_id",
        as: "completed_trade"
      }
    },
    {
      $match: {
        completed_trade: {
          $size: 0
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        order_id: { $first: "$order_id" },
        status: { $first: "$status" },
        average_price: { $first: "$average_price" },
        quantity: { $first: "$quantity" },
        product: { $first: "$product" },
        transaction_type: { $first: "$transaction_type" },
        exchange_order_id: { $first: "$exchange_order_id" },
        order_timestamp: { $first: "$order_timestamp" },
        variety: { $first: "$variety" },
        validity: { $first: "$validity" },
        exchange: { $first: "$exchange" },
        orderUniqueIdentifier: {
          $first: "$orderUniqueIdentifier",
        },

      }
    }
  ]);

  //   const count = uniqueDocumentsCount[0].count;
  res.send(missedOrderId)
  console.log(missedOrderId)
})

router.get("/insertDocument", async (req, res) => {
  // 2023-02-13 12:04:35

  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY" });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL" });


  const getTrade = await RetreiveTrade.find(
    { order_timestamp: { $lt: "2023-02-13 12:04:21" } }
  ).sort({ order_timestamp: -1 })

  for (let i = 0; i < getTrade.length; i++) {
    let { order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
      order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity,
      pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,
      status_message, status_message_raw } = getTrade[i];

    if (transaction_type === "SELL") {
      quantity = -quantity;
    }
    if (!status_message) {
      status_message = "null"
    }
    if (!status_message_raw) {
      status_message_raw = "null"
    }
    if (!exchange_timestamp) {
      exchange_timestamp = "null"
    }
    if (!exchange_order_id) {
      exchange_order_id = "null"
    }

    let instrumentToken;
    if (tradingsymbol === "NIFTY2321618000PE") {
      instrumentToken = "11290626";
    } else if (tradingsymbol === "NIFTY2321617750CE") {
      instrumentToken = "11286786"
    }

    let trade_time = order_timestamp
    let timestamp = order_timestamp.split(" ");
    let timestampArr = timestamp[0].split("-");
    let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`

    function buyBrokerage(totalAmount) {
      let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
      // let totalAmount = Number(Details.last_price) * Number(quantity);
      let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
      // console.log("exchangeCharge", exchangeCharge, totalAmount, (Number(brokerageDetailBuy[0].exchangeCharge)));
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
      // console.log("stampDuty", stampDuty);
      let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount) {
      let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
      // let totalAmount = Number(Details.last_price) * Number(quantity);
      let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageCompany;
    let brokerageUser;

    if (transaction_type === "BUY") {
      brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price);
    } else {
      brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price);
    }


    if (tradingsymbol === "NIFTY2321618000PE" || tradingsymbol === "NIFTY2321617750CE") {

      LiveCompany.findOne({ order_id: order_id })
        .then((dataExist) => {
          if (dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1) {
            // console.log("data already in real company");
            return res.status(422).json({ error: "data already exist..." })
          }
          const tempDate = new Date();
          let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
          function addMinutes(date, hours) {
            date.setMinutes(date.getMinutes() + hours);
            return date;
          }
          const date = new Date(temp_order_save_time);
          const newDate = addMinutes(date, 330);
          const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);

          const companyTradeData = new LiveCompany({
            disclosed_quantity, price, filled_quantity, pending_quantity, cancelled_quantity, market_protection, guid,
            status, uId: Date.now(), createdBy: "Error", average_price, Quantity: quantity,
            Product: product, buyOrSell: transaction_type, order_timestamp: new_order_timestamp,
            variety, validity, exchange, order_type: order_type, symbol: tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
            algoBox: {
              algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE",
              lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true
            }, order_id, instrumentToken: instrumentToken,
            brokerage: brokerageCompany,
            tradeBy: "Error", isRealTrade: true, amount: (Number(quantity) * average_price), trade_time: trade_time,
            order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false


          });
          // console.log("this is REAL CompanyTradeData", companyTradeData);
          companyTradeData.save().then(() => {
            console.log("saving data in live", i)
          }).catch((err) => res.status(500).json({ error: "Failed to Trade company side" }));
        }).catch(err => { console.log(err, "fail company live data saving") });


      MockCompany.findOne({ order_id: order_id })
        .then((dataExist) => {
          if (dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1) {
            // console.log("data already in mock company");
            return res.status(422).json({ error: "date already exist..." })
          }
          const tempDate = new Date();
          let temp_order_save_time = `${String(tempDate.getDate()).padStart(2, '0')}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${(tempDate.getFullYear())} ${String(tempDate.getHours()).padStart(2, '0')}:${String(tempDate.getMinutes()).padStart(2, '0')}:${String(tempDate.getSeconds()).padStart(2, '0')}:${String(tempDate.getMilliseconds()).padStart(2, '0')}`
          function addMinutes(date, hours) {
            date.setMinutes(date.getMinutes() + hours);
            return date;
          }
          const date = new Date(temp_order_save_time);
          const newDate = addMinutes(date, 330);
          const order_save_time = (`${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}:${String(newDate.getMilliseconds()).padStart(2, '0')}`);

          const mockTradeDetails = new MockCompany({

            status, uId: Date.now(), createdBy: "Error", average_price, Quantity: quantity,
            Product: product, buyOrSell: transaction_type, order_timestamp: new_order_timestamp,
            variety, validity, exchange, order_type: order_type, symbol: tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
            algoBox: {
              algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE",
              lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true
            }, order_id, instrumentToken: instrumentToken,
            brokerage: brokerageCompany,
            tradeBy: "Error", isRealTrade: false, amount: (Number(quantity) * average_price), trade_time: trade_time,
            order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false

          });

          // console.log("mockTradeDetails comapny", mockTradeDetails);
          mockTradeDetails.save().then(() => {
            console.log("saving data in live", i)
            // res.status(201).json({massage : "data enter succesfully"});
          }).catch((err) => res.status(500).json({ error: "Failed to enter data" }));
        }).catch(err => { console.log(err, "fail company mock in placeorder") });
    }
  }

  console.log(getTrade.length)
  res.send(getTrade)

})






module.exports = router;

/*
requirment: 
1. testzone is only visible to registered user, if thats visibility is false
2. admin side affiliates leaderboard
3. remove revenue sharing on sel purchase

Steps:
1. add visibility feild in testzone
2. show testxone according visibility.
2. regiteration page with clear routing
3. in admin dashboard show full leaderboard of affiliates
*/

/*
requirment: 
1. tenx running lots > 0 = previous day else total pnl
2. today pnl is in unrealised pnl
3. give some insights, max profit, max loss, avg profit, avg loss, roi, ..etc. 




1. 500 open positon Nifty 19000PE
    400 stop loss ---> pending order api

  500-400 = 100 sl quanity
  500-0 = 500 sp quantity


  
2. 5000 open positon Nifty 19000PE
    400 stop loss

    max lot = 1800
    slQ > maxLot ? maxLot : slQ
  5000-400 = 4600 sl quanity 
  5000-0 = 5000 sp quantity




Steps:
*/


