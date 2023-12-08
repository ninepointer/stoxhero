const nodeCron = require("node-cron");
const { setIOValue, getIOValue } = require('./marketData/socketio');
const { subscribeInstrument, getXTSTicksForUserPosition,
    onDisconnect, getXTSTicksForCompanySide } = require("./services/xts/xtsMarket")
const { xtsMarketLogin } = require("./services/xts/xtsMarket");
const { interactiveLogin } = require("./services/xts/xtsInteractive");

const { sendLeaderboardData, sendMyRankData, emitServerTime } = require("./controllers/dailyContestTradeController");
const { sendMyRankDataBattle, sendLeaderboardDataBattle } = require("./controllers/battles/battleTradeController");

const { saveLiveUsedMargin, saveMockUsedMargin, saveMockDailyContestUsedMargin, saveXtsMargin } = require("./controllers/marginRequired")
const { autoCutMainManually, autoCutMainManuallyMock} = require("./controllers/AutoTradeCut/mainManually");
const { createNewTicker, disconnectTicker,
    subscribeTokens, subscribeWatchListInstrument,
} = require('./marketData/kiteTicker');
// getTicksForContest

const getKiteCred = require('./marketData/getKiteCred');
const cronJobForHistoryData = require("./marketData/getinstrumenttickshistorydata");

let { client, setValue } = require("./marketData/redisClient");
const { appLive, appOffline, infinityLive, infinityOffline } = require('./controllers/appSetting');
const { autoExpireTenXSubscription } = require("./controllers/tenXTradeController");
const Setting = require("./models/settings/setting");

const { zerodhaAccountType } = require("./constant")
const { openPrice } = require("./marketData/setOpenPriceFlag");
const webSocketService = require('./services/chartService/chartService');
const { updateUserWallet } = require('./controllers/internshipTradeController');
const { EarlySubscribedInstrument } = require("./marketData/earlySubscribeInstrument");
const {notificationSender} = require("./notificationSender")
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const { processBattles } = require("./controllers/battles/battleController")
const Product = require('./models/Product/product');
const {mail} = require("./controllers/dailyReportMail")
const {dailyContestTradeCut, dailyContestTimeStore} = require("./dailyContestTradeCut")

async function singleProcess() {
    await setIOValue()
    const io = getIOValue();
    console.log(`Master ${process.pid} is running`);


    client.connect()
        .then(async (res) => {
            // isRedisConnected = true ; 
            setValue(true);
            console.log("redis connected", res)
        })
        .catch((err) => {
            // isRedisConnected = false;
            setValue(false);
            console.log("redis not connected", err)
        })

    let setting;
    Setting.find()
        .then((res) => {
            setting = res[0].toggle;
        })


    if (process.env.XTS === "true") {
        xtsMarketLogin()
            .then(() => { })
            .catch((err) => {
                console.log(err, "xts market login")
            })
        interactiveLogin()
            .then(() => { })
            .catch((err) => {
                console.log(err, "xts interactive login")
            })
    }



    getKiteCred.getAccess().then(async (data) => {
        // console.log(data)
        let interval;
        await createNewTicker(data.getApiKey, data.getAccessToken);
        // await subscribeInstrument();
        io.on("connection", async (socket) => {
            console.log(socket) 
            socket.on('userId', async (data) => {
                socket.join(`${data}`)
                await client.set(socket.id, data);
            })

            socket.on('chart-room', async (data) => {
                const { userId, instruemnt } = data;
                // console.log("data", userId, instruemnt, data)
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
                // console.log(data)
                webSocketService.send(data);
                await webSocketService.getMessages(io, socket);
            });

            socket.on('SubscribeRealtime', async (data) => {
                webSocketService.send(data);
                await webSocketService.getMessages(io, socket);
            });

            // socket.emit('check', false)


            socket.on('disconnect', () => {
                console.log("disconnecting socket")

                if (interval) clearInterval(interval);
                client.expire(socket.id, 10);
            })

            // socket.on('hi', async (data) => {
            //     await onError();
            //     await onOrderUpdate();

            // });


            socket.on('company-ticks', async (data) => {
                socket.join("company-side")
                // console.log("in company-ticks event")
                // if (setting?.ltp == zerodhaAccountType || setting?.complete == zerodhaAccountType) {
                //     await getTicksForCompanySide(socket);
                // } else {
                //     await getXTSTicksForCompanySide(socket);
                // }

                // await onError();
                // await onOrderUpdate();
            });

            // socket.on('user-ticks', async (data) => {
            //     console.log("in user-ticks event")
            //     // await getTicksForUserPosition(socket, data);
            //     // await positions();
            //     if (setting?.ltp == zerodhaAccountType || setting?.complete == zerodhaAccountType) {
            //         await getTicksForUserPosition(socket, data);
            //         // await getTicksForCompanySide(socket);
            //         // await getDummyTicks(socket)
            //     } else {
            //         await getXTSTicksForUserPosition(socket, data);
            //         await getXTSTicksForCompanySide(socket);
            //     }

            //     // await DummyMarketData(socket);
            //     await onError();
            //     await onOrderUpdate();

            // });

            socket.on('leave-company-room', async (data) => {
                socket.leave('company-side');
            });
            await subscribeWatchListInstrument(); //TODO toggle

        });

        io.on('disconnection', () => { disconnectTicker() }); //TODO toggle
        io.on('disconnection', () => { onDisconnect() });

        if (setting?.ltp == zerodhaAccountType || setting?.complete == zerodhaAccountType) {
            app.use('/api/v1', require("./marketData/livePrice"));
        } else {
            app.use('/api/v1', require("./services/xts/xtsHelper/xtsLivePrice"));
        }

    });

    //emitting leaderboard for contest.
   if (process.env.PROD === "true") {
        sendLeaderboardData().then(() => { });
        sendMyRankData().then(() => { });
        // sendLeaderboardDataBattle().then(() => { });
        // sendMyRankDataBattle().then(() => { });
   }

    emitServerTime().then(() => { });


    Setting.find().then((res) => {

        const appStartTime = new Date(res[0]?.time?.appStartTime);
        const appEndTime = new Date(res[0]?.time?.appEndTime);

        console.log("appStartTime", appStartTime, appEndTime)


        const appStartHour = appStartTime.getHours();
        const appStartMinute = appStartTime.getMinutes();

        const appEndHour = appEndTime.getHours();
        const appEndMinute = appEndTime.getMinutes();

        console.log(appStartHour, appStartMinute, appEndHour, appEndMinute)
        if (process.env.PROD === "true") {
            let date = new Date();
            let weekDay = date.getDay();
            if (weekDay > 0 && weekDay < 6) {

                const onlineApp = nodeCron.schedule(`${appStartMinute} ${appStartHour} * * ${weekDay}`, () => {
                    appLive();
                    infinityLive()
                });

                const offlineApp = nodeCron.schedule(`${appEndMinute} ${appEndHour} * * ${weekDay}`, () => {
                    appOffline();
                    infinityOffline();
                });

            }
        }

    });

    if (process.env.PROD === "true") {
        let date = new Date();
        let weekDay = date.getDay();
        if (weekDay > 0 && weekDay < 6) {
            const job = nodeCron.schedule(`0 30 10 * * ${weekDay}`, cronJobForHistoryData);

            const autotrade = nodeCron.schedule(`50 9 * * *`, async () => {
                autoCutMainManually();
                autoCutMainManuallyMock();
                // changeStatus();
                // changeMarginXStatus();
                // changeBattleStatus();
                // creditAmount();
            });

            const saveMargin = nodeCron.schedule(`*/5 3-10 * * ${weekDay}`, () => {
                saveLiveUsedMargin();
                saveMockUsedMargin();
                saveMockDailyContestUsedMargin();
                saveXtsMargin();
            });
            const setOpenPriceFlag = nodeCron.schedule(`46 3 * * *`, () => {
                openPrice();
                EarlySubscribedInstrument();
            });

            const subscribeTokens = nodeCron.schedule(`48 3 * * *`, () => {
                subscribeTokens();
            });
        }
        const autoExpire = nodeCron.schedule(`0 30 10 * * *`, autoExpireTenXSubscription);
        const internshipPayout = nodeCron.schedule(`0 30 17 * * *`, updateUserWallet);
        const reportMail = nodeCron.schedule(`0 0 18 * * *`, mail);
        const dailyContest = nodeCron.schedule(`31 6 * * *`, dailyContestTradeCut);
        const dailyContest2oclock = nodeCron.schedule(`31 8 * * *`, dailyContestTradeCut);
        const dailyContesttimeStore = nodeCron.schedule(`49 3 * * *`, dailyContestTimeStore);
    // const dailyContesttimeStore = nodeCron.schedule(`*/59 * * * * *`, dailyContestTimeStore);

    }

    app.get('/api/v1/servertime', (req, res, next) => { res.json({ status: 'success', data: new Date() }) })
    app.use(express.json({ limit: "10mb" }));
    app.use(require("cookie-parser")());
    app.use(cors({
        credentials: true,
        
        // origin: "http://3.7.187.183/"  // staging
        // origin: "http://3.108.76.71/"  // production
        origin: 'http://localhost:3000'
        
    }));
    
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xssClean());
    app.use(hpp());
    app.get('/api/v1/products', async(req, res, next) => {
        const products = await Product.find({}); 
        res.json({ status: 'success', data: products }); 
    })
    app.use('/api/v1', require("./routes/OpenPositions/openPositionsAuth"))
    app.use('/api/v1', require("./routes/StockIndex/addStockIndex"))
    app.use('/api/v1', require("./routes/expense/expenseAuth"))
    app.use('/api/v1', require("./routes/user/signedUpUser"))
    app.use('/api/v1', require("./routes/expense/categoryAuth"))
    app.use('/api/v1', require("./routes/setting/settingAuth"))
    app.use('/api/v1', require("./routes/DailyPnlData/dailyPnlDataRoute"))
    app.use('/api/v1/marginxtemplate', require('./routes/marginx/marginxTemplateRoutes'));
    app.use('/api/v1/marginx', require('./routes/marginx/marginxRoutes'));
    app.use('/api/v1/marginxtrade', require('./routes/marginx/marginxTradeRoute'));
    app.use('/api/v1/battletrade', require('./routes/battles/battleTradeRoute'));
    app.use('/api/v1/pageview', require("./routes/pageView/pageView"));
    app.use('/api/v1/affiliate', require("./routes/affiliateProgramme/affiliateRoute"));

    //  TODO toggle
    app.use('/api/v1/contestmaster', require("./routes/DailyContest/contestMaster"));
    app.use('/api/v1', require("./routes/contest/contestRuleRoute"));
    app.use('/api/v1', require("./services/xts/xtsHelper/getPosition"));
    app.use('/api/v1', require("./routes/dbEntry/dbEntryRoute"));
    app.use('/api/v1', require("./PlaceOrder/mainLiveContest"));

    app.use('/api/v1', require("./PlaceOrder/main"));
    app.use('/api/v1', require("./PlaceOrder/switching"));

    app.use('/api/v1', require("./marketData/Margin"));
    app.use('/api/v1', require("./routes/user/userLogin"));
    app.use('/api/v1', require('./routes/TradeData/getUserTrade'));
    app.use('/api/v1', require('./routes/TradeData/getCompanyTrade'));
    app.use('/api/v1', require('./routes/AlgoBox/exchangeMappingAuth'));
    app.use('/api/v1', require('./routes/AlgoBox/instrumentAlgoAuth'));
    app.use('/api/v1', require('./routes/AlgoBox/productMappingAuth'));
    app.use('/api/v1', require('./routes/CronJobsRouter/getHistoryData'));
    app.use('/api/v1', require('./routes/CronJobsRouter/historyTrade'));
    app.use('/api/v1', require('./routes/AlgoBox/tradingAlgoAuth'));
    app.use('/api/v1/dailycontest', require('./routes/DailyContest/dailyContestLiveTrade'));
    app.use('/api/v1/pendingorder', require('./routes/pendingOrder/pendingRoute'));

    app.use('/api/v1', require("./marketData/getRetrieveOrder"));
    app.use('/api/v1', require('./marketData/switchToRealTrade'));
    app.use('/api/v1', require('./services/xts/xtsHelper/xtsMarginDetails'));
    app.use('/api/v1/internbatch', require('./routes/career/internBatchRoute'));
    app.use('/api/v1/gd', require('./routes/career/groupDiscussionRoute'));
    app.use('/api/v1/tutorialcategory', require('./routes/tutorialVideos/tutorialCategory'));
    app.use('/api/v1', require('./routes/instrument/instrumentAuth'));
    app.use('/api/v1', require('./routes/instrument/tradableInstrument'));
    app.use('/api/v1', require('./routes/instrument/addInstrument'));
    app.use('/api/v1', require('./routes/leads/invite'));
    app.use('/api/v1', require('./routes/TradingAccountAuth/accountAuth'));
    app.use('/api/v1', require('./routes/TradingAccountAuth/brokerageAuth'));
    app.use('/api/v1', require('./routes/TradingAccountAuth/parameterAuth'));
    app.use('/api/v1', require('./routes/TradingAccountAuth/requestTokenAuth'));
    app.use('/api/v1', require('./routes/user/userDetailAuth'));
    app.use('/api/v1', require("./routes/user/everyoneRoleAuth"));
    app.use('/api/v1', require("./routes/user/permissionAuth"));
    app.use('/api/v1', require("./routes/mockTrade/mockTradeUserAuth"));
    app.use('/api/v1', require("./routes/mockTrade/mockTradeTrader"));
    app.use('/api/v1', require("./routes/mockTrade/mockTradeCompanyAuth"));
    app.use('/api/v1', require("./routes/mockTrade/otmMockTradeAuth"));
    app.use('/api/v1', require("./models/TradeDetails/retreiveOrderAuth"));
    app.use('/api/v1', require("./routes/HistoryPages/adminAuth"));
    app.use('/api/v1', require("./routes/marginAllocation/marginAllocationAuth"));
    app.use('/api/v1/contest', require("./routes/contest/contestRoutes"));
    app.use('/api/v1/tradingholiday', require("./routes/tradingHoliday/tradingHolidayRoute"));
    app.use('/api/v1/contactus', require("./routes/contactUs/contactRoutes"));
    app.use('/api/v1/batch', require("./routes/stoxheroTrading/batchRoutes"));
    app.use('/api/v1/referrals', require("./routes/campaigns/referralRoutes"));
    app.use('/api/v1/campaign', require("./routes/campaigns/campaignRoute"));
    app.use('/api/v1/contestTrade', require("./routes/contest/contestTradeRoutes"));
    app.use('/api/v1/portfolio', require("./routes/userPortfolio/userPortfolioRoutes"));
    app.use('/api/v1/userwallet', require("./routes/userWallet/userWalletRoutes"));
    app.use('/api/v1/carousels', require("./routes/carousel/carouselRoutes"));
    app.use('/api/v1/paperTrade', require("./routes/mockTrade/paperTrade"));
    app.use('/api/v1/infinityTrade', require("./routes/mockTrade/infinityTrade"));
    app.use('/api/v1/infinityRedis', require("./routes/mockTrade/infinityTradeRedis"));
    app.use('/api/v1/career', require("./routes/career/careerRoute"));
    app.use('/api/v1/tenX', require("./routes/tenXSubscription/tenXRoute"));
    app.use('/api/v1/tenxtrade', require("./routes/mockTrade/tenXTradeRoute"));
    app.use('/api/v1', require("./routes/mockTrade/retreiveOrder"));
    app.use('/api/v1/internship', require("./routes/mockTrade/internshipTradeRoutes"));
    app.use('/api/v1/college', require("./routes/career/collegeRoute"));
    app.use('/api/v1/payment', require("./routes/payment/paymentRoute"));
    app.use('/api/v1/usedMargin', require("./routes/mockTrade/mockMargin"));
    app.use('/api/v1/dailycontest', require("./routes/DailyContest/dailyContestRoutes"))
    app.use('/api/v1/dailycontest/trade', require("./routes/DailyContest/dailyContestTrade"))
    app.use('/api/v1/optionChain', require("./routes/optionChain/optionChainRoute"))
    app.use('/api/v1/brokerreport', require("./routes/BrokerReport/brokerReportRoutes"))
    app.use('/api/v1/contestscoreboard', require("./routes/DailyContest/contestScoreboard"))
    app.use('/api/v1/instrumentpnl', require("./routes/instrumentPNL/instrumentPNL"));
    app.use('/api/v1/analytics', require("./routes/analytics/analytics"));
    app.use('/api/v1/appmetrics', require("./routes/appMetrics/appMetricsRoutes"));
    app.use('/api/v1/newappmetrics', require("./routes/appMetrics/newAppMetricesRoutes"));
    app.use('/api/v1/infinitymining', require("./routes/infinityMining/infinityMiningRoutes"));
    app.use('/api/v1/virtualtradingperformance', require("./routes/performance/virtualTradingRoute"));
    app.use('/api/v1/user', require("./routes/user/userRoutes"));
    app.use('/api/v1/withdrawals', require("./routes/withdrawal/withdrawalRoutes"));
    app.use('/api/v1/KYC', require("./routes/KYCApproval/KYCRoutes"));
    app.use('/api/v1/paymenttest', require("./routes/paymentTest/paymentTestRoutes"));
    app.use('/api/v1/stoxherouserdashboard', require("./routes/StoxHeroDashboard/userAnalytics"));
    app.use('/api/v1/revenue', require("./routes/revenuDashboardRoutes/revenueDashboardRoute"));
    app.use('/api/v1/marginrequired', require("./routes/marginRequired/marginRequired"));
    app.use('/api/v1/userdashboard', require('./routes/UserDashboard/dashboardRoutes'));
    app.use('/api/v1/post', require("./routes/post/postRoutes"));
    app.use('/api/v1/signup', require("./routes/UserRoute/signUpUser"));
    app.use('/api/v1/battles', require("./routes/battles/battleRoutes"));
    app.use('/api/v1/battletemplates', require("./routes/battles/battleTemplateRoutes"));
    app.use('/api/v1/marginxs', require("./routes/marginx/marginxRoutes"));
    app.use('/api/v1/marginxtemplates', require("./routes/marginx/marginxTemplateRoutes"));
    app.use('/api/v1/notifications', require("./routes/notification/notificationRoutes"));
    app.use('/api/v1/coupons', require("./routes/coupon/couponRoutes"));
    app.use('/api/v1/blogs', require("./routes/blog/blogRoutes"));
    app.use('/api/v1/learningmodule', require("./routes/learningModule/learningModuleRoutes"));
    app.use('/api/v1/alltradeview', require("./routes/viewRoutes/allTradesViewRoute"));
    app.use('/api/v1/push', require("./routes/pushNotifications/pushNotificationRoutes"));


    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT);


    if(process.env.CHART === "true"){
        webSocketService.init(io);
    }

    notificationSender().then(()=>{});
}



module.exports = { singleProcess }
