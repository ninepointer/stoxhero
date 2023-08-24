const mongoose = require("mongoose");
const {Schema} = mongoose;

const liveTrade = new mongoose.Schema({
    order_id:{
        type: String,
        required: true
    },
    appOrderId:{
        type: String,
        // required: true
    },
    status:{
        type: String,
        required: true
    },
    // createdBy:{
    //     type: String,
    //     required : true
    // },
    average_price:{
        type: Number,
        required: true
    },
    Quantity:{
        type: Number,
        required: true
    },
    Product:{
        type: String,
        required: true
    },
    buyOrSell:{
        type: String,
        required: true
    },
    // order_timestamp:{
    //     type: String,
    //     required: true
    // },
    variety:{
        type: String,
        required: true
    },
    validity:{
        type: String,
        required: true
    },
    exchange:{
        type: String,
        required: true
    },
    order_type:{
        type: String,
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    placed_by:{
        type: String,
        required: true
    },
    // userId:{
    //     type: String,
    //     required: true        
    // },
    brokerage:{
        type: Number,        
    },
    instrumentToken:{
        type: Number, 
        required: true 
    },
    exchangeInstrumentToken:{
        type: Number,
        required : true
    },
    // tradeBy:{
    //     type: String,
    //     required: true        
    // },
    isRealTrade:{ 
        type: Boolean,
        required: true,
        default: true 
    },
    amount:{
        type: Number,
        // required: true        
    },
    exchange_order_id:{
        type: String,
    },
    exchange_timestamp:{
        type: Date,
    },
    disclosed_quantity:{
        type: Number,
        // required: true
    },
    price:{
        type: Number,
        required: true
    },
    filled_quantity:{
        type: Number,
        // required: true
    },
    pending_quantity:{
        type: Number,
        // required: true
    },
    cancelled_quantity:{
        type: Number,
        // required: true
    },
    market_protection:{
        type: String,
        // required: true
    },
    guid:{
        type: String,
        // required: true
    },
    trade_time:{
        type: Date,
        required: true        
    },
    isMissed:{
        type: Boolean,
        default: false
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    createdOn:{
        type: Date,
        default: () => new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    algoBox:{
        type: Schema.Types.ObjectId,
        ref: 'algo-trading', 
    },
    liveAccount:{
        type: String
    },
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'daily-contest',
    }
})

const liveTradeDetails = mongoose.model("dailycontest-live-company", liveTrade);
module.exports = liveTradeDetails;