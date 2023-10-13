const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");
const PendingOrder = require("../../models/PendingOrder/pendingOrderSchema")


exports.tenxTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, stopProfitPrice, stopLossPrice } = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

    TenxTrader.findOne({order_id : order_id})
    .then(async (dataExist)=>{
        if(dataExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const tenx = new TenxTrader({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        });

        tenx.save().then(async ()=>{
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)){
                let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
                pnl = JSON.parse(pnl);
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
                      exchangeInstrumentToken: tenx.exchangeInstrumentToken,
                      exchange: tenx.exchange,
                    },
                    amount: (tenx.amount * -1),
                    brokerage: Number(tenx.brokerage),
                    lots: Number(tenx.Quantity),
                    lastaverageprice: tenx.average_price,
                  });
                }
                
                await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))
                
            }

            if(isRedisConnected){
                await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
            }
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });

        const pendingBuyOrSell = buyOrSell==="BUY" ? "SELL" : "BUY";
        let pendingOrder = [];
        if(stopProfitPrice && stopLossPrice){
          const pendingOrderStopLoss = {
            order_referance_id: tenx?._id, status:"Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopLossPrice, 
            Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol, 
            execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
            createdBy: req.user._id, type: "StopLoss"
          }

          const pendingOrderStopProfit = {
            order_referance_id: tenx?._id, status:"Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: stopProfitPrice, 
            Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol, 
            execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
            createdBy: req.user._id, type: "StopProfit"
          }

          pendingOrder.push(pendingOrderStopLoss);
          pendingOrder.push(pendingOrderStopProfit);
        } else if(stopProfitPrice || stopLossPrice){
          let executionPrice = stopProfitPrice ? stopProfitPrice : stopLossPrice;
          let type = stopProfitPrice ? "StopProfit" : "StopLoss";
          pendingOrder = [{
            order_referance_id: tenx?._id, status:"Pending", product_type: "6517d3803aeb2bb27d650de0", execution_price: executionPrice, 
            Quantity, Product, buyOrSell: pendingBuyOrSell, variety, validity, exchange, order_type: OrderType, symbol, 
            execution_time: new Date(), instrumentToken, exchangeInstrumentToken, last_price: originalLastPriceUser,
            createdBy: req.user._id, type
          }]
        }

        const order = await PendingOrder.create(pendingOrder);
        console.log(order)

        let dataObj = {};
        let dataArr = [];

        for(let elem of order){
          dataArr.push({
            product_type: elem?.product_type, execution_price: elem?.execution_price, Quantity: elem?.Quantity, 
            Product: elem?.Product, buyOrSell: elem?.buyOrSell, variety: elem?.variety, validity: elem?.validity, 
            exchange: elem?.exchange, order_type: elem?.order_type, symbol: elem?.symbol, execution_time: elem?.execution_time, 
            instrumentToken: elem?.instrumentToken, exchangeInstrumentToken: elem?.exchangeInstrumentToken, 
            last_price: elem?.last_price, createdBy: elem?.createdBy, type: elem?.type, subscriptionId, order_id
          }) 
        }
// {symbol: [id, price], symbol2: [id, price]}
        dataObj[`${instrumentToken}`] = dataArr;

        if (isRedisConnected && await client.exists('stoploss-stopprofit')) {
          data = await client.get('stoploss-stopprofit');
          data = JSON.parse(data);
          if(data[`${instrumentToken}`]){
            data[`${instrumentToken}`] = data[`${instrumentToken}`].concat(dataArr);
          } else{
            data[`${instrumentToken}`] = dataArr;
          }
          await client.set('stoploss-stopprofit', JSON.stringify(data));
        } else {
          await client.set('stoploss-stopprofit', JSON.stringify(dataObj));
        }

        // if (isRedisConnected && await client.HEXISTS('stoploss-stopprofit', `${instrumentToken}-${exchangeInstrumentToken}`)) {
        //   data = await client.HGET('stoploss-stopprofit', `${instrumentToken}-${exchangeInstrumentToken}`);
        //   data[`${instrumentToken}-${exchangeInstrumentToken}`] = data[`${instrumentToken}-${exchangeInstrumentToken}`].concat(dataArr);
        //   await client.HSET('stoploss-stopprofit', `${instrumentToken}-${exchangeInstrumentToken}`, JSON.stringify(data));
        // } else {
        //   await client.HSET('stoploss-stopprofit', `${instrumentToken}-${exchangeInstrumentToken}`, JSON.stringify(dataObj));
        // }

        //todo-vijay: if redis fail...handle this case also
        //also apply transaction here


    }).catch(err => {console.log(err, "fail")});  

}