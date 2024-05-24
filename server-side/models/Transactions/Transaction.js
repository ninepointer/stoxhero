const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    transactionCategory:{
        type: String,
        enum: ['Credit', 'Debit'],
        required: true,
    },
    currency:{
        type: String,
        enum: ['INR', 'Others'],
        required: true,
    },
    transactionType:{
        type: String,
        enum: ['Cash','Bonus'],
        required: true,
    },
    transactionAmount:{
        type: Number,
        required: true,
    },
    transactionBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'user-wallet',
    },
    transactionMode:{
        type: String,
        enum:['Wallet', 'PG']
    },
    walletTransactionId: String,
    paymentGatewayReference: String,
    transactionTime:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    transactionStatus:{
        type: String,
        enum: ['Initiated','Processing','Complete', 'Failed'],
        required: true,
    },
    transactionFor:{
        type: String,
        enum:['Contest', 'TenX', 'MarginX', 'Battle', 'Challenge', 'Wallet Topup', 'Refund'],
    },
    transactionActions:[{
        actionTime: Number,
        actionStatus:String,
        actionTitle:String
    }], 
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
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
})

const transactionData = mongoose.model("transaction", transactionSchema);
module.exports = transactionData;