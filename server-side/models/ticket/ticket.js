const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const Ticket = new mongoose.Schema({
    ticketTitle: {
        type: String
    },
    ticketDescription:{
        type: String
    },
    ticketCreationDate:{
        type: Date,
        default: ()=>new Date()
    },
    ticketType:{
        type:String
    },
    ticketPriority:{
        type: Number,
        default:3
    },
    ticketActions:[{
        actionDate: Date,
        actionTitle: String,
        actionStatus: String,
        actionBy:{type:Schema.Types.ObjectId, ref:'user-personal-detail'}
    }],
    ticketWithdrawalReference:{
        type:Schema.Types.ObjectId,
        ref:'withdrawal'
    },
    ticketStatus:{
        type: String,
        enum:['Open', 'Resolved', 'Dismissed'],
        default:'Open'
    },
    createdOn:{
        type:Date,
        default: ()=>new Date()
    },
    createdBy:{
        type:Schema.Types.ObjectId, 
        ref:'user-personal-detail'
    },
    lastModifiedOn:{
        type:Date,
        default: ()=>new Date()
    },
    lastModifiedBy:{
        type:Schema.Types.ObjectId, 
        ref:'user-personal-detail'
    }
});

const withdrawal = mongoose.model("withdrawal", WithDrawalSchema);
module.exports = withdrawal;