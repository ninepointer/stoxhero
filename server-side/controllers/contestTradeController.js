const ContestTrade = require('../models/Contest/ContestTrade');
// const util = require('util');
const BrokerageDetail = require("../models/Trading Account/brokerageSchema");
const axios = require('axios')
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectId;
const Contest = require('../models/Contest/contestSchema');
const autoTrade = require('../PlaceOrder/autoTradeContestHelper')
const client = require('../marketData/redisClient');
const getKiteCred = require('../marketData/getKiteCred');
const ContestInstrument = require('../models/Instruments/contestInstrument') ;
const DummyMarketData = require('../marketData/dummyMarketData');
const singleLivePrice = require('../marketData/sigleLivePrice');
const {getFilteredTicks} = require('../marketData/dummyMarketData');

// const Portfolio = require("../models/userPortfolio/UserPortfolio");
// const axiosCookieJarSupport = require('axios-cookiejar-support').default;
// const tough = require('tough-cookie');
const userWallet = require('../models/UserWallet/userWalletSchema');
const User = require("../models/User/userDetailSchema");
const AppSetting = require('../models/settings/setting')

// Create a new CookieJar to store cookies
// const cookieJar = new tough.CookieJar();


exports.newTrade = async (req, res, next) => {

  const contestId = req.params.id;

  let {  exchange, symbol, buyOrSell, Quantity, Price, 
        Product, order_type, TriggerPrice, stopLoss, uId,
        validity, variety, createdBy, order_id,
        userId, instrumentToken, trader, portfolioId, dontSendResp} = JSON.parse(JSON.stringify(req.body));

          // tradeBy = req.user._id
          // employeeid = req.user.employeeid;
        console.log("req.body", req.body)

    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


  if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety){
      //console.log(Boolean(exchange)); //console.log(Boolean(symbol)); //console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(order_type)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
      if(!dontSendResp){
        return res.status(422).json({error : "please fill all the feilds..."})
      } else{
        return;
      }
  }

  if(buyOrSell === "SELL"){
      Quantity = "-"+Quantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try{
      
      // let liveData = await singleLivePrice(exchange, symbol)
      // console.log(liveData)
      // for(let elem of liveData){
      //     if(elem.instrument_token == instrumentToken){
      //         newTimeStamp = elem.timestamp;
      //         originalLastPriceUser = elem.last_price;
      //     }
      // }
      trade_time = new Date(newTimeStamp);


  } catch(err){
      console.log(err)
      return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
  }

  function sellBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge
  }

  let brokerageUser;

  // //console.log("3st")
  if(buyOrSell === "BUY"){
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else{
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }
  
  ContestTrade.findOne({order_id : order_id})
  .then(async (dateExist)=>{
      if(dateExist){
          ////console.log("data already");
          if(!dontSendResp){
            return res.status(422).json({error : "date already exist..."})
          } else{
            return;
          }
          
      }


      // //console.log("4st")
      const contestTrade = new ContestTrade({
          status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, contestId: contestId,
          createdBy: req.user._id,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), trade_time:trade_time, portfolioId
          
      });

      // //console.log("mockTradeDetails", mockTradeDetailsUser);

      contestTrade.save().then(async ()=>{

          const newredisClient = await client.set((`${trader.toString()} ${contestId.toString()}`), JSON.stringify(contestTrade));
          //console.log("userid check", `${trader.toString()} ${contestId.toString()} pnl`)
          if(await client.exists(`${trader.toString()} ${contestId.toString()} pnl`)){
            //console.log("in the if condition")
            let pnl = await client.get(`${trader.toString()} ${contestId.toString()} pnl`)
            pnl = JSON.parse(pnl);
            //console.log("before pnl", pnl)
            const matchingElement = pnl.find((element) => (element._id.instrumentToken === contestTrade.instrumentToken && element._id.product === contestTrade.Product ));
  
            // if instrument is same then just updating value
            if (matchingElement) {
              // Update the values of the matching element with the values of the first document
              matchingElement.amount += (contestTrade.amount * -1);
              matchingElement.brokerage += Number(contestTrade.brokerage);
              matchingElement.lastaverageprice = contestTrade.average_price;
              matchingElement.lots += Number(contestTrade.Quantity);
              //console.log("matchingElement", matchingElement)
  
            } else {
              // Create a new element if instrument is not matching
              pnl.push({
                _id: {
                  symbol: contestTrade.symbol,
                  product: contestTrade.Product,
                  instrumentToken: contestTrade.instrumentToken,
                  exchange: contestTrade.exchange,
                },
                amount: (contestTrade.amount * -1),
                brokerage: Number(contestTrade.brokerage),
                lots: Number(contestTrade.Quantity),
                lastaverageprice: contestTrade.average_price,
              });
  
            }
            
            await client.set(`${trader.toString()} ${contestId.toString()} pnl`, JSON.stringify(pnl))
            //console.log("pnl", pnl)
  
          }
          //appending documents in leaderboard
          if(await client.exists(`${contestId.toString()} allranks`)){
            let ranks = await client.get(`${contestId.toString()} allranks`)
            ranks = JSON.parse(ranks);
            //console.log("before ranks", ranks)
            const matchingUserElem = ranks.find((element) => (element.userId.instrumentToken === contestTrade.instrumentToken && element.userId.product === contestTrade.Product && (element.userId.trader).toString() === (contestTrade.trader).toString() ));
  
            if (matchingUserElem) {
              // Update the values of the matching element with the values of the first document
              matchingUserElem.totalAmount += (contestTrade.amount * -1);
              matchingUserElem.investedAmount += (contestTrade.amount >= 0 && contestTrade.amount);
              matchingUserElem.brokerage += Number(contestTrade.brokerage);
              matchingUserElem.lots += Number(contestTrade.Quantity);
              // //console.log("matchingElement", matchingElement)
  
            } else {
              // Create a new element in the array with the values of the first document
              ranks.push({
                userId: {
                  trader: contestTrade.trader,
                  employeeid: contestTrade.employeeid,
                  instrumentToken: contestTrade.instrumentToken,
                  symbol: contestTrade.symbol,
                  product: contestTrade.Product,
                },
                totalAmount: (contestTrade.amount * -1),
                investedAmount: (contestTrade.amount >= 0 && contestTrade.amount),
                brokerage: Number(contestTrade.brokerage),
                lots: Number(contestTrade.Quantity)
  
              });
  
            }
            //console.log("ranks from redis", ranks)
            await client.set(`${contestId.toString()} allranks`, JSON.stringify(ranks))
  
          } 

          //appending documents in pnl
          //console.log("above the if condition")




          //console.log("sending response");
          if(!dontSendResp){
            res.status(201).json({status: 'Complete', message: 'COMPLETE'});
          }
      }).catch((err)=> {
          //console.log("in err", err )
          // res.status(500).json({error:"Failed to enter data"})
      });
      
      // //console.log("5st")
  }).catch(err => {console.log( "fail")});  
  
  // //console.log("6st")

}

exports.takeAutoTrade = async (tradeDetails, contestId) => {

  // const contestId = req.params.id;

  let {  exchange, symbol, buyOrSell, Quantity, 
        Product, order_type, validity, variety, order_id,
        instrumentToken, trader, portfolioId, autoTrade, 
        dontSendResp} = tradeDetails;

        console.log("tradeDetails", tradeDetails)
        let createdBy ;
        if(autoTrade){
          // createdBy = new ObjectId("63ecbc570302e7cf0153370c")
          let system = await User.findOne({email: "system@ninepointer.in"})
          createdBy = system._id
          console.log("createdBy", createdBy)
        } else{
          createdBy = trader
        }
        //console.log("req.body", tradeDetails)

    const brokerageDetailBuy = await BrokerageDetail.find({transaction:"BUY"});
    const brokerageDetailSell = await BrokerageDetail.find({transaction:"SELL"});


  if(!exchange || !symbol || !buyOrSell || !Quantity || !Product || !order_type || !validity || !variety){
      ////console.log(Boolean(exchange)); ////console.log(Boolean(symbol)); ////console.log(Boolean(buyOrSell)); //console.log(Boolean(Quantity)); //console.log(Boolean(Product)); //console.log(Boolean(order_type)); //console.log(Boolean(validity)); //console.log(Boolean(variety));  //console.log(Boolean(algoName)); //console.log(Boolean(transactionChange)); //console.log(Boolean(instrumentChange)); //console.log(Boolean(exchangeChange)); //console.log(Boolean(lotMultipler)); //console.log(Boolean(productChange)); //console.log(Boolean(tradingAccount));
      if(!dontSendResp){
        console.log("Please fill all fields, autotrade");
        // return res.status(422).json({error : "please fill all the feilds..."})
      } else{
        return;
      }
  }

  if(buyOrSell === "SELL"){
      Quantity = "-"+Quantity;
  }

  //console.log("1st")
  let originalLastPriceUser;
  let newTimeStamp = "";
  let trade_time = "";
  try{
      
    //console.log("above")
      // let liveData = await singleLivePrice(exchange, symbol)
      // // //console.log(liveData)
      // for(let elem of liveData){
      //     if(elem.instrument_token == instrumentToken){
      //         newTimeStamp = elem.timestamp;
      //         originalLastPriceUser = elem.last_price;
      //     }
      // }


      trade_time = new Date(newTimeStamp);
      console.log("trade_time", trade_time)
  } catch(err){
      console.log(err)
      return new Error(err);
  }

  //console.log("2nd")

  function buyBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailBuy[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailBuy[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailBuy[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailBuy[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailBuy[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailBuy[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge;
  }

  function sellBrokerage(totalAmount){
      let brokerage = Number(brokerageDetailSell[0].brokerageCharge);
      let exchangeCharge = totalAmount * (Number(brokerageDetailSell[0].exchangeCharge) / 100);
      let gst = (brokerage + exchangeCharge) * (Number(brokerageDetailSell[0].gst) / 100);
      let sebiCharges = totalAmount * (Number(brokerageDetailSell[0].sebiCharge) / 100);
      let stampDuty = totalAmount * (Number(brokerageDetailSell[0].stampDuty) / 100);
      let sst = totalAmount * (Number(brokerageDetailSell[0].sst) / 100);
      let finalCharge = brokerage + exchangeCharge + gst + sebiCharges + stampDuty + sst;
      return finalCharge
  }

  let brokerageUser;

  // //console.log("3st")
  if(buyOrSell === "BUY"){
      brokerageUser = buyBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  } else{
      brokerageUser = sellBrokerage(Math.abs(Number(Quantity)) * originalLastPriceUser);
  }
  
  ContestTrade.findOne({order_id : order_id})
  .then((dateExist)=>{
      if(dateExist){
          console.log("data already");
          
      }


      // //console.log("4st")
      const contestTrade = new ContestTrade({
          status:"COMPLETE", average_price: originalLastPriceUser, Quantity, Product, buyOrSell,
          variety, validity, exchange, order_type: order_type, symbol, placed_by: "stoxhero",
          order_id, instrumentToken, brokerage: brokerageUser, contestId: contestId,
          createdBy: createdBy,trader: trader, amount: (Number(Quantity)*originalLastPriceUser), 
          trade_time:trade_time, portfolioId
          
      });

      // //console.log("mockTradeDetails", mockTradeDetailsUser);
      contestTrade.save().then(async ()=>{
        const newredisClient = await client.set((`${trader.toString()} ${contestId.toString()}`), JSON.stringify(contestTrade));

        if(await client.exists(`${trader.toString()} ${contestId.toString()} pnl`)){
          //console.log("in the if condition")
          let pnl = await client.get(`${trader.toString()} ${contestId.toString()} pnl`)
          pnl = JSON.parse(pnl);
          //console.log("before pnl autotrade", pnl)
          const matchingElement = pnl.find((element) => (element._id.instrumentToken === contestTrade.instrumentToken && element._id.product === contestTrade.Product ));

          // if instrument is same then just updating value
          if (matchingElement) {
            // Update the values of the matching element with the values of the first document
            matchingElement.amount += (contestTrade.amount * -1);
            matchingElement.brokerage += Number(contestTrade.brokerage);
            matchingElement.lastaverageprice = contestTrade.average_price;
            matchingElement.lots += Number(contestTrade.Quantity);
            //console.log("matchingElement autotrade", matchingElement)

          } else {
            // Create a new element if instrument is not matching
            pnl.push({
              _id: {
                symbol: contestTrade.symbol,
                product: contestTrade.Product,
                instrumentToken: contestTrade.instrumentToken,
                exchange: contestTrade.exchange,
              },
              amount: (contestTrade.amount * -1),
              brokerage: Number(contestTrade.brokerage),
              lots: Number(contestTrade.Quantity),
              lastaverageprice: contestTrade.average_price,
            });

          }
          
          await client.set(`${trader.toString()} ${contestId.toString()} pnl`, JSON.stringify(pnl))
          //console.log("pnl autotrade", pnl)

        } 
        //appending documents in leaderboard
        if(await client.exists(`${contestId.toString()} allranks`)){
          let ranks = await client.get(`${contestId.toString()} allranks`)
          ranks = JSON.parse(ranks);
          //console.log("before ranks autotarde", ranks)
          const matchingUserElem = ranks.find((element) => (element.userId.instrumentToken === contestTrade.instrumentToken && element.userId.product === contestTrade.Product && (element.userId.trader).toString() === (contestTrade.trader).toString() ));

          if (matchingUserElem) {
            // Update the values of the matching element with the values of the first document
            matchingUserElem.totalAmount += (contestTrade.amount * -1);
            matchingUserElem.investedAmount += (contestTrade.amount >= 0 && contestTrade.amount);
            matchingUserElem.brokerage += Number(contestTrade.brokerage);
            matchingUserElem.lots += Number(contestTrade.Quantity);
            // //console.log("matchingElement", matchingElement)

          } else {
            // Create a new element in the array with the values of the first document
            ranks.push({
              userId: {
                trader: contestTrade.trader,
                employeeid: contestTrade.employeeid,
                instrumentToken: contestTrade.instrumentToken,
                symbol: contestTrade.symbol,
                product: contestTrade.Product,
              },
              totalAmount: (contestTrade.amount * -1),
              investedAmount: (contestTrade.amount >= 0 && contestTrade.amount),
              brokerage: Number(contestTrade.brokerage),
              lots: Number(contestTrade.Quantity)

            });

          }
          //console.log("ranks from redis autotarde", ranks)
          await client.set(`${contestId.toString()} allranks`, JSON.stringify(ranks))

        } 

      }).catch((err)=> {
          console.log("in err autotrade", err)
          // res.status(500).json({error:"Failed to enter data"})
      });
      
      // console.log("5st")
  }).catch(err => {console.log( "fail", err)});  
  
  console.log("6st")

}

exports.checkContestTradeEligibility = async(req, res,next) => {
}

exports.currentUser = async (req, res, next) => {
    req.params.userId = req.user._id;
}

exports.getUserTrades = async(req,res,next) => {
    const{userId, id} = req.params;
    try{
        const userTrades = await ContestTrade.find({contestId: id, "participants.userId": userId});
        res.status(200).json({status:'success', data: userTrades, results: userTrades.length});
    }catch(e){
        console.log(e);
        return res.status(500).json({status: 'error', message: 'Something went wrong.'})
    }


}

exports.getContestPnl = async(req, res, next) => {
  // console.log("in get contest")
    const userId = req.user._id;
    const contestId = req.params.id;

    // console.log("contest id in redis", `${userId.toString()} ${contestId.toString()} pnl`)
    try{

        if(await client.exists(`${userId.toString()} ${contestId.toString()} pnl`)){
          let pnl = await client.get(`${userId.toString()} ${contestId.toString()} pnl`)
          pnl = JSON.parse(pnl);
          // console.log("pnl redis", pnl)

          res.status(201).json(pnl);

        } else{

          let pnlDetails = await ContestTrade.aggregate([
            {
              $match: {
                // trade_time: {
                //   $regex: today,
                // },
                status: "COMPLETE",
                trader: userId,
                contestId: new ObjectId(contestId),
                // portfolioId: new ObjectId(portfolioId)
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
          ]); 
          // console.log("pnlDetails in else", pnlDetails)
          await client.set(`${userId.toString()} ${contestId.toString()} pnl`, JSON.stringify(pnlDetails))
          // console.log("pnlDetails", pnlDetails)
          res.status(201).json(pnlDetails);
        }

    }catch(e){
        console.log(e);
        return res.status(500).json({status:'success', message: 'something went wrong.'})
    }
}


exports.getContestRank = async (req, res, next) => {
    const contestId = req.params.id;
    try{

        const ranks = await ContestTrade.aggregate([
            // Match documents for the given contestId
            {
              $match: {
                contestId: new ObjectId(contestId)
              }
            },
            // Group by userId and sum the amount
            {
              $group: {
                _id: {
                  trader: "$trader",
                  // createdBy: "$createdBy",
                  instrumentToken: "$instrumentToken"
                },
                totalAmount: { $sum: "$amount" },
                investedAmount: {
                  $sum: {
                    $abs: "$amount"
                  }
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                    $sum: {$toInt : "$Quantity"}
                }
              }
            },
            // Sort by totalAmount in descending order
            {
              $sort: {
                totalAmount: -1
              }
            },
            // Project the result to include only userId and totalAmount
            {
              $project: {
                _id: 0,
                userId: "$_id",
                totalAmount: 1,
                investedAmount: 1,
                brokerage: 1,
                lots: 1
              }
            },
        ]);
        
        if(!ranks){
            return res.status(404).json({status:'error', message:'No ranking for the contest'});
        }
        
        res.status(200).json({status: 'success', results: ranks.length, data: ranks});
    }catch(e){
      console.log(e)
        res.status(500).json({status:'error', message: 'Something went wrong'});
    }
}

exports.getMyContestRank = async (req, res, next) => {
    const contestId = req.params.id;
    const userId = req.user._id;

    try{

        const ranks = await ContestTrade.aggregate([
            // Match documents for the given contestId
            {
              $match: {
                contestId: new ObjectId(contestId)
              }
            },
            // Group by userId and sum the amount
            {
              $group: {
                _id: {
                  trader: "$trader",
                  // createdBy: "$createdBy",
                  instrumentToken: "$instrumentToken"
                },
                totalAmount: { $sum: "$amount" },
                investedAmount: {
                  $sum: {
                    $abs: "$amount"
                  }
                },
                brokerage: {
                  $sum: {
                    $toDouble: "$brokerage",
                  },
                },
                lots: {
                    $sum: {$toInt : "$Quantity"}
                }
              }
            },
            // Sort by totalAmount in descending order
            {
              $sort: {
                totalAmount: -1
              }
            },
            // Project the result to include only userId and totalAmount
            {
              $project: {
                _id: 0,
                userId: "$_id",
                totalAmount: 1,
                investedAmount: 1,
                brokerage: 1,
                lots: 1
              }
            },
          ]);
        // console.log(ranks, userId)
        if(!ranks){
            return res.status(404).json({status:'error', message:'No ranking for the contest'});
        }
        const user = ranks.filter(obj => (obj.userId.trader).toString() === (userId).toString());
        const index = ranks.findIndex(obj => (obj.userId.trader).toString() === (userId).toString());
        if(index == -1){
            return res.status(404).json({status: 'error', message: 'User doesn\'t have a rank'});
        }
        
        res.status(200).json({status: 'success', data: {rank: index+1, data: user}});
    }catch(e){
        res.status(500).json({status:'error', message: 'Something went wrong'});
    }


}

exports.autoTradeContest = async(req, res, next) => {
    console.log("in autotrade", new Date())

    const now = new Date();
    const twentySecondsBeforeNow = new Date(now.getTime() - 20000); // 30 minutes * 60 seconds * 1000 milliseconds


    try {
      const contest = await Contest.findOneAndUpdate(
        {
          entryClosingDate:{
            $gte: twentySecondsBeforeNow,
            $lte: now,
          },
          // 'participants.0': { $exists: true },
          $expr: { $lt: [{$size: "$participants"}, "$minParticipants"] }
        },
        { status: 'Cancelled' },
        { new: true }
      );
      if (contest) {
        console.log(`Contest ${contest._id} status updated to ${contest.status}`);
      } else {
        console.log('No contests to update');
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    
    // const now = new Date();
    // const thirtyMinutesBeforeNow = new Date(now.getTime() - 30 * 60000); // 30 minutes * 60 seconds * 1000 milliseconds

    const today = new Date().toISOString().slice(0, 10);
    // console.log(now)
    //---------un comment it
    const contests = await Contest.find({
      contestEndDate: {
        $gte: twentySecondsBeforeNow,
        $lte: now,
      },
      status: "Live"
    }
    );
    //----------------------

    // const contests = await Contest.find({
    //   _id: new ObjectId("644f9996ac425f57423ab069")
    // }
    // );


    // console.log(contests)
    const userIds = await contests.map(async (contest) => {
      const contestStatusChanged = await Contest.findOneAndUpdate(
        {
          _id:contest._id
        },
        { status: 'Not Live' },
        { new: true }
      );
      // contest.participants.map(async (elem)=>{
      //   console.log(elem.userId, elem.portfolioId)
      //   let pnlDetails = await ContestTrade.aggregate([
      //     {
      //       $match: {
      //         status: "COMPLETE",
      //         trader: elem.userId,
      //         portfolioId: elem.portfolioId
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: {
      //           // portfolioId: "$portfolioId",
      //         },
      //         amount: {
      //           $sum: {$multiply : ["$amount",-1]},
      //         },
      //         brokerage: {
      //           $sum: {
      //             $toDouble: "$brokerage",
      //           },
      //         },
      //         lots: {
      //           $sum: {
      //             $toInt: "$Quantity",
      //           },
      //         },
      //         lastaverageprice: {
      //           $last: "$average_price",
      //         },
      //       },
      //     },
      //     {
      //       $sort: {
      //         _id: -1,
      //       },
      //     },
      //   ]);

      //   console.log(pnlDetails)
      //   await Portfolio.updateOne(
      //     { 
      //       "users.userId": elem.userId,
      //       "_id": elem.portfolioId
      //     },
      //     { 
      //       "$inc": { 
      //         "users.$.portfolioValue": pnlDetails[0].amount
      //       } 
      //     }
      //   );
      // })

      let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
      const api1Response = await axios.get(`${baseUrl}api/v1/contest/${contest._id}/trades/${"leaderboard"}`)
      const rankData = api1Response.data.data;

      const updatedContest = await Contest.updateOne(
                                { _id: contest._id },
                                { $set: { leaderboard: rankData } }
                              );

      let openTrade = await ContestTrade.aggregate([
        {
          $match:
            {
              contestId: contest._id,
              status: "COMPLETE"
            },
        },
        {
          $group:
            {
              _id: {
                portfolioId: "$portfolioId",
                symbol: "$symbol",
                instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
                trader: "$trader",
                product: "$Product",
                exchange: "$exchange",
                validity: "$validity",
                order_type: "$order_type",
                variety: "$variety",
              },
              lots: {
                $sum: {
                  $toInt: "$Quantity",
                },
              },
            },
        },
      ])
  
      
  
      // res.status(201).json(openTrade);
      await autoTrade.autoTradeHelper(openTrade, contest._id)
      return contest.participants.map(async (participant) => {
        // return for(let i = 0; i) {
          let employeeidObj = await client.get(`${(contest._id).toString()}employeeid`);
          employeeidObj = JSON.parse(employeeidObj);
    
        if(!await client.exists(`leaderboard:${contest._id}`)){
          const api1Response = await axios.get(`${baseUrl}api/v1/contest/${contest._id}/trades/${"leaderboard"}`)
          await updateParticularUserRank(contest, participant, employeeidObj);
        }
        else{
          try{
            await updateParticularUserRank(contest, participant, employeeidObj);
            await client.del(`${employeeidObj[participant.userId.toString()]} investedAmount`);

          } catch(err){
            console.log(err)
          }
        }
      });
    })

    async function updateParticularUserRank(contest, participant, employeeidObj){
      // console.log("employeeid", employeeidObj,  employeeidObj[participant.userId.toString()])

      const leaderBoardRank = await client.ZREVRANK(`leaderboard:${contest._id}`, JSON.stringify({name:employeeidObj[participant.userId.toString()]}));
      const leaderBoardScore = await client.ZSCORE(`leaderboard:${contest._id}`, JSON.stringify({name:employeeidObj[participant.userId.toString()]}));

      const investedAmount = await client.get(`${employeeidObj[participant.userId.toString()]} investedAmount`)
      let obj = {
        rank: leaderBoardRank+1,
        npnl: leaderBoardScore,
        investedAmount: Number(investedAmount)
      }

      // console.log("object", obj);
      // console.log('query filter:', { 'participants.userId': participant.userId });
      try{
       const result =  await Contest.findOneAndUpdate(
          { _id: contest._id, 'participants.userId': participant.userId },
          { $set: { 'participants.$.myRank': obj } },
          { new: true }
       );

       console.log("leaderBoardRank", leaderBoardRank+1, contest.rewards[contest.rewards.length -1].rankEnd)

       if(leaderBoardRank+1 <= contest.rewards[contest.rewards.length -1].rankEnd){
        const wallet = await userWallet.findOne({userId: participant.userId});
        for(reward of contest.rewards){
          if(leaderBoardRank+1 <= reward.rankEnd && leaderBoardRank+1 >= reward.rankStart){
            console.log("in if", reward.reward, reward)
            wallet.transactions = [...wallet.transactions, {
              title: 'Battle Credit',
              description: `Amount credited for battle ${contest.contestName}`,
              amount: reward.reward?.toFixed(2),
              transactionId: uuid.v4(),
              transactionType: reward.currency == 'INR'?'Cash':'Bonus' 
          }];
          await wallet.save();
          }
        }
      }

        // console.log(result)
        await client.del(`${employeeidObj[participant.userId.toString()]} investedAmount`)
        await client.del(`${contest._id.toString()}`)

      } catch(err){
        console.log(err)
      }

    }
    // let data = userIds;
    // console.log(data)
    res.send("ok")

}

exports.getTradeByPagination = async(req, res, next) => {
  const userId = req.user._id;
  const contestId = req.params.id;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5; // default limit of 10 trades
  console.log(skip, limit)
  try {
    const lastTrade = await ContestTrade.find({trader: userId, contestId: contestId}, {'symbol': 1, 'buyOrSell': 1, 'Product': 1, 'Quantity': 1, 'amount': 1, 'status': 1, 'average_price': 1})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit);
    console.log(lastTrade)
    res.status(200).json({status: 'success', data: lastTrade});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.countTrades = async(req, res, next) => {
  const userId = req.user._id;
  const contestId = req.params.id;
  try {
    const count = await ContestTrade.countDocuments({trader: userId, contestId: contestId})
    console.log(count)
    res.status(200).json({status: 'success', data: count});
  } catch (e) {
    console.log(e);
    res.status(500).json({status:'error', message: 'Something went wrong'});
  }
}

exports.editLeaderboard = async(req,res,next) => {
  const {id} = req.params;
  const {userData, score} = req.body;
  await client.ZADD(`contest:${id}`, score, JSON.stringify(userData));
}

exports.getLeaderBoard = async(req,res,next) => {
  const leaderBoard = await client.ZREVRANGE(`contest:${id}`, 0, 19, 'WITHSCORES');
  
  res.status(200).json({
    status: 'success',
    results: leaderBoard.length,
    data: leaderBoard
  });  

}

exports.getMyLeaderBoardRank = async(req,res, next) => {
  const {id} = req.params;
  const userData = {userId: req.user._id, name: req.user.firstName + ' '+ req.user.lastName};
  const myRank = await ZREVRANK(`contest:${id}`, JSON.stringify(userData));

  res.status(200).json({
    status: 'success',
    data: myRank,
  });
}


exports.getRedisLeaderBoard = async(req,res,next) => {
  const {id} = req.params;
  const appSetting = await AppSetting.find();


  try{
    if(!await client.exists(`${id.toString()}employeeid`)){
      let allUsers = await User.find({status: "Active"});
  
      let obj = {};
      for(let i = 0; i < allUsers.length; i++){
        obj[allUsers[i]._id.toString()] = allUsers[i].employeeid;
      }
    
      try{
        let temp = await client.set(`${id.toString()}employeeid`, JSON.stringify(obj));
    
      } catch(err){
        console.log(err)
      }
    }

    if(await client.exists(`leaderboard:${id}`)){
      // console.log("in if con")
      const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard:${id}`, "0", "19",  'WITHSCORES'])
      const formattedLeaderboard = await formatData(leaderBoard)
      console.log("app setting", appSetting[0].leaderBoardTimming)
      // console.log('cached');
      return res.status(200).json({
        status: 'success',
        results: formattedLeaderboard.length,
        data: formattedLeaderboard
      });    
    }
    else{
      //get ltp for the contest instruments
      // const contestInstruments = await Contest.findById(id).select('instruments');
      let addUrl;
      let livePrices = {};
      let dummyTesting = false;
      if(dummyTesting){
        let filteredTicks = getFilteredTicks();
        // console.log('filtered ticks received', filteredTicks);
        if(filteredTicks.length > 0){
          for (tick of filteredTicks){
            livePrices[tick.instrument_token] = tick.last_price;
          }
          // console.log(livePrices);
        }
      }else{
        const contestInstruments = await ContestInstrument.find({'contest.contestId': id}).select('instrumentToken exchange symbol');
        const data = await getKiteCred.getAccess();
        contestInstruments.forEach((elem, index) => {
          if (index === 0) {
            addUrl = ('i=' + elem.exchange + ':'+ elem.symbol);
          } else {
            addUrl += ('&i=' + elem.exchange + ':' + elem.symbol);
          }
        });
        // console.log(addUrl);
        const ltpBaseUrl = `https://api.kite.trade/quote?${addUrl}`;
        let auth = 'token' + data.getApiKey + ':' + data.getAccessToken;
  
        let authOptions = {
          headers: {
            'X-Kite-Version': '3',
            Authorization: auth,
          },
        };

        const response = await axios.get(ltpBaseUrl, authOptions);
        for (let instrument in response.data.data) {
            livePrices[response.data.data[instrument].instrument_token] = response.data.data[instrument].last_price;
        }
      }

      let ranks;

      if(await client.exists(`${id.toString()} allranks`)){
        ranks = await client.get(`${id.toString()} allranks`);
        ranks = JSON.parse(ranks);
        // console.log('ranks in redis',ranks);
      } else{

        ranks = await ContestTrade.aggregate([
          // Match documents for the given contestId
          {
            $match: {
              contestId: new ObjectId(id),
              status: "COMPLETE",
            }
          },
          // Group by userId and sum the amount
          {
            $group: {
              _id: {
                trader: "$trader",
                // employeeid: "$employeeid",
                instrumentToken: "$instrumentToken",
exchangeInstrumentToken: "$exchangeInstrumentToken",
                symbol: "$symbol",
                product: "$Product",
              },
              totalAmount: { $sum: {$multiply : ["$amount",-1]} },
              investedAmount: {
                $sum: {
                  $cond: {
                    if: { $gte: ["$amount", 0] },
                    then: "$amount",
                    else: 0
                  }
                }
              },
              brokerage: {
                $sum: {
                  $toDouble: "$brokerage",
                },
              },
              lots: {
                  $sum: {$toInt : "$Quantity"}
              }
            }
          },
          // Sort by totalAmount in descending order
      
          // Project the result to include only userId and totalAmount
          {
            $project: {
              _id: 0,
              userId: "$_id",
              totalAmount: 1,
              investedAmount: 1,
              brokerage: 1,
              lots: 1
            }
          },
          {
            $addFields: {
              rpnl: {
                $multiply: ["$lots", ]
              }
            }
          },
        ]);
        // console.log("ranks from db", ranks)
        await client.set(`${id.toString()} allranks`, JSON.stringify(ranks))

      }

      // console.log(livePrices);

      for(doc of ranks){
        // console.log('doc is', doc);
        doc.rpnl = doc.lots* livePrices[doc.userId.instrumentToken];
        doc.npnl = doc.totalAmount + doc.rpnl - doc.brokerage;
        // console.log('npnl is', doc?.npnl);
      }

    
      async function aggregateRanks(ranks) {
        const result = {};
        for (const curr of ranks) {
          const { userId, npnl, investedAmount } = curr;
          const traderId = userId.trader;
          let employeeidObj = await client.get(`${(id).toString()}employeeid`);
          employeeidObj = JSON.parse(employeeidObj);
          // console.log("employeeid", employeeidObj[traderId.toString()])
          if (!result[traderId]) {
            result[traderId] = {
              traderId,
              name: employeeidObj[traderId.toString()],
              npnl: 0,
              investedAmount: 0
            };
          }
          result[traderId].npnl += npnl;
          result[traderId].investedAmount += investedAmount
          // console.log("result", result)
        }
        return Object.entries(result).map(([key, value]) => value);
      }

      const result = await aggregateRanks(ranks);

      // console.log("rsult", result)
      for (rank of result){
        // console.log(rank);
        // console.log(`leaderboard${id}`);
        await client.set(`${rank.name} investedAmount`, rank.investedAmount);
        await client.ZADD(`leaderboard:${id}`, {
          score: rank.npnl,
          value: JSON.stringify({name: rank.name})
        });
      }
      
      // await pipeline.exec();
      console.log("app setting", appSetting[0].leaderBoardTimming)
      await client.expire(`leaderboard:${id}`, appSetting[0].leaderBoardTimming);

      const leaderBoard = await client.sendCommand(['ZREVRANGE', `leaderboard:${id}`, "0", "19",  'WITHSCORES'])
      const formattedLeaderboard = await formatData(leaderBoard)

      // console.log("formattedLeaderboard", leaderBoard, formattedLeaderboard)
      return res.status(200).json({
        status: 'success',
        results: formattedLeaderboard.length,
        data: formattedLeaderboard
      });   


    }
  }catch(e){
    console.log("redis error", e);
  }

  async function formatData(arr) {
    const formattedLeaderboard = [];
  
    for (let i = 0; i < arr.length; i += 2) {
      // Parse the JSON string to an object
      const obj = JSON.parse(arr[i]);
      // Add the npnl property to the object
      const investedAmount = await client.get(`${obj.name} investedAmount`)
      obj.npnl = Number(arr[i + 1]);
      obj.investedAmount = Number(investedAmount);
      // Add the object to the formattedLeaderboard array
      formattedLeaderboard.push(obj);
    }
  
    return formattedLeaderboard;
  }

}

exports.getRedisMyRank = async(req,res,next) => {
  const {id} = req.params;
  // console.log(req.user.name)
  try{
    if(await client.exists(`leaderboard:${id}`)){

      const leaderBoardRank = await client.ZREVRANK(`leaderboard:${id}`, JSON.stringify({name:req.user.employeeid}));
      const leaderBoardScore = await client.ZSCORE(`leaderboard:${id}`, JSON.stringify({name:req.user.employeeid}));
      const investedAmount = await client.get(`${req.user.employeeid} investedAmount`)

      // console.log(leaderBoardRank, leaderBoardScore)
      return res.status(200).json({
        status: 'success',
        data: {rank: leaderBoardRank+1, npnl: leaderBoardScore, investedAmount: investedAmount}
      }); 
  
    }else{
        res.status(200).json({
        status: 'loading',
        message:'loading rank'
      }); 
    }

  } catch(err){
    console.log(err);
  }

}

exports.getHistoryRanks = async(req,res,next) => {
  const contestId = req.params.id;
  
  let ranks = await Contest.findOne({_id: contestId}).select('leaderboard');

  while (ranks?.leaderboard?.length === 0) {
    ranks = await Contest.findOne({_id: contestId}).select('leaderboard');
  }

  // setTimeout(()=>{
    if(ranks?.leaderboard?.length !== 0){
      return res.status(200).json({
        status: 'success',
        data: ranks.leaderboard
      });
    }
  // }, 5000)
}

exports.getHistoryMyRank = async(req,res,next) => {
  const contestId = req.params.id;
  const userId = req.user._id;

  let contest = await Contest.findOne(
    { _id: contestId, 'participants.userId': userId }, 
    { 'participants.$': 1 }
  );

  while (contest?.participants?.length !== 0 && Object.keys(contest.participants[0].myRank).length === 0) {
    let contest = await Contest.findOne(
      { _id: contestId, 'participants.userId': userId }, 
      { 'participants.$': 1 }
    );
  };
  // console.log("myrank", myRank);
  // return res.status(200).json({
  //   status: 'success',
  //   data: myRank
  // });
  // setTimeout(()=>{
    if (contest?.participants?.length !== 0 && contest.participants[0]?.myRank?.rank && contest.participants[0]?.myRank?.npnl) {
      // if (contest?.participants?.length !== 0 && Object.keys(contest.participants[0].myRank).length !== 0) {
      const myRank = contest.participants[0].myRank
      console.log("sending response", myRank, contest.participants[0].myRank)
      return res.status(200).json({
        status: 'success',
        data: myRank
      });
    }
  // }, 3000)

}


