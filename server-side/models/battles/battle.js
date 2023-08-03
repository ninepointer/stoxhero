const mongoose = require("mongoose");
const { Schema } = mongoose;

const battleSchema = new Schema({
    battleName:{
        type: String,
        required: true
    },
    battleLiveTime:{
        type: Date,
        required: true
    },
    battleStartTime:{
        type: Date,
        required: true
    },
    battleEndTime:{
        type:Date,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    battleType:{
        type: String,
        enum: ['Mock','Live'],
        required: true,
    },
    battleFor:{
        type: String,
        enum: ['StoxHero','College'],
        required: true,
    },
    collegeCode:{
        type: String,
        // required: true,
    },
    rewardType:{
        type: String,
        required: true,
    },
    entryFee:{
        type:Number,
        default: 0
    },
    portfolio:{
        type: Schema.Types.ObjectId,
        ref: 'user-portfolio',
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college',
    },
    rewards:[{
        rank:{type:Number},
        giftName:{type:String},
    }],
    interestedUsers:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        registeredOn:{type:Date},
        status:{type:String, enum:['Joined','Exited']},
        exitDate:{type:Date},
    }],
    battleSharedBy:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        sharedAt:{type:Date}
    }],
    purchaseIntent:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        date:{type:Date},
    }],
    participants:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        participatedOn:{type:Date},
        payout: {type: Number}
    }],
    minParticipants:{
        type:Number,
        required: true
    },
    battleStatus:{
        type:String,
        required: true,
        enum: ['Active','Draft','Cancelled','Completed']
    },
    payoutStatus:{
        type:String,
        // required: true,
        enum: ['Completed','Not started','Processing']
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
    battleExpiry:{
        type:String,
        required: true,
        enum: ["Day", "Monthly", "Weekly"]
    },
    isNifty:{
        type:Boolean,
        required: true
    },
    isBankNifty:{
        type:Boolean,
        required: true
    },
    isFinNifty:{
        type:Boolean,
        required: true
    }
})

const battleData = mongoose.model("battle", battleSchema);
module.exports = battleData;