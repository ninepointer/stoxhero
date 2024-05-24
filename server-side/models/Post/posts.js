const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    post:{
        type: String,
        required: true
    },
    postedBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        required: true
    },
    postImage:{
        type: String,
        // required: true
    },
    postLink:{
        type: String,
        // required: true
    },
    postComments:[{
        comment:{type:String},
        commentedOn:{type:Date},
        commentBy:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'}
    }],
    likedBy:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        likedOn:{type:Date},
    }],
    postedOn:{
        type: Date,
        default: ()=> new Date()
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

const post = mongoose.model("post", postSchema);
module.exports = post;