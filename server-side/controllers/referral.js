const Referral = require('../models/campaigns/referralProgram');
const User = require('../models/User/userDetailSchema');
const client = require('../marketData/redisClient');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

exports.createReferral = async(req, res, next)=>{
    console.log(req.body);
    const{referralProgramName, referralProgramStartDate, 
        referralProgramEndDate, rewardPerReferral, currency,
        description, status
    } = req.body;

    if(await Referral.findOne({referralProgramName:referralProgramName})) return res.status(400).json({message:'This referral already exists.'});

    if(status == 'Live' && (await Referral.find({referralProgramEndDate:{$gte: referralProgramEndDate}})).length == 0){
      return res.status(400).json({status: 'error',message:'There is a referral program that is active in the same time.'});
    }
    const referral = await Referral.create({referralProgramName, referralProgramStartDate, 
        referralProgramEndDate, rewardPerReferral, currency, 
        description, lastModifiedOn: new Date(), 
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Referral Program successfully created.', data:referral});    
        

}

exports.getReferrals = async(req, res, next)=>{

    const referral = await Referral.find().select('_id referrralProgramId referrralProgramName rewardPerReferral status'); 
    
    res.status(201).json({data: referral});    
        
};

exports.getReferral = async(req, res, next)=>{
    
    const id = req.params.id
    // ? req.params.id : '';
    try{
    const referral = await Referral.findById(id); 
    // .select('_id referrralProgramId referrralProgramName rewardPerReferral status');
    res.status(201).json({message: "Referral Retrived",data: referral});    
    }
    catch{(err)=>{res.status(401).json({message: "err referral", error:err}); }}  
};

exports.getActiveReferral = async(req, res, next)=>{
    try{
    const referral = await Referral.find({status : 'Active'}).select('_id referralProgramName rewardPerReferral currency description referrralProgramId')
    console.log(referral)
    // .select('_id referrralProgramId referrralProgramName rewardPerReferral status');
    res.status(201).json({message: "Referral Retrived",data: referral});    
    }
    catch{(err)=>{res.status(401).json({message: "err referral", error:err}); }}  
};

exports.editReferral = async(req, res, next) => {
    try{ 
        // const {referrralProgramName} = req.params
        const {status, referralProgramEndDate, referrralProgramName} = req.body
        console.log(req.body);
        // const {isAddedWatchlist} = req.body;
        // const {_id} = req.user;
        // console.log("in removing", instrumentToken, _id);
        // const user = await User.findOne({_id: _id});
        // const editReferral = await Referral.findOne({referrralProgramName : referrralProgramName})
        // let index = user.watchlistInstruments.indexOf(removeFromWatchlist._id); // find the index of 3 in the array
        // console.log("index", index)
        // if (index !== -1) {
        //     user.watchlistInstruments.splice(index, 1); // remove the element at the index
        //     try{
        //      const redisClient = await client.LREM((_id).toString(), 1, (instrumentToken).toString());

        //     } catch(err){
        //         console.log(err)
        //     }
        //     // client.LREM(_id, 1, instrumentToken);
        // }

        const editReferral = await Referral.findOneAndUpdate({referrralProgramName : referrralProgramName}, {
            $set:{ 
                status: status,
                referralProgramEndDate: referralProgramEndDate
            }
            
        })
        console.log("removing", editReferral);
        // res.send(inactiveInstrument)
        res.status(201).json({message : "programme edited succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
}

exports.editReferralWithId = async(req, res, next) => {
    try{ 
        const {id} = req.params;
        const {status, referralProgramEndDate, rewardPerReferral} = req.body;

        const referralProgram = await Referral.findById(id);
        if (referralProgram.users.length >0 && rewardPerReferral){
          return res.status(400).json({status: 'error', message: 'Can\'t edit reward after users have joined'});
        }


        const editReferral = await Referral.findOneAndUpdate({_id : id}, {
            $set:{ 
                status: status,
                referralProgramEndDate: referralProgramEndDate,
                rewardPerReferral: referralProgram
            }
        })
        res.status(201).json({message : "data edit succesfully"});
    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
}

exports.getReferralLeaderboard = async(req,res,next) =>{
    
    //If the leaderboard exisits in redis
    if(await client.exists(`referralLeaderboard:${process.env.PROD}`)){
      console.log("in if of referral")
        const leaderBoard = await client.sendCommand(['ZREVRANGE', `referralLeaderboard:${process.env.PROD}`, "0", "19",  'WITHSCORES']);
        const transformedData = transformData(leaderBoard);

        return res.status(200).json({
            status: 'success',
            results: transformedData.length,
            data: transformedData
          });  
  
    }else{
      console.log("in else of referral")
        //If the leaderboard doesn't exist in redis
        const leaderboard = await User.aggregate([
            {
              $unwind: "$referrals"
            },
            {
              $group: {
                _id: {employeeid : "$employeeid", first_name: "$first_name", last_name: "$last_name"},
                totalReferralEarning: {
                  $sum: "$referrals.referralEarning"
                },
                totalReferralCount: {
                  $count : {}
                },
              }
            },
            {
              $project:{
                _id: 0,
                user: '$_id',
                totalReferralEarning: 1,
                totalReferralCount: 1,                 
              }
            }
        ]);
          console.log("leaderboard", leaderboard)
        for (item of leaderboard){
            const { employeeid, first_name, last_name } = item.user;
            const score = item.totalReferralEarning;
            const member = `${employeeid}:${first_name}:${last_name}:${item.totalReferralCount}`;
            await client.ZADD(`referralLeaderboard:${process.env.PROD}`, {
                score: score,
                value: member
              });
        }
        await client.expire(`referralLeaderboard:${process.env.PROD}`,60);
        const userReferralRanks = await client.sendCommand(['ZREVRANGE', `referralLeaderboard:${process.env.PROD}`, "0", "19",  'WITHSCORES']);
        // console.log("User Referral Ranks",userReferralRanks);
        const transformedData = transformData(userReferralRanks);

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
          const referralCount = inputArray[i].split(":")[3];
          const earnings = parseInt(inputArray[i + 1]);
          const obj = { user,first_name, last_name, referralCount, earnings };
          outputArray.push(obj);
        }
        return outputArray;
      }


}

exports.getMyLeaderBoardRank = async(req,res,next) => {
    // const {id} = req.params;
    // console.log("My Leaderboard User: ",req.user)
    const referralCount = req?.user?.referrals?.length
    try{
      if(await client.exists(`referralLeaderboard:${process.env.PROD}`)){
        const leaderBoardRank = await client.ZREVRANK(`referralLeaderboard:${process.env.PROD}`, `${req.user.employeeid}:${req.user.first_name}:${req.user.last_name}:${referralCount}`);
        const leaderBoardScore = await client.ZSCORE(`referralLeaderboard:${process.env.PROD}`, `${req.user.employeeid}:${req.user.first_name}:${req.user.last_name}:${referralCount}`);
    
        console.log("My Leader Board: ",leaderBoardRank, leaderBoardScore)
        if(leaderBoardRank !== null){
          return res.status(200).json({
            status: 'success',
            data: {rank: leaderBoardRank+1, earnings: leaderBoardScore}
          }); 
        } 
        else{
          return res.status(200).json({
            status: 'success',
            message: 'user not participated in referrals yet.'
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