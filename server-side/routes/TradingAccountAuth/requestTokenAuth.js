const express = require("express");
const router = express.Router();
require("../../db/conn");
const RequestToken = require("../../models/Trading Account/requestTokenSchema");
const {disconnectTicker, createNewTicker}  = require('../../marketData/kiteTicker');
const getKiteCred = require('../../marketData/getKiteCred');
const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
// const totp = require("totp-generator");
const zerodhaLogin = require("../../utils/zerodhaAutoLogin");
const authentication = require("../../authentication/authentication");
const client = require("../../marketData/redisClient");
const {deletePnlKey} = require("../../controllers/deletePnlKey");
const {xtsInteractive} = require("../../services/xts/xtsInteractive");
const {xtsAccountType, zerodhaAccountType} = require("../../constant");
const { ObjectId } = require("mongodb");

router.post("/requestToken", authentication, (req, res)=>{

    const {accountId, accessToken, requestToken, status, accountType} = req.body;

    if(!accountId || !accessToken || !status || !accountType){
        return res.status(422).json({error : "Please fill all fields"})
    }

    // RequestToken.findOne({accessToken : accessToken})
    // .then((accountIdExist)=>{
    //     if(accountIdExist){
    //         //console.log("accountId already");
    //         return res.status(422).json({error : "Access Token already exist..."})
    //     }
    // }).catch(err => {console.log("fail in accesstoken auth")});
    const requestTokens = new RequestToken({accountId, accessToken, requestToken, status, lastModifiedBy: req.user._id, createdBy: req.user._id, accountType});

    requestTokens.save().then(async ()=>{

        await client.del(`kiteCredToday:${process.env.PROD}`);
        disconnectTicker();
        getKiteCred.getAccess().then((data) => {
            //console.log(data);
            createNewTicker(data.getApiKey, data.getAccessToken);
        });
        
        res.status(201).json({massage : "data enter succesfully"});
    }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));

    
})

router.post("/autologin", authentication, async (req, res)=>{
    await client.del(`kiteCredToday:${process.env.PROD}`);
    // await deletePnlKey();
    await client.del(`referralLeaderboard:${process.env.PROD}`);
    const {accountId, apiKey, apiSecret, status, uId} = req.body;
    req.body.createdBy = req.user._id;
    if(!accountId || !apiKey || !apiSecret || !status || !uId){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Please Fill all Fields."})
    }
    let password = accountId === process.env.KUSH_ACCOUNT_ID && process.env.KUSH_PASS

    try{

        const login = zerodhaLogin(
            apiKey,
            apiSecret,
            accountId,
            password,
            // `${token}`,
            req,
            res
            )

    } catch(err){
        return new Error(err);
    }
})

router.get("/autoLoginXTS", authentication, async (req, res)=>{

    const data = await xtsInteractive();

    const token = data.result.token;
    const accountId = data.result.userID;
    const accountType = xtsAccountType;

    const requestTokens = new RequestToken({accountId, accessToken: token, status: "Active", lastModifiedBy: new ObjectId(req.user._id), createdBy: new ObjectId(req.user._id), accountType});

    requestTokens.save().then(async ()=>{
        res.status(201).json({massage : "xts-Token enter succesfully"});
    }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
})

router.get("/readRequestToken", (req, res)=>{
    RequestToken.find({accountType: zerodhaAccountType}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/xtsTokenActive", async (req, res)=>{
    const token = await RequestToken.find({status: "Active", accountType: xtsAccountType}).sort({$natural: -1})
    res.status(200).send({status: "success", data: token, result: token.length});
})

router.get("/xtsTokenInactive", async (req, res)=>{
    const token = await RequestToken.find({status: "Inactive", accountType: xtsAccountType}).sort({$natural: -1})
    res.status(200).send({status: "success", data: token, result: token.length});

})

router.get("/readRequestToken/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    RequestToken.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{
        const {id} = req.params
        const requestToken = await RequestToken.findOneAndUpdate({_id : id}, {
            $set:{
                accountId: req.body.AccountID,
                accessToken: req.body.AccesToken,
                requestToken: req.body.RequestToken,
                status: req.body.Status,
                lastModified: req.body.lastModified
            }
        });
        disconnectTicker();
        getKiteCred.getAccess().then((data) => {
            //console.log(data);
            createNewTicker(data.getApiKey, data.getAccessToken);
        });
        
        //console.log("this is role", requestToken);
        res.send(requestToken)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const requestToken = await RequestToken.deleteOne({_id : id})
        //console.log("this is userdetail", requestToken);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

router.patch("/inactiveRequestToken/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ // Broker, AccountID, AccountName, APIKey, APISecret, Status, lastModified
        const {id} = req.params
        const account = await RequestToken.findOneAndUpdate({_id : id}, {
            $set:{
                status: req.body.status,
                lastModified: req.body.lastModified
            }
        })
        //console.log("this is role", account);
        res.send(account)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/changeStatus/:id", authentication, async (req, res)=>{
    try{
        const {id} = req.params

        const account = await RequestToken.findOneAndUpdate({_id : id}, {
            $set:{
                status: req.body.status,
                lastModifiedOn: new Date(),
                lastModifiedBy: new ObjectId(req.user._id)
            }
        })
        //console.log("this is role", account);
        res.send(account)
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})


module.exports = router;



