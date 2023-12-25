const AppSettings = require('../models/settings/setting');
// const User = require('../models/User/userDetailSchema');
// const { ObjectId } = require('mongodb');
const Holiday = require("../models/TradingHolidays/tradingHolidays")


exports.isAppLive = async(req,res,next) => {
    // const idsToSearch = [new ObjectId("63987453e88caa645cc98e44"), new ObjectId("63788f7591fc4bf629de6e59")]
    // const user = await User.findOne(new ObjectId(req?.user?._id));
    // let isPermitted;
    try{
        if(req?.user?._id.toString() == "63788f3991fc4bf629de6df0" || req?.user?._id.toString() == "63987453e88caa645cc98e44" || req?.user?._id.toString() == "63788f7591fc4bf629de6e59"){
            return next();
        }

        const appSettings = await AppSettings.find();
        if(appSettings.length>0 && !appSettings[0].isAppLive){
            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const dayOfWeek = currentTime.getDay();

            const startTimeOfToday = new Date(currentTime);
            startTimeOfToday.setHours(0, 0, 0, 0);

            // Set the time to the beginning of the next day (midnight)
            const startTimeOfTomorrow = new Date(currentTime);
            startTimeOfTomorrow.setDate(currentTime.getDate() + 1);
            startTimeOfTomorrow.setHours(0, 0, 0, 0);
            const holiday = await Holiday.find({$gt: new Date(startTimeOfToday), $lt: new Date(startTimeOfTomorrow)});

            // Check if it's Saturday or Sunday
            if (dayOfWeek === 0 || dayOfWeek === 6 || holiday.length > 0) {
                return res.status(401).send({ message: "Market is currently closed. Please take trade during market hours." });
            }

            // Check if the current time is between 9:15 and 15:30
            if ((hours > 3 || (hours === 3 && minutes >= 50)) && (hours < 9 || (hours === 9 && minutes <= 50))) {
                return res.status(401).send({message: "Something went wrong."}) ;
            } else{
                return res.status(401).send({message: "Market is currently closed. Please take trade during market hours."}) ;
            }
            
        }else{
            next();
        }
    }catch(e){
        console.log(e);
    }
}

exports.isInfinityLive = async(req,res,next) => {
    // const user = await User.findOne(new ObjectId(req?.user?._id));
    // let isPermitted;
    // console.log("restrict", req?.user?._id.toString())
    try{
        if(req?.user?._id.toString() == "63987453e88caa645cc98e44" || req?.user?._id.toString() == "63788f7591fc4bf629de6e59"){
            return next();
        }
        
        const appSettings = await AppSettings.find();
        if(appSettings.length>0 && !appSettings[0].infinityLive){
            return res.status(401).send({message: "Something went wrong."}) ;
        }else{
            next();
        }
    }catch(e){
        console.log(e);
    }
}