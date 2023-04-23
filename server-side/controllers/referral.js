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
    console.log(req.body)
    const{referralProgramName, referralProgramStartDate, 
        referralProgramEndDate, rewardPerReferral, currency,
        description, status
    } = req.body;

    if(await Referral.findOne({referralProgramName:referralProgramName})) return res.status(400).json({message:'This referral already exists.'});

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
    const referral = await Referral.find({status : 'Active'}); 
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
        const {_id} = req.params;
        const {status, referralProgramEndDate} = req.body

        const editReferral = await Referral.findOneAndUpdate({_id : _id}, {
            $set:{ 
                status: status,
                referralProgramEndDate: referralProgramEndDate
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
    if(await client.exists(`referralLeaderboard`)){
        const leaderBoard = await client.sendCommand(['ZREVRANGE', `referralLeaderboard`, "0", "19",  'WITHSCORES']);
        const transformedData = transformData(leaderBoard);

        return res.status(200).json({
            status: 'success',
            results: transformedData.length,
            data: transformedData
          });  
  
    }else{
        //If the leaderboard doesn't exist in redis
        const leaderboard = await User.aggregate([
            {
              $unwind: "$referrals"
            },
            {
              $group: {
                _id: "$employeeid",
                totalReferralEarning: {
                  $sum: "$referrals.referralEarning"
                }
              }
            },
            {
                $project:{
                  _id: 0,
                  user: '$_id',
                  totalReferralEarning: 1                  
                }
              }
          ]);
          
        for (item of leaderboard){
            await client.ZADD(`referralLeaderboard`, {
                score: item.totalReferralEarning,
                value: item.user
              });
        }
        await client.expire(`referralLeaderboard`,100);
        const userReferralRanks = await client.sendCommand(['ZREVRANGE', `referralLeaderboard`, "0", "19",  'WITHSCORES']);
        // console.log(userReferralRanks);
        const transformedData = transformData(userReferralRanks);

        return res.status(200).json({
            status: 'success',
            results: transformedData.length,
            data: transformedData
          });  

    }
    function transformData(inputArray) {
        const outputArray = [];
        for (let i = 0; i < inputArray.length; i += 2) {
          const user = inputArray[i];
          const earnings = parseInt(inputArray[i + 1]);
          const obj = { user, earnings };
          outputArray.push(obj);
        }
        return outputArray;
      }


}

exports.getMyLeaderBoardRank = async(req,res,next) => {
    // const {id} = req.params;
    console.log(req.user.name)
    try{
      if(await client.exists(`referralLeaderboard`)){
        const leaderBoardRank = await client.ZREVRANK(`referralLeaderboard`, JSON.stringify({name:req.user.employeeid}));
        const leaderBoardScore = await client.ZSCORE(`referralLeaderboard`, JSON.stringify({name:req.user.employeeid}));
    
        console.log(leaderBoardRank, leaderBoardScore)
        return res.status(200).json({
          status: 'success',
          data: {rank: leaderBoardRank+1, earnings: leaderBoardScore}
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


