const mongoose = require("mongoose");
const { Schema } = mongoose;

const quizSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    startDateTime:{
        type: Date,
    },
    registrationOpenDateTime:{
        type: Date,
    },
    registrationCloseDateTime:{
        type: Date,
    },
    durationInSeconds:{
        type: Number
    },
    entryFee:{
        type:Number
    },
    rewardType:{
        type:String,
        required: true,
        enum: ['Cash','Certificate','Goodies']
    },
    rewards:[{
        rankStart: {type: Number},
        rankEnd:{type:Number},
        prize:{type:Schema.Types.Mixed},
        prizeValue: {type: Number}
    }],
    questions:[{
        questionId:{type:Schema.Types.ObjectId},
        title:{type:String},
        type:{type:String, enum:['Single Correct','Multiple Correct']},
        questionImage:{type:String},
        score:{type:Number},
        options:[{optionKey:String,optionText:String,optionImage:String,isCorrect:Boolean}],
    }],
    registrations:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        registeredOn:{type:Date},
        registrationId: {type:String},
        slotId: {type:Schema.Types.ObjectId}
    }],
    purchaseIntent:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        date:{type:Date}
    }],
    city:{
        type:Schema.Types.ObjectId,
        ref:'city'
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    maxParticipant: {
        type: Number,
        required: true
    },
    noOfSlots: {
        type: Number,
        required: true
    },
    slotBufferTime: {
        type: Number,
        required: true
    },
    slots: [{
       time: { type: Date},
       user: {type: Number, default: 0},
    }],
    grade: {
        type: String,
        required: true
    },
    openForAll: {
        type: Boolean,
        default: false,
        required: true
    },
    quizQuestionnaire: {
        type: Number,
        // required: true
    },
    userQuestionnaire: {
        type: Number,
        // required: true
    },
    permissibleSet: {
        easy: Number,
        medium: Number,
        difficult: Number
    },
    status:{
        type:String,
        enum:['Active', 'Inactive', 'Draft', 'Completed']
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
    },
    lastmodifiedBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
    }
});

const quiz = mongoose.model("quiz", quizSchema);
module.exports = quiz;