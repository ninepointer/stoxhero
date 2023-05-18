const XTSInteractive = require('xts-interactive-api').Interactive;
const XTSInteractiveWS = require('xts-interactive-api').WS;
const RetrieveOrder = require("../../models/TradeDetails/retreiveOrder")

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
    
    try{
      (async ()=>{
        console.log(loginRequest, process.env.INTERACTIVE_URL)
        let logIn = await xtsInteractiveAPI.logIn(loginRequest);
        console.log(logIn)
        let socketInitRequest = {
            userID: process.env.XTS_USERID,
            publishFormat: 'JSON',
            broadcastMode: 'Full',
            token: logIn?.result?.token
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
    } catch(err){
      console.log(err);
    }

}

const placeOrder = async (obj)=>{
  let exchangeSegment ;
  if(obj.exchange === "NFO"){
    exchangeSegment = 'NSEFO'
  }
  if(obj.exchange === "NSE"){
    exchangeSegment = 'NSECM'
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
    limitPrice: 0,
    stopPrice: 0,
    clientID: process.env.XTS_CLIENTID,
  });


  await getPlacedOrder(false);

  return response;
  // console.log(response);
}

const getPlacedOrder = async (isDataSaved)=>{
  xtsInteractiveWS.onOrder((orderData) => {
    if(isDataSaved){
      return;
    }
    console.log("order data", orderData);
    const {ClientID, AppOrderID, ExchangeOrderID, ExchangeInstrumentID, OrderSide, OrderType, ProductType,
          TimeInForce, OrderPrice, OrderQuantity, OrderStatus, OrderAverageTradedPrice , OrderDisclosedQuantity,
          ExchangeTransactTime, LastUpdateDateTime, CancelRejectReason, ExchangeTransactTimeAPI} = orderData;

          const date = '17-05-2023 15:21:06';
          const date1 = date.split(" ");
          const date2 = date1[0].split("-");
          const date3 = `${date2[2]}-${date2[1]}-${date2[0]} ${date1[1]}`
          
          const utcDate = new Date(date3).toUTCString();
          
          console.log(new Date(utcDate));
      try{
        if(OrderStatus === "Rejected" || OrderStatus === "Filled"){
          let status, transaction_type ;
          if(OrderStatus === "Rejected"){
            status = "REJECTED";
          }else if(OrderStatus === "Filled"){
            status = "COMPLETE";
          }

          if(OrderSide == "Sell"){
            transaction_type = "SELL";
          } else if(OrderSide == "Buy"){
            transaction_type = "BUY";
          }
          const saveOrder = RetrieveOrder.create({
            order_id: AppOrderID, status: status, average_price: OrderAverageTradedPrice,
            quantity: OrderQuantity, product: ProductType, transaction_type: transaction_type,
            exchange_order_id: ExchangeOrderID, order_timestamp: LastUpdateDateTime, validity: TimeInForce,
            exchange_timestamp: ExchangeTransactTime, order_type: OrderType, price: OrderPrice,
            disclosed_quantity: OrderDisclosedQuantity, placed_by: ClientID, status_message: CancelRejectReason,
            instrument_token: ExchangeInstrumentID, exchange_update_timestamp: new Date(utcDate), guid: `${ExchangeOrderID}${AppOrderID}`
          })

          isDataSaved = true;
        }
      } catch(err){
        console.log(err, "err in retreive order");
      }
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


