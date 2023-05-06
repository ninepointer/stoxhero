let XTSInteractive = require('xts-interactive-api').Interactive;

let xtsInteractive = new XTSInteractive('https://developers.symphonyfintech.in');

let loginRequest = {
    secretKey: 'Lbwl467$oF',
    appKey: 'bebaffdb51b1a9a1b1d140',
    source: 'WEBAPI',
  };
  
  (async ()=>{
    let logIn = await xtsInteractive.logIn(loginRequest);
    console.log(logIn);
    let balance = await xtsInteractive.getBalance();
  
    console.log(balance);
  })();
