const mongoose = require("mongoose");
const { Schema } = mongoose;

const carouselSchema = new mongoose.Schema({
    carouselName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    carouselStartDate:{
        type:Date,
        required: true
    },
    carouselEndDate:{
        type:Date,
        required: true
    },
    carouselPosition:{
        type: Number,
        required: true,
    },
    window:{
        type: String,
        required: false
    },
    visibility:{
        type: String,
        required: true,
    },
    status:{
        type:String,
        required:true,
        enum: ['Live','Draft','Rejected']
    },
    clickable:{
        type: Boolean,
        required: true,
    },
    linkToCarousel:{
        type: String,
        required: false,
    },
    carouselImage:{
        type:String,
        required: true,
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
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
})

const carouselData = mongoose.model("carousel", carouselSchema);
module.exports = carouselData;