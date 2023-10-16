const mongoose = require("mongoose");
const { Schema } = mongoose;

const Payment = new mongoose.Schema({
    transactionId: {
        type: String,
        // required: true,
    },
    paymentTime: {
        type: Date,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['INR', 'Other']
    },
    amount: {
        type: Number,
        required: true,
    },
    gstAmount:Number,
    paymentBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    paymentFor: {
        type: String,
    },
    coupon:String,
    productId:{
        type: Schema.Types.ObjectId
    },
    paymentMode: {
        type: String,
        // required: true,
        enum: ['UPI', 'Account Transfer', 'Other', 'CARD', 'NETBANKING']
    },
    paymentStatus:{
        type: String,
        enum:['succeeded', 'failed', 'processing', 'initiated', 'started', 'expired']
    },
    actions:[{
        actionTitle: String,
        actionDate: Date,
        actionBy: {
            type:Schema.Types.ObjectId,
            ref:'user-personal-detail'
        }
    }],
    merchantTransactionId: String,
    createdOn: {
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    modifiedOn: {
        type: Date,
        default: function() {
            return Date.now();
        }
    },
    modifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    gatewayResponse: {},
    productId: Schema.Types.ObjectId,
    bonusRedemption:Number,
});
const payment = mongoose.model('payment', Payment);
module.exports = payment;