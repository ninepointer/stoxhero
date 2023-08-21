const DailyContest = require("../models/DailyContest/dailyContest");


exports.contestChecks = async(req,res,next) => {
    try{
        const dailyContest = await DailyContest.findById(req.body.contestId);
        const userId = req.user._id;
        if(dailyContest?.contestEndTime < new Date()){
            return res.status(201).json({ status: 'error', message: 'This contest has ended.' });
        }
    
        let user = dailyContest.participants.filter((elem)=>{
            // console.log(userId, elem?.userId)
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