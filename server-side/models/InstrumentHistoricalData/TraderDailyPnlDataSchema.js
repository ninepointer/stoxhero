const mongoose = require("mongoose");

const traderDailyPnlDataSchema = new mongoose.Schema({
            symbol:{
                type: String,
                required: true
            },
            trader:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'user-personal-detail'
            },
            trade_time:{
                type: Date
            },
            traderName:{
                type: String,
                required: true
            },
            userId:{
                type: String,
                required: true
            },
            timestamp:{
                type: String,
                required: true
            },
            calculatedGpnl:{
                type: Number,
                required: true
            },
            noOfTrades:{
                type: Number,
                required: true
            },
    })

const TraderDailyPnlData = mongoose.model("trader-daily-pnl", traderDailyPnlDataSchema);
module.exports = TraderDailyPnlData;