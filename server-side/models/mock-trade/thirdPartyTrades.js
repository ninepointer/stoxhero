// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ThirdPartyTrade = new mongoose.Schema({
    order_id:{
        type: String,
        // required: true
    },
    status:{
        type: String,
        required: true
    },
    average_price:{
        type: Number,
        required: true
    },
    Quantity:{
        type: Number,
        required: true
    },
    brokerage:{
        type: Number,
        required: true
    },
    Product:{
        type: String,
    },
    buyOrSell:{
        type: String,
        required: true
    },
    variety:{
        type: String,
    },
    validity:{
        type: String,
    },
    exchange:{
        type: String,
        required: true
    },
    order_type:{
        type: String,
    },
    symbol:{
        type: String,
        required: true
    },
    brokerage:{
        type: Number,  
    },
    instrumentToken:{
        type: Number, 
        // required: true 
    },
    exchangeInstrumentToken:{
        type: Number,
        // required : true
    },
    amount:{
        type: Number,
        required: true        
    },
    trade_time:{
        type: Date,
        required: true        
    },
    // expiry: {
    //     type: Date,
    //     required: true
    // },
    modify_date: Date,
    account_number: String,
    cp_id: String,
    ctcl_id: String,
    user_id: String,

    createdOn:{
        type: Date,
        default: ()=>new Date(),
        required: true
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    deviceDetails:{
        deviceType: { type: String },
        platformType: { type: String }
    },
})

const ThirdPartyTrades = mongoose.model("third-party-trade", ThirdPartyTrade);
module.exports = ThirdPartyTrades;


