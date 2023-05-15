const mongoose = require("mongoose");
const { Schema } = mongoose;

const Payment = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentTime: {
        type: Date,
        required: true,
    },
    referenceNo: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: 'tenx-subscription'
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ['GooglePay', 'PhonePay', 'Upi', 'PayTM', 'AmazonPay', 'Other']
    },
    paymentStatus:{
        type: String,
        enum:['succeeded', 'failed', 'processing']
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }
});

const payment = mongoose.model('payment', Payment);
module.exports = payment;