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
        payout:{type:Number}
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
    }
});

const TenXSubscriptionSchema = mongoose.model('tenx-subscription', TenXSubscription);
module.exports = TenXSubscriptionSchema;