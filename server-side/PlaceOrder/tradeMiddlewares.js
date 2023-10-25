const AppSettings = require('../models/settings/setting');
const User = require('../models/User/userDetailSchema');
const { ObjectId } = require('mongodb');


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
            return res.status(401).send({message: "Something went wrong."}) ;
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