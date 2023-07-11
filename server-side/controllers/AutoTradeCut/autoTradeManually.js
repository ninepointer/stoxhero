const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const User = require("../../models/User/userDetailSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../../marketData/sigleLivePrice');
const { client, getValue } = require('../../marketData/redisClient');
const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const DailyContestMockCompany = require("../../models/DailyContest/dailyContestMockCompany");
const DailyContestMockUser = require("../../models/DailyContest/dailyContestMockUser");
const PaperTrade = require("../../models/mock-trade/paperTrade");
const InternshipTrade = require("../../models/mock-trade/internshipTrade");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany")
const mongoose = require('mongoose');
const io = require('../../marketData/socketio');
const { xtsAccountType, zerodhaAccountType } = require("../../constant");
const {marginCalculationTrader, marginCalculationCompany} = require("../../marketData/marginData");

const takeAutoTenxTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  return new Promise(async (resolve, reject) => {
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId,
      validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
      realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;

    // console.log("tradeDetails", tradeDetails)

    //console.log("req.body", tradeDetails)

    // const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
    // const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
    const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
    const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });


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
      // console.log("liveData", liveData)
      for (let elem of liveData) {
        if (elem.instrument_token == instrumentToken) {
          newTimeStamp = elem.timestamp;
          originalLastPriceUser = elem.last_price;
        }
      }


      trade_time = new Date(newTimeStamp);
      // console.log("trade_time", trade_time)
    } catch (err) {
      console.log(err)
      return new Error(err);
    }

    //console.log("2nd")

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
      let brokerage = Number(sellBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageUser;

    // //console.log("3st")
    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    // console.log("brokerageUser", brokerageUser)
    TenxTrader.findOne({ order_id: order_id })
      .then((dateExist) => {
        if (dateExist) {
          console.log("data already");
        }


        // console.log("4st", subscriptionId)
        const tenx = new TenxTrader({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
          createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
        });

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
          console.log("tenx", tenx);
          resolve();
        }).catch((err) => {
          console.log("in err autotrade", err)
          reject(err);
          // res.status(500).json({error:"Failed to enter data"})
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });
}

const takeAutoInternshipTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  return new Promise(async (resolve, reject) => {

    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, batch,
      validity, variety, order_id, instrumentToken, portfolioId, internPath,
      trader, isAlgoTrader, paperTrade, autoTrade,
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;


    //console.log("req.body", tradeDetails)

    const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
    const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });


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
      // console.log("liveData", liveData)
      for (let elem of liveData) {
        if (elem.instrument_token == instrumentToken) {
          newTimeStamp = elem.timestamp;
          originalLastPriceUser = elem.last_price;
        }
      }


      trade_time = new Date(newTimeStamp);
      // console.log("trade_time", trade_time)
    } catch (err) {
      console.log(err)
      return new Error(err);
    }

    //console.log("2nd")

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
      let brokerage = Number(sellBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageUser;

    // //console.log("3st")
    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    // console.log("brokerageUser", brokerageUser)
    InternshipTrade.findOne({ order_id: order_id })
      .then((dataExist) => {
        if (dataExist) {
          console.log("data already exist in internship autotrade")
          return;
        }

        const internship = new InternshipTrade({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
          createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
        });

        internship.save().then(async () => {
          console.log("sending response");
          if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
            //console.log("in the if condition")
            let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
            pnl = JSON.parse(pnl);
            //console.log("before pnl", pnl)
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

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

          if (isRedisConnected) {
            await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
          }

          io.emit(`${trader.toString()}autoCut`, internship);
          resolve();
        }).catch((err) => {
          console.log("in err autotrade", err)
          reject(err);
          // res.status(500).json({error:"Failed to enter data"})
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });

}

const takeAutoPaperTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  return new Promise(async (resolve, reject) => {

    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId,
      validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
      realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;


    const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
    const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });


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

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
      let brokerage = Number(sellBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageUser;

    // //console.log("3st")
    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    console.log("brokerageUser", brokerageUser)
    PaperTrade.findOne({ order_id: order_id })
      .then((dateExist) => {
        if (dateExist) {
          console.log("data already exist in paper autotrade")
          return;
        }

        const paperTrade = new PaperTrade({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
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
          resolve();
        }).catch((err) => {
          console.log("in err autotrade", err)
          reject(err);
          // res.status(500).json({error:"Failed to enter data"})
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });

}

const takeAutoInfinityTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  return new Promise(async (resolve, reject) => {

    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, userQuantity, Product, OrderType, subscriptionId,
      validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
      realBuyOrSell, Quantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
      dontSendResp, exchangeInstrumentToken, createdBy, marginData } = tradeDetails;


    const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
    const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
    const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
    const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });


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

    if (realBuyOrSell === "SELL") {
      Quantity = "-" + Quantity;
    }

    //console.log("1st")
    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try {

      //console.log("above")
      let liveData = await singleLivePrice(exchange, symbol)
      // console.log("liveData", liveData)
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

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
      let brokerage = Number(sellBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    if (realBuyOrSell === "BUY") {
      brokerageCompany = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany, brokerageDetailBuy[0]);
    } else {
      brokerageCompany = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany, brokerageDetailSell[0]);
    }

    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }



    let settingRedis;
    const session = await mongoose.startSession();
    try {

      const mockCompany = await InfinityTradeCompany.findOne({ order_id: order_id });
      const mockInfintyTrader = await InfinityTrader.findOne({ order_id: order_id });
      if ((mockCompany || mockInfintyTrader)) {
        console.log("data already exist in infinity autotrade")
        return;
        // res.status(422).json({ message: "data already exist", error: "Fail to trade" })
      }

      const saveTraderMargin = await marginCalculationTrader(marginData, tradeDetails, originalLastPriceUser, order_id)
      const saveCompanyMargin = await marginCalculationCompany(marginData, tradeDetails, originalLastPriceCompany, order_id)


      session.startTransaction();

      const companyDoc = {
        status: "COMPLETE", average_price: originalLastPriceCompany, Quantity: Quantity,
        Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType,
        symbol, placed_by: "stoxhero", algoBox: algoBoxId, order_id,
        instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy,
        trader: trader, isRealTrade: false, amount: (Number(Quantity) * originalLastPriceCompany),
        trade_time: trade_time, exchangeInstrumentToken
      }

      const traderDoc = {
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity: userQuantity, Product, buyOrSell,
        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
        isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
        createdBy, trader: trader, amount: (Number(userQuantity) * originalLastPriceUser), trade_time: trade_time,
      }

      const mockTradeDetails = await InfinityTradeCompany.create([companyDoc], { session });
      const algoTrader = await InfinityTrader.create([traderDoc], { session });
      if (isRedisConnected && await client.exists(`${trader.toString()} overallpnl`)) {
        console.log("in if")
        let pnl = await client.get(`${trader.toString()} overallpnl`)
        pnl = JSON.parse(pnl);
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
      resolve();
    } catch (err) {
      console.error('Transaction failed, documents not saved:', err);
      if (isRedisConnected) {
        const del = await client.del(`${trader.toString()} overallpnl`)
      }
      await session.abortTransaction();
      console.error('Transaction failed, documents not saved:', err);
      reject(err);
      // res.status(201).json({ status: 'error', message: 'Your trade was not completed. Please attempt the trade once more' });
    } finally {
      // End the session
      session.endSession();
    }
  });
}

const takeAutoDailyContestMockTrade = async (tradeDetails) => {
  // tradeDetails = JSON.parse(tradeDetails)
  return new Promise(async (resolve, reject) => {

    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, userQuantity, Product, OrderType, contestId,
      validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
      realBuyOrSell, Quantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade,
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;

      console.log("tradeDetails", tradeDetails)

    const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
    const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
    const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
    const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });


    if (!exchange || !symbol || !buyOrSell || !userQuantity || !Product || !OrderType || !validity || !variety) {
      if (!dontSendResp) {
        console.log("Please fill all fields, autotrade");
      } else {
        return;
      }
    }

    if (buyOrSell === "SELL") {
      userQuantity = "-" + userQuantity;
    }
    if (realBuyOrSell === "SELL") {
      Quantity = "-" + Quantity;
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
      newTimeStamp = liveData[0]?.timestamp;
      // console.log("zerodha date", liveData[0].timestamp)
      originalLastPriceUser = liveData[0]?.last_price;
      originalLastPriceCompany = liveData[0]?.last_price;



      trade_time = new Date(newTimeStamp);
      console.log("trade_time", trade_time)
    } catch (err) {
      console.log(err)
      return new Error(err);
    }

    function buyBrokerage(totalAmount, buyBrokerData) {//brokerageDetailBuy[0]
      let brokerage = Number(buyBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
    }

    function sellBrokerage(totalAmount, sellBrokerData) {//brokerageDetailSell[0]
      let brokerage = Number(sellBrokerData.brokerageCharge);
      let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
      let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
      let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
      let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
      let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

      return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    if (realBuyOrSell === "BUY") {
      brokerageCompany = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany, brokerageDetailBuy[0]);
    } else {
      brokerageCompany = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceCompany, brokerageDetailSell[0]);
    }

    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(userQuantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    let settingRedis;
    const session = await mongoose.startSession();
    try {

      const mockCompany = await DailyContestMockCompany.findOne({ order_id: order_id });
      const mockInfintyTrader = await DailyContestMockUser.findOne({ order_id: order_id });
      if ((mockCompany || mockInfintyTrader)) {
        console.log("data already exist in infinity autotrade")
        return;
        // res.status(422).json({ message: "data already exist", error: "Fail to trade" })
      }


      session.startTransaction();

      const companyDoc = {
        status: "COMPLETE", average_price: originalLastPriceCompany, Quantity: Quantity,
        Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType,
        symbol, placed_by: "stoxhero", algoBox: algoBoxId, order_id,
        instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy,
        trader: trader, isRealTrade: false, amount: (Number(Quantity) * originalLastPriceCompany),
        trade_time: trade_time, exchangeInstrumentToken, contestId
      }

      const traderDoc = {
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity: userQuantity, Product, buyOrSell,
        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", contestId,
        isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
        createdBy, trader: trader, amount: (Number(userQuantity) * originalLastPriceUser), trade_time: trade_time,
      }

      const mockTradeDetails = await DailyContestMockCompany.create([companyDoc], { session });
      const algoTrader = await DailyContestMockUser.create([traderDoc], { session });

      if (isRedisConnected && await client.exists(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)) {
        console.log("in if")
        let pnl = await client.get(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)
        pnl = JSON.parse(pnl);
        // console.log("redis pnl", pnl)
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
        settingRedis = await client.set(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, JSON.stringify(pnl))
        console.log("settingRedis", settingRedis)
      }

      if (isRedisConnected) {
        await client.expire(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, secondsRemaining);
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
      resolve();
    } catch (err) {
      console.error('Transaction failed, documents not saved:', err);
      if (isRedisConnected) {
        const del = await client.del(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)
      }
      await session.abortTransaction();
      console.error('Transaction failed, documents not saved:', err);
      reject(err);
      // res.status(201).json({ status: 'error', message: 'Your trade was not completed. Please attempt the trade once more' });
    } finally {
      // End the session
      session.endSession();
    }
  });
}

module.exports = { takeAutoDailyContestMockTrade, takeAutoTenxTrade, takeAutoPaperTrade, takeAutoInfinityTrade, takeAutoInternshipTrade };