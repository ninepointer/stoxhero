const mongoose = require("mongoose");
const { Schema } = mongoose;

const influencerTransactionSchema = new mongoose.Schema({
    transactionId:{
        type:String,
    },
    influencerWalletTId:{
        type:String,
        required: true,
    },
    buyerWalletTId:{
        type:String,
        // required: true,
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    specificProduct:{
        type: mongoose.Schema.Types.ObjectId,
    },
    productActualPrice:{
        type:Number,
        required: true,
    },
    productDiscountedPrice:{
        type:Number,
        required: true,
    },
    pricePaidByUser:{
        type:Number,
        // required: true,
    },
    influencerPayout:{
        type:Number,
        required: true,
    },
    buyer:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    influencer:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    transactionDate:{
        type: Date,
        required : true,
        default: ()=>new Date(),
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

influencerTransactionSchema.pre('save', async function(next){
    if(!this.transactionId|| this.isNew){
        const count = await influencerTransactionData.countDocuments();
        let myDate = new Date();
        const transactionCount = (count + 1).toString().padStart(8, "0");
        const tId = `SHAP${myDate.getFullYear() - 2000}${String(myDate.getMonth() + 1).padStart(2, '0')}${String(myDate.getDate()).padStart(2, '0')}${transactionCount}`
        this.transactionId = tId;
        next();
    }
    next();
})

const influencerTransactionData = mongoose.model("influencer-transaction", influencerTransactionSchema);
module.exports = influencerTransactionData;