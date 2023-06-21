const WebSocket = require('ws');

let ws;

function init(io) {
  connect(io);
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

  ws.on('message', function incoming(data) {
    // console.log(data);
    const response = JSON.parse(data);
    // console.log(response);

    if (response.MessageType === 'HistoryOHLCResult') {
      io.emit('HistoryOHLCResult', response);
    }
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
    console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
    // When connection is closed, try to reconnect
    setTimeout(() => connect(io), 5000);
  });
}

function send(message) {
  console.log('sending message', JSON.stringify(message));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Message not sent.');
  }
}

module.exports = { init, send };
