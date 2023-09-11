const mongoose = require("mongoose");
const { Schema } = mongoose;

const challengeTemplateSchema = new Schema({
    challengeName:{
        type: String,
        required: true
    },
    stockIndex:{
        type: Schema.Types.ObjectId,
        ref: 'stock-index',
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type:Date,
        required: true
    },
    challengeType:{
        type: String,
        enum: ['Intraday','PTWT'],
        required: true,
    },
    status:{
        type: String,
        enum: ['Active','Inactive'],
        required: true,
    },
    challengeParameters:[{
        category:{type:String, enum:['Low Entry', 'Medium Entry', 'High Entry']},
        interval:{type:Number},
        entryFee:{type:Number},
    }],
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

const challengeTemplateData = mongoose.model("challenge-template", challengeTemplateSchema);
module.exports = challengeTemplateData;