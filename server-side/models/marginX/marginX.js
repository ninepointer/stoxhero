const mongoose = require("mongoose");
const { Schema } = mongoose;

const marginXSchema = new Schema({
    marginXName:{
        type: String,
        required: true
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type:Date,
        required: true
    },
    liveTime:{
        type:Date,
        required: true
    },
    marginXTemplate:{
        type: Schema.Types.ObjectId,
        ref: 'marginX-template',
    },
    participants:[{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        boughtAt:{type:Date},
        payout: {type: Number},
        tdsAmount: {type: Number},
        accountBlown: {type: Boolean},
        accountBlownAt:{type:Date}
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
    maxParticipants:{
        type:Number,
        required: true
    },
    status:{
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
    marginXExpiry:{
        type:String,
        required: true,
        enum: ["Day", "Monthly", "Weekly"]
    },
    isNifty:{
        type:Boolean,
        default: false,
        // required: true
    },
    isBankNifty:{
        type:Boolean,
        default: false,
        // required: true
    },
    isFinNifty:{
        type:Boolean,
        default: false,
        // required: true
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'product',
    }
})

const marginXData = mongoose.model("marginX", marginXSchema);
module.exports = marginXData;