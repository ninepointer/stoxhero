const Activation = require('../models/campaigns/activationProgram');
const User = require('../models/User/userDetailSchema');
const {client, getValue} = require('../marketData/redisClient');
const {ObjectId} = require('mongodb');
const AffiliateTransaction = require('../models/affiliateProgram/affiliateTransactions');
const mongoose = require('mongoose');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.createActivation = async(req, res, next)=>{
    // console.log(req.body);
    const{activationSignupBonus, activationProgramName, activationProgramStartDate, 
        activationProgramEndDate, rewardPeractivation, currency,
        description, status, affiliateDetails
    } = req.body;

    if(await Activation.findOne({activationProgramName:activationProgramName})) return res.status(400).json({message:'This activation already exists.'});

    if(status == 'Live' && (await Activation.find({activationProgramEndDate:{$gte: activationProgramEndDate}})).length == 0){
      return res.status(400).json({status: 'error',message:'There is a activation program that is active in the same time.'});
    }
    const activation = await Activation.create({activationProgramName: activationProgramName.trim(), activationProgramStartDate, 
        activationProgramEndDate, rewardPeractivation, currency, affiliateDetails,
        description, lastModifiedOn: new Date(), activationSignupBonus,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Activation Program successfully created.', data:activation});    
        

}

exports.getActivations = async(req, res, next)=>{

    const activation = await Activation.find().select('_id activationProgramId activationProgramName rewardPeractivation status'); 
    
    res.status(201).json({data: activation});    
        
};

exports.getActivation = async(req, res, next)=>{
    
    const id = req.params.id
    // ? req.params.id : '';
    try{
    const activation = await Activation.findById(id); 
    // .select('_id activationProgramId activationProgramName rewardPeractivation status');
    res.status(201).json({message: "Activation Retrived",data: activation});    
    }
    catch{(err)=>{res.status(401).json({message: "err activation", error:err}); }}  
};

exports.getActiveactivation = async(req, res, next)=>{
    try{
    const activation = await Activation.find({status : 'Active'}).select('-users'); 
    res.status(201).json({message: "Activation Retrived",data: activation});    
    }
    catch{(err)=>{res.status(401).json({message: "err activation", error:err}); }}  
};

exports.getActivationName = async(req, res, next)=>{

  try{
  const activation = await Activation.find().select('activationProgramName')
  res.status(201).json({message: "Activation Retrived",data: activation});    
  }
  catch{(err)=>{res.status(401).json({message: "err activation", error:err}); }}  
};

exports.editActivation = async(req, res, next) => {
    try {
      const { id } = req.params; // ID of the contest to edit
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ status: "error", message: "Invalid ID" });
      }
      updates.lastModifiedBy = req.user._id;
      updates.lastModifiedOn = new Date();
      const result = await Activation.findByIdAndUpdate(id, updates, { new: true });

      if (!result) {
          return res.status(404).json({ status: "error", message: "Activation not found" });
      }

      res.status(200).json({
          status: 'success',
          message: "Activation updated successfully",
      });
  } catch (error) {
    console.log(error)
      res.status(500).json({
          status: 'error',
          message: "Error in updating TestZone",
          error: error.message
      });
  }
}

exports.editActivationWithId = async(req, res, next) => {
    try{ 
        const {id} = req.params;
        const {status, activationProgramEndDate, rewardPeractivation} = req.body;

        const activationProgram = await Activation.findById(id);
        if (activationProgram.users.length >0 && rewardPeractivation){
          return res.status(400).json({status: 'error', message: 'Can\'t edit reward after users have joined'});
        }


        const editactivation = await Activation.findOneAndUpdate({_id : id}, {
            $set:{ 
                status: status,
                activationProgramEndDate: activationProgramEndDate,
                rewardPeractivation: activationProgram
            }
        })
        res.status(201).json({message : "data edit succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
}

exports.getActivationLeaderboard = async(req,res,next) =>{
  let isRedisConnected = getValue();
    //If the leaderboard exisits in redis
    if(isRedisConnected && await client.exists(`activationLeaderboard:${process.env.PROD}`)){
      // console.log("in if of activation")
        const leaderBoard = await client.sendCommand(['ZREVRANGE', `activationLeaderboard:${process.env.PROD}`, "0", "19",  'WITHSCORES']);
        const transformedData = transformData(leaderBoard);

        return res.status(200).json({
            status: 'success',
            results: transformedData.length,
            data: transformedData
          });  
  
    }else{
      // console.log("in else of activation")
        //If the leaderboard doesn't exist in redis
        const leaderboard = await User.aggregate([
            {
              $unwind: "$activations"
            },
            {
              $group: {
                _id: {employeeid : "$employeeid", first_name: "$first_name", last_name: "$last_name"},
                totalactivationEarning: {
                  $sum: "$activations.activationEarning"
                },
                totalactivationCount: {
                  $count : {}
                },
              }
            },
            {
              $project:{
                _id: 0,
                user: '$_id',
                totalactivationEarning: 1,
                totalactivationCount: 1,                 
              }
            }
        ]);
          // console.log("leaderboard", leaderboard)
        for (item of leaderboard){
            const { employeeid, first_name, last_name } = item.user;
            const score = item.totalactivationEarning;
            const member = `${employeeid}:${first_name}:${last_name}:${item.totalactivationCount}`;
            await client.ZADD(`activationLeaderboard:${process.env.PROD}`, {
                score: score,
                value: member
              });
        }
        await client.expire(`activationLeaderboard:${process.env.PROD}`,60);
        const useractivationRanks = await client.sendCommand(['ZREVRANGE', `activationLeaderboard:${process.env.PROD}`, "0", "19",  'WITHSCORES']);
        // console.log("User Activation Ranks",useractivationRanks);
        const transformedData = transformData(useractivationRanks);

        return res.status(200).json({
            status: 'success',
            results: transformedData.length,
            data: transformedData
          });  

    }
    function transformData(inputArray) {
        const outputArray = [];
        // console.log("Input Array",inputArray)
        for (let i = 0; i < inputArray.length; i += 2) {
          const user = inputArray[i].split(":")[0];
          const first_name = inputArray[i].split(":")[1];
          const last_name = inputArray[i].split(":")[2];
          const activationCount = inputArray[i].split(":")[3];
          const earnings = parseInt(inputArray[i + 1]);
          const obj = { user,first_name, last_name, activationCount, earnings };
          outputArray.push(obj);
        }
        return outputArray;
      }


}

exports.getMyLeaderBoardRank = async(req,res,next) => {
    // const {id} = req.params;
    // console.log("My Leaderboard User: ",req.user)
    let isRedisConnected = getValue();
    const activationCount = req?.user?.activations?.length
    try{
      if(isRedisConnected && await client.exists(`activationLeaderboard:${process.env.PROD}`)){
        const leaderBoardRank = await client.ZREVRANK(`activationLeaderboard:${process.env.PROD}`, `${req.user.employeeid}:${req.user.first_name}:${req.user.last_name}:${activationCount}`);
        const leaderBoardScore = await client.ZSCORE(`activationLeaderboard:${process.env.PROD}`, `${req.user.employeeid}:${req.user.first_name}:${req.user.last_name}:${activationCount}`);
    
        if(leaderBoardRank !== null){
          return res.status(200).json({
            status: 'success',
            data: {rank: leaderBoardRank+1, earnings: leaderBoardScore}
          }); 
        } 
        else{
          return res.status(200).json({
            status: 'success',
            message: 'user not participated in activations yet.'
          }); 
        }

    
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

exports.getReferredProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const product = await AffiliateTransaction.aggregate([
      {
        $facet:
          {
            transaction: [
              {
                $match: {
                  affiliate: new ObjectId(
                    userId
                  ),
                  product: {$ne: new ObjectId("6586e95dcbc91543c3b6c181")}
                },
              },
              {
                $lookup: {
                  from: "user-personal-details",
                  localField: "buyer",
                  foreignField: "_id",
                  as: "buyer",
                },
              },
              {
                $lookup: {
                  from: "products",
                  localField: "product",
                  foreignField: "_id",
                  as: "product",
                },
              },
              {
                $project:
                  {
                    buyer_first_name: {
                      $arrayElemAt: [
                        "$buyer.first_name",
                        0,
                      ],
                    },
                    product_name: {
                      $arrayElemAt: [
                        "$product.productName",
                        0,
                      ],
                    },
                    _id: 0,
                    payout: "$affiliatePayout",
                    productDiscountedPrice:
                      "$productDiscountedPrice",
                    date: "$createdOn",
                    transactionId: "$transactionId"
                  },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            summery: [
              {
                $match: {
                  affiliate: new ObjectId(
                    userId
                  ),
                  product: {$ne: new ObjectId("6586e95dcbc91543c3b6c181")}
                },
              },
              {
                $group: {
                  _id: {},
                  payout: {
                    $sum: "$affiliatePayout",
                  },
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  count: 1,
                  _id: 0,
                  payout: 1,
                },
              },
            ],
          },
      },
    ])
    res.status(200).json({status: "success", data: product, message: "Data received"});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: "error", message: "Something went wrong"});
  }
}