const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    notificationTime:{
        type: Date,
        required: true,
        default: () => new Date()
    },
    notificationStatus:{
        type:String,
        enum: ['Read', 'Unread'],
        default:'Unread',
    },
    notificationExpiryDate:{
        type:Date,
    },
    notificationType:{
        type:'String',
        enum:['Individual', 'Broadcast']
    },
    broadcastUsers:[{
            type: Schema.Types.ObjectId,
            ref: 'user-personal-detail',
    }],
    notificationCategory:{
        type:'String',
        enum:['Promotional', 'Informational', 'Warning' ]
    },
    productCategory:{
        type:'String',
        enum:['TenX', 'Internship', 'Virtual', 'MarginX', 'Battle', 'Contest', 'College Contest', 'Challenge','General']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
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
    targetUrl:{
        type: String,
    },
    media:{
        type: String,
    },
    language:{
        type:String,
        enum:['en','hi'],
        default:'en',
    },
    contextData:{
        type:String,
    },
    notificationGroupId:{
        type: Schema.Types.ObjectId,
        ref:'notification-group'
    },
    relatedEntity:{
        entityId:Schema.Types.ObjectId,
        entityType:String
    },
    channels:[{
        type:'String',
        enum:['App', 'Email', 'SMS', 'Push']
    }],
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

const notificationData = mongoose.model("notification", notificationSchema);
module.exports = notificationData;