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
const {client, isRedisConnected} = require("../../marketData/redisClient")
const {overallPnlTrader} = require("../../controllers/infinityController");
const {marginDetail, tradingDays, autoExpireSubscription} = require("../../controllers/tenXTradeController")
const {getMyPnlAndCreditData} = require("../../controllers/infinityController");

router.get("/deletePnlKey", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);
  await deletePnlKey()
});

router.get("/pnl", async (req, res) => {
  // await client.del(`kiteCredToday:${process.env.PROD}`);
  // await overallPnlTrader(req, res)

  // await autoExpireSubscription(req, res)
  await getMyPnlAndCreditData(req, res);
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
  let expiryDate = "2023-05-05T00:00:00.000+00:00"
  expiryDate = new Date(expiryDate);

  // let instrument = await Instrument.find({status: "Active"})
  // res.send(instrument)
  let instrument = await Instrument.updateMany(
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

router.get("/tradableInstrument", authentication, async (req, res, next)=>{
  await TradableInstrumentSchema.updateMany({expiry: {$lte: "2023-05-04"}}, {$set: {status: "Inactive"}});
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
  const sourceUri = "mongodb+srv://team:stoxherodev@stoxhero0.duntdzc.mongodb.net/?retryWrites=true&w=majority"
  const targetUri = "mongodb+srv://staging-database:staging1234@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority";

  // const targetUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"

  // const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority"
  // const sourceUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority"
  // const targetUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";

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
            order_timestamp: { $regex: "2023-02-16" },
            // quantity: realQuantity,
            // tradingsymbol: realSymbol,
            status: "COMPLETE",
            tradingsymbol: "NIFTY2321618200PE"
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
            exchange_timestamp: {$first: "$exchange_timestamp"},
            order_type: {$first: "$order_type"},
            price: {$first: "$price"},
            filled_quantity: {$first: "$filled_quantity"},
            pending_quantity: {$first: "$pending_quantity"},
            cancelled_quantity: {$first: "$cancelled_quantity"},
            guid: {$first: "$guid"},
            market_protection: {$first: "$market_protection"},
            disclosed_quantity: {$first: "$disclosed_quantity"},
            tradingsymbol: {$first: "$tradingsymbol"},
            placed_by: {$first: "$placed_by"},
            status_message: {$first: "$status_message"},
            status_message_raw: {$first: "$status_message_raw"},

          }
        }
      ]);
      
    //   const count = uniqueDocumentsCount[0].count;

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