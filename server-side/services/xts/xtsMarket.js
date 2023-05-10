let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;
let XtsMarketDataWS = require('xts-marketdata-api').WS;
const socketIoClient = require("socket.io-client");


let xtsMarketDataWS ;
let xtsMarketDataAPI ;
let socket;
const data = async ()=>{
    xtsMarketDataAPI = new XtsMarketDataAPI(
        'http://14.142.188.188:23000/apimarketdata'
    );

    xtsMarketDataWS = new XtsMarketDataWS(
        'http://14.142.188.188:23000/apimarketdata'
    );
    console.log("xtsMarketDataAPI", xtsMarketDataAPI)
    let loginRequest = {
        secretKey: 'Awjq826##5',
        appKey: '9b584c581733cdc6773058',
    };
    
    (async ()=>{
        console.log(loginRequest)
        let logIn = await xtsMarketDataAPI.logIn(loginRequest);
        console.log(logIn)
        let socketInitRequest = {
            userID: process.env.XTS_USERID,
            publishFormat: 'JSON',
            broadcastMode: 'Full',
            token: logIn.result.token
          };
        xtsMarketDataWS.init(socketInitRequest);


          let response3 = await xtsMarketDataAPI.subscription({
            instruments: [
              {
                exchangeSegment: 1,
                exchangeInstrumentID: 26001,
              },
              {
                exchangeSegment: 1,
                exchangeInstrumentID: 26000,
              },
            ],
            xtsMessageCode: 1512,
          });

          console.log(response3)

   xtsMarketDataWS.onConnect((connectData) => {
      console.log("socket connection", connectData);
    });
      //"marketDepthEvent" event listener
  xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
    console.log("1", marketDepthData);
  });

  //"openInterestEvent" event listener
  xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {
    console.log("2",openInterestData);
  });

    // xtsMarketDataWS.on("1512-json-full",function(data){
    //     console.log("data is "+data);
    // });

//   "indexDataEvent" event listener
  xtsMarketDataWS.onIndexDataEvent((indexData) => {
    console.log("index data", indexData);
  });

  //"marketDepth100Event" event listener
  xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {
    console.log("3",marketDepth100Data);
  });

//   "instrumentPropertyChangeEvent" event listener
//   xtsMarketDataWS.onInstrumentPropertyChangeEvent((propertyChangeData) => {
//     console.log("4", propertyChangeData);
//   });

  //"candleDataEvent" event listener
  xtsMarketDataWS.onCandleDataEvent((candleData) => {
    console.log("candle data", candleData);
  });

  xtsMarketDataWS.onJoined((joinedData) => {
    console.log("joinedData", joinedData);
  });

  //"error" event listener
  console.log("check type of", typeof(xtsMarketDataWS.onLTPEvent))
  xtsMarketDataWS.onLTPEvent((errorData) => {
    // console.log("errorData", errorData);
  });

  //"logout" event listener
  xtsMarketDataWS.onLogout((logoutData) => {
    console.log(logoutData);
  });







        // console.log( process.env.XTS_USERID,logIn.result.token )
        //  socket = socketIoClient("http://14.142.188.188:23000", {
        //     path: '/apimarketdata/socket.io',
        //     query: {
        //         token: logIn.result.token,
        //         userID: process.env.XTS_USERID,
        //         publishFormat: "JSON",
        //         broadcastMode: "Full"
        //     }
        // });
        // socket.on('connect', function () {
        //     console.log("socket connected successfully")
        // });
        // socket.on("1501-json-full",function(data){
        //     console.log("data is "+data);
        // }); 
        // console.log("socket", socket)

        // let response3 = await xtsMarketDataAPI.subscription({
        //     instruments: [
        //       {
        //         exchangeSegment: 1,
        //         exchangeInstrumentID: 3749,
        //       },
        //     ],
        //     xtsMessageCode: 1512,
        //   });

        //   console.log(response3)
    
    })();


}

const getInstrument = async()=>{
    let response = await xtsMarketDataAPI.searchInstrument({
        searchString: 'REL',
        source: "WEBAPI",
      });
    
    return (response);
}

const tickerConnect = async()=>{
       socket.on("1501-json-full",function(data){
        console.log("data is "+data);
       }); 

       socket.on("1502-json-full",function(data){
        console.log("data is "+data);
       });

       socket.on("1505-json-full",function(data){
        console.log("data is "+data);
       });

       socket.on("1512-json-full",function(data){
        console.log("data is "+data);
       });
    console.log("inside ticker cn=onnected")
//     xtsMarketDataWS.onConnect((connectData) => {
//       console.log("socket connection", connectData);
//     });
//       //"marketDepthEvent" event listener
//   xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
//     console.log("1", marketDepthData);
//   });

//   //"openInterestEvent" event listener
//   xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {
//     console.log("2",openInterestData);
//   });

    // xtsMarketDataWS.on("1512-json-full",function(data){
    //     console.log("data is "+data);
    // });

  //"indexDataEvent" event listener
//   xtsMarketDataWS.onIndexDataEvent((indexData) => {
//     console.log("index data", indexData);
//   });

//   //"marketDepth100Event" event listener
//   xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {
//     console.log("3",marketDepth100Data);
//   });

  //"instrumentPropertyChangeEvent" event listener
//   xtsMarketDataWS.onInstrumentPropertyChangeEvent((propertyChangeData) => {
//     console.log("4", propertyChangeData);
//   });

//   //"candleDataEvent" event listener
//   xtsMarketDataWS.onCandleDataEvent((candleData) => {
//     console.log("candle data", candleData);
//   });

//   xtsMarketDataWS.onJoined((joinedData) => {
//     console.log("joinedData", joinedData);
//   });

//   //"error" event listener
//   xtsMarketDataWS.onError((errorData) => {
//     console.log("errorData", errorData);
//   });

  // //"logout" event listener
//   xtsMarketDataWS.onLogout((logoutData) => {
//     console.log(logoutData);
//   });

}

module.exports = {data, getInstrument, tickerConnect};
  


    // let response = await xtsMarketDataAPI.clientConfig();

    // let response = await xtsMarketDataAPI.searchInstrument({
    //     searchString: 'REL',
    //     source: "WEBAPI",
    // });

    // console.log(response);

    // let response1 = await xtsMarketDataAPI.subscription({
    //     instruments: [
    //       {
    //         exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
    //         exchangeInstrumentID: 22,
    //       },
    //       {
    //         exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
    //         exchangeInstrumentID: 11536,
    //       },
    //     ],
    //     xtsMessageCode: 1502,
    // });
    // console.log( response1);