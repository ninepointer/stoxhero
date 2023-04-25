// const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
// const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeDataUser = require("../models/mock-trade/mockTradeUserSchema");
const MockTradeTrader = require("../models/mock-trade/mockTradeTraders");
const MockTradeCompany = require("../models/mock-trade/mockTradeCompanySchema")
const MockTradeContest = require("../models/Contest/ContestTrade");

// const Contest = require("../models/Contest/contestSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");

// const UserDetail = require("../models/User/userDetailSchema");
// const MarginAllocation = require('../models/marginAllocation/marginAllocationSchema');
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const MarginCall = require('../models/marginAllocation/MarginCall');
const ObjectId = require('mongodb').ObjectId;

const { v4: uuidv4 } = require('uuid');
 

exports.fundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, userId} = req.body;
    
    const MockTrade = req.user.isAlgoTrader ? MockTradeDataUser : MockTradeTrader;
    ////console.log("margin req", req.body)

    getKiteCred.getAccess().then(async (data)=>{
    // //console.log(data)

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
            let orderData =     [{
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
            try{ //portfolioType
                if(req.user.isAlgoTrader){
                    const myPortfolios = await Portfolio.findOne({status: "Active", "users.userId": req.user._id, portfolioType: "Equity Trading"});
                    userFunds = myPortfolios.portfolioValue;
                } else{
                    // console.log("in userfund if")
                    const myPortfolios = await Portfolio.findOne({status: "Active", "users.userId": req.user._id, portfolioType: "Trading"});
                    // console.log(myPortfolios)
                    userFunds = myPortfolios.portfolioValue;
                }
                // const user = await UserDetail.findOne({email: userId});
                // userFunds = user.fund;
            }catch(e){
                console.log("errro fetching user", e);
            }

            let runningLots;
            try{

                runningLots = await MockTrade.aggregate([
                    {
                    $match:
                        {
                            trade_time: {$regex: todayDate},
                            symbol: symbol,
                            userId: userId,
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

            console.log(runningLots, userFunds)
            if(((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                //console.log("checking runninglot- reverse trade");
                return next();
            }
            //console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            try{
                //console.log("fetching margin data")
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                
                zerodhaMargin = marginData.data.data.orders[0].total;
                //console.log("zerodhaMargin", zerodhaMargin);
            }catch(e){
                // console.log("error fetching zerodha margin", e);
            } 
            // }


            //TODO: get user pnl data and replace 0 with the value 
            // let date = new Date();
            let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            let firstDayOfMonthDate = `${(firstDayOfMonth.getFullYear())}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}`
            let lastDayOfMonthDate = `${(lastDayOfMonth.getFullYear())}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`
            console.log(firstDayOfMonthDate, lastDayOfMonthDate)
            let pnlDetails = await MockTrade.aggregate([
                {
                $match:
                    {
                        trade_time: {
                            $gte: (firstDayOfMonthDate),
                            $lt: (lastDayOfMonthDate)
                          },
                        userId: userId,
                        status: "COMPLETE",
                    },
                },
                {
                $group:
                    {
                    _id: {
                        email: "$userId",
                        trader: "$createdBy",
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

            console.log("pnlDetails", pnlDetails)
            let userNetPnl = pnlDetails[0]?.npnl;
            console.log( userFunds , userNetPnl , zerodhaMargin)
            console.log((userFunds + userNetPnl - zerodhaMargin))
            // if(( !runningLots[0]?.runningLots || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) && Number(userFunds + userNetPnl - zerodhaMargin)  < 0){
            // if(( !runningLots[0]?.runningLots || (((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot == buyOrSell))) && Number(userFunds + userNetPnl - zerodhaMargin)  < 0){   
                // //console.log("in if")
                // return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
            if(Number(userFunds + userNetPnl) >= 0 && ((runningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                console.log("user wants square off")
                return next();
            } else{
                console.log("in else")
                if(userNetPnl !== undefined ? Number(userFunds + userNetPnl - zerodhaMargin)  < 0 : Number(userFunds - zerodhaMargin) < 0){
                    let uid = uuidv4();
                    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                        TriggerPrice, validity, variety, createdBy,
                            createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                            accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol, trader, order_id} = req.body;
                    // let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];    
                    
                    let date = new Date();
                    let dateString = date.toISOString();
                    let date1 = dateString.split("T");
                    let date2 = date1[1].split(".");
                    let trade_time = date1[0]+" "+date2[0];
                    let date3 = date1[0].split("-");
                    let newTimeStamp = `${date3[2]}-${date3[1]}-${date3[0]} ${date2[0]}`;
                    
                    console.log(newTimeStamp, trade_time);
                    try{
                        if(req.user.isAlgoTrader){
                            
                            let {algoName, transactionChange, instrumentChange, exchangeChange, 
                                lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault} = algoBox

                            const mockTradeCompany = new MockTradeCompany({
                                status:"REJECTED", status_message: "insufficient fund", uId, createdBy, average_price: null, Quantity: realQuantity, 
                                Product, buyOrSell:realBuyOrSell, order_timestamp: newTimeStamp,
                                variety, validity, exchange, order_type: OrderType, symbol: realSymbol, placed_by: "stoxhero", userId,
                                    algoBox:{algoName, transactionChange, instrumentChange, exchangeChange, 
                                lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault}, order_id, instrumentToken: real_instrument_token, brokerage: null,
                                tradeBy: createdBy,trader : req.user._id, isRealTrade: false, amount: null, trade_time:trade_time,
                                
                            });
                            await mockTradeCompany.save();
                        }
                        const mockTradeDetailsUser = new MockTrade({
                            status:"REJECTED", status_message: "insufficient fund", uId, createdBy, average_price: null, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
                            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", userId,
                            order_id: req.body.order_id, instrumentToken, brokerage: null, 
                            tradeBy: createdBy,trader: req.user._id, amount: null, trade_time:trade_time,
                            
                        });    
                        console.log("margincall saving")
                        await mockTradeDetailsUser.save();
                    }catch(e){
                        console.log("error saving margin call", e);
                    }

                    //console.log("sending response from authorise trade");
                    return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                } 
                
                // else if(Number(userFunds - zerodhaMargin) < 0){
                //     let uid = uuidv4();
                //     let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                //         TriggerPrice, validity, variety, createdBy,
                //             createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                //             accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol, trader} = req.body;

                //     let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];  
                //     //  2023-04-25T18:29:59.720Z
                //     let date = new Date();
                //     let date1 = date.split("T");
                //     let date2 = date1[1].split(".");
                //     let trade_time = date1[0]+" "+date2[0];
                //     let date3 = date1.split("-");
                //     let newTimeStamp = `${date3[2]}-${date3[1]}-${date3[0]} ${date2[0]}`

                //     console.log(newTimeStamp, trade_time)
                    
                //     try{
                //         const mockTradeDetailsUser = new MockTrade({
                //             status:"REJECTED", status_message: "insufficient fund", uId, createdBy, average_price: null, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
                //             variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", userId,
                //             order_id: req.body.order_id, instrumentToken, brokerage: null, 
                //             tradeBy: createdBy,trader: req.user._id, amount: null, trade_time:trade_time,
                            
                //         });    
                //         console.log("margincall saving")
                //         await mockTradeDetailsUser.save();
                //     }catch(e){
                //         console.log("error saving margin call", e);
                //     }

                //     //console.log("sending response from authorise trade");
                //     return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                // }
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
           // const MockTrade = req.user.isAlgoTrader ? MockTradeDataUser : MockTradeTrader;
    ////console.log("margin req", req.body)

    console.log(contestId, userId)

    getKiteCred.getAccess().then(async (data)=>{
    // //console.log(data)

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
            let orderData =     [{
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
                //console.log("checking runninglot- reverse trade");
                next();
                return ;
            }
            //console.log(transactionTypeRunningLot, runningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(runningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
            try{
                //console.log("fetching margin data")
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                
                zerodhaMargin = marginData.data.data.orders[0].total;
                //console.log("zerodhaMargin", zerodhaMargin);
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
                        email: "$userId",
                        trader: "$createdBy",
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

            console.log("pnlDetails", pnlDetails)


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
                    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                        TriggerPrice, validity, variety, createdBy,
                            createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                            accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol, trader} = req.body;

                    // let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];    
                    const now = new Date();
                    const date = new Date(now.getTime() - 330 * 60000); // 30 minutes * 60 seconds * 1000 milliseconds
                    let dateString = date.toISOString();
                    let date1 = dateString.split("T");
                    let date2 = date1[1].split(".");
                    let trade_time = date1[0]+" "+date2[0];
                    let date3 = date1[0].split("-");
                    let newTimeStamp = `${date3[2]}-${date3[1]}-${date3[0]} ${date2[0]}`;
                    
                    console.log(newTimeStamp, trade_time);

                    try{
                        // const mockTradeContest = new MockTradeContest({
                        //     status:"REJECTED", status_message: "insufficient fund", uId, createdBy, average_price: null, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
                        //     variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", userId,
                        //     order_id: req.body.order_id, instrumentToken, brokerage: null, 
                        //     tradeBy: req.user._id,trader: req.user._id, amount: null, trade_time:trade_time,
                            
                        // });   
                        
                        const mockTradeContest = new MockTradeContest({
                            status:"REJECTED", status_message: "insufficient fund", uId, createdBy, average_price: null, Quantity, Product, buyOrSell, order_timestamp: newTimeStamp,
                            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", userId,
                            order_id: req.body.order_id, instrumentToken, brokerage: null, contestId: req.params.id,
                            tradeBy: req.user._id,trader: req.user._id, amount: null, trade_time:trade_time, portfolioId: req.body.portfolioId, employeeid: req.user.employeeid
                            
                        });

                        console.log("margincall saving", mockTradeContest)
                        await mockTradeContest.save();

                    }catch(e){
                        console.log("error saving margin call", e);
                    }

                    //console.log("sending response from authorise trade");
                    return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                } 
                
                // else if(Number(contestFunds - zerodhaMargin) < 0){
                //     let uid = uuidv4();
                //     let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                //         TriggerPrice, validity, variety, createdBy,
                //             createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                //             accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol, trader} = req.body;

                //     let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];    
                    
                //     try{
                //         const marginCall = new MarginCall({status: 'MARGIN CALL', uId: uid, createdBy: createdBy, average_price: zerodhaMargin/Quantity, Quantity: Quantity, Product:Product,
                //             buyOrSell: buyOrSell, order_timestamp: dateNow, validity: validity, exchange: exchange, order_type: OrderType, variety: variety,
                //         symbol: symbol, instrumentToken: instrumentToken, tradeBy: createdBy, marginCallFor: trader, amount: Number(Quantity)*Number(Price), trade_time: dateNow, lastModifiedBy: userId});
    
                //         console.log("margincall saving")
                //         await marginCall.save();
                //     }catch(e){
                //         console.log("error saving margin call", e);
                //     }

                //     //console.log("sending response from authorise trade");
                //     return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                // }
                else{
                    console.log("if user have enough funds")
                    return next();
                }
            }     
    });
    
   
}

