const PaperTrade = require("../models/mock-trade/paperTrade");




exports.paperTrade = async (req, res) => {
    PaperTrade.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const paperTrade = new PaperTrade({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        });

        // console.log("mockTradeDetails", paperTrade);
        paperTrade.save().then(async ()=>{
            // console.log("sending response", isRedisConnected);
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}: overallpnlPaperTrade`)){
                // console.log("in the if condition")
                let pnl = await client.get(`${req.user._id.toString()}: overallpnlPaperTrade`)
                pnl = JSON.parse(pnl);
                // console.log("before pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === paperTrade.instrumentToken && element._id.product === paperTrade.Product ));
      
                // if instrument is same then just updating value
                if (matchingElement) {
                  // Update the values of the matching element with the values of the first document
                  matchingElement.amount += (paperTrade.amount * -1);
                  matchingElement.brokerage += Number(paperTrade.brokerage);
                  matchingElement.lastaverageprice = paperTrade.average_price;
                  matchingElement.lots += Number(paperTrade.Quantity);
                  //console.log("matchingElement", matchingElement)
      
                } else {
                //   Create a new element if instrument is not matching
                  pnl.push({
                    _id: {
                      symbol: paperTrade.symbol,
                      product: paperTrade.Product,
                      instrumentToken: paperTrade.instrumentToken,
                      exchangeInstrumentToken: paperTrade.exchangeInstrumentToken,
                      exchange: paperTrade.exchange,
                    },
                    amount: (paperTrade.amount * -1),
                    brokerage: Number(paperTrade.brokerage),
                    lots: Number(paperTrade.Quantity),
                    lastaverageprice: paperTrade.average_price,
                  });
                }
                
                await client.set(`${req.user._id.toString()}: overallpnlPaperTrade`, JSON.stringify(pnl))
                
            }

            if(isRedisConnected){
                await client.expire(`${req.user._id.toString()}: overallpnlPaperTrade`, secondsRemaining);
            }
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
    }).catch(err => {console.log(err, "fail")});  

}