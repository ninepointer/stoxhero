const { setIOValue, getIOValue } = require('./marketData/socketio');
const { subscribeInstrument, getXTSTicksForUserPosition,
    onDisconnect, getXTSTicksForCompanySide } = require("./services/xts/xtsMarket")
const { xtsMarketLogin } = require("./services/xts/xtsMarket");
const { interactiveLogin } = require("./services/xts/xtsInteractive");
const { sendLeaderboardData, sendMyRankData, emitServerTime } = require("./controllers/dailyContestTradeController");
const { createNewTicker, disconnectTicker, subscribeWatchListInstrument, tempGetTicks,
} = require('./marketData/kiteTicker');
const getKiteCred = require('./marketData/getKiteCred');
const { client, setValue } = require("./marketData/redisClient");
const webSocketService = require('./services/chartService/chartService');
const { notificationSender } = require("./notificationSender")
const { SocketDataReceiver } = require("./socketDataReceiver")
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const { apiRoutes } = require('./apiRoutes');
const { cronjobs } = require('./cronjobs');

async function singleProcess() {
    await setIOValue()
    const io = getIOValue();

    client.connect()
    .then(async (res) => {setValue(true); console.log("redis connected", res)})
    .catch((err) => { setValue(false); console.log("redis not connected", err) })

    if (process.env.XTS === "true") {
        xtsMarketLogin()
        .then(() => { })
        .catch((err) => { console.log(err, "xts market login") });

        interactiveLogin()
        .then(() => { })
        .catch((err) => {console.log(err, "xts interactive login")})
    }

    getKiteCred.getAccess().then(async (data) => {
        let interval;
        await createNewTicker(data.getApiKey, data.getAccessToken);
        io.on("connection", async (socket) => {
            socket.on('userId', async (data) => {
                socket.join(`${data}`)
                await client.set(socket.id, data);
                // await getDummyTicks(data)
            })

            socket.on('chart-room', async (data) => {
                const { userId, instruemnt } = data;
                if (userId && instruemnt) {
                    await client.set(`${userId}${instruemnt}:chartsId`, instruemnt);
                    socket.join(`${userId}${instruemnt}`)
                }
            })

            socket.on('dailyContestLeaderboard', async (data) => {
                let { id, userId } = data;
                socket.join(`${id}`)
                socket.join(`${id}${userId}`)
                await client.set(`dailyContestData:${userId}${id}`, JSON.stringify(data));
            })

            socket.on('battleLeaderboard', async (data) => {
                let { id, userId } = data;
                socket.join(`${id}`)
                socket.join(`${id}${userId}`)
                await client.set(`battleData:${userId}${id}`, JSON.stringify(data));
            })

            socket.on('GetHistory', async (data) => {
                webSocketService.send(data);
                await webSocketService.getMessages(io, socket);
            });

            socket.on('SubscribeRealtime', async (data) => {
                webSocketService.send(data);
                await webSocketService.getMessages(io, socket);
            });

            socket.on('disconnect', () => {
                if (interval) clearInterval(interval);
                client.expire(socket.id, 10);
            })

            socket.on('equity-watchlist', async (data) => {
                socket.join("equity")
            })

            socket.on('company-ticks', async (data) => {
                socket.join("company-side");
                socket.join("equity");

            });

            socket.on('user-ticks', async (data) => {
                // socket.join("equity")
                await tempGetTicks();
            });

            socket.on('leave-company-room', async (data) => {
                socket.leave('company-side');
            });

            socket.on('leave-equity-watchlist', async (data) => {
                socket.leave('equity');
            });
            await subscribeWatchListInstrument(); //TODO toggle

        });

        io.on('disconnection', () => { disconnectTicker() }); //TODO toggle
        io.on('disconnection', () => { onDisconnect() });

    });

    //emitting leaderboard for contest.
    if (process.env.PROD === "true") {
        sendLeaderboardData().then(() => { });
        sendMyRankData().then(() => { });
    }

    emitServerTime().then(() => { });

    app.use(express.json({ limit: "10mb" }));
    app.use(require("cookie-parser")());
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
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xssClean());
    app.use(hpp());
    apiRoutes(app).then(()=>{});
    cronjobs().then(()=>{});

    if (process.env.CHART === "true") {
        webSocketService.init(io);
    }

    notificationSender().then(() => { });
    SocketDataReceiver().then(() => { });
}

module.exports = { singleProcess }