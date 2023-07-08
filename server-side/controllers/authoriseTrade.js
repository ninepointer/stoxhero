const InfinityTrader = require("../models/mock-trade/infinityTrader");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeContest = require("../models/Contest/ContestTrade");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const UserDetail = require("../models/User/userDetailSchema");
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const MarginCall = require('../models/marginAllocation/MarginCall');
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("../models/DailyContest/dailyContestMockCompany");
const DailyContest = require("../models/DailyContest/dailyContest");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema");
const ObjectId = require('mongodb').ObjectId;
const InternshipTrade = require("../models/mock-trade/internshipTrade");
const InternBatch = require("../models/Careers/internBatch");
const { v4: uuidv4 } = require('uuid');
const { client, getValue } = require('../marketData/redisClient');



exports.fundCheck = async (req, res, next) => {
    let isRedisConnected = getValue();

    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity } = req.body;

    getKiteCred.getAccess().then(async (data) => {

        const userId = req.user._id;
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]
        let userFunds;
        try {
            const user = await UserDetail.findOne({ _id: new ObjectId(req.user._id) });
            userFunds = user.fund;

        } catch (e) {
            console.log("errro fetching user", e);
        }

        let runningLots = [];
        let todayPnlData = [];
        try {


            if (isRedisConnected && await client.exists(`${req.user._id.toString()} overallpnl`)) {
                todayPnlData = await client.get(`${req.user._id.toString()} overallpnl`)
                todayPnlData = JSON.parse(todayPnlData);

                for (let i = 0; i < todayPnlData?.length; i++) {
                    if (todayPnlData[i]?._id?.symbol === symbol) {
                        // runningLots = todayPnlData[i]?.lots;
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
                    // console.log("runningLots", runningLots)
                }
            }
        } catch (e) {
            console.log("errro fetching pnl 1", e);
        }


        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }

        // console.log(runningLots, userFunds)
        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            //console.log("checking runninglot- reverse trade");
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }

        let pnlDetails = [];

        let totalAmount = 0;
        for (const element of todayPnlData) {
            if (element.lots < 0) {
                element.amount = -element.amount;
            }
            totalAmount += (element.amount - element.brokerage);
        }
        if (isRedisConnected && await client.exists(`${req.user._id.toString()} openingBalanceAndMargin`)) {
            let marginDetail = await client.get(`${req.user._id.toString()} openingBalanceAndMargin`)
            marginDetail = JSON.parse(marginDetail);

            if (marginDetail?.openingBalance) {
                // userNetPnl = ( pnl?.openingBalance - userFunds) + totalAmount
                pnlDetails.push({ npnl: ((marginDetail?.openingBalance - userFunds) + totalAmount) })
            } else {
                pnlDetails.push({ npnl: (totalAmount) })
                // userNetPnl = totalAmount
            }
        }

        let userNetPnl = pnlDetails[0]?.npnl;
        // console.log(userFunds, userNetPnl, totalAmount, todayPnlData)

        console.log(userFunds, userNetPnl, zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else", Boolean(!userFunds))
            if (!userFunds || (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0)) {
                let { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, exchangeInstrumentToken,
                    TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, realTrade,
                    realBuyOrSell, realQuantity, apiKey, accessToken, userId, checkingMultipleAlgoFlag,
                    real_instrument_token, realSymbol, trader, order_id } = req.body;

                try {
                    if (req.user.isAlgoTrader) {

                        const mockTradeCompany = new InfinityTradeCompany({
                            status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity: realQuantity,
                            Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol: realSymbol,
                            placed_by: "stoxhero", algoBox: algoBoxId, order_id, instrumentToken: real_instrument_token, exchangeInstrumentToken,
                            brokerage: null, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: null,
                            trade_time: new Date(),
                        });
                        await mockTradeCompany.save();
                    }
                    const algoTrader = new InfinityTrader({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: null, exchangeInstrumentToken,
                        createdBy: req.user._id, trader: req.user._id, amount: null, trade_time: new Date(),

                    });
                    console.log("margincall saving")
                    await algoTrader.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                // console.log("caseStudy 7: fund check")
                return next();
            }
        }
    });
}

exports.fundCheckPaperTrade = async (req, res, next) => {

    // console.log("in fundCheckPaperTrade")
    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity } = req.body;


    getKiteCred.getAccess().then(async (data) => {

        let isRedisConnected = getValue();
        let userFunds;
        let runningLots = [];
        let userNetPnl;
        let todayPnlData = [];
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]

        try {


            if (isRedisConnected && await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)) {
                todayPnlData = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
                todayPnlData = JSON.parse(todayPnlData);
                // console.log("in if todayPnlData", todayPnlData)
                for (let i = 0; i < todayPnlData?.length; i++) {
                    if (todayPnlData[i]?._id?.symbol === symbol) {
                        // runningLots = todayPnlData[i]?.lots;
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
                    // console.log("runningLots", runningLots)
                }
            }
        } catch (e) {
            console.log("errro fetching pnl 2", e);
        }

        let isSymbolMatch = true;
        let isLesserQuantity = false;
        let isOpposite = false;
        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }

        const myPortfolios = await Portfolio.find({ status: "Active", "users.userId": req.user._id, portfolioType: "Virtual Trading" });
        req.body.portfolioId = myPortfolios[0]._id;
        // console.log(runningLots, userFunds)
        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }



        // const myPortfolios = await Portfolio.find({status: "Active", "users.userId": req.user._id, portfolioType: "Virtual Trading"});
        let addPortfolioFund = 0;
        let flag = false;
        for (let i = 0; i < myPortfolios.length; i++) {
            let fund = myPortfolios[i].portfolioValue;
            // console.log("fund", fund, userNetPnl)
            if (!flag && userNetPnl ? Number(fund + userNetPnl - zerodhaMargin) > 0 : Number(fund - zerodhaMargin) > 0) {
                userFunds = fund;
                req.body.portfolioId = myPortfolios[i]._id;
                break;
            } else if (fund > 0) {
                flag = true;
                addPortfolioFund += fund;
                // if(userNetPnl ? Number(addPortfolioFund + userNetPnl - zerodhaMargin) > 0 : Number(addPortfolioFund - zerodhaMargin) > 0){
                userFunds = addPortfolioFund;
                req.body.portfolioId = myPortfolios[i]._id;
                // }
            }
        }

        let totalAmount = 0;
        for (const element of todayPnlData) {
            if (element.lots < 0) {
                element.amount = -element.amount;
            }
            totalAmount += (element.amount - element.brokerage);
        }
        // console.log("todayPnlData is", todayPnlData)
        if (isRedisConnected && await client.exists(`${req.user._id.toString()} openingBalanceAndMarginPaper`)) {
            let pnl = await client.get(`${req.user._id.toString()} openingBalanceAndMarginPaper`)
            pnl = JSON.parse(pnl);
            // console.log("pnl is", pnl)
            // userFunds = pnl?.totalFund;
            if (pnl?.openingBalance) {
                userNetPnl = (pnl?.openingBalance - userFunds) + totalAmount
            } else {
                userNetPnl = totalAmount
            }
            // userNetPnl = (pnl?.openingBalance - userFunds) + totalAmount
        }

        // 20 15
        // 10 15 -->2nd 50
        // 0  15
        // console.log("portfolio", req.body.portfolioId)
        console.log(userFunds, userNetPnl, zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0) {
                let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, createdBy,
                    instrumentToken, trader, order_id } = req.body;

                try {

                    const paperTrade = new PaperTrade({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: order_id, instrumentToken, brokerage: null, createdBy: req.user._id,
                        trader: trader, amount: null, trade_time: new Date()

                    });
                    console.log("margincall saving")
                    await paperTrade.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });
}

exports.fundCheckTenxTrader = async (req, res, next) => {

    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity, subscriptionId } = req.body;


    getKiteCred.getAccess().then(async (data) => {

        let isRedisConnected = getValue();
        let userFunds;
        let runningLots = [];
        let userNetPnl;
        let todayPnlData = [];
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]

        try {

            if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
                todayPnlData = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
                todayPnlData = JSON.parse(todayPnlData);
                // console.log("in if todayPnlData", todayPnlData)
                for (let i = 0; i < todayPnlData?.length; i++) {
                    if (todayPnlData[i]?._id?.symbol === symbol) {
                        // runningLots = todayPnlData[i]?.lots;
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
                    // console.log("runningLots", runningLots)
                }
            }
        } catch (e) {
            console.log("errro fetching pnl 3", e);
        }

        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }

        let totalAmount = 0;
        for (const element of todayPnlData) {
            if (element.lots < 0) {
                element.amount = -element.amount;
            }
            totalAmount += (element.amount - element.brokerage);
        }
        // console.log("todayPnlData is", todayPnlData, totalAmount)
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)) {
            let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginTenx`)
            pnl = JSON.parse(pnl);
            // console.log("pnl is", pnl)
            userFunds = pnl?.totalFund;
            if (pnl?.openingBalance) {
                userNetPnl = (pnl?.openingBalance - userFunds) + totalAmount
            } else {
                userNetPnl = totalAmount
            }
            // userNetPnl = ( pnl?.openingBalance - userFunds) + totalAmount
        }

        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }

        console.log(userFunds, userNetPnl, zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0) {
                let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, createdBy,
                    instrumentToken, trader, order_id } = req.body;

                try {

                    const tenXTrade = new TenXTrader({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: order_id, instrumentToken, brokerage: null, createdBy: req.user._id, exchangeInstrumentToken,
                        trader: trader, amount: null, trade_time: new Date(), subscriptionId

                    });
                    console.log("margincall saving")
                    await tenXTrade.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });
}

exports.contestFundCheck = async (req, res, next) => {

    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity, portfolioId } = req.body;

    const contestId = req.params.id;
    const userId = req.user._id;

    // console.log(contestId, userId)

    getKiteCred.getAccess().then(async (data) => {
        // console.log(data)

        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        // const api_key = data.getApiKey;
        // const access_token = data.getAccessToken;
        let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
        // let auth = "token nq0gipdzk0yexyko:kDkeVh0s1q71pdlysC0x2a8Koecv4lmZ"
        //console.log(auth)
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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]

        // console.log(orderData);
        let contestFunds;
        try {
            const portfolio = await Portfolio.findById({ _id: portfolioId });
            // console.log("portfolio", portfolio)
            const users = portfolio.users.filter((elem) => {
                return (elem.userId).toString() == (userId).toString();
            })

            // console.log("users", users)
            // (user => user.userId);


            // const contest = await Contest.findOne({_id: contestId});
            contestFunds = users[0].portfolioValue;
            // contestFunds = 10000000;
        } catch (e) {
            console.log("errro fetching contest", e);
        }

        let runningLots;
        try {

            runningLots = await MockTradeContest.aggregate([
                {
                    $match:
                    {
                        // trade_time: {$regex: todayDate},
                        symbol: symbol,
                        trader: userId,
                        status: "COMPLETE",
                        contestId: new ObjectId(contestId)
                    }
                },
                {
                    $group:
                    {
                        _id: { symbol: "$symbol" },
                        runningLots: {
                            $sum: { $toInt: "$Quantity" }
                        }
                    }
                },
            ])
        } catch (e) {
            console.log("errro fetching pnl 4", e);

        }

        let isSymbolMatch = true;
        let isLesserQuantity = false;
        let isOpposite = false;
        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }

        // console.log("lots and fund", runningLots, contestFunds)
        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            // console.log("checking runninglot- reverse trade");
            next();
            return;
        }
        //console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
        let marginData;
        let zerodhaMargin;

        // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
        try {
            // console.log("fetching margin data")
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })

            zerodhaMargin = marginData.data.data.orders[0].total;
            // console.log("zerodhaMargin", marginData);
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }
        // }


        //TODO: get user pnl data and replace 0 with the value 

        let pnlDetails = await MockTradeContest.aggregate([
            {
                $match: {

                    status: "COMPLETE",
                    trader: userId,
                    //   contestId: new ObjectId(contestId),
                    portfolioId: new ObjectId(portfolioId)
                },
            },
            {
                $group:
                {
                    _id: {
                        // email: "$userId",
                        trader: "$trader",
                    },
                    gpnl: {
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
                $addFields:
                {
                    npnl: {
                        $subtract: ["$gpnl", "$brokerage"],
                    },
                },
            },
        ])

        // console.log("pnlDetails", pnlDetails)


        let userNetPnl = pnlDetails[0]?.npnl;
        console.log(contestFunds, userNetPnl, zerodhaMargin)
        console.log((contestFunds + userNetPnl - zerodhaMargin))
        // if(( !runningLots[0]?.runningLots || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) && Number(contestFunds + userNetPnl - zerodhaMargin)  < 0){
        // if(( !runningLots[0]?.runningLots || (((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot == buyOrSell))) && Number(contestFunds + userNetPnl - zerodhaMargin)  < 0){   
        // //console.log("in if")
        // return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
        if (Number(contestFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(contestFunds + userNetPnl - zerodhaMargin) < 0 : Number(contestFunds - zerodhaMargin) < 0) {
                let uid = uuidv4();
                let { exchange, symbol, buyOrSell, Quantity, Product, OrderType,
                    validity, variety, instrumentToken, realSymbol, trader } = req.body;


                try {

                    const mockTradeContest = new MockTradeContest({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: null, contestId: req.params.id,
                        createdBy: req.user._id, trader: trader, amount: null, trade_time: new Date(), portfolioId: req.body.portfolioId

                    });

                    // console.log("margincall saving", mockTradeContest)
                    await mockTradeContest.save();

                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }


            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });


}

exports.fundCheckInternship = async (req, res, next) => {
    let isRedisConnected = getValue();

    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity, subscriptionId } = req.body;

    getKiteCred.getAccess().then(async (data) => {
        let isRedisConnected = getValue();
        let userFunds;
        let runningLots = [];
        let userNetPnl;
        let todayPnlData = [];
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]

        try {

            if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)) {
                todayPnlData = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
                todayPnlData = JSON.parse(todayPnlData);
                // console.log("in if todayPnlData", todayPnlData)
                for (let i = 0; i < todayPnlData?.length; i++) {
                    if (todayPnlData[i]?._id?.symbol === symbol) {
                        // runningLots = todayPnlData[i]?.lots;
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
                    // console.log("runningLots", runningLots)
                }
            }
        } catch (e) {
            console.log("errro fetching pnl 5", e);
        }

        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }



        let totalAmount = 0;
        for (const element of todayPnlData) {
            totalAmount += (element.amount - element.brokerage);
        }
        // console.log("todayPnlData is", todayPnlData)
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginInternship`)) {
            let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()} openingBalanceAndMarginInternship`)
            pnl = JSON.parse(pnl);
            // console.log("pnl is", pnl)
            userFunds = pnl?.totalFund;
            if (pnl?.openingBalance) {
                userNetPnl = (pnl?.openingBalance - userFunds) + totalAmount
            } else {
                userNetPnl = totalAmount
            }

        }

        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }

        console.log(userFunds, userNetPnl, zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0) {
                let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, createdBy,
                    instrumentToken, trader, order_id } = req.body;

                try {

                    const internshipTrade = new InternshipTrade({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: order_id, instrumentToken, brokerage: null, createdBy: req.user._id, exchangeInstrumentToken,
                        trader: trader, amount: null, trade_time: new Date(), batch: subscriptionId

                    });
                    console.log("margincall saving")
                    await internshipTrade.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });
}

exports.fundCheckDailyContest = async (req, res, next) => {

    // console.log("in fundCheckTenxTrader")
    const { exchange, symbol, buyOrSell, variety,
        Product, OrderType, Quantity, contestId, exchangeInstrumentToken } = req.body;
    // console.log("contestId: ",contestId)

    getKiteCred.getAccess().then(async (data) => {

        let isRedisConnected = getValue();
        let userFunds;
        let runningLots = [];
        let userNetPnl;
        let todayPnlData = [];
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

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
            "order_type": OrderType,
            "quantity": Quantity,
            "price": 0,
            "trigger_price": 0
        }]

        try {


            if (isRedisConnected && await client.exists(`${req.user._id.toString()}${contestId.toString()} overallpnlDailyContest`)) {
                todayPnlData = await client.get(`${req.user._id.toString()}${contestId.toString()} overallpnlDailyContest`)
                todayPnlData = JSON.parse(todayPnlData);

                // console.log("todayPnlData", todayPnlData)

                for (let i = 0; i < todayPnlData?.length; i++) {
                    if (todayPnlData[i]?._id?.symbol === symbol) {
                        // runningLots = todayPnlData[i]?.lots;
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
                    // console.log("runningLots", runningLots)
                }
            }
        } catch (e) {
            console.log("errro fetching pnl 5", e);
        }

        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if (runningLots[0]?._id?.symbol !== symbol) {
            isSymbolMatch = false;
        }
        if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
            isLesserQuantity = true;
        }
        if (transactionTypeRunningLot !== buyOrSell) {
            isOpposite = true;
        }

        let totalAmount = 0;
        // console.log("todayPnlData", todayPnlData)
        for (const element of todayPnlData) {
            // console.log("element.amount-element.brokerage", element.amount, element.brokerage)
            if (element.lots < 0) {
                element.amount = -element.amount;
            }
            totalAmount += (element.amount - element.brokerage);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${contestId.toString()} openingBalanceAndMarginDailyContest`)) {
            let pnl = await client.get(`${req.user._id.toString()}${contestId.toString()} openingBalanceAndMarginDailyContest`)
            pnl = JSON.parse(pnl);
            // console.log("fund pnl", pnl)
            userFunds = pnl?.totalFund;

            if (pnl?.openingBalance) {
                userNetPnl = (pnl?.openingBalance - userFunds) + totalAmount
            } else {
                userNetPnl = totalAmount
            }
        }


        if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try {
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            zerodhaMargin = marginData.data.data.orders[0].total;
        } catch (e) {
            // console.log("error fetching zerodha margin", e);
        }


        // console.log(firstDayOfMonthDate, lastDayOfMonthDate);
        // let pnlDetails = await DailyContestMockUser.aggregate([
        //     {
        //     $match:
        //         {
        //             // trade_time: {
        //             //     $gte: (firstDayOfMonthDate),
        //             //     $lte: (lastDayOfMonthDate)
        //             //     },
        //             trader: req.user._id,
        //             status: "COMPLETE",
        //             contestId: new ObjectId(contestId)
        //         },
        //     },
        //     {
        //     $group:
        //         {
        //             _id: {
        //                 trader: "$trader",
        //                 // trader: "$createdBy",
        //             },
        //             gpnl: {
        //                 $sum: {
        //                 $multiply: ["$amount", -1],
        //                 },
        //             },
        //             brokerage: {
        //                 $sum: {
        //                 $toDouble: "$brokerage",
        //                 },
        //             },
        //         },
        //     },
        //     {
        //     $addFields:
        //         {
        //         npnl: {
        //             $subtract: ["$gpnl", "$brokerage"],
        //         },
        //         },
        //     },
        // ])

        // let userNetPnl = pnlDetails[0]?.npnl;

        console.log(userFunds, userNetPnl, zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0) {
                let { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                    TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, realTrade,
                    realBuyOrSell, realQuantity, apiKey, accessToken, userId, checkingMultipleAlgoFlag,
                    real_instrument_token, realSymbol, trader, order_id, contestId } = req.body;

                try {

                    const mockTradeCompany = new DailyContestMockCompany({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity: realQuantity,
                        Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol: realSymbol,
                        placed_by: "stoxhero", algoBox: algoBoxId, order_id, instrumentToken: real_instrument_token, contestId,
                        brokerage: null, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: null,
                        trade_time: new Date(), exchangeInstrumentToken
                    });
                    await mockTradeCompany.save();

                    const algoTrader = new DailyContestMockUser({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: null, contestId, exchangeInstrumentToken,
                        createdBy: req.user._id, trader: req.user._id, amount: null, trade_time: new Date(),

                    });
                    console.log("margincall saving")
                    await algoTrader.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });
}











// exports.marginUsed = async (req, res, next) => {
//     let isRedisConnected = getValue();

//     const { exchange, symbol, buyOrSell, variety,
//         Product, OrderType, Quantity } = req.body;

//     getKiteCred.getAccess().then(async (data) => {

//         const userId = req.user._id;
//         let date = new Date();
//         let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
//         todayDate = todayDate + "T00:00:00.000Z";
//         const today = new Date(todayDate);

//         let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
//         let headers = {
//             'X-Kite-Version': '3',
//             'Authorization': auth,
//             "content-type": "application/json"
//         }
//         let orderData = [{
//             "exchange": exchange,
//             "tradingsymbol": symbol,
//             "transaction_type": buyOrSell,
//             "variety": variety,
//             "product": Product,
//             "order_type": OrderType,
//             "quantity": Quantity,
//             "price": 0,
//             "trigger_price": 0
//         }]
//         let userFunds;
//         try {
//             const user = await UserDetail.findOne({ _id: new ObjectId(req.user._id) });
//             userFunds = user.fund;

//         } catch (e) {
//             console.log("errro fetching user", e);
//         }

//         let runningLots = [];
//         let todayPnlData = [];
//         try {


//             if (isRedisConnected && await client.exists(`${req.user._id.toString()} overallpnl`)) {
//                 todayPnlData = await client.get(`${req.user._id.toString()} overallpnl`)
//                 todayPnlData = JSON.parse(todayPnlData);

//                 for (let i = 0; i < todayPnlData?.length; i++) {
//                     if (todayPnlData[i]?._id?.symbol === symbol) {
//                         // runningLots = todayPnlData[i]?.lots;
//                         runningLots.push({
//                             _id: {
//                                 symbol: symbol
//                             },
//                             runningLots: todayPnlData[i]?.lots
//                         })
//                     }
//                     // console.log("runningLots", runningLots)
//                 }
//             }
//         } catch (e) {
//             console.log("errro fetching pnl 1", e);
//         }

//         /*
//         user sell 100 quantity of nifty

//         1. user buy or sell on other instrument.
        

//         1. user buy 100 quantity --> square off
//         2. user buy 50 quantity  --> release amount in percentage
//         3. user buy 200 quantity --> margin required only on 100 buy

//         4. user sell any quantity.

//         1. 10 --> 5, 45, 
//         2. 20 --> 10 35, 70
//         3. 50 --> 25 10, 20

//         */







//         let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
//         if (runningLots[0]?._id?.symbol !== symbol) {
//             isSymbolMatch = false;
//         }
//         if (Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)) {
//             isLesserQuantity = true;
//         }
//         if (transactionTypeRunningLot !== buyOrSell) {
//             isOpposite = true;
//         }

//         // console.log(runningLots, userFunds)


//         let isSquareOff = false;
//         let isReleaseFund = false;
//         let isAddMoreFund = false;
//         if ((runningLots[0]?._id?.symbol === symbol) && (transactionTypeRunningLot !== buyOrSell)) {
//             if(Math.abs(Number(Quantity)) == Math.abs(runningLots[0]?.runningLots)){
//                 isSquareOff = true;
//             }
//             if(Math.abs(Number(Quantity)) < Math.abs(runningLots[0]?.runningLots)){
//                 isReleaseFund = true;
//             }
//             if(Math.abs(Number(Quantity)) > Math.abs(runningLots[0]?.runningLots)){
//                 isAddMoreFund = true;
//             }
//         }



//         if (((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
//             return next();
//         }
//         let marginData;
//         let zerodhaMargin;

//         try {
//             marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
//             zerodhaMargin = marginData.data.data.orders[0].total;
//         } catch (e) {
//             // console.log("error fetching zerodha margin", e);
//         }



//         let pnlDetails = [];
//         let totalAmount = 0;
//         for (const element of todayPnlData) {
//             if (element.lots < 0) {
//                 element.amount = -element.amount;
//             }
//             totalAmount += (element.amount - element.brokerage);
//         }
//         if (isRedisConnected && await client.exists(`${req.user._id.toString()} openingBalanceAndMargin`)) {
//             let marginDetail = await client.get(`${req.user._id.toString()} openingBalanceAndMargin`)
//             marginDetail = JSON.parse(marginDetail);

//             if (marginDetail?.openingBalance) {
//                 // userNetPnl = ( pnl?.openingBalance - userFunds) + totalAmount
//                 pnlDetails.push({ npnl: ((marginDetail?.openingBalance - userFunds) + totalAmount) })
//             } else {
//                 pnlDetails.push({ npnl: (totalAmount) })
//                 // userNetPnl = totalAmount
//             }
//         }

//         let userNetPnl = pnlDetails[0]?.npnl;

//         console.log(userFunds, userNetPnl, zerodhaMargin)
//         console.log((userFunds + userNetPnl - zerodhaMargin))

//         if (Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
//             console.log("user wants square off")
//             return next();
//         } else {
//             // console.log("in else", Boolean(!userFunds))
//             if (!userFunds || (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin) < 0 : Number(userFunds - zerodhaMargin) < 0)) {
//                 let { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, exchangeInstrumentToken,
//                     TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, realTrade,
//                     realBuyOrSell, realQuantity, apiKey, accessToken, userId, checkingMultipleAlgoFlag,
//                     real_instrument_token, realSymbol, trader, order_id } = req.body;

//                 try {
//                     if (req.user.isAlgoTrader) {

//                         const mockTradeCompany = new InfinityTradeCompany({
//                             status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity: realQuantity,
//                             Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol: realSymbol,
//                             placed_by: "stoxhero", algoBox: algoBoxId, order_id, instrumentToken: real_instrument_token, exchangeInstrumentToken,
//                             brokerage: null, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: null,
//                             trade_time: new Date(),
//                         });
//                         await mockTradeCompany.save();
//                     }
//                     const algoTrader = new InfinityTrader({
//                         status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
//                         variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
//                         order_id: req.body.order_id, instrumentToken, brokerage: null, exchangeInstrumentToken,
//                         createdBy: req.user._id, trader: req.user._id, amount: null, trade_time: new Date(),

//                     });
//                     console.log("margincall saving")
//                     await algoTrader.save();
//                 } catch (e) {
//                     console.log("error saving margin call", e);
//                 }

//                 //console.log("sending response from authorise trade");
//                 return res.status(401).json({ status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.' });
//             }
//             else {
//                 console.log("if user have enough funds")
//                 // console.log("caseStudy 7: fund check")
//                 return next();
//             }
//         }
//     });
// }