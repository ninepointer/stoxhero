const express = require("express");
const router = express.Router();
require("../../db/conn");
const Margin = require("../../models/marginAllocation/marginAllocationSchema");
const UserDetail = require("../../models/User/userDetailSchema");
const { default: mongoose } = require("mongoose");
// const Authentication = require("../../authentication/authentication")
const ObjectId = require('mongodb').ObjectId;
const { client, getValue } = require('../../marketData/redisClient');
const authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');

router.post("/setmargin", authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
  let isRedisConnected = getValue();
    const {amount, userId} = req.body;
    // console.log(amount, userId)
    if(!userId || !amount){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Please fill all the feilds"})
    }
    const margin = new Margin({amount, lastModifiedBy: req.user._id, userId, createdBy: req.user._id});

    margin.save().then(()=>{
        
        res.status(201).json({massage : "data enter succesfully"});
    }).catch((err)=> console.log(err, "in adding fund"));

    const userdetail = await UserDetail.findOne({_id: new ObjectId(userId)});
    let fund = (userdetail.fund ? userdetail.fund : 0);
    // console.log("fund before", fund);
    fund = Number(fund) + Number(amount);
    // console.log("fund after", fund);
   await userdetail.updateOne({fund: fund});

   if (isRedisConnected && await client.exists(`${userId.toString()} openingBalanceAndMargin`)) {
    let marginDetail = await client.get(`${userId.toString()} openingBalanceAndMargin`)
    marginDetail = JSON.parse(marginDetail);
    // console.log(marginDetail)

    marginDetail.totalFund = fund;

    await client.del(`${userId.toString()} openingBalanceAndMargin`);
    // res.status(201).json({ message: "pnl received", data: marginDetail });

  }
    
})

router.get("/getUserMarginDetails/:id", authentication, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    const {id} = req.params
    Margin.find({userId: mongoose.Types.ObjectId(id)}).sort({creditedOn: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getUserMarginDetailsAll", authentication, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    Margin.find()
    .populate('userId', 'name email')
    .populate('createdBy', 'name')
    .sort({creditedOn: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getUserTotalCreditDetails", authentication, restrictTo('Admin', 'SuperAdmin'), async(req, res)=>{
    let pnlDetails = await Margin.aggregate([
        {
          $group: {
            _id: {userId : "$userId", traderName : "$traderName"},
            totalCredit: {
              $sum: "$amount",
            },
          },
        },
        {
            $sort: {
                totalCredit : -1
            }
        }
      ])
            
       // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getUserPayInDetails/:id", authentication, restrictTo('Admin', 'SuperAdmin'), async(req, res)=>{
    const {id} = req.params; 
    dayStart = new Date(new Date().setHours(00, 00, 00));
    dayEnd = new Date(new Date().setHours(23, 59, 59));
    console.log(id,dayStart,dayEnd)
    
    let payIn = await Margin.aggregate([
        {
            $match: {
                creditedOn: {
                  $gte: dayStart,
                  $lte: dayEnd,
                },
                userId: mongoose.Types.ObjectId(id)
              }
        },
        {
          $group: {
            _id: {userId : "$userId"},
            totalCredit: {
              $sum: "$amount",
            },
          },
        },
        {
            $sort: {
                totalCredit : -1
            }
        }
      ])
            
       console.log(payIn)

        res.status(201).json(payIn);
 
})

router.get("/getTotalFundsCredited", authentication, restrictTo('Admin', 'SuperAdmin'), async(req, res)=>{ 

    let totalCredit = await Margin.aggregate([
        {
          $group: {
            _id: null,
            totalCredit: {
              $sum: "$amount",
            },
          },
        },
      ])
            
       // //console.log(totalCredit)

        res.status(201).json(totalCredit);
 
})

module.exports = router;