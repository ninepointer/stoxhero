const mongoose = require("mongoose");
const { Schema } = mongoose;

const challengeParticipantSchema = new Schema({
    challenge:{
        type: Schema.Types.ObjectId,
        ref: 'challenge',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    participationTime:{
        type: Date,
        required: true,
    },
    stockIndexEntryPrice:{
        type:Number,
        required: true,
    },
    payout:{
        type:Number
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
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
})

const challengeParticipantData = mongoose.model("challenge-participant", challengeParticipantSchema);
module.exports = challengeParticipantData;