const express = require("express");
const router = express.Router();
require("../../db/conn");
const TradingAlgo = require("../../models/AlgoBox/tradingAlgoSchema");
const {client, getValue} = require('../../marketData/redisClient');


router.post("/tradingalgo", (req, res)=>{
    const {algoName, transactionChange, instrumentChange, status, exchangeChange, lotMultipler, productChange, tradingAccount, lastModified, uId, createdBy, createdOn, realTrade, marginDeduction, isDefault} = req.body;

    if(!algoName || !transactionChange || !instrumentChange || !status || !exchangeChange || !lotMultipler || !productChange || !tradingAccount || !lastModified || !uId || !createdBy || !createdOn){
        //console.log(req.body);
        //console.log("data is not complete");
        return res.status(422).json({error : "plz filled the field..."})
    }

    TradingAlgo.findOne({uId : uId})
    .then(async (dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const tradingAlgo = new TradingAlgo({algoName, transactionChange, instrumentChange, 
            status, exchangeChange, lotMultipler, productChange, tradingAccount, lastModified, 
            uId, createdBy, createdOn, isRealTrade:realTrade, marginDeduction, isDefault});

            //console.log(tradingAlgo)
        tradingAlgo.save().then(async ()=>{
            await client.del('tradingAlgo');
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log("fail")});
})

router.get("/readtradingAlgo", async (req, res)=>{
    const isRedisConnected = getValue();
    if(isRedisConnected && await client.exists(`tradingAlgo`)){
        let algo = await client.get(`tradingAlgo`);
        algo = JSON.parse(algo);
        return res.status(200).send(algo);
    } else{
        const algo = await TradingAlgo.find();
        const redisAlgo = await client.set(`tradingAlgo`, JSON.stringify(algo));
        return res.status(200).send(algo);
    }
    // TradingAlgo.find((err, data)=>{
    //     if(err){
    //         return res.status(500).send(err);
    //     }else{
            
    //     }
    // }).sort({createdOn:-1})
})

router.get("/readtradingAlgo/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    TradingAlgo.findOne({_id : id}).sort({createdOn:-1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readtradingAlgo/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{
        const {id} = req.params
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{
                algoName: req.body.algo_Name,
                transactionChange: req.body.transaction_Change,
                instrumentChange: req.body.instrument_Change,
                status: req.body.Status,
                exchangeChange: req.body.exchange_Change,
                lotMultipler: req.body.lot_Multipler,
                productChange: req.body.product_Change,
                tradingAccount: req.body.trading_Account,
                lastModified: req.body.lastModified
            }
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(tradingAlgo)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/readtradingAlgo/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {realTrade} = req.body;
        //console.log(realTrade);
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                isRealTrade: realTrade
            }
            
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(tradingAlgo)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updatemargindeduction/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {marginDeduction} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                marginDeduction: marginDeduction
            }
            
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(tradingAlgo)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updatedefaultalgo/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {isDefault} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                isDefault: isDefault
            }
            
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(isDefault)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updatetransactionChange/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {transactionChange} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                transactionChange: transactionChange
            }
            
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(tradingAlgo)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updateinstrumentChange/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {instrumentChange} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                instrumentChange: instrumentChange
            }
            
        })
        //console.log("this is role", tradingAlgo);
        await client.del('tradingAlgo');
        res.send(tradingAlgo)
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updateexchangeChange/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {exchangeChange} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                exchangeChange: exchangeChange
            }
            
        })
        //console.log("this is role", tradingAlgo);
        res.send(tradingAlgo)
        await client.del('tradingAlgo');
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.patch("/updateproductChange/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const {productChange} = req.body;
        const tradingAlgo = await TradingAlgo.findOneAndUpdate({_id : id}, {
            $set:{ 
                
                productChange: productChange
            }
            
        })
        //console.log("this is role", tradingAlgo);
        res.send(tradingAlgo)
        await client.del('tradingAlgo');
        // res.status(201).json({massage : "data patch succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readtradingAlgo/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const tradingAlgo = await TradingAlgo.deleteOne({_id : id})
        //console.log("this is userdetail", tradingAlgo);
        // res.send(userDetail)
        await client.del('tradingAlgo');
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})



module.exports = router;