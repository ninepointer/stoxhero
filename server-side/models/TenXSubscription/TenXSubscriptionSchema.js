const mongoose = require("mongoose");
const { Schema } = mongoose;

const TenXSubscription = new mongoose.Schema({
    plan_name: {
        type: String,
        required: true,
    },
    actual_price: {
        type: Number,
        required: true,
    },
    discounted_price: {
        type: Number,
        required: true,
    },
    validity: {
        type: Number,
        required: true,
    },
    expiryDays: {
        type: Number,
        // required: true,
    },
    payoutPercentage: {
        type: Number,
        // required: true,
    },
    profitCap:{
        type: Number,
        required: true,
    },
    rewardType:{
        type:String,
        required: true,
        enum: ['Cash','HeroCash']
    },
    tdsRelief:{
        type:Boolean,
        required: true,
        default: false
    },
    isRecommended:{
        type: Boolean,
        default: false,
    },
    portfolio:{
        type: Schema.Types.ObjectId,
        ref: 'user-portfolio' 
    },
    validityPeriod: {
        type: String,
        required: true,
        enum: ['days','month','year']
    },
    features:{
        type:[
            {orderNo:Number,
             description:String,
             _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId
              }
            }],
    },
    users:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        subscribedOn:{type:Date},
        status: {
            type: String, 
            enum:["Live", "Expired"],
            default: "Live"
        },
        expiredOn:{type:Date},
        expiredBy: {
            type: String,
            enum: ['System','User'],
        },
        isRenew: {type: Boolean},
        fee: {type: Number},
        bonusRedemption:Number,
        actualPrice:Number,
        payout:{type:Number},
        tdsAmount: {type: Number},

        gpnl: {type: Number},
        npnl: {type: Number},
        brokerage: {type: Number},
        tradingDays: {type: Number},
        trades: {type: Number},
    }],
    status: {
        type: String,
        required: true,
        enum: ['Active','Inactive','Draft']
    },
    createdOn: {
        type: Date,
        default: ()=>new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    lastModifiedOn: {
        type: Date,
        default: ()=>new Date()
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    allowPurchase:{
        type:Boolean,
        default: true
    },
    allowRenewal:{
        type:Boolean,
        default: true
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'product',
        default:'6517d3803aeb2bb27d650de0'
    }
});

const TenXSubscriptionSchema = mongoose.model('tenx-subscription', TenXSubscription);
module.exports = TenXSubscriptionSchema;