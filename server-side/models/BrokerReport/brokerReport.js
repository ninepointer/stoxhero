const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const brokerReportSchema = new mongoose.Schema({
    printDate:{
        type: Date,
        required: true
    },
    brokerName:{
        type: String,
        required: true
    },
    clientCode:{
        type: String,
        required: true
    },
    fromDate:{
        type: Date,
        required: true
    },
    toDate:{
        type: Date,
        required: true
    },
    cummulativeNSETurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeBSETurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeNSEFuturesTurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeOptionsTurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeTotalPurchaseTurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeTotalSaleTurnover:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeTransactionCharge:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeGrossPNL:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeNetPNL:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeInterestCharge:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeLotCharge:{
        type:Number,
        required:true,
        default: 0,
    },
    cummulativeIDCharge:{
        type:Number,
        required:true,
        default: 0,
    },
    document:{
        type:String,
        required:true,
    },
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})


const brokerReport = mongoose.model("broker-report", brokerReportSchema);
module.exports = brokerReport;