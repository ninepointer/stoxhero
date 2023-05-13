// const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
// const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
// const MockTradeDataUser = require("../models/mock-trade/mockTradeUserSchema");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const StoxheroTrader = require("../models/mock-trade/stoxheroTrader");
const PaperTrade = require("../models/mock-trade/paperTrade");
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeContest = require("../models/Contest/ContestTrade");

// const Contest = require("../models/Contest/contestSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");

const UserDetail = require("../models/User/userDetailSchema");
// const MarginAllocation = require('../models/marginAllocation/marginAllocationSchema');
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const MarginCall = require('../models/marginAllocation/MarginCall');
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");

const ObjectId = require('mongodb').ObjectId;

const { v4: uuidv4 } = require('uuid');
 

exports.fundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity} = req.body;
    // let stoxheroTrader;
    console.log(req.user._id);
    // const AlgoTrader = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTrader : InfinityTrader;
    // const InfinityTradeCompany = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTradeCompany : InfinityTradeCompany;

    getKiteCred.getAccess().then(async (data)=>{

        const userId = req.user._id;
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

        let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
        let headers = {
            'X-Kite-Version':'3',
            'Authorization': auth,
            "content-type" : "application/json"
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
        try{
            // if(req.user.isAlgoTrader && stoxheroTrader){
            // } else{

            // }
            const user = await UserDetail.findOne({_id: new ObjectId(req.user._id)});
            userFunds = user.fund;

        }catch(e){
            console.log("errro fetching user", e);
        }

        let runningLots;
        try{
            runningLots = await InfinityTrader.aggregate([
                {
                $match:
                    {
                        trade_time:{
                            $gte: today
                        },
                        status: "COMPLETE",
                        trader: new ObjectId(userId),
                        symbol: symbol
                    }
                },
                {
                $group:
                    {
                    _id: {symbol: "$symbol"},
                    runningLots: {
                        $sum: {$toInt: "$Quantity"}
                    }
                    }
                },
            ])
        } catch(e){
            console.log("errro fetching pnl", e);
        }


        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if(runningLots[0]?._id?.symbol !== symbol){
            isSymbolMatch = false;
        } 
        if(Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)){
            isLesserQuantity = true;
        }
        if(transactionTypeRunningLot !== buyOrSell){
            isOpposite = true;
        }

        console.log(runningLots, userFunds)
        if(((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            //console.log("checking runninglot- reverse trade");
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try{
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
            zerodhaMargin = marginData.data.data.orders[0].total;
        }catch(e){
            // console.log("error fetching zerodha margin", e);
        } 
        let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let firstDayOfMonthDate = `${(firstDayOfMonth.getFullYear())}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
        let lastDayOfMonthDate = `${(lastDayOfMonth.getFullYear())}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
        lastDayOfMonthDate = new Date(lastDayOfMonthDate);
        firstDayOfMonthDate = new Date(firstDayOfMonthDate);

        console.log(firstDayOfMonthDate, lastDayOfMonthDate)
        let pnlDetails = await InfinityTrader.aggregate([
            {
            $match:
                {
                    trade_time: {
                        $gte: (firstDayOfMonthDate),
                        $lte: (lastDayOfMonthDate)
                        },
                    trader: new ObjectId(userId),
                    status: "COMPLETE",
                },
            },
            {
            $group:
                {
                _id: {
                    trader: "$trader",
                    // trader: "$createdBy",
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
        console.log( userFunds , userNetPnl , zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if(Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            console.log("user wants square off")
            return next();
        } else{
            console.log("in else", Boolean(!userFunds))
            if(!userFunds || (userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin)  < 0 : Number(userFunds - zerodhaMargin)) < 0){
                let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                    TriggerPrice, validity, variety, createdBy, algoBoxId, instrumentToken, realTrade,
                        realBuyOrSell, realQuantity, apiKey, accessToken, userId, checkingMultipleAlgoFlag, 
                        real_instrument_token, realSymbol, trader, order_id} = req.body;
                
                try{
                    if(req.user.isAlgoTrader){
                        
                        const mockTradeCompany = new InfinityTradeCompany({
                            status:"REJECTED", status_message: "insufficient fund", average_price: null, Quantity: realQuantity, 
                            Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol: realSymbol, 
                            placed_by: "stoxhero", algoBox: algoBoxId, order_id, instrumentToken: real_instrument_token, 
                            brokerage: null, createdBy: req.user._id,trader : trader, isRealTrade: false, amount: null, 
                            trade_time:new Date(),
                        });
                        await mockTradeCompany.save();
                    }
                    const algoTrader = new InfinityTrader({
                        status:"REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: req.body.order_id, instrumentToken, brokerage: null, 
                        createdBy: req.user._id,trader: req.user._id, amount: null, trade_time: new Date(),
                        
                    });    
                    console.log("margincall saving")
                    await algoTrader.save();
                }catch(e){
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
            } 
            else{
                console.log("if user have enough funds")
                console.log("caseStudy 7: fund check")
                return next();
            }
        }     
    }); 
}

exports.fundCheckPaperTrade = async(req, res, next) => {

    console.log("in fundCheckPaperTrade")
    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity} = req.body;
    

    getKiteCred.getAccess().then(async (data)=>{

        let userFunds;
        let runningLots;
        let date = new Date();
        let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        todayDate = todayDate + "T00:00:00.000Z";
        const today = new Date(todayDate);

        let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
        let headers = {
            'X-Kite-Version':'3',
            'Authorization': auth,
            "content-type" : "application/json"
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

        try{
            runningLots = await PaperTrade.aggregate([
                {
                $match:
                    {
                        trade_time:{
                            $gte: today
                        },
                        symbol: symbol,
                        trader: req.user._id,
                        status: "COMPLETE",
                    }
                },
                {
                $group:
                    {
                    _id: {symbol: "$symbol"},
                    runningLots: {
                        $sum: {$toInt: "$Quantity"}
                    }
                    }
                },
            ])
        } catch(e){
            console.log("errro fetching pnl", e);
        }

        let isSymbolMatch = true;
        let isLesserQuantity = false;
        let isOpposite = false;
        let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
        if(runningLots[0]?._id?.symbol !== symbol){
            isSymbolMatch = false;
        } 
        if(Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)){
            isLesserQuantity = true;
        }
        if(transactionTypeRunningLot !== buyOrSell){
            isOpposite = true;
        }

        const myPortfolios = await Portfolio.find({status: "Active", "users.userId": req.user._id, portfolioType: "Virtual Trading"});
        req.body.portfolioId = myPortfolios[0]._id;
        console.log(runningLots, userFunds)
        if(((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            return next();
        }
        let marginData;
        let zerodhaMargin;

        try{
            marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
            zerodhaMargin = marginData.data.data.orders[0].total;
        }catch(e){
            // console.log("error fetching zerodha margin", e);
        } 

        let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let firstDayOfMonthDate = `${(firstDayOfMonth.getFullYear())}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
        let lastDayOfMonthDate = `${(lastDayOfMonth.getFullYear())}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}T00:00:00.000Z`
        lastDayOfMonthDate = new Date(lastDayOfMonthDate);
        firstDayOfMonthDate = new Date(firstDayOfMonthDate);

        console.log(firstDayOfMonthDate, lastDayOfMonthDate);
        let pnlDetails = await PaperTrade.aggregate([
            {
            $match:
                {
                    trade_time: {
                        $gte: (firstDayOfMonthDate),
                        $lte: (lastDayOfMonthDate)
                        },
                    trader: req.user._id,
                    status: "COMPLETE",
                },
            },
            {
            $group:
                {
                _id: {
                    trader: "$trader",
                    // trader: "$createdBy",
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

        let userNetPnl = pnlDetails[0]?.npnl;

        
        // const myPortfolios = await Portfolio.find({status: "Active", "users.userId": req.user._id, portfolioType: "Virtual Trading"});
        let addPortfolioFund = 0;
        let flag = false;
        for(let i = 0; i < myPortfolios.length; i++){
            let fund = myPortfolios[i].portfolioValue;
            if(!flag && userNetPnl ? Number(fund + userNetPnl - zerodhaMargin) > 0 : Number(fund - zerodhaMargin) > 0){
                userFunds = fund;
                req.body.portfolioId = myPortfolios[i]._id;
                break;
            } else if (fund > 0){
                flag = true;
                addPortfolioFund += fund;
                if(userNetPnl ? Number(addPortfolioFund + userNetPnl - zerodhaMargin) > 0 : Number(addPortfolioFund - zerodhaMargin) > 0){
                    userFunds = addPortfolioFund;
                    req.body.portfolioId = myPortfolios[i-1]._id;
                }
            }
        }

        // 20 15
        // 10 15 -->2nd 50
        // 0  15
        console.log("portfolio", req.body.portfolioId)
        console.log( userFunds , userNetPnl , zerodhaMargin)
        console.log((userFunds + userNetPnl - zerodhaMargin))

        if(Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            console.log("user wants square off")
            return next();
        } else{
            console.log("in else")
            if(userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin)  < 0 : Number(userFunds - zerodhaMargin) < 0){
                let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, createdBy,
                     instrumentToken, trader, order_id} = req.body;
                
                try{

                    const paperTrade = new PaperTrade({
                        status:"REJECTED", status_message: "insufficient fund", average_price: null, Quantity, Product, buyOrSell,
                        variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                        order_id: order_id, instrumentToken, brokerage: null, createdBy: req.user._id, 
                        trader: trader, amount: null, trade_time: new Date()
                        
                    });    
                    console.log("margincall saving")
                    await paperTrade.save();
                }catch(e){
                    console.log("error saving margin call", e);
                }

                //console.log("sending response from authorise trade");
                return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
            } 
            else{
                console.log("if user have enough funds")
                return next();
            }
        }     
    });
}

exports.contestFundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, portfolioId} = req.body;

    const contestId = req.params.id;
    const userId = req.user._id;

    console.log(contestId, userId)

    getKiteCred.getAccess().then(async (data)=>{
    // console.log(data)

            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

            // const api_key = data.getApiKey;
            // const access_token = data.getAccessToken;
            let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
            // let auth = "token nq0gipdzk0yexyko:kDkeVh0s1q71pdlysC0x2a8Koecv4lmZ"
            //console.log(auth)
            let headers = {
                'X-Kite-Version':'3',
                'Authorization': auth,
                "content-type" : "application/json"
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

            console.log(orderData);
            let contestFunds;
            try{
                const portfolio = await Portfolio.findById({_id: portfolioId});
                // console.log("portfolio", portfolio)
                const users = portfolio.users.filter((elem)=>{
                    return (elem.userId).toString() == (userId).toString();
                })   

                console.log("users", users)
                // (user => user.userId);


                // const contest = await Contest.findOne({_id: contestId});
                contestFunds = users[0].portfolioValue;
                // contestFunds = 10000000;
            }catch(e){
                console.log("errro fetching contest", e);
            }

            let runningLots;
            try{

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
                        _id: {symbol: "$symbol"},
                        runningLots: {
                          $sum: {$toInt: "$Quantity"}
                        }
                      }
                    },
                ])
            } catch(e){
                console.log("errro fetching pnl", e);

            }

            let isSymbolMatch = true;
            let isLesserQuantity = false;
            let isOpposite = false;
            let transactionTypeRunningLot = runningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
            if(runningLots[0]?._id?.symbol !== symbol){
                isSymbolMatch = false;
            } 
            if(Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)){
                isLesserQuantity = true;
            }
            if(transactionTypeRunningLot !== buyOrSell){
                isOpposite = true;
            }

            console.log("lots and fund", runningLots, contestFunds)
            if(((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                console.log("checking runninglot- reverse trade");
                next();
                return ;
            }
            //console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            try{
                // console.log("fetching margin data")
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                
                zerodhaMargin = marginData.data.data.orders[0].total;
                // console.log("zerodhaMargin", marginData);
            }catch(e){
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
            console.log( contestFunds , userNetPnl , zerodhaMargin)
            console.log((contestFunds + userNetPnl - zerodhaMargin))
            // if(( !runningLots[0]?.runningLots || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) && Number(contestFunds + userNetPnl - zerodhaMargin)  < 0){
            // if(( !runningLots[0]?.runningLots || (((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot == buyOrSell))) && Number(contestFunds + userNetPnl - zerodhaMargin)  < 0){   
                // //console.log("in if")
                // return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
            if(Number(contestFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                console.log("user wants square off")
                return next();
            } else{
                console.log("in else")
                if(userNetPnl !== undefined ? Number(contestFunds + userNetPnl - zerodhaMargin)  < 0 : Number(contestFunds - zerodhaMargin) < 0){
                    let uid = uuidv4();
                    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
                        validity, variety, instrumentToken, realSymbol, trader} = req.body;


                    try{ 
                        
                        const mockTradeContest = new MockTradeContest({
                            status:"REJECTED", status_message: "insufficient fund",average_price: null, Quantity, Product, buyOrSell,
                            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                            order_id: req.body.order_id, instrumentToken, brokerage: null, contestId: req.params.id,
                            createdBy: req.user._id,trader: trader, amount: null, trade_time: new Date(), portfolioId: req.body.portfolioId
                            
                        });

                        console.log("margincall saving", mockTradeContest)
                        await mockTradeContest.save();

                    }catch(e){
                        console.log("error saving margin call", e);
                    }

                    //console.log("sending response from authorise trade");
                    return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                } 
                
                
                else{
                    console.log("if user have enough funds")
                    return next();
                }
            }     
    });
    
   
}

//mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority
