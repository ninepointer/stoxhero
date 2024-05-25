const TradeData = require("../models/mock-trade/paperTrade");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const moment = require('moment');
const TradableInstrumentSchema = require("../models/Instruments/tradableInstrumentsSchema");
const ThirdPartyTrades = require('../models/mock-trade/thirdPartyTrades');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('csv');
const { BlockBlobClient } = require('@azure/storage-blob');
let getStream;
(async () => {
    getStream = (await import('into-stream')).default;
})();
const csv = require('csv-parser');
const containerName = 'dmt-trade';
const getBlobName = originalName => {
const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

const uploadFileToAzure = async (file) => {
    const blobName = getBlobName(file.originalname);
    const blobService = new BlockBlobClient(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName,
        blobName
    );
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    await blobService.uploadStream(stream, streamLength);
    
    const fileUrl = `${blobService.url}`;
    
    return { fileUrl, blobName };
};

exports.uploadMulter = uploadStrategy;

exports.hourChart = async (req, res) => {
    try {
        const date = req.query.date;
        // const userId = '662f804700f04a05fe3c941f';
        // const today = moment('2024-05-22');
        // const startToday = '2024-05-22';
        // const endToday = '2024-05-23'

        const userId = req?.user?._id;
        const today = moment(date);
        const startToday = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
        const endToday = today.clone().endOf('day')
        // .subtract(5, 'hours').subtract(30, 'minutes');

        const pnlObjArr = [];        
        const tradeData = await TradeData.find({ status: "COMPLETE", trader: new ObjectId(userId), trade_time: { $gt: new Date(startToday), $lt: new Date(endToday) } })

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

        for (let i = 0; i < timeArr.length; i++) {
            const filteredArr = tradeData.filter((elem) => {
                return new Date(elem.trade_time) >= new Date(timeArr[0]) && new Date(elem.trade_time) <= new Date(timeArr[i])
            })

            filteredArr.sort((a, b) => {
                if (a.trade_time > b.trade_time) {
                    return 1;
                }
                if (a.trade_time <= b.trade_time) {
                    return -1;
                }
            })

            const marginUtilise = await getMarginUtilisation(filteredArr)
            const averageEntryLots = await getAverageEntryLots(filteredArr);
            const arrData = await formatTradeData(filteredArr);
            // const arrData = formatedData.formattedData;

            if(tradeData.length && uniqueTicksArr.length){
                const pnlObj = await calculatePnl(arrData, uniqueTicksArr, timeArr[i])
                pnlObj.averageEntryLots = averageEntryLots;
                pnlObj.marginUtilise = marginUtilise;
                pnlObjArr.push(pnlObj)
            }
            
        }
        res.status(200).json({
            status: "success",
            data: pnlObjArr
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

const getMarginUtilisation = async (tradeData) => {
    
    const map = new Map();

    tradeData.forEach(trade => {
        const {symbol, margin } = trade;
        if (map.has(symbol)) {
            const existingTrade = map.get(symbol);
            existingTrade.margin = Math.max(margin, existingTrade.margin)
        } else {
            map.set(symbol, { symbol, margin });
        }
    });
    // Convert map values back to an array
    const formattedData = Array.from(map.values());

    const totalMarginUtilised = formattedData.reduce((total, acc)=>{
        return total + acc?.margin
    }, 0)

    return totalMarginUtilised;
}

const getAverageEntryLots = async (tradeData) => {
    let totalEntryLots = 0;
    let totalEntryLotsFrequency = 0;

    for (const elem of tradeData) {
        const { Quantity, buyOrSell, trade_time, symbol } = elem;
        const previousTrades = tradeData.filter((trades) => {
            return (new Date(trades.trade_time) < new Date(trade_time));
        })

        const pnlData = await formatTradeData(previousTrades);

        const mySymbol = pnlData.filter((pnl) => {
            return pnl?.symbol === symbol;
        })

        const runningLotForSymbol = mySymbol[0]?.Quantity;
        const transactionTypeForSymbol = mySymbol[0]?.Quantity >= 0 ? "BUY" : mySymbol[0]?.Quantity < 0 && "SELL";
        const quantity = Quantity;
        const transaction_type = buyOrSell;

        if (Math.abs(runningLotForSymbol) > Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
            // if squaring of some quantity
        } else if (Math.abs(runningLotForSymbol) < Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
            // if squaring of all quantity and adding more in reverse direction (square off more quantity)
            totalEntryLotsFrequency += 1;
            totalEntryLots += Math.abs(Quantity-runningLotForSymbol);
        } else if (Math.abs(runningLotForSymbol) === Math.abs(quantity) && transactionTypeForSymbol !== transaction_type) {
            // if squaring off all quantity
        } else if (transactionTypeForSymbol === transaction_type) {
            // if adding more quantity
            totalEntryLotsFrequency += 1;
            totalEntryLots += Quantity;
        } else {
            totalEntryLotsFrequency += 1;
            totalEntryLots += Quantity;
        }

    }

    const averageEntryLots = Math.ceil(totalEntryLots/totalEntryLotsFrequency) || 0;
    return averageEntryLots;
}

const formatTradeData = async (tradeData) => {

    const map = new Map();

    tradeData.forEach(trade => {
        const { symbol, amount, brokerage, Quantity, buyOrSell } = trade;
        if (map.has(symbol)) {
            const existingTrade = map.get(symbol);
            existingTrade.amount += (amount * -1);
            existingTrade.brokerage += brokerage;
            existingTrade.Quantity += Quantity;
        } else {
            map.set(symbol, { symbol, amount: (amount * -1), brokerage, Quantity, buyOrSell });
        }
    });
    // Convert map values back to an array
    const formattedData = Array.from(map.values());
    return formattedData;
}

const calculatePnl = async (tradeData, ltpData, timestamp) => {
    let totalGpnl = 0;
    let totalRunningLots = 0;


    for (const elem of tradeData) {
        
        const getCandleArray = ltpData?.find((subelem) => subelem?.symbol === elem?.symbol)?.candles;

        if (!getCandleArray) continue;

        const utcTimeStamp = new Date(timestamp);
        utcTimeStamp.setHours(utcTimeStamp.getHours() - 5);
        utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() - 30);

        const ltpCandle = getCandleArray?.find((subelem) => {
            return new Date(subelem?.timestamp)?.toISOString() === utcTimeStamp?.toISOString();
        });

        const ltp = ltpCandle?.close || 100;

        if (ltp === undefined) continue;

        const gpnl = elem.Quantity !== 0
            ? elem.amount + elem.Quantity * ltp
            : elem.amount;

        totalGpnl += gpnl;
        totalRunningLots += elem.Quantity
    }


    return { gpnl: totalGpnl, timestamp, runningLots: totalRunningLots };
};

exports.uploadCSV = async (req, res) => {
    try {
        const userId = req?.user?._id || '662f804700f04a05fe3c941f';
        const data = await uploadFileToAzure(req.file)
        const url = data.fileUrl.split('/')[data.fileUrl.split('/').length - 1];
        const savedData = await saveDataToDB(url, userId);

        res.status(200).json({
            status: "success",
            data: savedData
        });
    } catch (err) {
        res.status(200).json({
            status: "error",
            message: err?.message
        });
    }
}

async function downloadCsvBlob(url) {
    try {
        const blobService = new BlockBlobClient(
            process.env.AZURE_STORAGE_CONNECTION_STRING,
            containerName,
            url
        );
        const downloadBlockBlobResponse = await blobService.download();
        return downloadBlockBlobResponse.readableStreamBody;

    } catch (err) {
        throw new Error(err);
    }
}

async function parseCsvStream(stream) {
    return new Promise((resolve, reject) => {
        const results = [];
        stream
            .pipe(csv())
            .on('data', ((data) => {
                results.push(data)
            }))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

const saveDataToDB = async (url, userId) => {
    try {
        // const url = 'https://stagingdmt.blob.core.windows.net/dmt-trade/06501232945102076-data_hour_calcluation.csv'
        // const userId = '662f804700f04a05fe3c941f';
        // const url = '06501232945102076-data_hour_calcluation.csv'
        const csvStream = await downloadCsvBlob(url);
        const csvData = await parseCsvStream(csvStream);

        const uniqueTrades = csvData.filter((trade, index, self) =>
            index === self.findIndex((t) => (
                t.Symbol === trade.Symbol &&
                t["Expiry Date"] === trade["Expiry Date"] &&
                t["Strike Price"] === trade["Strike Price"] &&
                t["Option Type"] === trade["Option Type"]
            ))
        );

        const indexName = [];
        const strike = [];
        const expiry = [];
        const optionType = [];

        for (const elem of uniqueTrades) {
            indexName.push(elem.Symbol);
            strike.push(elem['Strike Price']);
            expiry.push(moment(elem['Expiry Date'], "DD MMMM YYYY").format("YYYY-MM-DD"));
            optionType.push(elem['Option Type']);
        }

        const filter = {
            name: { $in: [...new Set(indexName)] },
            expiry: { $in: [...new Set(expiry)] },
            strike: { $in: [...new Set(strike)] },
            instrument_type: { $in: [...new Set(optionType)] }
        };

        const data = await TradableInstrumentSchema.find(filter);

        return (await convertToTradingData(csvData, data, userId));

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const convertToTradingData = async (data, instrumentData, userId) => {
    try {
        const tradeData = [];
        for (const elem of data) {
            const particularInstrument = instrumentData.filter((instrument) => {
                return (instrument?.name === elem?.['Symbol'] && instrument?.strike == elem?.['Strike Price']
                    && instrument?.instrument_type === elem?.['Option Type'] && instrument.expiry === (moment(elem?.['Expiry Date'], "DD MMMM YYYY").format("YYYY-MM-DD"))
                )
            })?.[0];

            const { tradingsymbol, instrument_token, exchange_token } = particularInstrument;
            let buyOrSell, quantity, amount;
            if (elem?.["Buy/Sell"] === '2') {
                buyOrSell = 'SELL';
                quantity = 0 - Number(elem?.['Quantity']);
                amount = (Number(elem?.['Price']) * quantity)
            } else {
                buyOrSell = 'BUY';
                quantity = Number(elem?.['Quantity']);
                amount = (Number(elem?.['Price']) * quantity)
            }

            tradeData.push({
                order_id: elem['Trade Id'],
                status: 'COMPLETE',
                average_price: Number(elem?.['Price']),
                Quantity: quantity,
                buyOrSell,
                exchange: 'NFO',
                symbol: tradingsymbol,
                instrumentToken: instrument_token,
                exchangeInstrumentToken: exchange_token,
                amount: amount,
                trade_time: moment(elem?.['Trade Date/Time'], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format(),
                account_number: elem?.["Account Number"],
                cp_id: elem?.['CP ID'],
                ctcl_id: elem?.["CTCL ID"],
                user_id: elem?.["User Id"],
                modify_date: moment(elem?.["Modified Date/Time"], "DD MMMM YYYY HH:mm:ss").add(5, 'hours').add(30, 'minutes').utc().format(),
                trader: userId,
                createdOn: new Date(),
                createdBy: userId
            })
        }

        const savedData = await ThirdPartyTrades.create(tradeData);
        return savedData;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}
