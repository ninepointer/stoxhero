const TenxTrader = require("./models/mock-trade/tenXTraderSchema");
let { client2, client, getValue, clientForIORedis } = require("./marketData/redisClient");
const { Mutex } = require('async-mutex');
const BrokerageDetail = require("./models/Trading Account/brokerageSchema");
const {xtsAccountType, zerodhaAccountType} = require("./constant");
const Setting = require("./models/settings/setting");
const PendingOrder = require("./models/PendingOrder/pendingOrderSchema");
const { ObjectId } = require("mongodb");


client2.connect()
.then(async (res) => {
    
    console.log("redis connected", res)
})
.catch((err) => {
    console.log("redis not connected", err)
})

const mutex = new Mutex();
exports.tenxTradeStopLoss = async (req, res, otherData) => {
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);

    const setting = await Setting.find().select('toggle');
    let accountType;
    if (setting.ltp == xtsAccountType || setting.complete == xtsAccountType) {
        accountType = xtsAccountType;
    } else {
        accountType = zerodhaAccountType;
    }
    let isRedisConnected = getValue();
    let brokerageDetailBuy;
    let brokerageDetailSell;
    let brokerageDetailBuyUser;
    let brokerageDetailSellUser;

    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)) {
        brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
        brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
    } else {
        brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: accountType });
        await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
    }

    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)) {
        brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
        brokerageDetailSell = JSON.parse(brokerageDetailSell);
    } else {
        brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: accountType });
        await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
    }

    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)) {
        brokerageDetailBuyUser = await client.HGET('brokerage', `buy-user`);
        brokerageDetailBuyUser = JSON.parse(brokerageDetailBuyUser);
    } else {
        brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `buy-user`, JSON.stringify(brokerageDetailBuyUser));
    }

    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-user`)) {
        brokerageDetailSellUser = await client.HGET('brokerage', `sell-user`);
        brokerageDetailSellUser = JSON.parse(brokerageDetailSellUser);
    } else {
        brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `sell-user`, JSON.stringify(brokerageDetailSellUser));
    }

    console.log("in function")
    try {

        console.log("in function 2")
        await client2.SUBSCRIBE("place-order", async (message) => {
            message = JSON.parse(message);

            console.log(message)

            let { exchange, symbol, buyOrSell, Quantity, Product, order_type, subscriptionId,
                exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
                createdBy, _id } = message.data;

            const lockKey = `${createdBy}-${symbol}`
            //  'saveDataLock';
            const lockValue = Date.now().toString() + Math.random * 1000;

            try {
                // Try to acquire the lock
                const lockExpiration = 5;

                const lockAcquired = await acquireLock(lockKey, lockValue, lockExpiration);
                // const lockAcquired = await clientForIORedis.set(lockKey, lockValue, 'NX', 'EX', 10);

                if (!lockAcquired) {
                    console.log('Another process is already saving data.');
                    return;
                }

                const release = await mutex.acquire();                

                let last_price = message.ltp;
                let index = message.index;
                let brokerageUser;
                let trade_time_zerodha = new Date();
                // Add 5 hours and 30 minutes
                trade_time_zerodha.setHours(trade_time_zerodha.getHours() + 5);
                trade_time_zerodha.setMinutes(trade_time_zerodha.getMinutes() + 30);

                if (buyOrSell === "BUY") {
                    brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailBuyUser[0]);
                } else if (buyOrSell === "SELL") {
                    brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * last_price, brokerageDetailSellUser[0]);
                }

                if (buyOrSell === "SELL") {
                    Quantity = "-" + Quantity;
                }

                const tenx = new TenxTrader({
                    status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
                    variety, validity, exchange, order_type, symbol, placed_by: "stoxhero",
                    order_id, instrumentToken, brokerage: brokerageUser, subscriptionId, exchangeInstrumentToken,
                    createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
                });

                tenx.save().then(async () => {
                    // console.log("sending response");
                    if (isRedisConnected && await client.exists(`${createdBy.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)) {
                        //console.log("in the if condition")
                        let pnl = await client.get(`${createdBy.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
                        pnl = JSON.parse(pnl);
                        //console.log("before pnl", pnl)
                        const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenx.instrumentToken && element._id.product === tenx.Product));

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

                        await client.set(`${createdBy.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl))

                    }

                    if (isRedisConnected) {
                        await client.expire(`${createdBy.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);
                    }
                    // res.status(201).json({status: 'Complete', message: 'COMPLETE'});
                }).catch((err) => {
                    console.log("in err", err)
                    // res.status(500).json({error:"Failed to enter data"})
                });

                data = await client.get('stoploss-stopprofit');
                data = JSON.parse(data);
                let symbolArr = data[`${instrumentToken}`];
                for(let i = 0; i < symbolArr.length; i++){
                    console.log(symbolArr[i].instrumentToken , instrumentToken , 
                        symbolArr[i].createdBy.toString() , createdBy.toString() , 
                        symbolArr[i].Quantity , Quantity , 
                        symbolArr[i].buyOrSell , buyOrSell)
                    if(symbolArr[i].instrumentToken === instrumentToken && 
                       symbolArr[i].createdBy.toString() === createdBy.toString() && 
                       Math.abs(symbolArr[i].Quantity) === Math.abs(Number(Quantity)) && 
                       symbolArr[i].buyOrSell === buyOrSell)
                    {

                        symbolArr.splice(i, 1);
                        const update = await PendingOrder.updateOne({_id: new ObjectId(symbolArr[i]._id)}, {
                            $set: {status: "Cancelled"}
                        })
                        break;
                    }
                }
                symbolArr.splice(index, 1);
                const update = await PendingOrder.updateOne({_id: new ObjectId(_id)}, {
                    $set: {status: "Executed"}
                })
                data[`${instrumentToken}`] = symbolArr;
                await client.set('stoploss-stopprofit', JSON.stringify(data));

                release();
            } catch (error) {
                console.error('Error saving data:', error);
            } finally {
                // Release the lock
                await releaseLock(lockKey, lockValue);
                console.log('Lock released.');
            }
            // const release = await mutex.acquire();
            // console.log(message); // 'message'
            // message = JSON.parse(message);


        });

        console.log("in function 3")


    } catch (err) {
        console.log(err)
    }
}

async function acquireLock(lockKey, lockValue, expiration) {
    const result = await clientForIORedis.set(lockKey, lockValue, 'NX', 'EX', expiration);
    console.log("this is result", result)
    return result === 'OK';
  }
  
  async function releaseLock(lockKey, lockValue) {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    return await clientForIORedis.eval(script, 1, lockKey, lockValue);
  }

function buyBrokerage(totalAmount, buyBrokerData) {
    let brokerage = Number(buyBrokerData.brokerageCharge);
    let exchangeCharge = totalAmount * (Number(buyBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(buyBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(buyBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(buyBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(buyBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
    return finalCharge;
}

function sellBrokerage(totalAmount, sellBrokerData) {
    let brokerage = Number(sellBrokerData.brokerageCharge);
    let exchangeCharge = totalAmount * (Number(sellBrokerData.exchangeCharge) / 100);
    let sebiCharges = totalAmount * (Number(sellBrokerData.sebiCharge) / 100);
    let gst = (brokerage + exchangeCharge + sebiCharges) * (Number(sellBrokerData.gst) / 100);
    let stampDuty = totalAmount * (Number(sellBrokerData.stampDuty) / 100);
    let sst = totalAmount * (Number(sellBrokerData.sst) / 100);
    let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;

    return finalCharge
}



// if(buyOrSell === "SELL"){
//     req.body.Quantity = "-"+Quantity;
// }

// exports.tenxTradeStopLoss = async (req, res, otherData) => {
//   let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, subscriptionId, 
//       exchangeInstrumentToken, validity, variety, order_id, instrumentToken, 
//       portfolioId, trader} = req.body 

//   let {isRedisConnected, brokerageUser, last_price, secondsRemaining, trade_time} = otherData;

//     TenxTrader.findOne({order_id : order_id})
//     .then((dataExist)=>{
//         if(dataExist){
//             return res.status(422).json({error : "date already exist..."})
//         }

        // const tenx = new TenxTrader({
        //     status:"COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
        //     variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
        //     order_id, instrumentToken, brokerage: brokerageUser, portfolioId, subscriptionId, exchangeInstrumentToken,
        //     createdBy: createdBy,trader: trader, amount: (Number(Quantity)*last_price), trade_time:trade_time,
            
        // });

//         // console.log("tenx tenx", tenx)


//         //console.log("mockTradeDetails", paperTrade);

    // }).catch(err => {console.log(err, "fail")});  

// }