const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestSchema = new Schema({
  contestName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    // required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  metaKeyword: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  contestStartTime: {
    type: Date,
    required: true,
  },
  contestEndTime: {
    type: Date,
    required: true,
  },
  contestLiveTime: {
    type: Date,
  },
  contestOn: {
    type: String,
    // required:true
  },
  description: {
    type: String,
    required: true,
  },
  contestType: {
    type: String,
    enum: ["Mock", "Live"],
    required: true,
  },
  currentLiveStatus: {
    type: String,
    enum: ["Mock", "Live"],
    // required: true,
  },
  contestFor: {
    type: String,
    enum: ["StoxHero", "College"],
    required: true,
  },
  collegeCode: {
    type: String,
    // required: true,
  },
  entryFee: {
    type: Number,
    default: 0,
  },
  initialFee: {
    type: Number,
    default: 500,
  },
  maxPayout: {
    type: Number,
    default: 0,
  },
  liveThreshold: {
    type: Number,
    // default: 0
  },
  payoutPercentage: {
    type: Number,
    // required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  payoutType: {
    type: String,
    enum: ["Reward", "Percentage"],
    // required: true,
  },
  rewardType: {
    type: String,
    required: true,
    enum: ["Cash", "HeroCash", "Goodies"],
  },
  tdsRelief: {
    type: Boolean,
    required: true,
    default: false,
  },
  visibility: {
    type: Boolean,
    required: true,
    default: false,
  },
  rewards: [
    {
      rankStart: { type: Number },
      rankEnd: Number,
      prize: { type: Schema.Types.Mixed },
      prizeValue: Number,
    },
  ],
  portfolio: {
    type: Schema.Types.ObjectId,
    ref: "user-portfolio",
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "college",
  },
  interestedUsers: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      registeredOn: { type: Date },
      status: { type: String, enum: ["Joined", "Exited"] },
      exitDate: { type: Date },
    },
  ],
  potentialParticipants: [
    { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
  ],
  contestSharedBy: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      sharedAt: { type: Date },
    },
  ],
  allowedUsers: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      addedOn: { type: Date },
    },
  ],
  purchaseIntent: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      date: { type: Date },
    },
  ],
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "user-personal-detail" },
      fee: Number,
      actualPrice: Number,
      participatedOn: { type: Date },
      payout: { type: Number },
      tdsAmount: { type: Number },
      isLive: { type: Boolean },
      npnl: { type: Number },
      gpnl: { type: Number },
      trades: { type: Number },
      brokerage: { type: Number },
      rank: { type: Number },
      bonusRedemption: Number,
      herocashPayout: Number,
    },
  ],
  maxParticipants: {
    type: Number,
    required: true,
  },
  contestStatus: {
    type: String,
    required: true,
    enum: ["Active", "Draft", "Cancelled", "Completed"],
  },
  payoutStatus: {
    type: String,
    // required: true,
    enum: ["Completed", "Not started", "Processing"],
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
  contestExpiry: {
    type: String,
    required: true,
    enum: ["Day", "Monthly", "Weekly"],
  },
  payoutPercentageType: {
    type: String,
    // required: true,
    enum: ["Daily", "Contest End"],
  },
  isNifty: {
    type: Boolean,
    required: true,
    default: false,
  },
  isBankNifty: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFinNifty: {
    type: Boolean,
    required: true,
    default: false,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
    default: "6517d48d3aeb2bb27d650de5",
  },
  payoutCapPercentage: {
    type: Number,
  },
  faqs: [{ order: Number, question: String, answer: String }],
  eventFormat: [{ order: Number, event: String, description: String }],
  courseInstructors: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "user-personal-detail",
      },
      image: String,
      about: String,
      fee: Number
    },
  ],
});

const contestData = mongoose.model("daily-contest", contestSchema);
module.exports = contestData;
