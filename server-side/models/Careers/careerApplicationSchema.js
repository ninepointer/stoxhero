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
    rollNo: {
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
    resume:{
        type:String,
        // required:true,
    },
    priorTradingExperience:{
        type: String,
        enum: ['Yes','No']
    },
    collegeName:{
        type:String,
        required: true,
    },
    appliedOn: {
        type: Date,
        default: Date.now()
    },
    source:{
        type:String,
    }
});

const CareerApplicationSchema = mongoose.model('career-application', CareerApplication);
module.exports = CareerApplicationSchema;