const { Server } = require('socket.io');

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000',
        //  origin: "http://3.110.187.5/",
        methods: ['GET', 'POST', 'PATCH'],
      }

});

// console.log("socket running...........................................")

module.exports = io;


// const { Server } = require('socket.io');

// let ioInstance; // Singleton instance

// function initializeSocketIO() {
//     if (!ioInstance) {
//         ioInstance = new Server(9000, {
//             cors: {
//                 origin: 'http://localhost:3000',
//                 methods: ['GET', 'POST', 'PATCH'],
//             }
//         });
//     }
//     return ioInstance;
// }

// module.exports = initializeSocketIO();
