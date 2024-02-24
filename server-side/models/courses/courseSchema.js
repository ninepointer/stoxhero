const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: {type:String, required:true},
    courseSlug: {type:String},
    courseInstructor: [{ type: Schema.Types.ObjectId, ref: 'user-personal-detail', required:true }],
    instructorImages: [{
        instructor: {type: Schema.Types.ObjectId, ref:'user-personal-detail'},
        image:String,
    }],
    aboutInstructor: String,
    courseImage: { type: String, required:true },
    courseLanguages: { type: String, required:true },
    courseDurationInMinutes: Number,
    courseOverview: {type:String, required:true},
    courseDescription: { type: String},
    courseStartTime: {type:Date, required:true},
    courseEndTime: {type:Date, required:true},
    registrationStartTime: {type:Date, required:true},
    registrationEndTime: {type:Date, required:true},
    maxEnrolments: {type:Number, required:true},
    coursePrice: {type:Number, required:true},
    discountedPrice:{type:Number, required:true},
    status:{type:String,enum:['Draft','Published']},
    type:{type:String,enum:['Course','Workshop']},
    courseType:{type:String,enum:['Live','Recorded']},
    courseBenefits:[{
        orderNo: {type: Number},
        benefits:{type:String},
    }],
    courseContent: [{
        order: Number,
        topic: String,
        subtopics: [String]
    }],
    courseLink: String,
    commissionPercentage: {type:Number, required:true},
    tags: [String],
    purchaseIntent: [{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        date:{type:Date},
    }],
    enrollments: [{
        userId:{type:Schema.Types.ObjectId, ref: 'user-personal-detail'},
        fee:Number,
        actualPrice:Number,
        enrolledOn:{type:Date},
        bonusRedemption:Number,
    }],
    level:{type:String, enum:['Basic','Intermediate', 'Advanced']},
    faqs:[{question:String, answer:String}],
    salesVideo:String
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;