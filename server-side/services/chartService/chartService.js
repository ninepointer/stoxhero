const WebSocket = require('ws');
const {client, getValue, isRedisConnected} = require("../../marketData/redisClient");
let ws;

function init(io) {
  connect(io);
}

async function getMessages(io, socket){
  // console.log('getMessages function called with', socket.id);
  const incoming = async function incoming(data) {
    // console.log(data);
    const response = JSON.parse(data);
    console.log("history data", response.Request, response.MessageType);
    let userId;
    
      userId = await client.get(socket.id);

    if (response.MessageType === 'HistoryOHLCResult') {
      // console.log('sending response to', userId, response);
      const convertedData = convertData(response.Result.reverse())
      const uniqueData = removeDuplicates(convertedData, "time");
      console.log("uniqueData", `${userId}${response.Request.InstrumentIdentifier}`)
      io.to(`${userId}${response.InstrumentIdentifier}`).emit('HistoryOHLCResult', uniqueData);
      ws.removeListener('message', incoming);
    }
    if(response.MessageType === 'RealtimeResult'){
      console.log("response", response.InstrumentIdentifier, userId)
      io.to(`${userId}${response.InstrumentIdentifier}`).emit('RealtimeResult', response);
    }
  }
  ws.on('message', incoming);
  // ws.removeListener('message', incoming)
}

function connect(io) {
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
    // console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
    // When connection is closed, try to reconnect
    setTimeout(() => connect(io), 5000);
  });
}

function send(message) {
  // console.log('sending message', JSON.stringify(message));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Message not sent.');
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