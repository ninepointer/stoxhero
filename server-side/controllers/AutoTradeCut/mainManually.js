const {tenx, paperTrade, infinityTrade, internship} = require("./collectingTradeManually");

exports.autoCutMainManually = async() => {
    await tenx();
    await paperTrade();
    await infinityTrade();
    await internship();
}