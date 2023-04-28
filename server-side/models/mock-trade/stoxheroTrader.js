const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const stoxheroTraderSchema = new mongoose.Schema({

})

const StoxheroTrader = mongoose.model('stoxhero-trade-user', stoxheroTraderSchema);
module.exports = StoxheroTrader;