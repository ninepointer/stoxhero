const mongoose = require("mongoose");
const { Schema } = mongoose;

const marginxSchema = new mongoose.Schema({
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
        // required: true
    },
    average_price:{
        type: Number,
        // required: true
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
    instrumentToken:{
        type: Number, 
        required: true 
    },
    exchangeInstrumentToken:{
        type: Number,
        required : true
    },
    isRealTrade:{ 
        type: Boolean,
        required: true,
        default: false
    },
    amount:{
        type: Number,
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
    trade_time_utc:{
        type: Date,
        default: ()=>new Date()      
    },
    createdOn:{
        type: Date,
        default: ()=>new Date()
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
    marginxId: {
        type: Schema.Types.ObjectId,
        ref: 'marginX',
    }
})

const marginxCompanyDetail = mongoose.model("marginx-mock-company", marginxSchema);
module.exports = marginxCompanyDetail;

