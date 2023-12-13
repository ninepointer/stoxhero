const DailyContestMockUser = require("../../models/DailyContest/dailyContestMockUser");
const DailyContestMockCompany = require("../../models/DailyContest/dailyContestMockCompany");
const {getIOValue} = require('../../marketData/socketio');
const mongoose = require('mongoose')
const {clientForIORedis} = require('../../marketData/redisClient');
const {lastTradeDataMockDailyContest, traderWiseMockPnlCompanyDailyContest, overallMockPnlCompanyDailyContest, overallpnlDailyContest} = require("../../services/adminRedis/Mock");
const {dailyContest} = require("../../constant");
const {applyingSLSP} = require("./PendingOrderCondition/applyingSLSP")
const {reverseTradeCondition} = require("./PendingOrderCondition/reverseTradeCondition");


exports.dailyContestTrade = async (req, res, otherData) => {
    const io = getIOValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, order_type, exchangeInstrumentToken, fromAdmin,
        validity, variety, algoBoxId, order_id, instrumentToken, contestId, stopProfitPrice, stopLossPrice, price,
        realBuyOrSell, realQuantity, real_instrument_token, realSymbol, trader, deviceDetails, margin } = req.body 

        let {secondsRemaining, isRedisConnected, brokerageCompany, brokerageUser, originalLastPriceUser, originalLastPriceCompany, trade_time} = otherData;

    const session = await mongoose.startSession();
    try{

        const mockCompany = await DailyContestMockCompany.findOne({order_id : order_id});
        const mockInfintyTrader = await DailyContestMockUser.findOne({order_id : order_id});
        if((mockCompany || mockInfintyTrader)){
            return res.status(422).json({status: "error", message : "something went wrong."})
        }

        
        session.startTransaction();

        const companyDoc = {
            status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: order_type, 
            symbol: realSymbol, placed_by: "stoxhero", algoBox:algoBoxId, order_id, 
            instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
            trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
            trade_time:trade_time, exchangeInstrumentToken, contestId, deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType}
        }

        const traderDoc = {
            status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell, 
            variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero", contestId,
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
            deviceDetails: {deviceType: deviceDetails?.deviceType, platformType: deviceDetails?.platformType},
            margin
        }

        const mockTradeDetails = (order_type !== "LIMIT") && await DailyContestMockCompany.create([companyDoc], { session });
        const algoTrader = (order_type !== "LIMIT") && await DailyContestMockUser.create([traderDoc], { session });

        let pnl = await client.get(`${req.user._id.toString()}${contestId.toString()} overallpnlDailyContest`)
        pnl = JSON.parse(pnl);
        let reverseTradeConditionData;
        const matchingElement = pnl.find((element) => (element._id.instrumentToken === traderDoc.instrumentToken && element._id.product === traderDoc.Product && !element._id.isLimit));
        if(matchingElement){
          const matchingElementBuyOrSell = matchingElement?.lots > 0 ? "BUY" : "SELL";
          if(matchingElement?.lots !== 0 && (matchingElementBuyOrSell !== traderDoc.buyOrSell) && (order_type !== "LIMIT")){
            reverseTradeConditionData = await reverseTradeCondition(req.user._id, contestId, traderDoc, stopLossPrice, stopProfitPrice, algoTrader[0]?._id, originalLastPriceUser, pnl, dailyContest);
          }
        }
    
        if(reverseTradeConditionData === 0){
          stopLossPrice = 0;
          stopProfitPrice = 0;
        }

        const pipeline = clientForIORedis.pipeline();

        await pipeline.get(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`)
        await pipeline.get(`overallMockPnlCompanyDailyContest`)
        await pipeline.get(`traderWiseMockPnlCompanyDailyContest`)

        const results = await pipeline.exec();

        const traderOverallPnl = results[0][1];
        const companyOverallPnl = results[1][1];
        const traderWisePnl = results[2][1];

        const overallPnlUser = await overallpnlDailyContest(traderDoc, trader, traderOverallPnl, contestId);
        const redisValueOverall = await overallMockPnlCompanyDailyContest(companyDoc, companyOverallPnl, contestId);
        const redisValueTrader = await traderWiseMockPnlCompanyDailyContest(companyDoc, traderWisePnl, contestId);
        const lastTradeMock = await lastTradeDataMockDailyContest(companyDoc, contestId);

        const pipelineForSet = clientForIORedis.pipeline();

        await pipelineForSet.set(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, overallPnlUser);
        await pipelineForSet.set(`overallMockPnlCompanyDailyContest`, redisValueOverall);
        await pipelineForSet.set(`traderWiseMockPnlCompanyDailyContest`, redisValueTrader);
        await pipelineForSet.set(`lastTradeDataMockDailyContest`, lastTradeMock);

        await pipelineForSet.exec();

        if(isRedisConnected){

            const pipeline = clientForIORedis.pipeline();

            pipeline.expire(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`, secondsRemaining);
            pipeline.expire(`overallMockPnlCompanyDailyContest`, secondsRemaining);
            pipeline.expire(`traderWiseMockPnlCompanyDailyContest`, secondsRemaining);
            pipeline.expire(`lastTradeDataMockDailyContest`, secondsRemaining);

            await pipeline.exec();
        }

        // Commit the transaction
        io?.emit("updatePnl", mockTradeDetails)
       
        if(fromAdmin){
            io?.emit(`${trader.toString()}autoCut`, algoTrader)
        }

        let pendingOrderRedis;
        if(stopLossPrice || stopProfitPrice || price){
          pendingOrderRedis = await applyingSLSP(req, {ltp: originalLastPriceUser}, session, algoTrader[0]?._id, dailyContest);
        } else{
          pendingOrderRedis = "OK";
        }

        if (pendingOrderRedis==="OK" && pipelineForSet._result[0][1] === "OK" && pipelineForSet._result[1][1] === "OK" && pipelineForSet._result[2][1] === "OK" && pipelineForSet._result[3][1] === "OK") {                
            await session.commitTransaction();
            return res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
        } else {
            // await session.commitTransaction();
            throw new Error();
        }
        

    } catch(err){
        console.log(err);
        const pipeline = clientForIORedis.pipeline();
        await pipeline.del(`${trader.toString()}${contestId.toString()} overallpnlDailyContest`);
        await pipeline.del(`traderWiseMockPnlCompanyDailyContest`);
        await pipeline.del(`overallMockPnlCompanyDailyContest`);
        await pipeline.del(`lastTradeDataMockDailyContest`);
        const results = await pipeline.exec();
        await session.abortTransaction();
        console.error('Transaction failed, documents not saved:', err);
        res.status(201).json({status: 'error', message: 'Something went wrong. Please try again.'});
    } finally {
    // End the session
        session.endSession();
    }
}