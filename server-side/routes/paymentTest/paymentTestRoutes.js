const express = require("express");
const router = express.Router({mergeParams: true});
const checksum = require('paytmchecksum');


const Authenticate = require('../../authentication/authentication');
let paytmMerchantId = process.env.PAYTM_MERCHANT_ID;
let paytmMerchantKey = process.env.PAYTM_MERCHANT_KEY;
let paytmParams = {};

router.route('/generate').get((req,res,next)=>{
    console.log('paytm', paytmMerchantKey, paytmMerchantId);
    paytmParams = {
        "MID": paytmMerchantId,
        "WEBSITE": "WEBSTAGING",
        "CHANNEL_ID": "WEB",
        "INDUSTRY_TYPE_ID": "Retail",
        "ORDER_ID": "TEST_" + new Date().getTime(),
        "CUST_ID": "CUSTOMER_ID",
        "TXN_AMOUNT": "1.00",
        "CALLBACK_URL": "http://localhost:3000/callback", // change this url to your callback url
        "EMAIL": "abc@mailinator.com",
        "MOBILE_NO": "7777777777"
    }
    console.log('params',paytmParams)
    var paytmChecksum = paytmChecksum.generateSignature(JSON.stringify(paytmParams), paytmMerchantKey);
    paytmChecksum.then(function(result){
        console.log("generateSignature Returns: " + result);
    }).catch(function(error){
        console.log(error);
    });
})

router.post('/callback', (req,res)=>{
    onsole.log('Callback Response: ', req.body);

    // received paytm checksum
    let paytmChecksum = req.body.CHECKSUMHASH;

    // remove this from body, will use all other received params for checksum validation
    delete req.body.CHECKSUMHASH;

    let isVerifySignature = checksum.verifychecksum(req.body, paytmMerchantKey, paytmChecksum);
    if (isVerifySignature) {
        console.log("Checksum Matched");
    } else {
        console.log("Checksum Mismatched");
    }

    res.redirect('/response');
})



module.exports = router;