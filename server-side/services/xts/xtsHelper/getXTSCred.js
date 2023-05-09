const RequestToken = require("../../../models/Trading Account/requestTokenSchema");
const {xtsAccountType} = require("../../../constant");

exports.getAccess = async () => {
    const accessToken = await RequestToken.find({status: "Active", accountType: xtsAccountType});
    return {getAccessToken: accessToken[0].accessToken};
}