const express = require("express");
const router = express.Router();
require("../../db/conn");
const Brokerage = require("../../models/Trading Account/brokerageSchema");
const restrictTo = require('../../authentication/authorization');
const Authenticate = require('../../authentication/authentication');

router.post("/brokerage", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    const {accountType, brokerName, type, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDuty, sst, transaction, exchange, ctt, dpCharge} = req.body;
    //console.log(req.body);
    if(!brokerName || !type || !brokerageCharge || !exchangeCharge || !gst || !sebiCharge || !stampDuty || !sst || !transaction || !exchange || !ctt || !dpCharge){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    const brokerage = new Brokerage({accountType, brokerName, type, brokerageCharge, exchangeCharge, gst, sebiCharge, stampDuty, sst, transaction, exchange, ctt, dpCharge, lastModifiedBy:req.user._id, createdBy: req.user._id});

    brokerage.save().then(()=>{
        res.status(201).json({massage : "data enter succesfully"});
    }).catch((err)=> {
        console.log(err)
        res.status(500).json({error:"Failed to enter data"})
    });


    // Brokerage.findOne({uId : uId})
    // .then((dateExist)=>{
    //     if(dateExist){
    //         //console.log("data already");
    //         return res.status(422).json({error : "date already exist..."})
    //     }
    // }).catch(err => {console.log( "fail in brokerage auth")});
    
})

router.get("/readBrokerage", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    Brokerage.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readBrokerage/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Brokerage.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readBrokerage/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const brokerage = await Brokerage.findOneAndUpdate({_id : id}, {
            $set:{
                brokerName: req.body.brokerName,
                type: req.body.type,
                brokerageCharge: req.body.brokerageCharge,
                exchangeCharge: req.body.exchangeCharge,
                gst: req.body.gst,
                sebiCharge: req.body.sebiCharge,
                stampDuty: req.body.stampDuty,
                sst: req.body.sst,
                lastModifiedBy: req.user._id,
                transaction: req.body.transaction,
                exchange: req.body.exchange,
                ctt: req.body.ctt,
                dpCharge: req.body.dpCharge,
                modifiedOn: new Date(),
                accountType: req.body.accountType
            }
        }, {new: true})
        //console.log("this is role", brokerage);
        res.send(brokerage)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readBrokerage/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const brokerage = await Brokerage.deleteOne({_id : id})
        //console.log("this is userdetail", brokerage);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})



module.exports = router;