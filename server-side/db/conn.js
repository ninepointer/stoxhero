const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

// STAGINGDB
const DB = process.env.DATABASE;
const devDB = process.env.DEVDATABASE;
const stagingDB = process.env.STAGINGDB;


    // mongoose.connect(devDB, {
        //  mongoose.connect(DB, {
        mongoose.connect(stagingDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    
}).then(()=>{
    console.log("connection secure");
}).catch((err)=>{
    console.log(err);
    console.log("no connection");
})



// [
//     {
//       $match:

//         {
//           _id: ObjectId("645cc7162f0bba5a7a3ff40a"),
//         },
//     },
//     {
//       $unwind: {
//         path: "$users",
//       },
//     },
//     {
//       $lookup: {
//         from: "tenx-trade-users",
//         localField: "users.userId",
//         foreignField: "trader",
//         as: "trade",
//       },
//     },
//     {
//       $match: {
//         "users.status": "Expired",
//       },
//     },
//     {
//       $unwind: {
//         path: "$trade",
//       },
//     },
//     {
//       $match: {
//         "trade.status": "COMPLETE",
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 "$users.subscribedOn",
//                 "$trade.trade_time",
//               ],
//             },
//             {
//               $gte: [
//                 "$users.expiredOn",
//                 "$trade.trade_time",
//               ],
//             },
//           ],
//         },
//       },
//     },
//     {
//       $group:
//         {
//           _id: {
//             startDate: "$users.subscribedOn",
//             endDate: "$users.expiredOn",
//             userId: "$trade.trader",
//           },
//           amount: {
//             $sum: {
//               $multiply: ["$trade.amount", -1],
//             },
//           },
//           brokerage: {
//             $sum: {
//               $toDouble: "$trade.brokerage",
//             },
//           },
//           trades: {
//             $count: {},
//           },
//           tradingDays: {
//             $addToSet: {
//               $dateToString: {
//                 format: "%Y-%m-%d",
//                 date: "$trade.trade_time",
//               },
//             },
//           },
//         },
//     },
//     {
//       $lookup: {
//         from: "user-personal-details",
//         localField: "_id.userId",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     {
//       $project:

//         {
//           startDate: "$_id.startDate",
//           enddate: "$_id.endDate",
//           userId: "$_id.userId",
//           _id: 0,
//           npnl: {
//             $subtract: ["$amount", "$brokerage"],
//           },
//           tradingDays: {
//             $size: "$tradingDays",
//           },
//           trades: 1,
//           payout: {
//             $divide: [
//               {
//                 $multiply: [
//                   {
//                     $subtract: [
//                       "$amount",
//                       "$brokerage",
//                     ],
//                   },
//                   10,
//                 ],
//               },
//               100,
//             ],
//           },
//           name: {
//             $concat: [
//               {
//                 $arrayElemAt: [
//                   "$user.first_name",
//                   0,
//                 ],
//               },
//               " ",
//               {
//                 $arrayElemAt: [
//                   "$user.last_name",
//                   0,
//                 ],
//               },
//             ],
//           },
//         },
//     },
//   ]


// [
//     {
//       $match:
  
//         {
//           _id: ObjectId("645cc7162f0bba5a7a3ff40a"),
//         },
//     },
//     {
//       $unwind: {
//         path: "$users",
//       },
//     },
//     {
//       $lookup: {
//         from: "tenx-trade-users",
//         localField: "users.userId",
//         foreignField: "trader",
//         as: "trade",
//       },
//     },
//     {
//       $match: {
//         "users.status": "Live",
//       },
//     },
//     {
//       $unwind: {
//         path: "$trade",
//       },
//     },
//     {
//       $match: {
//         "trade.status": "COMPLETE",
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 "$users.subscribedOn",
//                 "$trade.trade_time",
//               ],
//             },
//             {
//               $gte: [
//                 new Date("2023-08-01"),
//                 "$trade.trade_time",
//               ],
//             },
//           ],
//         },
//       },
//     },
//     {
//       $group:
//         /**
//          * _id: The id of the group.
//          * fieldN: The first field name.
//          */
//         {
//           _id: {
//             startDate: "$users.subscribedOn",
//             endDate: "$users.expiredOn",
//             userId: "$trade.trader",
//             validity: "$validity",
//             profitCap: "$profitCap",
//           },
//           amount: {
//             $sum: {
//               $multiply: ["$trade.amount", -1],
//             },
//           },
//           brokerage: {
//             $sum: {
//               $toDouble: "$trade.brokerage",
//             },
//           },
//           trades: {
//             $count: {},
//           },
//           tradingDays: {
//             $addToSet: {
//               $dateToString: {
//                 format: "%Y-%m-%d",
//                 date: "$trade.trade_time",
//               },
//             },
//           },
//         },
//     },
//     {
//       $lookup: {
//         from: "user-personal-details",
//         localField: "_id.userId",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     {
//       $project:
//         /**
//          * specifications: The fields to
//          *   include or exclude.
//          */
//         {
//           startDate: "$_id.startDate",
//           enddate: "$_id.endDate",
//           userId: "$_id.userId",
//           _id: 0,
//           npnl: {
//             $subtract: ["$amount", "$brokerage"],
//           },
//           tradingDays: {
//             $size: "$tradingDays",
//           },
//           trades: 1,
//           payout: {
//             $min: [
//               {
//                 $divide: [
//                   {
//                     $multiply: [
//                       {
//                         $subtract: [
//                           "$amount",
//                           "$brokerage",
//                         ],
//                       },
//                       "$_id.validity",
//                     ],
//                   },
//                   {
//                     $size: "$tradingDays",
//                   },
//                 ],
//               },
//               "$_id.profitCap",
//             ],
//           },
//           name: {
//             $concat: [
//               {
//                 $arrayElemAt: [
//                   "$user.first_name",
//                   0,
//                 ],
//               },
//               " ",
//               {
//                 $arrayElemAt: [
//                   "$user.last_name",
//                   0,
//                 ],
//               },
//             ],
//           },
//         },
//     },
//   ]