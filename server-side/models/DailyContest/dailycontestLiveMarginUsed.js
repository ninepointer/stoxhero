const mongoose = require("mongoose");
const { Schema } = mongoose;

const liveMargin = new mongoose.Schema({
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

const LiveMargin = mongoose.model('dailycontest-margin-calculation-live', liveMargin);
module.exports = LiveMargin;

/*
1. api check for ohcl.
2. update ohcl at 9:16.
3. set a flag in tradable instrument.
4. show instrument to infinity trader according that flag(infinity visibility).
*/