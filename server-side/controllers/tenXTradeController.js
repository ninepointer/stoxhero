const TenXTrader = require("../models/mock-trade/tenXTraderSchema");
const Portfolio = require("../models/userPortfolio/UserPortfolio");
const Subscription = require("../models/TenXSubscription/TenXSubscriptionSchema")
const client = require('../marketData/redisClient');
const { ObjectId } = require("mongodb");

exports.overallPnl = async (req, res, next) => {
    
    const userId = req.user._id;
    const subscriptionId = req.params.id;
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    todayDate = todayDate + "T00:00:00.000Z";
    const today = new Date(todayDate);

    let tempTodayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    tempTodayDate = tempTodayDate + "T23:59:59.999Z";
    const tempDate = new Date(tempTodayDate);
    const secondsRemaining = Math.round((tempDate.getTime() - date.getTime()) / 1000);


    try{

      if(await client.exists(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)){
        let pnl = await client.get(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`)
        pnl = JSON.parse(pnl);
        // console.log("pnl redis", pnl)
        
        res.status(201).json({message: "pnl received", data: pnl});

      } else{

        let pnlDetails = await TenXTrader.aggregate([
          {
              $match: {
                  trade_time:{
                      $gte: today
                  },
                  status: "COMPLETE",
                  trader: new ObjectId(userId),
                  subscription: subscriptionId 
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
        await client.set(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, JSON.stringify(pnlDetails))
        await client.expire(`${req.user._id.toString()}${subscriptionId.toString()}: overallpnlTenXTrader`, secondsRemaining);

        res.status(201).json({message: "pnl received", data: pnlDetails});
      }

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }


}

exports.myTodaysTrade = async (req, res, next) => {
  
  // const id = req.params.id
//   const subscriptionId = req.params.id;
  const userId = req.user._id;
  let date = new Date();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({trader: userId, trade_time: {$gte:today}})
  console.log("Under my today orders",userId, today)
  try {
    const myTodaysTrade = await TenXTrader.find({trader: userId, trade_time: {$gte:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myTodaysTrade)
    res.status(200).json({status: 'success', data: myTodaysTrade, count:count});
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
  const limit = parseInt(req.query.limit) || 10
  const count = await TenXTrader.countDocuments({trader: userId, trade_time: {$lt:today}})
  console.log("Under my today orders",userId, today)
  try {
    const myHistoryTrade = await TenXTrader.find({trader: userId, trade_time: {$lt:today}}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1, 'trade_time':1,'order_id':1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(myHistoryTrade)
    res.status(200).json({status: 'success', data: myHistoryTrade, count:count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.marginDetail = async (req, res, next) => {
  let subscriptionId = req.body.id;
  let date = new Date();

  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  todayDate = todayDate + "T00:00:00.000Z";
  const today = new Date(todayDate);
  // console.log(userId, today)

  try {
    const subscription = await Subscription.aggregate([
        {
            $match: {
                status: "Active",
                _id: subscriptionId
            },
        },
        {
            $lookup: {
                status: "Active",
                _id: subscriptionId
            },
        }
    ])



    const portfoliosFund = await Portfolio.aggregate([
      {
        $match: {
          status: "Active",
          "users.userId": new ObjectId(req.user._id),
          portfolioType: "Virtual Trading"
        },
      },
      {
        $group: {
          _id: {
             valueSum : {$sum: "$portfolioValue"},
             name: "$portfolioName"
          }
        }
      },
      {
        $project: {
          totalFund: "$_id",
          _id: 0
        }
      }
    ])

    let pnlDetails = await TenXTrader.aggregate([
        {
            $match: {
                trade_time:{
                    $lt: today
                },
                status: "COMPLETE",
                trader: new ObjectId(req.user._id)
            },
        },
        {
          $group: {
            _id: {
              trader: "$trader",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },

          },
        },

        {
          $project: {
            _id: 0,
            npnl: {
              $subtract: ["$amount", "$brokerage"]
             },
          }
        },
    ])

    console.log("pnlDetails", pnlDetails, portfoliosFund)
    res.status(200).json({status: 'success', data: {totalCredit: portfoliosFund[0], lifetimePnl: pnlDetails[0]}});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

// exports.openingBalance = async (req, res, next) => {
//     let date = new Date();
//     let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
//     todayDate = todayDate + "T00:00:00.000Z";
//     const today = new Date(todayDate);
//     console.log(req.user._id)
//     const subscriptionId = req.params.id;

//     let myPnlAndCreditData = await Subscription.aggregate([
//         {
//             $match:{
//                 status: "Active",
//                 _id: subscriptionId
//             }
//         },
//         {
//           $lookup: {
//             from: "user-personal-details",
//             localField: "trader",
//             foreignField: "_id",
//             as: "result",
//           },
//         },
//         {
//           $match: {
//           status : "COMPLETE",
//           trader: new ObjectId(req.user._id),
//           trade_time: {$lt:today}
//           }
//         },
//         {
//           $group: {
//             _id: {
//               // trader: "$trader",
//               // employeeId: {
//               //   $arrayElemAt: ["$result.employeeid", 0],
//               // },
//               funds: {
//                 $arrayElemAt: ["$result.fund", 0],
//               },
//             },
//             gpnl: {
//               $sum: {
//                 $multiply: ["$amount", -1],
//               },
//             },
//             brokerage: {
//               $sum: {
//                 $toDouble: "$brokerage",
//               },
//             },
//           },
//         },
//         {
//           $addFields:
//             {
//               npnl: {
//                 $subtract: ["$gpnl", "$brokerage"],
//               },
//               availableMargin : {
//                 $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
//               }
//             },
//         },
//         {
//           $project:
//             {
//               _id: 0,
//               // userId: "$_id.userId",
//               // employeeId: "$_id.employeeId",
//               totalCredit: "$_id.funds",
//               gpnl: "$gpnl",
//               brokerage: "$brokerage",
//               npnl: "$npnl",
//               availableMargin: "$availableMargin"
//             },
//         },
//         {
//           $sort : {npnl : 1}
//         }
//       ])


//     let myPnlAndCreditData = await InfinityTrader.aggregate([
//       {
//         $lookup: {
//           from: "user-personal-details",
//           localField: "trader",
//           foreignField: "_id",
//           as: "result",
//         },
//       },
//       {
//         $match: {
//         status : "COMPLETE",
//         trader: new ObjectId(req.user._id),
//         trade_time: {$lt:today}
//         }
//       },
//       {
//         $group: {
//           _id: {
//             // trader: "$trader",
//             // employeeId: {
//             //   $arrayElemAt: ["$result.employeeid", 0],
//             // },
//             funds: {
//               $arrayElemAt: ["$result.fund", 0],
//             },
//           },
//           gpnl: {
//             $sum: {
//               $multiply: ["$amount", -1],
//             },
//           },
//           brokerage: {
//             $sum: {
//               $toDouble: "$brokerage",
//             },
//           },
//         },
//       },
//       {
//         $addFields:
//           {
//             npnl: {
//               $subtract: ["$gpnl", "$brokerage"],
//             },
//             availableMargin : {
//               $add : ["$_id.funds", {$subtract :["$gpnl", "$brokerage"]}]
//             }
//           },
//       },
//       {
//         $project:
//           {
//             _id: 0,
//             // userId: "$_id.userId",
//             // employeeId: "$_id.employeeId",
//             totalCredit: "$_id.funds",
//             gpnl: "$gpnl",
//             brokerage: "$brokerage",
//             npnl: "$npnl",
//             availableMargin: "$availableMargin"
//           },
//       },
//       {
//         $sort : {npnl : 1}
//       }
//     ])
  
//     console.log("myPnlAndCreditData", myPnlAndCreditData)
  
//     res.status(201).json({message: "data received", data: myPnlAndCreditData[0]});
//   }

