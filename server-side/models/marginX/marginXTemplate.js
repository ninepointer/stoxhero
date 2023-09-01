const mongoose = require("mongoose");
const { Schema } = mongoose;

const marginXTemplateSchema = new Schema({
    templateName:{
        type: String,
        required: true
    },
    portfolioValue:{
        type: Number,
        required: true,
    },
    entryFee:{
        type:Number,
        default: 0
    },
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
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },

})

const marginXTemplateData = mongoose.model("marginX-template", marginXTemplateSchema);
module.exports = marginXTemplateData;