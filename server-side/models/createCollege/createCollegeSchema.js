const mongoose = require("mongoose");
const { Schema } = mongoose;

const createCollegeSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    slogan: {
        type: String,
        // required:true
    },
    route:{
        type: String,
        required: true,
    },
    event:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    logo:{
        name: {type: String},
        url: {type: String}
    },
    status:{
        type: String,
        enum: ['Active','Inactive','Draft'],
        default: 'Active',
        required: true,
    },
    admin: [{ 
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    students: [{ 
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
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
    }
})

const blogData = mongoose.model("college-detail", createCollegeSchema);
module.exports = blogData;