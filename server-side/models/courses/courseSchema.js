const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String },
  courseSlug: { type: String },
  courseInstructors: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "user-personal-detail",
      },
      image: String,
      about: String,
    },
  ],
  // aboutInstructor: String,
  courseImage: { type: String },
  workshopCoverImage: { type: String },
  courseLanguages: { type: String },
  courseDurationInMinutes: Number,
  courseOverview: { type: String },
  courseDescription: { type: String },
  courseStartTime: { type: Date },
  courseEndTime: { type: Date },
  registrationStartTime: { type: Date },
  registrationEndTime: { type: Date },
  maxEnrolments: { type: Number },
  coursePrice: { type: Number },
  discountedPrice: { type: Number },
  ratings: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      rating: { type: Number, enum: [1, 2, 3, 4, 5] },
      review: String,
      ratingDate: Date,
    },
  ],
  status: {
    type: String,
    enum: [
      "Draft",
      "Published",
      "Sent To Creator",
      "Pending Admin Approval",
      "Unpublished",
      "",
    ],
    default: "Draft",
  },
  type: { type: String, enum: ["Course", "Workshop", ""], default: "Course" },
  courseType: { type: String, enum: ["Live", "Recorded", ""], default: "Live" },
  category: {
    type: String,
    enum: ["Trading", "Investing", "Mutual Fund", ""],
    default: "Trading",
  },
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
      subtopics: [
        {
          order: Number,
          topic: String,
          videoUrl: String,
          videoKey: String,
          notes: [String]
        },
      ],
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
      actualFee: Number,
      discountedFee: Number,
      discountUsed: Number,
      pricePaidByUser: Number,
      gstAmount: Number,
      enrolledOn: { type: Date },
      bonusRedemption: Number,
    },
  ],
  suggestChanges: [String],
  meetLink: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", ""],
    default: "Beginner",
  },
  faqs: [{ order: Number, question: String, answer: String }],
  salesVideo: String,
  averageRating: { type: Number, default: 0 },
  hookVideo: String,
  bestSeller: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  lastModifiedOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user-personal-detail",
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "user-personal-detail",
  },
});

courseSchema.methods.calculateAverageRating = function () {
  console.log("average rating calc");
  if (!this.ratings || this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    this.averageRating = totalRating / this.ratings.length;
  }
};
courseSchema.pre("save", function (next) {
  if (this.isModified("ratings")) {
    if (!this.ratings || this.ratings.length === 0) {
      this.averageRating = 0;
    } else {
      const totalRating = this.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      this.averageRating = totalRating / this.ratings.length;
    }
  }
  next();
});

// Define pre-find middleware to compute the average rating before find operations
courseSchema.pre(/^find/, function (next) {
  if (!this.ratings || this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    this.averageRating = totalRating / this.ratings.length;
  }
  next();
});

// Method to calculate average rating

const Course = mongoose.model("course", courseSchema);

module.exports = Course;