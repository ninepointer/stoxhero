const InfinityTrader = require("../models/mock-trade/infinityTrader");
const InfinityTraderCompany = require("../models/mock-trade/infinityTradeCompany");
const { ObjectId } = require("mongodb");
const client = require('../marketData/redisClient');


exports.overallPnlTrader = async (req, res, next) => {
    
    const userId = req.user._id;
    // const userId = new ObjectId('642cedb5a7aa9b00ba1e4866');
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    tempTodayDate = tempTodayDate + "T23:59:59.999Z";
    const tempDate = new Date(tempTodayDate);
    const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);


    try{

      if(await client.exists(`${req.user._id.toString()} overallpnl`)){
        let pnl = await client.get(`${req.user._id.toString()} overallpnl`)
        pnl = JSON.parse(pnl);
        // console.log("pnl redis", pnl)
        
        res.status(201).json({message: "pnl received", data: pnl});

      } else{

        let pnlDetails = await InfinityTrader.aggregate([
          {
              $match: {
                  trade_time:{
                      $gte: today
                  },
                  status: "COMPLETE",
                  trader: new ObjectId(userId)
              },
          },
          {
            $group: {
              _id: {
                symbol: "$symbol",
                product: "$Product",
                instrumentToken: "$instrumentToken",
                exchange: "$exchange"
              },
              amount: {
                $sum: {$multiply : ["$amount",-1]},
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
              lastaverageprice: {
                $last: "$average_price",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])
        // console.log("pnlDetails in else", pnlDetails)
        await client.set(`${req.user._id.toString()} overallpnl`, JSON.stringify(pnlDetails))
        await client.expire(`${req.user._id.toString()} overallpnl`, secondsRemaining);

        // console.log("pnlDetails", pnlDetails)
        res.status(201).json({message: "pnl received", data: pnlDetails});
      }

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }


}

exports.overallPnlCompanySide = async (req, res, next) => {
    
  const userId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  console.log(userId, today)
  let pnlDetails = await InfinityTraderCompany.aggregate([
      {
          $match: {
              trade_time:{
                  $gte: today
              },
              status: "COMPLETE",
              trader: new ObjectId(userId)
          },
      },
      {
        $group: {
          _id: {
            symbol: "$symbol",
            product: "$Product",
            instrumentToken: "$instrumentToken",
            exchange: "$exchange"
          },
          amount: {
            $sum: {$multiply : ["$amount",-1]},
          },
          brokerage: {
            $sum: {
              $toDouble: "$brokerage",
            },
          },
          lots: {
            $sum: {
              $toInt: "$Quantity",
            },
          },
          lastaverageprice: {
            $last: "$average_price",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
  ])
  res.status(201).json({message: "pnl received", data: pnlDetails});
}


exports.myTodaysTrade = async (req, res, next) => {
  
  // const id = req.params.id
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await InfinityTrader.countDocuments({trader: new ObjectId(userId), trade_time: {$gte:today}})
  // console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InfinityTrader.find({trader: new ObjectId(userId), trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.myAllTodaysTrade = async (req, res, next) => {
  
  // const id = req.params.id
  const userId = req.params.id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await InfinityTrader.find({trader: new ObjectId(userId), trade_time: {$gte:today}})
      .populate('trader', 'name')
      .select('symbol buyOrSell Product Quantity amount status average_price trade_time order_id brokerage trader')
      .sort({_id: -1})
    // console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.myHistoryTrade = async (req, res, next) => {
  
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5
  const count = await InfinityTrader.countDocuments({trader: userId, trade_time: {$lt:today}})
  console.log("Under history orders",skip, limit)
  try {
    const myHistoryTrade = await InfinityTrader.find({trader: new ObjectId(userId), trade_time: {$lt:today}}, {'symbol':1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    // console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.getPnlAndCreditData = async (req, res, next) => {
  
  let pnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
      status : "COMPLETE" 
      }
    },
    {
      $group: {
        _id: {
          trader: "$trader",
          employeeId: {
            $arrayElemAt: ["$result.employeeid", 0],
          },
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
        {
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
          }
        },
    },
    {
      $project:
        {
          _id: 0,
          // userId: "$_id.userId",
          employeeId: "$_id.employeeId",
          totalCredit: "$_id.funds",
          gpnl: "$gpnl",
          brokerage: "$brokerage",
          npnl: "$npnl",
          availableMargin: "$availableMargin"
        },
    },
    {
      $sort : {npnl : 1}
    }
  ])

  res.status(201).json({message: "data received", data: pnlAndCreditData});
}

exports.getMyPnlAndCreditData = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);

  let myPnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
      status : "COMPLETE",
      trader: new ObjectId(req.user._id),
      trade_time: {
          $lt: today
        }
      }
    },
    {
      $group: {
        _id: {
          // trader: "$trader",
          // employeeId: {
          //   $arrayElemAt: ["$result.employeeid", 0],
          // },
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
        {
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
          }
        },
    },
    {
      $project:
        {
          _id: 0,
          // userId: "$_id.userId",
          // employeeId: "$_id.employeeId",
          totalFund: "$_id.funds",
          gpnl: "$gpnl",
          brokerage: "$brokerage",
          npnl: "$npnl",
          openingBalance: "$availableMargin"
        },
    },
    {
      $sort : {npnl : 1}
    }
  ])

  if(myPnlAndCreditData.length > 0){
    res.status(201).json({message: "data received", data: myPnlAndCreditData[0]});
  } else{
    let fundDetail = await InfinityTrader.aggregate([
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "result",
        },
      },
      // {
      //   $match: {
      //   status : "COMPLETE",
      //   trader: new ObjectId(req.user._id),
      //   trade_time: {
      //       $lt: today
      //     }
      //   }
      // },
      {
        $group: {
          _id: {
            // trader: "$trader",
            // employeeId: {
            //   $arrayElemAt: ["$result.employeeid", 0],
            // },
            funds: {
              $arrayElemAt: ["$result.fund", 0],
            },
          },
          // gpnl: {
          //   $sum: {
          //     $multiply: ["$amount", -1],
          //   },
          // },
          // brokerage: {
          //   $sum: {
          //     $toDouble: "$brokerage",
          //   },
          // },
        },
      },
      // {
      //   $addFields:
      //     {
      //       npnl: {
      //         $subtract: ["$gpnl", "$brokerage"],
      //       },
      //       availableMargin : {
      //         $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
      //       }
      //     },
      // },
      {
        $project:
          {
            _id: 0,
            // userId: "$_id.userId",
            // employeeId: "$_id.employeeId",
            totalCredit: "$_id.funds",
            // gpnl: "$gpnl",
            // brokerage: "$brokerage",
            // npnl: "$npnl",
            // availableMargin: "$availableMargin"
          },
      },
      // {
      //   $sort : {npnl : 1}
      // }
    ])
    res.status(201).json({message: "data received", data: fundDetail[0]});
  }

  
}

exports.openingBalance = async (req, res, next) => {
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  console.log(req.user._id)
  let myPnlAndCreditData = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
      status : "COMPLETE",
      trader: new ObjectId(req.user._id),
      trade_time: {$lt:today}
      }
    },
    {
      $group: {
        _id: {
          // trader: "$trader",
          // employeeId: {
          //   $arrayElemAt: ["$result.employeeid", 0],
          // },
          funds: {
            $arrayElemAt: ["$result.fund", 0],
          },
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        brokerage: {
          $sum: {
            $toDouble: "$brokerage",
          },
        },
      },
    },
    {
      $addFields:
        {
          npnl: {
            $subtract: ["$gpnl", "$brokerage"],
          },
          availableMargin : {
            $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
          }
        },
    },
    {
      $project:
        {
          _id: 0,
          // userId: "$_id.userId",
          // employeeId: "$_id.employeeId",
          totalCredit: "$_id.funds",
          gpnl: "$gpnl",
          brokerage: "$brokerage",
          npnl: "$npnl",
          availableMargin: "$availableMargin"
        },
    },
    {
      $sort : {npnl : 1}
    }
  ])

  console.log("myPnlAndCreditData", myPnlAndCreditData)

  res.status(201).json({message: "data received", data: myPnlAndCreditData[0]});
}

exports.batchWisePnl = async (req, res, next) => {

  let batchwisepnl = await InfinityTrader.aggregate([
    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "zyx",
      },
    },
    {
      $project: {
        designation: {
          $arrayElemAt: ["$zyx.designation", 0],
        },
        dojWeekNumber: {
          $week: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        BatchYear: {
          $year: {
            $toDate: {
              $arrayElemAt: [
                "$zyx.joining_date",
                0,
              ],
            },
          },
        },
        weekNumber: {
          $week: {
            $toDate: "$trade_time",
          },
        },
        Year: {
          $year: {
            $toDate: "$trade_time",
          },
        },
        doj: {
          $arrayElemAt: ["$zyx.joining_date", 0],
        },
        trader: "$createdBy",
        amount: "$amount",
        lots: "$Quantity",
        date: "$trade_time",
        status: "$status",
        userId: "$userId",
        email: {
          $arrayElemAt: ["$zyx.email", 0],
        },
      },
    },
    {
      $match: {
        status: "COMPLETE",
        designation: "Equity Trader",
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$dojWeekNumber",
          BatchYear: "$BatchYear",
          WeekNumber: "$weekNumber",
          Year: "$Year",
        },
        gpnl: {
          $sum: {
            $multiply: ["$amount", -1],
          },
        },
        count: {
          $push: "$userId",
        },
      },
    },
    {
      $group: {
        _id: {
          BatchWeek: "$_id.BatchWeek",
          BatchYear: "$_id.BatchYear",
          WeekNumber: "$_id.WeekNumber",
          Year: "$_id.Year",
          gpnl: "$gpnl",
        },
        noOfTraders: {
          $sum: {
            $size: {
              $setUnion: "$count",
            },
          },
        },
      },
    },
    {
      $sort: {
        "_id.Year": 1,
        "_id.WeekNumber": 1,
        "_id.BatchYear": 1,
        "_id.Batch": 1,
      },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          Batch: {
            $add: [
              {
                $toInt: "$_id.BatchWeek",
              },
              {
                $toInt: "$_id.BatchYear",
              },
            ],
          },
        },
    },
  ])

  res.status(201).json({message: "data received", data: batchwisepnl});
}

exports.companyDailyPnlTWise = async (req, res, next) => {

  let {startDate,endDate} = req.params
  // let date = new Date();
  // const days = date.getDay();
  // let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  //console.log("Today "+todayDate)
  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";
  console.log("startDate", startDate,endDate )
  let pipeline = [ 

                  {
                    $lookup: {
                      from: "user-personal-details",
                      localField: "trader",
                      foreignField: "_id",
                      as: "zyx",
                    },
                  },
    
                  {$match: {
                      trade_time : {$gte : new Date(startDate), $lte : new Date(endDate)},
                      status : "COMPLETE" 
                  }
                      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                  },
                  { $group :
                          { _id: "$zyx.name",
                          gpnl: {
                            $sum: {$multiply : ["$amount",-1]}
                          },
                          brokerage : {
                            $sum: {$toDouble : "$brokerage"}
                          },
                          trades : {
                            $count : {}
                          },
                  }
              },
              { $addFields: 
                  {
                      npnl: {$subtract : ["$gpnl" , "$brokerage"]}
                  }
                  },
              { $sort :
                  { npnl: -1 }
              }
              ]

  let x = await InfinityTraderCompany.aggregate(pipeline)

      // res.status(201).json(x);

  res.status(201).json({message: "data received", data: x});
}

exports.companyPnlReport = async (req, res, next) => {

  let {startDate,endDate} = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


  let pipeline = [ {$match: {
                trade_time : {$gte : new Date(startDate), $lte : new Date(endDate)},
                status : "COMPLETE" 
            }
                // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
            },
            { $group :
                    { _id: {
                        "date": {$substr: [ "$trade_time", 0, 10 ]},
                    },
            gpnl: {
                $sum: {$multiply : ["$amount",-1]}
            },
            brokerage: {
                $sum: {$toDouble : "$brokerage"}
            },
            trades: {
                $count: {}
            },
            }
        },
        { $addFields: 
            {
            npnl : { $subtract : ["$gpnl","$brokerage"]},
            dayOfWeek : {$dayOfWeek : { $toDate : "$_id.date"}}
            }
            },
        { $sort :
            { _id : 1 }
        }
        ]

  let x = await InfinityTraderCompany.aggregate(pipeline)

      // res.status(201).json(x);

  res.status(201).json({message: "data received", data: x});
}

exports.traderPnlTWise = async (req, res, next) => {

  let {startDate,endDate} = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


  let pipeline = [ 
    
      {
        $lookup: {
          from: "user-personal-details",
          localField: "trader",
          foreignField: "_id",
          as: "user",
        },
      },
      {
      $match: {
        trade_time : {$gte : new Date(startDate), $lte : new Date(endDate)},
        status : "COMPLETE" 
      }
          // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
      },
      { $group :
              { _id: "$user.name",
              gpnl: {
                $sum: {$multiply : ["$amount",-1]}
              },
              brokerage : {
                $sum: {$toDouble : "$brokerage"}
              },
              trades : {
                $count : {}
              },
      }
      },
      { $addFields: 
      {
          npnl: {$subtract : ["$gpnl" , "$brokerage"]}
      }
      },
      { $sort :
      { npnl: -1 }
      }
      ]

  let x = await InfinityTrader.aggregate(pipeline)

      // res.status(201).json(x);

  res.status(201).json({message: "data received", data: x});
}

exports.traderMatrixPnl = async (req, res, next) => {

  let {startDate,endDate} = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


      let pipeline = [ 
    
        {
          $lookup: {
            from: "user-personal-details",
            localField: "trader",
            foreignField: "_id",
            as: "user",
          },
        },
        {
        $match: {
          trade_time : {$gte : new Date(startDate), $lte : new Date(endDate)},
          status : "COMPLETE" 
        }
            // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
        },
        { $group :
                { _id: { createdBy : "$user.name", trade_time : {$substr : ["$trade_time",0,10]}},

                gpnl: {
                  $sum: {$multiply : ["$amount",-1]}
                },
                brokerage : {
                  $sum: {$toDouble : "$brokerage"}
                },
                trades : {
                  $count : {}
                },
              }
          },
          { $addFields: 
              {
                  npnl: {$subtract : ["$gpnl" , "$brokerage"]}
              }
              },
          { $sort :
              { gpnl: -1 }
          }
        ]

  let x = await InfinityTraderCompany.aggregate(pipeline)

      // res.status(201).json(x);

  res.status(201).json({message: "data received", data: x});
}

exports.traderwiseReport = async (req, res, next) => {

  let {startDate,endDate} = req.params

  startDate = startDate + "T00:00:00.000Z";
  endDate = endDate + "T23:59:59.000Z";


  let pipeline = [ 

    {
      $lookup: {
        from: "user-personal-details",
        localField: "trader",
        foreignField: "_id",
        as: "user",
      },
    },
    {
    $match: {
      trade_time : {$gte : new Date(startDate), $lte : new Date(endDate)},
      status : "COMPLETE" 
    }
        // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
    },
    { $group :
            { _id: { createdBy : "$user.name", trade_time : {$substr : ["$trade_time",0,10]}},

            gpnl: {
              $sum: {$multiply : ["$amount",-1]}
            },
            brokerage : {
              $sum: {$toDouble : "$brokerage"}
            },
            trades : {
              $count : {}
            },
          }
      },
      { $addFields: 
          {
              npnl: {$subtract : ["$gpnl" , "$brokerage"]}
          }
          },
      { $sort :
          { gpnl: -1 }
      }
  ]

  let x = await InfinityTraderCompany.aggregate(pipeline)
  res.status(201).json({message: "data received", data: x});
}