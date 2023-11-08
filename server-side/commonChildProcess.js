const express = require('express');
const app = express();
let { client, setValue } = require("./marketData/redisClient");
const cors = require('cors');
const { setIOValue } = require('./marketData/socketio');
const Setting = require("./models/settings/setting");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const { zerodhaAccountType } = require("./constant")
const Product = require('./models/Product/product');
const { pendingOrderMain } = require("./PlaceStopLossOrder")


async function commonProcess() {
    // await setIOValue();
    client.connect()
        .then(async (res) => {
            // isRedisConnected = true ; 
            setValue(true);
            // await client.SUBSCRIBE("test");
            
            console.log("redis connected", res)
        })
        .catch((err) => {
            // isRedisConnected = false;
            setValue(false);
            console.log("redis not connected", err)
        })

    
    app.use(express.json({ limit: "20kb" }));

    app.use(cors({
        credentials: true,

        // origin: "http://3.7.187.183/"  // staging
        // origin: "http://3.108.76.71/"  // production
        origin: 'http://localhost:3000'

    }));
    app.use(require("cookie-parser")());

    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xssClean());
    app.use(hpp());

    Setting.find()
        .then((res) => {
            // setting = res[0].toggle;
            if (res[0]?.toggle?.ltp == zerodhaAccountType || res[0]?.toggle?.complete == zerodhaAccountType) {
                app.use('/api/v1', require("./marketData/livePrice"));
            } else {
                app.use('/api/v1', require("./services/xts/xtsHelper/xtsLivePrice"));
            }
        })
    app.get('/api/v1/servertime', (req, res, next) => { res.json({ status: 'success', data: new Date() }) })
    app.get('/api/v1/products', async (req, res, next) => {
        const products = await Product.find({});
        res.status(200).json({ status: 'success', data: products });
    })
    app.use('/api/v1', require("./routes/OpenPositions/openPositionsAuth"))
    app.use('/api/v1', require("./routes/StockIndex/addStockIndex"))
    app.use('/api/v1', require("./routes/expense/expenseAuth"))
    app.use('/api/v1', require("./routes/user/signedUpUser"))
    app.use('/api/v1', require("./routes/expense/categoryAuth"))
    app.use('/api/v1', require("./routes/setting/settingAuth"))
    app.use('/api/v1', require("./routes/DailyPnlData/dailyPnlDataRoute"))
    app.use('/api/v1/dailycontest', require('./routes/DailyContest/dailyContestLiveTrade'));
    app.use('/api/v1/marginxtemplate', require('./routes/marginx/marginxTemplateRoutes'));
    app.use('/api/v1/marginx', require('./routes/marginx/marginxRoutes'));
    app.use('/api/v1/marginxtrade', require('./routes/marginx/marginxTradeRoute'));
    app.use('/api/v1/battletrade', require('./routes/battles/battleTradeRoute'));
    app.use('/api/v1/pendingorder', require('./routes/pendingOrder/pendingRoute'));
    app.use('/api/v1/affiliate', require("./routes/affiliateProgramme/affiliateRoute"));

    //  TODO toggle
    app.use('/api/v1/contestmaster', require("./routes/DailyContest/contestMaster"));
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
    app.use('/api/v1/pageview', require("./routes/pageView/pageView"));
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
    app.use('/api/v1', require("./routes/contest/contestRuleRoute"));
    app.use('/api/v1', require("./services/xts/xtsHelper/getPosition"));
    app.use('/api/v1', require("./routes/dbEntry/dbEntryRoute"));
    app.use('/api/v1', require("./PlaceOrder/main"));
    app.use('/api/v1', require("./PlaceOrder/mainLiveContest"));

    app.use('/api/v1', require("./PlaceOrder/switching"));
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
    app.use('/api/v1/alltradeview', require("./routes/viewRoutes/allTradesViewRoute"));

    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT);
    
    await pendingOrderMain();

}

module.exports = { commonProcess }
