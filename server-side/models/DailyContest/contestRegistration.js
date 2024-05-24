const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContestRegistration = new mongoose.Schema({
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
    gender: {
        type: String,
        required: true,
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college'
    },
    contest:{
        type: Schema.Types.ObjectId,
        ref: 'daily-contest'
    },
    collegeName:{
        type:String,
        required: true,
    },
    passingoutyear:{
        type:String,
        required: true,
    },
    course:{
        type:String,
        required: true,
    },
    linkedinProfileLink:{
        type:String,
        // required: true,
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
    referrerCode:{
        type:String
    },
    mobile_otp:{
        type:String,
    },
    status:{
        type:String
    },
});

const ContestRegistrationSchema = mongoose.model('contest-registration', ContestRegistration);
module.exports = ContestRegistrationSchema;