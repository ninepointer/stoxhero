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
        const clientId = res.data.data.client_id;
        return clientId;
        }catch(e){
            console.log(e.message);
            throw new Error(e);
    }
}

exports.verifyAadhaarOtp = async(clientId, otp) => {
    try{
        const res = await axios.post(
            `${aadhaarEndPoint}/submit-otp`, 
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
        console.log(e);
        throw new Error(e.message);
    }
}
exports.verifyBankAccount = async(bankAccountNumber, ifscCode) => {
    try{
        const res = await axios.post(
            `${bankEndPoint}`, 
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
        console.log(e);
        throw new Error(e.message);
    }
}
exports.verifyPan = async(panNumber) => {
    try{
        const res = await axios.post(
            `${panEndPoint}`, 
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
        console.log(e);
        throw new Error(e.message);
    }
}