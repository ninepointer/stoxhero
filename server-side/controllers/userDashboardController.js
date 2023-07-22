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
const InfinityTrader = require('../models/mock-trade/infinityTrader');
const DailyContest = require('../models/DailyContest/dailyContest');

exports.getDashboardStats = async (req, res, next) => {
    try{

        const {timeframe, tradeType} = req.query;
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
        //   firstName: user.first_name,
        //   lastName: user.last_name,
        //   dob: user.dob,
        //   joiningDate: user.joining_date,
          totalGPNL: result.reduce((total, trade) => total + trade.total_gpnl, 0),
          totalBrokerage: result.reduce((total, trade) => total + trade.total_brokerage, 0),
          totalNPNL: result.reduce((total, trade) => total + trade.npnl, 0),
          totalTrades: result.reduce((total, trade) => total + trade.number_of_trades, 0),
          maxProfit: maxProfitDay ? maxProfitDay.npnl : null,
          maxProfitDay: maxProfitDay ? maxProfitDay._id : null,
        //   maxProfitIndex: maxProfitIndex,
          maxLoss: maxLossDay ? maxLossDay.npnl : null,
          maxLossDay: maxLossDay ? maxLossDay._id : null,
        //   maxLossIndex: maxLossIndex,
          profitDays: profitDays,
          lossDays: lossDays,
          totalTradingDays: result.length,
          totalMarketDays: totalMarketDays,
          maxProfitStreak: maxProfitStreak,
          maxLossStreak: maxLossStreak,
          averageProfit: averageProfit,
          averageLoss: averageLoss,
          portfolio: portfolio?.portfolioValue??0,
        //   medianProfit: medianProfit,
        //   medianLoss: medianLoss,
          maxProfitDayProfitPercent: maxProfitDay?.npnl/maxProfitOpeningBalance *100,
          maxLossDayLossPercent: Math.abs(maxLossDay?.npnl/maxLossOpeningBalance) *100
        };
    
        return res.status(200).json({status:'success',data});

    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }    


}

exports.getDashboardStatsContest = async (req, res,next) => {
  try{
    let startDate, endDate;
    const {timeframe} = req.query;
    const userId = req.user._id;
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
    const result = await ContestTrade.aggregate([
      {
        $match: {
          status: "COMPLETE",
          trader: new ObjectId(
            userId
          ),
          trade_time: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            trade_time: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$trade_time",
              },
            },
            contestId: "$contestId",
          },
          total_gpnl: {
            $sum: {
              $multiply: ["$amount", -1],
            },
          },
          total_brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          number_of_trades: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          npnl: {
            $subtract: [
              "$total_gpnl",
              "$total_brokerage",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "daily-contests",
          localField: "_id.contestId",
          foreignField: "_id",
          as: "contestDetails",
        },
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "contestDetails.portfolio",
          foreignField: "_id",
          as: "portfolioDetails",
        },
      },
      {
        $project: {
          date: "$_id.trade_time",
          contest: {
            $arrayElemAt: [
              "$contestDetails.contestName",
              0,
            ],
          },
          contestPayOut: {
            $arrayElemAt: [
              "$contestDetails.payoutPercentage",
              0,
            ],
          },
          npnl: "$npnl",
          portfolio: {
            $arrayElemAt: [
              "$portfolioDetails.portfolioValue",
              0,
            ],
          },
        },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            _id: 1,
          },
      },
    ])
    const contests = await DailyContest.countDocuments({contestEndTime:{$lte: endDate.toDate(), $gte: startDate.toDate()}});
    console.log('result', result.length, contests);
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
    profitValues.sort((a, b) => a - b);
    lossValues.sort((a, b) => a - b);
    // console.log(profitValues, lossValues)
    const data = {
    //   firstName: user.first_name,
    //   lastName: user.last_name,
    //   dob: user.dob,
    //   joiningDate: user.joining_date,
      totalNPNL: result.reduce((total, trade) => total + trade.npnl, 0),
      maxProfit: maxProfitDay ? maxProfitDay.npnl : null,
    //   maxProfitIndex: maxProfitIndex,
      maxLoss: maxLossDay ? maxLossDay.npnl : null,
    //   maxLossIndex: maxLossIndex,
      profitDays: profitDays,
      lossDays: lossDays,
      maxProfitStreak: maxProfitStreak,
      maxLossStreak: maxLossStreak,
      averageProfit: averageProfit,
      averageLoss: averageLoss,
      portfolio: result?.reduce((acc, item)=>acc+item.portfolio, 0)??0,
    }
    return res.status(200).json({status:'success',data});
  }catch(e){
    console.log(e);
    res.status(500).json({status:'error', message:'Something went wrong'});
  }
}
exports.getDashboardStatsTenX = async (req, res,next) => {
  try{
    let startDate, endDate;
    const {timeframe} = req.query;
    const userId = req.user._id;
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
    const result = await TenXTrade.aggregate([
      {
        $match: {
          status: "COMPLETE",
          trader: new ObjectId(
            userId
          ),
          trade_time: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            trade_time: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$trade_time",
              },
            },
            subscriptionId: "$subscriptionId",
          },
          total_gpnl: {
            $sum: {
              $multiply: ["$amount", -1],
            },
          },
          total_brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          number_of_trades: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          npnl: {
            $subtract: [
              "$total_gpnl",
              "$total_brokerage",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "tenx-subscriptions",
          localField: "_id.subscriptionId",
          foreignField: "_id",
          as: "tenx",
        },
      },
      {
        $lookup: {
          from: "user-portfolios",
          localField: "tenx.portfolio",
          foreignField: "_id",
          as: "portfolioDetails",
        },
      },
      {
        $project: {
          date: "$_id.trade_time",
          contest: {
            $arrayElemAt: [
              "$tenx.subscriptionName",
              0,
            ],
          },
          npnl: "$npnl",
          portfolio: {
            $arrayElemAt: [
              "$portfolioDetails.portfolioValue",
              0,
            ],
          },
        },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            _id: 1,
          },
      },
    ])
    const contests = await DailyContest.countDocuments({contestEndTime:{$lte: endDate.toDate(), $gte: startDate.toDate()}});
    console.log('result', result, contests);
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
    profitValues.sort((a, b) => a - b);
    lossValues.sort((a, b) => a - b);
    // console.log(profitValues, lossValues)
    const data = {
    //   firstName: user.first_name,
    //   lastName: user.last_name,
    //   dob: user.dob,
    //   joiningDate: user.joining_date,
      totalNPNL: result.reduce((total, trade) => total + trade.npnl, 0),
      maxProfit: maxProfitDay ? maxProfitDay.npnl : null,
    //   maxProfitIndex: maxProfitIndex,
      maxLoss: maxLossDay ? maxLossDay.npnl : null,
    //   maxLossIndex: maxLossIndex,
      profitDays: profitDays,
      lossDays: lossDays,
      maxProfitStreak: maxProfitStreak,
      maxLossStreak: maxLossStreak,
      averageProfit: averageProfit,
      averageLoss: averageLoss,
      portfolio: result?.reduce((acc, item)=>acc+item.portfolio, 0)??0,
    }
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

exports.getUserSummary = async(req,res,next) => {
    try{
        const userId = req.user._id;
        let endDate = new Date().getHours()>=10?
        moment().subtract(1, 'days'):moment();
        const virtualData = await VirtualTrade.aggregate([
            {
                $match: {
                  trade_time: {
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
                _id: null,
                'total_gpnl': { $sum: '$gpnl' },
                'total_brokerage': { $sum: '$brokerage_double' },
                'number_of_trades': { $sum: 1 },
                'portfolio': { $first: '$portfolioId' },
            }},
            { $addFields: { 
                'npnl': { $subtract: [ '$total_gpnl', '$total_brokerage' ] }
            }},
        ]);

        const tenxData = await TenXTrade.aggregate([
          {
            $match: {
              status: "COMPLETE",
              trader: new ObjectId(
                userId
              ),
              trade_time: {
                $lte: endDate.toDate(),
              },
            },
          },
          {
            $group: {
              _id: {
                trade_time: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$trade_time",
                  },
                },
                subscriptionId: "$subscriptionId",
              },
              total_gpnl: {
                $sum: {
                  $multiply: ["$amount", -1],
                },
              },
              total_brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              number_of_trades: {
                $sum: 1,
              },
            },
          },
          {
            $addFields: {
              npnl: {
                $subtract: [
                  "$total_gpnl",
                  "$total_brokerage",
                ],
              },
            },
          },
          {
            $lookup: {
              from: "tenx-subscriptions",
              localField: "_id.subscriptionId",
              foreignField: "_id",
              as: "tenx",
            },
          },
          {
            $lookup: {
              from: "user-portfolios",
              localField: "tenx.portfolio",
              foreignField: "_id",
              as: "portfolioDetails",
            },
          },
          {
            $project: {
              date: "$_id.trade_time",
              contest: {
                $arrayElemAt: [
                  "$tenx.subscriptionName",
                  0,
                ],
              },
              npnl: "$npnl",
              portfolio: {
                $arrayElemAt: [
                  "$portfolioDetails.portfolioValue",
                  0,
                ],
              },
            },
          },
          {
            $sort:
              /**
               * Provide any number of field/order pairs.
               */
              {
                _id: 1,
              },
          },
        ]);
        let tenxReturn = tenxData.map((item)=>item.npnl/item.portfolio)
        .reduce((acc, current, index, arr) => {
          return acc + (current - acc) / (index + 1);
      }, 0); 
        console.log('tenX return', tenxReturn);
        const contestData = await ContestTrade.aggregate([
          [
            {
              $match: {
                status: "COMPLETE",
                trader: new ObjectId(
                  userId
                ),
                trade_time: {
                  $lte: endDate.toDate(),
                },
              },
            },
            {
              $group: {
                _id: {
                  trade_time: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$trade_time",
                    },
                  },
                  contestId: "$contestId",
                },
                total_gpnl: {
                  $sum: {
                    $multiply: ["$amount", -1],
                  },
                },
                total_brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                number_of_trades: {
                  $sum: 1,
                },
              },
            },
            {
              $addFields: {
                npnl: {
                  $subtract: [
                    "$total_gpnl",
                    "$total_brokerage",
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "daily-contests",
                localField: "_id.contestId",
                foreignField: "_id",
                as: "contestDetails",
              },
            },
            {
              $lookup: {
                from: "user-portfolios",
                localField: "contestDetails.portfolio",
                foreignField: "_id",
                as: "portfolioDetails",
              },
            },
            {
              $project: {
                date: "$_id.trade_time",
                contest: {
                  $arrayElemAt: [
                    "$contestDetails.contestName",
                    0,
                  ],
                },
                contestPayOut: {
                  $arrayElemAt: [
                    "$contestDetails.payoutPercentage",
                    0,
                  ],
                },
                npnl: "$npnl",
                portfolio: {
                  $arrayElemAt: [
                    "$portfolioDetails.portfolioValue",
                    0,
                  ],
                },
              },
            },
            {
              $sort:
                /**
                 * Provide any number of field/order pairs.
                 */
                {
                  _id: 1,
                },
            },
          ]
        ]);
        console.log('contest data', contestData);
        let contestReturn = contestData.map((item)=>item.npnl/item.portfolio)
        .reduce((acc, current, index, arr) => {
          return acc + (current - acc) / (index + 1);
      }, 0);
        console.log('contest return', contestReturn);
        
        
      // console.log('contest data',contestData);      
        const user = await UserDetails.findById(userId).populate({
            path: 'subscription.subscriptionId',  // populate 'subscriptionId'
            model: 'tenx-subscription', 
            select:'portfolio', // specify model for 'subscriptionId'
            populate: {  // nested populate for 'portfolio' in 'subscriptionId'
                path: 'portfolio',
                model: 'user-portfolio',
                select: 'portfolioValue'  // specify the field you want to include
            }
        }).select('subscriptions');
        let totalTenXPortfolioValue = user.subscription.reduce((total, subscription) => {
            return total + subscription.subscriptionId.portfolio.portfolioValue;
          }, 0);
        // console.log('user data', virtualData, tenxData, contestData, user);
        res.status(200).json({status:'success', data:{totalTenXPortfolioValue, tenxData: tenxData[0]??{}, virtualData:virtualData[0]??{}, contestReturn, tenxReturn}});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getExpectedPnl = async(req,res,next) => {
  try{
    const {start, end, tradeType} = req.query;
    let startDate, endDate, Model;
    switch (tradeType) {
      case 'virtual':
        Model = VirtualTrade
        break;
      case 'tenX':
        Model = TenXTrade
        break;
      case 'contest':
        Model = ContestTrade
        break;
      default:
        return res.status(400).send({ error: 'Invalid trade type'});
    }
    new Date().getHours>=10?endDate=new Date():endDate=new Date(new Date().setDate(new Date().getDate()-1))
    const traderId = req.user._id;
    const pipeline = [
      { $match: { 'trader': new  ObjectId(traderId), status:'COMPLETE', trade_time:{$lt: new Date(endDate.toISOString().substring(0,10))} } },
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

  let tradeData = await Model.aggregate(pipeline);
  
  // Second query: go over each day and calculate the cumulative average npnl until that day
  // let cumulativeNpnl = 0;
  //   let sumPositiveNpnl = 0;
  //   let sumNegativeNpnl = 0;
  //   let countPositiveNpnl = 0;
  //   let countNegativeNpnl = 0;
  //   let riskRewardRatio = 0;

  //   for (let i = 0; i < tradeData.length; i++) {
  //     if (i == 0) {
  //         tradeData[i].expected_pnl = 0;
  //     } else {
  //         tradeData[i].expected_pnl = cumulativeNpnl / i;
  //         tradeData[i].riskRewardRatio = riskRewardRatio; // assign previous day's riskRewardRatio
  //     }

  //     cumulativeNpnl += tradeData[i].npnl;

  //     if (tradeData[i].npnl > 0) {
  //         sumPositiveNpnl += tradeData[i].npnl;
  //         countPositiveNpnl += 1;
  //     } else if (tradeData[i].npnl < 0) {
  //         sumNegativeNpnl += tradeData[i].npnl;
  //         countNegativeNpnl += 1;
  //     }

  //     if (i > 0) {
  //         const avgPositiveNpnl = countPositiveNpnl > 0 ? sumPositiveNpnl/ countPositiveNpnl : 0;
  //         const avgNegativeNpnl = countNegativeNpnl > 0 ? sumNegativeNpnl/ countNegativeNpnl : 0;
  //         riskRewardRatio = avgNegativeNpnl !== 0 ? avgPositiveNpnl / Math.abs(avgNegativeNpnl) : 0;
  //     }
  // }
  let cumulativeNpnl = 0;
    let sumPositiveNpnl = 0;
    let sumNegativeNpnl = 0;
    let countPositiveNpnl = 0;
    let countNegativeNpnl = 0;
    let riskRewardRatio = 0;

    for (let i = 0; i < tradeData.length; i++) {
        if (i == 0) {
            tradeData[i].expected_pnl = 0;
            tradeData[i].expected_avg_profit = 0;
            tradeData[i].expected_avg_loss = 0;
        } else {
            tradeData[i].expected_pnl = cumulativeNpnl / i;
            tradeData[i].expected_avg_profit = countPositiveNpnl > 0 ? sumPositiveNpnl / countPositiveNpnl : 0;
            tradeData[i].expected_avg_loss = countNegativeNpnl > 0 ? sumNegativeNpnl / countNegativeNpnl : 0;
            tradeData[i].riskRewardRatio = riskRewardRatio; // assign previous day's riskRewardRatio
        }

        cumulativeNpnl += tradeData[i].npnl;

        if (tradeData[i].npnl > 0) {
            sumPositiveNpnl += tradeData[i].npnl;
            countPositiveNpnl += 1;
        } else if (tradeData[i].npnl < 0) {
            sumNegativeNpnl += tradeData[i].npnl;
            countNegativeNpnl += 1;
        }

        if (i > 0) {
            const avgPositiveNpnl = countPositiveNpnl > 0 ? sumPositiveNpnl / countPositiveNpnl : 0;
            const avgNegativeNpnl = countNegativeNpnl > 0 ? sumNegativeNpnl / countNegativeNpnl : 0;
            riskRewardRatio = avgNegativeNpnl !== 0 ? avgPositiveNpnl / Math.abs(avgNegativeNpnl) : 0;
        }
    }

    // For the last day, set the riskRewardRatio, expected_avg_profit, and expected_avg_loss
    if (tradeData.length > 0) {
        tradeData[tradeData.length - 1].riskRewardRatio = riskRewardRatio;
        tradeData[tradeData.length - 1].expected_avg_profit = countPositiveNpnl > 0 ? sumPositiveNpnl / countPositiveNpnl : 0;
        tradeData[tradeData.length - 1].expected_avg_loss = countNegativeNpnl > 0 ? sumNegativeNpnl / countNegativeNpnl : 0;
    }


  // For the last day, set the riskRewardRatio
  if (tradeData.length > 0) {
      tradeData[tradeData.length - 1].riskRewardRatio = riskRewardRatio;
  }

  res.status(200).json({status:'success', data: tradeData});
  }catch(e){
    console.log(e);
    res.status(200).json({status:'error', message:'Something went wrong'});
  }
}