const client = require('../marketData/redisClient');
const io = require('../marketData/socketio');
// const DummyMarketData = () => {
//   return new Promise((resolve) => {
//     const sendDummyTicks = () => {
//       try {
//         let filteredTicks = [
//           {
//             tradable: true,
//             mode: 'quote',
//             instrument_token: 13832706,
//             last_price: Math.random() * 200,
//             last_traded_quantity: 50,
//             average_traded_price: 485.86,
//             volume_traded: 391950,
//             total_buy_quantity: 52000,
//             total_sell_quantity: 6350,
//             ohlc: { open: 494.9, high: 532.8, low: 427.1, close: 512.8 },
//             change: 2.9933697347893964
//           },
//           {
//             tradable: true,
//             mode: 'quote',
//             instrument_token: 13829378,
//             last_price: Math.random() * 200,
//             last_traded_quantity: 50,
//             average_traded_price: 213.8,
//             volume_traded: 12516700,
//             total_buy_quantity: 164000,
//             total_sell_quantity: 28600,
//             ohlc: { open: 204.55, high: 274.8, low: 167.95, close: 197.05 },
//             change: -12.991626490738403
//           }
//         ];
//         resolve(filteredTicks);
//       } catch (err) {
//         console.error(err);
//         reject(err);
//       }
//       setInterval(sendDummyTicks, 10000);
//     };
//     sendDummyTicks();
//   });
// };

// module.exports = DummyMarketData;

// const DummyMarketData = (socket) => {
//   return new Promise(async (resolve, reject) => {
//     let timeoutId; // Store the timeout ID

//     const sendDummyTicks = async () => {
//       try {
//         let filteredTicks = [
//           // Replace with your logic to filter ticks

//           {
//             tradable: true,
//             mode: 'quote',
//             instrument_token: 13832706,
//             last_price: Math.random() * 200,
//             last_traded_quantity: 50,
//             average_traded_price: 485.86,
//             volume_traded: 391950,
//             total_buy_quantity: 52000,
//             total_sell_quantity: 6350,
//             ohlc: { open: 494.9, high: 532.8, low: 427.1, close: 512.8 },
//             change: 2.9933697347893964
//           },
//           {
//             tradable: true,
//             mode: 'quote',
//             instrument_token: 13829378,
//             last_price: Math.random() * 200,
//             last_traded_quantity: 50,
//             average_traded_price: 213.8,
//             volume_traded: 12516700,
//             total_buy_quantity: 164000,
//             total_sell_quantity: 28600,
//             ohlc: { open: 204.55, high: 274.8, low: 167.95, close: 197.05 },
//             change: -12.991626490738403
//           }
//         ];
//         let userId = await client.get(socket.id);
//         io.to(userId).emit('contest-ticks', filteredTicks);
//         console.log('sending');
//         resolve(filteredTicks);
//       } catch (err) {
//         console.error(err);
//         reject(err);
//       }

//       timeoutId = setInterval(sendDummyTicks, 2000); // Set a new timeout and store the timeout ID
//     };

//     sendDummyTicks();


//     // Add an exit condition to prevent infinite loop
//     const exitCondition = () => {
//       // console.log('clearing interval');
//       clearInterval(timeoutId); // Cancel the timeout
//       reject(new Error('Exit condition reached')); // Reject the promise with an error
//     };

//     // Call the exit condition after a certain duration (e.g., 1 hour)
//     setTimeout(exitCondition, 2100); // 1 hour in milliseconds
//   });
// };

// module.exports = DummyMarketData;

let filteredTicks = [];
const getFilteredTicks = ()=>{
  return filteredTicks;
}

const DummyMarketData = (socket) => {
  return new Promise(async (resolve, reject) => {
    let timeoutId; // Store the timeout ID

    const sendDummyTicks = async () => {
      try {
        filteredTicks = [
          // Replace with your logic to filter ticks
          {
                        tradable: true,
                        mode: 'quote',
                        instrument_token: 14744066,
                        last_price: parseInt((Math.random() * 100) + 100),
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
                        instrument_token: 15023106,
                        last_price: parseInt((Math.random() * 100) + 100),
                        last_traded_quantity: 50,
                        average_traded_price: 213.8,
                        volume_traded: 12516700,
                        total_buy_quantity: 164000,
                        total_sell_quantity: 28600,
                        ohlc: { open: 204.55, high: 274.8, low: 167.95, close: 197.05 },
                        change: -12.991626490738403
                      },
                      {
                        tradable: true,
                        mode: 'quote',
                        instrument_token: 15023362,
                        last_price: parseInt((Math.random() * 100) + 100),
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
                        instrument_token: 14744322,
                        last_price: parseInt((Math.random() * 100) + 100),
                        last_traded_quantity: 50,
                        average_traded_price: 213.8,
                        volume_traded: 12516700,
                        total_buy_quantity: 164000,
                        total_sell_quantity: 28600,
                        ohlc: { open: 204.55, high: 274.8, low: 167.95, close: 197.05 },
                        change: -12.991626490738403
                      }
          // ...
        ];
        let userId = await client.get(socket.id);
        io.to(userId).emit('tick-room', filteredTicks);
        console.log('sending');
        resolve(filteredTicks);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    };

    // Call the sendDummyTicks function initially
    sendDummyTicks();

    // Set the interval to call sendDummyTicks every 2 seconds, and store the timeout ID
    timeoutId = setInterval(sendDummyTicks, 2000);

    // Add an exit condition to prevent an infinite loop
    const exitCondition = () => {
      clearInterval(timeoutId); // Cancel the interval
      reject(new Error('Exit condition reached')); // Reject the promise with an error
    };

    // Call the exit condition after a certain duration (e.g., 1 hour)
    setTimeout(exitCondition, 3600000); // 1 hour in milliseconds
  });
};

module.exports = {DummyMarketData, filteredTicks, getFilteredTicks};




