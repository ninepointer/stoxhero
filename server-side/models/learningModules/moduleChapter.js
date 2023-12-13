const mongoose = require("mongoose");
const Schema = mongoose;

const moduleChapterSchema = new mongoose.Schema({
    chapterNumber:{
        type: Number,
        required:true
    },
    chapterName:{
        type: String,
        required:true
    },
    chapterImage:{
        type: String,
        required:true
    },
    chapterCategory:{
        type: String,
        enum: ['Beginner','Intermediate','Advanced'],
        required:true
    },
    chapterDescription:{
        type: String,
        required:true
    },
    chapterContent:[{
        contentNumber:{type:Number,required:true},
        contentHeader:{type:String,required:true},
        contentImage:{type:String,required:true},
        contentText:{type:String,required:true}
    }],
    learningModule:{
        type: Schema.Types.ObjectId,
        ref: 'learning-module',
        required : true,
    },
    chapterStatus:{
        type: String,
        enum: ['Published','Unpublished','Draft'],
        required:true
    },
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date()
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    
})

const moduleChapterDetail = mongoose.model("module-chapter", moduleChapterSchema);
module.exports = moduleChapterDetail;