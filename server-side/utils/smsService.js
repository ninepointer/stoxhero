const fastTwoSms = require("fast-two-sms");
const axios = require('axios');


function sendSMS(numbers, message){
    const options = {
        authorization : process.env.SMS_AUTH , 
        message : message,  
        numbers : numbers,
        sender_id: 'NPTR'
    } 
    let res = 'abc';
    
    const sendMessage = async (options)=>{
        const result = await fastTwoSms.sendMessage(options);
        return result;
    }

    sendMessage(options).then((result)=>console.log(result));

}

async function sendOTP(number, OTP){
    try{
        const res = await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMS_AUTH}&variables_values=${OTP}&route=otp&numbers=${number}`);
        if(process.env.PROD !== 'true'){
            console.log('OTP sent to', number, OTP);
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {sendSMS, sendOTP};

