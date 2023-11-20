const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    // blogTitle:{
    //     type: String,
    //     required: true,
    // },
    // content:{
    //     type: String,
    //     required: true,
    // },
    // thumbnailImage:{
    //     type: String,
    // },
    // blogContent:[{
    //     serialNumber:{type:Number},
    //     header:{type:String},
    //     content:{type:String},
    //     image:{type:String},
    //     youtubeVideoCode:{type:String},
    //     _id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: mongoose.Types.ObjectId
    //     }
    // }],
    // publishedDate:{
    //     type: Date,
    //     // required : true,
    // },
    // author:{
    //     type: String,
    //     required: true,
    // },
    // status:{
    //     type: String,
    //     enum: ['Published','Unpublished','Created'],
    //     default: 'Created',
    //     required: true,
    // },
    // tags:[{
    //     tagName:{type:String}
    // }],
    // comments:[{
    //     full_name:{type:String},
    //     email:{type:String},
    //     comment:{type:String}
    // }],
    value: {
        type: String,
        required:true
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