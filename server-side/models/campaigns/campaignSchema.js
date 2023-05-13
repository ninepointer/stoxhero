const mongoose = require("mongoose");
const { Schema } = mongoose;

const campignSchema = new mongoose.Schema({
    campaignId:{
        type: String,
        // required: true
    },
    campaignName:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    campaignCode:{
        type:String,
        required:true
    },
    campaignFor:{
        type:String,
        enum:['Facebook','Instagram','LinkedIn','Career','Twitter','Telegram','WhatsApp','Google','Influencer','Website','Other']
    },
    status:{
        type:String,
        required: true,
        enum: ['Live','Draft','Cancelled']
    },
    createdOn:{
        type: Date,
        required : true,
        default: new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: new Date(),
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
            joinedOn:{type:Date, default: new Date()}
        }
    ],
})

campignSchema.pre('save', async function(next){
    if(!this.campaignId|| this.isNew){
        const count = await campaign.countDocuments();
        const tId = "SHC" + (count + 1).toString().padStart(8, "0");
        this.campaignId = tId;
        next();
    }
    next();
})

const campaign = mongoose.model("campaign", campignSchema);
module.exports = campaign;