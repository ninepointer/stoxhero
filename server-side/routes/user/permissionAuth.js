const express = require("express");
const router = express.Router();
require("../../db/conn");
const Permission = require("../../models/User/permissionSchema");
const Authenticate = require("../../authentication/authentication");
const { ObjectId } = require('mongodb');
const restrictTo = require('../../authentication/authorization');


router.post("/permission", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    let {userId, isTradeEnable, isRealTradeEnable, algoId} = req.body;
    //console.log(req.body)
    if(!isTradeEnable){
        isTradeEnable = false;
    }
    if(!isRealTradeEnable){
        isRealTradeEnable = false;
    }
    if(!userId  || !algoId){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Please fill all the fields..."})
    }


        const permission = new Permission({modifiedOn: new Date(), modifiedBy: req.user._id, userId, isTradeEnable, isRealTradeEnable, algoId});
        permission.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    // }).catch(err => {//console.log(err, "fail")});
})

router.get("/readpermission", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{

    let permission = await Permission.find()
    .populate('userId', 'name')
    .populate('algoId', 'algoName').sort({$natural:-1})
    // Permission.find((err, data)=>{
    //     if(err){
    //         return res.status(500).send(err);
    //     }else{
    //         return res.status(200).send(data);
    //     }
    // })
    res.status(200).send(permission)
})

router.get("/getLiveUser", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    try{
        const liveUser = await Permission.find({isRealTradeEnable : true}).populate('userId', 'first_name last_name')
        res.status(200).json({status: "success", data: liveUser, result: liveUser.length})
    } catch(err){
        res.status(500).json({status: "error", error: err})
    }
})

router.get("/readpermission/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Permission.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "data not found"})
    })
})

router.get("/readpermissionbyemail/:email", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    //console.log(req.params)
    const {email} = req.params
    Permission.findOne({userId : email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "data not found"})
    })
})

router.put("/readpermission/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{
        const {id} = req.params
        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy,
                userName: req.body.userName,
                userId: req.body.userId,
                isTradeEnable: req.body.isTradeEnable,
                algoName: req.body.algoName,
                isRealTradeEnable: req.body.isRealTradeEnable,
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/readpermission/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy,
                userName: req.body.userName,
                userId: req.body.userId,
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/readpermissionadduser/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    //console.log("this is body", req.body, id);
    try{ 
        

        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy,
                isTradeEnable: req.body.isTradeEnable,
                isRealTradeEnable: req.body.isRealTradeEnable,
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/readpermissionalgo/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                algoName: req.body.algo_Name
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readpermission/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const permission = await Permission.deleteOne({_id : id})
        //console.log("this is userdetail", permission);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

router.patch("/updatetradeenable/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    const {id} = req.params
    try{ 
        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                isTradeEnable: req.body.isTradeEnable,
            }
        })
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updaterealtradeenable/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    const {id} = req.params
    try{ 
        const permission = await Permission.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                isRealTradeEnable: req.body.isRealTradeEnable,
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updateRealTrade/:id", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    //console.log("this is body", req.body, id);
    try{ 
        const permission = await Permission.findOneAndUpdate({userId : id}, {
            $set:{ 
                modifiedOn: new Date(),
                modifiedBy: req.user._id,
                isRealTradeEnable: req.body.isRealTradeEnable,
            }
        })
        //console.log("this is role", permission);
        res.send(permission)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/getLiveUser/:algobox", Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    try{
        const {algobox} = req.params;
        const liveUser = await Permission.find({isRealTradeEnable : true, algoId: new ObjectId(algobox)}).populate('userId', 'first_name last_name')
        res.status(200).json({status: "success", data: liveUser, result: liveUser.length})
    } catch(err){
        res.status(500).json({status: "error", error: err})
    }
})


module.exports = router;