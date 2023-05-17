const mongoose = require("mongoose");
const {xtsAccountType, zerodhaAccountType} = require("../../constant");

const brokerageSchema = new mongoose.Schema({
    brokerName:{
        type: String,
        required: true
    },
    transaction:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required : true
    },
    exchange:{
        type: String,
        required : true
    },
    brokerageCharge:{
        type: Number,
        required : true
    },
    exchangeCharge:{
        type: Number,
        required : true
    },
    gst:{
        type: Number,
        required : true
    },
    sebiCharge:{
        type: Number,
        required : true
    },
    stampDuty:{
        type: Number,
        required : true
    },
    sst:{
        type: Number,
        required : true
    },
    createdOn:{
        type: Date,
        default: new Date(),
        required : true
    },
    modifiedOn:{
        type: Date,
        default: new Date(),
        required : true
    },
    lastModifiedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true
    },
    ctt:{
        type: Number,
        required : true
    },
    dpCharge:{
        type: Number,
        required : true
    },
    accountType:{
        type: String,
        required : true,
        enum : [zerodhaAccountType, xtsAccountType]
    }
    
})

const brokerageDetail = mongoose.model("trading-brokerage", brokerageSchema);
module.exports = brokerageDetail;