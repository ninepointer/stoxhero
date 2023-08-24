const axios = require('axios');
const getKiteCred = require('./getKiteCred'); 


async function getLivePrices(instruments) {
    try {
      const kiteData = await getKiteCred.getAccess();
      const { getApiKey, getAccessToken } = kiteData;
      const api_key = getApiKey; 
      const access_token = getAccessToken;
      const auth = 'token ' + api_key + ':' + access_token; // Notice space after 'token'
      
      const url = 'https://api.kite.trade/quote/ltp?' + 
                  instruments.map(instrument => `i=${instrument.exchange}:${instrument.symbol}`).join('&');
      
      const authOptions = {
        headers: {
          'X-Kite-Version': '3',
          Authorization: auth,
        },
      };
      
      const response = await axios.get(url, authOptions);
      const { status, data } = response.data;
      console.log('response', response.data);
      if (status !== 'success') {
        throw new Error('API request was not successful');
      }
  
      const result = [];
  
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const item = data[key];
          result.push({
            exchange_symbol: key,
            last_price: item.last_price,
            instrument_token: item.instrument_token.toString(),
          });
        }
      }
  
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  module.exports = getLivePrices;