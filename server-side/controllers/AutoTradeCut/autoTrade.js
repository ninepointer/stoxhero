const Subscription = require("../../models/TenXSubscription/TenXSubscriptionSchema");
const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const User = require("../../models/User/userDetailSchema");
const BrokerageDetail = require("../../models/Trading Account/brokerageSchema");
const singleLivePrice = require('../../marketData/sigleLivePrice');
const {client, getValue} = require('../../marketData/redisClient');

exports.takeAutoTenxTrade = async (tradeDetails) => {
  tradeDetails = JSON.parse(tradeDetails)
    let isRedisConnected = getValue();
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    let { exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId,
        validity, variety, algoBoxId, order_id, instrumentToken, portfolioId, tenxTraderPath,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, isAlgoTrader, paperTrade, autoTrade, 
          dontSendResp} = tradeDetails;
  
          console.log("tradeDetails", tradeDetails)
          let createdBy ;
          if(autoTrade){
            // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
            let system = await User.findOne({email: "system@ninepointer.in"})
            createdBy = system._id
            console.log("createdBy", createdBy)
          } else{
            createdBy = trader
          }
          //console.log("req.body", tradeDetails)
  
      const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
      const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});
  
  
    if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !OrderType || !validity || !variety){
        ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(OrderType)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
        if(!dontSendResp){
          console.log("Please fill all fields, autotrade");
          // return res.status(422).json({error : "please fill all the feilds..."})
        } else{
          return;
        }
    }
  
    if(buyOrSell === "SELL"){
        Quantity = "-"+Quantity;
    }
  
    //console.log("1st")
    let originalLastPriceUser;
    let newTimeStamp = "";
    let trade_time = "";
    try{
        
      //console.log("above")
        let liveData = await singleLivePrice(exchange, symbol)
        // //console.log(liveData)
        for(let elem of liveData){
            if(elem.instrument_token == instrumentToken){
                newTimeStamp = elem.timestamp;
                originalLastPriceUser = elem.last_price;
            }
        }
  
  
        trade_time = new Date(newTimeStamp);
        console.log("trade_time", trade_time)
    } catch(err){
        console.log(err)
        return new Error(err);
    }
  
    //console.log("2nd")
  
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
  
    // //console.log("3st")
    if(buyOrSell === "BUY"){
        brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    } else{
        brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
    }
    
    TenxTrader.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
        }
  
  
        // //console.log("4st")
        const tenx = new TenxTrader({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId,
            createdBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,        
        });
  
        // console.log("tenx", tenx);
        tenx.save().then(async ()=>{
            if(isRedisConnected && await client.exists(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)){
                //console.log("in the if condition")
                let pnl = await client.get(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
                pnl = JSON.parse(pnl);
                //console.log("before pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenx.instrumentToken && element._id.product === tenx.Product ));
      
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

            if(isRedisConnected){
                await client.expire(`${trader.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
            }
  
        }).catch((err)=> {
            console.log("in err autotrade", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
        
    }).catch(err => {console.log( "fail", err)});  
      
}