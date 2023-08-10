const express = require("express");
const router = express.Router();
require("../../db/conn");
const Setting = require("../../models/settings/setting");
const Authentication = require("../../authentication/authentication")
const restrictTo = require('../../authentication/authorization');


router.get("/leaderboardSetting", Authentication, async (req, res)=>{
    let leaderboardTime = await Setting.find().select('leaderBoardTimming')
    return res.status(200).send(leaderboardTime);
})

router.get("/readsetting", Authentication, (req, res)=>{
    Setting.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/readsetting/:id", Authentication, (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Setting.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.patch("/applive/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        const{isAppLive, infinityLive} = req.body;
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            isAppLive, infinityLive, modifiedBy: req.user._id, modifiedOn: new Date()
        }, {new:true})
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/settings/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                leaderBoardTimming: req.body.leaderBoardTimming,
                // AppStartTime: req.body.AppStartTime,
                // AppEndTime: req.body.AppEndTime,
                infinityPrice: req.body.infinityPrice,
                maxWithdrawal:req.body.maxWithdrawal,
                minWithdrawal:req.body.minWithdrawal,
                "contest.upiId": req.body.upiId,
                "contest.email": req.body.email,
                "contest.mobile": req.body.mobile,
                "time.appStartTime": req.body.appStartTime,
                "time.timerStartTimeInStart": req.body.timerStartTimeInStart,
                "time.appEndTime": req.body.appEndTime,
                "time.timerStartTimeInEnd": req.body.timerStartTimeInEnd,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleLTP/:id", Authentication, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.ltp": req.body.ltp,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleLiveOrder/:id", restrictTo('Admin', 'SuperAdmin'), Authentication, async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.liveOrder": req.body.liveOrder,
            }
        })
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/toggleComplete/:id", restrictTo('Admin', 'SuperAdmin'), Authentication, async (req, res)=>{
    //console.log(req.params)

    try{ 
        const {id} = req.params
        console.log(id, req.body)
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                "toggle.complete": req.body.complete,
            }
        }, {new: true})
        console.log("this is role", setting);
        // res.send(setting)
        res.status(201).json({message : "Timming updated succesfully", data: setting});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})



module.exports = router;

