const Battle = require("../../models/battle/battleTrade");


exports.battleTrade = async (req, res, otherData) => {
  let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, exchangeInstrumentToken,
    validity, variety, order_id, instrumentToken, battleId,
    trader} = req.body 

  let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

    Battle.findOne({order_id : order_id})
    .then((dateExist)=>{
        if(dateExist){
            return res.status(422).json({error : "date already exist..."})
        }

        const battle = new Battle({
            status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell, 
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero", battleId,
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
        });

        // console.log("mockTradeDetails", battle);
        battle.save().then(async ()=>{
            // console.log("sending response", isRedisConnected);
            if(isRedisConnected && await client.exists(`${req.user._id.toString()}${battleId.toString()} overallpnlBattle`)){
                // console.log("in the if condition")
                let pnl = await client.get(`${req.user._id.toString()}${battleId.toString()} overallpnlBattle`)
                pnl = JSON.parse(pnl);
                // console.log("before pnl", pnl)
                const matchingElement = pnl.find((element) => (element._id.instrumentToken === battle.instrumentToken && element._id.product === battle.Product ));
      
                // if instrument is same then just updating value
                if (matchingElement) {
                  // Update the values of the matching element with the values of the first document
                  matchingElement.amount += (battle.amount * -1);
                  matchingElement.brokerage += Number(battle.brokerage);
                  matchingElement.lastaverageprice = battle.average_price;
                  matchingElement.lots += Number(battle.Quantity);
                  //console.log("matchingElement", matchingElement)
      
                } else {
                //   Create a new element if instrument is not matching
                  pnl.push({
                    _id: {
                      symbol: battle.symbol,
                      product: battle.Product,
                      instrumentToken: battle.instrumentToken,
                      exchangeInstrumentToken: battle.exchangeInstrumentToken,
                      exchange: battle.exchange,
                    },
                    amount: (battle.amount * -1),
                    brokerage: Number(battle.brokerage),
                    lots: Number(battle.Quantity),
                    lastaverageprice: battle.average_price,
                  });
                }
                
                await client.set(`${req.user._id.toString()}${battleId.toString()} overallpnlBattle`, JSON.stringify(pnl))
                
            }

            if(isRedisConnected){
                await client.expire(`${req.user._id.toString()}${battleId.toString()} overallpnlBattle`, secondsRemaining);
            }
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
        }).catch((err)=> {
            console.log("in err", err)
            // res.status(500).json({error:"Failed to enter data"})
        });
    }).catch(err => {console.log(err, "fail")});  

}