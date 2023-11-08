const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const User = require("../../models/User/userDetailSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../../marketData/sigleLivePrice');
const { client, getValue } = require('../../marketData/redisClient');
const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const DailyContestMockCompany = require("../../models/DailyContest/dailyContestMockCompany");
const DailyContestMockUser = require("../../models/DailyContest/dailyContestMockUser");
const MarginXMockCompany = require("../../models/marginX/marginXCompanyMock");
const MarginXMockUser = require("../../models/marginX/marginXUserMock");
const PaperTrade = require("../../models/mock-trade/paperTrade");
const InternshipTrade = require("../../models/mock-trade/internshipTrade");
const BattleTrade = require("../../models/battle/battleTrade");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany")
const mongoose = require('mongoose');
const {getIOValue} = require('../../marketData/socketio');
const { xtsAccountType, zerodhaAccountType } = require("../../constant");
const {marginCalculationTrader, marginCalculationCompany} = require("../../marketData/marginData");

const takeAutoTenxTrade = async (tradeDetails) => {
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId,
      validity, variety, order_id, instrumentToken, portfolioId, trader, 
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;

      const {brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety) {
      
      if (!dontSendResp) {
        console.log("Please fill all fields, autotrade");
      } else {
        return;
      }
    }

    if (buyOrSell === "SELL") {
      Quantity = "-" + Quantity;
    }

    let originalLastPriceUser;
    let newTimeStamp = "";
    let trade_time = "";
    try {
      let liveData = await singleLivePrice(exchange, symbol)
      
      newTimeStamp = liveData?.timestamp;
      originalLastPriceUser = liveData?.last_price;

      trade_time = new Date(newTimeStamp);
    } catch (err) {
      console.log(err)
      return new Error(err);
    }


    let brokerageUser;

    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    TenxTrader.findOne({ order_id: order_id })
      .then((dateExist) => {
        if (dateExist) {
          console.log("data already");
        }

        const tenx = new TenxTrader({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
          createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
        });

        tenx.save().then(async () => {
          if (isRedisConnected && await client.exists(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
            let pnl = await client.get(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
            pnl = JSON.parse(pnl);
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenx.instrumentToken && element._id.product === tenx.Product));

            // if instrument is same then just updating value
            if (matchingElement) {
              // Update the values of the matching element with the values of the first document
              matchingElement.amount += (tenx.amount * -1);
              matchingElement.brokerage += Number(tenx.brokerage);
              matchingElement.lastaverageprice = tenx.average_price;
              matchingElement.lots += Number(tenx.Quantity);

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
          
          resolve();
        }).catch((err) => {
          console.log("in err autotrade", err)
          reject(err);
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });
}

const takeAutoInternshipTrade = async (tradeDetails) => {
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, order_type, batch,
      validity, variety, order_id, instrumentToken, portfolioId,
      trader, dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;

      const {brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety) {
      
      if (!dontSendResp) {
        console.log("Please fill all fields, autotrade");
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

      let liveData = await singleLivePrice(exchange, symbol)
      
      newTimeStamp = liveData?.timestamp;
      originalLastPriceUser = liveData?.last_price;

      trade_time = new Date(newTimeStamp);
    } catch (err) {
      console.log(err)
      return new Error(err);
    }


    let brokerageUser;
    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    InternshipTrade.findOne({ order_id: order_id })
      .then((dataExist) => {
        if (dataExist) {
          console.log("data already exist in internship autotrade")
          return;
        }

        const internship = new InternshipTrade({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
          createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
        });

        internship.save().then(async () => {
          
          if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
            let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
            pnl = JSON.parse(pnl);
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

            // if instrument is same then just updating value
            if (matchingElement) {
              // Update the values of the matching element with the values of the first document
              matchingElement.amount += (internship.amount * -1);
              matchingElement.brokerage += Number(internship.brokerage);
              matchingElement.lastaverageprice = internship.average_price;
              matchingElement.lots += Number(internship.Quantity);

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
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });

}

const takeAutoPaperTrade = async (tradeDetails) => {
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, order_type,
      validity, variety, order_id, instrumentToken, portfolioId,
      trader, dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;


      const {brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    if (!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety) {
      
      if (!dontSendResp) {
        console.log("Please fill all fields, autotrade");
      } else {
        return;
      }
    }

    if (buyOrSell === "SELL") {
      Quantity = "-" + Quantity;
    }

    let originalLastPriceUser;
    let newTimeStamp = "";
    let trade_time = "";
    try {

      let liveData = await singleLivePrice(exchange, symbol)
      
      newTimeStamp = liveData?.timestamp;
      originalLastPriceUser = liveData?.last_price;
      trade_time = new Date(newTimeStamp);
      
    } catch (err) {
      console.log(err)
      return new Error(err);
    }

    let brokerageUser;
    if (buyOrSell === "BUY") {
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailBuyUser[0]);
    } else {
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser, brokerageDetailSellUser[0]);
    }

    
    PaperTrade.findOne({ order_id: order_id })
      .then((dateExist) => {
        if (dateExist) {
          console.log("data already exist in paper autotrade")
          return;
        }

        const paperTrade = new PaperTrade({
          status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
          createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,

        });

        paperTrade.save().then(async () => {
          
          if (isRedisConnected && await client.exists(`${trader.toString()}: overallpnlPaperTrade`)) {
            let pnl = await client.get(`${trader.toString()}: overallpnlPaperTrade`)
            pnl = JSON.parse(pnl);
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperTrade.instrumentToken && element._id.product === paperTrade.Product));

            // if instrument is same then just updating value
            if (matchingElement) {
              // Update the values of the matching element with the values of the first document
              matchingElement.amount += (paperTrade.amount * -1);
              matchingElement.brokerage += Number(paperTrade.brokerage);
              matchingElement.lastaverageprice = paperTrade.average_price;
              matchingElement.lots += Number(paperTrade.Quantity);

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
        });

      }).catch(err => { console.log("fail", err); reject(err); });
  });

}

const takeAutoInfinityTrade = async (tradeDetails) => {
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, userQuantity, Product, order_type,
      validity, variety, algoBoxId, order_id, instrumentToken,
      realBuyOrSell, Quantity, real_instrument_token, trader,
      dontSendResp, exchangeInstrumentToken, createdBy, marginData } = tradeDetails;

    const {brokerageDetailBuy, brokerageDetailSell, brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();

    if (!exchange || !symbol || !buyOrSell || !userQuantity || !Product || !order_type || !validity || !variety) {
      
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

    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try {

      let liveData = await singleLivePrice(exchange, symbol)
      
      newTimeStamp = liveData?.timestamp;
      originalLastPriceUser = liveData?.last_price;
      originalLastPriceCompany = liveData?.last_price;

      trade_time = new Date(newTimeStamp);
      
    } catch (err) {
      console.log(err)
      return new Error(err);
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
      }

      session.startTransaction();

      const companyDoc = {
        status: "COMPLETE", average_price: originalLastPriceCompany, Quantity: Quantity,
        Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type,
        symbol, placed_by: "stoxhero", algoBox: algoBoxId, order_id,
        instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy,
        trader: trader, isRealTrade: false, amount: (Number(Quantity) * originalLastPriceCompany),
        trade_time: trade_time, exchangeInstrumentToken
      }

      const traderDoc = {
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity: userQuantity, Product, buyOrSell,
        variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
        isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
        createdBy, trader: trader, amount: (Number(userQuantity) * originalLastPriceUser), trade_time: trade_time,
      }

      const mockTradeDetails = await InfinityTradeCompany.create([companyDoc], { session });
      const algoTrader = await InfinityTrader.create([traderDoc], { session });
      if (isRedisConnected && await client.exists(`${trader.toString()} overallpnl`)) {
        
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

      console.log(settingRedis)
      if (true) {
        const saveTraderMargin = await marginCalculationTrader(marginData, tradeDetails, originalLastPriceUser, order_id)
        const saveCompanyMargin = await marginCalculationCompany(marginData, tradeDetails, originalLastPriceCompany, order_id)
  
        await session.commitTransaction();
      }

      io.emit(`${trader.toString()}autoCut`, algoTrader);
      resolve();
    } catch (err) {
      console.error('Transaction failed, documents not saved:', err);
      if (isRedisConnected) {
        const del = await client.del(`${trader.toString()} overallpnl`)
      }
      await session.abortTransaction();
      console.error('Transaction failed, documents not saved:', err);
      reject(err);
    } finally {
      // End the session
      session.endSession();
    }
  });
}

const takeAutoDailyContestMockTrade = async (tradeDetails) => {
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, userQuantity, Product, order_type, contestId,
      validity, variety, algoBoxId, order_id, instrumentToken,
      realBuyOrSell, Quantity, real_instrument_token, trader,
      dontSendResp, exchangeInstrumentToken, createdBy } = tradeDetails;

      

      const {brokerageDetailBuy, brokerageDetailSell, brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    if (!exchange || !symbol || !buyOrSell || !userQuantity || !Product || !order_type || !validity || !variety) {
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

    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try {

      let liveData = await singleLivePrice(exchange, symbol)
      
      newTimeStamp = liveData?.timestamp;
      originalLastPriceUser = liveData?.last_price;
      originalLastPriceCompany = liveData?.last_price;



      trade_time = new Date(newTimeStamp);
      
    } catch (err) {
      console.log(err)
      return new Error(err);
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
      }


      session.startTransaction();

      const companyDoc = {
        status: "COMPLETE", average_price: originalLastPriceCompany, Quantity: Quantity,
        Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type,
        symbol, placed_by: "stoxhero", algoBox: algoBoxId, order_id,
        instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy,
        trader: trader, isRealTrade: false, amount: (Number(Quantity) * originalLastPriceCompany),
        trade_time: trade_time, exchangeInstrumentToken, contestId
      }

      const traderDoc = {
        status: "COMPLETE", average_price: originalLastPriceUser, Quantity: userQuantity, Product, buyOrSell,
        variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", contestId,
        isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
        createdBy, trader: trader, amount: (Number(userQuantity) * originalLastPriceUser), trade_time: trade_time,
      }

      const mockTradeDetails = await DailyContestMockCompany.create([companyDoc], { session });
      const algoTrader = await DailyContestMockUser.create([traderDoc], { session });

      if (isRedisConnected && await client.exists(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)) {
        
        let pnl = await client.get(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)
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
        settingRedis = await client.set(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, JSON.stringify(pnl))
        console.log("settingRedis", settingRedis)
      }

      if (isRedisConnected) {
        await client.expire(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, secondsRemaining);
      }
      // Commit the transaction

      console.log(settingRedis)
      if (true) {
        await session.commitTransaction();
      }

      io.emit(`${trader.toString()}autoCut`, algoTrader);
      resolve();
    } catch (err) {
      console.error('Transaction failed, documents not saved:', err);
      if (isRedisConnected) {
        const del = await client.del(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)
      }
      await session.abortTransaction();
      console.error('Transaction failed, documents not saved:', err);
      reject(err);
    } finally {
      // End the session
      session.endSession();
    }
  });
}


function buyBrokerage(totalAmount, buyBrokerData) {
  let brokerage = Number(buyBrokerData.brokerageCharge);
  let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
  let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
  let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
  let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
  let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
  let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
  return finalCharge;
}

function sellBrokerage(totalAmount, sellBrokerData) {
  let brokerage = Number(sellBrokerData.brokerageCharge);
  let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
  let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
  let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
  let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
  let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
  let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

  return finalCharge
}

async function brokerage(){
  let brokerageDetailBuy;
  let brokerageDetailSell;
  let brokerageDetailBuyUser;
  let brokerageDetailSellUser;

  let isRedisConnected = getValue();

  if(isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)){
      brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
      brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
  } else{
      brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY", accountType: xtsAccountType});
      await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
  }

  if(isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)){
      brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
      brokerageDetailSell = JSON.parse(brokerageDetailSell);
  } else{
      brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL", accountType: xtsAccountType});
      await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
  }

  if(isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)){
      brokerageDetailBuyUser = await client.HGET('brokerage', `buy-user`);
      brokerageDetailBuyUser = JSON.parse(brokerageDetailBuyUser);
  } else{
      brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
      await client.HSET('brokerage', `buy-user`, JSON.stringify(brokerageDetailBuyUser));
  }

  if(isRedisConnected && await client.HEXISTS('brokerage', `sell-user`)){
      brokerageDetailSellUser = await client.HGET('brokerage', `sell-user`);
      brokerageDetailSellUser = JSON.parse(brokerageDetailSellUser);
  } else{
      brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
      await client.HSET('brokerage', `sell-user`, JSON.stringify(brokerageDetailSellUser));
  }

  return {brokerageDetailBuy, brokerageDetailSell, brokerageDetailBuyUser, brokerageDetailSellUser}

}

const takeInternshipTrades = async(tradeObjs)=>{
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);
    const {brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    //console.log("1st")
    

    tradeObjs.forEach((trade, index) => {
      let brokerageUser;
      if (trade?.buyOrSell === "BUY") {
          brokerageUser = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuyUser[0]);
      } else {
          brokerageUser = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSellUser[0]);
      }
      tradeObjs[index] = {...trade, brokerage:brokerageUser};
  });

  try {
    await InternshipTrade.insertMany(tradeObjs);
    console.log('Documents inserted');
    for(trade of tradeObjs){
      if (isRedisConnected && await client.exists(`${trade?.trader.toString()}${trade?.batch.toString()}: overallpnlIntern`)) {
        let pnl = await client.get(`${trade?.trader.toString()}${trade?.batch.toString()}: overallpnlIntern`)
        pnl = JSON.parse(pnl);
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === trade?.instrumentToken && element._id.product === trade?.Product));
  
        // if instrument is same then just updating value
        if (matchingElement) {
          // Update the values of the matching element with the values of the first document
          matchingElement.amount += (trade?.amount * -1);
          matchingElement.brokerage += Number(trade?.brokerage);
          matchingElement.lastaverageprice = trade?.average_price;
          matchingElement.lots += Number(trade?.Quantity);
  
        } else {
          // Create a new element if instrument is not matching
          pnl.push({
            _id: {
              symbol: trade?.symbol,
              product: trade?.Product,
              instrumentToken: trade?.instrumentToken,
              exchange: trade?.exchange,
            },
            amount: (trade?.amount * -1),
            brokerage: Number(trade?.brokerage),
            lots: Number(trade?.Quantity),
            lastaverageprice: trade?.average_price,
          });
        }
  
        await client.set(`${trade?.trader.toString()}${trade?.batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))
  
      }
  
      if (isRedisConnected) {
        await client.expire(`${trade?.trader.toString()}${trade?.batch.toString()}: overallpnlIntern`, secondsRemaining);
      }
  
      io.emit(`${trade?.trader.toString()}autoCut`, trade);
    }
    resolve();
} catch (err) {
    console.error('Error inserting documents:', err);
}
    // InternshipTrade.findOne({ order_id: order_id })
    //   .then((dataExist) => {
    //     if (dataExist) {
    //       console.log("data already exist in internship autotrade")
    //       return;
    //     }

    //     const internship = new InternshipTrade({
    //       status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
    //       variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
    //       order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
    //       createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
    //     });

    //     internship.save().then(async () => {
          
    //       if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
    //         let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
    //         pnl = JSON.parse(pnl);
    //         const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

    //         // if instrument is same then just updating value
    //         if (matchingElement) {
    //           // Update the values of the matching element with the values of the first document
    //           matchingElement.amount += (internship.amount * -1);
    //           matchingElement.brokerage += Number(internship.brokerage);
    //           matchingElement.lastaverageprice = internship.average_price;
    //           matchingElement.lots += Number(internship.Quantity);

    //         } else {
    //           // Create a new element if instrument is not matching
    //           pnl.push({
    //             _id: {
    //               symbol: internship.symbol,
    //               product: internship.Product,
    //               instrumentToken: internship.instrumentToken,
    //               exchange: internship.exchange,
    //             },
    //             amount: (internship.amount * -1),
    //             brokerage: Number(internship.brokerage),
    //             lots: Number(internship.Quantity),
    //             lastaverageprice: internship.average_price,
    //           });
    //         }

    //         await client.set(`${trader.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))

    //       }

    //       if (isRedisConnected) {
    //         await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
    //       }

    //       io.emit(`${trader.toString()}autoCut`, internship);
    //       resolve();
    //     }).catch((err) => {
    //       console.log("in err autotrade", err)
    //       reject(err);
    //     });

    //   }).catch(err => { console.log("fail", err); reject(err); });
  });
}

const takeDailyContestMockTrades = async(companyTradeObjects, userTradeObjects)=>{
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);
    const {brokerageDetailBuy, brokerageDetailSell, brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    //console.log("1st")
    

    userTradeObjects.forEach((trade, index) => {
      let brokerageUser;
      if (trade?.buyOrSell === "BUY") {
          brokerageUser = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuyUser[0]);
      } else {
          brokerageUser = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSellUser[0]);
      }
      userTradeObjects[index] = {...trade, brokerage:brokerageUser};
  });
    companyTradeObjects.forEach((trade, index) => {
      let brokerageCompany;
      if (trade?.buyOrSell === "BUY") {
        brokerageCompany = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuy[0]);
      } else {
        brokerageCompany = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSell[0]);
      }
      companyTradeObjects[index] = {...trade, brokerage:brokerageCompany};
  });
  let settingRedis;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await DailyContestMockUser.insertMany(userTradeObjects, {session});
    await DailyContestMockCompany.insertMany(companyTradeObjects, {session});
    console.log('Documents inserted');
    for(trade of userTradeObjects){
      if (isRedisConnected && await client.exists(`${trade?.trader.toString()}${trade?.contestId.toString()} overallpnlDailyContest`)) {
        let pnl = await client.get(`${trade?.trader.toString()}${trade?.contestId.toString()} overallpnlDailyContest`)
        pnl = JSON.parse(pnl);
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === trade?.instrumentToken && element._id.product === trade?.Product));
  
        // if instrument is same then just updating value
        if (matchingElement) {
          // Update the values of the matching element with the values of the first document
          matchingElement.amount += (trade?.amount * -1);
          matchingElement.brokerage += Number(trade?.brokerage);
          matchingElement.lastaverageprice = trade?.average_price;
          matchingElement.lots += Number(trade?.Quantity);
  
        } else {
          // Create a new element if instrument is not matching
          pnl.push({
            _id: {
              symbol: trade?.symbol,
              product: trade?.Product,
              instrumentToken: trade?.instrumentToken,
              exchange: trade?.exchange,
            },
            amount: (trade?.amount * -1),
            brokerage: Number(trade?.brokerage),
            lots: Number(trade?.Quantity),
            lastaverageprice: trade?.average_price,
          });
        }
  
        settingRedis = await client.set(`${trade?.trader.toString()}${trade?.contestId?.toString()} overallpnlDailyContest`, JSON.stringify(pnl))
  
      }
  
      if (isRedisConnected) {
        await client.expire(`${trade?.trader.toString()}${trade?.contestId?.toString()} overallpnlDailyContest`, secondsRemaining);
      }
      io.emit(`${trade?.trader.toString()}autoCut`, trade);
    }
    if (true) {
      console.log('committing transaction');
      await session.commitTransaction();
    }
    resolve();
} catch (err) {
    console.error('Error inserting documents:', err);
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    reject(err);
}finally {
  // End the session
  session.endSession();
}
    // InternshipTrade.findOne({ order_id: order_id })
    //   .then((dataExist) => {
    //     if (dataExist) {
    //       console.log("data already exist in internship autotrade")
    //       return;
    //     }

    //     const internship = new InternshipTrade({
    //       status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
    //       variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
    //       order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
    //       createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
    //     });

    //     internship.save().then(async () => {
          
    //       if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
    //         let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
    //         pnl = JSON.parse(pnl);
    //         const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

    //         // if instrument is same then just updating value
    //         if (matchingElement) {
    //           // Update the values of the matching element with the values of the first document
    //           matchingElement.amount += (internship.amount * -1);
    //           matchingElement.brokerage += Number(internship.brokerage);
    //           matchingElement.lastaverageprice = internship.average_price;
    //           matchingElement.lots += Number(internship.Quantity);

    //         } else {
    //           // Create a new element if instrument is not matching
    //           pnl.push({
    //             _id: {
    //               symbol: internship.symbol,
    //               product: internship.Product,
    //               instrumentToken: internship.instrumentToken,
    //               exchange: internship.exchange,
    //             },
    //             amount: (internship.amount * -1),
    //             brokerage: Number(internship.brokerage),
    //             lots: Number(internship.Quantity),
    //             lastaverageprice: internship.average_price,
    //           });
    //         }

    //         await client.set(`${trader.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))

    //       }

    //       if (isRedisConnected) {
    //         await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
    //       }

    //       io.emit(`${trader.toString()}autoCut`, internship);
    //       resolve();
    //     }).catch((err) => {
    //       console.log("in err autotrade", err)
    //       reject(err);
    //     });

    //   }).catch(err => { console.log("fail", err); reject(err); });
  });
}
const takeMarginXMockTrades = async(companyTradeObjects, userTradeObjects)=>{
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);
    const {brokerageDetailBuy, brokerageDetailSell, brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    //console.log("1st")
    

    userTradeObjects.forEach((trade, index) => {
      let brokerageUser;
      if (trade?.buyOrSell === "BUY") {
          brokerageUser = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuyUser[0]);
      } else {
          brokerageUser = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSellUser[0]);
      }
      userTradeObjects[index] = {...trade, brokerage:brokerageUser};
  });
    companyTradeObjects.forEach((trade, index) => {
      let brokerageCompany;
      if (trade?.buyOrSell === "BUY") {
        brokerageCompany = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuy[0]);
      } else {
        brokerageCompany = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSell[0]);
      }
      companyTradeObjects[index] = {...trade, brokerage:brokerageCompany};
  });
  let settingRedis;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await MarginXMockUser.insertMany(userTradeObjects, {session});
    await MarginXMockCompany.insertMany(companyTradeObjects, {session});
    console.log('Documents inserted');
    for(trade of userTradeObjects){
      if (isRedisConnected && await client.exists(`${trade?.trader.toString()}${trade?.marginxId.toString()} overallpnlMarginX`)) {
        let pnl = await client.get(`${trade?.trader.toString()}${trade?.marginxId.toString()} overallpnlMarginX`)
        pnl = JSON.parse(pnl);
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === trade?.instrumentToken && element._id.product === trade?.Product));
  
        // if instrument is same then just updating value
        if (matchingElement) {
          // Update the values of the matching element with the values of the first document
          matchingElement.amount += (trade?.amount * -1);
          matchingElement.brokerage += Number(trade?.brokerage);
          matchingElement.lastaverageprice = trade?.average_price;
          matchingElement.lots += Number(trade?.Quantity);
  
        } else {
          // Create a new element if instrument is not matching
          pnl.push({
            _id: {
              symbol: trade?.symbol,
              product: trade?.Product,
              instrumentToken: trade?.instrumentToken,
              exchange: trade?.exchange,
            },
            amount: (trade?.amount * -1),
            brokerage: Number(trade?.brokerage),
            lots: Number(trade?.Quantity),
            lastaverageprice: trade?.average_price,
          });
        }
  
        settingRedis = await client.set(`${trade?.trader.toString()}${trade?.marginxId?.toString()} overallpnlMarginX`, JSON.stringify(pnl))
  
      }
  
      if (isRedisConnected) {
        await client.expire(`${trade?.trader.toString()}${trade?.marginxId?.toString()} overallpnlMarginX`, secondsRemaining);
      }
      io.emit(`${trade?.trader.toString()}autoCut`, trade);
    }
    if (true) {
      console.log('committing transaction');
      await session.commitTransaction();
    }
    resolve();
} catch (err) {
    console.error('Error inserting documents:', err);
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    reject(err);
}finally {
  // End the session
  session.endSession();
}
    // InternshipTrade.findOne({ order_id: order_id })
    //   .then((dataExist) => {
    //     if (dataExist) {
    //       console.log("data already exist in internship autotrade")
    //       return;
    //     }

    //     const internship = new InternshipTrade({
    //       status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
    //       variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
    //       order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
    //       createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
    //     });

    //     internship.save().then(async () => {
          
    //       if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
    //         let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
    //         pnl = JSON.parse(pnl);
    //         const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

    //         // if instrument is same then just updating value
    //         if (matchingElement) {
    //           // Update the values of the matching element with the values of the first document
    //           matchingElement.amount += (internship.amount * -1);
    //           matchingElement.brokerage += Number(internship.brokerage);
    //           matchingElement.lastaverageprice = internship.average_price;
    //           matchingElement.lots += Number(internship.Quantity);

    //         } else {
    //           // Create a new element if instrument is not matching
    //           pnl.push({
    //             _id: {
    //               symbol: internship.symbol,
    //               product: internship.Product,
    //               instrumentToken: internship.instrumentToken,
    //               exchange: internship.exchange,
    //             },
    //             amount: (internship.amount * -1),
    //             brokerage: Number(internship.brokerage),
    //             lots: Number(internship.Quantity),
    //             lastaverageprice: internship.average_price,
    //           });
    //         }

    //         await client.set(`${trader.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))

    //       }

    //       if (isRedisConnected) {
    //         await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
    //       }

    //       io.emit(`${trader.toString()}autoCut`, internship);
    //       resolve();
    //     }).catch((err) => {
    //       console.log("in err autotrade", err)
    //       reject(err);
    //     });

    //   }).catch(err => { console.log("fail", err); reject(err); });
  });
}

const takeBattleTrades = async(tradeObjs)=>{
  return new Promise(async (resolve, reject) => {
    const io = getIOValue();
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);
    const {brokerageDetailBuyUser, brokerageDetailSellUser} = await brokerage();


    //console.log("1st")
    

    tradeObjs.forEach((trade, index) => {
      let brokerageUser;
      if (trade?.buyOrSell === "BUY") {
          brokerageUser = buyBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailBuyUser[0]);
      } else {
          brokerageUser = sellBrokerage(Math.abs(Number(trade?.amount)), brokerageDetailSellUser[0]);
      }
      tradeObjs[index] = {...trade, brokerage:brokerageUser};
  });

  try {
    await BattleTrade.insertMany(tradeObjs);
    console.log('Documents inserted');
    for(trade of tradeObjs){
      if (isRedisConnected && await client.exists(`${trade?.trader.toString()}${trade?.battleId.toString()} overallpnlBattle`)) {
        let pnl = await client.get(`${trade?.trader.toString()}${trade?.battleId.toString()} overallpnlBattle`)
        pnl = JSON.parse(pnl);
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === trade?.instrumentToken && element._id.product === trade?.Product));
  
        // if instrument is same then just updating value
        if (matchingElement) {
          // Update the values of the matching element with the values of the first document
          matchingElement.amount += (trade?.amount * -1);
          matchingElement.brokerage += Number(trade?.brokerage);
          matchingElement.lastaverageprice = trade?.average_price;
          matchingElement.lots += Number(trade?.Quantity);
  
        } else {
          // Create a new element if instrument is not matching
          pnl.push({
            _id: {
              symbol: trade?.symbol,
              product: trade?.Product,
              instrumentToken: trade?.instrumentToken,
              exchange: trade?.exchange,
            },
            amount: (trade?.amount * -1),
            brokerage: Number(trade?.brokerage),
            lots: Number(trade?.Quantity),
            lastaverageprice: trade?.average_price,
          });
        }
  
        await client.set(`${trade?.trader.toString()}${trade?.battleId.toString()} overallpnlBattle`, JSON.stringify(pnl))
  
      }
  
      if (isRedisConnected) {
        await client.expire(`${trade?.trader.toString()}${trade?.battleId.toString()} overallpnlBattle`, secondsRemaining);
      }
  
      io?.emit(`${trade?.trader.toString()}autoCut`, trade);
    }
    resolve();
} catch (err) {
    console.error('Error inserting documents:', err);
}
    // InternshipTrade.findOne({ order_id: order_id })
    //   .then((dataExist) => {
    //     if (dataExist) {
    //       console.log("data already exist in internship autotrade")
    //       return;
    //     }

    //     const internship = new InternshipTrade({
    //       status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
    //       variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
    //       order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: batch, exchangeInstrumentToken,
    //       createdBy, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
    //     });

    //     internship.save().then(async () => {
          
    //       if (isRedisConnected && await client.exists(`${trader.toString()}${batch.toString()}: overallpnlIntern`)) {
    //         let pnl = await client.get(`${trader.toString()}${batch.toString()}: overallpnlIntern`)
    //         pnl = JSON.parse(pnl);
    //         const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product));

    //         // if instrument is same then just updating value
    //         if (matchingElement) {
    //           // Update the values of the matching element with the values of the first document
    //           matchingElement.amount += (internship.amount * -1);
    //           matchingElement.brokerage += Number(internship.brokerage);
    //           matchingElement.lastaverageprice = internship.average_price;
    //           matchingElement.lots += Number(internship.Quantity);

    //         } else {
    //           // Create a new element if instrument is not matching
    //           pnl.push({
    //             _id: {
    //               symbol: internship.symbol,
    //               product: internship.Product,
    //               instrumentToken: internship.instrumentToken,
    //               exchange: internship.exchange,
    //             },
    //             amount: (internship.amount * -1),
    //             brokerage: Number(internship.brokerage),
    //             lots: Number(internship.Quantity),
    //             lastaverageprice: internship.average_price,
    //           });
    //         }

    //         await client.set(`${trader.toString()}${batch.toString()}: overallpnlIntern`, JSON.stringify(pnl))

    //       }

    //       if (isRedisConnected) {
    //         await client.expire(`${trader.toString()}${batch.toString()}: overallpnlIntern`, secondsRemaining);
    //       }

    //       io.emit(`${trader.toString()}autoCut`, internship);
    //       resolve();
    //     }).catch((err) => {
    //       console.log("in err autotrade", err)
    //       reject(err);
    //     });

    //   }).catch(err => { console.log("fail", err); reject(err); });
  });
}



module.exports = { takeAutoDailyContestMockTrade, takeAutoTenxTrade, takeAutoPaperTrade, 
  takeAutoInfinityTrade, takeAutoInternshipTrade, takeInternshipTrades, 
  takeDailyContestMockTrades, takeMarginXMockTrades, takeBattleTrades };

