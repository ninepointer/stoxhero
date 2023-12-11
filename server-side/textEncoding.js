// // Sample data
<<<<<<< HEAD


// // Create a TextEncoder instance
=======
// const originalData = [
//     {
//       tradable: true,
//       mode: 'full',
//       instrument_token: 15026434,
//       last_price: 15.9,
//       last_traded_quantity: 400,
//       average_traded_price: 35.94,
//       volume_traded: 164096600,
//       total_buy_quantity: 200550,
//       total_sell_quantity: 2201200,
//       ohlc: { open: 56.25, high: 56.25, low: 15.45, close: 65.9 },      
//       change: -75.87253414264038,
//       last_trade_time: "2023-11-28T09:59:59.000Z",
//       exchange_timestamp: "2023-11-28T12:00:26.000Z",
//       oi: 15439400,
//       oi_day_high: 17768400,
//       oi_day_low: 7695300,
//     //   depth: { buy: [Array], sell: [Array] }
//     },
//     {
//       tradable: true,
//       mode: 'full',
//       instrument_token: 15023106,
//       last_price: 170,
//       last_traded_quantity: 50,
//       average_traded_price: 109.91,
//       volume_traded: 132541650,
//       total_buy_quantity: 375550,
//       total_sell_quantity: 131500,
//       ohlc: { open: 97.05, high: 170, low: 83.6, close: 93.5 },
//       change: 81.81818181818181,
//       last_trade_time: "2023-11-28T09:59:59.000Z",
//       exchange_timestamp: "2023-11-28T12:00:26.000Z",
//       oi: 6220750,
//       oi_day_high: 12832950,
//       oi_day_low: 6220750,
//     //   depth: { buy: [Array], sell: [Array] }
//     }
//   ];

// // // Create a TextEncoder instance
>>>>>>> feature/marketing-notifications
// const textEncoder = new TextEncoder();

// // // Encode the data to binary (Uint8Array)
// const binaryData = textEncoder.encode(originalData);

// console.log(binaryData); // Output: Uint8Array(50) [ 72, 101, 108, 108, 111, ... ]

// // // Create a TextDecoder instance
// const textDecoder = new TextDecoder();

// // // Decode the binary data back to the original text
// const decodedData = textDecoder.decode(binaryData);

// console.log(decodedData[0], decodedData[1]);


// const Entities = require('html-entities').AllHtmlEntities;
// const entities = new Entities();

// const encodedHtml = "<p><strong><em>Hello</em></strong>,</p><p>I am Vijay Verma</p>";
// const decodedHtml = entities.decode(encodedHtml);

// console.log(decodedHtml);

// const {decode} = require('html-entities');
// // const entities = new Entities();

// const encodedHtml = "&lt;p>Hello dear&lt;/p>";
// const decodedHtml = decode(encodedHtml);

// console.log(decodedHtml);

const io = require('socket.io-client');
<<<<<<< HEAD
const url = 'http://43.204.7.180'; // Replace with your server URL
=======
const url = 'http://43.204.7.180/'; // Replace with your server URL
>>>>>>> feature/marketing-notifications
const options = {
    transports: ['websocket'],
    'force new connection': true
};

<<<<<<< HEAD
const numberOfClients = 300; // Number of simulated clients
=======
const numberOfClients = 450; // Number of simulated clients
>>>>>>> feature/marketing-notifications

for (let i = 0; i < numberOfClients; i++) {
    const client = io.connect(url, options);

    client.on('connect', () => {
        console.log('Client connected:', client.id);

        // Perform actions through the socket as needed
        client.emit('connection', true);

        // Optionally, disconnect after some time or actions
        // setTimeout(() => client.disconnect(), 10000);
    });

    client.on('disconnect', () => {
        console.log('Client disconnected:', client.id);
    });

    // Handle other events and errors as needed
}