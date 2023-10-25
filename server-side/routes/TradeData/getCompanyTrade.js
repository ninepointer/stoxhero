const express = require("express");
const { restart } = require("nodemon");
const router = express.Router();
require("../../db/conn");
const LiveCompanyTradeData = require("../../models/TradeDetails/liveTradeSchema");
const Authenticate = require('../../authentication/authentication')
const restrictTo = require('../../authentication/authorization')


router.get("/companylivetradedatatodaywithemail/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readlivetradecompanyDate", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    //console.log(todayDate)
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/updatelivetradedata", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    // let date = new Date();
    // let id = data._id;
    // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    // const {email} = req.params
    // //console.log(todayDate)
    let datatoupdate = await LiveCompanyTradeData.find()
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            //console.log(datatoupdate[i]);
            await LiveCompanyTradeData.findByIdAndUpdate(datatoupdate[i]._id, {trade_time : datatoupdate[i].order_timestamp},
                function (err, trade_time) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", trade_time);
                    }
        }).clone();
        }
})

router.get("/updatelivetradedataamount", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let datatoupdate = await LiveCompanyTradeData.find()
    //console.log(datatoupdate);


        for(let i = 0; i< datatoupdate.length; i++ ){
            ////console.log(datatoupdate[i]);
            await LiveCompanyTradeData.findByIdAndUpdate(datatoupdate[i]._id, {amount : Number(datatoupdate[i].Quantity) * datatoupdate[i].average_price},
                function (err, trade_time) {
                    if (err){
                        //console.log(err)
                    }
                    else{
                        //console.log("Trade Time : ", trade_time);
                    }
        }).clone();
        }
})

router.get("/readliveTradecompany", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    LiveCompanyTradeData.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
         
            return res.status(200).send(data);
        }
    })
})

router.get("/readliveTradecompanycount", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    LiveCompanyTradeData.count((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradecompanycountToday", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    LiveCompanyTradeData.count({order_timestamp: {$regex: todayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/readliveTradecompany/:id", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    LiveCompanyTradeData.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyemail/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    LiveCompanyTradeData.find({userId: email}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyDate", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    //console.log(todayDate)
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypariculardate/:date", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {date} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: date}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypagination/:skip/:limit", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    //console.log(req.params)
    const {limit, skip} = req.params
    LiveCompanyTradeData.find().sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanytodaydatapagination/:skip/:limit", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {limit, skip} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}}).sort({trade_time:-1}).skip(skip).limit(limit)
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanypariculardatewithemail/:date/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {date, email} = req.params
    LiveCompanyTradeData.find({order_timestamp: {$regex: date}, userId: email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyDate/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate);
    LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}, userId: {$regex: email}}).sort({trade_time:-1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisMonth", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    const {email} = req.params
    let monthStart = `${String(01).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    //console.log(todayDate)
    // LiveCompanyTradeData.find({order_timestamp: {$regex: todayDate}})
    LiveCompanyTradeData.find({trade_time: {$gte:monthStart,$lt: todayDate}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisWeek/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    let date = new Date();
    //console.log(date);
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate);

    let weekday = date.getDay();
    //console.log("Weekday"+weekday);
    
    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 2);
    //console.log(nextDay);
    let nextDate = `${(nextDay.getFullYear())}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`

    var weekStartDay = new Date(day);
    weekStartDay.setDate(day.getDate() - weekday);
    ////console.log(String(weekStartDay).slice(0,10));
    let weekStartDate = `${(weekStartDay.getFullYear())}-${String(weekStartDay.getMonth() + 1).padStart(2, '0')}-${String(weekStartDay.getDate()).padStart(2, '0')}`

    LiveCompanyTradeData.find({trade_time: {$gte:weekStartDate,$lt:nextDate}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

})

router.get("/readliveTradecompanyThisMonth/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log(todayDate);

    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    //console.log(nextDay);

    let monthStart = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    LiveCompanyTradeData.find({trade_time: {$gte:monthStart,$lt: nextDay}, userId: {$regex: email}})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/readliveTradecompanyThisYear/:email", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today Date"+todayDate);

    var day = new Date(todayDate);
    //console.log(day); // Apr 30 2000

    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    //console.log(nextDay);

    let yearStart = `${(date.getFullYear())}-01-01`
    //console.log(yearStart);
    //console.log(email);
    LiveCompanyTradeData.find({trade_time: {$gte:yearStart,$lt:nextDay}, userId:email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })

router.get("/readlivetradecompanycount", (req, res)=>{
        LiveCompanyTradeData.count((err, data)=>{
            if(err){
                return res.status(500).send(err);
            }else{
                res.json(data)
            }
        })
    })

})
router.get("/readlivetradecompanycountToday", Authenticate, restrictTo('Admin', 'Super Admin'), (req, res)=>{
    let date = new Date();
    let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

    LiveCompanyTradeData.count({order_timestamp: {$regex: todayDate}},(err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(data)
        }
    })
})

router.get("/getoverallpnllivetradecompanytoday", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            "algoBox.isDefault": true
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gettraderwisepnllivetradecompanytoday", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE", "algoBox.isDefault": true} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                // "buyOrSell": "$buyOrSell",
                                // "traderName": "$createdBy",
                                          "symbol": "$instrumentToken",
          "exchangeInstrumentToken": "$exchangeInstrumentToken",
                                "algoName": "$algoBox.algoName"
                            },
                    amount: {
                        $sum: {$multiply : ["$amount", -1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    trades: {
                        $count: {}
                    },
                    lotUsed: {
                        $sum: {$abs : {$toInt : "$Quantity"}}
                    }
                    }},
            { $sort: {_id: -1}},
        
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gettraderwisepnllivetradecompanytoday", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    console.log(todayDate)
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE", "algoBox.isDefault": true} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                          "symbol": "$instrumentToken",
          "exchangeInstrumentToken": "$exchangeInstrumentToken",
                                "algoId": "$algoBox._id",
                                "algoName": "$algoBox.algoName"
                            },
                    amount: {
                        $sum: {$multiply : ["$amount", -1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    trades: {
                        $count: {}
                    },
                    lotUsed: {
                        $sum: {$abs : {$toInt : "$Quantity"}}
                    }
                    }},
            { $sort: {_id: -1}},
        
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})


router.get("/getavgpricelivetradecompany", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}, status: "COMPLETE"} },

                    { $sort: { "trade_time": 1 }},
                   { $group:
                            {
                                _id: {
                     
                                    "product": "$Product",
                                    "symbol": "$symbol"
                                },
                                average_price: { $last: "$average_price" }
                            }
                        },
                        { $sort: { "_id": 1 }}
                    
                ]

    let getAvgPrice = await LiveCompanyTradeData.aggregate(pipeline)
            
                //console.log(getAvgPrice);

        res.status(201).json(getAvgPrice);
        
})

router.get("/getlastestlivetradecompany", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    //console.log("Inside Aggregate API - Latest Live Trade API")
    
    let date = new Date();
    const days = date.getDay();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //console.log("Today "+todayDate)
    
    let pipeline = [{ $match: { trade_time : {$regex : todayDate}} },
                    { $project: { "_id" : 0,"trade_time" : 1,  "createdBy" : 1, "buyOrSell" : 1, "Quantity" : 1, "symbol" : 1, "status" : 1  } },
                    { $sort: { "trade_time": -1 }}
                ]

    let x = await LiveCompanyTradeData.aggregate(pipeline)

        res.status(201).json(x[0]);
        
})

router.get("/getpnllivetradecompanylastfivedays", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    //console.log("Inside Aggregate API - Last 5 days chart data live pnl")
    const days = 6
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("ToDay Date :"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);

    let yesterdayDate = `${(yesterday.getFullYear())}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    let x = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte :`${yesterdayDate} 00:00:00`, $lte: `${todayDate} 23:59:59` }, status: "COMPLETE"} },
        { $group: { _id: {
                                "date": {$substr : ["$trade_time",0,10]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    }} 
                    },
        { $sort: {_id: 1}}
            ])
            
                //console.log(x);

        res.status(201).json(x);
        
})

router.get("/getpnllivetradecompanydailythismonth", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    //console.log("Inside Aggregate API - Last 5 days chart data")
    const days = 6
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    //console.log(todayDate)
    var day = new Date(todayDate);
    //console.log("ToDay Date :"+day); // Apr 30 2000

    var yesterday = new Date(day);
    yesterday.setDate(day.getDate() - days);
    //console.log("StartDate"+yesterday);

    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    let x = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte :`${yesterdayDate} 00:00:00`, $lte: `${todayDate} 23:59:59` }, status: "COMPLETE"} },
        { $group: { _id: {
                                "date": {$substr : ["$trade_time",0,10]},
                            },
                    amount: {
                        $sum: "$amount"
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    trades: {
                        $count: {}
                    }} 
                    },
        { $sort: {_id: 1}}
            ])
            
                //console.log(x);

        res.status(201).json(x);
        
})

router.get("/readlivetradecompanyagg", Authenticate, restrictTo('Admin', 'Super Admin'), async (req, res)=>{
    let date = new Date();
    let yesterdayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')-1}`
//$gte : `${todayDate} 00:00:00`, 
   let x = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time: {$lte : `${yesterdayDate} 00:00:00`} } },
        { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
        { $sort:{ _id: -1 }}
     ])

        res.status(201).json(x);
})
//{ trade_time: {$gte : `${yesterdayDate} 00:00:00`, $lte : `${yesterdayDate} 23:59:59`} }
router.get("/readlivetradecompanytodayagg", Authenticate, restrictTo('Admin', 'Super Admin'), async (req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let x = await LiveCompanyTradeData.aggregate([
         { $match: { trade_time: {$gte : `${todayDate} 00:00:00`, $lte : `${todayDate} 23:59:59`} } },
         { $project: { "createdBy": 1, "order_id": 1, "buyOrSell": 1, "Quantity": 1, "average_price": 1, "order_timestamp": 1, "symbol": 1, "Product": 1, "amount": 1, "status": 1, "algoBox.algoName": 1, "placed_by": 1 } },
         { $sort:{ _id: -1 }}
      ])
 
         res.status(201).json(x);
 })


router.get("/getoverallpnllivetradeparticularusertodaycompanyside/:email", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: email
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange"
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getLiveTradeDetailsUser/:email", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    const {email} = req.params
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            userId: email
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
      ])
    res.status(201).json(pnlDetails);
 
})


router.get("/getLiveTradeDetailsAllUser", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate
            },
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
              exchange: "$exchange",
              validity: "$validity",
              order_type: "$order_type",
              variety: "$variety",
              algoBoxName: "$algoBox.algoName",
              name: "$tradeBy",
              userId: "$userId"
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              }
            }
          }
        }
      ])
    res.status(201).json(pnlDetails);
})

router.get("/getoverallpnllivetradecompanytoday/algowisedata/:id", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    const {id} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            "algoBox._id": id
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            },
            amount: {
              $sum: {$multiply : ["$amount",-1]},
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/gettraderwisepnllivetradecompanytoday/algowisedata/:id", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    const {id} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        { $match: { trade_time : {$gte: `${todayDate} 00:00:00` , $lte: `${todayDate} 23:59:59`}, status: "COMPLETE",  "algoBox._id": id} },
        
        { $group: { _id: {
                                "traderId": "$userId",
                                "traderName": "$createdBy",
                                "symbol": "$instrumentToken"
                            },
                    amount: {
                        $sum: {$multiply : ["$amount", -1]}
                    },
                    brokerage: {
                        $sum: {$toDouble : "$brokerage"}
                    },
                    lots: {
                        $sum: {$toInt : "$Quantity"}
                    },
                    trades: {
                        $count: {}
                    },
                    lotUsed: {
                        $sum: {$abs : {$toInt : "$Quantity"}}
                    }
                    }},
            { $sort: {_id: -1}},
        
            ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/updatealgoidlive", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
  // let date = new Date();
  // let id = data._id;
  // let todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  // const {email} = req.params
  // //console.log(todayDate)
  let algoiddoc = await LiveCompanyTradeData.find()
  //console.log(datatoupdate);


      for(let i = 0; i< algoiddoc.length; i++ ){
          if(!algoiddoc[i].algoBox.isDefault && !algoiddoc[i].algoBox.marginDeduction){
          console.log(algoiddoc[i]._id);
          await LiveCompanyTradeData.findByIdAndUpdate(algoiddoc[i]._id, {'algoBox.isDefault' : true,'algoBox.marginDeduction' : false},
              function (err, algoBox) {
                  if (err){
                      console.log(err)
                  }
                  else{
                      console.log("Is Default : ", algoiddoc[i].algoBox.isDefault,algoBox);
                  }
      }).clone();
      }
  }
})

router.get("/traderwisecompanypnlLivereport/:startDate/:endDate", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
  //console.log("Inside Aggregate API - Trader wise company pnl based on date entered")
  let {startDate,endDate} = req.params
  let date = new Date();
  const days = date.getDay();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  //console.log("Today "+todayDate)
  
  let pipeline = [ {$match: {
                      trade_time : {$gte : `${startDate} 00:00:00`, $lte : `${endDate} 23:59:59`},
                      status : "COMPLETE" 
                  }
                      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                  },
                  { $group :
                          { _id: "$createdBy",
                          gpnl: {
                            $sum: {$multiply : ["$amount",-1]}
                          },
                          brokerage : {
                            $sum: {$toDouble : "$brokerage"}
                          },
                          trades : {
                            $count : {}
                          },
                  }
              },
              { $addFields: 
                  {
                      npnl: {$subtract : ["$gpnl" , "$brokerage"]}
                  }
                  },
              { $sort :
                  { npnl: -1 }
              }
              ]

  let x = await LiveCompanyTradeData.aggregate(pipeline)

      res.status(201).json(x);
      
})

router.get("/companypnlreportLive/:startDate/:endDate", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
  //console.log("Inside Aggregate API - Date wise company pnl based on date entered")
  let {startDate,endDate} = req.params
  let date = new Date();
  const days = date.getDay();
  let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  //console.log("Today "+todayDate)
  
  let pipeline = [ {$match: {
                      trade_time : {$gte : `${startDate} 00:00:00`, $lte : `${endDate} 23:59:59`},
                      status : "COMPLETE" 
                  }
                      // trade_time : {$gte : '2023-01-13 00:00:00', $lte : '2023-01-13 23:59:59'}
                  },
                  { $group :
                          { _id: {
                              "date": {$substr: [ "$trade_time", 0, 10 ]},
                          },
                  gpnl: {
                      $sum: {$multiply : ["$amount",-1]}
                  },
                  brokerage: {
                      $sum: {$toDouble : "$brokerage"}
                  },
                  trades: {
                      $count: {}
                  },
                  }
              },
              { $addFields: 
                  {
                  npnl : { $subtract : ["$gpnl","$brokerage"]},
                  dayOfWeek : {$dayOfWeek : { $toDate : "$_id.date"}}
                  }
                  },
              { $sort :
                  { _id : 1 }
              }
              ]

  let x = await LiveCompanyTradeData.aggregate(pipeline)

      res.status(201).json(x);
      
})

router.get("/getoverallpnllivetradecompanytoday/batchwisedata/:batchName", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    const {batchName} = req.params;
    // console.log( date, algoId)
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $lookup: {
            from: "user-personal-details",
            localField: "userId",
            foreignField: "email",
            as: "userDetails",
          },
        },
        {
          $project:
            {
              symbol: 1,
              Product:1,
              trade_time: 1,
              status: 1,
              instrumentToken: 1,
              amount: 1,
              buyOrSell: 1,
              Quantity: 1,
              brokerage: 1,
              average_price: 1,
              cohort: {
                $arrayElemAt: [
                  "$userDetails.cohort",
                  0,
                ],
              },
            },
        },
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            cohort: batchName,
          },
        },
        {
          $group: {
            _id: {
              symbol: "$symbol",
              product: "$Product",
              instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
            },
            amount: {
              $sum: {
                $multiply: ["$amount", -1],
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            lastaverageprice: {
              $last: "$average_price",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            

        res.status(201).json(pnlDetails);

})

router.get("/gettraderwisepnllivetradecompanytoday/batchwiseData/:batchName", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    const {batchName} = req.params;
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let pnlDetails = await LiveCompanyTradeData.aggregate([
        {
          $lookup: {
            from: "user-personal-details",
            localField: "userId",
            foreignField: "email",
            as: "userDetails",
          },
        },
        {
          $project: {
            userId: 1,
            createdBy: 1,
            trade_time: 1,
            status: 1,
            traderName: 1,
            instrumentToken: 1,
            amount: 1,
            Quantity: 1,
            brokerage: 1,
            cohort: {
              $arrayElemAt: ["$userDetails.cohort", 0],
            },
          },
        },
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
            cohort: batchName,
          },
        },
        {
          $group: {
            _id: {
              traderId: "$userId",
              traderName: "$createdBy",
              symbol: "$instrumentToken",
            },
            amount: {
              $sum: {
                $multiply: ["$amount", -1],
              },
            },
            brokerage: {
              $sum: {
                $toDouble: "$brokerage",
              },
            },
            lots: {
              $sum: {
                $toInt: "$Quantity",
              },
            },
            trades: {
              $count: {},
            },
            lotUsed: {
              $sum: {
                $abs: {
                  $toInt: "$Quantity",
                },
              },
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

router.get("/getlivetradebatchestoday", Authenticate, restrictTo('Admin', 'Super Admin'), async(req, res)=>{
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    let batchDetails = await LiveCompanyTradeData.aggregate([
        {
          $lookup: {
            from: "user-personal-details",
            localField: "userId",
            foreignField: "email",
            as: "userDetails",
          },
        },
        {
          $project: {
            trade_time: 1,
            status: 1,
            cohort: {
              $arrayElemAt: ["$userDetails.cohort", 0],
            },
          },
        },
        {
          $match: {
            trade_time: {
              $regex: todayDate,
            },
            status: "COMPLETE",
          },
        },
        {
          $group: {
            _id: {
              cohort: "$cohort",
            },
            trades: {
              $count: {},
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ])
            
                // //console.log(pnlDetails)

        res.status(201).json(batchDetails);
 
})

module.exports = router;