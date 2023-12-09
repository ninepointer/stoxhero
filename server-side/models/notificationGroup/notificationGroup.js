const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationGroupSchema = new mongoose.Schema({
    notificationGroupName:String,
    users:[{
        type: Schema.Types.ObjectId,
        ref:'user-personal-detail'
    }],
    criteria:{
        type:'String',
        enum:['Lifetime Active Users', 'Monthly Active Users', 'Lifetime Paid Users', 'Inactive Users', 'Month Inactive Users', 'Inactive Users Today']
    },
    status:String,
    lastNotificationTime: Date,
    lastUpdatedOn:{
        type: Date,
        default: ()=> new Date()
    },
    createdOn:{
        type: Date,
        default: ()=> new Date()
    },
    createdBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        // required: true
    },
    lastmodifiedBy:{
        type:Schema.Types.ObjectId, 
        ref: 'user-personal-detail',
        // required: true
    }
});

const notificationGroup = mongoose.model("notification-group", notificationGroupSchema);
module.exports = notificationGroup;