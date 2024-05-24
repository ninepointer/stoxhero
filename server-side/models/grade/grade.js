const mongoose = require("mongoose");
const { Schema } = mongoose;

const gradeSchema = new mongoose.Schema({
    grade:{
        type: String,
        required: true
    },
    status:{
        type:String,
        enum:['Active', 'Inactive']
    },
    createdOn:{
        type: Date,
        default: ()=> new Date()
    },
    lastmodifiedOn:{
        type: Date,
        default: ()=> new Date()
    },
    createdBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
    },
    lastmodifiedBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
    }
});

const Grade = mongoose.model("grade", gradeSchema);
module.exports = Grade;