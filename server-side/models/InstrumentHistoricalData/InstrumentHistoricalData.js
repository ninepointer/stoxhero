const mongoose = require("mongoose");

const instrumentHistoricalDataSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    instrumentToken: {
        type: String,
        // required: true
    },
    exchangeToken: {
        type: String,
        // required: true
    },
    expiry: {
        type: Date
    },
    candles: [
        {
            timestamp: Date,
            open: Number,
            high: Number,
            close: Number,
            low: Number,
            volume: Number
        }
    ],
    createdOn: {
        type: Date,
        required: true
    }
})

const instrumentHistoricalData = mongoose.model("history-tick", instrumentHistoricalDataSchema);
module.exports = instrumentHistoricalData;