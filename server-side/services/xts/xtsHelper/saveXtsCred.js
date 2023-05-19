const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const User = require("../../../models/User/userDetailSchema");
const {xtsAccountType} = require("../../../constant");
const { ObjectId } = require("mongodb");

exports.save = async (accountId, token, xtsType) => {
    const user = await User.findOne({first_name: "System"});
    const InActiveToken = await RequestToken.findOneAndUpdate({status: "Active", accountType: xtsAccountType, xtsType: xtsType}, {
        $set:{
            status: "Inactive"
        }
    })
    const requestTokens = new RequestToken({accountId, accessToken: token, status: "Active", lastModifiedBy: new ObjectId(user._id), createdBy: new ObjectId(user._id), accountType: xtsAccountType, xtsType: xtsType});

    requestTokens.save().then(async ()=>{
        console.log("xts cred saved")
        // res.status(201).json({massage : "xts-Token enter succesfully"});
    }).catch((err)=> {
        console.log("fail in save", err)
    });
}