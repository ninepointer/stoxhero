const mongoose = require("mongoose");
const { Schema } = mongoose;

const CareerApplication = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    career:{
        type: Schema.Types.ObjectId,
        ref: 'career'
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college'
    },
    course: {
        type: String,
        required: true,
    },
    passingoutyear: {
        type: String,
        required: true,
    },
    resume:{
        type:String,
        // required:true,
    },
    priorTradingExperience:{
        type: String,
        enum: ['Yes','No']
    },
    gender:{
        type: String,
        enum: ['Male','Female','Other']
    },
    collegeName:{
        type:String,
        required: true,
    },
    linkedInProfileLink:{
        type:String,
        required:true,
    },
    appliedOn: {
        type: Date,
        default: ()=> new Date()
    },
    source:{
        type:String,
    },
    campaignCode:{
        type:String,
    },
    mobile_otp:{
        type:String,
    },
    status:{
        type:String
    },
    applicationStatus:{
        type:String,
        enum:['Applied','Shortlisted','Selected','Rejected']
    }
});

const CareerApplicationSchema = mongoose.model('career-application', CareerApplication);
module.exports = CareerApplicationSchema;