const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;
require("../../db/conn");


const schoolSchema = new mongoose.Schema({

    school_name:String,
    address:String,
    city: {
        type: Schema.Types.ObjectId,
        ref: 'city'
        // required: true
    },
    state:String,
    head_name:String,
    mobile:String,
    website: String,
    email: {
        type: String,
        // required: true
    },
    highestGrade: {
        type: Schema.Types.ObjectId,
        ref: 'grade'
    },
    logo: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        // required: true
    },
    isOnboarding: {
        type: Boolean,
        required: true,
        default: false
    },
    aff_no: {
        type: String,
        // required: true
    }, 
    password: {
        type: String,
        // required: true
    }, 
    status: {
        type: String,
        enum: ["Active", "Inactive", 'Draft']
        // required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role-detail'
    },
    passwordChangedAt:{
        type: Date,
        // required: true
    },
    createdOn: {
        type: Date,
        default: () => new Date(),
    },
    lastModifiedOn: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user-personal-detail',
    },

    
})


schoolSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

schoolSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
// generating jwt token
schoolSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({token: token});
        return token;
    } catch (err) {
        console.log(err, "err in schoolSchema");
    }
}

schoolSchema.methods.changedPasswordAfter = function(JWTiat) {
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



const SchoolOnBoarding = mongoose.model("new-school", schoolSchema);
module.exports = SchoolOnBoarding;