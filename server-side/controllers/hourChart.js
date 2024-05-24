const TradeData = require("../models/mock-trade/paperTrade");
const HistoryData = require("../models/InstrumentHistoricalData/InstrumentHistoricalData");
const moment = require('moment');
const TradableInstrumentSchema = require("../models/Instruments/tradableInstrumentsSchema");

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
    // console.log(req.file);
    // const data = await uploadFileToAzure(req.file)

    // console.log(data);
    // return;
    try {
        const userId = '662f804700f04a05fe3c941f';
        const today = moment('2024-05-22');
        const startToday = '2024-05-22';
        const endToday = '2024-05-23'

        // const userId = req?.user?._id;
        // const today = moment();
        // const startToday = today.clone().startOf('day').subtract(5, 'hours').subtract(30, 'minutes');
        // const endToday = today.clone().endOf('day').subtract(5, 'hours').subtract(30, 'minutes');

        const pnlObjArr = [];
        const tradeData = await TradeData.find({ status: "COMPLETE", trader: new ObjectId(userId), trade_time: { $gt: new Date(startToday), $lt: new Date(endToday) } })
        const symbolArr = tradeData.map((elem) => {
            return elem?.symbol;
        })

        const uniqueSymbolArr = [...new Set(symbolArr)];

        const historyTicksInstrument = await HistoryData.find({ createdOn: { $gt: new Date(startToday), $lt: new Date(endToday) }, symbol: { $in: uniqueSymbolArr } })
        const uniqueTicksArr = [...new Map(historyTicksInstrument.map(item => [item.symbol, item])).values()];

        const todaysDatePart = (new Date(startToday)).toISOString()?.split('T')?.[0];
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

            const arrData = await formatTradeData(filteredArr);
            const pnlObj = await calculatePnl(arrData, uniqueTicksArr, timeArr[i])
            pnlObjArr.push(pnlObj)
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

const formatTradeData = async (tradeData) => {
    const map = new Map();
    tradeData.forEach(trade => {
        const { symbol, amount, brokerage, Quantity } = trade;

        if (map.has(symbol)) {
            const existingTrade = map.get(symbol);
            existingTrade.amount += (amount * -1);
            existingTrade.brokerage += brokerage;
            existingTrade.Quantity += Quantity;
        } else {
            map.set(symbol, { symbol, amount: (amount * -1), brokerage, Quantity });
        }
    });
    // Convert map values back to an array
    const formattedData = Array.from(map.values());
    return formattedData;
}

const calculatePnl = async (tradeData, ltpData, timestamp) => {
    let totalGpnl = 0;

    for (const elem of tradeData) {
        const getCandleArray = ltpData.find((subelem) => subelem.symbol === elem.symbol)?.candles;

        if (!getCandleArray) continue;

        const utcTimeStamp = new Date(timestamp);
        utcTimeStamp.setHours(utcTimeStamp.getHours() - 5);
        utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() - 30);

        const ltpCandle = getCandleArray.find((subelem) => {
            return new Date(subelem.timestamp).toISOString() === utcTimeStamp.toISOString();
        });

        const ltp = ltpCandle?.close;

        if (ltp === undefined) continue;

        const gpnl = elem.Quantity !== 0
            ? elem.amount + elem.Quantity * ltp
            : elem.amount;

        totalGpnl += gpnl;
    }

    return { gpnl: totalGpnl, timestamp };
};

async function downloadCsvBlob(url) {

    const blobService = new BlockBlobClient(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName,
        url
    );

    // Download the blob content as a stream
    const downloadBlockBlobResponse = await blobService.download();
    return downloadBlockBlobResponse.readableStreamBody;
}

async function parseCsvStream(stream) {
    return new Promise((resolve, reject) => {
        const results = [];
        stream
            .pipe(csv())
            .on('data', ((data)=>{
                console.log('data', data)
                results.push(data)
            }))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

exports.fetData = async (req, res) => {
    try {
        // const url = 'https://stagingdmt.blob.core.windows.net/dmt-trade/06501232945102076-data_hour_calcluation.csv'

        const url = '06501232945102076-data_hour_calcluation.csv'
        const csvStream = await downloadCsvBlob(url);
        const csvData = await parseCsvStream(csvStream);

        console.log(csvData);

        const uniqueTrades = csvData.filter((trade, index, self) => 
            index === self.findIndex((t) => (
              t.Symbol === trade.Symbol && 
              t["Expiry Date"] === trade["Expiry Date"] && 
              t["Strike Price"] === trade["Strike Price"] && 
              t["Option Type"] === trade["Option Type"]
            ))
          );
          
          console.log(uniqueTrades);

          const indexName = [];
          const strike = [];
          const expiry = [];
          const optionType = [];

          for(const elem of uniqueTrades){
            indexName.push(elem.Symbol);
            strike.push(elem['Strike Price']);
            expiry.push(moment(elem['Expiry Date'], "DD MMMM YYYY").format("YYYY-MM-DD"));
            optionType.push(elem['Option Type']);
          }

          const filter = {
            name: {$in: [...new Set(indexName)]},
            expiry: {$in: [...new Set(expiry)]},
            strike: { $in: [...new Set(strike)] },
            instrument_type: { $in: [...new Set(optionType)] }
          }; 

          const data = await TradableInstrumentSchema.find(filter);
    
        res.status(200).json({
            status: "success",
            data,
            filter
        });
    } catch (error) {
        console.error("Error downloading or parsing CSV:", error);
    }
}
