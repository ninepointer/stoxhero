// // Sample data


// // Create a TextEncoder instance
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

// const io = require('socket.io-client');
// const url = 'http://43.204.7.180'; // Replace with your server URL
// const options = {
//     transports: ['websocket'],
//     'force new connection': true
// };

// const numberOfClients = 300; // Number of simulated clients

// for (let i = 0; i < numberOfClients; i++) {
//     const client = io.connect(url, options);

//     client.on('connect', () => {
//         console.log('Client connected:', client.id);

//         // Perform actions through the socket as needed
//         client.emit('connection', true);

//         // Optionally, disconnect after some time or actions
//         // setTimeout(() => client.disconnect(), 10000);
//     });

//     client.on('disconnect', () => {
//         console.log('Client disconnected:', client.id);
//     });

//     // Handle other events and errors as needed
// }