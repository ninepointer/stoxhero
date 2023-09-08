const mongoose = require("mongoose");
const { Schema } = mongoose;

const battleSchema = new Schema({
    battleName:{
        type: String,
        required: true,
    },
    battleTemplate:{
        type: Schema.Types.ObjectId,
        ref: 'battle-template',
    },
    battleLiveTime:{
        type: Date,
        required: true
    },
    battleStartTime:{
        type:Date,
        required: true
    },
    battleEndTime:{
        type:Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Active','Inactive','Completed'],
        required: true,
    },
    payoutStatus:{
        type: String,
        enum: ['Completed','Processing','Not Started'],
        default: 'Not Started',
        required: true,
    },
    participants:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        boughtAt:{type:Date},
        reward: {type: Number},
    }],
    potentialParticipants:[
        {type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
    ],
    sharedBy:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        sharedAt:{type:Date}
    }],
    purchaseIntent:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        date:{type:Date},
    }],
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

const battleData = mongoose.model("battle", battleSchema);
module.exports = battleData;