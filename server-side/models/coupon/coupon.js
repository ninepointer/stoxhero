const mongoose = require('mongoose');

const couponCodeSchema = new mongoose.Schema({
  code: {
    type: String,  //TextField
    required: true,
    unique: true,
    trim: true,
    uppercase: true 
  },
  description: {
    type: String,  //TextField
    default: ''
  },
  discountType: {
      type: String,
      enum:['Flat', 'Percentage'],
      required:true
  },
  rewardType:{
    type:String,
    enum:['Cashback', 'Discount'],
    default:'Discount'
  },
  discount: {
      type: Number,
      required:true,
      default: 0,
  },
  maxDiscount: Number,
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
    enum:['Active', 'Inactive' ,'Draft', 'Expired']
  },
  isOneTimeUse: {
    type: Boolean,
    default: false
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
  maxUse: {
    type: Number,
  },
  eligibleProducts:[{
    type:mongoose.Schema.Types.ObjectId,
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