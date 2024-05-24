const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new mongoose.Schema({

    roleName:{
        type: String,
        required : true,
        enum: ["Admin", "User", "Infinity Trader", "Super Admin", "Moderator", "Data Analyst"]
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
        enum: ["Active", "Inactive"]
    }

})

const everyoneRoleDetail = mongoose.model("role-detail", roleSchema);
module.exports = everyoneRoleDetail;