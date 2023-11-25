// // Sample data
// const originalData = "Hello, this is some data to be converted to binary.";

// // Create a TextEncoder instance
// const textEncoder = new TextEncoder();

// // Encode the data to binary (Uint8Array)
// const binaryData = textEncoder.encode(originalData);

// console.log(binaryData); // Output: Uint8Array(50) [ 72, 101, 108, 108, 111, ... ]

// // Create a TextDecoder instance
// const textDecoder = new TextDecoder();

// // Decode the binary data back to the original text
// const decodedData = textDecoder.decode(binaryData);

// console.log(decodedData);


// const Entities = require('html-entities').AllHtmlEntities;
// const entities = new Entities();

// const encodedHtml = "<p><strong><em>Hello</em></strong>,</p><p>I am Vijay Verma</p>";
// const decodedHtml = entities.decode(encodedHtml);

// console.log(decodedHtml);

const {decode} = require('html-entities');
// const entities = new Entities();

const encodedHtml = "&lt;p>Hello dear&lt;/p>";
const decodedHtml = decode(encodedHtml);

console.log(decodedHtml);

