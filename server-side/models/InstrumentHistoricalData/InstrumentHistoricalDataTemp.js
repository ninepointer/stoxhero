const mongoose = require("mongoose");

const instrumentHistoricalDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  instrumentToken: {
    type: String,
    required: false,
  },
  exchangeToken: {
    type: String,
    required: false,
  },
  expiry: {
    type: Date,
  },
  candles: [
    {
      timestamp: Date,
      open: Number,
      high: Number,
      close: Number,
      low: Number,
      volume: Number,
    },
  ],
  createdOn: {
    type: Date,
    required: true,
  },
});

const instrumentHistoricalData = mongoose.model(
  "history-tick-minute-temp",
  instrumentHistoricalDataSchema
);
module.exports = instrumentHistoricalData;
