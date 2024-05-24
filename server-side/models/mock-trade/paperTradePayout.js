const mongoose = require("mongoose");
const { Schema } = mongoose;

const payout = new mongoose.Schema({
    gpnl:{
        type: Number,
        required: true
    },
    brokerage:{
        type: Number,
        required: true
    },
    npnl:{
        type: Number,
        required: true
    },
    trades:{
        type: Number,
        required: true
    },
    portfolioValue:{
        type: Number,
        required: true
    },
    moneyCost:{
        type: Number,
        required: true
    },
    rewardAmount:{
        type: Number,
        required: true
    },
    rewardCurrency:{
        type: String,
        required: true
    },
    tds:{
        type: Number,
        required: true
    },
    daysOfInterest:{
        type: Number,
        required: true
    },
    frequency:{
        type: String,
        required: true
    },
    pnlAfterCost: {
        type: Number,
        required: true
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required : true
    },
    date: {
        type: Date,
        required: true
    },
    frequencyStart: {
        type: Date,
        required: true
    },
    frequencyEnd: {
        type: Date,
        required: true
    },
    workingDays: {
        type: Number,
        required: true
    }
})

const PayoutVirtual = mongoose.model("virtual-payout", payout);
module.exports = PayoutVirtual;