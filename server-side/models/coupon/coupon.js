const mongoose = require('mongoose');

const couponCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true 
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
      type: String,
      enum:['Flat', 'Percentage'],
  },
  rewardType:{
    type:String,
    enum:['Cashback', 'Discount'],
  },
  discount: {
      type: Number,
      default: 0
  },
  liveDate:{
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Active',
    enum:['Active', 'Inactive']
  },
  isOneTimeUse: {
    type: Boolean,
    default: true
  },
  usedBy: [{
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user-personal-detail'
    },
    appliedOn:Date,
    product:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    },
  }],
  usedBySuccessful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user-personal-detail'
  }],
  maxUse: {
    type: Number,
  },
  eligibleProducts:[{
    type:Schema.Types.ObjectId,
  }],
  campaign:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'campaign'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user-personal-detail',  // or 'User', depending on your user model
    required: true
  },
  createdOn: {
    type: Date,
    default: ()=>new Date()
  },
  lastModifiedOn: {
    type: Date,
    default: ()=>new Date()
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user-personal-detail',  // or 'User', depending on your user model
    required: true
  },
});

module.exports = mongoose.model('CouponCode', couponCodeSchema);