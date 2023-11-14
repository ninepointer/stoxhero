const MarginXMockUser = require("../../models/marginX/marginXUserMock");
const MarginXMockCompany = require("../../models/marginX/marginXCompanyMock");
const {getIOValue} = require('../../marketData/socketio');
const mongoose = require('mongoose')
const {clientForIORedis} = require('../../marketData/redisClient');
const {lastTradeDataMockMarginX, traderWiseMockPnlCompanyMarginX, overallMockPnlCompanyMarginX, overallpnlMarginX} = require("../../services/adminRedis/Mock");
const {marginx} = require("../../constant");
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");



exports.marginxTrade = async (req, res, otherData) => {
    const io = getIOValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, order_type, exchangeInstrumentToken, fromAdmin,
        validity, variety, algoBoxId, order_id, instrumentToken, marginxId, deviceDetails,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, margin, stopLossPrice, stopProfitPrice, price } = req.body 

        // let marginxId = subscriptionId;
        let {secondsRemaining, isRedisConnected, brokerageCompany, brokerageUser, originalLastPriceUser, originalLastPriceCompany, trade_time} = otherData;

    const session = await mongoose.startSession();
    try{

        const mockCompany = await MarginXMockCompany.findOne({order_id : order_id});
        const mockInfintyTrader = await MarginXMockUser.findOne({order_id : order_id});
        if((mockCompany || mockInfintyTrader)){
            return res.status(422).json({message : "data already exist", error: "Something went wrong."})
        }

        
        session.startTransaction();

        const companyDoc = {
            status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: order_type, 
            symbol: realSymbol, placed_by: "stoxhero", algoBox:algoBoxId, order_id, 
            instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
            trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
            trade_time:trade_time, exchangeInstrumentToken, marginxId,
            deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType}
        }

        const traderDoc = {
            status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell, 
            variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", marginxId,
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType},
            margin
        }

        const mockTradeDetails = (order_type !== "LIMIT") && await MarginXMockCompany.create([companyDoc], { session });
        const algoTrader = (order_type !== "LIMIT") && await MarginXMockUser.create([traderDoc], { session });

        let pnl = await client.get(`${req.user._id.toString()}${marginxId.toString()} overallpnlMarginX`)
        pnl = JSON.parse(pnl);
        let reverseTradeConditionData;
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === traderDoc.instrumentToken && element._id.product === traderDoc.Product && !element._id.isLimit));
        if(matchingElement){
          const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
          if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== traderDoc.buyOrSell) && (order_type !== "LIMIT")){
            reverseTradeConditionData = await reverseTradeCondition(req.user._id, marginxId, traderDoc, stopLossPrice, stopProfitPrice, algoTrader[0]?._id, originalLastPriceUser, pnl, marginx);
          }
        }
    
        if(reverseTradeConditionData === 0){
          stopLossPrice = 0;
          stopProfitPrice = 0;
        }

        const pipeline = clientForIORedis.pipeline();

        await pipeline.get(`${trader.toString()}${marginxId.toString()} overallpnlMarginX`)
        await pipeline.get(`overallMockPnlCompanyMarginX`)
        await pipeline.get(`traderWiseMockPnlCompanyMarginX`)

        const results = await pipeline.exec();

        const traderOverallPnl = results[0][1];
        const companyOverallPnl = results[1][1];
        const traderWisePnl = results[2][1];

        const overallPnlUser = await overallpnlMarginX(traderDoc, trader, traderOverallPnl, marginxId);
        const redisValueOverall = await overallMockPnlCompanyMarginX(companyDoc, companyOverallPnl, marginxId);
        const redisValueTrader = await traderWiseMockPnlCompanyMarginX(companyDoc, traderWisePnl, marginxId);
        const lastTradeMock = await lastTradeDataMockMarginX(companyDoc, marginxId);

        const pipelineForSet = clientForIORedis.pipeline();

        // console.log("overallPnlUser", overallPnlUser)

        await pipelineForSet.set(`${trader.toString()}${marginxId.toString()} overallpnlMarginX`, overallPnlUser);
        await pipelineForSet.set(`overallMockPnlCompanyMarginX`, redisValueOverall);
        await pipelineForSet.set(`traderWiseMockPnlCompanyMarginX`, redisValueTrader);
        await pipelineForSet.set(`lastTradeDataMockMarginX`, lastTradeMock);

        await pipelineForSet.exec();

        if(isRedisConnected){

            const pipeline = clientForIORedis.pipeline();

            pipeline.expire(`${trader.toString()}${marginxId.toString()} overallpnlMarginX`, secondsRemaining);
            pipeline.expire(`overallMockPnlCompanyMarginX`, secondsRemaining);
            pipeline.expire(`traderWiseMockPnlCompanyMarginX`, secondsRemaining);
            pipeline.expire(`lastTradeDataMockMarginX`, secondsRemaining);

            await pipeline.exec();
        }
        // Commit the transaction

        io?.emit("updatePnl", mockTradeDetails)
       
        if(fromAdmin){
            io?.emit(`${trader.toString()}autoCut`, algoTrader)
        }

        let pendingOrderRedis;
        if(stopLossPrice || stopProfitPrice || price){
          pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, algoTrader[0]?._id, marginx);
        } else{
          pendingOrderRedis = "OK";
        }

        if (pipelineForSet._result[0][1] === "OK" && pipelineForSet._result[1][1] === "OK" && pipelineForSet._result[2][1] === "OK" && pipelineForSet._result[3][1] === "OK") {                
            await session.commitTransaction();
            return res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
        } else {
            // await session.commitTransaction();
            throw new Error();
        }
        

    } catch(err){
        console.log(err);
        const pipeline = clientForIORedis.pipeline();
        await pipeline.del(`${trader.toString()}${marginxId.toString()} overallpnlMarginX`);
        await pipeline.del(`traderWiseMockPnlCompanyMarginX`);
        await pipeline.del(`overallMockPnlCompanyMarginX`);
        await pipeline.del(`lastTradeDataMockMarginX`);
        const results = await pipeline.exec();
        await session.abortTransaction();
        console.error('Transaction failed, documents not saved:', err);
        res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
    } finally {
    // End the session
        session.endSession();
    }
}