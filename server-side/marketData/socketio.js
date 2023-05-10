const { Server } = require('socket.io');

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000',
        //  origin: "http://3.110.187.5/",
        methods: ['GET', 'POST', 'PATCH'],
      }

});

module.exports = io;


// {
//   "MessageCode":1512,
//   "MessageVersion":4,
//   "ApplicationType":0,
//   "TokenID":0,
//   "ExchangeSegment":1,
//   "ExchangeInstrumentID":2885,
//   "BookType":1,
//   "XMarketType":1,
//   "LastTradedPrice":2495,
//   "LastTradedQunatity":1,
//   "LastUpdateTime":
// }