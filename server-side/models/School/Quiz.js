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
    durationInSeconds:{
        type: Number
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
        registeredOn:{type:Date}
    }],
    image: String,
    maxParticipant: Number,
    status:{
        type:String,
        enum:['Active', 'Inactive', 'Draft']
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