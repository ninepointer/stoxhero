const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactInfoSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required : true,
    },
    message:{
        type: String,
    },
    createdOn:{
        type: Date,
        default: ()=> new Date()
    }
});

const contact = mongoose.model("contact-info", contactInfoSchema);
module.exports = contact;