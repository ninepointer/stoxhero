const mongoose = require("mongoose");
const { Schema } = mongoose;

const calculatorSchema = new mongoose.Schema({
    assetName:{
        type: String,
        // required: true
    },
    expectedRoi:{
        type: Number,
        required: true
    },
    riskLevel:{
        type:String,
        enum: ['Low', 'Medium', 'High'],
        required:true
    },
    type:{
        type:String,
        enum: ['Asset', 'Liability'],
        required:true
    },
    description:{
        type:String,
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
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    }
})


const Calculator = mongoose.model("asset-class", calculatorSchema);
module.exports = Calculator;