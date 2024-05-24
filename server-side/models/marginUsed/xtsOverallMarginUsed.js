const mongoose = require("mongoose");
const { Schema } = mongoose;

const liveMargin = new mongoose.Schema({

    marginRequired: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: ()=>new Date()
    },
    noOfTrader:{
        type: Number,
        // required: true
    }
});

const LiveMargin = mongoose.model('xts-used-margin', liveMargin);
module.exports = LiveMargin;
