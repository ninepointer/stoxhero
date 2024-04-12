// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const paperTrade = new mongoose.Schema({
    margin:{
        type: Number,
        required: true
    },
    grossPnl:{
        type: Number,
        required: true
    },
    brokerage:{
        type: Number,
        required: true
    },
    lotUsed:{
        type: Number,
        required: true
    },
    trades:{
        type: Number,
        required: true
    },
    runningLots:{
        type: Number,
        required: true
    },
    netPnl:{
        type: Number,
        required: true
    },
    roi:{
        type: Number,
        required: true
    },
    createdOn:{
        type: Date,
        default: ()=>new Date(),
        required: true
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    }
})

const PaperTradeLeaderboard = mongoose.model("paper-trade-leaderboard", paperTrade);
module.exports = PaperTradeLeaderboard;


