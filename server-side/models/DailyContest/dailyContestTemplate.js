const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestTemplateSchema = new Schema({
    contestName:{
        type: String,
        required: true
    },
    contestLiveTime:{
        type: Date,
        required: true
    },
    contestStartTime:{
        type: Date,
        required: true
    },
    contestEndTime:{
        type:Date,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    collegeCode:{
        type: String,
        // required: true,
    },
    entryFee:{
        type:Number,
        default: 0
    },
    payoutPercentage:{
        type: Number,
        required: true,
    },
    portfolio:{
        type: Schema.Types.ObjectId,
        ref: 'user-portfolio',
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college',
    },
    maxParticipants:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        required: true,
        enum: ['Draft','Submitted','Approved']
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
    contestExpiry:{
        type:String,
        required: true,
        enum: ["Day", "Monthly", "Weekly"]
    },
    isNifty:{
        type:Boolean,
        required: true
    },
    isBankNifty:{
        type:Boolean,
        required: true
    },
    isFinNifty:{
        type:Boolean,
        required: true
    }
})

const contestTemplateData = mongoose.model("daily-contest-template", contestTemplateSchema);
module.exports = contestTemplateData;