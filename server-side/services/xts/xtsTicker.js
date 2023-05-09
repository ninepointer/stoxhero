let XtsMarketDataAPI = require('xts-marketdata-api').XtsMarketDataAPI;
let XtsMarketDataWS = require('xts-marketdata-api').WS;

let xtsMarketDataAPI = new XtsMarketDataAPI(
    'http://14.142.188.188:23000/apimarketdata'
);


let xtsMarketDataWS = new XtsMarketDataWS('http://14.142.188.188:23000/apimarketdata');

const createNewXTSTicker = (token) => {
    let socketInitRequest = {
        userID: process.env.XTS_USERID,
        publishFormat: 'JSON',
        broadcastMode: 'Full',
        token: token
      };
    xtsMarketDataWS.init(socketInitRequest);
}

const disconnectXTSTicker = () => {
    xtsMarketDataWS.onDisconnect((disconnectData) => {
        console.log("xts ticker disconnected", disconnectData);
    });
}

const searchInstrumentByString = async (searchString)=>{
    let response = await xtsMarketDataAPI.searchInstrument({
        searchString: searchString,
        source: "WEBAPI",
    });
}






module.exports = { createNewXTSTicker };

