const mongoose = require("mongoose");
const {Schema} = mongoose

const dailyContestUserSchema = new Schema({
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
    status_message:{
        type: String,
    },
    average_price:{
        type: Number,
    },
    Quantity:{
        type: Number,
    },
    Product:{
        type: String,
        required: true
    },
    buyOrSell:{
        type: String,
        required: true
    },
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
    brokerage:{
        type: Number,     
    },
    isRealTrade:{ 
        type: Boolean,
        // required: true  
    },
    instrumentToken:{
        type: Number, 
        required: true 
    },
    exchangeInstrumentToken:{
        type: Number,
        required : true
    },
    amount:{
        type: Number,
        // required: true        
    },
    trade_time:{
        type: Date,
        // required: true        
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
        default: ()=>new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    liveAccount:{
        type: String
    },
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'daily-contest',
    },
    deviceDetails:{
        deviceType: { type: String },
        platformType: { type: String }
    },
    margin: {
        type: Number,
        required: true,
        default: 0
    }

})

const dailyContest = mongoose.model('dailycontest-mock-user', dailyContestUserSchema)
module.exports = dailyContest;