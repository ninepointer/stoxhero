const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradingAlgoSchema = new mongoose.Schema({
    algoName:{
        type: String,
        required: true
    },
    transactionChange:{
        type: Boolean,
        required : true
    },
    instrumentChange:{
        type: Boolean,
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
    lastModifiedOn:{
        type: Date,
        default: new Date(),
        required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    exchangeChange:{
        type: Boolean,
        required : true
    },
    lotMultipler:{
        type: Number,
        required : true
    },
    productChange:{
        type: Boolean,
        required : true
    },
    tradingAccount:{
        type: String,
        required : true
    },
    isRealTrade:{
        type: Boolean,
        required : true
    },
    marginDeduction:{
        type: Boolean,
        required : true
    },
    isDefault:{
        type: Boolean,
        required : true
    }
})

const tradingAlgoDetail = mongoose.model("algo-trading", tradingAlgoSchema);
module.exports = tradingAlgoDetail;