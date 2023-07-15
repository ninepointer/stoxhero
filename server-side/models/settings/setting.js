const mongoose = require("mongoose");
const Schema = mongoose;
const {xtsAccountType, zerodhaAccountType} = require("../../constant");

const settingSchema = new mongoose.Schema({

    modifiedOn:{
        type: Date,
        required : true
    },
    modifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    isAppLive:{
        type: Boolean,
        required: true
    },
    AppStartTime:{
        type: Date,
        required: true,
    },
    AppEndTime:{
        type: Date,
        required: true,
    },
    leaderBoardTimming:{
        type: Number,
        required: true,
    },
    toggle: {
        complete: {type: String, enum : [zerodhaAccountType, xtsAccountType]},
        ltp: {type: String, enum : [zerodhaAccountType, xtsAccountType]},
        liveOrder: {type: String, enum : [zerodhaAccountType, xtsAccountType]},
    },
    infinityLive:{
        type: Boolean
    },
    infinityPrice: {
        type: Number,
        required: true,
    },
    minWithdrawal: Number,
    maxWithdrawal: Number,
    contest: {
        upiId: {type: String},
        email: {type: String},
    },

})

const settingDetail = mongoose.model("setting-detail", settingSchema);
module.exports = settingDetail;