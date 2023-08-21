const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })

const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('./db/conn');
const hpp = require("hpp")
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request"
})
// Apply the rate limiting middleware to all requests
// app.use(limiter)


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

}

