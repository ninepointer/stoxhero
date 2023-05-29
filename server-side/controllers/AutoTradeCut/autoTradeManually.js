// const Subscription = require("../../models/TenXSubscription/TenXSubscriptionSchema");
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const User = require("../../models/User/userDetailSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../../marketData/sigleLivePrice');
const { client, getValue } = require('../../marketData/redisClient');
const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const PaperTrade = require("../../models/mock-trade/paperTrade");
const InternshipTrade = require("../../models/mock-trade/internshipTrade");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany")
const mongoose = require('mongoose');
const io = require('../../marketData/socketio');


const takeAutoTenxTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.999Z";
  const today = new Date(todayDate);
  const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

  let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId,
    validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
    realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
    dontSendResp } = tradeDetails;

  console.log("tradeDetails", tradeDetails)
  let createdBy;
  if (autoTrade) {
    // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
    let system = await User.findOne({ email: "system@ninepointer.in" })
    createdBy = system._id
    console.log("createdBy", createdBy)
  } else {
    createdBy = trader
  }
  //console.log("req.body", tradeDetails)

  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY" });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL" });


  if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety) {
    ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
    if (!dontSendResp) {
      console.log("Please fill all fields, autotrade");
      // return res.status(422).json({error : "please fill all the feilds..."})
    } else {
      return;
    }
  }

  if (buyOrSell === "SELL") {
    Quantity = "-" + Quantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try {

    //console.log("above")
    let liveData = await singleLivePrice(exchange, symbol)
    console.log("liveData", liveData)
    for (let elem of liveData) {
      if (elem.instrument_token == instrumentToken) {
        newTimeStamp = elem.timestamp;
        originalLastPriceUser = elem.last_price;
      }
    }


    trade_time = new Date(newTimeStamp);
    console.log("trade_time", trade_time)
  } catch (err) {
    console.log(err)
    return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailBuy[0].gst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
  }

  function sellBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailSell[0].gst) / 100);

    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge
  }

  let brokerageUser;

  // //console.log("3st")
  if (buyOrSell === "BUY") {
    brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else {
    brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }

  console.log("brokerageUser", brokerageUser)
  TenxTrader.findOne({ order_id: order_id })
    .then((dateExist) => {
      if (dateExist) {
        console.log("data already");
      }


      console.log("4st", subscriptionId)
      const tenx = new TenxTrader({
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
        order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId,
        createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
      });

      console.log("tenx", tenx);
      tenx.save().then(async () => {
        if (isRedisConnected && await client.exists(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
          //console.log("in the if condition")
          let pnl = await client.get(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
          pnl = JSON.parse(pnl);
          //console.log("before pnl", pnl)
          const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenx.instrumentToken && element._id.product === tenx.Product));

          // if instrument is same then just updating value
          if (matchingElement) {
            // Update the values of the matching element with the values of the first document
            matchingElement.amount += (tenx.amount * -1);
            matchingElement.brokerage += Number(tenx.brokerage);
            matchingElement.lastaverageprice = tenx.average_price;
            matchingElement.lots += Number(tenx.Quantity);
            //console.log("matchingElement", matchingElement)

          } else {
            // Create a new element if instrument is not matching
            pnl.push({
              _id: {
                symbol: tenx.symbol,
                product: tenx.Product,
                instrumentToken: tenx.instrumentToken,
                exchange: tenx.exchange,
              },
              amount: (tenx.amount * -1),
              brokerage: Number(tenx.brokerage),
              lots: Number(tenx.Quantity),
              lastaverageprice: tenx.average_price,
            });
          }

          await client.set(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))

        }

        if (isRedisConnected) {
          await client.expire(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
        }

        io.emit(`${trader.toString()}autoCut`, tenx);

      }).catch((err) => {
        console.log("in err autotrade", err)
        // res.status(500).json({error:"Failed to enter data"})
      });

    }).catch(err => { console.log("fail", err) });

}

const takeAutoInternshipTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.999Z";
  const today = new Date(todayDate);
  const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

  let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, batch,
    validity, variety, order_id, instrumentToken, portfolioId, internPath,
    trader, isAlgoTrader, paperTrade, autoTrade,
    dontSendResp } = tradeDetails;

  console.log("tradeDetails", tradeDetails)
  let createdBy;
  if (autoTrade) {
    // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
    let system = await User.findOne({ email: "system@ninepointer.in" })
    createdBy = system._id
    console.log("createdBy", createdBy)
  } else {
    createdBy = trader
  }
  //console.log("req.body", tradeDetails)

  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY" });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL" });


  if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety) {
    ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
    if (!dontSendResp) {
      console.log("Please fill all fields, autotrade");
      // return res.status(422).json({error : "please fill all the feilds..."})
    } else {
      return;
    }
  }

  if (buyOrSell === "SELL") {
    Quantity = "-" + Quantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try {

    //console.log("above")
    let liveData = await singleLivePrice(exchange, symbol)
    console.log("liveData", liveData)
    for (let elem of liveData) {
      if (elem.instrument_token == instrumentToken) {
        newTimeStamp = elem.timestamp;
        originalLastPriceUser = elem.last_price;
      }
    }


    trade_time = new Date(newTimeStamp);
    console.log("trade_time", trade_time)
  } catch (err) {
    console.log(err)
    return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailBuy[0].gst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
  }

  function sellBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailSell[0].gst) / 100);

    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge
  }

  let brokerageUser;

  // //console.log("3st")
  if (buyOrSell === "BUY") {
    brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else {
    brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }

  // console.log("brokerageUser", brokerageUser)
  InternshipTrade.findOne({order_id : order_id})
  .then((dataExist)=>{
      if(dataExist){
        console.log("data already exist in internship autotrade")
        return ;
      }

      const internship = new InternshipTrade({
          status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch,
          createdBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
      });

      internship.save().then(async ()=>{
          console.log("sending response");
          if(isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)){
              //console.log("in the if condition")
              let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
              pnl = JSON.parse(pnl);
              //console.log("before pnl", pnl)
              const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product ));
    
              // if instrument is same then just updating value
              if (matchingElement) {
                // Update the values of the matching element with the values of the first document
                matchingElement.amount += (internship.amount * -1);
                matchingElement.brokerage += Number(internship.brokerage);
                matchingElement.lastaverageprice = internship.average_price;
                matchingElement.lots += Number(internship.Quantity);
                //console.log("matchingElement", matchingElement)

              } else {
                // Create a new element if instrument is not matching
                pnl.push({
                  _id: {
                    symbol: internship.symbol,
                    product: internship.Product,
                    instrumentToken: internship.instrumentToken,
                    exchange: internship.exchange,
                  },
                  amount: (internship.amount * -1),
                  brokerage: Number(internship.brokerage),
                  lots: Number(internship.Quantity),
                  lastaverageprice: internship.average_price,
                });
              }
              
              await client.set(`${trader.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))
              
          }

          if(isRedisConnected){
              await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
          }

          io.emit(`${trader.toString()}autoCut`, internship);
          // res.status(201).json({status: 'Complete', message: 'COMPLETE'});
      }).catch((err)=> {
          console.log("in err", err)
          // res.status(500).json({error:"Failed to enter data"})
      });
  }).catch(err => {console.log(err, "fail")});  

}

const takeAutoPaperTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.999Z";
  const today = new Date(todayDate);
  const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

  let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId,
    validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
    realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
    dontSendResp } = tradeDetails;

  console.log("tradeDetails", tradeDetails)
  let createdBy;
  if (autoTrade) {
    // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
    let system = await User.findOne({ email: "system@ninepointer.in" })
    createdBy = system._id
    console.log("createdBy", createdBy)
  } else {
    createdBy = trader
  }
  //console.log("req.body", tradeDetails)

  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY" });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL" });


  if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety) {
    ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
    if (!dontSendResp) {
      console.log("Please fill all fields, autotrade");
      // return res.status(422).json({error : "please fill all the feilds..."})
    } else {
      return;
    }
  }

  if (buyOrSell === "SELL") {
    Quantity = "-" + Quantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try {

    //console.log("above")
    let liveData = await singleLivePrice(exchange, symbol)
    console.log("liveData", liveData)
    for (let elem of liveData) {
      if (elem.instrument_token == instrumentToken) {
        newTimeStamp = elem.timestamp;
        originalLastPriceUser = elem.last_price;
      }
    }


    trade_time = new Date(newTimeStamp);
    console.log("trade_time", trade_time)
  } catch (err) {
    console.log(err)
    return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailBuy[0].gst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
  }

  function sellBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailSell[0].gst) / 100);

    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge
  }

  let brokerageUser;

  // //console.log("3st")
  if (buyOrSell === "BUY") {
    brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else {
    brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }

  console.log("brokerageUser", brokerageUser)
  PaperTrade.findOne({ order_id: order_id })
    .then((dateExist) => {
      if (dateExist) {
        console.log("data already exist in paper autotrade")
        return ;
  
      }

      const paperTrade = new PaperTrade({
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
        order_id, instrumentToken, brokerage: brokerageUser, portfolioId,
        createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,

      });

      //console.log("mockTradeDetails", paperTrade);
      paperTrade.save().then(async () => {
        console.log("sending response");
        if (isRedisConnected && await client.exists(`${trader.toString()}: overallpnlPaperTrade`)) {
          //console.log("in the if condition")
          let pnl = await client.get(`${trader.toString()}: overallpnlPaperTrade`)
          pnl = JSON.parse(pnl);
          //console.log("before pnl", pnl)
          const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperTrade.instrumentToken && element._id.product === paperTrade.Product));

          // if instrument is same then just updating value
          if (matchingElement) {
            // Update the values of the matching element with the values of the first document
            matchingElement.amount += (paperTrade.amount * -1);
            matchingElement.brokerage += Number(paperTrade.brokerage);
            matchingElement.lastaverageprice = paperTrade.average_price;
            matchingElement.lots += Number(paperTrade.Quantity);
            //console.log("matchingElement", matchingElement)

          } else {
            // Create a new element if instrument is not matching
            pnl.push({
              _id: {
                symbol: paperTrade.symbol,
                product: paperTrade.Product,
                instrumentToken: paperTrade.instrumentToken,
                exchange: paperTrade.exchange,
              },
              amount: (paperTrade.amount * -1),
              brokerage: Number(paperTrade.brokerage),
              lots: Number(paperTrade.Quantity),
              lastaverageprice: paperTrade.average_price,
            });
          }

          await client.set(`${trader.toString()}: overallpnlPaperTrade`, JSON.stringify(pnl))

        }

        if (isRedisConnected) {
          await client.expire(`${trader.toString()}: overallpnlPaperTrade`, secondsRemaining);
        }

        io.emit(`${trader.toString()}autoCut`, paperTrade);
        // res.status(201).json({status: 'Complete', message: 'COMPLETE'});
      }).catch((err) => {
        console.log("in err", err)
        // res.status(500).json({error:"Failed to enter data"})
      });
    }).catch(err => { console.log(err, "fail") });

}

const takeAutoInfinityTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  let isRedisConnected = getValue();
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T23:59:59.999Z";
  const today = new Date(todayDate);
  const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

  let { exchange, symbol, buyOrSell, userQuantity, Product, OrderType, subscriptionId,
    validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
    realBuyOrSell, Quantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
    dontSendResp } = tradeDetails;

  console.log("tradeDetails", tradeDetails)
  let createdBy;
  if (autoTrade) {
    // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
    let system = await User.findOne({ email: "system@ninepointer.in" })
    createdBy = system._id
    console.log("createdBy", createdBy)
  } else {
    createdBy = trader
  }
  //console.log("req.body", tradeDetails)

  const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY" });
  const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL" });


  if (!exchange || !symbol || !buyOrSell || !userQuantity || !Product || !OrderType || !validity || !variety) {
    ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
    if (!dontSendResp) {
      console.log("Please fill all fields, autotrade");
      // return res.status(422).json({error : "please fill all the feilds..."})
    } else {
      return;
    }
  }

  if (buyOrSell === "SELL") {
    userQuantity = "-" + userQuantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let originalLastPriceCompany;
  let newTimeStamp = "";
  let trade_time = "";
  try {

    //console.log("above")
    let liveData = await singleLivePrice(exchange, symbol)
    console.log("liveData", liveData)
    for (let elem of liveData) {
      if (elem.instrument_token == instrumentToken) {
        newTimeStamp = elem.timestamp;
        originalLastPriceUser = elem.last_price;
        originalLastPriceCompany = elem.last_price;
      }
    }


    trade_time = new Date(newTimeStamp);
    console.log("trade_time", trade_time)
  } catch (err) {
    console.log(err)
    return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailBuy[0].gst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
  }

  function sellBrokerage(totalAmount) {
    let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
    let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
    let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
    let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(brokerageDetailSell[0].gst) / 100);

    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge
  }

  let brokerageUser;
  let brokerageCompany;

  if(realBuyOrSell === "BUY"){
      brokerageCompany = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany);
  } else{
      brokerageCompany = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany);
  }

  if(buyOrSell === "BUY"){
      brokerageUser = buyBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser);
  } else{
      brokerageUser = sellBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser);
  }

  let settingRedis;
  const session = await mongoose.startSession();
  try {

    const mockCompany = await InfinityTradeCompany.findOne({ order_id: order_id });
    const mockInfintyTrader = await InfinityTrader.findOne({ order_id: order_id });
    if ((mockCompany || mockInfintyTrader)) {
      console.log("data already exist in infinity autotrade")
      return ;
      // res.status(422).json({ message: "data already exist", error: "Fail to trade" })
    }


    session.startTransaction();

    const companyDoc = {
      status: "COMPLETE", average_price: originalLastPriceCompany, Quantity: Quantity,
      Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType,
      symbol, placed_by: "stoxhero", algoBox: algoBoxId, order_id,
      instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy,
      trader: trader, isRealTrade: false, amount: (Number(Quantity) * originalLastPriceCompany),
      trade_time: trade_time,
    }

    const traderDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity: userQuantity, Product, buyOrSell,
      variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
      isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser,
      createdBy, trader: trader, amount: (Number(userQuantity) * originalLastPriceUser), trade_time: trade_time,
    }

    const mockTradeDetails = await InfinityTradeCompany.create([companyDoc], { session });
    const algoTrader = await InfinityTrader.create([traderDoc], { session });
    // console.log(algoTrader[0].order_id, mockTradeDetails[0].order_id)
    // console.log("above if", isRedisConnected, await client.exists(`${trader.toString()} overallpnl`))
    if (isRedisConnected && await client.exists(`${trader.toString()} overallpnl`)) {
      console.log("in if")
      let pnl = await client.get(`${trader.toString()} overallpnl`)
      pnl = JSON.parse(pnl);
      console.log("redis pnl", pnl)
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === algoTrader[0].instrumentToken && element._id.product === algoTrader[0].Product));
      // if instrument is same then just updating value
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (algoTrader[0].amount * -1);
        matchingElement.brokerage += Number(algoTrader[0].brokerage);
        matchingElement.lastaverageprice = algoTrader[0].average_price;
        matchingElement.lots += Number(algoTrader[0].Quantity);

      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: algoTrader[0].symbol,
            product: algoTrader[0].Product,
            instrumentToken: algoTrader[0].instrumentToken,
            exchange: algoTrader[0].exchange,
          },
          amount: (algoTrader[0].amount * -1),
          brokerage: Number(algoTrader[0].brokerage),
          lots: Number(algoTrader[0].Quantity),
          lastaverageprice: algoTrader[0].average_price,
        });
      }
      settingRedis = await client.set(`${trader.toString()} overallpnl`, JSON.stringify(pnl))
      console.log("settingRedis", settingRedis)
    }

    if (isRedisConnected) {
      await client.expire(`${trader.toString()} overallpnl`, secondsRemaining);
    }
    // Commit the transaction

    // io.emit("updatePnl", mockTradeDetails)
    console.log(settingRedis)
    if (settingRedis === "OK") {
      await session.commitTransaction();
    } else {
      // await session.commitTransaction();
      throw new Error();
    }

    io.emit(`${trader.toString()}autoCut`, algoTrader);

    // res.status(201).json({ status: 'Complete', message: 'COMPLETE' });

  } catch (err) {
    console.error('Transaction failed, documents not saved:', err);
    if (isRedisConnected) {
      const del = await client.del(`${trader.toString()} overallpnl`)
    }
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    // res.status(201).json({ status: 'error', message: 'Your trade was not completed. Please attempt the trade once more' });
  } finally {
    // End the session
    session.endSession();
  }
}

module.exports = {takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade};