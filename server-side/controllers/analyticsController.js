const PaperTrade = require('../models/mock-trade/paperTrade');
const InfinityTrade = require('../models/mock-trade/infinityTrader');
const TraderDailyPnlData = require('../models/InstrumentHistoricalData/TraderDailyPnlDataSchema');
const StoxHeroTrade = require('../models/mock-trade/stoxheroTrader');

exports.getPaperTradesOverview = async(req,res,next) => {

    let userId = req.params.id;
    let today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const pastYear = new Date(today.getFullYear(), 0, 1);
    

    let paperTradesOverview = await PaperTrade.aggregate([
        {
          $match: {
            trader: userId,
            trade_time:{$lte: today}
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
                    $gte: ['$trade_time', yesterday], // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth] // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth], // Filter for past month's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
        console.log(paperTradesOverview);

    res.status(200).json({status:'success', data: paperTradesOverview});    

}

exports.getPaperTradesDateWiseStats = async(req, res)=>{
    const {id} = req.params;
    const{to, from} = req.query;
    let date = new Date();
    const fromDate = new Date(from);
    fromDate.setHours(0,0,0,0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    
    let pnlDetails = await PaperTrade.aggregate([
        { $match: { trade_time: {$gte : fromDate, $lte : toDate}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 10 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {date: 1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(200).json({status:'success', data: pnlDetails});
 
}

exports.setCurrentUser = async(req,res,next) => {
    req.params.id = req.user._id;
    next();
}

exports.getPaperTradesDailyPnlData = async(req,res,next) => {
    const {id} = req.params;
    let today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    //console.log("Select Date in the API: "+selectDate,traderName)
    const pipeline = [
        {$match: {
          trade_time : {$gte : yesterday, $lte : today},
          trader: id,
        }
        },
        {
          $project: {
            date: {
                $dateToString: {
                    format: "%Y-%m-%d %H:%M:%S",
                    date: {
                        $convert: {
                            input: "$timestamp",
                            to: "date"
                        }
                    }
                }
            },
            calculatedGpnl: 1,
            noOfTrades: 1,
            traderName: 1,
        }
        },
        {
          $group: {
            _id: {date : "$date", traderName : "$traderName"},
            
            pnl: {
              $sum: "$calculatedGpnl"
            },
            trades: {
              $sum: "$noOfTrades"
            },
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
         ]
       
       let x = await TraderDailyPnlData.aggregate(pipeline)
    
       res.status(200).json({status:'success',data:x});
}

exports.getPaperTradesMonthlyPnlData= async(req,res,next) => {
    const {id} = req.params;
    const today = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(today.getFullYear()-1);
    console.log(pastYear,today);
    let pnlDetails = await PaperTrade.aggregate([
        { $match: { trade_time: {$gte : pastYear, $lte : today}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 7 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {date: 1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(200).json({status: 'success', data: pnlDetails});

}

exports.getInfinityTradesOverview = async(req,res,next) => {

    let userId = req.params.id;
    let today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const pastYear = new Date(today.getFullYear(), 0, 1);
    

    let infinityTradesOverview = await InfinityTrade.aggregate([
        {
          $match: {
            trader: userId,
            // trade_time:{$lte: today},
            status: "COMPLETE"
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
                    $gte: ['$trade_time', yesterday], // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth] // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth], // Filter for past month's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
               $sum: '$brokerage', // Calculate brokerage sum as sum of brokerage for all-time data
            },
            count: {
              $sum: 1
            }
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
            count: 1
          },
        }
    ]);
        // console.log(infinityTradesOverview);

    res.status(200).json({status:'success', data: infinityTradesOverview});    

}

exports.getStoxHeroTradesOverview = async(req,res,next) => {

    let userId = req.params.id;
    let today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    const pastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const pastYear = new Date(today.getFullYear(), 0, 1);
    

    let stoxHeroTradesOverview = await StoxHeroTrade.aggregate([
        {
          $match: {
            trader: userId,
            // trade_time:{$lte: today},
            status: "COMPLETE"
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
                    $gte: ['$trade_time', yesterday], // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth] // Filter for past month's data
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
                    $gte: ['$trade_time', pastMonth], // Filter for past month's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
                    $gte: ['$trade_time', pastYear], // Filter for past year's data
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
        // console.log(infinityTradesOverview);

    res.status(200).json({status:'success', data: stoxHeroTradesOverview});    

}

exports.getInfinityTradesDateWiseStats = async(req, res)=>{
    const {id} = req.params;
    const{to, from} = req.query;
    let date = new Date();
    const fromDate = new Date(from);
    fromDate.setHours(0,0,0,0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    
    let pnlDetails = await InfinityTrade.aggregate([
        { $match: { trade_time: {$gte : fromDate, $lte : toDate}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 10 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {date: 1}},
    ])
            
                // console.log(pnlDetails)

        res.status(200).json({status:'success', data: pnlDetails});
 
}

exports.getStoxHeroTradesDateWiseStats = async(req, res)=>{
    const {id} = req.params;
    const{to, from} = req.query;
    let date = new Date();
    const fromDate = new Date(from);
    fromDate.setHours(0,0,0,0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    
    let pnlDetails = await StoxHeroTrade.aggregate([
        { $match: { trade_time: {$gte : fromDate, $lte : toDate}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 10 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                    count: {
                      $sum: 1
                    }
                    }},{
                        $project:{
                            _id: 0,
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1,
                            count: 1
                        }
                    },
             { $sort: {date: 1}},
            ])
            
                console.log(pnlDetails)

        res.status(200).json({status:'success', data: pnlDetails});
 
}

exports.getInfinityTradesMonthlyPnlData= async(req,res,next) => {
    const {id} = req.params;
    const today = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(today.getFullYear()-1);
    console.log(pastYear,today);
    let pnlDetails = await InfinityTrade.aggregate([
        { $match: { trade_time: {$gte : pastYear, $lte : today}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 7 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {date: 1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(200).json({status: 'success', data: pnlDetails});

}

exports.getStoxHeroTradesMonthlyPnlData= async(req,res,next) => {
    const {id} = req.params;
    const today = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(today.getFullYear()-1);
    console.log(pastYear,today);
    let pnlDetails = await StoxHeroTrade.aggregate([
        { $match: { trade_time: {$gte : pastYear, $lte : today}, trader: id, status: "COMPLETE"} },
        
        { $group: {_id: {
            "date": {$substr: [ "$trade_time", 0, 7 ]},
           },
                    // buyOrSell: "$buyOrSell",
                    // date: {$substr:["$trade_time", 0, 10]},
                    gpnl:{
                        $sum:{$multiply: ["$amount", -1]},
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
                            date: '$_id.date',
                            gpnl: 1,
                            brokerage: 1,
                            npnl: {
                                $subtract:["$gpnl", "$brokerage"]
                            },
                            lots: 1,
                            noOfTrade: 1
                        }
                    },
             { $sort: {date: 1}},
            ])
            
                // //console.log(pnlDetails)

        res.status(200).json({status: 'success', data: pnlDetails});

}