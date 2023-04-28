const mongoose = require("mongoose");
const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
    batchName:{
        type: String,
        required: true
    },
    batchStartDate:{
        type: Date,
        required: true
    },
    batchEndDate:{
        type:Date,
        required: true
    },
    applicationStartDate:{
        type:Date,
        required: true
    },
    applicationEndDate:{
        type:Date,
        required: true
    },
    applicants:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        appliedOn:{type:Date},
        status:{type:String, enum:['Approve','Rejected', 'Applied']},
    }],
    participants:[{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    batchStatus:{
        type:String,
        required: true
    },
    participantRevenueSharing:{
        type:Number,
        required: true
    },
    batchLimit:{
        type:Number,
        required: true,
    },
    batchID:{
        type:String,
        required: true,
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    }
})

const batchData = mongoose.model("batch", batchSchema);
module.exports = batchData;







