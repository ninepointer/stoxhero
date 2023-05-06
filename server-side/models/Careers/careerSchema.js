const mongoose = require("mongoose");
const { Schema } = mongoose;

const Career = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    rolesAndResponsibilities:{
        type:[
            {orderNo:Number,
             description:String,
             _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId
              }
            }],
    },
    jobType:{
        type:String,
        required: true,
        enum: ['Internship','Full-Time']
    },
    jobLocation:{
        type: String,
        required: true,
        enum: ['WFH','Office']
    },
    status: {
        type: String,
        required: true,
        enum: ['Active','Inactive']
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    lastModifiedOn: {
        type: Date,
        default: new Date()
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
});

const CareerSchema = mongoose.model('career', Career);
module.exports = CareerSchema;