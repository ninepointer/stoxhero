const mongoose = require("mongoose");
const { Schema } = mongoose;

const tutorialCategorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    categoryVideos:[{
        title:{
            type: String,
        },
        videoId:{
            type: String,
        }, 
        isDeleted:{
            type:Boolean,
            default: false,
        }
    }],
    status:{
        type:String,
        required:true,
        enum: ['Active','Inactive']
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    categoryImage:{
        type:String,
        // required: true,
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
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const tutorialCategoryData = mongoose.model("tutorial-category", tutorialCategorySchema);
module.exports = tutorialCategoryData;