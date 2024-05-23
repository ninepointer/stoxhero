const TradeData = require("../models/mock-trade/paperTrade");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const moment = require('moment');
const {ObjectId} = require('mongoose');


exports.hourChart = async (req, res) => {
    req.user._id = '662f804700f04a05fe3c941f';
    try {

        const today = moment('2024-05-22');
        const startToday = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
        const endToday = today.clone().endOf('day').subtract(5, 'hours').subtract(30, 'minutes');
        const tradeData = await TradeData.find({trader: new ObjectId(req.user._id), trade_time: { $gt: new Date(startToday), $lt: new Date(endToday) } })

        const symbolArr = tradeData.map((elem) => {
            return elem?.symbol;
        })

        const uniqueSymbolArr = [...new Set(symbolArr)];

        const historyTicksInstrument = await HistoryData.find({ createdOn: { $gt: new Date(startToday), $lt: new Date(endToday) }, symbol: { $in: uniqueSymbolArr } })
        const uniqueTicksArr = [...new Map(historyTicksInstrument.map(item => [item.symbol, item])).values()];

        const todaysDatePart = (new Date(endToday)).toISOString()?.split('T')?.[0];
        const timeArr = [
            `${todaysDatePart}T09:15:00.000+00:00`,
            `${todaysDatePart}T10:15:00.000+00:00`,
            `${todaysDatePart}T11:15:00.000+00:00`,
            `${todaysDatePart}T12:15:00.000+00:00`,
            `${todaysDatePart}T13:15:00.000+00:00`,
            `${todaysDatePart}T14:15:00.000+00:00`,
            `${todaysDatePart}T15:15:00.000+00:00`
        ];

        for(let i=0; i < timeArr.length-1; i++){
            const filteredArr = tradeData.filter((elem)=>{
                return elem.trade_time >= timeArr[0] && elem.trade_time <= timeArr[i+1]
            })
        }
        res.status(200).json({
            status: "success",
            data: uniqueTicksArr
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message,
        });
    }
};