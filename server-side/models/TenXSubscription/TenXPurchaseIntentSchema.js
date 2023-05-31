const mongoose = require("mongoose");
const { Schema } = mongoose;

const TenXPurchaseIntent = new mongoose.Schema({
    
    purchase_intent_by:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    tenXSubscription:{
        type: Schema.Types.ObjectId,
        ref: 'tenx-subscription'
    },
    clicked_On: {
        type: Date,
        default: ()=>new Date()
    },
});

const TenXSubscriptionPurchaseIntentSchema = mongoose.model('tenx-purchase-intent', TenXPurchaseIntent);
module.exports = TenXSubscriptionPurchaseIntentSchema;