// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ThirdPartyTradePnl = new mongoose.Schema({
    symbol:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true        
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required : true
    },
    pnl: [{
        gpnl: Number,
        timestamp: Date,
        runningLots: Number,
        pnlNifty: Number,
        pnlBankNifty: Number,
        pnlFinNifty: Number,
        // averageEntryLots: Number,
        // marginUtilise: Number,
        entryLots: Number,
        usedLots: Number,
        entryLotsFrequency: Number,
        noOfTrades: Number,
        buyPnl: Number,
        sellPnl: Number,
        vix: Number,
        // averageLotsUsed: Number,
        pnlDiffrence: Number
    }]
})

const ThirdPartyTradesPnl = mongoose.model("third-party-trade-pnl", ThirdPartyTradePnl);
module.exports = ThirdPartyTradesPnl;


