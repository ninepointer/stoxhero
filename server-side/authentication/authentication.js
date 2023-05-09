const jwt = require("jsonwebtoken");
const User = require("../models/User/userDetailSchema");
const client = require("../marketData/redisClient");
const { ObjectId } = require("bson");

const Authenticate = async (req, res, next)=>{
    let token;
    try{
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log((req ))
    if (req.cookies) {
        if(req.cookies.jwtoken) token = req.cookies.jwtoken;
    }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);


        try{
            if(await client.exists(`${verifyToken._id.toString()}authenticatedUser`)){
                let user = await client.get(`${verifyToken._id.toString()}authenticatedUser`)
                user = JSON.parse(user);
                // await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 10);
                user._id = new ObjectId(user._id)
                req.user = user;
            }
            else{
                const user = await User.findOne({_id: verifyToken._id}).populate('role', 'roleName')
                .select(' aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals')
                if(!user){ return res.status(404).json({status:'error', message: 'User not found'})}
                await client.set(`${verifyToken._id.toString()}authenticatedUser`, JSON.stringify(user));
                await client.expire(`${verifyToken._id.toString()}authenticatedUser`, 30);
                req.user = user;
            }
          }catch(e){
            console.log("redis error", e);
          }

    } catch(err){
        return res.status(401).send({status: "error", message: "Unauthenthicated"});
    }
    next();
}

module.exports = Authenticate;