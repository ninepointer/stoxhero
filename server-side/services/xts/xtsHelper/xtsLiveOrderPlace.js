

// const axios = require("axios")
// const BrokerageDetail = require("../../../models/Trading Account/brokerageSchema");
// const PaperTrade = require("../../../models/mock-trade/paperTrade");
// const singleLivePrice = require('../../../marketData/sigleLivePrice');
// const StoxheroTrader = require("../../../models/mock-trade/stoxheroTrader");
// const InfinityLiveTrader = require("../../../models/TradeDetails/infinityLiveUser");
// const InfinityLiveCompany = require("../../../models/TradeDetails/liveTradeSchema");
// const InfinityMockTrader = require("../../../models/mock-trade/infinityTrader");
// const InfinityMockCompany = require("../../../models/mock-trade/infinityTradeCompany");
// const StoxheroTradeCompany = require("../../../models/mock-trade/stoxheroTradeCompany");
// const io = require('../../../marketData/socketio');
// const {client} = require('../../../marketData/redisClient');
// const mongoose = require('mongoose');
// const singleXTSLivePrice = require("./singleXTSLivePrice");
const {placeOrder} = require("../xtsInteractive")
// const RetreiveOrder = require("../../../models/TradeDetails/retreiveOrder");
// const {xtsAccountType} = require("../../../constant");

exports.liveTrade = async (req, res) => {
    // let date = new Date();
    // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // todayDate = todayDate + "T23:59:59.999Z";
    // const today = new Date(todayDate);
    // const secondsRemaining = Math.round((today.getTime() - date.getTime()) / 1000);


    let {algoBoxId, exchange, symbol, buyOrSell, Quantity, 
        Product, OrderType, validity, variety,trader,
        uId, instrumentToken, realBuyOrSell, realQuantity, 
        dontSendResp, exchangeInstrumentToken} = req.body

        console.log(req.body)

    if(!exchange || !symbol || !buyOrSell || !realQuantity || !Product || !OrderType || !validity || !variety || !exchangeInstrumentToken){
        return res.status(422).json({error : "please fill all the feilds..."})
    }

    let obj = {
        exchange: exchange,
        exchangeInstrumentToken: exchangeInstrumentToken,
        Product: Product,
        OrderType: OrderType,
        buyOrSell: realBuyOrSell,
        validity: validity,
        disclosedQuantity: 0,
        Quantity: realQuantity,
    }
    const placeorder = await placeOrder(obj, req, res);

}
