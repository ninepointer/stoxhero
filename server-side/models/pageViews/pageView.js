const mongoose = require("mongoose");
const Schema = mongoose;

const pageViewSchema = new mongoose.Schema({
    page:{
        type: String,
        required:true
    },
    pageLink:{
        type: String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    viewTime:{
        type: Date,
        required : true,
        default: ()=>new Date()
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

const pageViewDetail = mongoose.model("page-view", pageViewSchema);
module.exports = pageViewDetail;