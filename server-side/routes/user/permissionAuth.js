const express = require("express");
const router = express.Router();
require("../../db/conn");
const Permission = require("../../models/User/permissionSchema");
const authentication = require("../../authentication/authentication")

router.post("/permission", authentication, (req, res)=>{
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

router.get("/readpermission", async (req, res)=>{

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

router.get("/readpermission/:id", (req, res)=>{
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

router.get("/readpermissionbyemail/:email", (req, res)=>{
    //console.log(req.params)
    const {email} = req.params
    console.log(email)
    Permission.findOne({userId : email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "data not found"})
    })
})

router.put("/readpermission/:id", async (req, res)=>{
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

router.patch("/readpermission/:id", async (req, res)=>{
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

router.patch("/readpermissionadduser/:id", async (req, res)=>{
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

router.patch("/readpermissionalgo/:id", async (req, res)=>{
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

router.delete("/readpermission/:id", async (req, res)=>{
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

router.patch("/updatetradeenable/:id", authentication, async (req, res)=>{
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

router.patch("/updaterealtradeenable/:id", authentication, async (req, res)=>{
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

router.patch("/updateRealTrade/:id", authentication, async (req, res)=>{
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


module.exports = router;

