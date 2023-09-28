const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        required: true
    },
    lastModifiedOn: {
        type: Date,
        default: () => new Date()
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const notificationGroupData = mongoose.model("notification-group", notificationGroupSchema);
module.exports = notificationGroupData;