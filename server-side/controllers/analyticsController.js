const PaperTrade = require('../models/mock-trade/paperTrade');

exports.getTraderOverview = async() => {

    let userId = req.user._id;
    let today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    const pastMonth = new Date();
    pastMonth.setMonth(today.getMonth() - 1);
    const pastYear = new Date();
    pastYear.setFullYear(today.getFullYear() - 1);

    let paperTradesOverview = PaperTrade.aggregate([
        {
          $match: {
            userId: userId,
            // Replace with the actual user ID
          },
          
        },
        {
          $group: {
            _id: null,
            grossPNLDaily: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', yesterday], // Filter for past month's data
                  },
                  '$amount',
                  0,
                ],
              }, // Calculate gross PNL as sum of amount for today's date
            },
            brokerageSumDaily: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', "2023-02-16 09:42:42"], // Filter for past month's data
                  },
                  {$sum:{$toDouble:'$brokerage'}},
                  0,
                ],
              }, // Calculate brokerage sum as sum of brokerage for today's date
            },
            grossPNLMonthly: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', "2023-01-16 09:42:42"] // Filter for past month's data
                  },
                  '$amount',
                  0,
                ],
              },
            },
            brokerageSumMonthly: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', "2022-11-16 09:42:42"], // Filter for past month's data
                  },
                   {$sum:{$toDouble:'$brokerage'}},
                  0,
                ],
              },
            },
            grossPNLYearly: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', "2021-11-16 09:42:42"], // Filter for past year's data
                  },
                  '$amount',
                  0,
                ],
              },
            },
            brokerageSumYearly: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$trade_time', "2021-11-16 09:42:42"], // Filter for past year's data
                  },
                   {$sum:{$toDouble:'$brokerage'}},
                  0,
                ],
              },
            },
            grossPNLLifetime: {
              $sum: '$amount', // Calculate gross PNL as sum of amount for all-time data
            },
            brokerageSumLifetime: {
               $sum:{$toDouble:'$brokerage'}, // Calculate brokerage sum as sum of brokerage for all-time data
            },
          },
        },
        {
          $project: {
            _id: 0,
            grossPNLDaily: 1,
            brokerageSumDaily: 1,
            netPNLDaily: {
              $subtract: ['$grossPNLDaily', '$brokerageSumDaily'], // Calculate net PNL as sum of gross PNL and brokerage sum for today's date data
            },
            grossPNLMonthly: 1,
            brokerageSumMonthly: 1,
            netPNLMonthly: {
              $subtract: ['$grossPNLMonthly', '$brokerageSumMonthly'], // Calculate net PNL as sum of gross PNL and brokerage sum for past month data
            },
            grossPNLYearly: 1,
            brokerageSumYearly: 1,
            netPNLYearly: {
              $subtract: ['$grossPNLYearly', '$brokerageSumYearly'], // Calculate net PNL as sum of gross PNL and brokerage sum for past year data
            },
            grossPNLLifetime: 1,
            brokerageSumLifetime: 1,
            netPNLLifetime: {
              $subtract: ['$grossPNLLifetime', '$brokerageSumLifetime'], // Calculate net PNL as sum of gross PNL and brokerage sum for lifetime data
            },
          },
        }
        ]);
}