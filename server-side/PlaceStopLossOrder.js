let { client4, client2, client, getValue, clientForIORedis } = require("./marketData/redisClient");
const { Mutex } = require('async-mutex');
const BrokerageDetail = require("./models/Trading Account/brokerageSchema");
const {xtsAccountType, zerodhaAccountType} = require("./constant");
const Setting = require("./models/settings/setting");
const PendingOrder = require("./models/PendingOrder/pendingOrderSchema");
const { ObjectId } = require("mongodb");
const TenXTrader = require("./models/mock-trade/tenXTraderSchema");
const PaperTrade = require("./models/mock-trade/paperTrade");
const InternshipTrade = require("./models/mock-trade/internshipTrade");
const MarginXMockUser = require("./models/marginX/marginXUserMock");
const BattleMockUser = require("./models/battle/battleTrade");
const DailyContestMockUser = require("./models/DailyContest/dailyContestMockUser");
const {virtual, internship, dailyContest, marginx, tenx, battle} = require("./constant")
const getKiteCred = require('./marketData/getKiteCred'); 
const axios = require('axios');

const mutex = new Mutex();
const tenxTradeStopLoss = async (message, brokerageDetailBuyUser, brokerageDetailSellUser) => {
    const isRedisConnected = getValue();
    let todayPnlData;
    let fundDetail;

    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T23:59:59.999Z";
    const today = new Date(todayDate);
    const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


    let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
        exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
        createdBy, _id, type, product_type, from } = message.data;

    try {
        if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)) {
            todayPnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)
            todayPnlData = JSON.parse(todayPnlData);
        }

        if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginTenx`)) {
            fundDetail = await client.get(`${createdBy.toString()}${sub_product_id.toString()} openingBalanceAndMarginTenx`)
            fundDetail = JSON.parse(fundDetail);
        }
    } catch (e) {
        console.log("errro fetching pnl 2", e);
    }


    const kiteData = await getKiteCred.getAccess();
    const netPnl = await calculateNetPnl(message.data, todayPnlData, kiteData);
    const availableMargin = await availableMarginFunc(fundDetail, todayPnlData, netPnl);
    const marginAndCase = getLastTradeMarginAndCaseNumber(message.data, todayPnlData, tenx);
    const caseNumber = (await marginAndCase).caseNumber;
    const margin = (await marginAndCase).margin; 
    const runningLotForSymbol = (await marginAndCase).runningLotForSymbol;

    switch (caseNumber) {
        case 0:
            await marginZeroCase(message.data, availableMargin, tenx, kiteData)
            break;
        case 1:
            await marginFirstCase(message.data, availableMargin, margin, tenx, kiteData)
            break;
        case 2:
            await marginSecondCase(message.data, margin, runningLotForSymbol)
            break;
        case 3:
            await marginThirdCase(message.data)
            break;
        case 4:
            // await marginFourthCase(message.data, availableMargin, runningLotForSymbol, tenx, kiteData)
            break;
    }

    let last_price = message.ltp;
    
    let brokerageUser;
    let trade_time_zerodha = new Date();
    order_id = `${(new Date()).getFullYear() - 2000}${String((new Date()).getMonth() + 1).padStart(2, '0')}${String((new Date()).getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`

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

    const tenxDoc = new TenXTrader({
        status: "COMPLETE", average_price: last_price, Quantity, Product, buyOrSell,
        variety, validity, exchange, order_type, symbol, placed_by: "stoxhero",
        order_id, instrumentToken, brokerage: brokerageUser, subscriptionId: sub_product_id, exchangeInstrumentToken,
        createdBy: "63ecbc570302e7cf0153370c", trader: createdBy, amount: (Number(Quantity) * last_price), trade_time: trade_time_zerodha,
        margin: message.data.margin
    });

    tenxDoc.save().then(async () => {
        if (isRedisConnected && await client.exists(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)) {
            let pnl = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)
            pnl = JSON.parse(pnl);
            console.log("pnl", pnl);
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === tenxDoc.instrumentToken && element._id.product === tenxDoc.Product && !element._id.isLimit));
            console.log("matchingElement", matchingElement);
            // if instrument is same then just updating value
            if (matchingElement) {
                // Update the values of the matching element with the values of the first document
                matchingElement.amount += (tenxDoc.amount * -1);
                matchingElement.brokerage += Number(tenxDoc.brokerage);
                matchingElement.lastaverageprice = tenxDoc.average_price;
                matchingElement.lots += Number(tenxDoc.Quantity);
                matchingElement.margin = message.data.margin;

            } else {
                console.log("in else saving data");
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
                    margin: message.data.margin
                });
            }

            const data = await client.set(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`, JSON.stringify(pnl));
            console.log(data)

        }

        if (isRedisConnected) {
            await client.expire(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`, secondsRemaining);
        }
    }).catch((err) => {
        console.log("in err", err)
    });
}

exports.pendingOrderMain = async ()=>{
    await client2.connect();
    await client4.connect();


    const setting = await getSetting();
    let accountType;
    if (setting.ltp == xtsAccountType || setting.complete == xtsAccountType) {
        accountType = xtsAccountType;
    } else {
        accountType = zerodhaAccountType;
    }
    let isRedisConnected = getValue();
    let brokerageDetailBuyUser = await buyBrokerageUser(zerodhaAccountType, isRedisConnected);
    let brokerageDetailSellUser = await sellBrokerageUser(zerodhaAccountType, isRedisConnected);

    try {

        await client2.SUBSCRIBE("place-order", async (message) => {
            message = JSON.parse(message);


            let { exchange, symbol, buyOrSell, Quantity, Product, order_type, sub_product_id,
                exchangeInstrumentToken, validity, variety, order_id, instrumentToken,
                createdBy, _id, type, product_type, from } = message.data;

            let index = message.index;

            const lockKey = `${createdBy}-${symbol}-${Quantity}`
            const lockValue = Date.now().toString() + Math.random * 1000;
            const release = await mutex.acquire();

            try {
                // Try to acquire the lock
                const lockExpiration = 10;

                const lockAcquired = await acquireLock(lockKey, lockValue, lockExpiration);

                if (!lockAcquired) {
                    // console.log('Another process is already saving data.');
                    return;
                }


                if(product_type.toString() === "6517d3803aeb2bb27d650de0"){
                    await tenxTradeStopLoss(message, brokerageDetailBuyUser, brokerageDetailSellUser);
                } else if(product_type.toString() === "6517d40e3aeb2bb27d650de1"){
                
                } else if(product_type.toString() === "6517d48d3aeb2bb27d650de5"){
                
                } else if(product_type.toString() === "6517d46e3aeb2bb27d650de3"){
                
                } else if(product_type.toString() === "65449ee06932ba3a403a681a"){
                
                }



                data = await client.get('stoploss-stopprofit');
                data = JSON.parse(data);
                let index2;
                let symbolArr = data[`${instrumentToken}`];
                // console.log("first index2", index2)
                for (let i = 0; i < symbolArr.length; i++) {

                    if (symbolArr[i].instrumentToken === instrumentToken &&
                        symbolArr[i].createdBy.toString() === createdBy.toString() &&
                        Math.abs(symbolArr[i].Quantity) === Math.abs(Number(Quantity)) &&
                        symbolArr[i].buyOrSell === buyOrSell && 
                        symbolArr[i].type !== type) {

                        const update = await PendingOrder.findOne({ _id: new ObjectId(symbolArr[i]._id) })
                        update.status = "Cancelled";
                        update.execution_price = 0;
                        update.execution_time = new Date();
                        await update.save();
                            // console.log("in if index2", index2)
                        index2 = i;
                        break;
                    }
                }

                // console.log("value of index2", index2, index)
                if (index2 !== undefined) {
                    // console.log("value of in if index2", index2)
                    symbolArr.splice(Math.max(index2, index), 1);
                    symbolArr.splice(Math.min(index2, index), 1);
                } else {
                    symbolArr.splice(index, 1);
                }

                const update = await PendingOrder.updateOne({ _id: new ObjectId(_id) }, {
                    $set: {
                         status: "Executed",
                         execution_time: new Date(),
                         execution_price: last_price
                    }
                })

                let pnlData = await client.get(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`)
                pnlData = JSON.parse(pnlData)
                for(let elem of pnlData){
                  // console.log("pnl dtata", elem, pnlData)
                  const buyOrSell = elem.lots > 0 ? "BUY" : "SELL";
                  if(elem._id.symbol === symbol && elem._id.isLimit && buyOrSell === buyOrSell){
                    elem.margin = 0;
                    break;
                  }
                }
                await client.set(`${createdBy.toString()}${sub_product_id.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlData));
    
                data[`${instrumentToken}`] = symbolArr;
                const myDAta = await client.set('stoploss-stopprofit', JSON.stringify(data));
                await client4.PUBLISH("order-notification", JSON.stringify({ symbol: symbol, createdBy: createdBy, Quantity: Quantity, execution_price: last_price, type: type }))


            } catch (error) {
                console.error('Error saving data:', error);
            } finally {
                // Release the lock
                release();
                // await releaseLock(lockKey, lockValue);
            }

        });

    } catch (err) {
        console.log(err)
    }
}

async function acquireLock(lockKey, lockValue, expiration) {
    const result = await clientForIORedis.set(lockKey, lockValue, 'NX', 'EX', expiration);
    return result === 'OK';
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

async function getSetting() {
    const setting = await Setting.find().select('toggle');
    return setting;
}

async function buyBrokerageCompany(accountType, isRedisConnected) {
    let brokerageDetailBuy;
    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-company`)) {
        brokerageDetailBuy = await client.HGET('brokerage', `buy-company`);
        brokerageDetailBuy = JSON.parse(brokerageDetailBuy);
    } else {
        brokerageDetailBuy = await BrokerageDetail.find({ transaction: "BUY", accountType: accountType });
        await client.HSET('brokerage', `buy-company`, JSON.stringify(brokerageDetailBuy));
    }

    return brokerageDetailBuy;
}

async function sellBrokerageCompany(accountType, isRedisConnected) {
    let brokerageDetailSell;
    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-company`)) {
        brokerageDetailSell = await client.HGET('brokerage', `sell-company`);
        brokerageDetailSell = JSON.parse(brokerageDetailSell);
    } else {
        brokerageDetailSell = await BrokerageDetail.find({ transaction: "SELL", accountType: accountType });
        await client.HSET('brokerage', `sell-company`, JSON.stringify(brokerageDetailSell));
    }

    return brokerageDetailSell;
}

async function sellBrokerageUser(zerodhaAccountType, isRedisConnected) {
    let brokerageDetailSellUser;
    if (isRedisConnected && await client.HEXISTS('brokerage', `sell-user`)) {
        brokerageDetailSellUser = await client.HGET('brokerage', `sell-user`);
        brokerageDetailSellUser = JSON.parse(brokerageDetailSellUser);
    } else {
        brokerageDetailSellUser = await BrokerageDetail.find({ transaction: "SELL", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `sell-user`, JSON.stringify(brokerageDetailSellUser));
    }

    return brokerageDetailSellUser;
}

async function buyBrokerageUser(zerodhaAccountType, isRedisConnected) {
    let brokerageDetailBuyUser;
    if (isRedisConnected && await client.HEXISTS('brokerage', `buy-user`)) {
        brokerageDetailBuyUser = await client.HGET('brokerage', `buy-user`);
        brokerageDetailBuyUser = JSON.parse(brokerageDetailBuyUser);
    } else {
        brokerageDetailBuyUser = await BrokerageDetail.find({ transaction: "BUY", accountType: zerodhaAccountType });
        await client.HSET('brokerage', `buy-user`, JSON.stringify(brokerageDetailBuyUser));
    }

    return brokerageDetailBuyUser;
}

const getLastTradeMarginAndCaseNumber = async (data, pnlData, from) => {
    const mySymbol = pnlData.filter((elem)=>{
        return elem?._id?.symbol === data.symbol;
    })

    const runningLotForSymbol = mySymbol[0]?.lots;
    const transactionTypeForSymbol = mySymbol[0]?.lots >= 0 ? "BUY" : mySymbol[0]?.lots < 0 && "SELL";
    const quantity = data.Quantity;
    const transaction_type = data.buyOrSell;
    const symbol = mySymbol[0]?.symbol;
    let margin = 0;
    let caseNumber = 0;

    const DataBase = from===virtual ? PaperTrade : 
                    from===internship ? InternshipTrade : 
                    from===dailyContest ? DailyContestMockUser : 
                    from===marginx ? MarginXMockUser :
                    from===tenx && TenXTrader;

    
    if(pnlData?.length > 0){
        margin = mySymbol[0]?.margin;
    } else{
        const lastTradeData = await DataBase.findOne({symbol: symbol, trader: new ObjectId(createdBy), trade_time: {$gte: new Date()}})
        .sort({ _id: -1 })
        .limit(1)
        margin = lastTradeData && lastTradeData.margin;
    }

    if(Math.abs(runningLotForSymbol) > Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        // if squaring of some quantity
        caseNumber = 2;
    } else if(Math.abs(runningLotForSymbol) < Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        // if squaring of all quantity and adding more in reverse direction (square off more quantity)
        caseNumber = 4;
    } else if(Math.abs(runningLotForSymbol) === Math.abs(quantity) && transactionTypeForSymbol !== transaction_type){
        // if squaring off all quantity
        caseNumber = 3;
    } else if(transactionTypeForSymbol === transaction_type){
        // if adding more quantity
        caseNumber = 1;
    } else{
        caseNumber = 0;
    }

    return {margin: margin, caseNumber: caseNumber, runningLotForSymbol: runningLotForSymbol}
}

const calculateNetPnl = async (tradeData, pnlData, data) => {
    let addUrl = 'i=' + tradeData.exchange + ':' + tradeData.symbol;
    pnlData.forEach((elem, index) => {
        addUrl += ('&i=' + elem._id.exchange + ':' + elem._id.symbol);
    });

    let url = `https://api.kite.trade/quote/ltp?${addUrl}`;
    const api_key = data.getApiKey;
    const access_token = data.getAccessToken;
    let auth = 'token' + api_key + ':' + access_token;
    let authOptions = {
        headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
        },
    };

    const arr = [];
    try {
        const response = await axios.get(url, authOptions);

        for (let instrument in response.data.data) {
            let obj = {};
            obj.last_price = response.data.data[instrument].last_price;
            obj.instrument_token = response.data.data[instrument].instrument_token;
            arr.push(obj);
        }

        let totalNetPnl = 0
        let totalBrokerage = 0
        let totalGrossPnl = 0

        
        const ltp = arr.filter((subelem) => {
            return subelem?.instrument_token == tradeData?.instrumentToken;
        })

        tradeData.last_price = ltp[0]?.last_price;


        for (let elem of pnlData) {
            let grossPnl = (elem?.amount + (elem?.lots) * ltp[0]?.last_price);
            totalGrossPnl += grossPnl;
            totalBrokerage += Number(elem?.brokerage);
        }

        totalNetPnl = totalGrossPnl - totalBrokerage;

        return totalNetPnl;
    } catch (err) {
        console.log(err)
    }
}

const marginZeroCase = async (tradeData, availableMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(tradeData, tradeData.Quantity, data);
    // console.log("0th case", availableMargin, requiredMargin);

    if((availableMargin-requiredMargin) > 0){
        tradeData.margin = requiredMargin;
        return;
    } else{
        // await takeRejectedTrade(req, res, from);
    }
}

const marginFirstCase = async (tradeData, availableMargin, prevMargin, from, data) => {
    const requiredMargin = await calculateRequiredMargin(tradeData, tradeData.Quantity, data);
    // console.log("1st case", availableMargin, prevMargin, requiredMargin);

    if((availableMargin-requiredMargin) > 0){
        tradeData.margin = requiredMargin+prevMargin;
        return;
    } else{
        // await takeRejectedTrade(req, res, from);
    }
}

const marginSecondCase = async (tradeData, prevMargin, prevQuantity) => {
    const quantityPer = Math.abs(tradeData.Quantity) * 100 / Math.abs(prevQuantity);
    const marginReleased = prevMargin*quantityPer/100;
    tradeData.margin = prevMargin-marginReleased;
    // console.log("2nd case", quantityPer, marginReleased);

    return;
}

const marginThirdCase = async (tradeData) => {
    tradeData.margin = 0;
    console.log("3rd case");

    return;
}

const marginFourthCase = async (tradeData, availableMargin, prevQuantity, from, data) => {
    const quantityForTrade = Math.abs(Math.abs(tradeData.Quantity) - Math.abs(prevQuantity));
    const requiredMargin = await calculateRequiredMargin(tradeData, quantityForTrade, data);

    if((availableMargin-requiredMargin) > 0){
        tradeData.margin = requiredMargin;
        return;
    } else{
        // await takeRejectedTrade(req, res, from);
    }
}

const calculateRequiredMargin = async (tradeData, Quantity, data) => {
    const { exchange, symbol, buyOrSell, variety, Product, order_type, last_price} = tradeData;
    let auth = 'token ' + data.getApiKey + ':' + data.getAccessToken;
    let headers = {
        'X-Kite-Version': '3',
        'Authorization': auth,
        "content-type": "application/json"
    }
    let orderData = [{
        "exchange": exchange,
        "tradingsymbol": symbol,
        "transaction_type": buyOrSell,
        "variety": variety,
        "product": Product,
        "order_type": order_type,
        "quantity": Quantity,
        "price": 0,
        "trigger_price": 0
    }]

    try{
        if(buyOrSell === "SELL"){
            const marginData = await axios.post(`https://api.kite.trade/margins/basket?consider_positions=true`, orderData, { headers: headers })
            const zerodhaMargin = marginData.data.data.orders[0].total;
    
            return zerodhaMargin;    
        } else{
            return (last_price * Math.abs(Quantity));
        }
    }catch(err){
        console.log(err);
    }
    
}

const availableMarginFunc = async (fundDetail, pnlData, npnl) => {

    const openingBalance = fundDetail?.openingBalance ? fundDetail?.openingBalance : fundDetail?.totalFund;
    if(!pnlData.length){
        return openingBalance;
    }

    const totalMargin = pnlData.reduce((total, acc)=>{
        return total + acc.margin;
    }, 0)
    // console.log("availble margin", totalMargin, openingBalance, npnl)
    if(npnl < 0)
    return openingBalance-totalMargin-npnl;
    else
    return openingBalance-totalMargin;
}


