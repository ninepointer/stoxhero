const mongoose = require("mongoose");
const { Schema } = mongoose;

const permissionSchema = new mongoose.Schema({

    modifiedOn:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    modifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    isTradeEnable:{
        type: Boolean,
        required: true
    },
    algoId:{
        type: Schema.Types.ObjectId,
        ref: 'algo-trading',
    },
    isRealTradeEnable:{
        type: Boolean,
        required: true
    }
})

const permissionDetail = mongoose.model("user-permission", permissionSchema);
module.exports = permissionDetail;