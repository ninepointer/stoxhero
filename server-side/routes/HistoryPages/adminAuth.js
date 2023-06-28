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
const {takeAutoTrade} = require("../../controllers/contestTradeController");
const {deletePnlKey} = require("../../controllers/deletePnlKey");
// const {client, getValue} = require("../../marketData/redisClient")
// const {overallPnlTrader} = require("../../controllers/infinityController");
const {marginDetail, tradingDays, autoExpireSubscription} = require("../../controllers/tenXTradeController")
const {getMyPnlAndCreditData} = require("../../controllers/infinityController");
// const {tenx, paperTrade, infinityTrade} = require("../../controllers/AutoTradeCut/autoTradeCut");
const {infinityTradeLive} = require("../../controllers/AutoTradeCut/collectingTradeManually")
const {autoCutMainManually, autoCutMainManuallyMock} = require("../../controllers/AutoTradeCut/mainManually");
const TenXTrade = require("../../models/mock-trade/tenXTraderSchema")
const InternTrade = require("../../models/mock-trade/internshipTrade")
const InfinityInstrument = require("../../models/Instruments/infinityInstrument");
const {getInstrument, tradableInstrument} = require("../../services/xts/xtsMarket");
const {ifServerCrashAfterOrder} = require("../../services/xts/xtsInteractive");
// const XTSTradableInstrument = require("../../controllers/TradableInstrument/tradableXTS")
const {placeOrder} = require("../../services/xts/xtsInteractive");
// const fetchToken = require("../../marketData/generateSingleToken");
// const fetchXTSData = require("../../services/xts/xtsHelper/fetchXTSToken");
// const {autoCutMainManually} = require("../../controllers/AutoTradeCut/mainManually")
const {saveLiveUsedMargin} = require("../../controllers/marginRequired");
const InfinityLiveCompany = require("../../models/TradeDetails/liveTradeSchema");
const InfinityLiveUser = require("../../models/TradeDetails/infinityLiveUser");
const {openPrice} = require("../../marketData/setOpenPriceFlag");
const Permission = require("../../models/User/permissionSchema");
const {EarlySubscribedInstrument} = require("../../marketData/earlySubscribeInstrument")
const {subscribeTokens} = require("../../marketData/kiteTicker");
const {updateUserWallet} = require("../../controllers/internshipTradeController")
const {saveMissedData, saveRetreiveData} = require("../../utils/insertData");


    

router.get("/insertInRetreive", async (req, res) => {
  await saveRetreiveData("BANKNIFTY2360144300PE", 1110762, 2700, 1470023, 3600, "Sell");
  res.send("ok")
})


router.get("/data", async (req, res) => {
  const data = await RetreiveOrder.aggregate([
    {
      $match: {
        order_timestamp: {
          $gte: new Date("2023-05-26"),
          $lt: new Date("2023-06-01"),
        },
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
  res.send("ok")
})

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
  const update1 = await InfinityTraderCompany.updateMany({}, {order_type: "MARKET"})
  const update2 = await InfinityTrader.updateMany({}, {order_type: "MARKET"})
  const update3 = await InfinityLiveCompany.updateMany({}, {order_type: "MARKET"})
  const update4 = await InfinityLiveUser.updateMany({}, {order_type: "MARKET"})
  console.log(update1, update2, update3, update4);
})

router.get("/deleteTrades", async (req, res) => {
  const del = await InfinityTraderCompany.deleteMany({trade_time: {$gte: new Date("2023-06-19"),
  $lt: new Date("2023-06-20"),}})
  const del2 = await InfinityTrader.deleteMany({trade_time: {$gte: new Date("2023-06-19"),
  $lt: new Date("2023-06-20"),}})

  const del3 = await InfinityLiveCompany.deleteMany({trade_time: {$gte: new Date("2023-06-19"),
  $lt: new Date("2023-06-20"),}})
  const del4 = await InfinityLiveUser.deleteMany({trade_time: {$gte: new Date("2023-06-19"),
  $lt: new Date("2023-06-20"),}})
  console.log(del.length, del2.length);
})

router.get("/instrument", async (req, res) => {
  let instrumentDetail = await InfinityTraderCompany.aggregate([
    {
      $match: {
              trade_time:{
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
  const update1 = await InfinityTraderCompany.updateMany({}, {order_type: "MARKET"})
  const update2 = await InfinityTrader.updateMany({}, {order_type: "MARKET"})
  const update3 = await InfinityLiveCompany.updateMany({}, {order_type: "MARKET"})
  const update4 = await InfinityLiveUser.updateMany({}, {order_type: "MARKET"})
  console.log(update1, update2, update3, update4);
})

router.get("/deleteTrades", async (req, res) => {
  const del = await InfinityTraderCompany.deleteMany({createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: {$gte: new Date("2023-06-20")}})
  const del2 = await InfinityTrader.deleteMany({createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: {$gte: new Date("2023-06-20")}})
  const del3 = await InfinityLiveCompany.deleteMany({createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: {$gte: new Date("2023-06-20")}})
  const del4 = await InfinityLiveUser.deleteMany({createdBy: new ObjectId('63ecbc570302e7cf0153370c'), trade_time: {$gte: new Date("2023-06-20")}})

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
  let orders = await RetreiveOrder.find({exchange_timestamp: {$gte: new Date("2023-06-05"), $lt: new Date("2023-06-06") }, instrument_token: 45572})
  let liveCompany = await InfinityLiveCompany.find({trade_time: {$gte: new Date("2023-06-05"), $lt: new Date("2023-06-06") }, instrumentToken: 45572});

  let openTrade = orders.filter((elem1) => !liveCompany.some((elem2) => elem1.order_id === elem2.order_id));
  res.send(openTrade)
});

router.get("/duplicate", async (req, res) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  date.setDate(date.getDate() + 7);

  let fromLessThen = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const duplicates = await TradableInstrumentSchema.aggregate([
    {$match: {status: "Active", expiry: {
      $gte: todayDate, // expiry is greater than or equal to today's date
      $lt: fromLessThen// $gt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) // expiry is greater than today's date
    }}},
    { $group: { _id: '$tradingsymbol', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  
  console.log(duplicates);
});

router.get("/usedMargin", async (req, res) => {
  await saveLiveUsedMargin();
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
  const collections = [Instrument ];

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

router.get("/updateExchabgeToken", async (req, res) => {
  const collections = [InfinityTrader, InfinityTraderCompany, PaperTrade, TenXTrade, InternTrade ];

  for (let i = 0; i < collections.length; i++) {
    const data = await collections[i].find({ trade_time: { $gte: new Date("2023-05-30T00:00:00.000Z") } });
  
    for (let j = 0; j < data.length; j++) {
      const exchangeToken = await TradableInstrumentSchema.findOne({ tradingsymbol: data[j].symbol });
  
      console.log(exchangeToken)
      // Update the document with the exchangeToken field
      await collections[i].findByIdAndUpdate(data[j]._id, { exchangeInstrumentToken: exchangeToken.exchange_token });
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
  const data = await InfinityTrader.find({trader: new ObjectId("63b45f0f906e240bb6ed792a"), trade_time: {$gte: new Date("2023-05-10T00:00:00.000Z"), $lte: new Date("2023-05-10T23:59:00.000Z")}})
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
    OrderType: 'MARKET',
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

router.get("/pnl", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);
  // await overallPnlTrader(req, res)

  await autoExpireSubscription(req, res)
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

router.get("/updateInstrumentStatus", async (req, res)=>{
  let date = new Date();
  let expiryDate = "2023-06-23T00:00:00.000+00:00"
  expiryDate = new Date(expiryDate);

  // let instrument = await Instrument.find({status: "Active"})
  // res.send(instrument)
  let instrument = await Instrument.updateMany(
    {contractDate: {$lte: expiryDate}, status: "Active"},
    { $set: { status: "Inactive" } }
  )

  let infinityInstrument = await InfinityInstrument.updateMany(
    {contractDate: {$lte: expiryDate}, status: "Active"},
    { $set: { status: "Inactive" } }
  )
  res.send({message: "updated", data: instrument})
})

router.get("/updatePortfolio", async (req, res)=>{
  let users = await UserDetail.find();

  for(let user of users){
    const activeFreePortfolios = await PortFolio.find({status: "Active", portfolioAccount: "Free"});

    let portfolioArr = [];
    for (const portfolio of activeFreePortfolios) {
        let obj = {};
        obj.portfolioId = portfolio._id;
        obj.activationDate = new Date();
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

router.get("/pnldetails", async (req, res)=>{
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
          $sum: {$multiply : ["$amount",-1]},
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

router.get("/removefeild", async (req, res)=>{
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

router.get("/Tradable", authentication, async (req, res, next)=>{
  // await TradableInstrumentSchema.updateMany({expiry: {$lte: "2023-05-04"}}, {$set: {status: "Inactive"}});
  // await TradableInstrument.tradableInstrument(req,res,next);
  // await tradableInstrument(req, res);
  // await TradableInstrumentSchema.updateMany({expiry: {$lte: "2023-05-18"}}, {$set: {status: "Inactive"}});
  await TradableInstrument.tradableInstrument(req,res,next);
})

router.get("/updateName", async (req, res)=>{
  let data = await UserDetail.updateMany(
    {},
    [
      {
        $set: {
          first_name: { $arrayElemAt: [ { $split: [ "$name", " " ] }, 0 ] },
          last_name: { $arrayElemAt: [ { $split: [ "$name", " " ] }, 1 ] }
        }
      }
    ]
 )
 console.log(data)
})

router.get("/dailyPnl", async (req, res)=>{
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


router.get("/cronjob", async (req, res)=>{
  await cronjob();
})

router.get("/dbbackup", async (req, res)=>{
  // const sourceUri = "mongodb+srv://team:stoxherodev@stoxhero0.duntdzc.mongodb.net/?retryWrites=true&w=majority"
  // const targetUri = "mongodb+srv://staging-database:staging1234@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority"


  // const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
  // const sourceUri = "mongodb+srv://team:stoxherodev@stoxhero0.duntdzc.mongodb.net/?retryWrites=true&w=majority"
  // const targetUri = "mongodb+srv://staging-database:staging1234@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority";

  // const targetUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"

  // const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
  const sourceUri = "mongodb+srv://staging-database:staging1234@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority"
  const targetUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority";

  await dbBackup.backupDatabase(sourceUri, targetUri, res);

})

// router.get("/dbCopyAndDelete", async (req, res)=>{

//   // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"

//   // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
//   const targetUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

//   await newdbBackup.deleteDb(targetUri);
//   // await newdbBackup.copy(sourceUri, targetUri);

// })

router.get("/missedOrderId", async (req, res)=>{

    // console.log("in missed order id")
    const missedOrderId = await RetreiveOrder.aggregate([
        {
          $match: {
            order_timestamp: { $gte: new Date("2023-06-19"), $lt: new Date("2023-06-20") },
            // quantity: realQuantity,
            // tradingsymbol: realSymbol,
            status: "COMPLETE",
            orderUniqueIdentifier: {$ne: ""}
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
            order_id: {$first: "$order_id"},
            status: {$first: "$status"},    
            average_price: {$first: "$average_price"},
            quantity: {$first: "$quantity"} ,
            product: {$first: "$product"},
            transaction_type: {$first: "$transaction_type"},
            exchange_order_id: {$first: "$exchange_order_id"},
            order_timestamp: {$first: "$order_timestamp"},
            variety: {$first: "$variety"},
            validity: {$first: "$validity"},
            exchange: {$first: "$exchange"},
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

router.get("/insertDocument", async (req, res)=>{
// 2023-02-13 12:04:35

const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


const getTrade = await RetreiveTrade.find(
    {order_timestamp: {$lt: "2023-02-13 12:04:21"}}
 ).sort({order_timestamp: -1})

for(let i = 0; i < getTrade.length; i++){
  let {order_id, status, average_price, quantity, product, transaction_type, exchange_order_id,
    order_timestamp, variety, validity, exchange, exchange_timestamp, order_type, price, filled_quantity, 
    pending_quantity, cancelled_quantity, guid, market_protection, disclosed_quantity, tradingsymbol, placed_by,     
    status_message, status_message_raw} = getTrade[i];

    if(transaction_type === "SELL"){
      quantity = -quantity;
    }
    if(!status_message){
      status_message = "null"
    }
    if(!status_message_raw){
        status_message_raw = "null"
    }
    if(!exchange_timestamp){
        exchange_timestamp = "null"
    }
    if(!exchange_order_id){
        exchange_order_id = "null"
    }

    let instrumentToken;
    if(tradingsymbol === "NIFTY2321618000PE"){
      instrumentToken = "11290626";
    } else if(tradingsymbol === "NIFTY2321617750CE"){
      instrumentToken = "11286786"
    }

  let trade_time = order_timestamp
  let timestamp = order_timestamp.split(" ");
  let timestampArr = timestamp[0].split("-");
  let new_order_timestamp = `${timestampArr[2]}-${timestampArr[1]}-${timestampArr[0]} ${timestamp[1]}`

  function buyBrokerage(totalAmount){
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

  function sellBrokerage(totalAmount){
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

  if(transaction_type === "BUY"){
      brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price);
  } else{
      brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price);
  }


  if(tradingsymbol === "NIFTY2321618000PE" || tradingsymbol === "NIFTY2321617750CE"){

    LiveCompany.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1){
            // console.log("data already in real company");
            return res.status(422).json({error : "data already exist..."})
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
            Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
            variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
            algoBox:{algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE", 
            lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken: instrumentToken, 
            brokerage: brokerageCompany,
            tradeBy: "Error", isRealTrade: true, amount: (Number(quantity)*average_price), trade_time:trade_time,
            order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false


        });
        // console.log("this is REAL CompanyTradeData", companyTradeData);
        companyTradeData.save().then(()=>{
          console.log("saving data in live", i)
        }).catch((err)=> res.status(500).json({error:"Failed to Trade company side"}));
    }).catch(err => {console.log( err,"fail company live data saving")});


    MockCompany.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist && dataExist.order_timestamp !== new_order_timestamp && checkingMultipleAlgoFlag === 1){
            // console.log("data already in mock company");
            return res.status(422).json({error : "date already exist..."})
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
          Product:product, buyOrSell:transaction_type, order_timestamp: new_order_timestamp,
          variety, validity, exchange, order_type: order_type, symbol:tradingsymbol, placed_by: placed_by, userId: "error@ninepointer.in",
          algoBox:{algoName: "Transaction Algo", transactionChange: "TRUE", instrumentChange: "FALSE", exchangeChange: "FALSE", 
          lotMultipler: "1", productChange: "FALSE", tradingAccount: "NR0563", _id: "63987fca223c3fc074684edd", marginDeduction: false, isDefault: true}, order_id, instrumentToken: instrumentToken, 
          brokerage: brokerageCompany,
          tradeBy: "Error", isRealTrade: false, amount: (Number(quantity)*average_price), trade_time:trade_time,
          order_save_time: order_save_time, exchange_order_id, exchange_timestamp, isMissed: false

        });

        // console.log("mockTradeDetails comapny", mockTradeDetails);
        mockTradeDetails.save().then(()=>{
          console.log("saving data in live", i)
            // res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail company mock in placeorder")});
  }
}

console.log(getTrade.length)
res.send(getTrade)

})

module.exports = router;


// todo--> login auto, db entry ui, cronejob of 13, 14 with delete entry