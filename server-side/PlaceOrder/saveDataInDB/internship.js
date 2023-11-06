const InternshipTrade = require("../../models/mock-trade/internshipTrade");
const {internship} = require("../../constant");
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");
const mongoose = require('mongoose')


exports.internTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, deviceDetails, margin, price, stopProfitPrice, stopLossPrice} = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;
  const session = await mongoose.startSession();

  try{
    const intern = await InternshipTrade.findOne({order_id: order_id});
    if(intern){
      return res.status(422).json({ status: "error", message: "something went wrong." })
    }

    session.startTransaction();

    const internDoc = {
      status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: subscriptionId, exchangeInstrumentToken,
      createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
      deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType},
      margin
    }

    const save = (order_type !== "LIMIT") && await InternshipTrade.create([internDoc], { session }); 

    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
    pnl = JSON.parse(pnl);
    let reverseTradeConditionData;
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === internDoc.instrumentToken && element._id.product === internDoc.Product && element._id.isLimit));
    if(matchingElement){
      const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
      if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== internDoc.buyOrSell) && (order_type !== "LIMIT")){
        reverseTradeConditionData = await reverseTradeCondition(req.user._id, subscriptionId, internDoc, stopLossPrice, stopProfitPrice, save[0]?._id, originalLastPriceUser, pnl, internship);
      }
    }

    if(reverseTradeConditionData === 0){
      console.log("from reverse trade")
      stopLossPrice = 0;
      stopProfitPrice = 0;
    }

    const pnlRedis = await saveInRedis(req, internDoc, subscriptionId);

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, secondsRemaining);
    }

    let pendingOrderRedis;
    if(stopLossPrice || stopProfitPrice || price){
      pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, save[0]?._id, internship);
    } else{
      pendingOrderRedis = "OK";
    }

    console.log(pendingOrderRedis, pnlRedis)
    if (pendingOrderRedis === "OK" && pnlRedis === "OK") {
      await session.commitTransaction();
      res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
    }

  } catch(err){
    await client.del('stoploss-stopprofit');
    await client.del(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
    await session.abortTransaction();
    console.error('Transaction failed, documents not saved:', err);
    res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
  } finally{
    session.endSession();
  }
}


const saveInRedis = async (req, internDoc, subscriptionId)=>{
  const {margin, order_type} = req.body;

  console.log('ordertypes', order_type, internDoc)
  if (await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)) {
    let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
    pnl = JSON.parse(pnl);

    if(order_type === "LIMIT"){
      // const matchingElement = pnl.find((element) => (element._id.instrumentToken === internDoc.instrumentToken && element._id.product === internDoc.Product && internDoc.order_type === "LIMIT" && element._id.isLimit  ));
      const matchingElement = pnl.find((element) => 
      {
        const type = element.lots >= 0 ? "BUY" : "SELL"
        return (element._id.instrumentToken === internDoc.instrumentToken && element._id.product === internDoc.Product && internDoc.order_type === "LIMIT" && element._id.isLimit && type===internDoc.buyOrSell  )

      });
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement._id.isLimit = true;
        matchingElement.amount += (internDoc.amount * -1);
        matchingElement.brokerage += Number(internDoc.brokerage);
        matchingElement.lastaverageprice = internDoc.average_price;
        matchingElement.lots += Number(internDoc.Quantity);
        matchingElement.margin += margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: internDoc.symbol,
            product: internDoc.Product,
            instrumentToken: internDoc.instrumentToken,
            exchangeInstrumentToken: internDoc.exchangeInstrumentToken,
            exchange: internDoc.exchange,
            validity: internDoc.validity,
            variety: internDoc.variety,
            isLimit: true
          },
          amount: (internDoc.amount * -1),
          brokerage: Number(internDoc.brokerage),
          lots: Number(internDoc.Quantity),
          lastaverageprice: internDoc.average_price,
          margin: margin
        });
      }
    } else{
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === internDoc.instrumentToken && element._id.product === internDoc.Product && internDoc.order_type !== "LIMIT" && !element._id.isLimit  ));
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (internDoc.amount * -1);
        matchingElement.brokerage += Number(internDoc.brokerage);
        matchingElement.lastaverageprice = internDoc.average_price;
        matchingElement.lots += Number(internDoc.Quantity);
        matchingElement.margin = margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: internDoc.symbol,
            product: internDoc.Product,
            instrumentToken: internDoc.instrumentToken,
            exchangeInstrumentToken: internDoc.exchangeInstrumentToken,
            exchange: internDoc.exchange,
            validity: internDoc.validity,
            variety: internDoc.variety,
          },
          amount: (internDoc.amount * -1),
          brokerage: Number(internDoc.brokerage),
          lots: Number(internDoc.Quantity),
          lastaverageprice: internDoc.average_price,
          margin: margin
        });
      }
    }
    pnlRedis = await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, JSON.stringify(pnl))
    return pnlRedis;
  }
}