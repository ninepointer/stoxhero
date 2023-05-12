let XTSInteractive = require('xts-interactive-api').Interactive;
var XTSInteractiveWS = require('xts-interactive-api').WS;

// let xtsInteractive = new XTSInteractive('http://14.142.188.188:23000');

// exports.xtsInteractive = async ()=>{
//   let loginRequest = {
//     secretKey: 'Lbwl467$oF',
//     appKey: 'bebaffdb51b1a9a1b1d140',
//     source: 'WEBAPI',
//   };

//   let logIn = await xtsInteractive.logIn(loginRequest);
//   console.log(logIn);

//   return logIn;
// }


let xtsInteractiveWS ;
let xtsInteractiveAPI ;
const interactiveLogin = async ()=>{
    xtsInteractiveAPI = new XTSInteractive(
      process.env.INTERACTIVE_URL
    );

    xtsInteractiveWS = new XTSInteractiveWS(
      process.env.INTERACTIVE_URL
    );
    console.log("xtsInteractiveAPI", xtsInteractiveAPI)
    let loginRequest = {
        secretKey: process.env.INTERACTIVE_SECRET_KEY,
        appKey: process.env.INTERACTIVE_APP_KEY,
    };
    
    (async ()=>{
      console.log(loginRequest, process.env.INTERACTIVE_URL)
      let logIn = await xtsInteractiveAPI.logIn(loginRequest);
      console.log(logIn)
      let socketInitRequest = {
          userID: process.env.XTS_USERID,
          publishFormat: 'JSON',
          broadcastMode: 'Full',
          token: logIn.result.token
        };
      xtsInteractiveWS.init(socketInitRequest);

      xtsInteractiveWS.onConnect((connectData) => {
        console.log("socket connection", connectData);
      });

      xtsInteractiveWS.onJoined((joinedData) => {
        console.log("joinedData", joinedData);
      });

      // await save(logIn.result.userID, logIn.result.token)
    
  })();
}

const placeOrder = async (obj)=>{
  let exchangeSegment ;
  if(obj.exchange === "NFO"){
    exchangeSegment = 'NSEFO'
  }
  const response = await xtsInteractiveAPI.placeOrder({
    exchangeSegment: exchangeSegment,
    exchangeInstrumentID: obj.instrumentToken,
    productType: obj.Product,
    orderType: obj.OrderType,
    orderSide: obj.buyOrSell,
    timeInForce: obj.validity,
    disclosedQuantity: 0,
    orderQuantity: obj.Quantity,
    limitPrice: 15000,
    stopPrice: 0,
    // orderUniqueIdentifier: '45485',
    clientID: process.env.XTS_USERID,
  });

  xtsInteractiveWS.onOrder((orderData) => {
    console.log("order data", orderData);
  });
  console.log(response);
}

const getPlaced = async ()=>{
  xtsInteractiveWS.onOrder((orderData) => {
    console.log("order data", orderData);
  });
}


module.exports = {interactiveLogin, placeOrder };


  // exchangeSegment: "NSEFO",
  // exchangeInstrumentID: 46292,
  // productType: ,
  // orderType: ,
  // orderSide: ,
  // timeInForce: ,
  // disclosedQuantity: ,
  // orderQuantity: ,
  // limitPrice: ,
  // stopPrice: ,

  // exchangeSegment: 'NSEFO',
  // exchangeInstrumentID: 46292,
  // productType: 'NRML',
  // orderType: 'MARKET',
  // orderSide: 'BUY',
  // timeInForce: 'DAY',
  // disclosedQuantity: 0,
  // orderQuantity: 20,
  // limitPrice: 15000,
  // stopPrice: 0,
  // // orderUniqueIdentifier: '45485',
  // clientID: userID,






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


