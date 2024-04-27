const express = require("express");
const app = express();
let { client, setValue } = require("./marketData/redisClient");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const { pendingOrderMain } = require("./PlaceStopLossOrder");
const { apiRoutes } = require('./apiRoutes');


async function commonProcess() {
  client
    .connect()
    .then(async (res) => {
      setValue(true);
      console.log("redis connected", res);
    })
    .catch((err) => {
      setValue(false);
      console.log("redis not connected", err);
    });

  // app.use(express.json({ limit: "20kb" }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb" }));

  const allowedOrigins = ['http://localhost:3000', 'https://stoxhero.com', 'https://stoxhero-next-ts.vercel.app', 'http://43.204.7.180'];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Check if the incoming origin is in the allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
  app.use(require("cookie-parser")());

  app.use(mongoSanitize());
  app.use(helmet());
  app.use(xssClean());
  app.use(hpp());

  apiRoutes(app).then(()=>{});

  await pendingOrderMain();
}

module.exports = { commonProcess };
