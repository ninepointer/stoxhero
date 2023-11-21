const mongoose = require("mongoose");
const Schema = mongoose;

const learningModuleSchema = new mongoose.Schema({
    moduleNumber:{
        type: Number,
        required:true
    },
    moduleName:{
        type: String,
        required:true
    }, 
    moduleDescription:{
        type: String,
        required:true
    },
    moduleColor:{
        type:String,
        required:true
    }, 
    moduleStatus:{
        type: String,
        enum: ['Published','Unpublished','Draft'],
        required:true
    },
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date()
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date()
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-details',
        required : true,
    },
    
})

const learningModuleDetail = mongoose.model("learning-module", learningModuleSchema);
module.exports = learningModuleDetail;