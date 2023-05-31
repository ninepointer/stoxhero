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
        }   
    }],
    batchStatus:{
        type:String,
        required: true,
        enum: ['Active','Inactive']
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
    }
})

const batchData = mongoose.model("intern-batch", batchSchema);
module.exports = batchData;