const mongoose = require("mongoose");
const { Schema } = mongoose;

const challengeSchema = new Schema({
    challengeTemplate:{
        type: Schema.Types.ObjectId,
        ref: 'challenge-template',
    },
    challengeLiveTime:{
        type: Date,
        required: true
    },
    challengeStartTime:{
        type:Date,
        required: true
    },
    challengeEndTime:{
        type:Date,
        required: true
    },
    stockIndexClosingPrice:{
        type: Number,
        // required: true,
    },
    participants:[{
        type: Schema.Types.ObjectId,
        ref:'challenge-participant'
    }],
    status:{
        type: String,
        enum: ['Active','Inactive'],
        required: true,
    },
    payoutStatus:{
        type: String,
        enum: ['Completed','Processing','Not Started'],
        default: 'Not Started',
        required: true,
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

const challengeData = mongoose.model("challenge", challengeSchema);
module.exports = challengeData;