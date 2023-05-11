const axios = require('axios');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema");
const getKiteCred = require('../../marketData/getKiteCred'); 

exports.tradableInstrument = async (req, res, next) => {
  console.log("in xts master")
//   let userId = req.user._id;
//   getKiteCred.getAccess().then((data) => {

//   });
const url = 'http://14.142.188.188:23000/apimarketdata/instruments/master';
let auth = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJDSzY4XzliNTg0YzU4MTczM2NkYzY3NzMwNTgiLCJwdWJsaWNLZXkiOiI5YjU4NGM1ODE3MzNjZGM2NzczMDU4IiwiaWF0IjoxNjgzNzc5MTAxLCJleHAiOjE2ODM4NjU1MDF9.Jm92ZXU2g6MTmSj7Q6LBDgECU3miPJtchRwKq7FU4UQ"

const options = {
  headers: {
    'Authorization': auth,
  },
  responseType: 'json', // set response type to JSON
};

console.log("in xts master", options)
  axios.post(url, {
    exchangeSegmentList: [
      "NSEFO"
    ]
  }, options)
  .then(async (response) => {
    console.log(response);
    const instruments = response.data.result;
    for (let i = 0; i < instruments.length; i++) {
      const instrument = instruments[i];
      console.log(instrument)
    //   const existingInstrument = await TradableInstrument.findOne({ tradingsymbol: instrument.tradingsymbol, status: "Active" });
    //   if (!existingInstrument) {
    //     if ((instrument.name == "NIFTY" || instrument.name == "BANKNIFTY") && instrument.segment == "NFO-OPT") {
    //       console.log("getting instrument", instrument);
    //       if (instrument.name === "NIFTY") {
    //         instrument.name = instrument.name + "50"
    //       }
    //       instrument.lastModifiedBy = userId;
    //       instrument.createdBy = userId;

    //       await TradableInstrument.create(instrument);
    //     }
    //   }
    }
    console.log('JSON file successfully processed');
    res.send('JSON file successfully processed');
  })
  .catch((error) => {
    console.error(error);
  });
};



// {
// 45   ExchangeSegment: 2,
// 5, 9   ExchangeInstrumentID: 45455,
// 41   InstrumentType: 2,
// //   Name: 'NIFTY',
// //   DisplayName: 'NIFTY 08JUN2023 PE 17250',
// //   Description: 'NIFTY2360817250PE',
// //   Series: 'OPTIDX',
// //   NameWithSeries: 'NIFTY-OPTIDX',
// //   InstrumentID: 2315900045455,
// //   PriceBand: [Object],
// //   FreezeQty: 1801,
// 33   TickSize: 0.05,
// 37   LotSize: 50,
// 13   CompanyName: 'NIFTY2360817250PE',
// //   DecimalDisplace: 2,
// //   IsIndex: false,
// //   IsTradeable: false,
// //   Industry: 0,
// //   UnderlyingInstrumentId: -1,
// 17   UnderlyingIndexName: 'Nifty 50',
// 25   ContractExpiration: '2023-06-08T14:30:00',
// //   ContractExpirationString: '08Jun2023',
// //   RemainingExpiryDays: 29,
// 29   StrikePrice: 17250,
// //   OptionType: 4
// exchange, accountType
// },

// accountType:{
//   type: String,
//   required : true,
//   enum : [zerodhaAccountType, xtsAccountType]
// },
// lastModifiedBy
// createdBy
// lastModifiedOn:{
//   type: Date,
//   required : true,
//   default: new Date()
// },
// createdOn:{
//   type: Date,
//   required : true,
//   default: new Date()
// },
// status: {
//   type: String,
//   required : true,
//   default: "Active"
// }