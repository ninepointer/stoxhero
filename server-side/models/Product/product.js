const mongoose = require("mongoose");
const Schema = mongoose;

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required:true
    },
    productLiveDate:{
        type: Date,
        required : true,
        default: ()=>new Date()
    },
    status:{
        type:String,
        degault:'Active',
        enum:['Active', 'Inactive']
    },
    productEndDate:{
        type: Date,
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

const productDetail = mongoose.model("product", productSchema);
module.exports = productDetail;