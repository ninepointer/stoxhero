const mongoose = require("mongoose");
const Schema = mongoose;
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
    }
})

const settingDetail = mongoose.model("setting-detail", settingSchema);
module.exports = settingDetail;