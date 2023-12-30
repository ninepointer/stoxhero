const EquityTrade = require("../../models/mock-trade/stockSchema");
const {stock} = require("../../constant");
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");
const mongoose = require('mongoose')


exports.stockTradeHelper = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, order_type, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, deviceDetails, margin, price, stopProfitPrice, stopLossPrice} = req.body 
      trader = req.user._id;

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;
  const session = await mongoose.startSession();

  try{
    const equity = await EquityTrade.findOne({order_id: order_id});
    if(equity){
      return res.status(422).json({ status: "error", message: "something went wrong." })
    }

    session.startTransaction();

    const equityDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
      createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
      deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
      margin
    }

    const save = (order_type !== "LIMIT") && await EquityTrade.create([equityDoc], { session }); 

    let pnl
    if(Product === "MIS"){
      pnl = await client.get(`${req.user._id.toString()}: overallpnlIntraday`)
    } else{
      pnl = await client.get(`${req.user._id.toString()}: overallpnlDelivery`)
    }
     
    pnl = JSON.parse(pnl);
    let reverseTradeConditionData;
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === equityDoc.instrumentToken && element._id.product === equityDoc.Product && !element._id.isLimit));
    if(matchingElement){
      const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
      if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== equityDoc.buyOrSell) && (order_type !== "LIMIT")){
        reverseTradeConditionData = await reverseTradeCondition(req.user._id, portfolioId, equityDoc, stopLossPrice, stopProfitPrice, save[0]?._id, originalLastPriceUser, pnl, stock);
      }
    }

    if(reverseTradeConditionData === 0){
      stopLossPrice = 0;
      stopProfitPrice = 0;
    }

    const pnlRedis = await saveInRedis(req, equityDoc, Product);

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}: overallpnlStock`, secondsRemaining);
    }

    let pendingOrderRedis;
    if(stopLossPrice || stopProfitPrice || price){
      pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, save[0]?._id, stock);
    } else{
      pendingOrderRedis = "OK";
    }

    if (pendingOrderRedis === "OK" && pnlRedis === "OK") {
      await session.commitTransaction();
      res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
    }

  } catch(err){
    await client.del('stoploss-stopprofit');
    await client.del(`${req.user._id.toString()}: overallpnlStock`)
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
  } finally {
    session.endSession();
  }
}

const saveInRedis = async (req, equityDoc, Product, )=>{
  const {margin, order_type} = req.body;

  if (await client.exists(`${req.user._id.toString()}: overallpnlIntraday`)
   || await client.exists(`${req.user._id.toString()}: overallpnlDelivery`)) {
    
    let pnl
    if(Product === "MIS"){
      pnl = await client.get(`${req.user._id.toString()}: overallpnlIntraday`)
    } else{
      pnl = await client.get(`${req.user._id.toString()}: overallpnlDelivery`)
    }
    pnl = JSON.parse(pnl);

    if(order_type === "LIMIT"){
      const matchingElement = pnl.find((element) => 
      {
        const type = element.lots >= 0 ? "BUY" : "SELL"
        return (element._id.instrumentToken === equityDoc.instrumentToken && element._id.product === equityDoc.Product && equityDoc.order_type === "LIMIT" && element._id.isLimit && type===equityDoc.buyOrSell  )

      });
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement._id.isLimit = true;
        matchingElement.amount += (equityDoc.amount * -1);
        matchingElement.brokerage += Number(equityDoc.brokerage);
        matchingElement.lastaverageprice = equityDoc.average_price;
        matchingElement.lots += Number(equityDoc.Quantity);
        matchingElement.margin += margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: equityDoc.symbol,
            product: equityDoc.Product,
            instrumentToken: equityDoc.instrumentToken,
            exchangeInstrumentToken: equityDoc.exchangeInstrumentToken,
            exchange: equityDoc.exchange,
            validity: equityDoc.validity,
            variety: equityDoc.variety,
            isLimit: true
          },
          amount: (equityDoc.amount * -1),
          brokerage: Number(equityDoc.brokerage),
          lots: Number(equityDoc.Quantity),
          lastaverageprice: equityDoc.average_price,
          margin: margin
        });
      }
    } else{
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === equityDoc.instrumentToken && element._id.product === equityDoc.Product && equityDoc.order_type !== "LIMIT" && !element._id.isLimit  ));
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (equityDoc.amount * -1);
        matchingElement.brokerage += Number(equityDoc.brokerage);
        matchingElement.lastaverageprice = equityDoc.average_price;
        matchingElement.lots += Number(equityDoc.Quantity);
        matchingElement.margin = margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: equityDoc.symbol,
            product: equityDoc.Product,
            instrumentToken: equityDoc.instrumentToken,
            exchangeInstrumentToken: equityDoc.exchangeInstrumentToken,
            exchange: equityDoc.exchange,
            validity: equityDoc.validity,
            variety: equityDoc.variety,
          },
          amount: (equityDoc.amount * -1),
          brokerage: Number(equityDoc.brokerage),
          lots: Number(equityDoc.Quantity),
          lastaverageprice: equityDoc.average_price,
          margin: margin
        });
      }
    }

    let pnlRedis;
    if(Product === "MIS"){
      pnlRedis = await client.set(`${req.user._id.toString()}: overallpnlIntraday`, JSON.stringify(pnl));
    } else{
      pnlRedis = await client.set(`${req.user._id.toString()}: overallpnlDelivery`, JSON.stringify(pnl));
    }
    return pnlRedis;
  }
}