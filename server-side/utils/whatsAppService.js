const ai_sensi = 'https://backend.aisensy.com/campaign/t1/api';
const axios = require('axios');


async function sendWhatsApp({destination, campaignName, userName, source, media, templateParams, tags, attributes}){
// console.log("AISENSI:",destination, campaignName, userName, source, media, templateParams)
    const option = 
    {
        apiKey: process.env.AISENSI_APIKEY,
        campaignName: campaignName,
        destination: destination,
        userName: userName,
        source: source,
        media: media,
        templateParams : templateParams,
        tags: tags,
        attributes: attributes
    }
    
    try{
        const res = await axios.post(`${ai_sensi}`,option);
        console.log('WhatsApp Msg sent to:', destination);
    } catch(err){
        // console.log(err)
        console.log(err);
    }
    
    // const sendMessage = async ()=>{
    //     const result = await axios.post(`${ai_sensi}?
    //                     apiKey=${process.env.SMS_AUTH}&
    //                     destination=${destination}&
    //                     campaignName=${campaignName}&
    //                     userName=${userName}&
    //                     templateParams=${templateParams}&
    //                     source=${source}&
    //                     media=${media}&
    //                     tags=${tags}&
    //                     attributes=${attributes}`
    //                     );
    //     console.log(result, sendMessage);
    //     return result;
    // }

    // sendMessage(options).then((result)=>console.log(result));

}


module.exports = {sendWhatsApp};

