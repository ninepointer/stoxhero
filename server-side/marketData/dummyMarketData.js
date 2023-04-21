const DummyMarketData = async () => {


    try{

        let filteredTicks = [
            {
              tradable: true,
              mode: 'quote',
              instrument_token: 13833218,
              last_price: Math.random()*200,
              last_traded_quantity: 50,
              average_traded_price: 485.86,
              volume_traded: 391950,
              total_buy_quantity: 52000,
              total_sell_quantity: 6350,
              ohlc: { open: 494.9, high: 532.8, low: 427.1, close: 512.8 },
              change: 2.9933697347893964
            },
            {
              tradable: true,
              mode: 'quote',
              instrument_token: 13829890,
              last_price: Math.random()*200,
              last_traded_quantity: 50,
              average_traded_price: 213.8,
              volume_traded: 12516700,
              total_buy_quantity: 164000,
              total_sell_quantity: 28600,
              ohlc: { open: 204.55, high: 274.8, low: 167.95, close: 197.05 },
              change: -12.991626490738403
            }
          ]

          setTimeout(await DummyMarketData, 10000);

      return filteredTicks
  
    //   return arr;
  
    } catch (err){
      return new Error(err);
    } 
  
  };
  
  module.exports = DummyMarketData;