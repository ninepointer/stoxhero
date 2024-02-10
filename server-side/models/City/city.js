const mongoose = require("mongoose");
const { Schema } = mongoose;

const citySchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    tier:{
        type:Number,
        enum:[1,2,3]
    },
    state:{
        type:String,
    },
    code: {
        type: Number
    },
    status:{
        type: String,
        enum: ['Active','Inactive','Draft'],
        default: 'Active',
        required: true,
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
    }
})

const cityData = mongoose.model("city", citySchema);
module.exports = cityData;