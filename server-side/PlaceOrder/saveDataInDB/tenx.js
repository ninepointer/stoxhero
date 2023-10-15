const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema")
const mongoose = require('mongoose')


exports.tenxTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, stopProfitPrice, stopLossPrice } = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

  const session = await mongoose.startSession();

  try {
    const tenx = await TenxTrader.findOne({ order_id: order_id });
    if (tenx) {
      return res.status(422).json({ message: "data already exist", error: "Fail to trade" })
    }

    session.startTransaction();
    let pnlRedis = "";
    let pendingOrderRedis = "";

    const tenxDoc = {
      status: "COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
      variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
      order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
      createdBy: req.user._id, trader: trader, amount: (Number(Quantity) * originalLastPriceUser), trade_time: trade_time,
    }

    const save = await TenxTrader.create([tenxDoc], { session });

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
        //console.log("matchingElement", matchingElement)

      } else {
        // Create a new element if instrument is not matching
        pnl.push({
          _id: {
            symbol: tenxDoc.symbol,
            product: tenxDoc.Product,
            instrumentToken: tenxDoc.instrumentToken,
            exchangeInstrumentToken: tenxDoc.exchangeInstrumentToken,
            exchange: tenxDoc.exchange,
          },
          amount: (tenxDoc.amount * -1),
          brokerage: Number(tenxDoc.brokerage),
          lots: Number(tenxDoc.Quantity),
          lastaverageprice: tenxDoc.average_price,
        });
      }

      pnlRedis = await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))

    }

    if (isRedisConnected) {
      await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
    }



    const pendingBuyOrSell = buyOrSell === "BUY" ? "SELL" : "BUY";
    let pendingOrder = [];
    if (stopProfitPrice && stopLossPrice) {
      const pendingOrderStopLoss = {
        order_referance_id: save[0]?._id, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopLossPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req.user._id, type: "StopLoss"
      }

      const pendingOrderStopProfit = {
        order_referance_id: save[0]?._id, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopProfitPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req.user._id, type: "StopProfit"
      }

      pendingOrder.push(pendingOrderStopLoss);
      pendingOrder.push(pendingOrderStopProfit);
    } else if (stopProfitPrice || stopLossPrice) {
      let executionPrice = stopProfitPrice ? stopProfitPrice : stopLossPrice;
      let type = stopProfitPrice ? "StopProfit" : "StopLoss";
      pendingOrder = [{
        order_referance_id: save[0]?._id, status: "Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: executionPrice,
        Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol,
        execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
        createdBy: req.user._id, type
      }]
    }

    const order = await PendingOrder.create(pendingOrder, { session });
    // console.log(order)

    let dataObj = {};
    let dataArr = [];

    for (let elem of order) {
      dataArr.push({
        product_type: elem?.product_type, execution_price: elem?.execution_price, Quantity: elem?.Quantity,
        Product: elem?.Product, buyOrSell: elem?.buyOrSell, variety: elem?.variety, validity: elem?.validity,
        exchange: elem?.exchange, order_type: elem?.order_type, symbol: elem?.symbol, execution_time: elem?.execution_time,
        instrumentToken: elem?.instrumentToken, exchangeInstrumentToken: elem?.exchangeInstrumentToken,
        last_price: elem?.last_price, createdBy: elem?.createdBy, type: elem?.type, subscriptionId, order_id, _id: elem?._id
      })
    }

    dataObj[`${instrumentToken}`] = dataArr;

    // console.log("dataObj",dataObj)

    if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
      const order = await PendingOrder.find({status: "Pending"});
      const transformedObject = {};

      order.forEach(item => {
        const { instrumentToken, ...rest } = item;
        
        if (!transformedObject[instrumentToken]) {
          transformedObject[instrumentToken] = [];
        }
        // console.log(rest._doc)
        transformedObject[instrumentToken].push(rest._doc);
      });

      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(transformedObject));
    }

    if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
      data = await client.get('stoploss-stopprofit');
      data = JSON.parse(data);
      if (data[`${instrumentToken}`]) {
        data[`${instrumentToken}`] = data[`${instrumentToken}`].concat(dataArr);
      } else {
        data[`${instrumentToken}`] = dataArr;
      }
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(data));
    } else {
      pendingOrderRedis = await client.set('stoploss-stopprofit', JSON.stringify(dataObj));
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



        //todo-vijay: if redis fail...handle this case also
        //also apply transaction here
}