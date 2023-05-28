const mongoose = require("mongoose");
const { Schema } = mongoose;

const stoxheroTradeCompanySchema = new mongoose.Schema({
    order_id:{
        type: String,
        required: true
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
    isRealTrade:{ 
        type: Boolean,
        required: true  
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
    createdOn:{
        type: Date,
        default: new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    algoBox:{
        type: Schema.Types.ObjectId,
        ref: 'algo-trading', 
    }
})

const stoxheroTradeCompanyDetails = mongoose.model("stoxhero-trade-company", stoxheroTradeCompanySchema);
module.exports = stoxheroTradeCompanyDetails;