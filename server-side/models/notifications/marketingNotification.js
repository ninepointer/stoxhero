const mongoose = require("mongoose");
const { Schema } = mongoose;

const marketingNotificationSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    mediaUrl:{
        type:String,
    },
    actions:{
        type:String
    },
    notificationType:{
        type:String,
        emum:['Instant', 'Scheduled', 'Repeating'],
        default:'Instant'
    },
    notificationTime:{
        type: Date,
    },
    notificationExpiryDate:{
        type:Date,
    },
    notificationType:{
        type:'String',
        enum:['Individual', 'Broadcast']
    },
    notificationGroup:[{
        type:Schema.Types.ObjectId,
        ref:'notification-group'
    }],
    notificationCategory:{
        type:'String',
        enum:['Promotional', 'Informational', 'Warning' ]
    },
    productCategory:{
        type:'String',
        enum:['TenX', 'Internship', 'Virtual', 'MarginX', 'Battle', 'TestZone', 'College TestZone', 'Challenge','General']
    },
    priority:{
        type:'String',
        enum:['Low', 'Medium', 'High', 'Urgent'],
        default:'Medium',
    },
    isActive:{
        type:Boolean,
        default: true
    },
    language:{
        type:String,
        enum:['en','hi'],
        default:'en',
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
    },
})

const marketingNotificationData = mongoose.model("marketing-notification", marketingNotificationSchema);
module.exports = marketingNotificationData;