const axios = require("axios")
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const PaperTrade = require("../models/mock-trade/paperTrade");
const singleLivePrice = require('../marketData/sigleLivePrice');
const StoxheroTrader = require("../models/mock-trade/stoxheroTrader");
const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../models/mock-trade/infinityTradeCompany");
const StoxheroTradeCompany = require("../models/mock-trade/stoxheroTradeCompany");


exports.mockTrade = async (req, res) => {
    console.log("in mock trade")

    let stoxheroTrader ;
    const AlgoTrader = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTrader : InfinityTrader;
    const MockTradeDetails = (req.user.isAlgoTrader && stoxheroTrader) ? StoxheroTradeCompany : InfinityTradeCompany;

    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType,
        validity, variety, createdBy, userId, uId, algoBoxId, order_id, instrumentToken,  
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade } = req.body 


      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
        //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
    if(realBuyOrSell === "SELL"){
        realQuantity = "-"+realQuantity;
    }

    let originalLastPriceUser;
    let originalLastPriceCompany;
    let newTimeStamp = "";
    let trade_time = "";
    try{
        // console.log("above data")
        let liveData = await singleLivePrice(exchange, symbol)
        // console.log("live data", liveData)
        for(let elem of liveData){
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                console.log("zerodha date", elem.timestamp)
                originalLastPriceUser = elem.last_price;
                originalLastPriceCompany = elem.last_price;
            }
        }

        trade_time = new Date(newTimeStamp);

    } catch(err){
        return new Error(err);
    }



    function buyBrokerage(totalAmount){
        let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
        let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge;
    }

    function sellBrokerage(totalAmount){
        let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
        let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
        let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
        let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
        let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
        let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
        let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
        return finalCharge
    }

    let brokerageUser;
    let brokerageCompany;

    if(realBuyOrSell === "BUY"){
        brokerageCompany = buyBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    } else{
        brokerageCompany = sellBrokerage(Math.abs(Number(realQuantity)) * originalLastPriceCompany);
    }

    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
    
    console.log(paperTrade, isAlgoTrader);
    if(!paperTrade && isAlgoTrader){
        MockTradeDetails.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
                console.log("data already in mock company", checkingMultipleAlgoFlag);
                return res.status(422).json({error : "date already exist..."})
            }
    
            const mockTradeDetails = new MockTradeDetails({
                status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
                Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: OrderType, 
                symbol: realSymbol, placed_by: "ninepointer", algoBox:algoBoxId, order_id, 
                instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
                trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
                trade_time:trade_time,
                
            });
    
            // console.log("mockTradeDetails comapny", mockTradeDetails);
            mockTradeDetails.save().then(()=>{
                
            }).catch(err => {console.log(err, "fail")});
            
        }).catch(err => {console.log(err, "fail")});
    
        AlgoTrader.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
    
            const algoTrader = new AlgoTrader({
                status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, 
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });
    
            // console.log("mockTradeDetails", algoTrader);
            algoTrader.save().then(()=>{
                console.log("sending response");
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
            
    
        }).catch(err => {console.log("fail", err)});    
    }
    
    if(paperTrade){
        
        PaperTrade.findOne({order_id : order_id})
        .then((dateExist)=>{
            if(dateExist){
                //console.log("data already");
                return res.status(422).json({error : "date already exist..."})
            }
    
            const paperTrade = new PaperTrade({
                status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, 
                createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
                
            });
    
            //console.log("mockTradeDetails", paperTrade);
            paperTrade.save().then(()=>{
                console.log("sending response");
                res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });
            
    
        }).catch(err => {console.log(err, "fail")});  
    }

}