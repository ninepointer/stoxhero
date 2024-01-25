const mongoose = require("mongoose");
const { Schema } = mongoose;

const affiliateProgramSchema = new mongoose.Schema({
    affiliateProgramId:{
        type: String,
        // required: true
    },
    affiliateProgramName:{
        type: String,
        required: true
    },
    referralSignupBonus: {
        currency: String,
        amount: Number
    },
    rewardPerSignup: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    affiliateType: {
        type: String,
        required: true,
        enum: ['Youtube Influencer','Instagram Influencer','LinkedIn Influencer','StoxHero User','Offline Institute', 'Partnership']
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type:Date,
        required: true
    },
    commissionPercentage:{
        type:Number,
        required: true
    },
    discountPercentage:{
        type:Number,
        required: true
    },
    maxDiscount:{
        type:Number,
        required: true
    },
    minOrderValue:{
        type:Number,
        required: true
    },
    affiliates: [
        {
            userId:{type:Schema.Types.ObjectId,ref: 'user-personal-detail'},
            joinedOn:{type:Date, default: ()=>new Date()},
            affiliateCode: {type:String, required:true},
            affiliateStatus: {type:String, required:true, default: "Active"}
        }
    ],
    referrals: [
        {
            userId:{type:Schema.Types.ObjectId,ref: 'user-personal-detail'},
            affiliateUserId :{type:Schema.Types.ObjectId,ref: 'user-personal-detail'},
            joinedOn:{type:Date, default: ()=>new Date()}
        }
    ],
    eligiblePlatforms:[{
        type: 'String',
        enum:['Android', 'iOS', 'Web'],
    }],
    eligibleProducts:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required: true,
        enum: ['Active','Paused','Completed']
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
})

affiliateProgramSchema.pre('save', async function(next){
    if(!this.affiliateProgramId|| this.isNew){
        const count = await affiliateProgramData.countDocuments();
        const tId = "SHAP" + (count + 1).toString().padStart(8, "0");
        this.affiliateProgramId = tId;
        next();
    }
    next();
})

const affiliateProgramData = mongoose.model("affiliate-program", affiliateProgramSchema);
module.exports = affiliateProgramData;