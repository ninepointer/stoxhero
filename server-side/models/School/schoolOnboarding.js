const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;
require("../../db/conn");


const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    principalName: {
        type: String,
        required: true
    },


    mobile: {
        type: String,
        // required: true
    },

    city: {
        type: Schema.Types.ObjectId,
        ref: 'city'
        // required: true
    },
    
})



const SchoolOnBoarding = mongoose.model("school-onboarding", schoolSchema);
module.exports = SchoolOnBoarding;