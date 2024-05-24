const PaperTrade = require("../../models/mock-trade/paperTrade");
const {virtualTrader} = require("../../constant");
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");
const mongoose = require('mongoose')
const {clientForIORedis} = require('../../marketData/redisClient');


exports.virtualTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, order_type, exchangeInstrumentToken,
    validity, variety, order_id, instrumentToken, portfolioId,
    deviceDetails, margin, price, stopProfitPrice, stopLossPrice,
    originalLastPriceUser, originalLastPriceCompany, trade_time, requiredMargin} = req.body 

    const trader = req?.user?._id;
  let {isRedisConnected, brokerageUser, secondsRemaining} = otherData;
  const session = await mongoose.startSession();
  const lockKey = `${req.user._id}-${portfolioId}`
  const lockValue = Date.now().toString() + Math.random() * 1000;

  try{
    const lockAcquired = await acquireLock(lockKey, lockValue);
    if (!lockAcquired) {
        return res.status(400).json({ status: 'error', message: 'Your previous request is still being processed. Please try again later.' });
    }
    const paper = await PaperTrade.findOne({order_id: order_id});
    if(paper){
      return res.status(422).json({ status: "error", message: "something went wrong." })
    }

    session.startTransaction();

    const paperDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
      createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
      deviceDetails: { deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType },
      margin, college: req?.user?.collegeDetails?.college, requiredMargin
    }

    const save = (order_type !== "LIMIT") && await PaperTrade.create([paperDoc], { session }); 

    let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
    pnl = JSON.parse(pnl);
    let reverseTradeConditionData;
    const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperDoc.instrumentToken && element._id.product === paperDoc.Product && !element._id.isLimit));
    if(matchingElement){
      const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
      if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== paperDoc.buyOrSell) && (order_type !== "LIMIT")){
        reverseTradeConditionData = await reverseTradeCondition(req.user._id, portfolioId, paperDoc, stopLossPrice, stopProfitPrice, save[0]?._id, originalLastPriceUser, pnl, virtualTrader);
      }
    }

    if(reverseTradeConditionData === 0){
      stopLossPrice = 0;
      stopProfitPrice = 0;
    }

    const pnlRedis = await saveInRedis(req, paperDoc, portfolioId);

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
    }

    let pendingOrderRedis;
    if(stopLossPrice || stopProfitPrice || price){
      pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, save[0]?._id, virtualTrader);
    } else{
      pendingOrderRedis = "OK";
    }

    if (pendingOrderRedis === "OK" && pnlRedis === "OK") {
      await session.commitTransaction();
      await releaseLock(lockKey);
      res.status(201).json({ status: 'Complete', message: 'COMPLETE', data: `Traded ${Math.abs(Quantity)} quantity of ${symbol}` });
    }

  } catch(err){
    console.log('Transaction failed, documents not saved:', err);

    await client.del('stoploss-stopprofit');
    await client.del(`${req.user._id.toString()}: overallpnlPaperTrade`);
    await releaseLock(lockKey);
    await session.abortTransaction();
    res.status(401).json({status: 'error', message: 'Something went wrong. Please try again.'});
  } finally {
    await releaseLock(lockKey);
    session.endSession();
  }
}

async function acquireLock(lockKey, lockValue) {
  // console.log('acquiring lock ........')
  const result = await clientForIORedis.set(lockKey, lockValue, 'NX');
  return result === 'OK';
}

async function releaseLock(lockKey) {
  const result = await clientForIORedis.del(lockKey);
}

const saveInRedis = async (req, paperDoc, portfolioId)=>{
  const {margin, order_type} = req.body;

  if (await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)) {
    let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
    pnl = JSON.parse(pnl);

    if(order_type === "LIMIT"){
      const matchingElement = pnl.find((element) => 
      {
        const type = element.lots >= 0 ? "BUY" : "SELL"
        return (element._id.instrumentToken === paperDoc.instrumentToken && element._id.product === paperDoc.Product && paperDoc.order_type === "LIMIT" && element._id.isLimit && type===paperDoc.buyOrSell  )

      });
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement._id.isLimit = true;
        matchingElement.amount += (paperDoc.amount * -1);
        matchingElement.brokerage += Number(paperDoc.brokerage);
        matchingElement.lastaverageprice = paperDoc.average_price;
        matchingElement.lots += Number(paperDoc.Quantity);
        matchingElement.margin += margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: paperDoc.symbol,
            product: paperDoc.Product,
            instrumentToken: paperDoc.instrumentToken,
            exchangeInstrumentToken: paperDoc.exchangeInstrumentToken,
            exchange: paperDoc.exchange,
            validity: paperDoc.validity,
            variety: paperDoc.variety,
            isLimit: true
          },
          amount: (paperDoc.amount * -1),
          brokerage: Number(paperDoc.brokerage),
          lots: Number(paperDoc.Quantity),
          lastaverageprice: paperDoc.average_price,
          margin: margin
        });
      }
    } else{
      const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperDoc.instrumentToken && element._id.product === paperDoc.Product && paperDoc.order_type !== "LIMIT" && !element._id.isLimit  ));
      if (matchingElement) {
        // Update the values of the matching element with the values of the first document
        matchingElement.amount += (paperDoc.amount * -1);
        matchingElement.brokerage += Number(paperDoc.brokerage);
        matchingElement.lastaverageprice = paperDoc.average_price;
        matchingElement.lots += Number(paperDoc.Quantity);
        matchingElement.margin = margin;
      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: paperDoc.symbol,
            product: paperDoc.Product,
            instrumentToken: paperDoc.instrumentToken,
            exchangeInstrumentToken: paperDoc.exchangeInstrumentToken,
            exchange: paperDoc.exchange,
            validity: paperDoc.validity,
            variety: paperDoc.variety,
          },
          amount: (paperDoc.amount * -1),
          brokerage: Number(paperDoc.brokerage),
          lots: Number(paperDoc.Quantity),
          lastaverageprice: paperDoc.average_price,
          margin: margin
        });
      }
    }
    pnlRedis = await client.set(`${req.user._id.toString()}: overallpnlPaperTrade`, JSON.stringify(pnl))
    return pnlRedis;
  }
}