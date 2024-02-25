const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String, required: true },
  courseSlug: { type: String },
  courseInstructor: [
    { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
  ],
  instructorImages: [
    {
      instructor: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      image: String,
    },
  ],
  aboutInstructor: String,
  courseImage: { type: String },
  courseLanguages: { type: String, required: true },
  courseDurationInMinutes: Number,
  courseOverview: { type: String, required: true },
  courseDescription: { type: String },
  courseStartTime: { type: Date },
  courseEndTime: { type: Date },
  registrationStartTime: { type: Date },
  registrationEndTime: { type: Date },
  maxEnrolments: { type: Number, required: true },
  coursePrice: { type: Number },
  discountedPrice: { type: Number },
  status: { type: String, enum: ["Draft", "Published"] },
  type: { type: String, enum: ["Course", "Workshop"] },
  courseType: { type: String, enum: ["Live", "Recorded"] },
  courseBenefits: [
    {
      orderNo: { type: Number },
      benefits: { type: String },
    },
  ],
  courseContent: [
    {
      order: Number,
      topic: String,
      subtopics: [String],
    },
  ],
  courseLink: String,
  commissionPercentage: { type: Number },
  tags: [String],
  purchaseIntent: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      date: { type: Date },
    },
  ],
  enrollments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      fee: Number,
      actualPrice: Number,
      enrolledOn: { type: Date },
      bonusRedemption: Number,
    },
  ],
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  faqs: [{ question: String, answer: String }],
  salesVideo: String,
});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;
