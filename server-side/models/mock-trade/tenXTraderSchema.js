const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const tenXTraderSchema = new mongoose.Schema({
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
    subscriptionId:{
        type: Schema.Types.ObjectId,
        ref: 'tenx-subscription',
    }

})

const TenXTrader = mongoose.model('tenX-trade-user', tenXTraderSchema);
module.exports = TenXTrader;