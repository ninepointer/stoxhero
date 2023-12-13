let { client4, client2, client, getValue, clientForIORedis } = require("./marketData/redisClient");
const { Mutex } = require('async-mutex');
const BrokerageDetail = require("./models/Trading Account/brokerageSchema");
const { xtsAccountType, zerodhaAccountType } = require("./constant");
const Setting = require("./models/settings/setting");
const PendingOrder = require("./models/PendingOrder/pendingOrderSchema");
const { ObjectId } = require("mongodb");
const TenXTrader = require("./models/mock-trade/tenXTraderSchema");
const PaperTrade = require("./models/mock-trade/paperTrade");
const InternshipTrade = require("./models/mock-trade/internshipTrade");
const MarginXMockUser = require("./models/marginX/marginXUserMock");
// const BattleMockUser = require("./models/battle/battleTrade");
const DailyContestMockUser = require("./models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("./models/DailyContest/dailyContestMockCompany");
// const MarginXMockUser = require("./models/marginX/marginXUserMock");
const MarginXMockCompany = require("./models/marginX/marginXCompanyMock");
const { lastTradeDataMockMarginX, traderWiseMockPnlCompanyMarginX, overallMockPnlCompanyMarginX, overallpnlMarginX } = require("./services/adminRedis/Mock");
const { lastTradeDataMockDailyContest, traderWiseMockPnlCompanyDailyContest, overallMockPnlCompanyDailyContest, overallpnlDailyContest } = require("./services/adminRedis/Mock");

const { virtualTrader, internTrader, dailyContest, marginx, tenxTrader, battle } = require("./constant")
const getKiteCred = require('./marketData/getKiteCred');
const axios = require('axios');
const mongoose = require('mongoose')

const mutex = new Mutex();
const tenxTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser) => {
    return new Promise(async (resolve, reject) => {
        const isRedisConnected = getValue();
        let todayPnlData;
        let fundDetail;

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T23:59:59.999Z";
        const today = new Date(todayDate);
        const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
            exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
            createdBy, deviceDetails } = message.data;

        try {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)) {
                todayPnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)
                todayPnlData = JSON.parse(todayPnlData);
            }

            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginTenx`)) {
                fundDetail = await client.get(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginTenx`)
                fundDetail = JSON.parse(fundDetail);
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }


        const kiteData = await getKiteCred.getAccess();
        const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
        const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
        const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, tenxTrader);
        const caseNumber = (await marginAndCase).caseNumber;
        const margin = (await marginAndCase).margin;
        const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

        switch (caseNumber) {
            case 0:
                await marginZeroCase(message.data, availableMargin, tenxTrader, kiteData)
                break;
            case 1:
                await marginFirstCase(message.data, availableMargin, margin, tenxTrader, kiteData)
                break;
            case 2:
                await marginSecondCase(message.data, margin, runningLotForSymbol)
                break;
            case 3:
                await marginThirdCase(message.data, netPnl)
                break;
            case 4:
                await marginFourthCase(message.data, availableMargin, runningLotForSymbol, tenxTrader, kiteData)
                break;
        }

        let last_price = message.ltp;

        let brokerageUser;
        let trade_time_zerodha = new Date();
        order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        // Add 5 hours and 30 minutes
        trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
        trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

        if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
        } else if (buyOrSell === "SELL") {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "SELL") {
            Quantity = "-" + Quantity;
        }

        const tradeDoc = new TenXTrader({
            status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, subscriptionId: sub_product_id, exchangeInstrumentToken,
            createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
            deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
            margin: message.data.margin
        });

        tradeDoc.save().then(async () => {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)) {
                let pnl = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)
                pnl = JSON.parse(pnl);
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === tradeDoc.instrumentToken && element._id.product === tradeDoc.Product && !element._id.isLimit));
                // if instrument is same then just updating value
                if (matchingElement) {
                    // Update the values of the matching element with the values of the first document
                    matchingElement.amount += (tradeDoc.amount * -1);
                    matchingElement.brokerage += Number(tradeDoc.brokerage);
                    matchingElement.lastaverageprice = tradeDoc.average_price;
                    matchingElement.lots += Number(tradeDoc.Quantity);
                    matchingElement.margin = message.data.margin;

                } else {
                    console.log("in else saving data");
                    // Create a new element if instrument is not matching
                    pnl.push({
                        _id: {
                            symbol: tradeDoc.symbol,
                            product: tradeDoc.Product,
                            instrumentToken: tradeDoc.instrumentToken,
                            exchangeInstrumentToken: tradeDoc.exchangeInstrumentToken,
                            exchange: tradeDoc.exchange,
                            validity: tradeDoc.validity,
                            variety: tradeDoc.variety,                
                        },
                        amount: (tradeDoc.amount * -1),
                        brokerage: Number(tradeDoc.brokerage),
                        lots: Number(tradeDoc.Quantity),
                        lastaverageprice: tradeDoc.average_price,
                        margin: message.data.margin
                    });
                }

                const data = await client.set(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl));
                console.log(data)

            }

            if (isRedisConnected) {
                await client.expire(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`, secondsRemaining);
            }

            resolve();
        }).catch((err) => {
            reject(err);
            console.log("in err", err)
        });
    });
}

const paperTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser) => {
    return new Promise(async (resolve, reject) => {
        const isRedisConnected = getValue();
        let todayPnlData;
        let fundDetail;

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T23:59:59.999Z";
        const today = new Date(todayDate);
        const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
            exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
            createdBy, deviceDetails } = message.data;

        try {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}: overallpnlPaperTrade`)) {
                todayPnlData = await client.get(`${createdBy.toString()}: overallpnlPaperTrade`)
                todayPnlData = JSON.parse(todayPnlData);
            }

            if (isRedisConnected && await client.exists(`${createdBy.toString()} openingBalanceAndMarginPaper`)) {
                fundDetail = await client.get(`${createdBy.toString()} openingBalanceAndMarginPaper`)
                fundDetail = JSON.parse(fundDetail);
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }


        const kiteData = await getKiteCred.getAccess();
        const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
        const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
        const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, virtualTrader);
        const caseNumber = (await marginAndCase).caseNumber;
        const margin = (await marginAndCase).margin;
        const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

        switch (caseNumber) {
            case 0:
                await marginZeroCase(message.data, availableMargin, virtualTrader, kiteData)
                break;
            case 1:
                await marginFirstCase(message.data, availableMargin, margin, virtualTrader, kiteData)
                break;
            case 2:
                await marginSecondCase(message.data, margin, runningLotForSymbol)
                break;
            case 3:
                await marginThirdCase(message.data, netPnl)
                break;
            case 4:
                await marginFourthCase(message.data, availableMargin, runningLotForSymbol, virtualTrader, kiteData)
                break;
        }

        let last_price = message.ltp;

        let brokerageUser;
        let trade_time_zerodha = new Date();
        order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        // Add 5 hours and 30 minutes
        trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
        trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

        if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
        } else if (buyOrSell === "SELL") {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "SELL") {
            Quantity = "-" + Quantity;
        }

        const tradeDoc = new PaperTrade({
            status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId: sub_product_id, exchangeInstrumentToken,
            createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
            margin: message.data.margin, deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
        });

        tradeDoc.save().then(async () => {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}: overallpnlPaperTrade`)) {
                let pnl = await client.get(`${createdBy.toString()}: overallpnlPaperTrade`)
                pnl = JSON.parse(pnl);
                // console.log("pnl", pnl);
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === tradeDoc.instrumentToken && element._id.product === tradeDoc.Product && !element._id.isLimit));
                // console.log("matchingElement", matchingElement);
                // if instrument is same then just updating value
                if (matchingElement) {
                    // Update the values of the matching element with the values of the first document
                    matchingElement.amount += (tradeDoc.amount * -1);
                    matchingElement.brokerage += Number(tradeDoc.brokerage);
                    matchingElement.lastaverageprice = tradeDoc.average_price;
                    matchingElement.lots += Number(tradeDoc.Quantity);
                    matchingElement.margin = message.data.margin;

                } else {
                    // Create a new element if instrument is not matching
                    pnl.push({
                        _id: {
                            symbol: tradeDoc.symbol,
                            product: tradeDoc.Product,
                            instrumentToken: tradeDoc.instrumentToken,
                            exchangeInstrumentToken: tradeDoc.exchangeInstrumentToken,
                            exchange: tradeDoc.exchange,
                            validity: tradeDoc.validity,
                            variety: tradeDoc.variety,                

                        },
                        amount: (tradeDoc.amount * -1),
                        brokerage: Number(tradeDoc.brokerage),
                        lots: Number(tradeDoc.Quantity),
                        lastaverageprice: tradeDoc.average_price,
                        margin: message.data.margin
                    });
                }

                // console.log("jha pe issue hai", pnl)
                const data = await client.set(`${createdBy.toString()}: overallpnlPaperTrade`, JSON.stringify(pnl));

            }

            if (isRedisConnected) {
                await client.expire(`${createdBy.toString()}: overallpnlPaperTrade`, secondsRemaining);
            }

            resolve();
        }).catch((err) => {
            reject(err);
            console.log("in err", err)
        });
    });
}

const internTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser) => {
    return new Promise(async (resolve, reject) => {
        const isRedisConnected = getValue();
        let todayPnlData;
        let fundDetail;

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T23:59:59.999Z";
        const today = new Date(todayDate);
        const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
            exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
            createdBy, _id, type, product_type, from, deviceDetails } = message.data;

        try {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`)) {
                todayPnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`)
                todayPnlData = JSON.parse(todayPnlData);
            }

            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginInternship`)) {
                fundDetail = await client.get(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginInternship`)
                fundDetail = JSON.parse(fundDetail);
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }


        const kiteData = await getKiteCred.getAccess();
        const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
        const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
        const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, tenxTrader);
        const caseNumber = (await marginAndCase).caseNumber;
        const margin = (await marginAndCase).margin;
        const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

        switch (caseNumber) {
            case 0:
                await marginZeroCase(message.data, availableMargin, tenxTrader, kiteData)
                break;
            case 1:
                await marginFirstCase(message.data, availableMargin, margin, tenxTrader, kiteData)
                break;
            case 2:
                await marginSecondCase(message.data, margin, runningLotForSymbol)
                break;
            case 3:
                await marginThirdCase(message.data, netPnl)
                break;
            case 4:
                await marginFourthCase(message.data, availableMargin, runningLotForSymbol, internTrader, kiteData)
                break;
        }

        let last_price = message.ltp;

        let brokerageUser;
        let trade_time_zerodha = new Date();
        order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        // Add 5 hours and 30 minutes
        trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
        trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

        if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
        } else if (buyOrSell === "SELL") {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "SELL") {
            Quantity = "-" + Quantity;
        }

        const tradeDoc = new InternshipTrade({
            status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, batch: sub_product_id, exchangeInstrumentToken,
            createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
            deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
            margin: message.data.margin
        });

        tradeDoc.save().then(async () => {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`)) {
                let pnl = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`)
                pnl = JSON.parse(pnl);
                // console.log("pnl", pnl);
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === tradeDoc.instrumentToken && element._id.product === tradeDoc.Product && !element._id.isLimit));
                // console.log("matchingElement", matchingElement);
                // if instrument is same then just updating value
                if (matchingElement) {
                    // Update the values of the matching element with the values of the first document
                    matchingElement.amount += (tradeDoc.amount * -1);
                    matchingElement.brokerage += Number(tradeDoc.brokerage);
                    matchingElement.lastaverageprice = tradeDoc.average_price;
                    matchingElement.lots += Number(tradeDoc.Quantity);
                    matchingElement.margin = message.data.margin;

                } else {
                    // console.log("in else saving data");
                    // Create a new element if instrument is not matching
                    pnl.push({
                        _id: {
                            symbol: tradeDoc.symbol,
                            product: tradeDoc.Product,
                            instrumentToken: tradeDoc.instrumentToken,
                            exchangeInstrumentToken: tradeDoc.exchangeInstrumentToken,
                            exchange: tradeDoc.exchange,
                            validity: tradeDoc.validity,
                            variety: tradeDoc.variety,                

                        },
                        amount: (tradeDoc.amount * -1),
                        brokerage: Number(tradeDoc.brokerage),
                        lots: Number(tradeDoc.Quantity),
                        lastaverageprice: tradeDoc.average_price,
                        margin: message.data.margin
                    });
                }

                const data = await client.set(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`, JSON.stringify(pnl));

            }

            if (isRedisConnected) {
                await client.expire(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlIntern`, secondsRemaining);
            }
            resolve();
        }).catch((err) => {
            reject(err);
            console.log("in err", err)
        });
    });
}

const dailyContestTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser, brokerageDetailBuy, brokerageDetailSell) => {
    return new Promise(async (resolve, reject) => {
        const isRedisConnected = getValue();
        let todayPnlData;
        let fundDetail;

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T23:59:59.999Z";
        const today = new Date(todayDate);
        const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
            exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
            createdBy, deviceDetails } = message.data;

        try {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`)) {
                todayPnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`)
                todayPnlData = JSON.parse(todayPnlData);
            }

            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginDailyContest`)) {
                fundDetail = await client.get(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginDailyContest`)
                fundDetail = JSON.parse(fundDetail);
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }


        const kiteData = await getKiteCred.getAccess();
        const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
        const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
        const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, dailyContest);
        const caseNumber = (await marginAndCase).caseNumber;
        const margin = (await marginAndCase).margin;
        const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

        switch (caseNumber) {
            case 0:
                await marginZeroCase(message.data, availableMargin, dailyContest, kiteData)
                break;
            case 1:
                await marginFirstCase(message.data, availableMargin, margin, dailyContest, kiteData)
                break;
            case 2:
                await marginSecondCase(message.data, margin, runningLotForSymbol)
                break;
            case 3:
                await marginThirdCase(message.data, netPnl)
                break;
            case 4:
                await marginFourthCase(message.data, availableMargin, runningLotForSymbol, dailyContest, kiteData)
                break;
        }

        let last_price = message.ltp;

        let brokerageUser;
        let brokerageCompany;
        let realBuyOrSell;
        let realQuantity;

        let trade_time_zerodha = new Date();
        order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        // Add 5 hours and 30 minutes
        trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
        trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

        if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
        } else if (buyOrSell === "SELL") {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "BUY") {
            realBuyOrSell = "SELL";
            realQuantity = "-" + Quantity;
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
            brokerageCompany = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        } else if (buyOrSell === "SELL") {
            realBuyOrSell = "BUY";
            realQuantity = Quantity;
            brokerageCompany = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "SELL") {
            Quantity = "-" + Quantity;
        }



        const session = await mongoose.startSession();

        try {

            // const mockCompany = await DailyContestMockCompany.findOne({order_id : order_id});
            // const mockInfintyTrader = await DailyContestMockUser.findOne({order_id : order_id});
            // if((mockCompany || mockInfintyTrader)){
            //     // return res.status(422).json({status: "error", message : "something went wrong."})
            // }


            session.startTransaction();

            const companyDoc = {
                status: "COMPLETE", average_price: last_price, Quantity: realQuantity,
                Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type,
                symbol: symbol, placed_by: "stoxhero", algoBox: "63987fca223c3fc074684edd", order_id,
                instrumentToken: instrumentToken, brokerage: brokerageCompany, createdBy: "63ecbc570302e7cf0153370c",
                trader: createdBy, amount: (Number(realQuantity) * last_price),
                trade_time: trade_time_zerodha, exchangeInstrumentToken, contestId: sub_product_id, deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType }
            }

            const traderDoc = {
                status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", contestId: sub_product_id,
                order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
                createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
                deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
                margin: message.data.margin
            }

            const mockTradeDetails =  await DailyContestMockCompany.create([companyDoc], { session });
            const algoTrader =  await DailyContestMockUser.create([traderDoc], { session });

            const pipeline = clientForIORedis.pipeline();

            await pipeline.get(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`)
            await pipeline.get(`overallMockPnlCompanyDailyContest`)
            await pipeline.get(`traderWiseMockPnlCompanyDailyContest`)

            const results = await pipeline.exec();

            const traderOverallPnl = results[0][1];
            const companyOverallPnl = results[1][1];
            const traderWisePnl = results[2][1];

            const overallPnlUser = await overallpnlDailyContest(traderDoc, createdBy, traderOverallPnl, sub_product_id, true);
            const redisValueOverall = await overallMockPnlCompanyDailyContest(companyDoc, companyOverallPnl, sub_product_id);
            const redisValueTrader = await traderWiseMockPnlCompanyDailyContest(companyDoc, traderWisePnl, sub_product_id);
            const lastTradeMock = await lastTradeDataMockDailyContest(companyDoc, sub_product_id);

            const pipelineForSet = clientForIORedis.pipeline();

            await pipelineForSet.set(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`, overallPnlUser);
            await pipelineForSet.set(`overallMockPnlCompanyDailyContest`, redisValueOverall);
            await pipelineForSet.set(`traderWiseMockPnlCompanyDailyContest`, redisValueTrader);
            await pipelineForSet.set(`lastTradeDataMockDailyContest`, lastTradeMock);

            await pipelineForSet.exec();

            if (isRedisConnected) {

                const pipeline = clientForIORedis.pipeline();

                pipeline.expire(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`, secondsRemaining);
                pipeline.expire(`overallMockPnlCompanyDailyContest`, secondsRemaining);
                pipeline.expire(`traderWiseMockPnlCompanyDailyContest`, secondsRemaining);
                pipeline.expire(`lastTradeDataMockDailyContest`, secondsRemaining);

                await pipeline.exec();
            }

            // Commit the transaction
            // io?.emit("updatePnl", mockTradeDetails)

            // if(fromAdmin){
            //     io?.emit(`${createdBy.toString()}autoCut`, algoTrader)
            // }


            if (pipelineForSet._result[0][1] === "OK" && pipelineForSet._result[1][1] === "OK" && pipelineForSet._result[2][1] === "OK" && pipelineForSet._result[3][1] === "OK") {
                await session.commitTransaction();
                // return res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
            } else {
                // await session.commitTransaction();
                throw new Error();
            }

            resolve();
        } catch (err) {
            console.log(err);
            const pipeline = clientForIORedis.pipeline();
            await pipeline.del(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`);
            await pipeline.del(`traderWiseMockPnlCompanyDailyContest`);
            await pipeline.del(`overallMockPnlCompanyDailyContest`);
            await pipeline.del(`lastTradeDataMockDailyContest`);
            const results = await pipeline.exec();
            await session.abortTransaction();
            console.error('Transaction failed, documents not saved:', err);
            reject(err);
            // res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
        } finally {
            // End the session
            session.endSession();
        }
    });

}

const marginxTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser, brokerageDetailBuy, brokerageDetailSell) => {
    return new Promise(async (resolve, reject) => {
        const isRedisConnected = getValue();
        let todayPnlData;
        let fundDetail;

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T23:59:59.999Z";
        const today = new Date(todayDate);
        const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
            exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
            createdBy, deviceDetails } = message.data;

        try {
            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} overallpnlMarginX`)) {
                todayPnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()} overallpnlMarginX`)
                todayPnlData = JSON.parse(todayPnlData);
            }

            if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginMarginx`)) {
                fundDetail = await client.get(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginMarginx`)
                fundDetail = JSON.parse(fundDetail);
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }



        const kiteData = await getKiteCred.getAccess();
        const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
        const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
        const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, marginx);
        const caseNumber = (await marginAndCase).caseNumber;
        const margin = (await marginAndCase).margin;
        const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

        switch (caseNumber) {
            case 0:
                await marginZeroCase(message.data, availableMargin, marginx, kiteData)
                break;
            case 1:
                await marginFirstCase(message.data, availableMargin, margin, marginx, kiteData)
                break;
            case 2:
                await marginSecondCase(message.data, margin, runningLotForSymbol)
                break;
            case 3:
                await marginThirdCase(message.data, netPnl)
                break;
            case 4:
                await marginFourthCase(message.data, availableMargin, runningLotForSymbol, marginx, kiteData)
                break;
        }

        let last_price = message.ltp;

        let brokerageUser;
        let brokerageCompany;
        let realBuyOrSell;
        let realQuantity;

        let trade_time_zerodha = new Date();
        order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

        // Add 5 hours and 30 minutes
        trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
        trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

        if (buyOrSell === "BUY") {
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
        } else if (buyOrSell === "SELL") {
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "BUY") {
            realBuyOrSell = "SELL";
            realQuantity = "-" + Quantity;
            brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
            brokerageCompany = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        } else if (buyOrSell === "SELL") {
            realBuyOrSell = "BUY";
            realQuantity = Quantity;
            brokerageCompany = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
            brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
        }

        if (buyOrSell === "SELL") {
            Quantity = "-" + Quantity;
        }



        const session = await mongoose.startSession();

        try {

            // const mockCompany = await DailyContestMockCompany.findOne({order_id : order_id});
            // const mockInfintyTrader = await DailyContestMockUser.findOne({order_id : order_id});
            // if((mockCompany || mockInfintyTrader)){
            //     // return res.status(422).json({status: "error", message : "something went wrong."})
            // }


            session.startTransaction();

            const companyDoc = {
                status: "COMPLETE", average_price: last_price, Quantity: realQuantity,
                Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type,
                symbol: symbol, placed_by: "stoxhero", algoBox: "63987fca223c3fc074684edd", order_id,
                instrumentToken: instrumentToken, brokerage: brokerageCompany, createdBy: "63ecbc570302e7cf0153370c",
                trader: createdBy, amount: (Number(realQuantity) * last_price),
                trade_time: trade_time_zerodha, exchangeInstrumentToken, marginxId: sub_product_id, deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType }
            }

            const traderDoc = {
                status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", marginxId: sub_product_id,
                order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
                createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
                deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
                margin: message.data.margin
            }

            const mockTradeDetails =  await MarginXMockCompany.create([companyDoc], { session });
            const algoTrader =  await MarginXMockUser.create([traderDoc], { session });

            const pipeline = clientForIORedis.pipeline();

            await pipeline.get(`${createdBy.toString()}${sub_product_id.toString()} overallpnlMarginX`)
            await pipeline.get(`overallMockPnlCompanyMarginX`)
            await pipeline.get(`traderWiseMockPnlCompanyMarginX`)

            const results = await pipeline.exec();

            const traderOverallPnl = results[0][1];
            const companyOverallPnl = results[1][1];
            const traderWisePnl = results[2][1];

            const overallPnlUser = await overallpnlMarginX(traderDoc, createdBy, traderOverallPnl, sub_product_id, true);
            const redisValueOverall = await overallMockPnlCompanyMarginX(companyDoc, companyOverallPnl, sub_product_id);
            const redisValueTrader = await traderWiseMockPnlCompanyMarginX(companyDoc, traderWisePnl, sub_product_id);
            const lastTradeMock = await lastTradeDataMockMarginX(companyDoc, sub_product_id);

            const pipelineForSet = clientForIORedis.pipeline();

            await pipelineForSet.set(`${createdBy.toString()}${sub_product_id.toString()} overallpnlMarginX`, overallPnlUser);
            await pipelineForSet.set(`overallMockPnlCompanyMarginX`, redisValueOverall);
            await pipelineForSet.set(`traderWiseMockPnlCompanyMarginX`, redisValueTrader);
            await pipelineForSet.set(`lastTradeDataMockMarginX`, lastTradeMock);

            await pipelineForSet.exec();

            if (isRedisConnected) {

                const pipeline = clientForIORedis.pipeline();

                pipeline.expire(`${createdBy.toString()}${sub_product_id.toString()} overallpnlMarginX`, secondsRemaining);
                pipeline.expire(`overallMockPnlCompanyMarginX`, secondsRemaining);
                pipeline.expire(`traderWiseMockPnlCompanyMarginX`, secondsRemaining);
                pipeline.expire(`lastTradeDataMockMarginX`, secondsRemaining);

                await pipeline.exec();
            }

            // Commit the transaction
            // io?.emit("updatePnl", mockTradeDetails)

            // if(fromAdmin){
            //     io?.emit(`${createdBy.toString()}autoCut`, algoTrader)
            // }


            if (pipelineForSet._result[0][1] === "OK" && pipelineForSet._result[1][1] === "OK" && pipelineForSet._result[2][1] === "OK" && pipelineForSet._result[3][1] === "OK") {
                await session.commitTransaction();
                // return res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
            } else {
                // await session.commitTransaction();
                throw new Error();
            }

            resolve();

        } catch (err) {
            console.log(err);
            const pipeline = clientForIORedis.pipeline();
            await pipeline.del(`${createdBy.toString()}${sub_product_id.toString()} overallpnlDailyContest`);
            await pipeline.del(`traderWiseMockPnlCompanyDailyContest`);
            await pipeline.del(`overallMockPnlCompanyDailyContest`);
            await pipeline.del(`lastTradeDataMockDailyContest`);
            const results = await pipeline.exec();
            await session.abortTransaction();
            reject(err);
            console.error('Transaction failed, documents not saved:', err);
            // res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
        } finally {
            // End the session
            session.endSession();
        }
    });

}

exports.pendingOrderMain = async () => {
    await client2.connect();
    await client4.connect();


    const setting = await getSetting();
    let accountType;
    if (setting.ltp == xtsAccountType || setting.complete == xtsAccountType) {
        accountType = xtsAccountType;
    } else {
        accountType = zerodhaAccountType;
    }

    let isRedisConnected = getValue();
    let brokerageDetailBuy = await buyBrokerageCompany(accountType, isRedisConnected);
    let brokerageDetailSell = await sellBrokerageCompany(accountType, isRedisConnected);
    let brokerageDetailBuyUser = await buyBrokerageUser(zerodhaAccountType, isRedisConnected);
    let brokerageDetailSellUser = await sellBrokerageUser(zerodhaAccountType, isRedisConnected);

    try {

        await client2.SUBSCRIBE("place-order", async (message) => {
            message = JSON.parse(message);


            let { exchange, symbol, buyOrSell, Quantity, sub_product_id, instrumentToken,
                createdBy, _id, type, product_type, from } = message.data;

            let index = message.index;
            let last_price = message.ltp;

            const lockKey = `${createdBy}-${symbol}-${Quantity}-${_id}`
            const lockValue = Date.now().toString() + Math.random * 1000;
            const release = await mutex.acquire();

            try {
                // Try to acquire the lock
                const lockExpiration = 20;

                const lockAcquired = await acquireLock(lockKey, lockValue, lockExpiration);

                if (!lockAcquired) {
                    // console.log('Another process is already saving data.');
                    return;
                }


                let pnlData;
                if (product_type?.toString() === "6517d3803aeb2bb27d650de0") {
                    await tenxTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser);
                    pnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlTenXTrader`)
                } else if (product_type?.toString() === "6517d40e3aeb2bb27d650de1") {
                    await marginxTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser, brokerageDetailBuy, brokerageDetailSell);
                    pnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlMarginX`)
                } else if (product_type?.toString() === "6517d48d3aeb2bb27d650de5") {
                    await dailyContestTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser, brokerageDetailBuy, brokerageDetailSell);
                    pnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlDailyContest`)
                } else if (product_type?.toString() === "6517d46e3aeb2bb27d650de3") {
                    await internTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser);
                    pnlData = await client.get(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlIntern`)
                } else if (product_type?.toString() === "65449ee06932ba3a403a681a") {
                    await paperTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser);
                    pnlData = await client.get(`${createdBy?.toString()}: overallpnlPaperTrade`)
                }



                data = await client.get('stoploss-stopprofit');
                data = JSON.parse(data);
                let index2;
                let symbolArr = data[`${instrumentToken}`];
                // console.log("first index2", index2)
                for (let i = 0; i < symbolArr.length; i++) {

                    if (symbolArr[i]?.instrumentToken === instrumentToken &&
                        symbolArr[i]?.createdBy.toString() === createdBy.toString() &&
                        Math.abs(symbolArr[i]?.Quantity) === Math.abs(Number(Quantity)) &&
                        symbolArr[i]?.buyOrSell === buyOrSell &&
                        symbolArr[i]?.type !== type) {

                        const update = await PendingOrder.findOne({ _id: new ObjectId(symbolArr[i]?._id) })
                        update.status = "Cancelled";
                        update.execution_price = 0;
                        update.execution_time = new Date();
                        await update.save();
                        // console.log("in if index2", index2)
                        index2 = i;
                        break;
                    }
                }

                // console.log("value of index2", index2, index)
                if (index2 !== undefined) {
                    // console.log("value of in if index2", index2)
                    symbolArr.splice(Math.max(index2, index), 1, {});
                    symbolArr.splice(Math.min(index2, index), 1, {});
                } else {
                    // symbolArr.splice(index, 1);
                    symbolArr.splice(index, 1, {});
                }

                const update = await PendingOrder.updateOne({ _id: new ObjectId(_id) }, {
                    $set: {
                        status: "Executed",
                        execution_time: new Date(),
                        execution_price: last_price
                    }
                })


                // console.log(pnlData)
                pnlData = JSON.parse(pnlData)
                for (let elem of pnlData) {
                    // console.log("pnl dtata", elem, pnlData)
                    const buyOrSellPnl = elem.lots > 0 ? "BUY" : "SELL";
                    if (elem._id.symbol === symbol && elem._id.isLimit && buyOrSellPnl === buyOrSell) {
                        if (Math.abs(elem.lots) > Math.abs(Quantity)) {
                            elem.margin = elem.margin - (elem.margin * Math.abs(Quantity) / Math.abs(elem.lots));
                            elem.lots = Math.abs(elem.lots) - Math.abs(Quantity)
                            elem.lots = buyOrSellPnl === "SELL" ? -elem.lots : elem.lots;
                            // console.log("if elem", elem);
                            break;
                        } else if (Math.abs(elem.lots) === Math.abs(Quantity)) {
                            elem.margin = 0;
                            elem.lots = Math.abs(elem.lots) - Math.abs(Quantity)
                            // console.log("else elem", elem);
                            break;
                        }
                    }
                }


                // console.log("pnlData", pnlData)
                if (product_type?.toString() === "6517d3803aeb2bb27d650de0") {
                    await client.set(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData))
                } else if (product_type?.toString() === "6517d40e3aeb2bb27d650de1") {
                    await client.set(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlMarginX`, JSON.stringify(pnlData))
                } else if (product_type?.toString() === "6517d48d3aeb2bb27d650de5") {
                    await client.set(`${createdBy?.toString()}${sub_product_id?.toString()} overallpnlDailyContest`, JSON.stringify(pnlData))
                } else if (product_type?.toString() === "6517d46e3aeb2bb27d650de3") {
                    await client.set(`${createdBy?.toString()}${sub_product_id?.toString()}: overallpnlIntern`, JSON.stringify(pnlData))
                } else if (product_type?.toString() === "65449ee06932ba3a403a681a") {
                    await client.set(`${createdBy?.toString()}: overallpnlPaperTrade`, JSON.stringify(pnlData))
                }

                // console.log("symbolArr", symbolArr)
                data[`${instrumentToken}`] = symbolArr;
                const myDAta = await client.set('stoploss-stopprofit', JSON.stringify(data));
                await client4.PUBLISH("order-notification", JSON.stringify({ symbol: symbol, createdBy: createdBy, Quantity: Quantity, execution_price: last_price, type: type }))


            } catch (error) {
                console.error('Error saving data:', error);
            } finally {
                // Release the lock
                release();
                // await releaseLock(lockKey, lockValue);
            }

        });

    } catch (err) {
        console.log(err)
    }
}

async function acquireLock(lockKey, lockValue, expiration) {
    const result = await clientForIORedis.set(lockKey, lockValue, 'NX', 'EX', expiration);
    return result === 'OK';
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

async function getSetting() {
    const setting = await Setting.find().select('toggle');
    return setting;
}

async function buyBrokerageCompany(accountType, isRedisConnected) {
    let brokerageDetailBuy;
    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)) {
        brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
        brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
    } else {
        brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: accountType });
        await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
    }

    return brokerageDetailBuy;
}

async function sellBrokerageCompany(accountType, isRedisConnected) {
    let brokerageDetailSell;
    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)) {
        brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
        brokerageDetailSell = JSON.parse(brokerageDetailSell);
    } else {
        brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: accountType });
        await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
    }

    return brokerageDetailSell;
}

async function sellBrokerageUser(zerodhaAccountType, isRedisConnected) {
    let brokerageDetailSellUser;
    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-user`)) {
        brokerageDetailSellUser = await client.HGET('brokerage', `sell-user`);
        brokerageDetailSellUser = JSON.parse(brokerageDetailSellUser);
    } else {
        brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `sell-user`, JSON.stringify(brokerageDetailSellUser));
    }

    return brokerageDetailSellUser;
}

async function buyBrokerageUser(zerodhaAccountType, isRedisConnected) {
    let brokerageDetailBuyUser;
    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)) {
        brokerageDetailBuyUser = await client.HGET('brokerage', `buy-user`);
        brokerageDetailBuyUser = JSON.parse(brokerageDetailBuyUser);
    } else {
        brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `buy-user`, JSON.stringify(brokerageDetailBuyUser));
    }

    return brokerageDetailBuyUser;
}

const getLastTradeMarginAndCaseNumber = async (data, pnlData, from) => {
    const mySymbol = pnlData.filter((elem) => {
        return elem?._id?.symbol === data.symbol && !elem?._id?.isLimit;
    })

    const runningLotForSymbol = mySymbol[0]?.lots;
    const transactionTypeForSymbol = mySymbol[0]?.lots >= 0 ? "BUY" : mySymbol[0]?.lots < 0 && "SELL";
    const quantity = data.Quantity;
    const transaction_type = data.buyOrSell;
    const symbol = mySymbol[0]?.symbol;
    let margin = 0;
    let caseNumber = 0;


    const DataBase = from === virtualTrader ? PaperTrade :
        from === internTrader ? InternshipTrade :
            from === dailyContest ? DailyContestMockUser :
                from === marginx ? MarginXMockUser :
                    from === tenxTrader && TenXTrader;


    if (pnlData?.length > 0) {
        margin = mySymbol[0]?.margin;
    } else {
        const lastTradeData = await DataBase.findOne({ symbol: symbol, trader: new ObjectId(data.createdBy), trade_time: { $gte: new Date() } })
            .sort({ _id: -1 })
            .limit(1)
        margin = lastTradeData && lastTradeData.margin;
    }

    if (Math.abs(runningLotForSymbol) > Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
        // if squaring of some quantity
        caseNumber = 2;
    } else if (Math.abs(runningLotForSymbol) < Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
        // if squaring of all quantity and adding more in reverse direction (square off more quantity)
        caseNumber = 4;
    } else if (Math.abs(runningLotForSymbol) === Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
        // if squaring off all quantity
        caseNumber = 3;
    } else if (transactionTypeForSymbol === transaction_type) {
        // if adding more quantity
        caseNumber = 1;
    } else {
        caseNumber = 0;
    }

    return { margin: margin, caseNumber: caseNumber, runningLotForSymbol: runningLotForSymbol }
}

const calculateNetPnl = async (tradeData, pnlData, data) => {
    let addUrl = 'i=' + tradeData.exchange + ':' + tradeData.symbol;
    pnlData.forEach((elem, index) => {
        addUrl += ('&i=' + elem._id.exchange + ':' + elem._id.symbol);
    });

    let url = `https://api.kite.trade/quote/ltp?${addUrl}`;
    const api_key = data.getApiKey;
    const access_token = data.getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };

    const arr = [];
    try {
        const response = await axios.get(url, authOptions);

        for (let instrument in response.data.data) {
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            arr.push(obj);
        }

        let totalNetPnl = 0
        let totalBrokerage = 0
        let totalGrossPnl = 0


        const ltp = arr.filter((subelem) => {
            return subelem?.instrument_token == tradeData?.instrumentToken;
        })

        tradeData.last_price = ltp[0]?.last_price;


        for (let elem of pnlData) {
            let grossPnl = (elem?.amount + (elem?.lots) * ltp[0]?.last_price);
            totalGrossPnl += grossPnl;
            totalBrokerage += Number(elem?.brokerage);
        }

        totalNetPnl = totalGrossPnl - totalBrokerage;

        return totalNetPnl;
    } catch (err) {
        console.log(err)
    }
}

const marginZeroCase = async (tradeData, availableMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(tradeData, tradeData.Quantity, data);

    if ((availableMargin - requiredMargin) > 0) {
        tradeData.margin = requiredMargin;
        return;
    } else {
        // await takeRejectedTrade(req, res, from);
    }
}

const marginFirstCase = async (tradeData, availableMargin, prevMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(tradeData, tradeData.Quantity, data);

    if ((availableMargin - requiredMargin) > 0) {
        tradeData.margin = requiredMargin + prevMargin;
        return;
    } else {
        // await takeRejectedTrade(req, res, from);
    }
}

const marginSecondCase = async (tradeData, prevMargin, prevQuantity) => {
    const quantityPer = Math.abs(tradeData.Quantity) * 100 / Math.abs(prevQuantity);
    const marginReleased = prevMargin * quantityPer / 100;
    tradeData.margin = prevMargin - marginReleased;

    return;
}

const marginThirdCase = async (tradeData, netPnl) => {

    tradeData.margin = 0;

    return;
}

const marginFourthCase = async (tradeData, availableMargin, prevQuantity, from, data) => {
    const quantityForTrade = Math.abs(Math.abs(tradeData.Quantity) - Math.abs(prevQuantity));
    const requiredMargin = await calculateRequiredMargin(tradeData, quantityForTrade, data);

    if ((availableMargin - requiredMargin) > 0) {
        tradeData.margin = requiredMargin;
        return;
    } else {
        // await takeRejectedTrade(req, res, from);
    }
}

const calculateRequiredMargin = async (tradeData, Quantity, data) => {
    const { exchange, symbol, buyOrSell, variety, Product, order_type, last_price } = tradeData;
    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
        'X-Kite-Version': '3',
        'Authorization': auth,
        "content-type": "application/json"
    }
    let orderData = [{
        "exchange": exchange,
        "tradingsymbol": symbol,
        "transaction_type": buyOrSell,
        "variety": variety,
        "product": Product,
        "order_type": order_type,
        "quantity": Quantity,
        "price": 0,
        "trigger_price": 0
    }]

    try {
        if (buyOrSell === "SELL") {
            const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            const zerodhaMargin = marginData.data.data.orders[0].total;

            return zerodhaMargin;
        } else {
            return (last_price * Math.abs(Quantity));
        }
    } catch (err) {
        console.log(err);
    }

}

const availableMarginFunc = async (fundDetail, pnlData, npnl) => {

    const openingBalance = fundDetail?.openingBalance ? fundDetail?.openingBalance : fundDetail?.totalFund;
    const withoutLimitData = pnlData.filter((elem) => !elem._id.isLimit);
    if (!pnlData.length) {
        return openingBalance;
    }

    let totalMargin = 0
    let runningLots = 0;
    let amount = 0;
    let margin = 0;
    for(let acc of pnlData){
        totalMargin += acc.margin;
        runningLots += acc.lots;
        if (acc._id.isLimit) {
            margin += acc.margin;
        } else {
            amount += (acc.amount - acc.brokerage)
        }
    }
    if (npnl < 0)
        // substract npnl for those positions only which are closed
        if (runningLots === 0) {
            return openingBalance - totalMargin + npnl;
        } else {
            console.log("margin", openingBalance  - (Math.abs(amount)+margin))
            return openingBalance  - (Math.abs(amount)+margin);
        }
    else{
        return openingBalance - totalMargin;
    }
}


