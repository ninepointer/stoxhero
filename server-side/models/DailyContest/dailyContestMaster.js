const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestMasterSchema = new Schema({
    contestMaster:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    contestMasterMobile:{
        type: String,
        required: true,
    },
    stoxheroPOC:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college',
    },
    status:{
        type:String,
        required: true,
        enum: ['Active','Inactive']
    },
    inviteCode:{
        type:String,
        required: true,
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
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
})

const contestMasterData = mongoose.model("daily-contest-master", contestMasterSchema);
module.exports = contestMasterData;