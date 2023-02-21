const HistoryInstrumentData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const DailyPnlData = require("../models/InstrumentHistoricalData/DailyPnlDataSchema");
const MockTradeData = require("../models/mock-trade/mockTradeUserSchema");
const UserDetail = require("../models/User/userDetailSchema");
const MarginAllocation = require('../models/marginAllocation/marginAllocationSchema');
const axios = require("axios");
const getKiteCred = require('../marketData/getKiteCred'); 
const MarginCall = require('../models/marginAllocation/MarginCall');
const { v4: uuidv4 } = require('uuid');
 

exports.fundCheck = async(req, res, next) => {

    const {exchange, symbol, buyOrSell, variety,
           Product, OrderType, Quantity, userId} = req.body;
    

    //console.log("margin req", req.body)

    getKiteCred.getAccess().then(async (data)=>{
            let date = new Date();
            let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

            // const api_key = data.getApiKey;
            // const access_token = data.getAccessToken;
            let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
            // let auth = "token nq0gipdzk0yexyko:kDkeVh0s1q71pdlysC0x2a8Koecv4lmZ"
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

            const user = await UserDetail.findOne({email: userId});
            const userFunds = user.fund;

            // let runningLots = await MockTradeData.aggregate([
            //     {
            //     $match:
            //         {
            //             trade_time: {$regex: todayDate},
            //             symbol: symbol,
            //             userId: userId,
            //             status: "COMPLETE",
            //         }
            //     },
            //     {
            //     $group:
            //         {
            //         _id: {symbol: "$symbol"},
            //         runningLots: {
            //           $sum: {$toInt: "$Quantity"}
            //         }
            //       }
            //     },
            // ]);

            let allRunningLots = await MockTradeData.aggregate([
                {
                $match:
                    {
                        trade_time: {$regex: todayDate},
                        userId: userId,
                        status: "COMPLETE",
                    }
                },
                {
                $group:
                    {
                    _id: {symbol: '$symbol', instrumentToken: '$instrumentToken', exchange: '$exchange'},
                    runningLots: {
                      $sum: {$toInt: "$Quantity"}
                    }
                  }
                },
            ]);

            let currentRunningLots = allRunningLots.filter((lot)=>{return lot._id.symbol === symbol});

            //Traverse the array allRunningLots
            let runningPnl = 0 ;
            let searchQuery = '';
            if(allRunningLots.length >0){
                allRunningLots.forEach(element => {
                    searchQuery == ''?
                        searchQuery = searchQuery + 'i=' + element._id.instrumentToken:
                        searchQuery = searchQuery + '&i=' + element._id.instrumentToken; 
                });
            }

            //Send request and get ltp
            if(searchQuery.length){
                try{
                    const resp = await axios.get(`https://api.kite.trade/quote/ltp?${searchQuery}`,{headers: headers});
                    const livePrices = resp.data.data;
        
                    runningPnl = allRunningLots.map(lot => lot.runningLots * livePrices[lot._id.instrumentToken].last_price)
                                              .reduce((total, pnl) => total + pnl, 0);
                }catch(e){
                    console.log(e);
                }
            }
            

            


            // let isSymbolMatch = true;
            // let isLesserQuantity = false;
            // let isOpposite = false;
            let transactionTypeRunningLot = currentRunningLots[0]?.runningLots > 0 ? "BUY" : "SELL";
            // if(runningLots[0]?._id?.symbol !== symbol){
            //     isSymbolMatch = false;
            // } 
            // if(Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots)){
            //     isLesserQuantity = true;
            // }
            // if(transactionTypeRunningLot !== buyOrSell){
            //     isOpposite = true;
            // }
            console.log(transactionTypeRunningLot, currentRunningLots[0]?._id?.symbol, Math.abs(Number(Quantity)), Math.abs(currentRunningLots[0]?.runningLots))
            let marginData;
            let zerodhaMargin;

            // if( (!runningLots[0]?.runningLots) || ((runningLots[0]?._id?.symbol !== symbol) && Math.abs(Number(Quantity)) <= Math.abs(runningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
             
                marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, {headers : headers})
                console.log(marginData);
                zerodhaMargin = marginData.data.data.orders[0].total;
            // }


            let pnlDetails = await MockTradeData.aggregate([
                {
                $match:
                    {
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



            let userNetPnl = pnlDetails[0].npnl;
            console.log( userFunds , userNetPnl , runningPnl, zerodhaMargin);
            console.log((userFunds + userNetPnl + runningPnl - zerodhaMargin));
            if(((currentRunningLots[0]?._id?.symbol === symbol) && Math.abs(Number(Quantity)) <= Math.abs(currentRunningLots[0]?.runningLots) && (transactionTypeRunningLot !== buyOrSell))){
                next();
            } else{
                if(Number(userFunds + userNetPnl + runningPnl - zerodhaMargin)  < 0){
                    let uid = uuidv4();
                    let {exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType,
                        TriggerPrice, validity, variety, createdBy,
                         createdOn, uId, algoBox, instrumentToken, realTrade, realBuyOrSell, realQuantity, apiKey, 
                         accessToken, userId, checkingMultipleAlgoFlag, real_instrument_token, realSymbol} = req.body;

                    let dateNow = new Date().toISOString().split('T').join(' ').split('.')[0];    
                    
                    try{
                        const marginCall = new MarginCall({status: 'MARGIN CALL', uId: uid, createdBy: createdBy, average_price: Price, Quantity: Quantity, Product:Product,
                         buyOrSell: buyOrSell, order_timestamp: dateNow, validity: validity, exchange: exchange, order_type: OrderType, variety: variety,
                        symbol: symbol, instrumentToken: instrumentToken, tradeBy: createdBy, amount: Number(Quantity)*Number(Price), trade_time: dateNow, lastModifiedBy: userId});
    
                        await marginCall.save();
                    }catch(e){
                        console.log(e);
                    }

                    return res.status(401).json({status: 'Failed', message: 'You dont have sufficient funds to take this trade. Please try with smaller lot size.'});
                }
                else{
                    next();
                }
            }     
    }).catch((e)=>{console.log(e)});
    
   
}

// api create for getting running lots today acc. symbol
// whn usr trd check symbol is matching
// if match 1. if current qnty is lesser from quntity + and opposite trnctio type then return next()
// if 2. crrnt qnty 