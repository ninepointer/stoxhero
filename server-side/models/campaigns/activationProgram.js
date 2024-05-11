const mongoose = require("mongoose");
const { Schema } = mongoose;

const activationProgramSchema = new mongoose.Schema({
    activationProgramId:{
        type: String,
        // required: true
    },
    activationProgramName:{
        type: String,
        required: true
    },
    activationProgramStartDate:{
        type: Date,
        required: true
    },
    activationProgramEndDate:{
        type:Date,
        required: true
    },
    rewardPeractivation:{
        type:Number,
        required: true
    },
    activationSignupBonus:{
        amount: Number,
        currency: {
            type: String,
            enum:['Cash', 'Bonus']
        }
    },
    currency:{
        type:String,
        required: true,
        enum: ['INR','CREDOS']
    },
    description:{
        type:String,
        required:true
    },
    maxactivationsPayoutCap:Number,
    status:{
        type:String,
        required: true,
        enum: ['Active','Inactive']
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
    users: [
        {
            userId:{type:Schema.Types.ObjectId,ref: 'user-personal-detail'},
            joinedOn:Date
        }
    ],
})

activationProgramSchema.pre('save', async function(next){
    if(!this.activationProgramId|| this.isNew){
        const count = await activationProgramData.countDocuments();
        const tId = "SHRP" + (count + 1).toString().padStart(8, "0");
        this.activationProgramId = tId;
        next();
    }
    next();
})

const activationProgramData = mongoose.model("activation-program", activationProgramSchema);
module.exports = activationProgramData;