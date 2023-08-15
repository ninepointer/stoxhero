const InfinityTrader = require("../../models/mock-trade/infinityTrader");
const InfinityTradeCompany = require("../../models/mock-trade/infinityTradeCompany");
const {getIOValue} = require('../../marketData/socketio');
const mongoose = require('mongoose')
const {overallMockPnlRedis, overallMockPnlTraderWiseRedis, letestTradeMock, overallPnlUsers} = require("../../services/adminRedis/infinityMock");
const {marginCalculationTrader, marginCalculationCompany} = require("../../marketData/marginData");
const {clientForIORedis} = require('../../marketData/redisClient');


exports.infinityTrade = async (req, res, otherData) => {

    const io = getIOValue();
    let {exchange, symbol, buyOrSell, Quantity, Product, OrderType, exchangeInstrumentToken, fromAdmin,
        validity, variety, algoBoxId, order_id, instrumentToken, realBuyOrSell, realQuantity, 
        real_instrument_token, realSymbol, trader } = req.body 

    let {secondsRemaining, isRedisConnected, brokerageCompany, brokerageUser, originalLastPriceUser, originalLastPriceCompany, trade_time} = otherData;
    const session = await mongoose.startSession();
    try{

        const mockCompany = await InfinityTradeCompany.findOne({order_id : order_id});
        const mockInfintyTrader = await InfinityTrader.findOne({order_id : order_id});
        if((mockCompany || mockInfintyTrader) && dateExist.order_timestamp !== newTimeStamp && checkingMultipleAlgoFlag === 1){
            return res.status(422).json({message : "data already exist", error: "Fail to trade"})
        }

        
        session.startTransaction();

        const companyDoc = {
            status:"COMPLETE", average_price: originalLastPriceCompany, Quantity: realQuantity, 
            Product, buyOrSell:realBuyOrSell, variety, validity, exchange, order_type: OrderType, 
            symbol: realSymbol, placed_by: "stoxhero", algoBox:algoBoxId, order_id, 
            instrumentToken: real_instrument_token, brokerage: brokerageCompany, createdBy: req.user._id,
            trader : trader, isRealTrade: false, amount: (Number(realQuantity)*originalLastPriceCompany), 
            trade_time:trade_time, exchangeInstrumentToken
        }

        const traderDoc = {
            status:"COMPLETE",  average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
            variety, validity, exchange, order_type: OrderType, symbol, placed_by: "stoxhero",
            isRealTrade: false, order_id, instrumentToken, brokerage: brokerageUser, exchangeInstrumentToken,
            createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time,
        }

        const mockTradeDetails = await InfinityTradeCompany.create([companyDoc], { session });
        const algoTrader = await InfinityTrader.create([traderDoc], { session });


        const pipeline = clientForIORedis.pipeline();

        await pipeline.get(`${trader.toString()} overallpnl`)
        await pipeline.get(`overallMockPnlCompany`)
        await pipeline.get(`traderWiseMockPnlCompany`)

        const results = await pipeline.exec();

        const traderOverallPnl = results[0][1];
        const companyOverallPnl = results[1][1];
        const traderWisePnl = results[2][1];
        
        const overallPnlUser = await overallPnlUsers(algoTrader[0], trader, traderOverallPnl);
        const redisValueOverall = await overallMockPnlRedis(mockTradeDetails[0], companyOverallPnl);
        const redisValueTrader = await overallMockPnlTraderWiseRedis(mockTradeDetails[0], traderWisePnl);
        const lastTradeMock = await letestTradeMock(mockTradeDetails[0]);

        // console.log(traderOverallPnl, companyOverallPnl, traderWisePnl)
        const pipelineForSet = clientForIORedis.pipeline();

        await pipelineForSet.set(`${trader.toString()} overallpnl`, overallPnlUser);
        await pipelineForSet.set(`overallMockPnlCompany`, redisValueOverall);
        await pipelineForSet.set(`traderWiseMockPnlCompany`, redisValueTrader);
        await pipelineForSet.set(`lastTradeDataMock`, lastTradeMock);

        await pipelineForSet.exec();

        if(isRedisConnected){

            const pipeline = clientForIORedis.pipeline();

            pipeline.expire(`${trader.toString()} overallpnl`, secondsRemaining);
            pipeline.expire(`overallMockPnlCompany`, secondsRemaining);
            pipeline.expire(`traderWiseMockPnlCompany`, secondsRemaining);
            pipeline.expire(`lastTradeDataMock`, secondsRemaining);

            await pipeline.exec();
        }
        
        io.emit("updatePnl", mockTradeDetails)
        if(fromAdmin){
            // console.log("in admin side")
            io.emit(`${trader.toString()}autoCut`, algoTrader)
        }


        if (pipelineForSet._result[0][1] === "OK" && pipelineForSet._result[1][1] === "OK" && pipelineForSet._result[2][1] === "OK" && pipelineForSet._result[3][1] === "OK") {
            const saveMarginCompany = await marginCalculationCompany(req.body?.marginData, req.body, originalLastPriceCompany, order_id);
            const saveMarginUser = await marginCalculationTrader(req.body?.marginData, req.body, originalLastPriceUser, order_id);        
            await session.commitTransaction();
            res.status(201).json({ status: 'Complete', message: 'COMPLETE' });
        } else {
            throw new Error();
        }
        

    } catch(err){
        console.error('Transaction failed, documents not saved:', err);

        const pipeline = clientForIORedis.pipeline();
        await pipeline.del(`${trader.toString()} overallpnl`);
        await pipeline.del(`traderWiseMockPnlCompany`);
        await pipeline.del(`overallMockPnlCompany`);
        await pipeline.del(`lastTradeDataMock`);
        const results = await pipeline.exec();

        await session.abortTransaction();
        res.status(201).json({status: 'error', message: 'Your trade was not completed. Please attempt the trade once more'});
    } finally {
    // End the session
        session.endSession();
    }
}