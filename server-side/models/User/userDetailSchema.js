const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const uniqid = require("uniqid");
const { Schema } = mongoose;
require("../../db/conn");


const userDetailSchema = new mongoose.Schema({
    status:{
        type: String,
        required: true
    },
    uId:{
        type: String,
        required : true,
        default: uniqid(),
    },
    createdOn:{
        type: Date,
        default: ()=>new Date(),
        // required : true
    },
    lastModified:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
        // required : true
    },
    name:{
        type: String,
        // required : true
    },
    first_name:{
        type: String,
        required : true
    },
    last_name:{
        type: String,
        required : true
    },
    student_name:String,
    city:String,
    slug: String,
    schoolDetails:{
        parents_name: String,
        section: String,
        pin: String,
        resetPinOtp: String,
        lastOtpTime: Date,
        grade: {
            type: Schema.Types.ObjectId,
            ref: 'grade'    
        },
        school:{
            type: Schema.Types.ObjectId,
            ref: 'school'    
        },
        state: String,
        dob: Date,
        profilePhoto: String,
        city:{
            type:Schema.Types.ObjectId,
            ref:'city'
        },
    },
    cohort:{
        type: String,
        // required : true
    },
    designation:{
        type: String,
        required: true
    },
    email:{
        type: String,
        // required: true
    },
    maritalStatus:{
        type: String,
        // required: true
    },
    currentlyWorking:{
        type: String,
        // required: true
    },
    previouslyEmployeed:{
        type: String,
        // required: true
    },
    latestSalaryPerMonth:{
        type: Number,
        // required: true
    },
    familyIncomePerMonth:{
        type: Number,
        // required: true
    },
    collegeName:{
        type: String,
        // required: true
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college',
    },
    stayingWith:{
        type: String,
        // required: true
    },
    nonWorkingDurationInMonths:{
        type: Number,
        // required: true
    },
    mobile:{
        type: String,
        required: true
    },
    mobile_otp:{
        type: String,
    },
    lastOtpTime: Date,
    whatsApp_number:{
        type: String,
        // required: true
    },
    degree:{
        type: String,
        // required: true
    },
    dob:{
        type: Date,
        // required: true
    },
    gender:{
        type: String,
        enum: ['Male','Female','Other', ""]
    },
    address:{
        type: String,
        // required: true
    },
    trading_exp:{
        type: String,
        // required: true
    },
    location:{
        type: String,
        // required: true
    },
    city:{
        type: String,
        // required: true
    },
    state:{
        type: String,
        // required: true
    },
    country:{
        type: String,
        // required: true
    },
    last_occupation:{
        type: String,
        // required: true
    },
    family_yearly_income:{
        type: String,
        // require: true,
    },
    joining_date:{
        type: Date,
    },
    passingoutyear:{
        type: String,
    },
    purpose_of_joining:{
        type: String,
    },
    employeed:{
        type: Boolean,
        // required: true,
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: 'role-detail',
        default: '644902f1236de3fd7cfd73a7'
    },
    creationProcess:{
        type: String,
        // required: true,
        enum: ['School SignUp', 'Affiliate SignUp', 'Auto SignUp','By Admin','Career SignUp', 'College Contest SignUp', 'Referral SignUp', 'Contest SignUp', 'Campaign SignUp']
    },
    employeeid:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        // required: true
    },
    upiId:{
        type: String,
        // required: true
    },
    googlePay_number:{
        type: String,
        // required: true
    },
    payTM_number:{
        type: String,
        // required: true
    },
    phonePe_number:{
        type: String,
        // required: true
    },
    bankName:{
        type: String,
        // required: true
    },
    nameAsPerBankAccount:{
        type: String,
        // required: true
    },
    bankState:{
        type: String,
        // required: true
    },
    accountNumber:{
        type: String,
        // required: true
    },
    ifscCode:{
        type: String,
        // required: true
    },
    password:{
        type: String,
        // required: true
    },
    resetPasswordOTP:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    },
    passwordChangedAt:{
        type: Date,
        // required: true
    },
    watchlistInstruments: [
        {
            type: Schema.Types.ObjectId,
            ref: "instrument-detail"
        }
        
    ],
    allInstruments: [
        {
            type: Schema.Types.ObjectId,
            ref: "instrument-detail"
        }
    ],
    referralProgramme: 
        {
            type: Schema.Types.ObjectId,
            ref: "referral-program"
        }
        
    ,
    userId: {
        type: String,
              
    },
    fund: {
        type: Number,      
    },
    aadhaarNumber:{
        type: String,
    },
    panNumber:{
        type: String,
    },
    drivingLicenseNumber:{
        type: String,
    },
    passportNumber:{
        type: String,
    },
    aadhaarCardFrontImage:{url:String,name:String},
    aadhaarCardBackImage:{url:String,name:String},
    panCardFrontImage:{url:String,name:String},
    passportPhoto:{url:String,name:String},
    addressProofDocument:{url:String,name:String},
    incomeProofDocument:{url:String,name:String},
    profilePhoto:{url:String,name:String},
    KYCStatus:{
        type: String,
        enum: ['Not Initiated','Submitted','Approved','Rejected','Under Verification', 'Pending Approval'],
        default: 'Not Initiated',
    },
    KYCActionDate:{
        type: Date,
    },
    activationDetails:{
        activationDate: {type: Date},
        activationProduct: {type: Schema.Types.ObjectId},
        activationType: {type: String},
        activationStatus: {type: String},
        activationProductPrice: {type: Number},
    },
    paidDetails:{
        paidDate: {type: Date},
        paidProduct: {type: Schema.Types.ObjectId},
        paidStatus: {type: String},
        paidProductPrice: {type: Number},
    },
    KYCRejectionReason: String,
    myReferralCode:{
        type: String,
    },
    referrerCode:{
        type: String,
    },
    referredBy:{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    },
    collegeDetails:{
        rollno: String,
        college: {
            type: Schema.Types.ObjectId,
            ref: 'college-detail'    
        }
        // required: true
    },
    campaignCode:{
        type: String,
    },
    campaign:{
        type: Schema.Types.ObjectId,
        ref: 'campaign'
    },
    contests:[{
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail'
    }],
    portfolio:[{
        activationDate: {type: Date},
        portfolioId: {
            type: Schema.Types.ObjectId,
            ref: 'user-portfolio'
        }
    }],
    isAlgoTrader:{
        type: Boolean,
        default: false
    },
    isAffiliate: {type: Boolean, default: false},
    affiliateStatus: {type: String, default: "Inactive"},
    affiliateProgramme: {type:Schema.Types.ObjectId,ref: 'affiliate-programme'},
    affiliateCode: String,
    affiliateReferrals:[{
        referredUserId: {
            type: Schema.Types.ObjectId,
            ref: 'user-personal-detail'
        },
        affiliateEarning: Number,
        affiliateProgram:  {
            type: Schema.Types.ObjectId,
            ref: "affiliate-programme"
        },
        joiningDate:{
            type: Date,
        },
        affiliateCurrency: String
    }],
    referrals:[{
        referredUserId: {
            type: Schema.Types.ObjectId,
            ref: 'user-personal-detail'
        },
        referralEarning: Number,
        referralProgram:  {
            type: Schema.Types.ObjectId,
            ref: "referral-program"
        },
        joiningDate:{
            type: Date,
        },
        referralCurrency: String
    }],
    subscription:[{
        subscriptionId:{type:Schema.Types.ObjectId, ref: 'tenx-subscription'},
        subscribedOn:{type:Date},
        status: {
            type: String, 
            enum:["Live", "Expired"],
            default: "Live"
        },
        expiredOn: {type: Date},
        expiredBy: {
            type: String,
            enum: ['System','User'],
        },
        isRenew: {type: Boolean},
        fee: {type: Number},
        actualPrice: {type: Number},
        bonusRedemption:Number,
        payout:{type:Number},
        tdsAmount:{type:Number},
        herocashPayout: Number,
        gpnl: {type: Number},
        npnl: {type: Number},
        brokerage: {type: Number},
        tradingDays: {type: Number},
        trades: {type: Number},
    }],
    internshipBatch:[{
        type: Schema.Types.ObjectId,
        ref: "intern-batch"
    }],
    gstAgreement:Boolean,
    lastLoggedInDevice:{
        deviceType: String,
        deviceDetails: String
    },
    fcmTokens:[{
        token: String,
        brand: String,
        model: String,
        platform: String,
        osVersion: String,
        createdAt: {
            type: Date,
            default: ()=>new Date()
        },
        lastUsedAt:{
            type: Date,
        },
        tags: [{type: String}],
    }]
})

//Adding the ninepointer id before saving
userDetailSchema.pre('save', async function(next){
    if (this.isModified('paidDetails') || this.isModified('activationDetails')) {
        // Skip the pre-save logic for activationDate updates
        return next();
    }
    // console.log("inside employee id generator code")
    if(!this.employeeid || this.isNew){
        const count = await this.constructor.countDocuments();

        console.log("this?.email", this?.email)
        if(this?.email){
            let userId = this?.email?.split('@')[0] || this?.email;
            console.log("Count of Documents: ",userId, this?.email)
            let userIds = await userPersonalDetail.find({employeeid:userId})
            if(userIds.length > 0)
            {
                 userId = userId?.toString()+(userIds?.length+1).toString()
            }
            this.employeeid = userId;
        } else{
            let userId = this?.student_name?.split(' ')[0] + `${this.schoolDetails.dob.getDate()}${this.schoolDetails.dob.getMonth() + 1}${this.schoolDetails.dob.getFullYear()}`;

            console.log('userId', userId)
            let userIds = await userPersonalDetail.find({employeeid:userId})
            if(userIds.length > 0)
            {
                 userId = userId?.toString()+(userIds?.length+1).toString()
            }
            this.employeeid = userId;
        }

        
        
        next();
    } else {
        next();
    }
});

// userDetailSchema.pre("save", async function(next){
//     if(!this.isModified('password')){
//         return next();
//     } 
//     this.password = await bcrypt.hash(this.password, 10)
//     next();
// });

userDetailSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

// generating jwt token
userDetailSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({token: token});
        return token;
    } catch (err){
        console.log(err, "err in userDetailSchema");
    }
}

userDetailSchema.pre('save', async function(next){
    // console.log("inside employee", this._id)
    if(!this.createdBy || this.isNew){
        this.createdBy = this._id;
        next();
    } else {
        next();
    }
});
userDetailSchema.methods.changedPasswordAfter = function(JWTiat) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, // Convert to UNIX timestamp
            10
        );
        // console.log('changed at', this.passwordChangedAt);
        return JWTiat < changedTimeStamp; // True if the password was changed after token issuance
    }
    // False means not changed
    return false;
};
const userPersonalDetail = mongoose.model("user-personal-detail", userDetailSchema);
module.exports = userPersonalDetail;