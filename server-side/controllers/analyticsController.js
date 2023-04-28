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

    let paperTradesOverview = await PaperTrade.aggregate([
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
                  {
                    $multiply: ["$amount", -1],
                    },
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
                  '$brokerage',
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
                  {
                    $multiply: ["$amount", -1],
                    },
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
                   '$brokerage',
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
                  {
                    $multiply: ["$amount", -1],
                    },
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
                   '$brokerage',
                  0,
                ],
              },
            },
            grossPNLLifetime: {
              $sum: {
                $multiply: ["$amount", -1],
                }, // Calculate gross PNL as sum of amount for all-time data
            },
            brokerageSumLifetime: {
               $sum:'$brokerage', // Calculate brokerage sum as sum of brokerage for all-time data
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

    res.status(200).json({status:'success', data: paperTradesOverview});    

}

exports.getDateWiseStats = async(req, res)=>{
    const {traderId} = req.params;
    const{to, from} = req.query;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await PaperTrade.aggregate([
        { $match: { trade_time: {$gte : from, $lte : to}, trader: traderId, status: "COMPLETE"} },
        
        { $group: { _id: null,
                    buyOrSell: "$buyOrSell",
                    date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $multiply: ["$amount", -1],
                    },       
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: "$brokerage"
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    noOfTrade: {
                        $count: {}
                        // average_price: "$average_price"
                    },
                    }},{
                        $project:{
                            _id: 0,
                            date: 1,
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {_id: -1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
}