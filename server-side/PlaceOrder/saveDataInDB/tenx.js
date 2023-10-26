const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema")
const mongoose = require('mongoose')
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");

exports.tenxTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, stopProfitPrice, stopLossPrice, deviceDetails, margin } = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

  const session = await mongoose.startSession();

  try {
    const tenx = await TenxTrader.findOne({ order_id: order_id });
    if (tenx) {
      return res.status(422).json({ message: "data already exist", error: "Fail to trade" })
    }

    session.startTransaction();
    let pnlRedis = "";

    const tenxDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
      createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
      deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType},
      margin
    }

    const save = await TenxTrader.create([tenxDoc], { session });

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
    2. dont apply new stoploss
    
    matchingElement.lots > Number(tenxDoc.Quantity);
    1. sustain all stoploss and dont apply new stoploss

    matchingElement.lots < Number(tenxDoc.Quantity);
    1. remove existing stoploss and cancel in db
    */

    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    pnl = JSON.parse(pnl);
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product));
    const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
    let reverseTradeConditionData;
    if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== tenxDoc.buyOrSell)){
      reverseTradeConditionData = await reverseTradeCondition(req.user._id, subscriptionId, tenxDoc, stopLossPrice, stopProfitPrice, save[0]?._id, originalLastPriceUser);
    }

    if(reverseTradeConditionData === 0){
      console.log("from reverse trade")
      stopLossPrice = 0;
      stopProfitPrice = 0;
    }

    if (isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
      let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
      pnl = JSON.parse(pnl);
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product));

      // if instrument is same then just updating value
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
            variety: tenxDoc.variety
          },
          amount: (tenxDoc.amount * -1),
          brokerage: Number(tenxDoc.brokerage),
          lots: Number(tenxDoc.Quantity),
          lastaverageprice: tenxDoc.average_price,
          margin: margin
        });
      }

      pnlRedis = await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))

    }

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
    }


    let pendingOrderRedis;
    if(stopLossPrice || stopProfitPrice){
      pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, save[0]?._id);
    } else{
      pendingOrderRedis = "OK";
    }
    
    console.log(pendingOrderRedis, pnlRedis)
    if (pendingOrderRedis === "OK" && pnlRedis === "OK") {
      await session.commitTransaction();
      res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
    }
  } catch (err) {
    await client.del(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
  } finally {
    session.endSession();
  }
}