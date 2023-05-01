const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema({
    brokerName:{
        type: String,
        required: true
    },
    accountId:{
        type: String,
        required : true
    },
    accountName:{
        type: String,
        required : true
    },
    apiKey:{
        type: String,
        required : true
    },
    apiSecret:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    uId:{
        type: String,
        required : true
    },
    createdOn:{
        type: Date,
        default: new Date(),
        required : true
    },
    lastModified:{
        type: Date,
        default: new Date(),
        required : true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true
    }
})

const accountDetail = mongoose.model("trading-account", accountSchema);
module.exports = accountDetail;