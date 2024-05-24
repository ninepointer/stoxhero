const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionBankSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    type:{
        type:String, 
        enum:['Single Correct','Multiple Correct', 'Image Single Correct','Image Multiple Correct']
    },	
    image:{
        type: String,
    },
    score:{
        type: Number,
        required: true
    },
    grade:{
        type: Schema.Types.ObjectId,
        ref: 'grade',
        required: true
    },	
    difficultyLevel:{
        type:String,
        required: true,
        enum: ['Easy','Medium','Difficult']
    },
    topic:{
        type: String
    },
    options:[{
        title:String, 
        image:String, 
        isCorrect:Boolean
    }],
    quiz:[{
       type:Schema.Types.ObjectId, 
       ref: 'quiz'
    }],
    isMain:{
        type:Boolean,
        default: false,
        required: true
    },
    isPractice:{
        type:Boolean,
        default: false,
        required: true
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

const QuestionBank = mongoose.model("question-bank", QuestionBankSchema);
module.exports = QuestionBank;