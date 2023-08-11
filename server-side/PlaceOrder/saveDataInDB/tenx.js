const TenxTrader = require("../../models/mock-trade/tenXTraderSchema");


exports.tenxTrade = async (req, res) => {
    TenxTrader.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const tenx = new TenxTrader({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        });

        // console.log("tenx tenx", tenx)


        //console.log("mockTradeDetails", paperTrade);
        tenx.save().then(async ()=>{
            // console.log("sending response");
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)){
                //console.log("in the if condition")
                let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
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
    }).catch(err => {console.log(err, "fail")});  

}