const express = require("express");
const router = express.Router();
const UserSignUp = require('../../models/User/signedUpUser');
const CareerApplication = require('../../models/Careers/careerApplicationSchema');
const PaperTrade = require('../../models/mock-trade/paperTrade');
const InternshipTrade = require('../../models/mock-trade/internshipTrade');
const TenxTrade= require('../../models/mock-trade/tenXTraderSchema');
const Withdrawal= require('../../models/withdrawal/withdrawal')
const Contest = require('../../models/DailyContest/dailyContest')
const TenX = require('../../models/TenXSubscription/TenXSubscriptionSchema')
const MarginX = require('../../models/marginX/marginX')
const Internship = require('../../models/Careers/internBatch')

router.get('/', async(req,res,next)=>{
    const userSignUps = await UserSignUp.countDocuments();
    const careerApplications = await CareerApplication.countDocuments();

    const virtualTradeVolume = await PaperTrade.aggregate([
        {
            $group:{
                _id:null,
                lots:{
                    $sum:{$abs:"$Quantity"}
                },
                amount:{
                    $sum:{$abs:"$amount"}
                },
                trades:{
                    $sum: 1
                }
            }
        }
    ]);
    const internshipTradeVolume = await InternshipTrade.aggregate([
        {
            $group:{
                _id:null,
                lots:{
                    $sum:{$abs:"$Quantity"}
                },
                amount:{
                    $sum:{$abs:"$amount"}
                },
                trades:{
                    $sum: 1
                }
            }
        }
    ]);
    const tenxTradeVolume = await TenxTrade.aggregate([
        {
            $group:{
                _id:null,
                lots:{
                    $sum:{$abs:"$Quantity"}
                },
                amount:{
                    $sum:{$abs:"$amount"}
                },
                trades:{
                    $sum: 1
                }
            }
        }
    ]);
    const withdrawals = await Withdrawal.aggregate([
        {
            $match: {
              withdrawalStatus: "Processed",
            },
          },
          {
            $group: {
              _id: null,
              withdrawals: {
                $sum: {
                  $abs: "$amount",
                },
              },
              transactions: {
                $sum: 1,
              },
            },
          },
    ]);
    const contestPayout = await Contest.aggregate([
        {
          $match: {
            contestStatus: "Completed",
          },
        },
        {
          $unwind: {
            path: "$participants",
          },
        },
        {
          $group: {
            _id: null,
            payout: {
              $sum: {
                $ifNull: ["$participants.payout", 0],
              },
            },
          },
        },
    ]);
    const tenxPayout = await TenX.aggregate([
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $group: {
            _id: null,
            payout: {
              $sum: {
                $ifNull: ["$users.payout", 0],
              },
            },
          },
        },
    ]);
    const marginxPayout = await MarginX.aggregate([
        {
          $match: {
            status: "Completed",
          },
        },
        {
          $unwind: {
            path: "$participants",
          },
        },
        {
          $group: {
            _id: null,
            payout: {
              $sum: {
                $ifNull: ["$participants.payout", 0],
              },
            },
          },
        },
    ]);
    const internsPayout = await Internship.aggregate([
        {
          $match: {
            batchStatus: "Completed",
          },
        },
        {
          $unwind: {
            path: "$participants",
          },
        },
        {
          $group: {
            _id: null,
            payout: {
              $sum: {
                $ifNull: ["$participants.payout", 0],
              },
            },
          },
        },
    ]);
    const contestsConducted = await Contest.aggregate([
        {
          $match: {
            contestStatus: "Completed",
          },
        },
        {
          $group: {
            _id: {
              contestFor: "$contestFor",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            contestFor: "$_id.contestFor",
            count: 1,
          },
        },
    ]);
    const tenxSubscriptions = await TenX.aggregate([
        {
          $unwind: {
            path: "$users",
          },
        },
        {
          $group: {
            _id: null,
            users: {
              $sum: 1,
            },
          },
        },
    ]);
    const interns = await Internship.aggregate([
        {
          $unwind: {
            path: "$participants",
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
    ]);

   
    const totalSignups = userSignUps + careerApplications;
    const totalTradedVolume =  tenxTradeVolume[0]?.lots + virtualTradeVolume[0]?.lots + internshipTradeVolume[0]?.lots
    const totalTradedTurnover =  tenxTradeVolume[0]?.amount + virtualTradeVolume[0]?.amount + internshipTradeVolume[0]?.amount
    const totalTrades = tenxTradeVolume[0]?.trades + virtualTradeVolume[0]?.trades + internshipTradeVolume[0]?.trades
    const totalWithdrawals = withdrawals[0]?.withdrawals
    const totalTransactions = withdrawals[0]?.transactions
    const payouts = contestPayout[0]?.payout + tenxPayout[0]?.payout + marginxPayout[0]?.payout + internsPayout[0]?.payout
    const collegeContestConducted = contestsConducted.find(item => item.contestFor === 'College')?.count;
    const totalContestConducted = contestsConducted.find(item => item.contestFor === 'StoxHero')?.count + collegeContestConducted;
    const tenxSubscriptionsBought = tenxSubscriptions[0]?.users
    const internsCount = interns[0]?.count
    res.status(200).json({status:'success', data:{totalSignups, totalTradedVolume, totalTrades, totalTradedTurnover, payouts, tenxSubscriptionsBought, internsCount, collegeContestConducted, totalContestConducted, withdrawalProcessedAmount:totalWithdrawals, totalTransactions:totalTransactions}});

});


module.exports = router;