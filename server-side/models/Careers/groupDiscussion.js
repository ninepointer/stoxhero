const mongoose = require('mongoose');
const {Schema} = mongoose;

const gdSchema = new Schema({

    gdTitle: {
        type: String,
        required: true,
    },
    gdTopic: {
        type: String,
        required: true,
    },
    gdStartDate: {
        type: Date,
        required: true,
    },
    gdEndDate: {
        type: Date,
        required: true,
    },
    meetLink: {
        type: String,
        required: true,
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    status: {
        type: String,
        required: true,
        enum: ['Active','Inactive']
    },
    batchId:{
        type: Schema.Types.ObjectId,
        ref: 'intern-batch'
    },
    careerId:{
        type: Schema.Types.ObjectId,
        ref: 'career'
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    lastModifiedOn: {
        type: Date,
        default: new Date()
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }
})

const gdDetail = mongoose.model('group-discussion', gdSchema);
module.exports = gdDetail;