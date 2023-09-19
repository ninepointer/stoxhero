const mongoose = require("mongoose");
const { Schema } = mongoose;

const battleTemplateSchema = new Schema({
    battleTemplateName:{
        type: String,
        required: true
    },
    battleType:{
        type: String,
        enum: ['Intraday','Weeklong','Monthlong'],
        required: true,
    },
    battleTemplateType:{
        type: String,
        enum: ['HRHR','MRMR','LRLR'],
        required: true,
    },
    winnerPercentage:{
        type: Number,
        required: true,
    },
    minParticipants:{
        type: Number,
        required: true,
    },
    portfolioValue:{
        type: Number,
        required:true,
    },
    platformCommissionPercentage:{
        type: Number,
        required:true,
    },
    entryFee:{
        type: Number,
        required: true,
    },
    freePrizePool:{
        type: Number,
        // required: true,
    },
    freeWinnerCount:{
        type: Number,
        // required: true,
    },
    gstPercentage:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        enum: ['Active','Inactive','Draft'],
        required: true,
    },
    rankingPayout:[{
        rank:{type:Number},
        rewardPercentage:{type:Number},
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

const battleTemplateData = mongoose.model("battle-template", battleTemplateSchema);
module.exports = battleTemplateData;