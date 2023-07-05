const mongoose = require("mongoose");
const { Schema } = mongoose;

const mockMargin = new mongoose.Schema({
    instrument: {
        type: String,
        required: true,
    },
    marginRequired: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: ()=>new Date()
    },
    runningLots:{
        type: Number,
        required: true
    },
    transaction_type:{
        type: String,
        required: true
    },
    noOfTrader:{
        type: Number,
        required: true
    },
    ltp:{
        type: Number,
        required: true
    },
});

const MockMargin = mongoose.model('dailycontest-margin-calculation-mock', mockMargin);
module.exports = MockMargin;


