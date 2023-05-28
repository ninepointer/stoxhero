const mongoose = require("mongoose");
const { Schema } = mongoose;

const collegeSchema = new mongoose.Schema({
    collegeName:{
        type: String,
        required: true
    },
    zone:{
        type: String,
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Central']
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
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
    }
})

const collegeData = mongoose.model("college", collegeSchema);
module.exports = collegeData;