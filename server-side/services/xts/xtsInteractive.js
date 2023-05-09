let XTSInteractive = require('xts-interactive-api').Interactive;

let xtsInteractive = new XTSInteractive('http://14.142.188.188:23000');

exports.xtsInteractive = async ()=>{
  let loginRequest = {
    secretKey: 'Lbwl467$oF',
    appKey: 'bebaffdb51b1a9a1b1d140',
    source: 'WEBAPI',
  };

  let logIn = await xtsInteractive.logIn(loginRequest);
  console.log(logIn);

  return logIn;
}









  // {
  //   type: 'success',
  //   code: 's-user-0001',
  //   description: 'Valid User.',
  //   result: {
  //     enums: {
  //       socketEvent: [Array],
  //       orderSide: [Array],
  //       orderSource: [Array],
  //       positionSqureOffMode: [Array],
  //       positionSquareOffQuantityType: [Array],
  //       dayOrNet: [Array],
  //       instrumentType: [Array],
  //       exchangeSegment: [Array],
  //       exchangeInfo: [Object]
  //     },
  //     clientCodes: [ 'CK68' ],
  //     exchangeSegmentArray: [ [Object] ],
  //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJDSzY4X0JFQkFGRkRCNTFCMUE5QTFCMUQxNDAiLCJwdWJsaWNLZXkiOiJiZWJhZmZkYjUxYjFhOWExYjFkMTQwIiwiaWF0IjoxNjgzNjE3NTQ1LCJleHAiOjE2ODM3MDM5NDV9._esJGT8nZLGaI9TnpEr6V63zH4BgrVN8Bku6UFCz2I8',
  //     userID: 'CK68',
  //     isInvestorClient: true,
  //     isOneTouchUser: false
  //   }
  // }


