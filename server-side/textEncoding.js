// Sample data
const originalData = "Hello, this is some data to be converted to binary.";

// Create a TextEncoder instance
const textEncoder = new TextEncoder();

// Encode the data to binary (Uint8Array)
const binaryData = textEncoder.encode(originalData);

console.log(binaryData); // Output: Uint8Array(50) [ 72, 101, 108, 108, 111, ... ]

// Create a TextDecoder instance
const textDecoder = new TextDecoder();

// Decode the binary data back to the original text
const decodedData = textDecoder.decode(binaryData);

console.log(decodedData); 

// curl https://api.kite.trade/session/token \
//    -H "X-Kite-Version: 3" \
//    -d "api_key=nq0gipdzk0yexyko" \
//    -d "request_token=AKEqoU5PXhQZM9D8dddgf2M34auGlCiv" \
//    -d "checksum=172bbc6561201b5ebe760a73637cc1874686352e0435a2254424bd7c452609b3"


// NR0563
// Tlkndk@11