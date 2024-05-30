const mongoose = require("mongoose");
const { Schema } = mongoose;
const {xtsAccountType, zerodhaAccountType} = require("../../constant");


const indiaVix = new mongoose.Schema({
    instrument_token:{
        type: Number,
        required: true
    },
    exchange_token:{
        type: Number,
        required : true
    },
    tradingsymbol:{
        type: String,
        required : true
    },
    open:{
        type: Number,
        required : true
    },
    low:{
        type: Number,
        required : true
    },
    close:{
        type: Number,
        required : true
    },
    high:{
        type: Number,
        required : true
    },
    volume:{
        type: Number,
        required : true
    },
    timestamp: {
        type: Date,
        required : true,
    },
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date()
    }
})

const IndiaVix = mongoose.model("india-vix-data", indiaVix);
module.exports = IndiaVix;


