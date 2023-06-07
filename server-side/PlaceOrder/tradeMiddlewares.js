const AppSettings = require('../models/settings/setting');

exports.isAppLive = async(req,res,next) => {
    try{
        const appSettings = await AppSettings.find();
        if(appSettings.length>0 && !appSettings[0].isAppLive){
            return res.status(401).send({message: "App is not Live right now. Please wait."}) ;
        }else{
            next();
        }
    }catch(e){
        console.log(e);
    }
}

exports.isInfinityLive = async(req,res,next) => {
    try{
        const appSettings = await AppSettings.find();
        if(appSettings.length>0 && !appSettings[0].infinityLive){
            return res.status(401).send({message: "App is not Live right now. Please wait."}) ;
        }else{
            next();
        }
    }catch(e){
        console.log(e);
    }
}