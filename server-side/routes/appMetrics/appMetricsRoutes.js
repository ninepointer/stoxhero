const express = require("express");
const router = express.Router();
const UserSignUp = require('../../models/User/signedUpUser');
const CareerApplication = require('../../models/Careers/careerApplicationSchema');
const InfinityTrade = require('../../models/mock-trade/infinityTrader');
const PaperTrade = require('../../models/mock-trade/paperTrade');
const InternshipTrade = require('../../models/mock-trade/internshipTrade');
const TenxTrade= require('../../models/mock-trade/tenXTraderSchema');

router.get('/', async(req,res,next)=>{
    const userSignUps = await UserSignUp.countDocuments();
    const careerApplications = await CareerApplication.countDocuments();

    const infinityTradeVolume = await InfinityTrade.aggregate([
        {
            $group:{
                _id:null,
                lots:{
                    $sum:{$abs:"$Quantity"}
                },
                trades:{
                    $sum: 1
                }
            }
        }
    ]);
    const virtualTradeVolume = await PaperTrade.aggregate([
        {
            $group:{
                _id:null,
                lots:{
                    $sum:{$abs:"$Quantity"}
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
                trades:{
                    $sum: 1
                }
            }
        }
    ]);

    const totalSignups = userSignUps + careerApplications;
    const totalTradedVolume = infinityTradeVolume[0]?.lots+ tenxTradeVolume[0]?.lots + virtualTradeVolume[0]?.lots + infinityTradeVolume[0]?.lots
    const totalTrades = infinityTradeVolume[0]?.trades+ tenxTradeVolume[0]?.trades + virtualTradeVolume[0]?.trades + infinityTradeVolume[0]?.trades
    
    res.status(200).json({status:'success', data:{totalSignups, totalTradedVolume, totalTrades, totalWalletTransactions:14038}});

});


module.exports = router;