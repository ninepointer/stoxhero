const InfinityTrader = require("../models/mock-trade/infinityTrader");
const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const MockTradeContest = require("../models/Contest/ContestTrade");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const UserDetail = require("../models/User/userDetailSchema");
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const DailyContestMockUser = require("../models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("../models/DailyContest/dailyContestMockCompany");
const ObjectId = require('mongodb').ObjectId;
const InternshipTrade = require("../models/mock-trade/internshipTrade");
const { v4: uuidv4 } = require('uuid');
const { client, getValue } = require('../marketData/redisClient');
const MarginXMockUser = require("../models/marginX/marginXUserMock");
const MarginXMockCompany = require("../models/marginX/marginXCompanyMock");
const BattleMockUser = require("../models/battle/battleTrade");
const {virtual, internship, dailyContest, marginx, tenx, battle} = require("../constant")


exports.fundCheck = async (req, res, next) => {
    let isRedisConnected = getValue();

    const { exchange, symbol, buyOrSell, variety,
        Product, order_type, Quantity } = req.body;

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
            "order_type": order_type,
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
                        runningLots.push({
                            _id: {
                                symbol: symbol
                            },
                            runningLots: todayPnlData[i]?.lots
                        })
                    }
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


        let isSquareOff = false;
        let isReleaseFund = false;
        let isAddMoreFund = false;
        if ((runningLots[0]?._id?.symbol === symbol) && (transactionTypeRunningLot !== buyOrSell)) {
            if(Math.abs(Number(Quantity)) == Math.abs(runningLots[0]?.runningLots)){
                isSquareOff = true;
            }
            if(Math.abs(Number(Quantity)) < Math.abs(runningLots[0]?.runningLots)){
                isReleaseFund = true;
            }
            if(Math.abs(Number(Quantity)) > Math.abs(runningLots[0]?.runningLots)){
                isAddMoreFund = true;
            }
            if(Math.abs(Number(Quantity)) > Math.abs(runningLots[0]?.runningLots) && Math.abs(runningLots[0]?.runningLots)){
                isAddMoreFund = true;
                isReleaseFund = true;
            }
        }

        if ((runningLots[0]?._id?.symbol === symbol) && (transactionTypeRunningLot == buyOrSell)) {
            isAddMoreFund = true;
        }

        req.body.marginData = {
            isReleaseFund: isReleaseFund,
            isAddMoreFund: runningLots[0]?.runningLots ? isAddMoreFund : true,
            isSquareOff: isSquareOff,
            runningLots: runningLots[0]?.runningLots ? runningLots[0]?.runningLots : 0
        }

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

        req.body.marginData = {
            isReleaseFund: isReleaseFund,
            isAddMoreFund: runningLots[0]?.runningLots ? isAddMoreFund : true,
            isSquareOff: isSquareOff,
            zerodhaMargin: zerodhaMargin,
            runningLots: runningLots[0]?.runningLots ? runningLots[0]?.runningLots : 0
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
                let { exchange, symbol, buyOrSell, Quantity, Product, order_type, exchangeInstrumentToken,
                    validity, variety, algoBoxId, instrumentToken,
                    realBuyOrSell, realQuantity,
                    real_instrument_token, realSymbol, trader, order_id } = req.body;

                    let myDate = new Date();
                    order_id = `${myDate.getFullYear() - 2000}${String(myDate.getMonth() + 1).padStart(2, '0')}${String(myDate.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

                    myDate.setHours(myDate.getHours() + 5);       // Add 5 hours
                    myDate.setMinutes(myDate.getMinutes() + 30); // Add 30 minutes


                try {
                    if (req.user.isAlgoTrader) {

                        const mockTradeCompany = new InfinityTradeCompany({
                            status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity: realQuantity,
                            Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type, symbol: realSymbol,
                            placed_by: "stoxhero", algoBox: algoBoxId, order_id, instrumentToken: real_instrument_token, exchangeInstrumentToken,
                            brokerage: 0, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: 0,
                            trade_time: myDate,
                        });
                        await mockTradeCompany.save();
                    }
                    const algoTrader = new InfinityTrader({
                        status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: 0, exchangeInstrumentToken,
                        createdBy: req.user._id, trader: req.user._id, amount: 0, trade_time: myDate,

                    });
                    console.log("margincall saving")
                    await algoTrader.save();
                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
            }
            else {
                console.log("if user have enough funds")
                // console.log("caseStudy 7: fund check")
                return next();
            }
        }
    });
}

exports.contestFundCheck = async (req, res, next) => {

    const { exchange, symbol, buyOrSell, variety,
        Product, order_type, Quantity, portfolioId } = req.body;

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
            "order_type": order_type,
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
        // return res.status(401).json({status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.'});
        if (Number(contestFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) {
            console.log("user wants square off")
            return next();
        } else {
            // console.log("in else")
            if (userNetPnl !== undefined ? Number(contestFunds + userNetPnl - zerodhaMargin) < 0 : Number(contestFunds - zerodhaMargin) < 0) {
                let uid = uuidv4();
                let { exchange, symbol, buyOrSell, Quantity, Product, order_type,
                    validity, variety, instrumentToken, realSymbol, trader } = req.body;

                    let myDate = new Date();
                    order_id = `${myDate.getFullYear() - 2000}${String(myDate.getMonth() + 1).padStart(2, '0')}${String(myDate.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

                    myDate.setHours(myDate.getHours() + 5);       // Add 5 hours
                    myDate.setMinutes(myDate.getMinutes() + 30); // Add 30 minutes

                try {

                    const mockTradeContest = new MockTradeContest({
                        status: "REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: null, contestId: req.params.id, exchangeInstrumentToken,
                        createdBy: req.user._id, trader: trader, amount: null, trade_time: myDate, portfolioId: req.body.portfolioId

                    });

                    // console.log("margincall saving", mockTradeContest)
                    await mockTradeContest.save();

                } catch (e) {
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
            }


            else {
                console.log("if user have enough funds")
                return next();
            }
        }
    });


}

const calculateNetPnl = async (req, pnlData, data) => {
    // console.log("pnlData", pnlData)
    let addUrl = 'i=' + req.body.exchange + ':' + req.body.symbol;
    pnlData.forEach((elem) => {
        if(elem?.lots > 0){
            addUrl += ('&i=' + elem._id.exchange + ':' + elem._id.symbol);
        }
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
            return subelem?.instrument_token == req.body?.instrumentToken;
        })

        req.body.last_price = ltp[0]?.last_price;


        for (let elem of pnlData) {
            const ltp = arr.filter((subelem) => {
                return subelem?.instrument_token == elem?._id?.instrumentToken;
            })
            if(!elem._id.isLimit){
                let grossPnl = elem?.lots>0 ? (elem?.amount + (elem?.lots) * ltp[0]?.last_price) : elem?.amount;
                // console.log("grossPnl", grossPnl)
                totalGrossPnl += grossPnl;
                totalBrokerage += Number(elem?.brokerage);    
            }
        }

        totalNetPnl = totalGrossPnl - totalBrokerage;

        return totalNetPnl;
    } catch (err) {
        console.log(err)
    }
}

const getLastTradeMarginAndCaseNumber = async (req, pnlData, from) => {
    // if(req.body.order_type === "LIMIT"){
    //     return {caseNumber: 0}
    // }
    const mySymbol = pnlData.filter((elem)=>{
        return elem?._id?.symbol === req.body.symbol && !elem?._id?.isLimit;
    })

    const runningLotForSymbol = mySymbol[0]?.lots;
    const transactionTypeForSymbol = mySymbol[0]?.lots >= 0 ? "BUY" : mySymbol[0]?.lots < 0 && "SELL";
    const quantity = req.body.Quantity;
    const transaction_type = req.body.buyOrSell;
    const symbol = mySymbol[0]?.symbol;
    let margin = 0;
    let caseNumber = 0;

    const DataBase = from===virtual ? PaperTrade : 
                    from===internship ? InternshipTrade : 
                    from===dailyContest ? DailyContestMockUser : 
                    from===marginx ? MarginXMockUser :
                    from===tenx && TenXTrader;

    
    if(pnlData?.length > 0){
        margin = mySymbol[0]?.margin;
    } else{
        const lastTradeData = await DataBase.findOne({symbol: symbol, trader: new ObjectId(req.user._id), trade_time: {$gte: new Date()}})
        .sort({ _id: -1 })
        .limit(1)
        margin = lastTradeData && lastTradeData.margin;
    }

    if(Math.abs(runningLotForSymbol) > Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        caseNumber = 2;
    } else if(Math.abs(runningLotForSymbol) < Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        caseNumber = 4;
    } else if(Math.abs(runningLotForSymbol) === Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        caseNumber = 3;
    } else if(transactionTypeForSymbol === transaction_type){
        caseNumber = 1;
    } else{
        caseNumber = 0;
    }

    return {margin: margin, caseNumber: caseNumber, runningLotForSymbol: runningLotForSymbol}
}

const marginZeroCase = async (req, res, next, availableMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(req, req.body.Quantity, data);
    // console.log("0th case", availableMargin, requiredMargin);

    if((availableMargin-requiredMargin) > 0){
        req.body.margin = requiredMargin;
        return next();
    } else{
        await takeRejectedTrade(req, res, from);
    }
}

const marginFirstCase = async (req, res, next, availableMargin, prevMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(req, req.body.Quantity, data);
    // console.log("1st case", availableMargin, prevMargin, requiredMargin);

    if((availableMargin-requiredMargin) > 0){
        req.body.margin = requiredMargin+prevMargin;
        return next();
    } else{
        await takeRejectedTrade(req, res, from);
    }
}

const marginSecondCase = async (req, res, next, prevMargin, prevQuantity) => {
    const quantityPer = Math.abs(req.body.Quantity) * 100 / Math.abs(prevQuantity);
    const marginReleased = prevMargin*quantityPer/100;
    req.body.margin = prevMargin-marginReleased;
    // console.log("2nd case", quantityPer, marginReleased);

    return next();
}

const marginThirdCase = async (req, res, next, netPnl) => {
    req.body.margin = 0;
    console.log("3rd case");

    return next();
}

const marginFourthCase = async (req, res, next, availableMargin, prevQuantity, from, data) => {
    const quantityForTrade = Math.abs(Math.abs(req.body.Quantity) - Math.abs(prevQuantity));
    const requiredMargin = await calculateRequiredMargin(req, quantityForTrade, data);

    if((availableMargin-requiredMargin) > 0){
        req.body.margin = requiredMargin;
        return next();
    } else{
        await takeRejectedTrade(req, res, from);
    }
}

const calculateRequiredMargin = async (req, Quantity, data) => {
    const { exchange, symbol, buyOrSell, variety, Product, order_type, last_price, price} = req.body;
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
        "price": price ? price : 0,
        "trigger_price": 0
    }]

    try{
        if(buyOrSell === "SELL"){
            const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            const zerodhaMargin = marginData.data.data.orders[0].total;
    
            return zerodhaMargin;    
        } else{
            if(order_type === "LIMIT"){
                return (price * Math.abs(Quantity));
            } else{
                return (last_price * Math.abs(Quantity));
            }
            
        }
    }catch(err){
        console.log(err);
    }
    
}

const availableMarginFunc = async (fundDetail, pnlData, npnl) => {

    const openingBalance = fundDetail?.openingBalance ? fundDetail?.openingBalance : fundDetail?.totalFund;
    const withoutLimitData = pnlData.filter((elem) => !elem._id.isLimit);
    if (!pnlData.length) {
        return openingBalance;
    }

    const totalMargin = pnlData.reduce((total, acc)=>{
        return total + acc.margin;
    }, 0)
    console.log("availble margin", totalMargin, openingBalance, npnl)
    if(npnl < 0)
    return openingBalance-totalMargin+npnl;
    else
    return openingBalance-totalMargin;
}

const takeRejectedTrade = async(req, res, from)=>{
    let myDate = new Date();
    const order_id = `${myDate.getFullYear() - 2000}${String(myDate.getMonth() + 1).padStart(2, '0')}${String(myDate.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

    myDate.setHours(myDate.getHours() + 5);       // Add 5 hours
    myDate.setMinutes(myDate.getMinutes() + 30); // Add 30 minutes

    if(from === virtual) {
        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, validity, variety, createdBy,
            instrumentToken, trader, exchangeInstrumentToken, portfolioId } = req.body;

        try {

            const paperTrade = new PaperTrade({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", exchangeInstrumentToken,
                order_id: order_id, instrumentToken, brokerage: 0, createdBy: req.user._id,
                trader: trader, amount: 0, trade_time: myDate, portfolioId: portfolioId, margin: 0

            });
            console.log("margincall saving")
            await paperTrade.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }
        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
    if(from === tenx){
        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, validity, variety, createdBy,
            instrumentToken, trader, exchangeInstrumentToken, subscriptionId } = req.body;

        try {

            const tenXTrade = new TenXTrader({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                order_id: order_id, instrumentToken, brokerage: 0, createdBy: req.user._id, exchangeInstrumentToken,
                trader: trader, amount: 0, trade_time: myDate, subscriptionId, margin: 0

            });
            console.log("margincall saving")
            await tenXTrade.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }

        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
    if(from === internship){
        let { exchange, symbol, buyOrSell, Quantity, Product, order_type, validity, variety, createdBy,
            instrumentToken, trader, exchangeInstrumentToken } = req.body;

        try {

            const internshipTrade = new InternshipTrade({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                order_id: order_id, instrumentToken, brokerage: 0, createdBy: req.user._id, exchangeInstrumentToken,
                trader: trader, amount: 0, trade_time: myDate, batch: subscriptionId, margin: 0

            });
            console.log("margincall saving")
            await internshipTrade.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }

        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
    if(from === marginx){
        let { exchange, symbol, buyOrSell, Quantity, Price, Product, order_type,
            TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, 
            realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, marginxId, exchangeInstrumentToken } = req.body;
            
        try {

            const mockTradeCompany = new MarginXMockCompany({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity: realQuantity,
                Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type, symbol: realSymbol,
                placed_by: "stoxhero", algoBox: algoBoxId, order_id: order_id, instrumentToken: real_instrument_token, marginxId,
                brokerage: 0, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: 0,
                trade_time: myDate, exchangeInstrumentToken, margin: 0
            });
            await mockTradeCompany.save();

            const algoTrader = new MarginXMockUser({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                order_id: order_id, instrumentToken, brokerage: 0, marginxId, exchangeInstrumentToken,
                createdBy: req.user._id, trader: req.user._id, amount: 0, trade_time: myDate, margin: 0

            });
            console.log("margincall saving")
            await algoTrader.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }

        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
    if(from === dailyContest){
        let { exchange, symbol, buyOrSell, Quantity, Price, Product, order_type,
            TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, 
            realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, contestId, exchangeInstrumentToken } = req.body;
            
        try {

            const mockTradeCompany = new DailyContestMockCompany({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity: realQuantity,
                Product, buyOrSell: realBuyOrSell, variety, validity, exchange, order_type: order_type, symbol: realSymbol,
                placed_by: "stoxhero", algoBox: algoBoxId, order_id: order_id, instrumentToken: real_instrument_token, contestId,
                brokerage: 0, createdBy: req.user._id, trader: trader, isRealTrade: false, amount: 0,
                trade_time: myDate, exchangeInstrumentToken, margin: 0
            });
            await mockTradeCompany.save();

            const algoTrader = new DailyContestMockUser({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                order_id: order_id, instrumentToken, brokerage: 0, contestId, exchangeInstrumentToken,
                createdBy: req.user._id, trader: req.user._id, amount: 0, trade_time: myDate, margin: 0

            });
            console.log("margincall saving")
            await algoTrader.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }

        //console.log("sending response from authorise trade");
        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
    if(from === battle){
        let { exchange, symbol, buyOrSell, Quantity, Product, order_type,
            validity, variety, instrumentToken, 
            battleId, exchangeInstrumentToken } = req.body;
            
        try {

            const algoTrader = new BattleMockUser({
                status: "REJECTED", status_message: "insufficient fund", average_price: 0, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
                order_id: order_id, instrumentToken, brokerage: 0, battleId, exchangeInstrumentToken,
                createdBy: req.user._id, trader: req.user._id, amount: 0, trade_time: myDate, margin: 0

            });
            console.log("margincall saving")
            await algoTrader.save();
        } catch (e) {
            console.log("error saving margin call", e);
        }

        return res.status(401).json({ status: 'Failed', message: 'You do not have sufficient funds to take this trade. Please try with smaller lot size.' });
    }
}

exports.fundCheckPaperTrade = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()} openingBalanceAndMarginPaper`)) {
            fundDetail = await client.get(`${req.user._id.toString()} openingBalanceAndMarginPaper`)
            fundDetail = JSON.parse(fundDetail);
            req.body.portfolioId = fundDetail?.portfolioId;
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    console.log(todayPnlData)
    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data );
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, virtual);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin; 
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, virtual, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, virtual, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, virtual, data)
            break;
    }

}

exports.fundCheckTenxTrader = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.subscriptionId.toString()}: overallpnlTenXTrader`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}${req.body.subscriptionId.toString()}: overallpnlTenXTrader`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.subscriptionId.toString()} openingBalanceAndMarginTenx`)) {
            fundDetail = await client.get(`${req.user._id.toString()}${req.body.subscriptionId.toString()} openingBalanceAndMarginTenx`)
            fundDetail = JSON.parse(fundDetail);
            // req.body.portfolioId = fundDetail?.portfolioId;
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, tenx);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin;
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    console.log(netPnl, availableMargin, caseNumber, margin, runningLotForSymbol )

    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, tenx, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, tenx, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, tenx, data)
            break;
    }
}

exports.fundCheckInternship = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.subscriptionId.toString()}: overallpnlIntern`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}${req.body.subscriptionId.toString()}: overallpnlIntern`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.subscriptionId.toString()} openingBalanceAndMarginInternship`)) {
            fundDetail = await client.get(`${req.user._id.toString()}${req.body.subscriptionId.toString()} openingBalanceAndMarginInternship`)
            fundDetail = JSON.parse(fundDetail);
            // req.body.portfolioId = fundDetail?.portfolioId;
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, internship);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin;
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, internship, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, internship, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, internship, data)
            break;
    }
}

exports.fundCheckMarginX = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    console.log(`${req.user._id.toString()}${req.body.marginxId.toString()} overallpnlMarginX`)
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.marginxId.toString()} overallpnlMarginX`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}${req.body.marginxId.toString()} overallpnlMarginX`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.marginxId.toString()} openingBalanceAndMarginMarginx`)) {
            fundDetail = await client.get(`${req.user._id.toString()}${req.body.marginxId.toString()} openingBalanceAndMarginMarginx`)
            fundDetail = JSON.parse(fundDetail);
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, marginx);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin;
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, marginx, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, marginx, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, marginx, data)
            break;
    }
}

exports.fundCheckDailyContest = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.contestId.toString()} overallpnlDailyContest`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}${req.body.contestId.toString()} overallpnlDailyContest`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.contestId.toString()} openingBalanceAndMarginDailyContest`)) {
            fundDetail = await client.get(`${req.user._id.toString()}${req.body.contestId.toString()} openingBalanceAndMarginDailyContest`)
            fundDetail = JSON.parse(fundDetail);
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, dailyContest);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin;
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    console.log(netPnl, availableMargin, caseNumber, margin, runningLotForSymbol )
    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, dailyContest, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, dailyContest, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, dailyContest, data)
            break;
    }
}

exports.fundCheckBattle = async (req, res, next) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;
    try {
        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.battleId.toString()} overallpnlBattle`)) {
            todayPnlData = await client.get(`${req.user._id.toString()}${req.body.battleId.toString()} overallpnlBattle`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${req.user._id.toString()}${req.body.battleId.toString()} openingBalanceAndMarginBattle`)) {
            fundDetail = await client.get(`${req.user._id.toString()}${req.body.battleId.toString()} openingBalanceAndMarginBattle`)
            fundDetail = JSON.parse(fundDetail);
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }

    const data = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(req, todayPnlData, data);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(req, todayPnlData, battle);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin;
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    switch (caseNumber) {
        case 0:
            await marginZeroCase(req, res, next, availableMargin, battle, data)
            break;
        case 1:
            await marginFirstCase(req, res, next, availableMargin, margin, battle, data)
            break;
        case 2:
            await marginSecondCase(req, res, next, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(req, res, next, netPnl)
            break;
        case 4:
            await marginFourthCase(req, res, next, availableMargin, runningLotForSymbol, battle, data)
            break;
    }
}

