const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");
const Tradable = require("../models/Instruments/tradableInstrumentsSchema");
const InfinityLiveTrader = require("../models/TradeDetails/infinityLiveUser");
const InfinityLiveCompany = require("../models/TradeDetails/liveTradeSchema");
const InfinityMockTrader = require("../models/mock-trade/infinityTrader");
const InfinityMockCompany = require("../models/mock-trade/infinityTradeCompany");
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const { xtsAccountType, zerodhaAccountType} = require("../constant");
const mongoose = require('mongoose');
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser")
const DailyContestLiveUser = require("../models/DailyContest/dailyContestLiveUser")
const DailyContestMockCompany = require("../models/DailyContest/dailyContestMockCompany")
const DailyContestLiveCompany = require("../models/DailyContest/dailyContestLiveCompany")




const saveMissedData = async () => {

    const retreivedData = await RetreiveOrder.aggregate([
        {
            $match: {
                order_timestamp: {
                    $gte: new Date("2023-09-27"),
                    $lt: new Date("2023-09-28"),
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
            $project:
            {
                order_id: 1,
                average_price: 1,
                exchange: 1,
                exchange_order_id: 1,
                exchange_timestamp: 1,
                exchange_update_timestamp: 1,
                guid: 1,
                exchangeInstrumentToken: "$instrument_token",
                order_timestamp: 1,
                order_type: 1,
                placed_by: 1,
                price: 1,
                product: 1,
                quantity: 1,
                status: 1,
                transaction_type: 1,
                validity: 1,
                instrumentToken: "$instrumentData.instrument_token",
                symbol: "$instrumentData.tradingsymbol",
            },
        },
    ])

    for (let i = 0; i < retreivedData.length; i++) {
        let { order_id, average_price, exchange, exchange_order_id,
            exchange_timestamp, exchange_update_timestamp, guid,
            exchangeInstrumentToken, order_timestamp, order_type, placed_by,
            price, product, quantity, status, transaction_type, validity,
            instrumentToken, symbol
        } = retreivedData[i];

        console.log(order_timestamp)
        transaction_type = transaction_type.toUpperCase();

        let Quantity = quantity;
        let buyOrSell;

        let trader = "63987453e88caa645cc98e44";
        let algoId = "63987fca223c3fc074684edd";

        if (transaction_type === "BUY") {
            buyOrSell = "SELL";
        } else {
            buyOrSell = "BUY";
        }

        const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
        const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
        const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });

        const session = await mongoose.startSession();


        try {

            session.startTransaction();

            if (!exchange_timestamp) {
                exchange_timestamp = "null"
            }
            if (!exchange_order_id) {
                exchange_order_id = "null"
            }
            if (!average_price) {
                average_price = 0;
            }

            if (transaction_type == "SELL") {
                quantity = 0 - quantity;
            }
            if (buyOrSell == "SELL") {
                Quantity = 0 - Quantity;
            }

            order_type = "MARKET";

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

            let brokerageCompany = 0;
            let brokerageUser = 0;

            if (transaction_type === "BUY" && status == "COMPLETE") {
                brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price, brokerageDetailBuy[0]);
            } else if (transaction_type === "SELL" && status == "COMPLETE") {
                brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price, brokerageDetailSell[0]);
            }

            if (buyOrSell === "BUY" && status == "COMPLETE") {
                brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * average_price, brokerageDetailBuyUser[0]);
            } else if (buyOrSell === "SELL" && status == "COMPLETE") {
                brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * average_price, brokerageDetailSellUser[0]);
            }


            const companyDoc = {
                appOrderId: order_id.slice(6), order_id: order_id,
                disclosed_quantity: 0, price: 0, guid: `${exchange_order_id}${order_id.slice(6)}`,
                status, createdBy: trader, average_price, Quantity: quantity,
                Product: product, buyOrSell: transaction_type,
                variety: "regular", validity, exchange, order_type, symbol, placed_by,
                algoBox: algoId, instrumentToken, brokerage: brokerageCompany,
                trader: trader, isRealTrade: true, amount: (Number(quantity) * average_price), trade_time: order_timestamp,
                exchange_order_id: exchange_order_id, exchange_timestamp, isMissed: false,
                exchangeInstrumentToken
            }

            const traderDoc = {
                appOrderId: order_id.slice(6), order_id: order_id,
                disclosed_quantity: 0, price: 0, guid: `${exchange_order_id}${order_id.slice(6)}`,
                status, createdBy: trader, average_price, Quantity: Quantity,
                Product: product, buyOrSell: buyOrSell,
                variety: "regular", validity, exchange, order_type, symbol, placed_by,
                instrumentToken, brokerage: brokerageUser, trader: trader,
                isRealTrade: true, amount: (Number(Quantity) * average_price), trade_time: order_timestamp,
                exchange_order_id, exchange_timestamp, isMissed: false,
                exchangeInstrumentToken
            }

            const companyDocMock = {
                appOrderId: order_id.slice(6), order_id: order_id,
                status, average_price, Quantity: quantity,
                Product: product, buyOrSell: transaction_type, variety: "regular", validity, exchange, order_type: order_type,
                symbol, placed_by, algoBox: algoId,
                instrumentToken, brokerage: brokerageCompany, createdBy: trader,
                trader: trader, isRealTrade: false, amount: (Number(quantity) * average_price),
                trade_time: order_timestamp, exchangeInstrumentToken
            }

            const traderDocMock = {
                appOrderId: order_id.slice(6), order_id: order_id,
                status, average_price, Quantity: Quantity,
                Product: product, buyOrSell, exchangeInstrumentToken,
                variety: "regular", validity, exchange, order_type: order_type, symbol, placed_by,
                isRealTrade: false, instrumentToken, brokerage: brokerageUser,
                createdBy: trader, trader: trader, amount: (Number(Quantity) * average_price), trade_time: order_timestamp,
            }
            let isInsertedAllDB;
            try {

                // console.log(companyDoc, traderDoc, companyDocMock, traderDocMock);

                  const liveCompanyTrade = await InfinityLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
                  const algoTraderLive = await InfinityLiveTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });
                  const mockCompany = await InfinityMockCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDocMock }, { upsert: true, session });
                  const algoTrader = await InfinityMockTrader.updateOne({ order_id: order_id }, { $setOnInsert: traderDocMock }, { upsert: true, session });

                   isInsertedAllDB = (algoTrader.upsertedId && mockCompany.upsertedId && algoTraderLive.upsertedId && liveCompanyTrade.upsertedId)
                   console.log(algoTrader, liveCompanyTrade, algoTraderLive, mockCompany, order_timestamp)

            } catch (err) {
                console.log(err);
            }


            console.log(isInsertedAllDB)
              if (isInsertedAllDB) {
                console.log("in redisApproval")
                await session.commitTransaction();
              }else {
                throw new Error();
              }

        } catch (err) {

            await session.abortTransaction();
            console.error('Transaction failed, documents not saved:', err);

        } finally {
            session.endSession();
        }

    }
}

const saveDailyContestMissedData = async () => {

    const retreivedData = await RetreiveOrder.aggregate([
        {
            $match: {
                order_timestamp: {
                    $gte: new Date("2023-09-27"),
                    $lt: new Date("2023-09-28"),
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
            $project:
            {
                order_id: 1,
                average_price: 1,
                exchange: 1,
                exchange_order_id: 1,
                exchange_timestamp: 1,
                exchange_update_timestamp: 1,
                guid: 1,
                exchangeInstrumentToken: "$instrument_token",
                order_timestamp: 1,
                order_type: 1,
                placed_by: 1,
                price: 1,
                product: 1,
                quantity: 1,
                status: 1,
                transaction_type: 1,
                validity: 1,
                instrumentToken: "$instrumentData.instrument_token",
                symbol: "$instrumentData.tradingsymbol",
            },
        },
    ])

    for (let i = 0; i < retreivedData.length; i++) {
        let { order_id, average_price, exchange, exchange_order_id,
            exchange_timestamp, exchange_update_timestamp, guid,
            exchangeInstrumentToken, order_timestamp, order_type, placed_by,
            price, product, quantity, status, transaction_type, validity,
            instrumentToken, symbol
        } = retreivedData[i];

        console.log(order_timestamp)
        transaction_type = transaction_type.toUpperCase();

        let Quantity = quantity;
        let buyOrSell;

        let trader = "63971eec2ca5ce5b52f900b7";
        let algoId = "63987fca223c3fc074684edd";
        let contestId = '64e821eb32e8d9e7c2ffd13f';

        if (transaction_type === "BUY") {
            buyOrSell = "SELL";
        } else {
            buyOrSell = "BUY";
        }

        const brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: xtsAccountType });
        const brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: xtsAccountType });
        const brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        const brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });

        const session = await mongoose.startSession();


        try {

            session.startTransaction();

            if (!exchange_timestamp) {
                exchange_timestamp = "null"
            }
            if (!exchange_order_id) {
                exchange_order_id = "null"
            }
            if (!average_price) {
                average_price = 0;
            }

            if (transaction_type == "SELL") {
                quantity = 0 - quantity;
            }
            if (buyOrSell == "SELL") {
                Quantity = 0 - Quantity;
            }

            order_type = "MARKET";

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

            let brokerageCompany = 0;
            let brokerageUser = 0;

            if (transaction_type === "BUY" && status == "COMPLETE") {
                brokerageCompany = buyBrokerage(Math.abs(Number(quantity)) * average_price, brokerageDetailBuy[0]);
            } else if (transaction_type === "SELL" && status == "COMPLETE") {
                brokerageCompany = sellBrokerage(Math.abs(Number(quantity)) * average_price, brokerageDetailSell[0]);
            }

            if (buyOrSell === "BUY" && status == "COMPLETE") {
                brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * average_price, brokerageDetailBuyUser[0]);
            } else if (buyOrSell === "SELL" && status == "COMPLETE") {
                brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * average_price, brokerageDetailSellUser[0]);
            }


            const companyDoc = {
                appOrderId: order_id.slice(6), order_id: order_id,
                disclosed_quantity: 0, price: 0, guid: `${exchange_order_id}${order_id.slice(6)}`,
                status, createdBy: trader, average_price, Quantity: quantity,
                Product: product, buyOrSell: transaction_type, contestId: contestId,
                variety: "regular", validity, exchange, order_type, symbol, placed_by,
                algoBox: algoId, instrumentToken, brokerage: brokerageCompany,
                trader: trader, isRealTrade: true, amount: (Number(quantity) * average_price), trade_time: order_timestamp,
                exchange_order_id: exchange_order_id, exchange_timestamp, isMissed: false,
                exchangeInstrumentToken
            }

            const traderDoc = {
                appOrderId: order_id.slice(6), order_id: order_id,
                disclosed_quantity: 0, price: 0, guid: `${exchange_order_id}${order_id.slice(6)}`,
                status, createdBy: trader, average_price, Quantity: Quantity,
                Product: product, buyOrSell: buyOrSell, contestId: contestId,
                variety: "regular", validity, exchange, order_type, symbol, placed_by,
                instrumentToken, brokerage: brokerageUser, trader: trader,
                isRealTrade: true, amount: (Number(Quantity) * average_price), trade_time: order_timestamp,
                exchange_order_id, exchange_timestamp, isMissed: false,
                exchangeInstrumentToken
            }

            const companyDocMock = {
                appOrderId: order_id.slice(6), order_id: order_id,
                status, average_price, Quantity: quantity,
                Product: product, buyOrSell: transaction_type, variety: "regular", validity, exchange, order_type: order_type,
                symbol, placed_by, algoBox: algoId, contestId: contestId,
                instrumentToken, brokerage: brokerageCompany, createdBy: trader,
                trader: trader, isRealTrade: false, amount: (Number(quantity) * average_price),
                trade_time: order_timestamp, exchangeInstrumentToken
            }

            const traderDocMock = {
                appOrderId: order_id.slice(6), order_id: order_id,
                status, average_price, Quantity: Quantity, contestId: contestId,
                Product: product, buyOrSell, exchangeInstrumentToken,
                variety: "regular", validity, exchange, order_type: order_type, symbol, placed_by,
                isRealTrade: false, instrumentToken, brokerage: brokerageUser,
                createdBy: trader, trader: trader, amount: (Number(Quantity) * average_price), trade_time: order_timestamp,
            }
            let isInsertedAllDB;
            try {

                  const liveCompanyTrade = await DailyContestLiveCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDoc }, { upsert: true, session });
                  const algoTraderLive = await DailyContestLiveUser.updateOne({ order_id: order_id }, { $setOnInsert: traderDoc }, { upsert: true, session });
                  const mockCompany = await DailyContestMockCompany.updateOne({ order_id: order_id }, { $setOnInsert: companyDocMock }, { upsert: true, session });
                  const algoTrader = await DailyContestMockUser.updateOne({ order_id: order_id }, { $setOnInsert: traderDocMock }, { upsert: true, session });

                   isInsertedAllDB = (algoTrader.upsertedId && mockCompany.upsertedId && algoTraderLive.upsertedId && liveCompanyTrade.upsertedId)
                   console.log(algoTrader, liveCompanyTrade, algoTraderLive, mockCompany, order_timestamp)

            } catch (err) {
                console.log(err);
            }


            console.log(isInsertedAllDB)
              if (isInsertedAllDB) {
                console.log("in redisApproval")
                await session.commitTransaction();
              }else {
                throw new Error();
              }

        } catch (err) {

            await session.abortTransaction();
            console.error('Transaction failed, documents not saved:', err);

        } finally {
            session.endSession();
        }

    }
}


const saveRetreiveData = async (symbol, amount1, lot1, amount2, lot2, type, dateString, date) => {

    const tradable = await Tradable.findOne({tradingsymbol: symbol});

    let price = (amount2-amount1)/(lot2-lot1);
    let quantity = lot2-lot1;

    let Obj = {
        
        average_price: price,
        disclosed_quantity: 0,
        exchange: "NFO",
        exchange_order_id: `11000000${Math.floor(100000000 + Math.random() * 900000000)}`,
        exchange_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        exchange_update_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        guid: `2305${date}${Math.floor(100000000 + Math.random() * 900000000)}11000000${Math.floor(100000000 + Math.random() * 900000000)}`,
        instrument_token: tradable?.exchange_token,
        order_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        order_type: "Market",
        placed_by: "CF1",
        price: 0,
        product: "NRML",
        // quantity: lot2-lot1,
        status: "COMPLETE",
        status_message: "",
        transaction_type: type,
        validity: "DAY"
    }

    // console.log(obj);
    // const retreivedData = 


    const processOrder = async () => {
        if (quantity == 0) {
          return;
        } else if (quantity > 1800) {
          Obj.quantity = 1800;
          Obj.order_id = `2305${date}${Math.floor(100000000 + Math.random() * 900000000)}`;
          let data = await RetreiveOrder.create(Obj)
          console.log(data)
          quantity = quantity - 1800;
          return processOrder(); // Ensure that the promise returned by processOrder is returned
        } else {
          Obj.quantity = quantity;
          Obj.order_id = `2305${date}${Math.floor(100000000 + Math.random() * 900000000)}`;
          let data = await RetreiveOrder.create(Obj)
          console.log(data)
        }
      };

      await processOrder();







}

const saveNewRetreiveData = async (symbol, price, lot, type, dateString, date) => {

    const tradable = await Tradable.findOne({tradingsymbol: symbol});

    // let price = amount ;
    let quantity = lot ;

    let Obj = {
        
        average_price: price,
        disclosed_quantity: 0,
        exchange: "NFO",
        
        exchange_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        exchange_update_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        
        instrument_token: tradable?.exchange_token,
        order_timestamp: new Date(`${dateString}T13:41:08.000+00:00`),
        order_type: "Market",
        placed_by: "CF1",
        price: 0,
        product: "NRML",
        // quantity: lot2-lot1,
        status: "COMPLETE",
        status_message: "",
        transaction_type: type,
        validity: "DAY"
    }

    // console.log(obj);
    // const retreivedData = 


    const processOrder = async () => {
        if (quantity == 0) {
          return;
        } else if (quantity > 1800) {
          Obj.quantity = 1800;
          Obj.order_id = `2308${date}${Math.floor(100000000 + Math.random() * 900000000)}`;
          Obj.guid = `2308${date}${Math.floor(100000000 + Math.random() * 900000000)}11000000${Math.floor(100000000 + Math.random() * 900000000)}`;
          Obj.exchange_order_id = `11000000${Math.floor(100000000 + Math.random() * 900000000)}`;
          let data = await RetreiveOrder.create(Obj)
          console.log(data)
          quantity = quantity - 1800;
          return processOrder(); // Ensure that the promise returned by processOrder is returned
        } else {
          Obj.quantity = quantity;
          Obj.order_id = `2308${date}${Math.floor(100000000 + Math.random() * 900000000)}`;
          Obj.guid = `2308${date}${Math.floor(100000000 + Math.random() * 900000000)}11000000${Math.floor(100000000 + Math.random() * 900000000)}`;
          Obj.exchange_order_id = `11000000${Math.floor(100000000 + Math.random() * 900000000)}`;

          let data = await RetreiveOrder.create(Obj)
          console.log(data)
        }
      };

      await processOrder();

}


module.exports = { saveNewRetreiveData, saveMissedData, saveRetreiveData, saveDailyContestMissedData };
