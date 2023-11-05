const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema")
const mongoose = require('mongoose')
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");
const { client } = require("../../marketData/redisClient");
const {tenx} = require("../../constant");

exports.tenxTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, stopProfitPrice, stopLossPrice, deviceDetails, margin, price } = req.body 

      // console.log(req.body)
  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

  const session = await mongoose.startSession();

  try {
    const tenxCheck = await TenxTrader.findOne({ order_id: order_id });
    if (tenxCheck) {
      return res.status(422).json({ status: "error", message: "something went wrong." })
    }

    session.startTransaction();
    // let pnlRedis = "";

    const tenxDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
      createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
      deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType},
      margin
    }

    const save = (order_type !== "LIMIT") && await TenxTrader.create([tenxDoc], { session });

    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    pnl = JSON.parse(pnl);
    let reverseTradeConditionData;
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product && !element._id.isLimit));
    if(matchingElement){
      const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
      if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== tenxDoc.buyOrSell) && (order_type !== "LIMIT")){
        reverseTradeConditionData = await reverseTradeCondition(req.user._id, subscriptionId, tenxDoc, stopLossPrice, stopProfitPrice, save[0]?._id, originalLastPriceUser, pnl, tenx);
      }
    }

    if(reverseTradeConditionData === 0){
      console.log("from reverse trade")
      stopLossPrice = 0;
      stopProfitPrice = 0;
    }

    const pnlRedis = await saveInRedis(req, tenxDoc, subscriptionId);

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
    }


    let pendingOrderRedis;
    if(stopLossPrice || stopProfitPrice || price){
      pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, save[0]?._id, tenx);
    } else{
      pendingOrderRedis = "OK";
    }
    
    console.log(pendingOrderRedis, pnlRedis)
    if (pendingOrderRedis === "OK" && pnlRedis === "OK") {
      await session.commitTransaction();
      res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
    }
  } catch (err) {
    await client.del('stoploss-stopprofit');
    await client.del(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
  } finally {
    session.endSession();
  }
}

const saveInRedis = async (req, tenxDoc, subscriptionId)=>{
  const {margin, order_type} = req.body;

  console.log('ordertypes', order_type, tenxDoc)
  if (await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    pnl = JSON.parse(pnl);

    if(order_type === "LIMIT"){

      const matchingElement = pnl.find((element) => 
      {
        const type = element.lots >= 0 ? "BUY" : "SELL"
        return (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product && tenxDoc.order_type === "LIMIT" && element._id.isLimit && type===tenxDoc.buyOrSell  )

      });
      // const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product && tenxDoc.order_type === "LIMIT" && element._id.isLimit  ));
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement._id.isLimit = true;
        matchingElement.amount += (tenxDoc.amount * -1);
        matchingElement.brokerage += Number(tenxDoc.brokerage);
        matchingElement.lastaverageprice = tenxDoc.average_price;
        matchingElement.lots += Number(tenxDoc.Quantity);
        matchingElement.margin += margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: tenxDoc.symbol,
            product: tenxDoc.Product,
            instrumentToken: tenxDoc.instrumentToken,
            exchangeInstrumentToken: tenxDoc.exchangeInstrumentToken,
            exchange: tenxDoc.exchange,
            validity: tenxDoc.validity,
            variety: tenxDoc.variety,
            isLimit: true
          },
          amount: (tenxDoc.amount * -1),
          brokerage: Number(tenxDoc.brokerage),
          lots: Number(tenxDoc.Quantity),
          lastaverageprice: tenxDoc.average_price,
          margin: margin
        });
      }
    } else{
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product && !element._id.isLimit  ));
      // console.log("matchingElement", matchingElement , tenxDoc.instrumentToken,  tenxDoc.Product , tenxDoc.order_type)
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (tenxDoc.amount * -1);
        matchingElement.brokerage += Number(tenxDoc.brokerage);
        matchingElement.lastaverageprice = tenxDoc.average_price;
        matchingElement.lots += Number(tenxDoc.Quantity);
        matchingElement.margin = margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: tenxDoc.symbol,
            product: tenxDoc.Product,
            instrumentToken: tenxDoc.instrumentToken,
            exchangeInstrumentToken: tenxDoc.exchangeInstrumentToken,
            exchange: tenxDoc.exchange,
            validity: tenxDoc.validity,
            variety: tenxDoc.variety,
          },
          amount: (tenxDoc.amount * -1),
          brokerage: Number(tenxDoc.brokerage),
          lots: Number(tenxDoc.Quantity),
          lastaverageprice: tenxDoc.average_price,
          margin: margin
        });
      }
    }
    pnlRedis = await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))
    return pnlRedis;
  }
}





    /*
    1. equal
    2. greater
    3. less

    100 buy 19800CE @ rs. 10
    Stoploss : 8  StopProfit: 12

    1. 100 sell
    1.a Sell me stoploss nhi h
    Remove existing stploss or stopprofit(redis and db)
    1.b sell me stoploss h
    Remove existing stploss or stopprofit(redis and db)
    Koi stoploss ya stopprofit order na create ho

    2. 150 sell (greater wala)
    2.a Sell me stoploss nhi h
    Remove existing stploss or stopprofit(redis and db)
    2.b sell me stoploss h
    (100-150) quantity pe stoploss ya stopprofit lgana h

    3. 50 sell (less wala)
    3.a Sell me stoploss nhi h
    (100-50) quantity update ho jaegi redis and db me




    50 buy 19800CE @ rs. 10 , 50 buy 19800CE @ rs. 10
    Stoploss : 8  StopProfit: 12   Stoploss : 9  StopProfit: 11

    1. 100 sell
    1.a Sell me stoploss nhi h
    Remove existing stploss or stopprofit(redis and db), loop lgana pdega
    1.b sell me stoploss h
    Remove existing stploss or stopprofit(redis and db)
    Koi stoploss ya stopprofit order na create ho

    2. 150 sell (greater wala)
    2.a Sell me stoploss nhi h
    Remove existing stploss or stopprofit(redis and db)
    2.b sell me stoploss h
    (100-150) quantity pe stoploss ya stopprofit lgana h

    3. 50 sell (less wala)
    3.a Sell me stoploss nhi h
    (100-50) quantity update ho jaegi redis and db me, make sure quantity is in +ve



    -------------------------------------------------------------

    Quantity Update

    Actual quantity 100 @10 of 19800CE
    Stoploss @ 8 of 100 quantity
    StopProfit @ 12 of 100 quantity


    1. Stoploss @ 8 of 50 quantity
      1.a Stoploss Hit
        x. 



    --------------------------------------------------------------

    matchingElement.lots === Number(tenxDoc.Quantity);
    1. remove all stoploss of user and instrument matching also cancel in db
    2. do not apply new stoploss
    
    matchingElement.lots > Number(tenxDoc.Quantity);
    1. sustain all stoploss and do not apply new stoploss

    matchingElement.lots < Number(tenxDoc.Quantity);
    1. remove existing stoploss and cancel in db
    */

