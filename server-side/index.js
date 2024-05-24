const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('./db/conn');


const {commonProcess} = require("./commonChildProcess");
const {singleProcess} = require("./singleChildProcess");


if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
      console.log(`Forking process number ${i}...`);

      // Set the environment variable for the first child process only
      const env = (i === 0) ? { SOCKET_IO_SERVER: 'true' } : {};
      cluster.fork(env);
  }
}

async function childProcess() {
  console.log(`Worker ${process.pid} started`, process.env.SOCKET_IO_SERVER);

  if (process.env.SOCKET_IO_SERVER) {
    // Create an HTTP server for Socket.IO
    await singleProcess();
  } else{
    await commonProcess();
  }
  console.log('Server Started')
}