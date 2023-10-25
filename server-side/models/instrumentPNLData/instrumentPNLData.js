const mongoose = require("mongoose");
const { Schema } = mongoose;

const InstrumentPNLSchema = new mongoose.Schema({
    grossPnl:{
        type: String,
        required: true
    },
    brokerage:{
        type: String,
        required : true
    },
    netPnl:{
        type: String,
        required : true
    },
    date:{
        type: String,
        required : true
    },
    symbol:{
        type: String,
        required : true
    },
    timestamp:{
        type: String,
        // required : true
    },
    open:{
        type: Number,
        // required : true
    },
    volume:{
        type: Number,
        // required : true
    },
})

const instrumentPNLDetail = mongoose.model("instrument-pnl", InstrumentPNLSchema);
module.exports = instrumentPNLDetail;