const Setting = require("../models/settings/setting");

exports.appLive = async()=>{
    const timmimg = await Setting.find().select('AppEndTime AppStartTime _id');
    const setting = await Setting.findOneAndUpdate({_id : timmimg[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            isAppLive: true
        }
    })
}

exports.appOffline = async()=>{
    const timmimg = await Setting.find().select('AppEndTime AppStartTime _id');
    const setting = await Setting.findOneAndUpdate({_id : timmimg[0]._id}, {
        $set:{ 
            modifiedOn: new Date(),
            isAppLive: false
        }
    })
}