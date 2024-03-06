const mongoose = require("mongoose");
const { Schema } = mongoose;

const signedUpUserSchema = new mongoose.Schema({

    first_name:{
        type: String,
        // required : true
    },
    createdOn:{
        type: Date,
        required: true,
        default: ()=>new Date(),
    },
    dob:{
        type: Date,
        // required: true,
    },
    last_modifiedOn:{
        type: Date,
        required: true,
        default: ()=>new Date(),
    },
    last_name:{
        type: String,
        // required : true
    },
    student_name:{
        type: String,
        // required : true
    },
    city:{
        type: Schema.Types.ObjectId,
        ref:'city'
        // required : true
    },
    email:{
        type: String,
        // required: true
    },
    code:{
        type: String,
        // required: true
    },
    collegeName:{
        type: String,
        // required: true
    },
    mobile:{
        type: String,
        required: true
    },
    mobile_otp:{
        type: String,
        // required: true
    },
    lastOtpTime:Date,
    email_otp:{
        type: String,
        // required: true
    },
    collegeDetails:{
        rollno: String,
        college: {
            type: Schema.Types.ObjectId,
            ref: 'college-detail'    
        }
        // required: true
    },
    schoolDetails:{
        parents_name: String,
        section: String,
        grade: {
            type: Schema.Types.ObjectId,
            ref: 'grade'    
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: 'school'    
        },
        state: String,
        dob: Date,
        profilePhoto: String,
        city:{
            type:Schema.Types.ObjectId,
            ref:'city'
        },
    },
    status:{
        type: String,
        enum: ['OTP Verification Pending','OTP Verified','Approved','Rejected'],
        default:'OTP Verification Pending'
    },
    referrerCode:{
        type: String,
    }
  
})



const signedUpUser = mongoose.model("signedup_user", signedUpUserSchema);
module.exports = signedUpUser;

