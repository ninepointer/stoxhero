const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    blogTitle:{
        type: String,
        required: true,
    },
    metaTitle: {
        type: String,
        // required:true
    },
    metaDescription: {
        type: String,
        // required:true
    },
    metaKeywords: {
        type: String,
        // required:true
    },
    thumbnailImage:{
        name: {type: String},
        url: {type: String}
    },
    images:[{
        name: {type: String},
        url: {type: String}
    }],
    readingTime:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        enum: ['Published','Unpublished','Created'],
        default: 'Created',
        required: true,
    },
    blogData: {
        type: String,
        // required:true
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
})

const blogData = mongoose.model("blog", blogSchema);
module.exports = blogData;