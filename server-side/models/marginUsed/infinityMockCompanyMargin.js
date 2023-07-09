const mongoose = require("mongoose");
const { Schema } = mongoose;

const liveMargin = new mongoose.Schema({
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required : true
    },
    instrument: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    ltp:{
        type: Number,
        required: true
    },
    transaction_type:{
        type: String,
        required: true
    },
    open_lots:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    margin_released:{
        type: Number,
        required: true
    },
    margin_utilize:{
        type: Number,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: ()=>new Date()
    },
    avg_price: {
        type: Number,
        // required: true
    },
    order_id: {
        type: String,
        required: true
    },
    parent_id: {
        type: String,
        // required: true
    }
});

const LiveMargin = mongoose.model('infinity-mock-company-margin', liveMargin);
module.exports = LiveMargin;