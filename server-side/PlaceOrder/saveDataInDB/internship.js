const InternshipTrade = require("../../models/mock-trade/internshipTrade");



exports.internTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
      exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
      portfolioId, trader, deviceDetails} = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

    InternshipTrade.findOne({order_id : order_id})
    .then((dataExist)=>{
        if(dataExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const internship = new InternshipTrade({
            status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            order_id, instrumentToken, brokerage: brokerageUser, portfolioId, batch: subscriptionId, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType}
        });

        internship.save().then(async ()=>{
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)){
                let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`)
                pnl = JSON.parse(pnl);
                //console.log("before pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === internship.instrumentToken && element._id.product === internship.Product ));
      
                // if instrument is same then just updating value
                if (matchingElement) {
                  // Update the values of the matching element with the values of the first document
                  matchingElement.amount += (internship.amount * -1);
                  matchingElement.brokerage += Number(internship.brokerage);
                  matchingElement.lastaverageprice = internship.average_price;
                  matchingElement.lots += Number(internship.Quantity);
                  //console.log("matchingElement", matchingElement)

                } else {
                  // Create a new element if instrument is not matching
                  pnl.push({
                    _id: {
                      symbol: internship.symbol,
                      product: internship.Product,
                      instrumentToken: internship.instrumentToken,
                      exchangeInstrumentToken: internship.exchangeInstrumentToken,
                      exchange: internship.exchange,
                    },
                    amount: (internship.amount * -1),
                    brokerage: Number(internship.brokerage),
                    lots: Number(internship.Quantity),
                    lastaverageprice: internship.average_price,
                  });
                }
                
                await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, JSON.stringify(pnl))
                
            }

            if(isRedisConnected){
                await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlIntern`, secondsRemaining);
            }
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
    }).catch(err => {console.log(err, "fail")});  

}