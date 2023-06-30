const UserDetails = require('../models/User/userDetailSchema');
const InfinityTrade = require('../models/mock-trade/infinityTrader');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const TradingHoliday = require('../models/TradingHolidays/tradingHolidays');


exports.getTraderStatss = async (req, res) => {
    try {
      const traderId = req.params.id;
      const user = await UserDetails.findOne({ _id: traderId });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const pipeline = [
        { $match: { 'trader': new ObjectId(traderId) } },
        { $addFields: { 
            'gpnl': { $multiply: ['$amount', -1] }, 
            'brokerage_double': { $toDouble: '$brokerage' } 
        }},
        { $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$trade_time' } },
            'total_gpnl': { $sum: '$gpnl' },
            'total_brokerage': { $sum: '$brokerage_double' },
            'number_of_trades': { $sum: 1 }
        }},
        { $addFields: { 
            'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] },
            'profit_day': { $cond: [ { $gt: ['$npnl', 0] }, 1, 0 ] },
            'loss_day': { $cond: [ { $lt: ['$npnl', 0] }, 1, 0 ] }
        }},
        { $sort: { '_id': 1 } },
        { $group: { 
            _id: null,
            'total_gpnl': { $sum: '$total_gpnl' },
            'total_brokerage': { $sum: '$total_brokerage' },
            'total_npnl': { $sum: '$npnl' },
            'max_profit': { $max: '$npnl' },
            'max_loss': { $min: '$npnl' },
            'profit_days': { $sum: '$profit_day' },
            'loss_days': { $sum: '$loss_day' },
            'total_days': { $sum: 1 },
            'trade_data': { $push: { 'date': '$_id', 'npnl': '$npnl' } }
        }}
      ];
  
      const result = await InfinityTrade.aggregate(pipeline);
  
      // Calculate max profit and loss streaks
      let maxProfitStreak = 0;
      let maxLossStreak = 0;
      let currentProfitStreak = 0;
      let currentLossStreak = 0;
  
      for (let trade of result[0].trade_data) {
        if (trade.npnl > 0) {
          currentProfitStreak++;
          currentLossStreak = 0;
          if (currentProfitStreak > maxProfitStreak) {
            maxProfitStreak = currentProfitStreak;
          }
        } else if (trade.npnl < 0) {
          currentLossStreak++;
          currentProfitStreak = 0;
          if (currentLossStreak > maxLossStreak) {
            maxLossStreak = currentLossStreak;
          }
        }
      }
  
      const data = {
        firstName: user.first_name,
        lastName: user.last_name,
        dob: user.dob,
        joiningDate: user.joining_date,
        totalGPNL: result[0].total_gpnl,
        totalBrokerage: result[0].total_brokerage,
        totalNPNL: result[0].total_npnl,
        maxProfit: result[0].max_profit,
        maxLoss: result[0].max_loss,
        profitDays: result[0].profit_days,
        lossDays: result[0].loss_days,
        totalDays: result[0].total_days,
        maxProfitStreak: maxProfitStreak,
        maxLossStreak: maxLossStreak
      };
      console.log(data);
      return res.send(data);
    } catch (error) {
      console.log(error);  
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
exports.getTraderStats = async (req, res) => {
    try {
      const traderId = req.params.id;
      const user = await UserDetails.findOne({ _id: traderId });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const pipeline = [
        { $match: { 'trader': new  ObjectId(traderId), status:'COMPLETE' } },
        { $addFields: { 
            'gpnl': { $multiply: ['$amount', -1] }, 
            'brokerage_double': { $toDouble: '$brokerage' } 
        }},
        { $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$trade_time' } },
            'total_gpnl': { $sum: '$gpnl' },
            'total_brokerage': { $sum: '$brokerage_double' },
            'number_of_trades': { $sum: 1 }
        }},
        { $addFields: { 
            'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] }
        }},
        { $sort: { '_id': 1 } }
      ];
  
      const result = await InfinityTrade.aggregate(pipeline);
  
      // Calculate max profit and loss streaks, profit and loss days and profit and loss values for average and median
      let maxProfitStreak = 0;
      let maxLossStreak = 0;
      let currentProfitStreak = 0;
      let currentLossStreak = 0;
      let profitDays = 0;
      let lossDays = 0;
      let profitValues = [];
      let lossValues = [];
      let totalTrades=0;
  
      for (let trade of result) {
        if (trade.npnl >= 0) {
          currentProfitStreak++;
          profitDays++;
          profitValues.push(trade.npnl);
          currentLossStreak = 0;
          if (currentProfitStreak > maxProfitStreak) {
            maxProfitStreak = currentProfitStreak;
          }
        } else if (trade.npnl < 0) {
          currentLossStreak++;
          lossDays++;
          lossValues.push(trade.npnl);
          currentProfitStreak = 0;
          if (currentLossStreak > maxLossStreak) {
            maxLossStreak = currentLossStreak;
          }
        }
      }
  
      // Calculate average and median
      const averageProfit = profitValues.reduce((a, b) => a + b, 0) / profitValues.length || 0;
      const averageLoss = lossValues.reduce((a, b) => a + b, 0) / lossValues.length || 0;
  
      profitValues.sort((a, b) => a - b);
      lossValues.sort((a, b) => a - b);
  
      const medianProfit = profitValues[Math.floor(profitValues.length / 2)] || 0;
      const medianLoss = lossValues[Math.floor(lossValues.length / 2)] || 0;
      const totalMarketDays = await countTradingDays(user.joining_date.toISOString().substring(0,10))
  
      const data = {
        firstName: user.first_name,
        lastName: user.last_name,
        dob: user.dob,
        joiningDate: user.joining_date,
        totalGPNL: result.reduce((total, trade) => total + trade.total_gpnl, 0),
        totalBrokerage: result.reduce((total, trade) => total + trade.total_brokerage, 0),
        totalNPNL: result.reduce((total, trade) => total + trade.npnl, 0),
        totalTrades: result.reduce((total, trade) => total + trade.number_of_trades, 0),
        maxProfit: Math.max(...profitValues),
        maxLoss: Math.min(...lossValues),
        profitDays: profitDays,
        lossDays: lossDays,
        totalTradingDays: result.length,
        totalMarketDays: totalMarketDays,
        maxProfitStreak: maxProfitStreak,
        maxLossStreak: maxLossStreak,
        averageProfit: averageProfit,
        averageLoss: averageLoss,
        medianProfit: medianProfit,
        medianLoss: medianLoss,
      };
  
      return res.status(200).json({status:'success',data});
    } catch (error) {
      console.log(error);  
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
  
  async function countTradingDays(startDate) {
    let start = moment(startDate);
    let end = moment();

    let count = 0;

    // Fetch all holidays from DB
    const holidays = await TradingHoliday.find({
        holidayDate: { $gte: start.toDate(), $lte: end.toDate() },
        isDeleted: false,
    });
    console.log('holidays', holidays.length);

    // Convert all holiday dates to string format for easy comparison
    const holidayDates = holidays.map(h => moment(h.holidayDate).format('YYYY-MM-DD'));

    for (let m = moment(start); m.isBefore(end); m.add(1, 'days')) {
        if (m.isoWeekday() <= 5 && !holidayDates.includes(m.format('YYYY-MM-DD'))) { // Monday to Friday are considered trading days
            count++;
        }
    }

    return count;
}