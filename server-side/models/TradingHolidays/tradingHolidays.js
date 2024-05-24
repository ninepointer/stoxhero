const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradingHolidaySchema = new mongoose.Schema({
    holidayName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    holidayDate:{
        type: Date,
        required: true,
    },
    isDeleted:{
        type: Boolean,
        default: false,
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

const tradingHolidayData = mongoose.model("trading-holiday", tradingHolidaySchema);
module.exports = tradingHolidayData;