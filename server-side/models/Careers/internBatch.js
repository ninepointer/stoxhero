const mongoose = require("mongoose");
const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
    batchName:{
        type: String,
        required: true
    },
    batchStartDate:{
        type: Date,
        required: true
    },
    batchEndDate:{
        type:Date,
        required: true
    },
    orientationDate:{
        type:Date,
        required: true
    },
    orientationMeetingLink:{
        type:String,
        required: true
    },
    payoutPercentage:{
        type: Number,
        required: true
    },
    attendancePercentage:{
        type: Number,
        required: true
    },
    payoutCap:{
        type: Number,
        required: true
    },
    referralCount:{
        type: Number,
        required: true
    },
    // participants:[{
    //     type: Schema.Types.ObjectId,
    //     ref: 'user-personal-detail'
    // }],
    participants:[{
        user:{
            type: Schema.Types.ObjectId,
            ref: 'user-personal-detail'
        },
        college:{
            type: Schema.Types.ObjectId,
            ref: 'college'
        },
        joiningDate: {
            type: Date,
        },
        payout: Number,
        tradingdays: Number,
        attendance: Number,
        referral: Number,
        gpnl: Number,
        npnl: Number,
        noOfTrade: Number,
        tdsAmount: Number,
        herocashPayout: Number
    }],
    batchStatus:{
        type:String,
        required: true,
        enum: ['Active','Inactive', 'Completed']
    },
    rewardType:{
        type:String,
        required: true,
        enum: ['Cash','HeroCash']
    },
    tdsRelief:{
        type:Boolean,
        required: true,
        default: false
    },
    batchID:{
        type:String,
        // required: true,
    },
    career:{
        type: Schema.Types.ObjectId,
        ref: 'career'
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
    portfolio:{
        type: Schema.Types.ObjectId,
        ref:'user-portfolio'
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'product',
        default:'6517d46e3aeb2bb27d650de3'
    },
    workingDays: {
        type: Number
    }
})

const batchData = mongoose.model("intern-batch", batchSchema);
module.exports = batchData;