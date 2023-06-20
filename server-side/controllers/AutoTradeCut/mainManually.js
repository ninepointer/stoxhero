const {tenx, paperTrade, infinityTrade, internship, infinityTradeLive} = require("./collectingTradeManually");

exports.autoCutMainManually = async() => {
    await tenx();
    await paperTrade();
    await internship();
    await infinityTradeLive();
    await infinityTrade();
}