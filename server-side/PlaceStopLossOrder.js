const TenxTrader = require("./models/mock-trade/tenXTraderSchema");
let { client2, client } = require("./marketData/redisClient");
const { Mutex } = require('async-mutex');
const BrokerageDetail = require("./models/Trading Account/brokerageSchema");


client2.connect()
.then(async (res) => {
    
    console.log("redis connected", res)
})
.catch((err) => {
    console.log("redis not connected", err)
})

const mutex = new Mutex();
exports.tenxTradeStopLoss = async (req, res, otherData) => {
    
    console.log("in function")
    try{

        console.log("in function 2")
        await client2.SUBSCRIBE("place-order", async (message) => {
            const release = await mutex.acquire();
            console.log(message); // 'message'
            message = JSON.parse(message);

            let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
                exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
                createdBy} = message.data;

            let last_price = message.ltp;
            let index = message.index;

            let trade_time_zerodha = new Date();
            // Add 5 hours and 30 minutes
            trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
            trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

            const tenx = new TenxTrader({
                status:"COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
                variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
                order_id, instrumentToken, brokerage: brokerageUser, subscriptionId, exchangeInstrumentToken,
                createdBy: req.user._id,trader: createdBy, amount: (Number(Quantity)*last_price), trade_time: trade_time_zerodha,
            });

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
                // res.status(201).json({status: 'Complete', message: 'COMPLETE'});
            }).catch((err)=> {
                console.log("in err", err)
                // res.status(500).json({error:"Failed to enter data"})
            });

            data = await client.get('stoploss-stopprofit');
            data = JSON.parse(data);
            let symbolArr = data[`${instrumentToken}`];
            symbolArr.splice(index, 1);
            data[`${instrumentToken}`] = symbolArr;
            await client.set('stoploss-stopprofit', JSON.stringify(data));

            release();
          });

          console.log("in function 3")

        
    } catch(err){
        console.log(err)
    }
}

// exports.tenxTradeStopLoss = async (req, res, otherData) => {
//   let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
//       exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
//       portfolioId, trader} = req.body 

//   let {isRedisConnected, brokerageUser, originalLastPriceUser, secondsRemaining, trade_time} = otherData;

//     TenxTrader.findOne({order_id : order_id})
//     .then((dataExist)=>{
//         if(dataExist){
//             return res.status(422).json({error : "date already exist..."})
//         }

        // const tenx = new TenxTrader({
        //     status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
        //     variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
        //     order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
        //     createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            
        // });

//         // console.log("tenx tenx", tenx)


//         //console.log("mockTradeDetails", paperTrade);

    // }).catch(err => {console.log(err, "fail")});  

// }