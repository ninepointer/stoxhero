// const axios = require('axios');
// const getKiteCred = require('./getKiteCred'); 

// async function singleLivePrice (exchange, symbol){
  
//   try{
//     getKiteCred.getAccess().then(async (data) => {
//       console.log("data", data)
//       let {getApiKey, getAccessToken} = data;
//       let addUrl = ('i=' + exchange + ':' + symbol);
//       let url = `https://api.kite.trade/quote?${addUrl}`;
//       const api_key = getApiKey; 
//       const access_token = getAccessToken;
//       let auth = 'token' + api_key + ':' + access_token;
    
//       let authOptions = {
//         headers: {
//           'X-Kite-Version': '3',
//           Authorization: auth,
//         },
//       };
    
//       let arr = [];
//       try{
          
//         const response = await axios.get(url, authOptions);      
//         for (let instrument in response.data.data) {
//             let obj = {};
//             obj.last_price = response.data.data[instrument].last_price;
//             obj.instrument_token = response.data.data[instrument].instrument_token;
//             obj.average_price = response.data.data[instrument].ohlc.close;
//             obj.timestamp = response.data.data[instrument].timestamp
//             arr.push(obj);
//         }

//         console.log("response", arr)
//         return arr;
  
//       } catch (err){
//         console.log(err)
//       } 
      
//     })
//   } catch(err){
//     console.log(err)
//   }

// }

// module.exports = singleLivePrice;


const axios = require('axios');
const getKiteCred = require('./getKiteCred'); 

async function singleLivePrice(exchange, symbol) {
  try {
    const data = await getKiteCred.getAccess();
    const { getApiKey, getAccessToken } = data;
    const addUrl = ('i=' + exchange + ':' + symbol);
    const url = `https://api.kite.trade/quote?${addUrl}`;
    const api_key = getApiKey; 
    const access_token = getAccessToken;
    const auth = 'token' + api_key + ':' + access_token;
    
    const authOptions = {
      headers: {
        'X-Kite-Version': '3',
        Authorization: auth,
      },
    };
    
    const obj = {};
    try {
      const response = await axios.get(url, authOptions);      
      for (const instrument in response.data.data) {
        obj.last_price = response.data.data[instrument].last_price;
        obj.instrument_token = response.data.data[instrument].instrument_token;
        obj.average_price = response.data.data[instrument].ohlc.close;
        obj.timestamp = response.data.data[instrument].timestamp;
      }

      return obj;
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = singleLivePrice;
