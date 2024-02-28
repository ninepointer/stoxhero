const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String,  },
  courseSlug: { type: String },
  courseInstructors: [
   {
    id: { 
      type: Schema.Types.ObjectId, 
      ref: "user-personal-detail"
    },
    image: String,
    about: String
   }
  ],
  aboutInstructor: String,
  courseImage: { type: String },
  courseLanguages: { type: String,  },
  courseDurationInMinutes: Number,
  courseOverview: { type: String,  },
  courseDescription: { type: String },
  courseStartTime: { type: Date },
  courseEndTime: { type: Date },
  registrationStartTime: { type: Date },
  registrationEndTime: { type: Date },
  maxEnrolments: { type: Number,  },
  coursePrice: { type: Number },
  discountedPrice: { type: Number },
  status: { type: String, enum: ["Draft", "Published", 'Sent To Creator', 'Pending Admin Approval', 'Unpublished', ''], default: 'Draft' },
  type: { type: String, enum: ["Course", "Workshop", ''], default: 'Course' },
  courseType: { type: String, enum: ["Live", "Recorded", ''], default: 'Live' },
  category: { type: String, enum: ["Trading", "Investing", 'Mutual Fund', ''], default: 'Trading' },
  courseBenefits: [
    {
      order: { type: Number },
      benefits: { type: String },
    },
  ],
  courseContent: [
    {
      order: Number,
      topic: String,
      subtopics: [{
        order: Number,
        topic: String,
      }],
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
  suggestChanges: [
    String
  ],
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", ''], default: 'Beginner' },
  faqs: [{ order: Number, question: String, answer: String }],
  salesVideo: String,
});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;