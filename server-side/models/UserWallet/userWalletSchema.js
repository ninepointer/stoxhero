const mongoose = require("mongoose");
const { Schema } = mongoose; 

const wallet = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    transactions:
        [{
            title:{type:String}, //Battle - Battle Credit : Referral - Referral Credit
            description:{type:String}, //Battle - Amount credited for 'Monday Mania' Battle : Referral - Amount credited for Referral of 'Prateek Pawan'
            transactionDate:{type:Date,default:new Date()},
            amount:{type:Number},
            transactionId:{type:String},
            transactionType:{enum:['Cash','Bonus','Deposit','Withdrawal']}
        }]
    ,
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const userWallet = mongoose.model("user-wallet", wallet);
module.exports = userWallet;