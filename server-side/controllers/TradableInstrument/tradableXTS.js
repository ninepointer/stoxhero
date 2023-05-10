const axios = require('axios');
const TradableInstrument = require("../../models/Instruments/tradableInstrumentsSchema");
const getKiteCred = require('../../marketData/getKiteCred'); 

exports.tradableInstrument = async (req, res, next) => {
//   let userId = req.user._id;
//   getKiteCred.getAccess().then((data) => {

//   });
const url = 'http://14.142.188.188:23000/apimarketdata/instruments/master';
let auth = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJDSzY4XzliNTg0YzU4MTczM2NkYzY3NzMwNTgiLCJwdWJsaWNLZXkiOiI5YjU4NGM1ODE3MzNjZGM2NzczMDU4IiwiaWF0IjoxNjgzNjkzNTcyLCJleHAiOjE2ODM3Nzk5NzJ9.CmpKi5GX9NHtW7C6Z1NHJoa7yTasUpF899-qV_Us3lc"

const options = {
  headers: {
    'Authorization': auth,
  },
  responseType: 'json', // set response type to JSON
};

axios.post(url, options, {
    body: JSON.stringify({
        
            exchangeSegmentList: [
            "NSEFO"
            ]
            
    })
})
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