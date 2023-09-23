const mongoose = require("mongoose");
const { Schema } = mongoose;

const TenXVideoTutorialView = new mongoose.Schema({
    
    tutorialViewedBy:{
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

const TenXVideoTutorialViewSchema = mongoose.model('tenx-video-tutorial-view', TenXVideoTutorialView);
module.exports = TenXVideoTutorialViewSchema;