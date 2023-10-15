const WebSocket = require('ws');
const {client, getValue, isRedisConnected} = require("../../marketData/redisClient");
let ws;

function init(io) {
  connect(io);
}

async function getMessages(io, socket) {
  try {
    const incoming = async function incoming(data) {
      // console.log(data);
      const response = JSON.parse(data);
      // console.log("history data", response?.Request?.InstrumentIdentifier, response.InstrumentIdentifier, response);
      let userId;

      userId = await client.get(socket.id);
      let instrument = await client.get(`${userId}${response?.Request?.InstrumentIdentifier}:chartsId`);

      if (response.MessageType === 'HistoryOHLCResult') {
        const convertedData = convertData(response.Result.reverse())
        const uniqueData = removeDuplicates(convertedData, "time");
        io.to(`${userId}${instrument}`).emit('HistoryOHLCResult', uniqueData);
        // io.to(`${userId}`).emit('HistoryOHLCResult', uniqueData);
        ws.removeListener('message', incoming);
      }
      if (response.MessageType === 'RealtimeResult') {
        io.to(`${userId}${response.InstrumentIdentifier}`).emit('RealtimeResult', response);
        // io.to(`${userId}`).emit('RealtimeResult', response);
      }
    }
    ws.on('message', incoming);
  } catch (err) {
    console.log(err)
  }

}

function connect(io) {
  try{
    ws = new WebSocket('ws://nimblewebstream.lisuns.com:4575');

    ws.on('open', function open() {
      // Authentication
      const accessKey = process.env.GDFKEY;  // Replace with your access key
      const authMessage = {
        MessageType: "Authenticate",
        Password: accessKey
      };
      ws.send(JSON.stringify(authMessage));
    });
  
    ws.on('message', async function incoming(data) {
      // console.log(data);
      const response = JSON.parse(data);
      if(response.MessageType === 'RealtimeResult'){
        io.emit('RealtimeResult', response);
      }
    });
  
    ws.on('error', function error(err) {
      console.error('WebSocket encountered error: ', err.message);
      // In case of error, try to reconnect
      setTimeout(() => connect(io), 5000);
    });
  
    ws.on('close', function close(code, reason) {
      // When connection is closed, try to reconnect
      setTimeout(() => connect(io), 5000);
    });
  } catch(err){
    console.log(err)
  }
}

function send(message) {
  try{
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  } catch(err){
    console.log(err)
  }
}

const removeDuplicates = (arr, field) => {
  const uniqueMap = new Map();
  arr.forEach(obj => {
    // console.log("uniqueMap", obj, field)
    uniqueMap.set(obj[field], obj);
  });
  
  return Array.from(uniqueMap.values());
};

function convertData(data) {
  // console.log(data)
  return data.map(item => ({
    time: item.LastTradeTime + 19800,
    open: item.Open,
    high: item.High,
    low: item.Low,
    close: item.Close,
  }));
}



module.exports = { init, send, getMessages };