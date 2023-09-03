const express = require("express");
const router = express.Router({mergeParams: true});
const {liveTotalTradersCount, overallDailyContestTraderPnl, overallDailyContestCompanySidePnlThisMonth,
    overallPnlTrader, myTodaysTrade, getMyPnlAndCreditData, getRedisMyRankHTTP,overallDailyContestCompanySidePnlLifetime,
    myPnlAndPayout, overallDailyContestPnlYesterday, DailyContestPayoutChart,
    liveTotalTradersCountYesterday, traderWiseMockCompanySide, DailyContestPnlTWiseTraderSide,
    DailyContestPnlTWise, traderWiseMockTraderSide, myAllOrder } = require('../../controllers/marginX/marginxTradeController');

const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');


// router.route('/payoutchart').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPayoutChart)
// router.route('/overalltraderpnltoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestTraderPnl)
// router.route('/overalltraderpnlyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestPnlYesterday)
// router.route('/overalltraderpnlthismonth').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlThisMonth)
// router.route('/overalltraderpnllifetime').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), overallDailyContestCompanySidePnlLifetime)
// router.route('/liveandtotaltradercounttoday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCount)
// router.route('/liveandtotaltradercountyesterday').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), liveTotalTradersCountYesterday)
// router.route('/allcontestPnl').get(Authenticate, myPnlAndPayout);

router.route('/:id/traderWisePnl').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockCompanySide)
router.route('/:id/traderWisePnlTside').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), traderWiseMockTraderSide)
// router.route('/:id/traderwisecompanypnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWise)
// router.route('/:id/traderwisetraderpnlreport').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), DailyContestPnlTWiseTraderSide)

router.route('/:id/pnl').get(Authenticate, overallPnlTrader);
router.route('/:id/my/todayorders').get(Authenticate, myTodaysTrade)
router.route('/:id/my/allorders').get(Authenticate, myAllOrder)

router.route('/:id/myPnlandCreditData').get(Authenticate, getMyPnlAndCreditData)



module.exports=router;



// [
//   {
//     $match:
//       /**
//        * query: The query in MQL.
//        */
//       {
//         status: "COMPLETE",
//         trader: ObjectId(
//           "63971eec2ca5ce5b52f900b7"
//         ),
//       },
//   },
//   {
//     $group:
//       /**
//        * _id: The id of the group.
//        * fieldN: The first field name.
//        */
//       {
//         _id: {
//           marginxId: "$marginxId",
//         },
//         amount: {
//           $sum: {
//             $multiply: ["$amount", -1],
//           },
//         },
//         brokerage: {
//           $sum: {
//             $toDouble: "$brokerage",
//           },
//         },
//       },
//   },
//   {
//     $project:
//       /**
//        * specifications: The fields to
//        *   include or exclude.
//        */
//       {
//         marginxId: "$_id.marginxId",
//         _id: 0,
//         npnl: {
//           $subtract: ["$amount", "$brokerage"],
//         },
//       },
//   },
//   {
//     $lookup: {
//       from: "marginxes",
//       localField: "marginxId",
//       foreignField: "_id",
//       as: "marginx",
//     },
//   },
//   {
//     $lookup:
//       /**
//        * from: The target collection.
//        * localField: The local join field.
//        * foreignField: The target join field.
//        * as: The name for the results.
//        * pipeline: Optional pipeline to run on the foreign collection.
//        * let: Optional variables to use in the pipeline field stages.
//        */
//       {
//         from: "marginx-templates",
//         localField: "marginx.marginXTemplate",
//         foreignField: "_id",
//         as: "templates",
//       },
//   },
//   {
//     $project:
//       /**
//        * specifications: The fields to
//        *   include or exclude.
//        */
//       {
//         marginxId: "$marginxId",
//         npnl: "$npnl",
//         portfolioValue: {
//           $arrayElemAt: [
//             "$templates.portfolioValue",
//             0,
//           ],
//         },
//         entryFee: {
//           $arrayElemAt: [
//             "$templates.entryFee",
//             0,
//           ],
//         },
//         startDate: {
//           $arrayElemAt: ["$marginx.startTime", 0],
//         },
//         endDate: {
//           $arrayElemAt: ["$marginx.endTime", 0],
//         },
//       },
//   },
// ]