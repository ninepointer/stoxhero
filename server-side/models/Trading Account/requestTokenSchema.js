const mongoose = require("mongoose");
const {xtsAccountType, zerodhaAccountType} = require("../../constant");

const requestTokenSchema = new mongoose.Schema({
    accountId:{
        type: String,
        required: true
    },
    accessToken:{
        type: String,
        required : true
    },
    requestToken:{
        type: String,
        // required : true
    },
    status:{
        type: String,
        required : true
    },
    generatedOn:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    lastModifiedOn:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    lastModifiedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-personal-details',
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-personal-details',
        // required : true
    },
    accountType:{
        type: String,
        required : true,
        enum : [zerodhaAccountType, xtsAccountType]
    },
    xtsType: {
        type: String,
        // required : true,
        enum : ["Market", "Interactive"]
    }
})

const requestTokenDetail = mongoose.model("trading-request-token", requestTokenSchema);
module.exports = requestTokenDetail;