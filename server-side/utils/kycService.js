const axios = require("axios");
const aadhaarEndPoint = "https://kyc-api.surepass.io/api/v1/aadhaar-v2";
const bankEndPoint = "https://kyc-api.surepass.io/api/v1/bank-verification/";
const panEndPoint = "https://kyc-api.surepass.io/api/v1/pan/pan";
const surePassApiKey = process.env.SUREPASS_API_KEY;


exports.generateAadhaarOtp = async(aadhaarNo) => {
    try{
        const res = await axios.post(
            `${aadhaarEndPoint}/generate-otp`, 
            { id_number: aadhaarNo }, 
            { 
                headers: {
                    Authorization: `Bearer ${surePassApiKey}`
                }
            }
        );
        if(!res.data.success){
            throw new Error(res.data.message);
        }
        const clientId = res.data.data;
        return clientId;
        }catch(e){
            console.log('error',e?.response?.data?.message);
            const message = e?.response?.data?.message || "Something went wrong";
            const statusCode = e?.response?.status || 500;
            const errorToThrow = new Error(message);
            errorToThrow.statusCode = statusCode;
            throw errorToThrow;
    }
}

exports.verifyAadhaarOtp = async(clientId, otp) => {
    console.log(clientId, otp);
    try{
        const res = await axios.post(
            `https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp`, 
            { client_id: clientId, otp:otp }, 
            { 
                headers: {
                    Authorization: `Bearer ${surePassApiKey}`
                }
            }
        );
        if(!res.data.success){
            throw new Error(res.data.message);
        }
        return res.data.data;
    }catch(e){
        console.log('error',e?.response?.data?.message);
        const message = e?.response?.data?.message || "Something went wrong";
        const statusCode = e?.response?.status || 500;
        const errorToThrow = new Error(message);
        errorToThrow.statusCode = statusCode;
        throw errorToThrow;
    }
}
exports.verifyBankAccount = async(bankAccountNumber, ifscCode) => {
    try{
        const res = await axios.post(
            `https://kyc-api.surepass.io/api/v1/bank-verification`, 
            { id_number: bankAccountNumber, ifsc:ifscCode, ifsc_details:true }, 
            { 
                headers: {
                    Authorization: `Bearer ${surePassApiKey}`
                }
            }
        );
        if(!res.data.success){
            throw new Error(res.data.message);
        }
        return res.data.data;
    }catch(e){
        console.log('error',e?.response?.data?.message);
        const message = e?.response?.data?.message || "Something went wrong";
        const statusCode = e?.response?.status || 500;
        const errorToThrow = new Error(message);
        errorToThrow.statusCode = statusCode;
        throw errorToThrow;
    }
}
exports.verifyPan = async(panNumber) => {
    try{
        const res = await axios.post(
            `https://kyc-api.surepass.io/api/v1/pan/pan`, 
            { id_number: panNumber}, 
            { 
                headers: {
                    Authorization: `Bearer ${surePassApiKey}`
                }
            }
        );
        if(!res.data.success){
            throw new Error(res.data.message);
        }
        return res.data.data;
    }catch(e){
        console.log('error',e?.response?.data?.message);
        const message = e?.response?.data?.message || "Something went wrong";
        const statusCode = e?.response?.status || 500;
        const errorToThrow = new Error(message);
        errorToThrow.statusCode = statusCode;
        throw errorToThrow;
    }
}