const mongoose = require("mongoose");
const { Schema } = mongoose;

const schoolSchema = new mongoose.Schema({
    aff_no: Number,
    logo:String,
    school_name:String,
    address:String,
    city:String,
    state:String,
    head_name:String,
    contact1:String,
    email:String,
    country:String,
    website: String
});

const school = mongoose.model("unformatted-school", schoolSchema);
module.exports = school;