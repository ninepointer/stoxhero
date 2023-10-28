const mongoose = require("mongoose");
const {Schema} = mongoose

const pendingOrderSchema = new Schema({
    order_referance_id:{
        type: Schema.Types.ObjectId,
        // required: true
    },
    product_type:{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    type:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ['Open', 'Pending', 'Cancelled', 'Executed']
    },
    execution_price:{
        type: Number,
        required: true,
    },
    last_price:{
        type: Number,
        required: true,
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
    instrumentToken:{
        type: Number, 
        required: true 
    },
    exchangeInstrumentToken:{
        type: Number,
        required : true
    },
    margin:{
        type: Number,
        required : true
    },
    execution_time:{
        type: Date,
        required: true
    },
    createdOn:{
        type: Date,
        default: ()=>new Date(),
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    sub_product_id: {
        type: Schema.Types.ObjectId,
        required: true
    }

})

const PendingOrder = mongoose.model('pending-order', pendingOrderSchema)
module.exports = PendingOrder;