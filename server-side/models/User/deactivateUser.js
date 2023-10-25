const mongoose = require("mongoose");
const { Schema } = mongoose;

const deactivateUser = new mongoose.Schema({

    deactivatedUser:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required : true
    },

    mobile:{
        type: String,
        required : true
    },

    reason:{
        type: String,
        required : true
    },

    email:{
        type: String,
        required : true
    },

    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    status:{
        type: String,
        required : true,
        default: "Inactive",
        enum: ["Active", "Inactive"]
    }

})

const deactivatedUsers = mongoose.model("deactivated-user", deactivateUser);
module.exports = deactivatedUsers;