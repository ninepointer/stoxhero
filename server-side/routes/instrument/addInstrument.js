const express = require("express");
const router = express.Router();
require("../../db/conn");
const Instrument = require("../../models/Instruments/instrumentSchema");
// const axios = require('axios');
// const fetchToken = require("../../marketData/generateSingleToken");
// const RequestToken = require("../../models/Trading Account/requestTokenSchema");
// const Account = require("../../models/Trading Account/accountSchema");
const { unSubscribeTokens, subscribeSingleToken} = require('../../marketData/kiteTicker');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")
const client = require("../../marketData/redisClient");
const ObjectId = require('mongodb').ObjectId;
const {subscribeSingleXTSToken, unSubscribeXTSToken} = require("../../services/xts/xtsMarket")

router.post("/addInstrument",authentication, async (req, res)=>{
      
    const {_id} = req.user;

    try{
        let {instrument, exchange, symbol, status, uId, lotSize, contractDate, maxLot, instrumentToken, accountType, exchangeSegment} = req.body;

        console.log("contractDate", exchangeSegment, Number(exchangeSegment))
        if(!instrument || !exchange || !symbol || !status || !uId || !lotSize || !instrumentToken || !accountType){
            if(!instrumentToken){
                return res.status(422).json({error : "Please enter a valid Instrument."})
            }

            return res.status(422).json({error : "Any of one feild is incorrect..."})
        }
    
        Instrument.findOne({instrumentToken : instrumentToken, status: "Active"})
        .then(async (dataExist)=>{
            if(dataExist){
                //console.log("data already");
                // return res.status(422).json({error : "date already exist..."})
                let getInstruments = await User.findOne({_id : _id});
                getInstruments.watchlistInstruments.push(dataExist._id)
                const updateInstrument = await User.findOneAndUpdate({_id : _id}, {
                    $set:{ 
                        
                        watchlistInstruments: getInstruments.watchlistInstruments
                    }
                    
                })
                try{
                    console.log((_id).toString(), instrumentToken)
                    // const redisClient = await client.LPUSH((_id).toString(), (instrumentToken).toString());
                    const newredisClient = await client.SADD((_id).toString(), (instrumentToken).toString());
                    console.log("this is redis client", newredisClient);

                    if(await client.exists(`${req.user._id.toString()}: instrument`)){
                        let instrument = await client.LPUSH(`${req.user._id.toString()}: instrument`, JSON.stringify({
                            _id: dataExist._id,
                            instrument: dataExist.instrument,
                            exchange: dataExist.exchange,
                            symbol: dataExist.symbol ,
                            status: dataExist.status ,
                            lotSize: dataExist.lotSize ,
                            instrumentToken: dataExist.instrumentToken ,
                            contractDate: dataExist.contractDate ,
                            maxLot: dataExist.maxLot ,
                            accountType: dataExist.accountType
                          }))                
                    }
    
                } catch(err){
                    console.log(err)
                }
                res.status(422).json({message : "Instrument Added"})
                return;
            }
            const addingInstruments = new Instrument({instrument, exchange, symbol, status, 
                uId, createdBy: _id, lastModifiedBy: _id, lotSize, instrumentToken, 
                contractDate, maxLot, accountType, exchangeSegment: Number(exchangeSegment)});
            //console.log("instruments", instruments)
            addingInstruments.save().then(async()=>{

                try{
                    console.log((_id).toString(), instrumentToken)
                //  const redisClient = await client.LPUSH((_id).toString(), (instrumentToken).toString());
                 const newredisClient = await client.SADD((_id).toString(), (instrumentToken).toString());

                //  console.log("this is redis client", newredisClient)

                if(await client.exists(`${req.user._id.toString()}: instrument`)){
                    let instrument = await client.LPUSH(`${req.user._id.toString()}: instrument`, JSON.stringify({
                        _id: addingInstruments._id,
                        instrument: addingInstruments.instrument,
                        exchange: addingInstruments.exchange,
                        symbol: addingInstruments.symbol ,
                        status: addingInstruments.status ,
                        lotSize: addingInstruments.lotSize ,
                        instrumentToken: addingInstruments.instrumentToken ,
                        contractDate: addingInstruments.contractDate ,
                        maxLot: addingInstruments.maxLot ,
                        accountType: addingInstruments.accountType
                      }))
                }

                } catch(err){
                    console.log(err)
                }
                
                 await subscribeSingleToken(instrumentToken);//TODO toggle
                 await subscribeSingleXTSToken(instrumentToken, Number(exchangeSegment))
                 let getInstruments = await User.findOne({_id : _id});
                 getInstruments.watchlistInstruments.push(addingInstruments._id)
                 const updateInstrument = await User.findOneAndUpdate({_id : _id}, {
                     $set:{ 
                         
                         watchlistInstruments: getInstruments.watchlistInstruments
                     }
                     
                 })
                res.status(201).json({message : "Instrument Added"});
            }).catch((err)=> res.status(500).json({err: err, error:"Failed to enter data"}));
        }).catch(err => {console.log( "fail")});

    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        res.status(500).json({error:err});
        return new Error(err);
    }
})

router.post("/subscribeInstrument",authentication, async (req, res)=>{

    const {instrumentToken} = req.body;

    try{
        await subscribeSingleToken(instrumentToken);
        console.log("subscribed", instrumentToken)
        res.status(200).json({message: "subscribed"});
    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        // res.status(500).json({error:err});
        return new Error(err);
    }
})

router.post("/unsubscribeInstrument",authentication, async (req, res)=>{

    const {instrumentToken} = req.body;

    try{
        await unSubscribeTokens(instrumentToken);
        console.log("unsubscribed", instrumentToken)
        res.status(200).json({message: "unSubscribed"});
    } catch(err) {
        // res.status(500).json({error:"Failed to enter data Check access token"});
        // res.status(500).json({error:err});
        return new Error(err);
    }
})

router.patch("/inactiveInstrument/:instrumentToken", authentication, async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{ 
        const {instrumentToken} = req.params
        const {isAddedWatchlist} = req.body;
        const {_id} = req.user;
        console.log("in removing", instrumentToken, _id);
        const user = await User.findOne({_id: _id});
        const removeFromWatchlist = await Instrument.findOne({instrumentToken : instrumentToken, status: "Active"})
        let index = user.watchlistInstruments.indexOf(removeFromWatchlist._id); // find the index of 3 in the array
        console.log("index", index)
        if (index !== -1) {
            try{
            //  const redisClient = await client.LREM((_id).toString(), 1, (instrumentToken).toString());
             const removeInstrument = await client.LREM(`${(_id).toString()}: instrument`, 1, JSON.stringify({
                _id: removeFromWatchlist._id,
                instrument: removeFromWatchlist.instrument,
                exchange: removeFromWatchlist.exchange,
                symbol: removeFromWatchlist.symbol ,
                status: removeFromWatchlist.status ,
                lotSize: removeFromWatchlist.lotSize ,
                instrumentToken: removeFromWatchlist.instrumentToken ,
                contractDate: removeFromWatchlist.contractDate ,
                maxLot: removeFromWatchlist.maxLot,
                accountType: removeFromWatchlist.accountType
              }))

              console.log("redisClient", removeInstrument)
              const redisClient = await client.SREM((_id).toString(), (instrumentToken).toString());
              user.watchlistInstruments.splice(index, 1); // remove the element at the index

             

            } catch(err){
                console.log(err)
            }
            // client.LREM(_id, 1, instrumentToken);
        }

        const removing = await User.findOneAndUpdate({_id: _id}, {
            $set:{ 
                
                watchlistInstruments: user.watchlistInstruments
            }
            
        })
        // console.log("removing", removing);
        // res.send(inactiveInstrument)
        res.status(201).json({message : "data patch succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.get("/instrumentDetails", authentication, async (req, res)=>{

    const {_id} = req.user

    try{

        if(await client.exists(`${req.user._id.toString()}: instrument`)){
            // await client.expire(`${req.user._id.toString()}: instrument`, 1)

          let instrument = await client.LRANGE(`${req.user._id.toString()}: instrument`, 0, -1)
        //   instrument = JSON.parse(instrument);
        //   console.log("instrument redis", instrument)
          const instrumentJSONs = instrument.map(instrument => JSON.parse(instrument));

          res.status(201).json({message: "instrument received", data: instrumentJSONs});
  
        } else{
  
            const user = await User.findOne({_id: _id});

            const instrument = await Instrument.find({ _id: { $in: user.watchlistInstruments }, status: "Active" })
                                .select('instrument exchange symbol status lotSize maxLot instrumentToken contractDate _id')
                                .sort({$natural:-1})

                                // console.log("instruments", instrument)
            const instrumentJSONs = instrument.map(instrument => JSON.stringify(instrument));
            console.log("instrumentJSONs", instrumentJSONs)
            if(instrumentJSONs.length > 0){
                await client.LPUSH(`${req.user._id.toString()}: instrument`, [...instrumentJSONs])
            }
            // console.log("instruments", instruments)
            res.status(201).json({message: "instruments received", data: instrument});

        }
  
      }catch(e){
          console.log(e);
          return res.status(500).json({status:'success', message: 'something went wrong.'})
      }



})


module.exports = router;

