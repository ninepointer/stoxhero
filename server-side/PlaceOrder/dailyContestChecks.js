const DailyContest = require("../models/DailyContest/dailyContest");
const MarginX = require("../models/marginX/marginX");
const Battle = require("../models/battle/battle")


exports.contestChecks = async(req,res,next) => {
    try{
        // req.body.contestId = req.body.marginxId;
        const dailyContest = await DailyContest.findById(req.body.contestId);
        const userId = req.user._id;
        if(dailyContest?.contestEndTime < new Date()){
            return res.status(201).json({ status: 'error', message: 'This TestZone has ended. Please participate in another TestZones.' });
        }

        if(dailyContest?.contestStartTime > new Date()){
            return res.status(201).json({ status: 'error', message: 'This TestZone is not started yet.' });
        }
    
        // console.log(dailyContest?.participants)
        let user = dailyContest?.participants.filter((elem)=>{
            return elem?.userId?.toString() === userId?.toString()
        })

        if(user?.length === 0){
            return res.status(404).json({ status: "error", message: "You have not participated in this TestZone."}); 
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

        if(marginx?.startTime > new Date()){
            return res.status(201).json({ status: 'error', message: 'This MarginX is not started yet.' });
        }
    
        let user = marginx?.participants.filter((elem)=>{
            // console.log(userId, elem?.userId)
            return elem?.userId?.toString() === userId?.toString()
        })

        if(user?.length === 0){
            return res.status(404).json({ status: "error", message: "You have not participated in this MarginX."}); 
        }

        next();
    }catch(e){
        console.log(e);
    }
}

exports.battleChecks = async(req,res,next) => {
    try{
        const battle = await Battle.findById(req.body.battleId);
        const userId = req.user._id;
        if(battle?.battleEndTime < new Date()){
            return res.status(201).json({ status: 'error', message: 'This Battle has ended.' });
        }

        if(battle?.battleStartTime > new Date()){
            return res.status(201).json({ status: 'error', message: 'This Battle is not started yet.' });
        }
    
        let user = battle.participants.filter((elem)=>{
            // console.log(userId, elem?.userId)
            return elem?.userId?.toString() === userId?.toString()
        })

        if(user.length === 0){
            return res.status(404).json({ status: "error", message: "You have not participated in this Battle."}); 
        }

        next();
    }catch(e){
        console.log(e);
    }
}