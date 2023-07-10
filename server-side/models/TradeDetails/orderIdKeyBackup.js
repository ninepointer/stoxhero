const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const redisBackup = new Schema({
    order_id:{
        type: String,
        required: true
    },
    appOrderId:{
        type: String,
        required: true
    },
    trader:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    tradedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    algoBoxId:{
        type: Schema.Types.ObjectId,
        ref: 'algo-trading', 
        required: true
    },
    exchange:{
        type: String,
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    buyOrSell:{
        type: String,
        required: true
    },
    Quantity:{
        type: Number,
        required: true
    },
    variety:{
        type: String,
        required: true
    },
    instrumentToken:{
        type: Number,
        required: true
    },
    dontSendResp:{
        type: Boolean,
        default: false
        // required: true
    },
    autoTrade:{
        type: Boolean,
        default: false
        // required: true
    },
    singleUser:{
        type: Boolean,
        default: false
        // required: true
    },
    marginData: {
        isReleaseFund: {type: Boolean},
        isAddMoreFund: {type: Boolean},
        isSquareOff: {type: Boolean},
        runningLots: {type: Number},
        zerodhaMargin: {type: Number}
    }
})

const RedisDetail = mongoose.model("liveOrder-key-backup", redisBackup);
module.exports = RedisDetail;


