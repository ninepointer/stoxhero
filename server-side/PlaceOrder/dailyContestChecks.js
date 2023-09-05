const DailyContest = require("../models/DailyContest/dailyContest");
const MarginX = require("../models/marginX/marginX");


exports.contestChecks = async(req,res,next) => {
    try{
        // req.body.contestId = req.body.marginxId;
        console.log("req.body.contestId", req.body.contestId)
        const dailyContest = await DailyContest.findById(req.body.contestId);
        const userId = req.user._id;
        if(dailyContest?.contestEndTime < new Date()){
            return res.status(201).json({ status: 'error', message: 'This contest has ended.' });
        }
    
        console.log(dailyContest?.participants)
        let user = dailyContest?.participants.filter((elem)=>{
            console.log(userId, elem?.userId)
            return elem?.userId?.toString() === userId?.toString()
        })

        if(user.length === 0){
            return res.status(404).json({ status: "error", message: "You have not participated in this contest."}); 
        }

        next();
    }catch(e){
        console.log(e);
    }
}

exports.marginxChecks = async(req,res,next) => {
    try{
        const marginx = await MarginX.findById(req.body.contestId);
        const userId = req.user._id;
        if(marginx?.endTime < new Date()){
            return res.status(201).json({ status: 'error', message: 'This MarginX Plan has ended.' });
        }
    
        let user = marginx.participants.filter((elem)=>{
            // console.log(userId, elem?.userId)
            return elem?.userId?.toString() === userId?.toString()
        })

        if(user.length === 0){
            return res.status(404).json({ status: "error", message: "You have not participated in this MarginX."}); 
        }

        next();
    }catch(e){
        console.log(e);
    }
}