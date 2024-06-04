const mongoose = require("mongoose");

const instrumentHistoricalDataSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    timestamp: Date,
    open: Number,
    high: Number,
    close: Number,
    low: Number,
    volume: Number,
    // createdOn: {
    //     type: Date,
    //     required: true
    // }
})

const instrumentHistoricalData = mongoose.model("history-tick-new", instrumentHistoricalDataSchema);
module.exports = instrumentHistoricalData;