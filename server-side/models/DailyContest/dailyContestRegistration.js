const mongoose = require("mongoose");
const { Schema } = mongoose;

const DailyContestRegistration = new mongoose.Schema({
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
    contest:{
        type: Schema.Types.ObjectId,
        ref: 'daily-contest'
    },
    appliedOn: {
        type: Date,
        default: ()=> new Date()
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

const DailyContestRegistrationSchema = mongoose.model('daily-contest-registration', DailyContestRegistration);
module.exports = DailyContestRegistrationSchema;