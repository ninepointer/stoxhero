const express = require("express");
const router = express.Router();
require("../../db/conn");
const Role = require("../../models/User/everyoneRoleSchema");
const Authenticate = require('../../authentication/authentication')
const restrictTo = require('../../authentication/authorization');


router.post("/role", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    const {roleName, status} = req.body;
    let lastModifiedBy = req.user._id;
    let createdBy = req.user._id;
    if(!roleName || !status){
        return res.status(400).json({error : "Fill all the fields"})
    }

    Role.findOne({roleName : roleName})
    .then((dataExist)=>{
        if(dataExist){
            //console.log("data already");
            return res.status(300).json({error : "Role name already exist..."})
        }
        const role = new Role({roleName, status, lastModifiedBy, createdBy});
        role.save().then(()=>{
            res.status(201).json({massage : "Role created succesfully"});
        }).catch((err)=> {
            console.log(err)
            res.status(500).json({error:"Failed to enter data"})
        });
    }).catch(err => {console.log( "fail in role auth")});
})

router.get("/role",  Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    try {
        const role = await Role.find({
            status: "Active"
        })
        .populate('createdBy', 'name')
        if (!role) {
          return res.status(200).json({ status: 'success', message: 'role not found.', data: {} });
        }
        return res.status(200).json({ status: 'success', message: 'Successful', data: role });
      } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
      }
})

router.get("/role/:id",  Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{

    const {id} = req.params
    Role.findOne({_id : id, status: "Active"})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/role/:id",  Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{

    let lastModifiedBy = req.user._id;
    try{
        const {id} = req.params
        const role = await Role.findOneAndUpdate({_id : id}, {
            $set:{ 
                roleName: req.body.roleName,
                status: req.body.status,
                lastModifiedBy: lastModifiedBy,
                lastModifiedOn: role.lastModifiedOn
            }
        })
        
        res.status(201).json({massage : "Role edited succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/role/:id",  Authenticate, restrictTo('Admin', 'SuperAdmin'), async (req, res)=>{
    
    try{
        const {id} = req.params
        const role = await Role.deleteOne({_id : id})
        
        res.status(201).json({massage : "Role deleted succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})


module.exports = router;