const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const WithDrawalSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required:true
    },
    withdrawalRequestDate:{
        type: Date,
        default: ()=>new Date()
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user-personal-detail'
    },
    userWallet:{
        type:Schema.Types.ObjectId,
        ref:'user-wallet'
    },
    walletTransactionId:String,
    withdrawalStatus:{
        type: String,
        enum:['Pending','Initiated', 'Processed', 'Rejected']
    },
    withdrawalSettlementDate:{
        type: Date
    },
    settlementMethod:{
        type: String,
        enum: ['UPI', 'NEFT', 'Cheque', 'Cash']
    },
    settlementTransactionId:{
        type:'String'
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user-personal-detail'
    },
    createdOn:{
        type: Date,
        default: ()=>new Date()
    },
    lastModifiedBy:{
        type:Schema.Types.ObjectId,
        ref:'user-personal-detail'
    },
    lastModifiedOn:{
        type: Date,
        default: ()=>new Date()
    }

});

const withdrawal = mongoose.model("withdrawal", WithDrawalSchema);
module.exports = withdrawal;