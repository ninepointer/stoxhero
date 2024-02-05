const mongoose = require("mongoose");
const { Schema } = mongoose;

const responseSchema = new mongoose.Schema({
    student:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        // required: true
    },
    initiatedOn:{
        type: Date,
    },
    submittedOn:{
        type: Date,
    },
    submittedBy:{
        type:String,
        enum: ['Student','System']
    },
    quiz:{
        type:Schema.Types.ObjectId, 
        ref: 'quiz',
    },
    responses:[{
        questionId:{type:Schema.Types.ObjectId},
        responses:[{type:Schema.Types.ObjectId}],
        responseScore:{type:Number},
    }],
    studentScore:{
        type:Number
    },
    createdOn:{
        type: Date,
        default: ()=> new Date()
    },
    lastmodifiedOn:{
        type: Date,
        default: ()=> new Date()
    },
    createdBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        // required: true
    },
    lastmodifiedBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        // required: true
    }
});

const response = mongoose.model("response", responseSchema);
module.exports = response;