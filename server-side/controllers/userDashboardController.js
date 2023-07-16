const UserDetails = require('../models/User/userDetailSchema');
const VirtualTrade = require('../models/mock-trade/paperTrade');
const TenXTrade = require('../models/mock-trade/tenXTraderSchema');
const ContestTrade = require('../models/DailyContest/dailyContestMockUser');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const TradingHoliday = require('../models/TradingHolidays/tradingHolidays');
const Margin = require('../models/marginAllocation/marginAllocationSchema');
const liveTradeDetails = require('../models/TradeDetails/infinityLiveUser');
const Portfolio = require('../models/userPortfolio/UserPortfolio'); 

exports.getDashboardStats = async (req, res, next) => {
    try{

        const {timeframe, tradeType} = req.body;
        let startDate, endDate, Model;
        const userId = req.user._id;
        const user = await UserDetails.findById(userId);
      // Determine the start and end dates based on the timeframe
      switch (timeframe) {
        case 'this month':
          startDate = moment().startOf('month');
          new Date().getHours()>=10?
          endDate = moment().subtract(1, 'days'):
          endDate = moment();
          break;
        case 'last month':
          startDate = moment().subtract(1, 'months').startOf('month');
          endDate = moment().subtract(1, 'months').endOf('month');
          break;
        case 'previous to last month':
          startDate = moment().subtract(2, 'months').startOf('month');
          endDate = moment().subtract(2, 'months').endOf('month');
          break;
        case 'lifetime':
          startDate = moment(user?.joining_date.toISOString().substring(0,10)) // set to a date far in the past
          endDate = moment().subtract(1, 'days').startOf('day'); // set to current date
          break;
        default:
          return res.status(400).send({ error: 'Invalid timeframe' });
      }
     
      // Choose the model based on the type
      let result;
      switch (tradeType) {
        case 'virtual':
          Model = VirtualTrade;
          result = await Model.aggregate([
            {
                $match: {
                  trade_time: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                  },
                  trader: new ObjectId(userId),
                  status:'COMPLETE'
                },
              },
              { $addFields: { 
                'gpnl': { $multiply: ['$amount', -1] }, 
                'brokerage_double': { $toDouble: '$brokerage' } 
            }},
            { $group: { 
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$trade_time' } },
                'total_gpnl': { $sum: '$gpnl' },
                'total_brokerage': { $sum: '$brokerage_double' },
                'number_of_trades': { $sum: 1 },
                'portfolio': { $first: '$portfolioId' },
            }},
            { $addFields: { 
                'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] }
            }},
            { $sort: { '_id': 1 } }
          ]);
          break;
        case 'tenX':
          Model = TenXTrade;
          result = await Model.aggregate([
            {
                $match: {
                  trade_time: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                  },
                  status:'COMPLETE',
                  trader: new ObjectId(userId)
                },
              },
              {
                $lookup: {
                    from: "tenx-subscriptions", // replace with actual collection name in the database
                    localField: "subscriptionId",
                    foreignField: "_id",
                    as: "subscription"
                }
            },
            {
                $unwind: {
                    path: "$subscription",
                    preserveNullAndEmptyArrays: true // keep those documents which have no matching documents in from collection
                }
            },
              { $addFields: { 
                'gpnl': { $multiply: ['$amount', -1] }, 
                'brokerage_double': { $toDouble: '$brokerage' } 
            }},
            { $group: { 
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$trade_time' } },
                'total_gpnl': { $sum: '$gpnl' },
                'total_brokerage': { $sum: '$brokerage_double' },
                'number_of_trades': { $sum: 1 },
                'portfolio': { $first: '$subscription.portfolio'},
            }},
            { $addFields: { 
                'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] }
            }},
            { $sort: { '_id': 1 } }
          ]);
          break;
        case 'contest':
          Model = ContestTrade;
          result = await Model.aggregate([
            {
                $match: {
                  trade_time: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                  },
                  trader: new ObjectId(userId),
                  status:'COMPLETE'
                },
              },
              {
                $lookup: {
                    from: "daily-contests", // replace with actual collection name in the database
                    localField: "contestId",
                    foreignField: "_id",
                    as: "contest"
                }
            },
            {
                $unwind: {
                    path: "$contest",
                    preserveNullAndEmptyArrays: true // keep those documents which have no matching documents in from collection
                }
            },
              { $addFields: { 
                'gpnl': { $multiply: ['$amount', -1] }, 
                'brokerage_double': { $toDouble: '$brokerage' } 
            }},
            { $group: { 
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$trade_time' } },
                'total_gpnl': { $sum: '$gpnl' },
                'total_brokerage': { $sum: '$brokerage_double' },
                'number_of_trades': { $sum: 1 },
                'portfolio': { $first: '$contest.portfolio' },
            }},
            { $addFields: { 
                'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] }
            }},
            { $sort: { '_id': 1 } }
          ]);
          break;
        default:
          return res.status(400).send({ error: 'Invalid type' });
      }
    
      console.log('result', result);
    
      let maxProfitStreak = 0;
        let maxLossStreak = 0;
        let currentProfitStreak = 0;
        let currentLossStreak = 0;
        let profitDays = 0;
        let lossDays = 0;
        let profitValues = [];
        let lossValues = [];
        let maxProfitDay = null;
        let maxProfitIndex = null;
        let maxLossDay = null;
        let maxLossIndex = null;
    
        for (let i = 0; i < result.length; i++) {
          let trade = result[i];
          if (trade.npnl >= 0) {
            currentProfitStreak++;
            profitDays++;
            profitValues.push(trade.npnl);
            currentLossStreak = 0;
            if (currentProfitStreak > maxProfitStreak) {
              maxProfitStreak = currentProfitStreak;
            }
            if (maxProfitDay === null || trade.npnl > maxProfitDay.npnl) {
              maxProfitDay = trade;
              maxProfitIndex = i;
            }
          } else if (trade.npnl < 0) {
            currentLossStreak++;
            lossDays++;
            lossValues.push(trade.npnl);
            currentProfitStreak = 0;
            if (currentLossStreak > maxLossStreak) {
              maxLossStreak = currentLossStreak;
            }
            if (maxLossDay === null || trade.npnl < maxLossDay.npnl) {
              maxLossDay = trade;
              maxLossIndex = i;
            }
          }
        }
    
        const averageProfit = profitValues.reduce((a, b) => a + b, 0) / profitValues.length || 0;
        const averageLoss = lossValues.reduce((a, b) => a + b, 0) / lossValues.length || 0;
        const portfolio = await Portfolio.findById(result[result.length - 1]?.portfolio);
        console.log('portfolio', portfolio, result[result.length-1]);
        profitValues.sort((a, b) => a - b);
        lossValues.sort((a, b) => a - b);
        // console.log(profitValues, lossValues)
        let totalMarketDays = await countTradingDays(startDate, endDate)
        const medianProfit = 
        profitValues?.length%2 === 0 ? (profitValues[Math.floor(profitValues.length / 2)] + profitValues[Math.floor((profitValues.length / 2)-1)])/2 : profitValues[Math.floor(profitValues.length / 2)];
        const medianLoss =
        lossValues.length%2 === 0 ? (lossValues[Math.floor(lossValues.length / 2)] + lossValues[Math.floor((lossValues.length / 2)-1)])/2 : lossValues[Math.floor(lossValues.length / 2)];
        const maxProfitOpeningBalance =  maxProfitIndex != 0?portfolio?.portfolioValue??0+result[maxProfitIndex-1]?.npnl:portfolio?.portfolioValue??0+result[maxProfitIndex]?.npnl;
        const maxLossOpeningBalance = maxLossIndex != 0?portfolio?.portfolioValue??0+result[maxLossIndex-1]?.npnl:portfolio.portfolioValue??0+result[maxLossIndex];
        console.log(maxProfitOpeningBalance, maxLossOpeningBalance, maxProfitIndex);
        const data = {
          firstName: user.first_name,
          lastName: user.last_name,
          dob: user.dob,
          joiningDate: user.joining_date,
          totalGPNL: result.reduce((total, trade) => total + trade.total_gpnl, 0),
          totalBrokerage: result.reduce((total, trade) => total + trade.total_brokerage, 0),
          totalNPNL: result.reduce((total, trade) => total + trade.npnl, 0),
          totalTrades: result.reduce((total, trade) => total + trade.number_of_trades, 0),
          maxProfit: maxProfitDay ? maxProfitDay.npnl : null,
          maxProfitDay: maxProfitDay ? maxProfitDay._id : null,
          maxProfitIndex: maxProfitIndex,
          maxLoss: maxLossDay ? maxLossDay.npnl : null,
          maxLossDay: maxLossDay ? maxLossDay._id : null,
          maxLossIndex: maxLossIndex,
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
          maxProfitDayProfitPercent: maxProfitDay?.npnl/maxProfitOpeningBalance *100,
          maxLossDayLossPercent: Math.abs(maxLossDay?.npnl/maxLossOpeningBalance) *100
        };
    
        return res.status(200).json({status:'success',data});

    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }    


}

async function countTradingDays(startDate, endDate) {
    let start = moment(startDate);
    let end = moment(endDate);

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